import React from "react";
import styled from "styled-components";
import Brief from 'SRC/components/imageSearchComponent/Header/Brief.jsx';
import Engine from 'SRC/components/imageSearchComponent/Header/Engine.jsx';
import Setting from 'SRC/components/imageSearchComponent/Header/Setting.jsx';
import {Row,Col} from 'antd'
const ResultContainer = styled.div`
  height:100%;
  width:100%;
  background:#f0f2f5;
  padding-top:5%;
  padding-left:10%;
  padding-right:10%;
`;
export default class ImageSearchResult extends React.Component{
  render(){
    let inited = true;
    if(!inited){
      //do something
    }else{
      return(
        <ResultContainer>
          <div className ="header">
            <Row align="middle">
              <Col span ={6}>
                <Brief/>
              </Col>
              <Col span ={1}/>
              <Col span ={9}>
                <Engine/>
              </Col>
              <Col span ={1}/>
              <Col span ={4}>
              <Col span ={3}/>
                <Setting/>
              </Col>
            </Row>
          </div>
        </ResultContainer>
      )
    }
  }
}