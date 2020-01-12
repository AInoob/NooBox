import { Divider, Radio, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';
import { OptionsStore } from '../../shared/stores/optionsStore';
import { getI18nMessage } from '../../utils/getI18nMessage';
import { SearchResultStore } from '../stores/searchResultStore';

interface IActionBarInjectedProps {
  searchResultStore: SearchResultStore;
  optionsStore: OptionsStore;
}

const ActionBarDiv = styled.div`
  padding: 4px 16px;
  #displayMode {
    margin-top: 8px;
  }
  span + .ant-radio-group {
    margin-left: 16px;
  }
  .ant-divider-horizontal {
    margin: 8px 0;
  }
  #keyword {
    a {
      margin-left: 16px;
    }
  }
  #updateSearchResult {
    margin-top: 8px;
  }
`;

@inject('searchResultStore', 'optionsStore')
@observer
export class ActionBar extends React.Component {
  get injected() {
    return (this.props as any) as IActionBarInjectedProps;
  }

  public render() {
    const { optionsStore, searchResultStore } = this.injected;
    const { options } = optionsStore;
    const { displayMode, sortBy, updateSearchResult } = options;
    const { result } = searchResultStore;
    const { searchImageInfo } = result;
    return (
      <ActionBarDiv>
        <div id='sortSelection'>
          <span>{getI18nMessage('sort_by')}</span>
          <Radio.Group
            onChange={(e) => optionsStore.update('sortBy', e.target.value)}
            value={sortBy}>
            <Radio.Button value='height'>
              {getI18nMessage('height')}
            </Radio.Button>
            <Radio.Button value='width'>{getI18nMessage('width')}</Radio.Button>
            <Radio.Button value='area'>{getI18nMessage('area')}</Radio.Button>
            <Radio.Button value='relevance'>
              {getI18nMessage('relevance')}
            </Radio.Button>
          </Radio.Group>
        </div>

        <div id='displayMode'>
          <span>{getI18nMessage('display_mode')}</span>
          <Radio.Group
            onChange={async (e) => {
              await optionsStore.update('displayMode', e.target.value);
            }}
            value={displayMode}>
            <Radio.Button value={1}>{getI18nMessage('list')}</Radio.Button>
            <Radio.Button value={2}>
              {getI18nMessage('image_wall')}
            </Radio.Button>
          </Radio.Group>
        </div>

        <div id='updateSearchResult'>
          <span>{getI18nMessage('enable_image_preload')}</span>
          <Radio.Group
            onChange={async (e) => {
              await optionsStore.update('updateSearchResult', e.target.value);
            }}
            value={updateSearchResult}>
            <Radio.Button value='yes'>{getI18nMessage('yes')}</Radio.Button>
            <Radio.Button value='no'>{getI18nMessage('no')}</Radio.Button>
          </Radio.Group>
        </div>

        <Divider />
        <div id='keyword'>
          <span>{getI18nMessage('guessing_keyword')}</span>
          {(searchImageInfo || []).map((item, index) => {
            if (item.keyword) {
              return (
                <Tooltip key={index} placement='top' title={item.engine}>
                  <a href={item.keywordLink} target='_blank'>
                    {item.keyword}
                  </a>
                </Tooltip>
              );
            }
            return null;
          })}
        </div>
      </ActionBarDiv>
    );
  }
}
