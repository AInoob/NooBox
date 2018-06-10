import React from 'react';
import styled from 'styled-components';
import { Card, Row, Col, Tooltip,Icon } from 'antd';

export default function TabContent(props){

  const content = props.data;
  //Max Text Length is 25
  const FixedTextLength = 25;

  //if th colLength is 6 num of items are 6
  const colLength = 6;
  //Number of Row = total Item / 6
  //If the reminder is not 0
  //then plus Number of Row by 1
  const rowLength = content.length%6 ==0 ? Math.floor(content.length / 6) : Math.floor(content.length / 6) +1;
  // console.log("conent length"+ content.length);
  // console.log("row Length" + rowLength);


  let renderContent = [];
  for(let i = 0; i < colLength; i++){
    let eachCol =[];
    for(let j = 0; j< rowLength; j++){
      if(!content[ j * colLength + i]){
        break;
      }
      //convert 2 demension array position to 1 demension array position
      let {imageUrl,title,description,searchEngine,link} = content[ j * colLength + i];
      console.log(imageUrl);
      let fullDescription;
      let fullTitle;

      if(description && description.length > FixedTextLength ){
        fullDescription = description;
        description = description.substring(0,FixedTextLength )+"...";
      }
      
      if(title && title.length > FixedTextLength ){
        fullTitle = title;
        title = title.substring(0,FixedTextLength ) +"...";
      }

      eachCol[eachCol.length] = (
        <Card bordered={false} key ={eachCol.length}>
          <div className="custom-image">
            <img alt = {searchEngine + "Result"} width="100%" src={imageUrl} />
          </div>
          <div className="custom-card">
            <Tooltip title ={fullTitle}>
              <h3 style ={{fontSize: "1rem"}}>{title}</h3>
            </Tooltip>
            
            <Tooltip title ={fullDescription}>
                {description}
            </Tooltip>
          </div>
          <div style ={{color : "rgb(236,236,236)", width: "100%", fontSize: "14px"}}>
            <a href = {link} target="_blank"><Icon type="link" /></a>
          </div>
        </Card>
      );
    }
    renderContent[renderContent.length] = eachCol;
  }
  return(
    <Row>
        {   renderContent.map((element,index) =>{
              return (
                        <Col span ={4} key = {index}>
                          {element}
                        </Col>
                     );
            })
        }
    </Row>
  );
}