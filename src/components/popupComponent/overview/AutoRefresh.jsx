import React from "react";
import { Upload, Icon, message, InputNumber,Progress } from 'antd';
import styled from "styled-components";
import FAIcon from '@fortawesome/react-fontawesome'
import faSolid from '@fortawesome/fontawesome-free-solid'
import {getCurrentTab, sendMessage} from 'SRC/utils/browserUtils';

const AutoRefreshContainer = styled.div`
  .ant-upload-text{
    font-size: 16px;
    margin: 0 0 4px;
    color: rgba(0,0,0,.85);
  }
  .ant-progress-bg{
    height: 2px !important;
    position: absolute;
    top: -30px;
    left: 0;
  }
`;
const Dragger = Upload.Dragger;
export default class AutoRefresh extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      interval: 3000,
      elapsedTime: 0,
    }
  }
  
  autoRefreshSwitch(){
    const {autoRefreshSwitch,tabId} = this.props;
    let newState ={};
    if(this.state.active){
      let payload = {
        job: 'updateAutoRefresh',
        active: false,
        tabId : tabId,
        interval:this.state.interval,
        startAt:0,
      }
      newState = {
        active: false,
        elapsedTime: 0,
      }
     this.progressControl(false);
      autoRefreshSwitch(payload);
    }else{
      let payload ={
        job: 'updateAutoRefresh',
        active: true,
        tabId : tabId,
        interval: this.state.interval,
        startAt:0,
      }
      this.progressControl(true);
      newState = {
        active: true,
      }
      autoRefreshSwitch(payload);
    }
    this.setState(newState);
  }

  progressControl(ifActive){
    if(ifActive){
      let timeId =window.setInterval(()=>{
          let nextElapsedTime = this.state.elapsedTime +1000;
          if(nextElapsedTime >= this.state.interval-1){
            nextElapsedTime = 0;
          }
          this.setState({
            elapsedTime:nextElapsedTime,
            animationIntervalId:timeId,
          })
        },1000)
    }else{
      let {animationIntervalId} = this.state;
      window.clearInterval(animationIntervalId);
    }
  }
  componentWillMount(){
     const{currentState} = this.props;
     if(currentState.ifRefresh){
       this.progressControl(true);
     }else{
      this.progressControl(false);
     }
     this.setState({
      active:currentState.ifRefresh,
      interval:currentState.refreshInterval,
      elapsedTime:currentState.refreshElapsed
     })
  }

  componentWillReceiveProps(props){
    const{currentState} = this.props;
     this.setState({
      active:currentState.ifRefresh,
      interval:currentState.refreshInterval,
      elapsedTime:currentState.refreshElapsed
     })
  }
  onChangeInterval(newInterval){
    let {tabId,autoRefreshUpdate} = this.props;
    if(this.state.active){
      let payload ={
        job: 'updateAutoRefresh',
        active: true,
        tabId : tabId,
        interval: newInterval,
        startAt:0,
      }
      autoRefreshUpdate(payload);
      this.setState({
        interval:newInterval,
        elapsedTime:0,
      },() => {
        this.progressControl(false);
        this.progressControl(true);
      })
    }else{
      this.setState({
        interval:newInterval,
      })
    }
  }
  render() {
    const { elapsedTime, interval, active } = this.state;
    return (
      <AutoRefreshContainer>
        <Progress percent={(elapsedTime/(interval-1000)).toFixed(2)*100} showInfo={false}/>
        <span onClick={()=> this.autoRefreshSwitch()}>
          <FAIcon
            className={active ? 'toolStart' : 'toolStop'}
            icon ={faSolid.faSync}
          />
        </span>
        <p className="ant-upload-text">Auto Refresh(Beta)</p>
        <InputNumber
          defaultValue={interval/1000}
          min={1}
          formatter={value => `${value}s`}
          parser={value => value.replace('s', '')}
          onChange={(v)=>this.onChangeInterval(v * 1000)}
        />
      </AutoRefreshContainer>
    );
  }
}
