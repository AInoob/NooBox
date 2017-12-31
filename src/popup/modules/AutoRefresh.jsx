import React from 'react';
import styled from 'styled-components';
import { Upload, Icon, message, Button, Popover } from 'antd';
import { Checkbox, Select } from 'antd';

const AutoRefreshDiv = styled.div`
	#help{
		height: ${props => props.displayHelp ? 'initial' : '0px'};
		overflow: hidden;
		margin: 0;
  }

  #pop{
    display:inline;
    margin-left: 10px;
    font-size: 15px;
  }
  #autoRefreshHeader{
      font-size: 15px;
      margin-bottom: 5px;
  }
`;

const content = (
  <div>
    <p id='test'>
      {GL('ls_19')}
    </p>
  </div>
);

const pop = (
  <div id="pop">
    <Popover content={content} title="Help" >
      <Icon type="question-circle" />
    </Popover>
  </div>
);


class AutoRefresh extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autoRefresh: false,
      enabled: false,
      interval: 3000,
      displayHelp: false,
      tabId: null,
    }
    this.toggle = this.toggle.bind(this);
    this.updateInterval = this.updateInterval.bind(this);
  }
  async componentDidMount() {
    const enabled = await promisedGet('autoRefresh');
    this.setState({ enabled });
    const tab = await getCurrentTab();
    if (!tab) {
      return;
    }
    const tabId = tab.id;
    this.setState({ tabId });
    chrome.runtime.sendMessage({ job: 'currentTabAutoRefreshState', tabId }, currentState => {
      if (currentState) {
        const { handler, interval } = currentState;
        this.setState({ handler, interval });
      }
    });
  }
  updateInterval(interval) {
    interval = parseInt(interval);
    const { handler } = this.state;
    if (handler) {
      const { tabId } = this.state;
      chrome.runtime.sendMessage({
        job: 'startAutoRefresh',
        interval,
        tabId
      }, () => {
        this.setState({ handler: -1, interval });
      });
    }
    else {
        this.setState({ interval });
    }
  }
  toggle(e) {
    const checked = e.target.checked;
    const { interval, tabId } = this.state;
    if (checked) {
      chrome.runtime.sendMessage({
        job: 'startAutoRefresh',
        interval,
        tabId
      }, () => {
        this.setState({ handler: -1 });
      });
    }
    else {
      chrome.runtime.sendMessage({
        job: 'stopAutoRefresh',
        tabId
      }, () => {
        this.setState({ handler: null });
      });
    }
  }
  render() {
    const { enabled, handler, interval } = this.state;
    if (!enabled) {
      return null;
    }
    return (
      <AutoRefreshDiv displayHelp={this.state.displayHelp} className="container">

        <h5 className="header" id="autoRefreshHeader">
          {GL('autoRefresh')}
          {pop}
        </h5>
        <div>
          <Checkbox checked={handler} onChange={this.toggle}>Checkbox</Checkbox>
          <Select value={interval.toString()} style={{ width: 120 }} onChange={this.updateInterval}>
            <Option value="1000">1 s</Option>
            <Option value="2000">2 s</Option>
            <Option value="3000">3 s</Option>
            <Option value="5000">5 s</Option>
            <Option value="8000">8 s</Option>
            <Option value="13000">13 s</Option>
            <Option value="21000">21 s</Option>
            <Option value="34000">34 s</Option>
            <Option value="55000">55 s</Option>
            <Option value="55000">89 s</Option>
            <Option value="144000">144 s</Option>
          </Select>
        </div>
      </AutoRefreshDiv>
    );
  }
};

export default AutoRefresh;