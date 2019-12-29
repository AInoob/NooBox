import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import { getI18nMessage } from '../../utils/getI18nMessage';
import { SearchResultStore } from '../stores/searchResultStore';

interface IBriefInjectedProps {
  searchResultStore: SearchResultStore;
}

const BriefDiv = styled.div`
  .actionItem {
    display: block;
    height: 100%;
    width: 100%;
  }
  .ant-card-body {
    padding: 0;
  }
  .ant-card-actions {
    position: absolute;
    border: 0;
    bottom: 0;
    width: 100%;
    background: rgba(232, 232, 232, 0.5);
    li {
      margin: 0;
      color: rgba(0, 0, 0, 20);
    }
  }
`;

@inject('searchResultStore')
@observer
export class Brief extends React.Component {
  get injected() {
    return (this.props as any) as IBriefInjectedProps;
  }

  constructor(props: any) {
    super(props);
  }

  public render() {
    const { searchResultStore } = this.injected;
    const { result } = searchResultStore;
    const { url, base64 } = result;
    const actions = [];
    actions.push(this.getSearchAgainActionItem());
    if (!base64) {
      actions.push(this.getUploadSearchActionItem());
    }
    return (
      <BriefDiv>
        <Card
          style={{ width: '100%' }}
          cover={
            <img
              id='searchImage'
              alt='image searched'
              src={base64 ? base64 : url}
            />
          }
          actions={actions}
        />
      </BriefDiv>
    );
  }

  private getSearchAgainActionItem() {
    return (
      <span
        className='actionItem'
        onClick={() => {
          console.log('yoyoyo');
        }}>
        <Tooltip
          placement='top'
          title={getI18nMessage('search_again')}
          key='action_1'>
          <FontAwesomeIcon icon='retweet' />
        </Tooltip>
      </span>
    );
  }

  private getUploadSearchActionItem() {
    return (
      <span
        className='actionItem'
        onClick={() => {
          console.log('yoyoyo');
        }}>
        <Tooltip
          placement='top'
          title={getI18nMessage('upload_search')}
          key='action_2'>
          <FontAwesomeIcon icon='upload' />
        </Tooltip>
      </span>
    );
  }
}
