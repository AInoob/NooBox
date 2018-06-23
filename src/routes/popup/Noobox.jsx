import React from "react";
import {withRouter} from 'dva/router';
import styled from "styled-components";
import FAIcon from '@fortawesome/react-fontawesome'
import faSolid from '@fortawesome/fontawesome-free-solid'
import { Menu, Icon,Button } from 'antd';
import {OVERVIEW_URL,HISTORY_URL,OPTIONS_URL,ABOUT_URL} from "../../common/navURL.js";
import {Link} from 'react-router-dom';
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
    const{match} = this.props; 
    let a = 1;
    console.log(match);
    console.log(faSolid);

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
export default withRouter(Noobox)