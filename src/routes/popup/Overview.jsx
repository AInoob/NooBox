import React from "react";
//redux
import {connect} from 'dva';
import reduxActions from "SRC/modelsViewsConnentor/reduxActions.js";
import reselector   from "SRC/modelsViewsConnentor/reselector.js";

import UploadImage from "SRC/components/popupComponent/overview/UploadImage.jsx";
import AutoRefresh from "SRC/components/popupComponent/overview/AutoRefresh.jsx";
import H5VideoControl from "SRC/components/popupComponent/overview/H5VideoControl.jsx";

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
  render(){
    return(
       <OverviewContainer>
         <div className ="uploadImage">
          <UploadImage/>
         </div>
         <div className ="autoRefresh">
          <AutoRefresh/>
         </div>
         <div className ="h5Video">
          <H5VideoControl/>
         </div>
       </OverviewContainer>
        
    )
  }
}

export default connect(reselector, reduxActions)(Overview);
