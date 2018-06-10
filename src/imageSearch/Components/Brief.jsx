
import React from 'react';
import styled from 'styled-components';
import {Button, Card,Row,Col,Icon,Popover,InputNumber,Alert} from 'antd';
import { isAbsolute } from 'path';

const BriefContainer = styled.div`
  height: 20%;
  .custom-image img {
    display: block;
  }
  .custom-card {
    padding: 10px 16px;
  }
  .custom-card p {
    color: #999;
  }
  .ant-card-grid{
    position:relative;
    div{
      position:absolute !important;
      right:10px;
      bottom:10px;
      font-size:16px;
    }
  }
  .engineImages{
    margin-top: 20%;
    margin-left: 30px;
  }
`;
const AlertMessage = styled.div`
  position:absolute;
  top:  10px;
  left: 50%;
`;
const DEFAULT_MAX_SEARCH = 10;
const DEFAULT_MAX_SEARCH_GOOGLE = 5;
const ENGINES =['google','baidu','tinyeye','bing','yandex','iqdb','saucenao','ascii2d'];
const DEFAULT_SETTING ={ 
  google: DEFAULT_MAX_SEARCH,
  baidu:  DEFAULT_MAX_SEARCH,
  tineye: DEFAULT_MAX_SEARCH,
  bing: DEFAULT_MAX_SEARCH,
  yandex: DEFAULT_MAX_SEARCH,
  iqdb:  DEFAULT_MAX_SEARCH,
  saucenao: DEFAULT_MAX_SEARCH,
  ascii2d: DEFAULT_MAX_SEARCH
};
export default class Brief extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currentSetting:{},
      getSetting:false,
    }
  }
  //For developing
  // componentWillMount(){
  //   set("maxSearch",DEFAULT_SETTING,
  //           ()=>{
  //             console.log("success");
  //             this.setState({currentSetting:DEFAULT_SETTING,getSetting:true});
  //           });
  // }
  
  //Before Render The Class
  //Get Setting From Remote Setting
  //IF it doesn't exist 
  componentWillMount(){
    const{source, keyword , results, engines} = this.props;
    get(["maxSearch"],(result)=>{
      if(result == null){
          set("maxSearch",DEFAULT_SETTING,
            ()=>{
              this.setState({currentSetting:DEFAULT_SETTING,getSetting:true});
            }
          );
      }else{
        // console.log("get result");
        // console.log(result);
        this.setState({currentSetting:result,getSetting:true});
      }
    })
  }

  syncSetting(){
    let currentSetting = Object.assign ({},this.state.currentSetting);
    for(let i  in currentSetting){
      switch(i){
        case'google':
        if(currentSetting[i] % 10 < 5){
          currentSetting[i] = (Math.floor(currentSetting[i] / 10) * 10) + 5;
        }else{
          currentSetting[i] = (Math.floor( (currentSetting[i] - 5 ) / 10) * 10) + 5;
        }
        // console.log(currentSetting[i]);
        break;
          
        default:
        currentSetting[i] = currentSetting[i] < 10 ? 10 : Math.floor(currentSetting[i] /10) * 10;
        break;
      }
    
    }
    set("maxSearch",currentSetting,()=>{
      const alert = (<Alert message="Successfully Update Your Setting" type="success" showIcon closable onClose= {() => this.alertOnclose()}/>)
      this.setState({alert:alert,currentSetting:currentSetting})
    })
  }
  alertOnclose(){
    this.setState({alert:""});
  }
  changeSetting(value,engineId){
    let newSetting = Object.assign({},this.state.currentSetting);
    newSetting[engineId] = value;
    console.log(value);
    console.log(engineId);
    this.setState({currentSetting:newSetting},function(){console.log(this.state.currentSetting)});
  }
  render(){
    const{source, keyword , results, engines} = this.props;
    // console.log(engines);
    const n = Math.floor(24/this.props.engines.length);
    let eachIcon;
    if(engines == ""){
      eachIcon = engines.map((element,index) =>{
        return (
                <Card.Grid style = {{width: "25%", textAlign: "center"}} key = {index}>
                    <img style ={{height: 50}} key = {index} src={'/thirdParty/'+element+'.png'} />
                </Card.Grid>
                );
      });
    }else{
      eachIcon = engines.map((element,index) =>{
        return (
                <Card.Grid style = {{width: "25%", textAlign: "center"}} key = {index}>
                  <a key ={index} target="_blank" key = {index} href = {(results[element] || {}).url}>
                    <img style ={{height: "50px"}} key = {index} src={'/thirdParty/'+element+'.png'} />
                  </a> 
                  {/*混乱Code 提示！，
                  1.首先要知道是否已经从Chrome取得Setting
                  2.然后渲染每一个Engine 的 Setting部分*/}
                  {this.state.getSetting ? (
                      <div>
                        <Popover title = "Max Search Number" content = {<div>
                                                                                <InputNumber min={5} max={100} step ={10} value ={this.state.currentSetting[element]} onChange = {(value)=>this.changeSetting(value,element)}/>
                                                                                <Button style = {{marginLeft:"10px"}} type = "primary" onClick ={()=>this.syncSetting()}>Save</Button>
                                                                          </div>}
                          ><Icon type="setting" />
                        </Popover>
                      </div>):(
                      <div><Icon type = "loading"/></div>)}
                </Card.Grid>
                );
      });
    }
    //console.log(this.state.alert);
    //console.log(this.props)
    return(
      <BriefContainer>
        <AlertMessage>
            {this.state.alert}
        </AlertMessage>
        <Row type = "flex" justify="start" align="bottom">
          <Col span ={2}/>
          <Col span ={6}>
            <Card style={{ width: "100%",height: "100%" }} bodyStyle={{ padding: 0 }}>

              <div className="custom-image">
                <img id = "imageInput" alt="example" width="100%" src={source} />
              </div>
              
              <div className="custom-card">
              {/* need translate */}
              {/* <div> Keywords </div> */}
              {keyword}
          
              </div>
            </Card>
          </Col>
          <Col span ={1}/>
          <Col span ={10}>
            <Card style={{ width: "100%"}} bodyStyle={{ padding: 0 }}>
                {eachIcon}
            </Card>
          </Col>
          <Col span ={2}>
          
          </Col>
        </Row>
      </BriefContainer>
    
      );
  }
}