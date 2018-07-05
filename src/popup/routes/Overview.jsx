import React from "react";
//redux
import {connect} from 'dva';
import reduxActions from "SRC/popup/reduxActions.js";
import reselector   from "SRC/popup/reselector.js";
import {Button} from 'antd';
import UploadImage from "SRC/popup/components/overview/UploadImage.jsx";
import AutoRefresh from "SRC/popup/components/overview/AutoRefresh.jsx";
import H5VideoControl from "SRC/popup/components/overview/H5VideoControl.jsx";
import Loader      from "SRC/common/component/Loader.jsx";
import styled from "styled-components";
const OverviewContainer = styled.div`
   margin-bottom:20px;

  .uploadImage{
    margin:20px 20px 0 20px;
  }

  .h5Video{
    margin:20px 20px 0 20px;
    border: 1px dashed #d9d9d9;
    text-align: center;
    padding: 16px 0;
    background: #fafafa;
  }
  .autoRefresh{
    margin:20px 20px 0 20px;
    border: 1px dashed #d9d9d9;
    text-align: center;
    padding: 16px 0;
    background: #fafafa;
    position:relative;
  }

  .toolStart{
    font-size: 24px;
    color: #40a9ff;
    transition: color 2s;
  }
  .toolStart:hover{
    cursor:pointer
  }
  .toolStop{
    color: #495056;
    font-size: 24px;
    transition: color 2s;
  }
  .toolStop:hover{
    cursor:pointer
  }
`;

class Overview extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      tabId:0,
    }
  }
  componentWillMount(){
    const {overview,actions} = this.props;
    // console.log(overview);
    if(!overview.inited){
      actions.overviewInit();
    }else{
      this.setState({
        tabId:overview.tabId,
        inited:overview.inited,
        autoRefresh:overview.autoRefresh,
      })
    }
  }
  componentWillReceiveProps(props){
    const {overview} = this.props;
    // console.log(overview);
    if(overview.inited){
      this.setState({
        tabId:overview.tabId,
        inited:overview.inited,
        autoRefresh:overview.autoRefresh,
      })
    }
  }
  render(){
    const {actions}= this.props;
    if(!this.state.inited){
      return(
        <Loader/>
      )
    }else{
      return(

        <OverviewContainer>
          <Button onClick = {()=> actions.imageSearchBegin()}>Test</Button>
          <div className ="uploadImage">
           <UploadImage
             imageSearchBegin  = {actions.imageSearchBegin}
           />
          </div>
          <div className ="autoRefresh">
           <AutoRefresh
             tabId             = {this.state.tabId}
             currentState      = {this.state.autoRefresh}
             autoRefreshUpdate = {actions.autoRefreshUpdate}
           />
          </div>
          <div className ="h5Video">
           <H5VideoControl/>
          </div>
        </OverviewContainer>

     )
    }
  }
}

export default connect(reselector, reduxActions)(Overview);
