import React from 'react';
import styled from 'styled-components';

const VideoControlDiv = styled.div`
	#help{
		height: ${props => props.displayHelp? 'initial' : '0px'};
		overflow: hidden;
		margin: 0;
	}
	#info{
		font-size: 100px;
		color: grey;
		span{
			line-height: 70px;
			height: 80px;
			float: left;
			display: block;
			cursor: pointer;
			user-select: none;
		}
	}
	#indicator{
		margin-top: -20px;
		margin-bottom: 20px;
	}
	#enabled:checked + span{
		color: ${props => props.colorOn};
		margin-top: 0px;
		margin-bottom: 0px;
	}
	#shortcuts{
		td{
			padding-top: 8px;
			padding-bottom: 0px;
		}
	}
`;

module.exports = React.createClass({
  displayName: 'VideoControl',
  getInitialState: function() {
		let shortcuts = JSON.parse(GL('ls_16').replace(/\'/g,'"'));
		shortcuts = Object.keys(shortcuts).map((key) => {
			return [key, shortcuts[key]];
		});
    return { enabled: false, websiteEnabled: true, displayHelp: false, shortcuts };
  },
  componentDidMount: function() {
    isOn('videoControl', () => {
      this.setState({ enabled: true });
      chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true}, (tabs) => {
        let url = "";
        if(tabs[0]) {
					url = tabs[0].url;
				}
        const a = document.createElement('a');
        a.href = url;
        const host = a.hostname;
        this.setState({ host });
        getDB('videoControl_website_'+host, (enabled) => {
          if(enabled == false) {
            this.setState({ websiteEnabled: false });
          }
        });
      });
    });
  },
  toggle: function() {
    const websiteEnabled=!this.state.websiteEnabled;
    setDB('videoControl_website_'+this.state.host, websiteEnabled, () => {
      this.setState({ websiteEnabled });
      chrome.runtime.sendMessage({
				job: 'videoControl_website_switch',
				host: this.state.host,
				enabled: websiteEnabled,
			});
    });
  },
  render: function() {
    if(!this.state.enabled) {
      return null;
    }
    let indicator = '☁';
    if(this.state.websiteEnabled) {
      indicator = '☀';
    }
		let help, shortcuts;
		if(this.state.displayHelp) {
			shortcuts = this.state.shortcuts.map((elem, index) => {
				return <tr><td>{elem[0]}</td><td>{elem[1]}</td></tr>;
			});
			help = <p className="important" id="help">{GL('ls_14')}<br/><br/>{GL('ls_15')}<br/><table id="shortcuts">{shortcuts}</table></p>;
		}
    return (
      <VideoControlDiv colorOn={shared.styled.colorOn} displayHelp={this.state.displayHelp} className="container">
        <h5 className="header">{GL('videoControl')}<span id="helpButton" onClick={()=>{this.setState({displayHelp: !this.state.displayHelp})}}>&nbsp;(?)</span></h5>
				{help}
        <div id="info" className="container">
          <p className="important line">{this.state.host}</p>
          <input type="checkbox" id="enabled" readOnly checked={this.state.websiteEnabled} />
          <span id="indicator" onClick={this.toggle}>{indicator}</span>
        </div>
      </VideoControlDiv>);
  }
});
