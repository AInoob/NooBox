import React from "react";
//redux
import {connect} from 'dva';
import reduxActions from "SRC/modelsViewsConnentor/reduxActions.js";
import reselector   from "SRC/modelsViewsConnentor/reselector.js";

import {Tree,Card, Col, Row} from 'antd';
import styled from "styled-components";
import google from "SRC/assets/engineLogos/google.png";
import baidu  from "SRC/assets/engineLogos/baidu.png";
import ascii2d from "SRC/assets/engineLogos/ascii2d.png";
import bing from "SRC/assets/engineLogos/bing.png";
import saucenao from "SRC/assets/engineLogos/saucenao.png";
import sogou from "SRC/assets/engineLogos/sogou.png";
import tineye from "SRC/assets/engineLogos/tineye.png";
import iqdb from "SRC/assets/engineLogos/iqdb.png";
import yandex from "SRC/assets/engineLogos/yandex.png";
const TreeNode = Tree.TreeNode;
const OptionsContainer = styled.div`
  margin-left:15px;
  margin-top:5px;
  margin-right:15px;
  h4{
    border-bottom: 1px solid #d9d9d9;
  }
  .engine{
    height:35px;
  }
`;
class Options extends React.Component{
  renderTreeNodes(data){
    // console.log(data);
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }
  onCheck(){

  }
  render(){
    return(
      <OptionsContainer>
       
        <div id = "exp">
          <h4>Experience</h4>
          <Tree
            checkable
            onCheck={(e)=>this.onCheck(e)}>
            <TreeNode title ="History" key="history"/>
          </Tree>
        </div>
        <div id = "tool">
          <h4>Tools</h4>
          <Tree
            checkable
            onCheck={(e)=>this.onCheck(e)}>
            <TreeNode   title ="Auto Refresh (Alpha)"        key = "autoRefresh"/>
            <TreeNode   title ="HTML5 Video Control (Alpha)" key = "html5VideoControl"/>
            <TreeNode   title ="Image Search"                key ="imageSearch">
              <TreeNode title ="Open Result Tab In Front"    key ="openResultTabInFront"/>
              <TreeNode title ="Extract Images"              key="extractImages"/>
              <TreeNode title ="Screenshot & Search"         key ="screenshotSearch"/>
            </TreeNode>
          </Tree>
        </div>
        <div id = "engines">
          <h4>Avaiable Engines</h4>
          <Row gutter={-1}>
            <Col span ={6}>
              <Card bordered={false}>
                <img className ="engine" src ={google}/>
              </Card>
            </Col>
            <Col span ={6}>
              <Card bordered={false}>
                <img className ="engine" src ={baidu}/>
              </Card>
            </Col>
            <Col span ={6}>
              <Card bordered={false}>
                <img className ="engine" src ={yandex}/>
              </Card>
            </Col>
            <Col span ={6}>
              <Card bordered={false}>
                <img className ="engine" src ={tineye}/>
              </Card>
            </Col>
          </Row>
          <Row gutter={-1}>
            <Col span ={6}>
              <Card bordered={false}>
                <img className ="engine" src ={ascii2d}/>
              </Card>
            </Col>
            <Col span ={6}>
              <Card bordered={false}>
                <img className ="engine" src ={saucenao}/>
              </Card>
            </Col>
            <Col span ={6}>
              <Card bordered={false}>
                <img className ="engine" src ={bing}/>
              </Card>
            </Col>
            <Col span ={6}>
              <Card bordered={false}>
                <img className ="engine" src ={iqdb}/>
              </Card>
            </Col>
          </Row>
        </div>
        
      </OptionsContainer>
    )
  }
}


export default connect(reselector, reduxActions)(Options);
