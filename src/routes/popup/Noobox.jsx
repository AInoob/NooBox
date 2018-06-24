import React from "react";
import {withRouter} from 'dva/router';
//redux
import {connect} from 'dva';
import reduxActions from "SRC/modelsViewsConnentor/reduxActions.js";
import reselector   from "SRC/modelsViewsConnentor/reselector.js";


import styled from "styled-components";
import FAIcon from '@fortawesome/react-fontawesome'
import faSolid from '@fortawesome/fontawesome-free-solid'
import { Menu } from 'antd';
import {OVERVIEW_URL,HISTORY_URL,OPTIONS_URL,ABOUT_URL} from "../../constant/navURL.js";
import {Link,Router,Redirect} from 'react-router-dom';

const NooboxContainer = styled.div`
  width: 360px;
  .ant-menu-item{
    text-align:center;
    width: 25%;
    font-size: 14pt;
  }

`;
class Noobox extends React.Component{
  componentWillMount(){
    let {match,history} = this.props;
    if(match.url == "/"){
      history.push(OVERVIEW_URL);
    }
  }
  render(){
    const{match,actions} = this.props;
    console.log(this.props);
    // console.log(match);
    // console.log(faSolid);
    return(
      <NooboxContainer>
        {/* <Button type = "danger">Test</Button> */}
        <Menu
          mode="horizontal"
        >
          <Menu.Item key="Overview">
            <Link to={OVERVIEW_URL}>
            <FAIcon icon ={faSolid.faToolbox}/>
            </Link>
          </Menu.Item>
          <Menu.Item key="UserHistory">
            <Link to={HISTORY_URL}>
            <FAIcon icon ={faSolid.faHistory}/>
            </Link>
          </Menu.Item>
          <Menu.Item key="Options">
            <Link to = {OPTIONS_URL}>
            <FAIcon icon ={faSolid.faCog}/>
            </Link>
          </Menu.Item>
          <Menu.Item key="About">
            <Link to={ABOUT_URL}>
            <FAIcon icon ={faSolid.faQuestion}/>
            </Link>
          </Menu.Item>
        </Menu>
        {this.props.children}
      </NooboxContainer>
    )
  }
}
export default withRouter(connect(reselector, reduxActions)(Noobox));
