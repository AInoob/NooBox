import React from 'react';
import styled from 'styled-components';
import { Switch, Icon, Popover, Tooltip, Button, Card, Checkbox } from 'antd';


const VideoControlDiv = styled.div`
  margin-bottom : 10px;
	#help{
		height: ${props => props.displayHelp ? 'initial' : '0px'};
		overflow: hidden;
		margin: 0;
	}
	#info{
		color: grey;
		span{
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
	#switch{
	  position: relative;
    box-sizing: border-box;
    height: 22px;
    min-width: 44px;
    line-height: 20px;
    vertical-align: middle;
    border-radius: 20px;
    border: 1px solid transparent;
    background-color: rgba(0,0,0,.25);
    cursor: pointer;
	}
	
	 #popHelp{
        display:inline;
        margin-left: 10px;
        font-size: 15px;
        margin-right: 10px;
    }
    
    #videoControlHeader{
      font-size: 15px;
      margin-bottom: 8px;
      
     
    }
    #switchButton{
      margin-left:0px;
      margin-right: 60px;
      display: inline-block;
    }

    .ant-checkbox-wrapper {
      cursor: pointer;
      font-size: 13px;
      font-weight:380;
      color: black;
      display: inline-block;
    }
    #shortCut{
      display: inline-block;
    }
    
`;


class VideoControl extends React.Component {
  //constructor
  constructor(props) {

    super(props);

    let shortcuts = JSON.parse(GL('ls_16').replace(/\'/g, '"'));

    this.state = { enabled: false, websiteEnabled: true, displayHelp: false, shortcuts };

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    isOn('videoControl', () => {
      this.setState({ enabled: true });
      chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, (tabs) => {
        let url = "";

        if (tabs[0]) {
          url = tabs[0].url;
        }

        const a = document.createElement('a');
        a.href = url;
        const host = a.hostname;
        this.setState({ host });
        getDB('videoControl_website_' + host, (enabled) => {
          if (enabled == false) {
            this.setState({ websiteEnabled: false });
          }
        });
      });
    });
  }

  // change the display status by the
  toggle() {
    const websiteEnabled = !this.state.websiteEnabled;

    setDB('videoControl_website_' + this.state.host, websiteEnabled, () => {

      this.setState({ websiteEnabled });
      chrome.runtime.sendMessage({

        job: 'videoControl_website_switch',
        host: this.state.host,
        enabled: websiteEnabled,

      });
    });
  }

  render() {
    let { shortcuts } = this.state;
    shortcuts = (
      <table>
        <tbody>
          {
            Object.keys(shortcuts).map((key, index) => {
              return (
                <tr>
                  <td>&nbsp;&nbsp;&nbsp;{key}</td>
                  <td>{shortcuts[key]}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );

    if (!this.state.enabled) {
      return null;
    }

    let host = this.state.host == "iioinjnmhdpbfdpilimcmljdbejnljog" ? "" : this.state.host;
    let status = this.state.websiteEnabled ? "Close ? Click" : "Open ? Click";
    let contentHelp = (
      <div>
        {GL('ls_14')}<br /><br />
        {GL('ls_15')}<br />
      </div>
    );

    let popHelp = (
      <div id="popHelp">
        <Popover content={contentHelp} title="Help">
          <Icon type="question-circle" />
        </Popover>
      </div>
    );

    let contentShortCut = (

      <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }}>
        <div className="shortcutDiv">
          {shortcuts}
        </div>
      </Card>
    )
    let popShortCut = (
      <div id="popShortCut">
        <Popover placement="left" content={contentShortCut} >
          <Button type="dashed"> ShortCuts</Button>
        </Popover>
      </div>
    )
    return (
      <VideoControlDiv colorOn={shared.styled.colorOn} displayHelp={this.state.displayHelp} className="container">
        <h5 className="header" id="videoControlHeader">
          {GL('videoControl')}
          {popHelp}

          <div id="shortCut">
            {popShortCut}
          </div>
        </h5>

        <div id="switchButton">
          <Tooltip placement="top" title={status}>

            <Checkbox checked={this.state.websiteEnabled} onChange={() => this.toggle()}> {host} </Checkbox>

          </Tooltip>

          {/* <Tooltip placement="top" title= {status}>
              <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} onChange = {() => this.toggle()}></Switch>
            </Tooltip> */}


        </div>
      </VideoControlDiv>
    );
  }
};



export default VideoControl;