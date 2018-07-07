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
  componentWillMount(){
    const {overview,actions} = this.props;
    // console.log(overview);
    if(!overview.inited){
      actions.overviewInit();
    }
  }
  render(){
    const {actions,overview}= this.props;
    if(!overview.inited){
      return(
        <Loader/>
      )
    }else{
      return(
        <OverviewContainer>
          {
            overview.showImageSearch ?(<div className ="uploadImage">
            <UploadImage
              imageSearchBegin  = {actions.imageSearchBegin}
            />
           </div>):""
          }
          {
           overview.showAutoRefresh ?( <div className ="autoRefresh">
           <AutoRefresh
             tabId             = {overview.tabId}
             currentState      = {overview.autoRefresh}
             autoRefreshUpdate = {actions.autoRefreshUpdate}
           />
          </div>):""
          }
          {overview.showHtml5Video ?(<div className ="h5Video">
              <H5VideoControl/>
            </div>):""
          }
        </OverviewContainer>

     )
    }
  }
}

export default connect(reselector, reduxActions)(Overview);
