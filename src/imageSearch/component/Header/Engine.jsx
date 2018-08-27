import React from "react";
import styled from "styled-components";
import { Card, Tooltip, Popover, InputNumber, Button, Icon,Spin } from "antd";
import FAIcon from "@fortawesome/react-fontawesome";
import faSolid from "@fortawesome/fontawesome-free-solid";
import google from "SRC/assets/engineLogos/google.png";
import baidu from "SRC/assets/engineLogos/baidu.png";
import ascii2d from "SRC/assets/engineLogos/ascii2d.png";
import bing from "SRC/assets/engineLogos/bing.png";
import saucenao from "SRC/assets/engineLogos/saucenao.png";
import sogou from "SRC/assets/engineLogos/sogou.png";
import tineye from "SRC/assets/engineLogos/tineye.png";
import iqdb from "SRC/assets/engineLogos/iqdb.png";
import Loader from "SRC/common/component/Loader.jsx";
import yandex from "SRC/assets/engineLogos/yandex.png";
const { Meta } = Card;
const gridStyle = {
  width: "12.5%",
  padding: 0,
  textAlign: "center"
};
const EngineContainer = styled.div`
  .ant-card-body {
    padding: 0;
  }
  .box:before {
    content: "";
    display: block;
    padding-top: 100%;
  }
  .box {
    width: 100%;
    position: relative;
  }
  .engineContainer {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .engineImage {
    width: 50px;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
  .engineImageHide {
    width: 50px;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.2;
  }
  .engineSetting {
    position: absolute;
    bottom: 10px;
    right: 13px;
    font-size: 16px;
  }
  .settingIcon {
    color: rgba(0, 0, 0, 0.45);
  }

  .engineLoading {
    position: absolute;
    left: 4px;
    top: 4px;
    font-size: 15px;
    bottom: 0;
    z-index: 10;
    opacity: 1;
  }
  .engineLoadingDone {
    position: absolute;
    left: 4px;
    top: 4px;
    font-size: 15px;
    bottom: 0;
    z-index: 10;
    opacity: 0;
    transition: opacity 2s;
  }
`;

export default class Engine extends React.Component {
  render() {
    // console.log(faSolid)
    const { engineLink } = this.props;
    // console.log(engineLink)
    return (
      <EngineContainer>
        <Card bordered={false}>
          <Card.Grid style={gridStyle}>
            <div className="box">
              <div className="engineContainer">
                <Spin
                  className={
                    !this.props.google || this.props.googleDone
                      ? "engineLoadingDone"
                      : "engineLoading"
                  }
                  type="loading"
                />
                <a href={engineLink["google"]} target="_blank">
                  {" "}
                  <img
                    className={
                      this.props.google ? "engineImage" : "engineImageHide"
                    }
                    src={google}
                  />
                </a>
              </div>
            </div>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <div className="box">
              <div className="engineContainer">
                <div className="engineContainer">
                  <Spin
                    className={
                      !this.props.baidu || this.props.baiduDone
                        ? "engineLoadingDone"
                        : "engineLoading"
                    }
                  />
                  <a href={engineLink["baidu"]} target="_blank">
                    {" "}
                    <img
                      className={
                        this.props.baidu ? "engineImage" : "engineImageHide"
                      }
                      src={baidu}
                    />
                  </a>
                </div>
              </div>
            </div>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <div className="box">
              <div className="engineContainer">
                <div className="engineContainer">
                  <Spin
                    className={
                      !this.props.yandex || this.props.yandexDone
                        ? "engineLoadingDone"
                        : "engineLoading"
                    }
                    type="loading"
                  />
                  <a href={engineLink["yandex"]} target="_blank">
                    {" "}
                    <img
                      className={
                        this.props.yandex ? "engineImage" : "engineImageHide"
                      }
                      src={yandex}
                    />
                  </a>
                </div>
              </div>
            </div>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <div className="box">
              <div className="engineContainer">
                <div className="engineContainer">
                  <Spin
                    className={
                      !this.props.bing || this.props.bingDone
                        ? "engineLoadingDone"
                        : "engineLoading"
                    }
                    type="loading"
                  />
                  <a href={engineLink["bing"]} target="_blank">
                    {" "}
                    <img
                      className={
                        this.props.bing ? "engineImage" : "engineImageHide"
                      }
                      src={bing}
                    />
                  </a>
                </div>
              </div>
            </div>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <div className="box">
              <div className="engineContainer">
                <div className="engineContainer">
                  <Spin
                    className={
                      !this.props.tineye || this.props.tineyeDone
                        ? "engineLoadingDone"
                        : "engineLoading"
                    }
                    type="loading"
                  />
                  <a href={engineLink["tineye"]} target="_blank">
                    {" "}
                    <img
                      className={
                        this.props.tineye ? "engineImage" : "engineImageHide"
                      }
                      src={tineye}
                    />
                  </a>
                </div>
              </div>
            </div>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <div className="box">
              <div className="engineContainer">
                <Spin
                  className= {
                    !this.props.saucenao || this.props.saucenaoDone
                      ? "engineLoadingDone"
                      : "engineLoading"
                  }
                  type="loading"
                />
                <a href={engineLink["saucenao"]} target="_blank">
                  <img
                    className={
                      this.props.saucenao ? "engineImage" : "engineImageHide"
                    }
                    src={saucenao}
                  />
                </a>
              </div>
            </div>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <div className="box">
              <div className="engineContainer">
                  <Spin 
                    className={
                    !this.props.iqdb || this.props.iqdbDone 
                      ? "engineLoadingDone"
                      : "engineLoading"
                    } 
                    type="loading" />
                <a href={engineLink["iqdb"]} target="_blank">
                  <img
                    className={
                      this.props.iqdb ? "engineImage" : "engineImageHide"
                    }
                    src={iqdb}
                  />
                </a>
              </div>
            </div>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <div className="box">
              <div className="engineContainer">
                  <Spin 
                    className={
                      !this.props.ascii2d || this.props.ascii2dDone 
                      ? "engineLoadingDone" 
                      : "engineLoading" 
                    }
                    type="loading" />
                <a href={engineLink["ascii2d"]} target="_blank">
                  <img
                    className={
                      this.props.ascii2d ? "engineImage" : "engineImageHide"
                    }
                    src={ascii2d}
                  />
                </a>
              </div>
            </div>
          </Card.Grid>
        </Card>
      </EngineContainer>
    );
  }
}
