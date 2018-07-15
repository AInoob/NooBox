import React from "react";
import styled from "styled-components";
import { Card,Tooltip } from 'antd';
import FAIcon from '@fortawesome/react-fontawesome';
import faSolid from '@fortawesome/fontawesome-free-solid';
import Loader      from "SRC/common/component/Loader.jsx";
const { Meta } = Card;
const BriefContainer = styled.div`

`;
export default class Brief extends React.Component{
  render(){
    const {base64} = this.props;
    let inited = true;
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
                description="This is the Keyword"
              />
            </Card>
        </BriefContainer>
      )
    } 
  }
}