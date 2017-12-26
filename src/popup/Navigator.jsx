//A basic frame of NooBox, including Navigator and holder for children
import React from 'react';
import styled from 'styled-components';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const MenuDiv = styled.div`
  #nav{
    font-size: 16px;
    font-weight: bold;
  }
`;

class Navigator extends React.Component {

  //Set the current selection
  constructor(props) {
    super(props);
    this.state = {current:'Overview'};
  }

  //Ant design handle the selection
  handleClick(e) {
    this.setState({
      current: e.key,
    })
  }

  render() {
    const activeList = {};
    activeList[this.props.location] = 'active';
    return (
      <MenuDiv>
        <Menu onClick = {this.handleClick.bind(this)} selectedKeys = {[this.state.current]} mode = "horizontal">
          {/*Menu Item 1*/}
          <Menu.Item key = "Overview" className={activeList.overview} >
            <a  id = "nav" onClick={goTo.bind(null, 'overview')}>{capFirst(GL('overview'))}</a>
          </Menu.Item>

          {/*Menu Item 2*/}
          <Menu.Item key = "History" className={activeList.history}>
            <a id = "nav" onClick={goTo.bind(null, 'history')} >{capFirst(GL('history'))}</a>
          </Menu.Item>

          {/*Menu Item 3*/}
          <Menu.Item key = "Options" className={activeList.option}>
            <a id = "nav" onClick={goTo.bind(null, 'options')} >{capFirst(GL('options'))}</a>
          </Menu.Item>

          {/*Menu Item 4*/}
          <Menu.Item key = "About" className={activeList.about}>
            <a id = "nav" onClick={goTo.bind(null, 'about')} >{capFirst(GL('about'))}</a>
          </Menu.Item>
        </Menu>
        {this.props.children}
      </MenuDiv>
    );
  }
};

export default Navigator;