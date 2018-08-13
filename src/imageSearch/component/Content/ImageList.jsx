import React from "react";
import styled from "styled-components";
import FAIcon from '@fortawesome/react-fontawesome';
import faSolid from '@fortawesome/fontawesome-free-solid';
import {engineIcon} from "SRC/constant/settingMap.js";
import {dogeLoading} from "ASSET/funSh*t/dogeLoading.gif";
import {Row,Col,Icon,List,Avatar,Modal} from 'antd';
const ResultContainer = styled.div`
  background:white;
  padding:36px;
  border: 1px solid #e8e8e8;
  margin-top:20px;
  #dogeLoading{
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
  }
  .searchEngine{
    width:20px;
    height:20px;
  }
  .searchImage{
    width:250px;
  }
  .sizeInfo{
    margin:0;
  }
  .ant-list-item-main{
    order:2
    padding-left: 10%;
  }
  .ant-list-item-extra{
    order:1
  }
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
    if(imageDataList.length > 0){
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
              actions={[<FAIcon onClick={()=> this.showModal(item.imageUrl)}icon ={faSolid.faSearchPlus} />,
                        item.imageInfo.width == -1? <p>{i18n("no_size_info")}</p>: <p className = "sizeInfo">{item.imageInfo.height +" x "+ item.imageInfo.width}</p>,
                        <img className = "searchEngine" src={engineIcon[item["searchEngine"]]} />]}
              extra={<img className ="searchImage" alt="Image Is Dead, Sorry" src={item.thumbUrl} />}
            >
             <List.Item.Meta
                title={<a href={item.sourceUrl} target="_blank">{item.title}</a>}
              />
              {item.description}
            </List.Item>
          )}
        />
        <Modal visible={this.state.showModal} footer={null} onCancel={()=>this.hideModal()}>
          <img alt="Image Down Sorry" style={{ width: '100%' }} src={this.state.imageUrl} />
        </Modal>
        </ResultContainer>
      )
    }else{
      return (<ResultContainer>
        <img id ="dogeLoading" src = "./static/funSh*t/dogeLoading.gif"/>
      </ResultContainer>)
    }
  }
}