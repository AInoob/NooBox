import React from "react";
import { Upload} from 'antd';
import styled from "styled-components";
import FAIcon from '@fortawesome/react-fontawesome'
import faSolid from '@fortawesome/fontawesome-free-solid'
const H5VideoControlContainer = styled.div`
  .ant-upload-text{
    font-size: 16px;
    margin: 0 0 4px;
    color: rgba(0,0,0,.85);
  }
`;
const Dragger = Upload.Dragger;
export default class H5VideoControl extends React.Component{
  constructor(props){
    super(props);
    this.state  = {
       start    : false,
       startClass : "toolStart",
       stopClass  : "toolStop",
    }
  }
  onChangeRefreshRate(e){

  }
  startOrStop(){
    if(this.state.start){
      this.setState({active:false})
    }else{
      this.setState({active:true})
    }
  }
  render(){
      return(
        <H5VideoControlContainer>
            <span  onClick = {()=> this.startOrStop()}>
              <FAIcon
              className = {this.state.start ? this.state.startClass :this.state.stopClass}
              icon ={faSolid.faVideo}/>
            </span>
           <p className="ant-upload-text">{i18n("html_5_video_control")}</p>
        </H5VideoControlContainer>
      );
  }
}
