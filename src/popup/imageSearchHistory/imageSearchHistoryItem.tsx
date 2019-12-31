import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import { IImageSearchRecord } from '../../dao/imageSearchDao';
import { getEngineImageUrl } from '../../utils/constants';
import { getI18nMessage } from '../../utils/getI18nMessage';
import { openSearchResultTab } from '../../utils/openSearchResultTab';
import { ImageSearchHistoryStore } from '../stores/imageSearchHistoryStore';

interface IImageSearchHistoryItemProps {
  imageSearchRecord: IImageSearchRecord;
}

interface IImageSearchHistoryItemInjectedProps {
  imageSearchHistoryStore: ImageSearchHistoryStore;
}

const IImageSearchHistoryItemDiv = styled.div``;

@inject('imageSearchHistoryStore')
@observer
export class ImageSearchHistoryItem extends React.Component<
  IImageSearchHistoryItemProps
> {
  get injected() {
    return (this.props as any) as IImageSearchHistoryItemInjectedProps;
  }

  constructor(props: any) {
    super(props);
  }

  public render() {
    const { imageSearchHistoryStore } = this.injected;
    const { imageSearchRecord } = this.props;
    const { result, id } = imageSearchRecord;
    const usedEngine: any = [];
    let firstKeyword = '';
    if (result.searchImageInfo) {
      result.searchImageInfo.forEach((searchImageInfo, index) => {
        if (firstKeyword === '' && searchImageInfo.keyword !== '') {
          firstKeyword = searchImageInfo.keyword;
        }
        if (searchImageInfo.engine) {
          usedEngine.push(
            <img
              key={index}
              style={{ width: 14, marginRight: 2 }}
              src={getEngineImageUrl(searchImageInfo.engine)}
            />
          );
        }
      });
    }

    return (
      <IImageSearchHistoryItemDiv>
        <Card
          style={{ width: '164px', margin: 'auto' }}
          cover={
            <img
              className='historyImage'
              src={result.base64 || result.url}
              onClick={async () => openSearchResultTab(id)}
            />
          }
          actions={[
            <Tooltip title={getI18nMessage('image_first_keyword')}>
              {firstKeyword}
            </Tooltip>,
            <Tooltip title={getI18nMessage('image_used_engine')}>
              {usedEngine}
            </Tooltip>
          ]}
        />
        <Button
          onClick={() => imageSearchHistoryStore.delete(id)}
          type='danger'>
          <FontAwesomeIcon icon='trash' />
        </Button>
      </IImageSearchHistoryItemDiv>
    );
  }
}
