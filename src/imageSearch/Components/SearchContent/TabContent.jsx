import React from 'react';
import styled from 'styled-components';
import { Card, Row, Col, Tooltip,Icon } from 'antd';

export default function TabContent(props){

  const content = props.data;
  const FixedTextLength = 25;
  const colLength = 6;
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
      let {imageUrl,title,description,searchEngine,link} = content[ j * colLength + i];
      
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
        <Card bordered={false}>
          <div className="custom-image">
            <img alt = {searchEngine + "Result"} width="100%" src={imageUrl} />
          </div>
          <div className="custom-card">
            <Tooltip title ={fullTitle}>
              <h3>{title}</h3>
            </Tooltip>
            
            <Tooltip title ={fullDescription}>
                {description}
            </Tooltip>
          </div>
          <div style ={{color : "rgb(236,236,236)", width: "100%", fontSize: "14px"}}>
            <a href = {link}><Icon type="link" /></a>
          </div>
        </Card>
      );
    }
    renderContent[renderContent.length] = eachCol;
  }
  console.log(renderContent);
  return(
    <Row>
        {   renderContent.map((element,index) =>{
              return (
                        <Col span ={4}>
                          {element}
                        </Col>
                     );
            })
        }
    </Row>
  );
}