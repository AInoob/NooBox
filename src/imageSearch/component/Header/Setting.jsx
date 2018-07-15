import React from "react";
import styled from "styled-components";
import { Card,Tooltip,Radio,Button,Select} from 'antd';
import FAIcon from '@fortawesome/react-fontawesome';
import faSolid from '@fortawesome/fontawesome-free-solid';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { Meta } = Card;
const SettingContainer = styled.div`
  background:white;
  padding:24px 24px 22px 24px;
  border: 1px solid #e8e8e8;
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
    const{updateSetting} = this.props;
    // console.log(faSolid)
    let inited = true;
      return(
        <SettingContainer>
          <div className ="displayMode">
            <h3>{i18n("display_mode")}</h3>
            <RadioGroup onChange ={(e)=>updateSetting({displayMode:e.target.value})}>
              <Radio value={1}>{i18n("list")}</Radio>
              <Radio value={2}>{i18n("image_wall")}</Radio>
            </RadioGroup>
          </div>
          <div className ="sortSelection">
            <h3>{i18n("sort_by")}  <RadioGroup>  
                            <RadioButton value="area">{i18n("area")}</RadioButton>
                            <RadioButton value="width">{i18n("width")}</RadioButton>
                            <RadioButton value="height">{i18n("height")}</RadioButton>
                          </RadioGroup></h3>
            <RadioGroup>
              <Radio value={1}>{i18n("increase")}</Radio>
              <Radio value={2}>{i18n("decrease")}</Radio>
            </RadioGroup>
          </div>
          <div className = "settingAction">
            <Button type = "primary" style={{marginLeft:"10px"}}>{i18n("save")}</Button>
            <Button style={{marginLeft:"10px"}}>{i18n("clear")}</Button>
          </div>  
        </SettingContainer>
      )
  }
}