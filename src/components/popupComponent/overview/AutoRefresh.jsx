import React from "react";
import { Upload, Icon, message, InputNumber,Progress} from 'antd';
import styled from "styled-components";
import FAIcon from '@fortawesome/react-fontawesome'
import faSolid from '@fortawesome/fontawesome-free-solid'
import sendMessage from '../../../utils/sendMessage';

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
      start: false,
      startClass: "toolStart",
      stopClass: "toolStop",
      maxTime: 5,
      current: 0,
    }
  }
  onChangeRefreshRate(e) {
    this.setState({ maxTime: e, current: 0 })
  }
  updateProgress() {
    if(this.state.current > this.state.maxTime){
      this.setState({ current: 0 })
    }else{
      this.setState({ current: this.state.current + 1 })
    }
  }
  toggle() {
    if(this.state.start){
      clearInterval(this.state.intervalId);
      this.setState({ start: false, current: 0 })
    } else {
      let intervalId = setInterval(this.updateProgress.bind(this),999)
      this.setState({ start: true, intervalId })
    }
  } 
  render() {
    console.log(this.state.current);
    return (
      <AutoRefreshContainer>
        <Progress percent={(this.state.current/this.state.maxTime).toFixed(2)*100} showInfo={false}/>
        <span onClick={()=> this.toggle()}>
          <FAIcon
            className={this.state.start ? this.state.startClass :this.state.stopClass}
            icon ={faSolid.faSync}
          />
        </span>
        <p className="ant-upload-text">Auto Refresh(Beta)</p>
        <InputNumber
          defaultValue={5}
          min={5}
          formatter={value => `${value}s`}
          parser={value => value.replace('s', '')}
          onChange={(e)=>this.onChangeRefreshRate(e)}
        />
      </AutoRefreshContainer>
    );
  }
}
