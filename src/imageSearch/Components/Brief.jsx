
import React from 'react';
import styled from 'styled-components';
import {Button, Card,Row,Col} from 'antd';

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
  .engineImages{
    margin-top: 20%;
    margin-left: 30px;
  }
`;
export default function Brief(props){
   
  const n = Math.floor(24/props.engines.length);

  const eachCol = props.engines.map((element,index) =>{
    return (
            <Card.Grid style = {{width: "20%", textAlign: "center", height: "100%"}} key = {index}>
              
                <img style ={{height: 50}} key = {index} src={'/thirdParty/'+element+'.png'} />
            </Card.Grid>
            );
  });
  return(
    <BriefContainer>
      <Row type = "flex" justify="start" align="bottom">
        <Col span ={2}/>
        <Col span ={5}>
          <Card style={{ width: "100%",height: "100%" }} bodyStyle={{ padding: 0 }}>

            <div className="custom-image">
              <img id = "imageInput" alt="example" width="100%" src={props.source} />
            </div>
            
            <div className="custom-card">
            <div> Name </div>
            {props.keyword}
        
            </div>
          </Card>
        </Col>
        {/* <Col span ={4}/> */}
        <Col span ={12}>
          <Card style={{ width: "100%"}} bodyStyle={{ padding: 0 }}>
              {eachCol}
          </Card>
        </Col>
        <Col span ={2}/>
      </Row>

    </BriefContainer>
   
  );
}