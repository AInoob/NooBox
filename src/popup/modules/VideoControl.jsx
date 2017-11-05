import React from 'react';
import styled from 'styled-components';

const VideoControlDiv = styled.div`
	#help{
		height: ${props => props.displayHelp? 'initial' : '0px'};
		overflow: hidden;
		margin: 0;
	}
	#info{
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
		font-size: 100px;
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

class VideoControl extends React.Component {
  constructor(props) {
    super(props);
		let shortcuts = JSON.parse(GL('ls_16').replace(/\'/g,'"'));
		shortcuts = Object.keys(shortcuts).map((key) => {
			return [key, shortcuts[key]];
		});
    this.state = { enabled: false, websiteEnabled: true, displayHelp: false, shortcuts };
    this.toggle = this.toggle.bind(this);
  }
  componentDidMount() {
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
  }
  toggle() {
    const websiteEnabled=!this.state.websiteEnabled;
    setDB('videoControl_website_'+this.state.host, websiteEnabled, () => {
      this.setState({ websiteEnabled });
      chrome.runtime.sendMessage({
				job: 'videoControl_website_switch',
				host: this.state.host,
				enabled: websiteEnabled,
			});
    });
  }
  render() {
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
				return <tr key={index}><td>{elem[0]}</td><td>{elem[1]}</td></tr>;
			});
			help = (
        <div className="important" id="help">
          {GL('ls_14')}<br/><br/>
          {GL('ls_15')}<br/>
          <table id="shortcuts"><tbody>{shortcuts}</tbody></table>
        </div>
      );
		}
    return (
      <VideoControlDiv colorOn={shared.styled.colorOn} displayHelp={this.state.displayHelp} className="container">
        <h5 className="header">{GL('videoControl')}<span className="helpButton" onClick={()=>{this.setState({displayHelp: !this.state.displayHelp})}}>&nbsp;(?)</span></h5>
				{help}
        <div id="info" className="container">
          <p className="important line">{this.state.host}</p>
          <input type="checkbox" id="enabled" readOnly checked={this.state.websiteEnabled} />
          <span id="indicator" onClick={this.toggle}>{indicator}</span>
        </div>
      </VideoControlDiv>);
  }
};

export default VideoControl;