import React from "react";
import {withRouter} from 'dva/router';
import styled from "styled-components";
import FAIcon from '@fortawesome/react-fontawesome'
import faSolid from '@fortawesome/fontawesome-free-solid'
import { Menu, Icon,Button } from 'antd';
import 'antd/dist/antd.css';
import {OVERVIEW_URL,HISTORY_URL,OPTIONS_URL,ABOUT_URL} from "../../common/navURL.js";
import {Link,Router} from 'react-router-dom';
const NooboxContainer = styled.div`
  width: 480px;
`;
class Noobox extends React.Component{

  render(){
    const{match} = this.props;
    console.log(faSolid);
    console.log(OVERVIEW_URL);
    return(
      <NooboxContainer>
        <Button type = "danger">Test</Button>
        {/* <Menu mode="horizontal">
          <Menu.Item key="Overview">
            <Icon type="mail" />
            <Link to={OVERVIEW_URL}>
              Overview
            </Link>
          </Menu.Item>
          <Menu.Item key="UserHistory">
            <Icon type="mail" />
            <Link to={HISTORY_URL}>
              UserHistory
            </Link>
          </Menu.Item>
          <Menu.Item key="Options">
            <Icon type="mail" />
            <Link to={OPTIONS_URL}>
              Options
            </Link>
          </Menu.Item>
          <Menu.Item key="About">
            <Icon type="mail" /> 
            <Link to={ABOUT_URL}>
              About
            </Link>
          </Menu.Item>
        </Menu> */}
        {/* {this.props.children} */}
      </NooboxContainer>
    )
  }
}
export default withRouter(Noobox)