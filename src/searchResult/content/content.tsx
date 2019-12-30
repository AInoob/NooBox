import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Card, Col, List, Modal, Popover, Row } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import { OptionsStore } from '../../shared/stores/optionsStore';
import { getMinValueIndex } from '../../utils/arrayUtils';
import { getEngineImageUrl } from '../../utils/constants';
import { getI18nMessage } from '../../utils/getI18nMessage';
import { getImageHeight, getImageWidth } from '../../utils/searchResultUtils';
import { SearchResultStore } from '../stores/searchResultStore';

interface IContentInjectedProps {
  searchResultStore: SearchResultStore;
  optionsStore: OptionsStore;
}

const ContentDiv = styled.div`
  background-color: white;
  margin: 16px;
  .searchEngine {
    width: 40px;
    height: 40px;
  }
  .zoomImage {
    cursor: pointer;
  }
  .ant-list-items {
    padding-inline-start: 0;
    padding-left: 90px;
    padding-right: 90px;
  }
  .ant-list-item-action {
    li {
      cursor: initial;
    }
  }
  .imageFound {
    max-width: 200px;
    max-height: 400px;
    cursor: pointer;
  }
  .cardMetaWrapper {
    position: absolute;
    left: 4px;
    bottom: 6px;
  }
  .ant-card-body {
    padding: 0;
  }
`;

@inject('searchResultStore', 'optionsStore')
@observer
export class Content extends React.Component {
  get injected() {
    return (this.props as any) as IContentInjectedProps;
  }

  constructor(props: any) {
    super(props);
  }

  public render() {
    const { searchResultStore, optionsStore } = this.injected;
    const { modelImageUrl, modelImageWidth, modelOpened } = searchResultStore;
    const { options } = optionsStore;
    const { displayMode } = options;
    return (
      <ContentDiv>
        <Modal
          className='imageZoomedModal'
          width={modelImageWidth + 94 + 'px'}
          style={{ maxWidth: '90%' }}
          visible={modelOpened}
          footer={null}
          onCancel={() => searchResultStore.closeImageModel()}>
          <img alt='Image' style={{ maxWidth: '100%' }} src={modelImageUrl} />
        </Modal>
        {displayMode === 1 && this.getListView()}
        {displayMode === 2 && this.getWallView()}
      </ContentDiv>
    );
  }

  private getSortedList() {
    const { searchResultStore, optionsStore } = this.injected;
    const { result } = searchResultStore;
    const { options } = optionsStore;
    const { sortBy } = options;
    return (result.searchResult || []).slice().sort((a, b) => {
      switch (sortBy) {
        case 'area':
          return (
            getImageWidth(b) * getImageHeight(b) -
            getImageWidth(a) * getImageHeight(a)
          );
        case 'width':
          return getImageWidth(b) - getImageHeight(a);
        case 'height':
          return getImageHeight(b) - getImageHeight(a);
        case 'relevance':
          return b.weight - a.weight;
      }
    });
  }

  private getWallView() {
    const { searchResultStore } = this.injected;
    const columnNum = 6;
    const columnsHeight = Array(columnNum).fill(0);
    const columns: any[][] = Array(columnNum)
      .fill(0)
      .map(() => {
        return [];
      });
    const resultList = this.getSortedList();
    resultList.forEach((result, i) => {
      const height = getImageHeight(result) / getImageWidth(result);
      const index = getMinValueIndex(columnsHeight);
      columnsHeight[index] = columnsHeight[index] + height;

      columns[index].push(
        <Popover
          key={i}
          content={
            <div>
              {getImageWidth(result) === 1 ? (
                <p>{getI18nMessage('no_size_info')}</p>
              ) : (
                <p>{result.imageInfo.width + '✕' + result.imageInfo.height}</p>
              )}
              {result.description}
            </div>
          }
          title={
            <div>
              <a target='_blank' href={result.sourceUrl}>
                {result.title}
              </a>
            </div>
          }>
          <Card
            hoverable={true}
            style={{ width: '100%', minHeight: 60 }}
            cover={
              <img
                alt='Image Is Dead, Sorry'
                src={result.imageUrl}
                onClick={() =>
                  searchResultStore.openImageModel(result.imageUrl)
                }
                onError={(e: any) => {
                  e.target.src = 'images/404.png';
                }}
              />
            }>
            <div className='cardMetaWrapper'>
              <Card.Meta
                avatar={<Avatar src={getEngineImageUrl(result.searchEngine)} />}
              />
            </div>
          </Card>
        </Popover>
      );
    });
    const wall = columns.map((resultListD, index) => {
      return (
        <Col key={index} span={4}>
          {resultListD}
        </Col>
      );
    });
    return <Row>{wall}</Row>;
  }

  private getListView() {
    const { searchResultStore } = this.injected;
    return (
      <List
        itemLayout='vertical'
        size='large'
        dataSource={this.getSortedList()}
        renderItem={(item) => (
          <List.Item
            key={item.title}
            actions={[
              <FontAwesomeIcon
                className='zoomImage'
                icon='search-plus'
                onClick={() => searchResultStore.openImageModel(item.imageUrl)}
              />,
              getImageWidth(item) === 1 ? (
                <p>{getI18nMessage('no_size_info')}</p>
              ) : (
                <p className='sizeInfo'>
                  {item.imageInfo.height + ' ✕ ' + item.imageInfo.width}
                </p>
              ),
              <img
                alt={item.searchEngine}
                className='searchEngine'
                src={getEngineImageUrl(item.searchEngine)}
              />
            ]}
            extra={
              <img
                className='imageFound'
                alt='Image Is Dead, Sorry'
                onClick={() => searchResultStore.openImageModel(item.imageUrl)}
                src={item.imageUrl}
              />
            }>
            <List.Item.Meta
              title={
                <a href={item.sourceUrl} target='_blank'>
                  {item.title}
                </a>
              }
            />
            {item.description}
          </List.Item>
        )}
      />
    );
  }
}
