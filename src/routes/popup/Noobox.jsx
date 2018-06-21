import React from "react";
import {withRouter} from 'dva/router';
import styled from "styled-components";
import FAIcon from '@fortawesome/react-fontawesome'
import faSolid from '@fortawesome/fontawesome-free-solid'
import { Menu, Icon,Button } from 'antd';
import 'antd/dist/antd.css';
import {OVERVIEW_URL,HISTORY_URL,OPTIONS_URL,ABOUT_URL} from "../../common/navURL.js";
import {Link,Router,Redirect} from 'react-router-dom';
const NooboxContainer = styled.div`
  width: 520px;
`;
class Noobox extends React.Component{
  componentWillMount(){
    let {match,history} = this.props;
    if(match.url == "/"){
      history.push(OVERVIEW_URL);
    }
  }
  render(){
    const{match} = this.props;
    console.log(match);
    console.log(faSolid);
    console.log(OVERVIEW_URL);

    return(
      <NooboxContainer>
        {/* <Button type = "danger">Test</Button> */}
        <Menu 
          mode="horizontal"
        >
          <Menu.Item key="Overview">
            <Link to={OVERVIEW_URL}>
            <Icon type="mail" />
              Overview
            </Link>
          </Menu.Item>
          <Menu.Item key="UserHistory">
            <Link to={HISTORY_URL}>
            <Icon type="mail" /> 
              UserHistory
            </Link>
          </Menu.Item>
          <Menu.Item key="Options">
            <Link to={OPTIONS_URL}>
            <Icon type="mail" />
              Options
            </Link>
          </Menu.Item>
          <Menu.Item key="About">
            <Link to={ABOUT_URL}>
            <Icon type="mail" /> 
              About
            </Link>
          </Menu.Item>
        </Menu>
        {this.props.children}
      </NooboxContainer>
    )
  }
}
export default withRouter(Noobox)