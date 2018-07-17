import React from "react";
import styled from "styled-components";
import { Card,Tooltip } from 'antd';
import FAIcon from '@fortawesome/react-fontawesome';
import faSolid from '@fortawesome/fontawesome-free-solid';
import Loader      from "SRC/common/component/Loader.jsx";
const { Meta } = Card;
const BriefContainer = styled.div`
  ul{
    list-style-type: none;
    li{
      display:inline;
      border-right: 1px solid #e8e8e8;
      text-align: center;
      margin: 12px 0;
    }
  }
`;
export default class Brief extends React.Component{
  generateImageInfo(imageInfo){
    return imageInfo.map((item,index) =>{
      return <li key ={index}><a href ={item.keywordLink}>{item.keyword}</a></li>
    })
  }
  render(){
    const {base64,imageInfo} = this.props;
    if(base64 ==""){
      return(
        <BriefContainer>
         <Card
            style={{ width: "100%" }}
            cover={ <Loader style ={{marginTop:"30%"}}/>}
         />
        </BriefContainer>
      );
    }else{
      let keyword = this.generateImageInfo(imageInfo);
      return(
        <BriefContainer>
            <Card
              style={{ width: "100%" }}
              cover={<img alt="example" src={base64} />}
              actions={[<Tooltip placement = "top" title="Download">
                         <FAIcon icon ={faSolid.faDownload}/>
                        </Tooltip>,
                        <Tooltip placement = "top" title="Search Again">
                          <FAIcon icon ={faSolid.faUpload}/>
                        </Tooltip>
                       ]}
            >
              <Meta
                title="Image Keyword"
                description= {(<ul>{keyword}</ul>)}
              />
            </Card>
        </BriefContainer>
      )
    } 
  }
}