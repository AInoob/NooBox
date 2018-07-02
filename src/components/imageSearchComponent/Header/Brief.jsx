import React from "react";
import styled from "styled-components";
import { Card,Tooltip } from 'antd';
import FAIcon from '@fortawesome/react-fontawesome';
import faSolid from '@fortawesome/fontawesome-free-solid';
const { Meta } = Card;
const BriefContainer = styled.div`

`;
export default class Brief extends React.Component{
  render(){
    console.log(faSolid)
    let inited = true;
      return(
        <BriefContainer>
            <Card
              style={{ width: 200 }}
              cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
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