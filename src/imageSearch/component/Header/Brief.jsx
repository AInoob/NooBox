import React from "react";
import styled from "styled-components";
import { Card,Tooltip } from 'antd';
import FAIcon from '@fortawesome/react-fontawesome';
import faSolid from '@fortawesome/fontawesome-free-solid';
import Loader      from "SRC/common/component/Loader.jsx";
const { Meta } = Card;
const BriefContainer = styled.div`
  height: 100%;
  .keyword{
    list-style-type: none;
    padding:0;
    li{
      display:inline;
      border-right: 1px solid #e8e8e8;
      text-align: center;
      margin: 12px 0;
      margin-right:10px;
      padding-right: 10px;
    }
  }
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
    bottom: 0;
    width: 100%;
  }
  
`;
export default class Brief extends React.Component{
  // generateImageInfo(imageInfo){
  //   return imageInfo.map((item,index) =>{
  //     if(item.keyword != ""){
  //       return <li key ={index}><a href ={item.keywordLink}><Tooltip placement="top" title={item.engine}>{item.keyword}</Tooltip></a></li>
  //     }else{
  //       return <span key ={index}></span>
  //     }
  //   })
  // }
  render(){
    const {base64,url,imageInfo,uploadSearch} = this.props;
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
                              [<Tooltip placement = "top" title={i18n("download")} key = "action_1" >
                                  <FAIcon icon ={faSolid.faDownload}/>
                                </Tooltip>,
                                <Tooltip placement = "top" title={i18n("search_again")} key = "action_2">
                                  <FAIcon icon ={faSolid.faRetweet} />
                                </Tooltip>
                              ]:[
                                <Tooltip placement = "top" title={i18n("download")} key = "action_1">
                                  <FAIcon icon ={faSolid.faDownload} />
                                </Tooltip>,
                                <Tooltip placement = "top" title={i18n("search_again")}  key = "action_2" >
                                  <FAIcon icon ={faSolid.faRetweet} />
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