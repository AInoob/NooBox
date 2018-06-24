import React from "react";
import {Table,Button} from 'antd';
import styled from "styled-components";
import FAIcon from '@fortawesome/react-fontawesome'
import faSolid from '@fortawesome/fontawesome-free-solid'
const {Column} = Table;
const HistoryContainer = styled.div`
  position: relative;

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
  td{
    text-align:center;
  }
`;
export default class UserHistory extends React.Component{

  delete(e){
    console.log(e);
  }
  

  render(){
    let testObj = [
      {
        key:"1",
        image:"data:image/jpeg;base64,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",
      }
    ];
    let deleteAll = (<Button type ="danger">
                      Clear All
                    </Button>);
    return(
      < HistoryContainer>
        
        <Table dataSource={testObj}>
          <Column
            className ="tableHeader"
            title="History"
            key  = "image"
            dataIndex ="image"
            render = {(text,record) =>(
              <img style ={{maxWidth:"100px"}}src ={record.image}/>
            )}
          />
          <Column 
           className ="tableHeader"
            title={deleteAll}
            key  ="action"
            dataIndex = "action"
            render ={(text,record) =>(
              <Button type ="danger" onClick = {this.delete(record.key)}><FAIcon icon ={faSolid.faTrash}/></Button>
            )}
            />
        </Table>
      </HistoryContainer>
    )
  }
}