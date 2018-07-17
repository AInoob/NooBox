import React from "react";
import styled from "styled-components";
import { Card,Tooltip,Radio,Button,Select} from 'antd';
import FAIcon from '@fortawesome/react-fontawesome';
import faSolid from '@fortawesome/fontawesome-free-solid';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { Meta } = Card;
  // border: 1px solid #e8e8e8;
const SettingContainer = styled.div`
  background:white;
  padding:24px 24px 22px 24px;

  .displayMode{
    margin-bottom: 15px;
  }
  .sortSelection{
    margin-bottom: 15px;
  }
  .settingAction{
    height: 32px;
    button{
      float:right;
    }
  }
  .ant-radio-button-wrapper{
    height: 25px;
    line-height: 23px;
  }
`;
export default class Setting extends React.Component{
  render(){
    const{updateDisplayMode,updateSortBy,updateSortByOrder,displayMode,sortBy,sortByOrder} = this.props;
    // console.log(faSolid)
    let inited = true;
      return(
        <SettingContainer>
          <div className ="displayMode">
            <h3>{i18n("display_mode")}</h3>
            <RadioGroup onChange ={(e)=>updateDisplayMode(e.target.value)} defaultValue = {displayMode}>
              <Radio value={1}>{i18n("list")}</Radio>
              <Radio value={2}>{i18n("image_wall")}</Radio>
            </RadioGroup>
          </div>
          <div className ="sortSelection">
            <h3>{i18n("sort_by")}  
              <RadioGroup onChange ={(e) =>updateSortBy(e.target.value)} defaultValue = {sortBy}>  
                <RadioButton value="height">{i18n("height")}</RadioButton>
                <RadioButton value="width">{i18n("width")}</RadioButton>
                <RadioButton value="area">{i18n("area")}</RadioButton>
              </RadioGroup>
            </h3>
            <RadioGroup onChange ={(e) => updateSortByOrder(e.target.value)} defaultValue = {sortByOrder}>
              <Radio value={1}>{i18n("increase")}</Radio>
              <Radio value={2}>{i18n("decrease")}</Radio>
            </RadioGroup>
          </div> 
        </SettingContainer>
      )
  }
}