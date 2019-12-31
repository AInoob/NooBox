import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Popconfirm } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import { getI18nMessage } from '../utils/getI18nMessage';
import { ImageSearchHistoryItem } from './imageSearchHistory/imageSearchHistoryItem';
import { ImageSearchHistoryStore } from './stores/imageSearchHistoryStore';

interface IImageSearchHistoryInjectedProps {
  imageSearchHistoryStore: ImageSearchHistoryStore;
}

const ImageSearchHistoryDiv = styled.div``;

@inject('imageSearchHistoryStore')
@observer
export class ImageSearchHistory extends React.Component {
  get injected() {
    return (this.props as any) as IImageSearchHistoryInjectedProps;
  }

  constructor(props: any) {
    super(props);
  }

  public render() {
    const { imageSearchHistoryStore } = this.injected;
    const { imageSearchList } = imageSearchHistoryStore;
    const deleteAll = (
      <Popconfirm
        title={getI18nMessage('clear_all') + ' ?'}
        onConfirm={() => imageSearchHistoryStore.deleteAll()}
        placement='left'>
        <div style={{ maxWidth: 100, margin: 'auto' }}>
          <Button type='danger'>
            <FontAwesomeIcon icon='trash' />
          </Button>
        </div>
      </Popconfirm>
    );
    return (
      <ImageSearchHistoryDiv>
        <div id='imageSearchList'>
          <span>{getI18nMessage('history')}</span>
          {deleteAll}
          {imageSearchList.map((imageSearchRecord) => {
            return (
              <ImageSearchHistoryItem
                key={imageSearchRecord.id}
                imageSearchRecord={imageSearchRecord}
              />
            );
          })}
        </div>
      </ImageSearchHistoryDiv>
    );
  }
}
