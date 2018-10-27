import React from "react";
import { connect } from "dva";
import reduxActions from "SRC/imageSearch/reduxActions.js";
import reselector from "SRC/imageSearch/reselector.js";
import styled from "styled-components";
import Brief from "SRC/imageSearch/component/Header/Brief.jsx";
import Engine from "SRC/imageSearch/component/Header/Engine.jsx";
import Setting from "SRC/imageSearch/component/Header/Setting.jsx";
import ImageList from "SRC/imageSearch/component/Content/ImageList.jsx";
import ImageWall from "SRC/imageSearch/component/Content/ImageWall.jsx";
import Loader from "SRC/common/component/Loader.jsx";
import { Row, Col } from "antd";
const ResultContainer = styled.div`
  height: auto;
  min-height: 100%;
  width: 100%;
  background: #f0f2f5;
  padding-left: 2%;
  padding-right: 2%;
  padding-top:15px;
  .ads{
    position: relative;
    text-align: center;
    width: 100%;
    height: 100%;
    .adsTag{
       max-width: 90%;
       position: absolute;
       top: 20%;
       left: 50%;
       -webkit-transform: translateX(-50%);
       transform: translateX(-50%);
       visibility: hidden;
      }
      
    img{
      margin-top: 10%;
      max-width: 90%;
      max-height: 80%; 
    }  
  }
  .ads:hover{
    position: relative;
    text-align: center;
    width: 100%;
    height: 100%;
    
    .adsTag{
      max-width: 90%;
      position: absolute;
      top: 20%;
      left: 50%;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      visibility: visible;
      transition: visibility 2s;
    }
    
    img{
      margin-top: 10%;
      max-width: 90%;
      max-height: 80%; 
      opacity: 0.2;
      transition: opacity 2s
    }  
  }
  
  .ant-row-flex {
    align-items: stretch;
  }
  .ant-col-12 {
    padding: 12px 12px 0 12px;
    background: white;
  }
  .header{
    margin-bottom:15px;
  }
`;
class ImageSearchResult extends React.Component {
  componentDidMount() {
    const { actions, imageSearch, match } = this.props;
    if (!imageSearch.inited) {
      actions.imageSearchInit(match.params.id);
    }
  }
  render() {
    const { actions, imageSearch, match } = this.props;
    // console.log(match);
    if (!imageSearch.inited) {
      return <Loader />;
    } else {
      return (
        <ResultContainer>
          <div className="header">
            <Row type="flex">
              <Col span={4} />
              <Col span={4}>
                <Brief
                  base64={imageSearch.base64}
                  url={imageSearch.url}
                  imagInfo={imageSearch.searchImageInfo}
                  uploadSearch={actions.imageSearchUploadSearch}
                  searchAgain ={actions.imageSearchSearchAgain}
                />
              </Col>
              <Col span={12}>
                <Engine
                  engineLink={imageSearch.engineLink}
                  google={imageSearch["google"]}
                  googleDone={imageSearch["googleDone"]}
                  baidu={imageSearch["baidu"]}
                  baiduDone={imageSearch["baiduDone"]}
                  yandex={imageSearch["yandex"]}
                  yandexDone={imageSearch["yandexDone"]}
                  bing={imageSearch["bing"]}
                  bingDone={imageSearch["bingDone"]}
                  tineye={imageSearch["tineye"]}
                  tineyeDone={imageSearch["tineyeDone"]}
                  saucenao={imageSearch["saucenao"]}
                  saucenaoDone={imageSearch["saucenaoDone"]}
                  iqdb={imageSearch["iqdb"]}
                  iqdbDone={imageSearch["iqdbDone"]}
                  ascii2d={imageSearch["ascii2d"]}
                  ascii2dDone={imageSearch["ascii2dDone"]}
                />
                <Setting
                  updateDisplayMode={actions.imageSearchUpdateDisplayMode}
                  updateSortBy={actions.imageSearchSortBy}
                  updateSortByOrder={actions.imageSearchSoryByOrder}
                  displayMode={imageSearch.displayMode}
                  sortBy={imageSearch.sortBy}
                  imageInfo={imageSearch.searchImageInfo}
                  sortByOrder={imageSearch.sortByOrder}
                />
              </Col>
              <Col span={4}>
                <div className="ads">
                  <a target="_blank"  href="https://ainoob.com/ads/first">
                    <h2 className = "adsTag">{i18n("support_developers")}</h2>
                    <img border="0" src="https://ainoob.com/ads.jpg" />
                  </a>
                </div>
              </Col>
            </Row>
          </div>
          <div className="result">
            {imageSearch.displayMode == 1 ? (
              <ImageList imageDataList={imageSearch.searchResult} />
            ) : (
              <ImageWall imageDataList={imageSearch.searchResult} />
            )}
          </div>
        </ResultContainer>
      );
    }
  }
}

export default connect(
  reselector,
  reduxActions
)(ImageSearchResult);
