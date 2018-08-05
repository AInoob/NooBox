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
import FAIcon     from '@fortawesome/react-fontawesome';
import faSolid  from '@fortawesome/fontawesome-free-solid';
import styled   from "styled-components";
import emoji    from "SRC/assets/funSh*t/emoji.svg";
const OverviewContainer = styled.div`
   margin-bottom:10px;
  .uploadImage{
    margin:10px 10px 0 10px;
    .ant-upload{
      border-radius:0;
    }
  }

  .h5Video{
    margin:10px 10px 0 10px;
    border: 1px dashed #d9d9d9;
    text-align: center;
    padding: 16px 0;
    background: #fafafa;
  }
  .autoRefresh{
    margin:10px 10px 0 10px;
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

  .funStuff{
    @keyframes moveArrow { from { padding-Top: 10px; } to { padding-Top: 0px; }}
    margin-left:25%;
    text-align:center;
    .arrow{
      font-size:16pt;
      animation: .5s linear 0s infinite alternate moveArrow;
    }
    .description{
      font-size: 14px;
      font-weight: 600;
    }
    .emoji{
      img{
        width: 60px;
      }
    }
  }
`;

class Overview extends React.Component{
  componentDidMount(){
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
        <Loader style ={{marginTop: "20%"}}/>
      )
    }else{
      let imageSearch =  overview.showImageSearch ?(<div className ="uploadImage">
                          <UploadImage
                            imageSearchBegin  = {actions.imageSearchBegin}
                          />
                        </div>):undefined;
      let autoRefresh = overview.showAutoRefresh ?(<div className ="autoRefresh">
                          <AutoRefresh
                            tabId             = {overview.tabId}
                            currentState      = {overview.autoRefresh}
                            autoRefreshUpdate = {actions.autoRefreshUpdate}
                            />
                          </div>):undefined;
      let html5Video = overview.showHtml5Video ?(<div className ="h5Video">
                          <H5VideoControl/>
                        </div>):undefined;
      let funStuff;
      if(!imageSearch && !autoRefresh && !html5Video){
        funStuff =(<div className= "funStuff">
          <div className ="arrow">
            <FAIcon icon ={faSolid.faArrowUp}/>
          </div>
          <div className = "description">
            <span>{i18n("choose_tools_from_here") + " ?"}</span>
          </div>
          <div className = "emoji">
            <img src ={emoji}/>
          </div>
        </div>)
      }
      return(
        <OverviewContainer>
          {imageSearch}
          {autoRefresh}
          {html5Video}
          {funStuff}
        </OverviewContainer>

     )
    }
  }
}

export default connect(reselector, reduxActions)(Overview);
