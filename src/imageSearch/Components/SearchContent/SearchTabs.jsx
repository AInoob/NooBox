import React from 'react';
import styled from 'styled-components';
import TabContent from './TabContent';
import {Spin,Tabs,Row,Col} from 'antd';

const TabPane = Tabs.TabPane;
const SearchTabContainer = styled.div`
  margin-top: 30px;
`;
export default class SearchTab extends React.Component{
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
    const mapPropsToTab = new Map();
    this.dealData(this.props.data,mapPropsToTab);
    const ItemCollector = this.generateTabContent(mapPropsToTab);
    //console.log(ItemCollector);
    return (
      <SearchTabContainer>
        <Row>
          <Col span = {2}></Col>
          <Col span = {20}>
            <Tabs type="card">
              {ItemCollector.map((element,index) =>{
                console.log(element);
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