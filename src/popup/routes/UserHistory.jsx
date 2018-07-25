import React from "react";
import {Table,Button,Card,Tooltip} from 'antd';
import styled from "styled-components";
import FAIcon from '@fortawesome/react-fontawesome'
import faSolid from '@fortawesome/fontawesome-free-solid'
//redux
import {engineIcon} from 'SRC/constant/settingMap.js';
import {connect}  from 'dva';
import reduxActions from "SRC/popup/reduxActions.js";
import reselector   from "SRC/popup/reselector.js";
import Loader      from "SRC/common/component/Loader.jsx";
const { Meta } = Card;
const {Column} = Table;
const HistoryContainer = styled.div`
  position: relative;
  margin-bottom:10px;
  .ant-table-wrapper{
    margin-left: 10px;
    margin-right: 10px;
    margin-top:  10px;
  }

  #deleteAdll{
    position:  absolute;
    z-index:  10;
    right: 15px;
    top: 10px;
    padding-left: 10px;
    padding-right: 10px;
  }
  .tableHeader{
    text-align:center;
  }
  .ant-card-body{
    padding: 0px; 
  }
  .ant-card-actions{
    span{
      font-size: 10px;
    }
  }
  .ant-btn{
    border-radius: 0;
  }
  td{
    text-align:center;
  }
`;
class UserHistory extends React.Component{

  delete(e){
    console.log(e);
  }
  deleteAll(){
    console.log("delete All")
  }

  componentDidMount(){
    const {userHistory,actions} = this.props;
    if(!userHistory.inited){
      actions.userHistoryInit();
    }
  }
  render(){
    const{userHistory,actions} = this.props;
    let deleteAll = (<Button type ="danger">
                      {i18n("clear_all")}
                    </Button>);
    if(userHistory.inited){
      return(
        < HistoryContainer>
          <Table dataSource={userHistory.dbData} bordered = {true}>
            <Column
              className ="tableHeader"
              title="History"
              key  = "dbKey"
              dataIndex ="dbKey"
              render = {(text,record) =>{
                let usedEngine =[];
                let firstKeyword = "";
                let sizeInfo;
                record.data.searchImageInfo.forEach((e,index) => {
                  if(firstKeyword == "" && e.keyword !== ""){
                    firstKeyword = e.keyword;
                  }
                  if(e.engine){
                    usedEngine[usedEngine.length] =(
                      <img style ={{width: 14, marginRight: 2}} src = {engineIcon[e.engine]}/>
                    )
                  }
                  if(sizeInfo == undefined && e.imageInfo["height"]){
                    sizeInfo = e.imageInfo["width"] + "x" + e.imageInfo["height"];
                  }
                })
                return(
                  <Card
                    style = {{width: "164px", margin: "auto",}}
                    cover = {<img src = {record.data.base64}/>}
                    actions ={[
                      <Tooltip title = {i18n("image_size")}>{sizeInfo}</Tooltip>,
                      <Tooltip title = {i18n("image_first_keyowrd")}>{firstKeyword}</Tooltip>,
                      <Tooltip title = {i18n("image_used_engine")}>{usedEngine}</Tooltip>,
                    ]}
                  >
                    {/* <Meta
                      title = {i18n("image_size")}
                      description = {sizeInfo}
                    />
                     <Meta
                      title = {i18n("image_first_keyowrd")}
                      description = {firstKeyword}
                    />
                     <Meta
                      title = {i18n("image_used_engine")}
                      description = {usedEngine}
                    /> */}
                  </Card>
                )
              }}
            />
            <Column
             className ="tableHeader"
              title={deleteAll}
              key  ="action"
              dataIndex = "action"
              render ={(text,record) =>(
                <Button type ="danger" ><FAIcon onClick = {() =>actions.userHistoryDeleteSingle(record.dbKey)} icon ={faSolid.faTrash}/></Button>
              )}
              />
          </Table>
        </HistoryContainer>
      )
    }else{
     return(<Loader style ={{marginTop: "20%"}}/>)
    }          
   
  }
}

export default connect(reselector, reduxActions)(UserHistory);
