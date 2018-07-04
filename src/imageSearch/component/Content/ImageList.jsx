import React from "react";
import styled from "styled-components";
import FAIcon from '@fortawesome/react-fontawesome';
import faSolid from '@fortawesome/fontawesome-free-solid';
import {Row,Col,List,Avatar,Modal} from 'antd';
const ResultContainer = styled.div`
background:white;
padding:36px;
border: 1px solid #e8e8e8;
margin-top:20px;
`;
export default class ImageList extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      showModal:false,
      imageUrl:"",
    }
  }
  showModal(sourceUrl){
    this.setState({
      showModal:true,
      imageUrl:sourceUrl,
    })
  }
  hideModal(){
    this.setState({
      showModal:false,
    })
  }
  render(){
      let {imageDataList} = this.props;
      return(
        <ResultContainer>
           <List
          itemLayout="vertical"
          size="large"
          dataSource ={imageDataList}
          footer={<div>Noobox</div>}
          renderItem={item => (
            <List.Item
              key={item.title}
              actions={[<FAIcon onClick={()=> this.showModal(item.sourceUrl)}icon ={faSolid.faSearchPlus} />,<FAIcon icon ={faSolid.faDownload}/>]}
              extra={<img width={272} alt="logo" src={item.thumbUrl} />}
            >
             <List.Item.Meta
                avatar={<Avatar src={item.searchEngine} />}
                title={<a href={item.titleUrl} target="_blank">{item.title}</a>}
              />
              {item.description}
            </List.Item>
          )}
        />
        <Modal visible={this.state.showModal} footer={null} onCancel={()=>this.hideModal()}>
          <img alt="example" style={{ width: '100%' }} src={this.state.imageUrl} />
        </Modal>
        </ResultContainer>
      )
  }
}