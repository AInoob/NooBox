import React from "react";
import styled from "styled-components";
import { Card,Tooltip } from 'antd';
import FAIcon from '@fortawesome/react-fontawesome';
import faSolid from '@fortawesome/fontawesome-free-solid';
import Loader      from "SRC/common/component/Loader.jsx";
const { Meta } = Card;
const BriefContainer = styled.div`
  .keyword{
    list-style-type: none;
    padding:0;
    li{
      display:inline;
      border-right: 1px solid #e8e8e8;
      text-align: center;
      margin: 12px 0;
      margin-right:10px;
      padding-right: 10px;
    }
  }
`;
export default class Brief extends React.Component{
  generateImageInfo(imageInfo){
    return imageInfo.map((item,index) =>{
      if(item.keyword != ""){
        return <li key ={index}><a href ={item.keywordLink}><Tooltip placement="top" title={item.engine}>{item.keyword}</Tooltip></a></li>
      }else{
        return <span></span>
      }
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
              actions={[<Tooltip placement = "top" title={i18n("download")}>
                         <FAIcon icon ={faSolid.faDownload}/>
                        </Tooltip>,
                        <Tooltip placement = "top" title={i18n("search_again")}>
                          <FAIcon icon ={faSolid.faUpload}/>
                        </Tooltip>
                       ]}
            >
              <Meta
                title="Image Keyword"
                description= {(<ul className ="keyword">{keyword}</ul>)}
              />
            </Card>
        </BriefContainer>
      )
    } 
  }
}