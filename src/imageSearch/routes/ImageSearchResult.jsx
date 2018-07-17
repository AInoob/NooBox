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
import Loader      from "SRC/common/component/Loader.jsx";
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
  componentDidMount(){
    const{actions,imageSearch,match} = this.props;
    if(!imageSearch.inited){
      actions.imageSearchInit(match.params.id);
    }
  }
  render(){
    const{actions,imageSearch,match} = this.props;
    console.log(match);
    if(!imageSearch.inited){
      return(<Loader/>)
    }else{
      return(
        <ResultContainer>
          <div className ="header">
            <Row  type="flex" align="bottom">
              <Col span ={11}>
                <Brief base64 ={imageSearch.base64} 
                       imageInfo = {imageSearch.searchImageInfo}/>
              </Col>
              <Col span ={2}/>
              <Col span ={11}>
                <Engine 
                  google ={imageSearch["google"]}
                  googleDone = {imageSearch["googleDone"]}

                  baidu  ={imageSearch["baidu"]}
                  baiduDone = {imageSearch["baiduDone"]}

                  yandex ={imageSearch["yandex"]}
                  yandexDone = {imageSearch["yandexDone"]}

                  bing   ={imageSearch["bing"]}
                  bingDone = {imageSearch["bingDone"]}

                  tineye  ={imageSearch["tineye"]}
                  tineyeDone = {imageSearch["tineyeDone"]}

                  saucenao  ={imageSearch["saucenao"]}
                  saucenaoDone = {imageSearch["saucenaoDone"]}

                  iqdb  ={imageSearch["iqdb"]}
                  iqdbDone = {imageSearch["iqdbDone"]}

                  ascii2d  ={imageSearch["ascii2d"]}
                  ascii2dDone = {imageSearch["ascii2dDone"]}
                  />
                <Setting updateDisplayMode = {actions.imageSearchUpdateDisplayMode} 
                         updateSortBy = {actions.imageSearchSortBy}
                         updateSortByOrder ={actions.imageSearchSoryByOrder}
                         displayMode = {imageSearch.displayMode}
                         sortBy = {imageSearch.sortBy}
                         sortByOrder = {imageSearch.sortByOrder}
                         />
                         
              </Col>
            </Row>
          </div>
          <div className ="result">
          {
              imageSearch.displayMode == 1 ? <ImageList imageDataList ={imageSearch.searchResult}/>:
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