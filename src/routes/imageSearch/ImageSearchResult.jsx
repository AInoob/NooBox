import React from "react";
import styled from "styled-components";
import Brief from 'SRC/components/imageSearchComponent/Header/Brief.jsx';
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
            <Row>
              <Col span ={10}>
                <Brief/>
              </Col>
            </Row>
          </div>
        </ResultContainer>
      )
    }
  }
}