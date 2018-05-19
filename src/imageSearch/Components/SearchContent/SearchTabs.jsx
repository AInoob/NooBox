import React from 'react';
import styled from 'styled-components';
import TabContent from './TabContent';
import {Spin,Tabs,Row,Col} from 'antd';

const TabPane = Tabs.TabPane;
const SearchTabContainer = styled.div`
  margin-top: 30px;
`;
export default class SearchTab extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      // activeTab: ,
      // itemCollector: ,
      // ithemLength:
    }
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.data){
      const mapPropsToTab = new Map();
      this.dealData(nextProps.data,mapPropsToTab);
      const itemCollector = this.generateTabContent(mapPropsToTab);
      const numOfTab  = itemCollector.length;
      const activeTab = numOfTab > 0 ? 0 : 0;
      //set State of the SearchTab
      this.setState({
        activeTab,
        numOfTab,
        itemCollector,
      })
    }else{
      console.log("Error");
    }
  }
  handleKeyPress(event){
    // console.log("keyPressed");
    // console.log(this.state.activeTab);
    let activeTab = this.state.activeTab;
    console.log(event.keyCode);
    switch(event.keyCode){
        case 37:
          if(activeTab - 1 == -1){
              activeTab = this.state.numOfTab -1;
          }else{
            activeTab --;
          }
          this.setState({
            activeTab
          })
        break;
        case 39:
          if(activeTab + 1 == this.state.numOfTab){
              activeTab = 0;
          }else{
            activeTab ++;
          }
          this.setState({
            activeTab
          })
        break;
        default:
        //do nothing
    }
  }

 componentDidMount(){
   console.log("here");
   document.onkeydown = this.handleKeyPress;
 }
//  componentWillUnmount(){
//   window.removeEventListener('keypress', this.handleKeyPress);
//  }

  dealData(data,map){
    data.map((element,index) => {
      if(map.has(element["searchEngine"])){
        let tem = map.get(element["searchEngine"]);
        tem[tem.length] = element;
        map.set(element["searchEngine"],tem);
      }else{
        map.set(element["searchEngine"],[element]);
      }
    })
  }
  generateTabContent(map){
    let ItemCollector = [];
    for(let item of map){
      ItemCollector[ItemCollector.length] = item;
    }
    return ItemCollector;
  }
  render(){

    if(!this.props.data){
      return(
        <div>
           <div>
              <Spin size="large" />
            </div>
        </div>
      );
    }
    return (
      <SearchTabContainer>
        <Row>
          <Col span = {2}></Col>
          <Col span = {20}>
            <Tabs type="card" activeKey = {this.state.activeTab+""} >
              {this.state.itemCollector.map((element,index) =>{
                return(
                  <TabPane key = {index} tab={element[0]}>
                    <TabContent data ={element[1]}/>
                  </TabPane>
                );
              })}
            </Tabs>
          </Col>
        </Row>
      </SearchTabContainer>
    );
  };
}