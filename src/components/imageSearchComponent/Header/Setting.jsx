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
    console.log(faSolid)
    let inited = true;
      return(
        <SettingContainer>
          <div className ="displayMode">
            <h3>Display Mode</h3>
            <RadioGroup>
              <Radio value={1}>List</Radio>
              <Radio value={2}>Image Wall</Radio>
            </RadioGroup>
          </div>
          <div className ="sortSelection">
            <h3>Sort By  <RadioGroup>  
                            <RadioButton value="area">Area</RadioButton>
                            <RadioButton value="width">Width</RadioButton>
                            <RadioButton value="height">Height</RadioButton>
                          </RadioGroup></h3>
            <RadioGroup>
              <Radio value={1}>Increase</Radio>
              <Radio value={2}>Decrease</Radio>
            </RadioGroup>
          </div>
          <div className = "settingAction">
            <Button type = "primary" style={{marginLeft:"10px"}}>Save</Button>
            <Button style={{marginLeft:"10px"}}>Clear</Button>
          </div>  
        </SettingContainer>
      )
  }
}