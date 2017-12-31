import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import TimeAgo from 'timeago-react';
import {Button, Popover, Row, Col,Table,Icon} from 'antd';
const HistoryDiv = styled.div`
padding: 10px;
	img{
		max-height: 80px;
		max-width: 120px;
	}
	.section{
		padding-bottom: 0px;
	}
	.delete{
		cursor: pointer;
	}
  #confirmPanel{
    width: 50px;
  }
  #test{
  
  }
  th:first-child{
    width: 100px;
  }
  th:nth-child(2){
    width: 100px;
  }
  th:nth-child(3){
    width: 100px;
  }
  th:nth-child(4){
    width: 100px;
  }
  #clearHistory{
    position: absolute;
    left: 290px;
    z-index: 2;
    top: 69px;
  }
`;

class History extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      language: getLanguage(),
      visible: false,
    };
  }

  componentDidMount() {
    getDB('history_records', (recordList) => {
      this.setState({ recordList });
    });
  }

  clearHistory() {
    getDB('history_records', (recordList) => {
      for(let i = 0; i < recordList.length; i++) {
        const id = recordList[i].cursor;
        deleteDB('NooBox.Image.result_'+id);
      }
      deleteDB('history_records', () => {
        this.setState({ recordList: null });
      });
    });
  }

	deleteRecord(i) {
    getDB('history_records', (recordList) => {
			const id = recordList[i].cursor;
			deleteDB('NooBox.Image.result_'+id, () => {
				recordList.splice(i, 1);
				setDB('history_records', recordList, () => {
					getDB('history_records', (newRecordList) => {
						this.setState({ recordList: newRecordList });
					});
				});
			});
		});
	}

  handleDeleteButton(check){
    if (check) {
      this.clearHistory();
      this.setState({visible: !this.state.visible});
    } else {
      this.setState({visible: !this.state.visible});
    }
  }
  handleVisibleChange () {
    if(!this.state.visible){
      this.setState({ visible:!this.state.visible });
    }
  }
  render() {
    let data  = (this.state.recordList && this.state.recordList.length > 0 ? this.state.recordList : 
      [{date: new Date(), name:'Nothing is here yet', id:'mgehojanhfgnndgffijeglgahakgmgkj', event: 'bello~'}]
    ).map((record, index) => {
      let singleRow = {
        key :index,
        date: record.date,
        event: record.event,
        img: record.info,
        click: record.cursor,
      }
      return singleRow;
    });

    const columns = [{
      title: capFirst(GL('when')),
      dataIndex: 'date',
      key: 'date',
      render: (text) => (
        <TimeAgo datetime={text} locale={this.state.language} />
      )
    }, {
      title: capFirst(GL('event')),
      dataIndex: 'event',
      key: 'event',
    }, {
      title: capFirst(GL('detail')),
      dataIndex: 'img',
      key: 'img',
        render: (text,record) => (
          <a target="_blank"
            href={'/image.search.html?cursor='+record.click+'&image=history'}>
            <img src={record.img} />
          </a>
        )
    },{
      title: ' ',
      dataIndex: 'action',
      key:'action',
        render: (text, record) => (
          <Icon onClick = {() => this.deleteRecord(record.key)}  style={{ fontSize: 20, color: '#FF0000',cursor: "pointer" }} type="close" />
        )
    }];
    
    let content = (
      <div id = 'confirmPanel'>
        <Row gutter = {48}>
          <Col span = {12} >
            <Button  type = "danger" onClick={() => this.handleDeleteButton(true)}>Yes</Button>
          </Col>
          <Col span={12} >
            <Button  type = "primary" onClick={() =>this.handleDeleteButton(false)}>No</Button>
          </Col>
        </Row>
      </div>
    );
    return (
      <HistoryDiv>
        <Popover  placement="right" onBlur={() => { setTimeout(() => {this.setState({visible: false})}, 100)}} content = {content} title = {GL('ls_17')} trigger ="click" visible = {this.state.visible} onVisibleChange = {() => this.handleVisibleChange()}>
          <Button id = "clearHistory" type="danger">{GL('clearAll')}</Button>
        </Popover>
        <Table columns={columns} dataSource={data} />
      </HistoryDiv>
		);
  }
};

export default History;