import React from "react";
import styled from "styled-components";
import { Collapse,Alert, List, Avatar,Icon  } from 'antd';

const Panel = Collapse.Panel;

const AboutContainer = styled.div`
  margin:20px;
  .ant-collapse{
    border-radius: 0;
  }
  .privacyInfo{
    padding:12px;
    background: #f7f7f7;
    border-radius: 0;
    border: 0;
  }
`;
const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 0,
  border: 0,
  padding:0,
  overflow: 'hidden',
};
const privacyData =[
  {
    title: i18n("about_privacy_message_0"),
    description : i18n("about_privacy_message_1"),
    type :"1"
  },
  {
    title: i18n("about_privacy_message_2"),
    description : i18n("about_privacy_message_3"),
    type :"1"
  },
  {
    title: i18n("about_privacy_message_4"),
    description : i18n("about_privacy_message_5"),
    type :"1"
  },
  {
    title: i18n("about_privacy_message_6"),
    description : i18n("about_privacy_message_7"),
    type :"2"
  },
];
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
            <List
              itemLayout="horizontal"
              dataSource={privacyData}
              renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={item.type == "1" ? <Avatar ><Icon type="exclamation" /></Avatar> :<Avatar><Icon type="check" /></Avatar>}
                  title={item.title}
                  description={item.description}
                />
                </List.Item>
              )}
            />
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