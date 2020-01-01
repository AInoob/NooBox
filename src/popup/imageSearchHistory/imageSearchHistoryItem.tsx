import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import { IImageSearchRecord } from '../../dao/imageSearchDao';
import { ENGINE_LIST, getEngineImageUrl } from '../../utils/constants';
import { getI18nMessage } from '../../utils/getI18nMessage';
import { openSearchResultTab } from '../../utils/openSearchResultTab';
import { ImageSearchHistoryStore } from '../stores/imageSearchHistoryStore';

interface IImageSearchHistoryItemProps {
  imageSearchRecord: IImageSearchRecord;
}

interface IImageSearchHistoryItemInjectedProps {
  imageSearchHistoryStore: ImageSearchHistoryStore;
}

const IImageSearchHistoryItemDiv = styled.tr`
  .usedEngines {
    img {
      width: 14px;
      margin-right: 2px;
    }
  }
  .ant-card-bordered {
    max-width: 160px;
    margin: auto;
  }
  .ant-card-body {
    padding: 0;
  }
  .ant-card-actions > li > span {
    cursor: initial;
  }
  .historyImage {
    cursor: pointer;
  }
`;

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
    const usedEngine: any[] = [];
    let firstKeyword = '';
    if (result.searchImageInfo) {
      result.searchImageInfo.forEach((searchImageInfo) => {
        if (firstKeyword === '' && searchImageInfo.keyword !== '') {
          firstKeyword = searchImageInfo.keyword;
        }
        if (
          searchImageInfo.engine &&
          usedEngine.indexOf(searchImageInfo.engine) === -1
        ) {
          usedEngine.push(searchImageInfo.engine);
        }
      });
    }
    ENGINE_LIST.forEach((engine) => {
      if (
        usedEngine.indexOf(engine) === -1 &&
        result.engineStatus &&
        result.engineStatus[engine] !== 'disabled'
      ) {
        usedEngine.push(engine);
      }
    });

    return (
      <IImageSearchHistoryItemDiv>
        <td>
          <Card
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
              <Tooltip
                className='usedEngines'
                title={getI18nMessage('image_used_engine')}>
                {usedEngine.map((engine) => (
                  <img
                    alt={engine}
                    key={engine}
                    src={getEngineImageUrl(engine)}
                  />
                ))}
              </Tooltip>
            ]}
          />
        </td>
        <td>
          <Button
            onClick={() => imageSearchHistoryStore.delete(id)}
            type='danger'>
            <FontAwesomeIcon icon='trash' />
          </Button>
        </td>
      </IImageSearchHistoryItemDiv>
    );
  }
}
