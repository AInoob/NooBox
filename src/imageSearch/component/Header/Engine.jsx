import React from "react";
import styled from "styled-components";
import { List,Card, Tooltip, Popover, InputNumber, Button, Icon,Spin } from "antd";
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
    opacity:1;
    filer:blur(0px);
    transition: opacity 2s;
  }
  .engineImageLoading{
    width: 50px;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    filter:blur(2px);
    opacity: 0.3;
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
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    z-index:10;
    opacity: 1;
  }
  .engineLoadingDone {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    opacity: 0;
    z-index:10;
    visibility:hidden;
    transition: opacity 2s,visibility 2s;
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
                  // spinning={!this.props.google || !this.props.googleDone}
                  // spinning = {true}
                  className={
                    !this.props.google || this.props.googleDone
                      ? "engineLoadingDone"
                      : "engineLoading"
                  }
                  type="loading"
                >
                </Spin>
                <a href={engineLink["google"]} target="_blank">
                    {" "}
                    <img
                      className={
                        this.props.google ?
                        this.props.googleDone ?
                        "engineImage":
                        "engineImageLoading" :
                        "engineImageHide"
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
                        this.props.baidu ?
                        this.props.baiduDone ?
                        "engineImage":
                        "engineImageLoading" :
                        "engineImageHide"
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
                        this.props.yandex ?
                        this.props.yandexDone ?
                        "engineImage":
                        "engineImageLoading" :
                        "engineImageHide"
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
                        this.props.bing ?
                        this.props.bingDone ?
                        "engineImage":
                        "engineImageLoading" :
                        "engineImageHide"
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
                        this.props.tineye ?
                        this.props.tineyeDone ?
                        "engineImage":
                        "engineImageLoading" :
                        "engineImageHide"
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
                      this.props.saucenao ? this.props.saucenaoDone ?
                      "engineImage":
                      "engineImageLoading" :
                      "engineImageHide"
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
                      this.props.iqdb ? this.props.iqdbDone ?
                      "engineImage":
                      "engineImageLoading" :
                      "engineImageHide"
                    }
                    src={iqdb}
                  />
                </a>
              </div>
            </div>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <Popover content={
              engineLink["ascii2d"] == undefined ? "":
                <ul
                  style ={{
                    listStyleType:"none",
                    paddingLeft:"5px",
                  }}
                >
                  <li>
                    <a href= {"https://ascii2d.net/search/color/" + engineLink["ascii2d"]} target="_blank" >{i18n("ascii2d_link_mode_color")}</a>
                  </li>
                  <li>
                    <a href= {"https://ascii2d.net/search/bovw/" + engineLink["ascii2d"]} target="_blank" >{i18n("ascii2d_link_mode_bovw")}</a>
                  </li>
                  <li>
                    <a href= {"https://ascii2d.net/details/" + engineLink["ascii2d"]+"/new"} target="_blank" >{i18n("ascii2d_link_mode_detail")}</a>
                  </li>
                </ul>
            }
            placement="right"
            >
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
                        this.props.ascii2d ? this.props.ascii2dDone ?
                          "engineImage":
                          "engineImageLoading" :
                          "engineImageHide"
                      }
                      src={ascii2d}
                    />
                  </a>
                </div>
              </div>
            </Popover>

          </Card.Grid>
        </Card>
      </EngineContainer>
    );
  }
}
