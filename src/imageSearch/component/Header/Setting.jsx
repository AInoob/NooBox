import React from 'react';
import styled from 'styled-components';
import { Card, Tooltip, Radio, Button, Select } from 'antd';
import FAIcon from '@fortawesome/react-fontawesome';
import faSolid from '@fortawesome/fontawesome-free-solid';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { Meta } = Card;
// border: 1px solid #e8e8e8;
const SettingContainer = styled.div`
  background: white;
  padding: 12px 0 0 0;

  .displayMode {
    margin-bottom: 5px;
  }
  .sortSelection {
    margin-bottom: 5px;
  }
  .settingAction {
    height: 32px;
    button {
      float: right;
    }
  }
  .guessKeyword {
    margin-bottom: 5px;
  }
  .ant-radio-button-wrapper {
    height: 25px;
    line-height: 23px;
  }
  h3 {
    display: inline-block;
    width: 20%;
  }
`;
export default class Setting extends React.Component {
  generateImageInfo(imageInfo) {
    return imageInfo.map((item, index) => {
      if (item.keyword != '') {
        return (
          <RadioButton key={index} value={index}>
            <Tooltip placement="top" title={item.engine}>
              <a href={item.keywordLink} target="_blank">
                {item.keyword}
              </a>
            </Tooltip>
          </RadioButton>
        );
      }
    });
  }
  render() {
    const {
      updateDisplayMode,
      updateSortBy,
      updateSortByOrder,
      displayMode,
      sortBy,
      sortByOrder,
      imageInfo,
    } = this.props;
    // console.log(faSolid)
    let inited = true;
    return (
      <SettingContainer>
        <div className="sortSelection">
          <h3>{i18n('sort_by')}</h3>
          <RadioGroup
            onChange={e => updateSortBy(e.target.value)}
            defaultValue="relevance"
          >
            <RadioButton value="height">{i18n('height')}</RadioButton>
            <RadioButton value="width">{i18n('width')}</RadioButton>
            <RadioButton value="area">{i18n('area')}</RadioButton>
            <RadioButton value="relevance">{i18n('relevance')}</RadioButton>
          </RadioGroup>
        </div>
        <div className="displayMode">
          <h3>{i18n('display_mode')}</h3>
          <RadioGroup
            onChange={e => updateDisplayMode(e.target.value)}
            defaultValue={displayMode}
          >
            <RadioButton value={1}>{i18n('list')}</RadioButton>
            <RadioButton value={2}>{i18n('image_wall')}</RadioButton>
          </RadioGroup>
        </div>
        <div className="guessKeyword">
          <h3>{i18n('guessing_keyword')}</h3>
          <RadioGroup>{this.generateImageInfo(imageInfo)}</RadioGroup>
        </div>
      </SettingContainer>
    );
  }
}
