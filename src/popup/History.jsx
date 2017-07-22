import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import styled from 'styled-components';

const HistoryDiv = styled.div`
	img{
		max-height: 80px;
		max-width: 120px;
	}
	.section{
		padding-bottom: 0px;
	}
`;

module.exports = React.createClass({
  displayName: 'History',
  getInitialState: function() {
    initTimeago();
    return {};
  },
  componentDidMount: function() {
    getDB('history_records', (recordList) => {
      this.setState({ recordList });
    });
  },
  clearHistory: function() {
    getDB('history_records', (recordList) => {
      setDB('history_records',[], () => {
        this.setState({ recordList: [] });
      });
      for(let i = 0; i < recordList.length; i++) {
        const id = recordList[i].cursor;
        setDB('NooBox.Image.result_'+id,'');
      }
    });
  },
  render: function() {
    const recordList = (this.state.recordList || [{name:'Nothing is here yet',id:'mgehojanhfgnndgffijeglgahakgmgkj', event: 'bello~'}]).map((record, index) => {
      return (
        <tr key={index}>
					<td>{timeagoInstance.format(record.date,'locale')}</td>
					<td className={record.event}>{GL(record.event)}</td>
					<td><a target="_blank" href={'/image.search.html?cursor='+record.cursor+'&image=history'} ><img src={record.info} /></a></td>
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
});
