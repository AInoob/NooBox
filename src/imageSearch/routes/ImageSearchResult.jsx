import React from "react";
import {connect} from 'dva';
import reduxActions from "SRC/imageSearch/reduxActions.js";
import reselector   from "SRC/imageSearch/reselector.js";
import styled from "styled-components";
import Brief from 'SRC/imageSearch/component/Header/Brief.jsx';
import Engine from 'SRC/imageSearch/component/Header/Engine.jsx';
import Setting from 'SRC/imageSearch/component/Header/Setting.jsx';
import ImageList from 'SRC/imageSearch/component/Content/ImageList.jsx';
import ImageWall from 'SRC/imageSearch/component/Content/ImageWall.jsx';
import {Row,Col} from 'antd';
const ResultContainer = styled.div`
  height:auto;
  min-height:100%;
  width:100%;
  background:#f0f2f5;
  padding-top:5%;
  padding-left:10%;
  padding-right:10%;
`;
class ImageSearchResult extends React.Component{
  render(){
    let inited = true;
    if(!inited){
      //do something
    }else{
      const{actions,imageSearch} = this.props;
      return(
        <ResultContainer>
          <div className ="header">
            <Row align="middle">
              <Col span ={6}>
                <Brief base64 ={imageSearch.base64} imageInfo = {imageSearch.searchImageInfo}/>
              </Col>
              <Col span ={1}/>
              <Col span ={9}>
                <Engine/>
              </Col>
              <Col span ={1}/>
              <Col span ={7}>
               <Setting updateSetting = {actions.imageSearchUpdateSetting}/>
              </Col>
            </Row>
          </div>
          <div className ="result">
          {
            // imageSearch.displayMode === 0 ? null:
              imageSearch.displayMode === 1 ? <ImageList imageDataList ={imageSearch.searchResult}/>:
                <ImageWall imageDataList ={imageSearch.searchResult}/>
          }
           
            {/* <ImageList imageDataList ={imageSearch.searchResult}/> */}
          </div>
        </ResultContainer>
      )
    }
  }
}

export default connect(reselector, reduxActions)(ImageSearchResult);