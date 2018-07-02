import React from "react";
import styled from "styled-components";
import { Card,Tooltip } from 'antd';
import FAIcon from '@fortawesome/react-fontawesome';
import faSolid from '@fortawesome/fontawesome-free-solid';
const { Meta } = Card;
const SettingContainer = styled.div`

`;
export default class Setting extends React.Component{
  render(){
    console.log(faSolid)
    let inited = true;
      return(
        <SettingContainer>
           Setting
        </SettingContainer>
      )
  }
}