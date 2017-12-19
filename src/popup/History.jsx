import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';

import TimeAgo from 'timeago-react';

const HistoryDiv = styled.div`
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
`;

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: getLanguage(),
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
  render() {
    const recordList = (this.state.recordList || [{date: new Date(), name:'Nothing is here yet',id:'mgehojanhfgnndgffijeglgahakgmgkj', event: 'bello~'}]).map((record, index) => {
			console.log(record);
      return (
        <tr key={index}>
					<td><TimeAgo datetime={record.date} locale={this.state.language} /></td>
					<td className={record.event}>{GL(record.event)}</td>
					<td><a target="_blank" href={'/image.search.html?cursor='+record.cursor+'&image=history'} ><img src={record.info} /></a></td>
					<td className="delete" onClick={this.deleteRecord.bind(this, index)}>❌</td>
        </tr>
			);
    }).reverse();
    return (
      <HistoryDiv>
        <div className="section container">
          <div className="btn" onClick={this.clearHistory}>{GL('clearAll')}</div>
        </div>
        <table className="highlight container">
          <thead>
            <tr>
							<th>{capFirst(GL('when'))}</th>
							<th>{capFirst(GL('event'))}</th>
							<th>{capFirst(GL('detail'))}</th>
						</tr>
          </thead>
          <tbody>
            {recordList}
          </tbody>
        </table>
      </HistoryDiv>
		);
  }
};

export default History;