import React from "react";
import styled from "styled-components";
import {connect} from 'dva';
import reduxActions from "SRC/popup/reduxActions.js";
import reselector   from "SRC/popup/reselector.js";
import { Collapse, Alert, List, Avatar,Icon  } from 'antd';
import io from 'socket.io-client';
import Loader from "SRC/common/component/Loader.jsx";

const Panel = Collapse.Panel;

const AboutContainer = styled.div`
  margin:10px;
  .ant-collapse{
    border-radius: 0;
  }
  .privacyInfo{
    padding:12px;
    background: #f7f7f7;
    border-radius: 0;
    border: 0;
  }
  .ant-alert{
    width:100%;
    padding:5px;
    span{
      text-align:left;
      padding-left:20px; 
    }
  }
  #realTimeDataList{
    list-style: none;
    padding-left: 10px;
    .data{
      font-size: 20px;
      font-weight: 1000;
    }
  }
  #developer{
    border-bottom: 1px solid #e8e8e8;
    .ant-list-item{
      display:inline-block;
      border:0;
    }
  }

`;
const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 0,
  border: 0,
  padding:0,
  overflow: 'hidden',
};
const privacyData = [
  {
    title: "1." + i18n("about_privacy_message_0"),
    description: i18n("about_privacy_message_1"),
    type: "1"
  },
  {
    title: "2." + i18n("about_privacy_message_2"),
    description: i18n("about_privacy_message_3"),
    type: "1"
  },
  {
    title: "3." +i18n("about_privacy_message_4"),
    description: i18n("about_privacy_message_5"),
    type: "1"
  },
  {
    title: "4." +i18n("about_privacy_message_6"),
    description: i18n("about_privacy_message_7"),
    type: "2"
  },
];

const specialThanks = [{
  title: i18n('about_contribution_zhtw2013'),
  description: i18n('about_contribution_zhtw2013_description'),
  icon: 'https://avatars1.githubusercontent.com/u/9501406?s=100&v=4',
  link: 'https://github.com/zhtw2013'
}];
const mainContributor =[{
  title: i18n('about_contribution_george'),
  description: i18n('about_contribution_grorge_description'),
  icon: 'https://avatars0.githubusercontent.com/u/12090689?s=100&v=4',
  link: 'https://github.com/RageCoke1466'
},{
  title: i18n('about_contribution_ainoob'),
  description: i18n('about_contribution_ainoob_description'),
  icon: 'https://ainoob.com/favicon/apple-icon-120x120.png',
  link: 'https://github.com/AInoob',
}]
const sideContributor =[];
class About extends React.Component {
  componentDidMount(){
    const{about,actions} = this.props;
    if(!about.inited){
      actions.aboutInit();
    }
  }
  setupSocket(actions) {
    window.socket.on('imageSearch', type =>
      actions("imageSearch"));
    window.socket.on('extractImage', type => 
      actions("extractImage"));
    window.socket.on('screenshotSearch', type => 
      actions("screenshotSearch"));
    window.socket.on('videoControl', type => 
      actions("videoControl"));
    window.socket.on('autoRefresh', type => 
      actions("autoRefresh"));
  }

  render(){
    const{about,actions} = this.props;
    if(!about.inited){
      return(
        <Loader style ={{marginTop: "20%"}}/>
      )
    }else{
      if (!about.socketListener) {
        actions.updateState({ socketListener: true });
        this.setupSocket(actions.plusOne)
      }
      return(
        <AboutContainer>
          <Collapse defaultActiveKey={['3']}>
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
                    {item.type == "1"  ? <Alert message = {item.title} description={item.description} type="error"  /> :
                   <Alert message = {item.title} description={item.description} type="success" />
                  }
                  </List.Item>
                )}
              />
            </Panel>
            <Panel header = {i18n("about_data")} key="3">
              <div id = "developer">
                <List
                    itemLayout="horizontal"
                    dataSource={mainContributor}
                    renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                          avatar={<Avatar src={item.icon} />}
                          title={<a href={item.link}>{item.title}</a>}
                          description={item.description}
                      />
                     </List.Item>
                      )}
                    />
                </div>
                <ul id = "realTimeDataList">
                  <li>{i18n('imageSearch')} : <span className ="data">{about.imageSearch}</span></li>
                  <li>{i18n('extractImages')} : <span className ="data">{about.extractImage}</span></li>
                  <li>{i18n('screenshotSearch')} : <span className ="data">{about.screenshotSearch}</span></li>
                  <li>{i18n('videoControl')} : <span className ="data">{about.videoControl}</span></li>
                  <li>{i18n('autoRefresh')} : <span className ="data">{about.autoRefresh}</span></li>
                </ul>
            </Panel>
            <Panel header = {i18n("about_contribution")} key="4">
              <List
                itemLayout="horizontal"
                dataSource={specialThanks}
                renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.icon} />}
                    title={<a href={item.link}>{item.title}</a>}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Panel>

          <Panel header = {i18n("about_feedback")} key="5">
            <p><a href="https://github.com/AInoob/NooBox/issues">{i18n("about_feedback_message")}</a></p>
          </Panel>
        </Collapse>
      </AboutContainer>
    )
    }
  }
}

export default connect(reselector, reduxActions)(About);