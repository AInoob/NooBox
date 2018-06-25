import React from "react";
import { Upload, Icon, message, InputNumber,Progress } from 'antd';
import styled from "styled-components";
import FAIcon from '@fortawesome/react-fontawesome'
import faSolid from '@fortawesome/fontawesome-free-solid'
import {getCurrentTab, sendMessage} from '../../../utils/browserUtils';

const AutoRefreshContainer = styled.div`
  .ant-upload-text{
    font-size: 16px;
    margin: 0 0 4px;
    color: rgba(0,0,0,.85);
  }
  .ant-progress-bg{
    height: 2px !important;
  }
`;
const Dragger = Upload.Dragger;
export default class AutoRefresh extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      tabId: null,
      interval: 3000,
      elapsedTime: 0,
      handler: null,
    }
  }
  async componentWillMount() {
    const tab = await getCurrentTab();
    if (!tab) {
      return;
    }
    const tabId = tab.id;
    this.setState({ tabId }, this.updateStatus.bind(this));
  }
  componentWillUnmount() {
    const { handler } = this.state;
    if (handler) {
      clearInterval(handler);
    }
  }
  onChangeRefreshRate(e) {
    this.setState({ interval: e, el: 0 })
  }
  async updateStatus() {
    const status = await sendMessage({ job: 'getCurrentTabAutoRefreshStatus' });
    console.log(status);
    this.setState(status);
  }
  async updateAutoRefresh(active, interval, startAt) {
    active = active || this.state.active;
    interval = interval || this.state.interval;
    startAt = startAt || this.state.elapsedTime;
    const status = await sendMessage({
      job: 'updateAutoRefresh',
      tabId: this.state.tabId,
      active,
      interval,
      startAt
    });
    this.setState(status);
  }
  async toggle() {
    if (this.state.active) {
      clearInterval(this.state.handler);
      await this.updateAutoRefresh(false, null, 0);
    } else {
      const handler = setInterval(this.updateStatus.bind(this), 200);
      await this.updateAutoRefresh(true, null, 0);
      this.setState({ handler })
    }
  }
  render() {
    console.log(this.state.current);
    const { elapsedTime, interval } = this.state;
    return (
      <AutoRefreshContainer>
        <Progress percent={(elapsedTime/interval).toFixed(2)*100} showInfo={false}/>
        <span onClick={()=> this.toggle()}>
          <FAIcon
            className={this.state.active ? 'toolStart' : 'toolStart'}
            icon ={faSolid.faSync}
          />
        </span>
        <p className="ant-upload-text">Auto Refresh(Beta)</p>
        <InputNumber
          defaultValue={interval/1000}
          min={1}
          formatter={value => `${value}s`}
          parser={value => value.replace('s', '')}
          onChange={(v)=>this.updateAutoRefresh(null, v)}
        />
      </AutoRefreshContainer>
    );
  }
}
