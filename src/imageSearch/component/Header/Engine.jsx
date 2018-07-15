import React from "react";
import styled from "styled-components";
import { Card,Tooltip,Popover,InputNumber,Button } from 'antd';
import FAIcon from '@fortawesome/react-fontawesome';
import faSolid from '@fortawesome/fontawesome-free-solid';
import google from "SRC/assets/engineLogos/google.png";
import baidu  from "SRC/assets/engineLogos/baidu.png";
import ascii2d from "SRC/assets/engineLogos/ascii2d.png";
import bing from "SRC/assets/engineLogos/bing.png";
import saucenao from "SRC/assets/engineLogos/saucenao.png";
import sogou from "SRC/assets/engineLogos/sogou.png";
import tineye from "SRC/assets/engineLogos/tineye.png";
import iqdb from "SRC/assets/engineLogos/iqdb.png";
import yandex from "SRC/assets/engineLogos/yandex.png";
const { Meta } = Card;
const gridStyle = {
    width:"25%",
    padding:0,
    textAlign: 'center',
}
const EngineContainer = styled.div`
    .ant-card-body{
      padding:0;
    }
    .box:before{
      content: "";
      display: block;
      padding-top: 100%;
    }
    .box{
      width: 100%;
      position: relative;
    }
    .engineContainer{
      position:absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
    .engineImage{
        width: 50px;
        position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
    .engineSetting{
      position:absolute;
      bottom: 10px;
      right:13px;
      font-size: 16px;
    }
    .settingIcon{
      color: rgba(0, 0, 0, 0.45)
    }
`;

export default class Engine extends React.Component{
  render(){
    // console.log(faSolid)
    let inited = true;
      return(
        <EngineContainer>
             <Card>
                <Card.Grid  style ={gridStyle}>
                  <div className ="box">
                    <div className = "engineContainer">
                      <img  className ="engineImage"src = {google}/>
                    </div>
                    <div className ="engineSetting">
                      <Popover title = "Max Search Number" content = {<div>
                                                                                  <InputNumber min={5} max={100} step ={10} />
                                                                                  <Button style = {{marginLeft:"10px"}} type = "primary">Save</Button>
                                                                            </div>}
                            ><FAIcon className = 'settingIcon' icon ={faSolid.faCog}/>
                      </Popover>
                    </div>
                  </div>
                </Card.Grid>
                <Card.Grid  style ={gridStyle}>
                  <div className ="box">
                    <div className = "engineContainer">
                      <div className = "engineContainer">
                        <img  className ="engineImage"src = {baidu}/>
                      </div>
                      <div className ="engineSetting">
                      <Popover title = "Max Search Number" content = {<div>
                                                                                  <InputNumber min={5} max={100} step ={10} />
                                                                                  <Button style = {{marginLeft:"10px"}} type = "primary">Save</Button>
                                                                            </div>}
                            ><FAIcon className = 'settingIcon' icon ={faSolid.faCog}/>
                      </Popover>
                    </div>
                    </div>
                  </div>
                </Card.Grid>
                <Card.Grid  style ={gridStyle}>
                  <div className ="box">
                  <div className = "engineContainer">
                      <div className = "engineContainer">
                        <img  className ="engineImage"src = {yandex}/>
                      </div>
                      <div className ="engineSetting">
                      <Popover title = "Max Search Number" content = {<div>
                                                                                  <InputNumber min={5} max={100} step ={10} />
                                                                                  <Button style = {{marginLeft:"10px"}} type = "primary">Save</Button>
                                                                            </div>}
                            ><FAIcon className = 'settingIcon' icon ={faSolid.faCog}/>
                      </Popover>
                    </div>
                  </div>
                  </div>
                </Card.Grid>
                <Card.Grid  style ={gridStyle}>
                  <div className ="box">
                  <div className = "engineContainer">
                     <div className = "engineContainer">
                        <img  className ="engineImage"src = {tineye}/>
                    </div>
                    <div className ="engineSetting">
                      <Popover title = "Max Search Number" content = {<div>
                                                                                  <InputNumber min={5} max={100} step ={10} />
                                                                                  <Button style = {{marginLeft:"10px"}} type = "primary">Save</Button>
                                                                            </div>}
                            ><FAIcon className = 'settingIcon' icon ={faSolid.faCog}/>
                      </Popover>
                    </div>
                  </div>
                  </div>
                </Card.Grid>
                <Card.Grid  style ={gridStyle}>
                  <div className ="box">
                  <div className = "engineContainer">
                    <div className = "engineContainer">
                        <img  className ="engineImage"src = {bing}/>
                      </div>
                    <div className ="engineSetting">
                      <Popover title = "Max Search Number" content = {<div>
                                                                                  <InputNumber min={5} max={100} step ={10} />
                                                                                  <Button style = {{marginLeft:"10px"}} type = "primary">Save</Button>
                                                                            </div>}
                            ><FAIcon className = 'settingIcon' icon ={faSolid.faCog}/>
                      </Popover>
                    </div>
                    </div>
                  </div>
                </Card.Grid>
                <Card.Grid  style ={gridStyle}>
                  <div className ="box">
   
                  <div className = "engineContainer">
                        <img  className ="engineImage"src = {saucenao}/>
                      </div>
                      <div className ="engineSetting">
                      <Popover title = "Max Search Number" content = {<div>
                                                                                  <InputNumber min={5} max={100} step ={10} />
                                                                                  <Button style = {{marginLeft:"10px"}} type = "primary">Save</Button>
                                                                            </div>}
                            ><FAIcon className = 'settingIcon' icon ={faSolid.faCog}/>
                      </Popover>
                    </div>
                  </div>
                </Card.Grid>
                <Card.Grid  style ={gridStyle}>
                  <div className ="box">
 
                  <div className = "engineContainer">
                        <img  className ="engineImage"src = {ascii2d}/>
                      </div>
                      <div className ="engineSetting">
                      <Popover title = "Max Search Number" content = {<div>
                                                                                  <InputNumber min={5} max={100} step ={10} />
                                                                                  <Button style = {{marginLeft:"10px"}} type = "primary">Save</Button>
                                                                            </div>}
                            ><FAIcon className = 'settingIcon' icon ={faSolid.faCog}/>
                      </Popover>
                    </div>
                  </div>
                </Card.Grid>
                <Card.Grid  style ={gridStyle}>
                  <div className ="box">
                  <div className = "engineContainer">
                        <img  className ="engineImage"src = {iqdb}/>
                      </div>
                      <div className ="engineSetting">
                      <Popover title = "Max Search Number" content = {<div>
                                                                                  <InputNumber min={5} max={100} step ={10} />
                                                                                  <Button style = {{marginLeft:"10px"}} type = "primary">Save</Button>
                                                                            </div>}
                            ><FAIcon className = 'settingIcon' icon ={faSolid.faCog}/>
                      </Popover>
                    </div>
                  </div>
                </Card.Grid>
              </Card>
        </EngineContainer>
      )
  }
}