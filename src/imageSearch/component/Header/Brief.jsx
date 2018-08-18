import React from "react";
import styled from "styled-components";
import { Card,Tooltip } from 'antd';
import FAIcon from '@fortawesome/react-fontawesome';
import faSolid from '@fortawesome/fontawesome-free-solid';
import Loader      from "SRC/common/component/Loader.jsx";
const { Meta } = Card;
const BriefContainer = styled.div`
  height: 100%;

  .ant-card-body{
    padding:12px;
  }
  .ant-card-body{
    display:none;
  }
  .ant-card{
    width: 100%;
    height: 100%;
    position: relative;
  }
  .ant-card-actions{
    position: absolute;
    border:0;
    bottom: 0;
    width: 100%;
    background: rgba(232, 232, 232,0.5);
    li{
      margin:0;
      color: rgba(0, 0, 0, 20);
    }
  }
  
`;
export default class Brief extends React.Component{
  render(){
    const {base64,url,uploadSearch,searchAgain} = this.props;
    if(base64 =="" && url == ""){
      return(
        <BriefContainer>
         <Card
            style={{ width: "100%" }}
            cover={ <Loader style ={{marginTop:"30%"}}/>}
         />
        </BriefContainer>
      );
    }else{
      let actions = base64 !== "" ?
                              [
                                <Tooltip placement = "top" title={i18n("search_again")} key = "action_2">
                                  <FAIcon icon ={faSolid.faRetweet} onClick = {() => searchAgain()}/>
                                </Tooltip>
                              ]:[
                              
                                <Tooltip placement = "top" title={i18n("search_again")}  key = "action_2" >
                                  <FAIcon icon ={faSolid.faRetweet} onClick = {() => searchAgain()}/>
                                </Tooltip>,
                                <Tooltip placement = "top" title={i18n("upload_search")} defaultVisible = {true} key = "action_3">
                                 <FAIcon onClick = {()=>uploadSearch(document.getElementById("searchImage"))} icon ={faSolid.faUpload}  />
                               </Tooltip>
                              ];
      return(
        <BriefContainer>
            <Card
              style={{ width: "100%" }}
              cover={<img id = "searchImage" alt="example" src={ base64 == "" ? url: base64 } />}
              actions={actions}
            >
            </Card>
        </BriefContainer>
      )
    } 
  }
}