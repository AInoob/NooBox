import React from 'react';
import styled from 'styled-components';
import FAIcon from '@fortawesome/react-fontawesome';
import faSolid from '@fortawesome/fontawesome-free-solid';
import { engineIcon } from 'SRC/constant/settingMap.js';
import { Row, Col, Icon, List, Avatar, Modal } from 'antd';
import Loader from 'SRC/common/component/Loader.jsx';
import ImageLost from 'SRC/assets/fun/ImageLost.png';
const ResultContainer = styled.div`
  background:white;
  border: 1px solid #e8e8e8;
  #dogeLoading{
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
  }
  .searchEngine{
    width:40px;
    height:40px;
  }
  .searchImage{
    width:200px;
  }
  .searchImage:hover{
    cursor: zoom-in;
  }
  .sizeInfo{
    margin:0;
  }
  .ant-list-item-main{
    order:2
    padding-left: 5%;
    padding-right: 10%;
    li{
      font-size: 18px;
    }
  }
  .ant-list-item-extra{
    order:1
  }
`;
export default class ImageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      imageUrl: '',
    };
  }
  showModal(sourceUrl) {
    this.setState({
      showModal: true,
      imageUrl: sourceUrl,
    });
  }
  hideModal() {
    this.setState({
      showModal: false,
    });
  }
  imgError(e) {
    e.target.src = ImageLost;
  }
  render() {
    let { imageDataList } = this.props;
    if (imageDataList.length > 0) {
      return (
        <ResultContainer>
          <List
            itemLayout="vertical"
            size="large"
            dataSource={imageDataList}
            footer={<div>Noobox</div>}
            renderItem={item => (
              <List.Item
                key={item.title}
                actions={[
                  <FAIcon
                    onClick={() => this.showModal(item.imageUrl)}
                    icon={faSolid.faSearchPlus}
                  />,
                  item.imageInfo.width == -1 ? (
                    <p>{i18n('no_size_info')}</p>
                  ) : (
                    <p className="sizeInfo">
                      {item.imageInfo.height + ' x ' + item.imageInfo.width}
                    </p>
                  ),
                  <img
                    className="searchEngine"
                    src={engineIcon[item['searchEngine']]}
                  />,
                ]}
                extra={
                  <img
                    className="searchImage"
                    alt="Image Is Dead, Sorry"
                    onClick={() => this.showModal(item.imageUrl)}
                    src={item.imageUrl}
                    onError={e => this.imgError(e)}
                  />
                }
              >
                <List.Item.Meta
                  title={
                    <a href={item.sourceUrl} target="_blank">
                      {item.title}
                    </a>
                  }
                />
                {item.description}
              </List.Item>
            )}
          />
          <Modal
            visible={this.state.showModal}
            footer={null}
            onCancel={() => this.hideModal()}
          >
            <img
              alt="Image Down Sorry"
              style={{ width: '100%' }}
              src={this.state.imageUrl}
              onError={e => this.imgError(e)}
            />
          </Modal>
        </ResultContainer>
      );
    } else {
      return (
        <ResultContainer>
          <Loader style={{ marginTop: '5%' }} />
        </ResultContainer>
      );
    }
  }
}
