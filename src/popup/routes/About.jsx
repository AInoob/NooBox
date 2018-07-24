import React from "react";
import styled from "styled-components";
import { Collapse,Alert } from 'antd';
const Panel = Collapse.Panel;

const AboutContainer = styled.div`
  margin:20px;
  .ant-collapse{
    border-radius: 0;
  }
`;

export default class About extends React.Component{
  render(){
    console.log(i18n("about_what"));
    return(
      <AboutContainer>
        <Collapse>
          <Panel header = {i18n("about_what")} key="1">
            <h3>{i18n("about_what_message_0")}</h3>
            <ul>
              <li>{i18n("about_what_message_1")}</li>
              <li>{i18n("about_what_message_2")}</li>
              <li>{i18n("about_what_message_3")}</li>
            </ul>
          </Panel>
          <Panel header = {i18n("about_privacy")} key="2">
            <Collapse bordered={false}>
              <Panel header = {i18n("about_privacy_message_0")} key="1" showArrow={false}>
                <Alert message ={i18n("about_privacy_message_1")}style={{ paddingLeft: 36 }} type="error" showIcon/>
              </Panel>
              <Panel header = {i18n("about_privacy_message_2")} key="2" showArrow={false}>
                <Alert message ={i18n("about_privacy_message_3")}sage style={{ paddingLeft: 36 }} type="error" showIcon/>
              </Panel>
              <Panel header = {i18n("about_privacy_message_4")} key="3" showArrow={false}>
              <Alert message = {i18n("about_privacy_message_5")} style={{ paddingLeft: 36 }} type="error" showIcon/>
              </Panel>
            </Collapse>
          </Panel>
          <Panel header = {i18n("about_development")} key="3">
            test3
          </Panel>
          <Panel header = {i18n("about_feedback")} key="4">
            test4
          </Panel>
        </Collapse>
      </AboutContainer>
    )
  }
}