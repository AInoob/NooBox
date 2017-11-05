import React from 'react';
import styled from 'styled-components';

const CheckUpdateDiv = styled.div`
	margin: 0 auto;
	width: 90%;
	.listItem{
		display: list-item;
		list-style-type: square;
		margin-left: 16px;
	}
	#help{
		height: ${props => props.displayHelp? 'initial' : '0px'};
		overflow: hidden;
		margin: 0;
	}
`;

class CheckUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
			enabled: false,
			newChanges: [],
			updateAvailable: false,
			newVersion: '0',
			version: '0',
			updateHistory:[],
			displayHelp: false,
    };
    this.checkUpdate = this.checkUpdate.bind(this);
  }
  componentDidMount() {
    get('version', (version) => {
      this.setState({ version }, () => {
        get('updateHistory', (updateHistory) => {
          this.setState({ updateHistory }, this.generateReport);
        });
      });
    });
    isOn('checkUpdate', () => {
      this.setState({ enabled: true });
      get('lastUpdateCheck', (lastCheck) => {
        const time=new Date().getTime();
        if(time > lastCheck + 1000*60*60) {
          this.checkUpdate();
        }
      });
    });
  }
	compareVersion(a, b) {
		const x = a.split('.').map((elem) => {
			return parseInt(elem);
		});;
		const y = b.split('.').map((elem) => {
			return parseInt(elem);
		});;
		for(let i = 0; i < 4; i++) {
			if(x[i] > y[i]) {
				return 1;
			}
			else if(x[i] < y[i]) {
				return -1;
			}
		}
		return 0;
	}
  generateReport() {
    const data = this.state.updateHistory;
    if(data.length == 0) {
      return;
    }
    const last = data.length - 1;
    const newVersion = data[last].version;
    if(this.compareVersion(newVersion, this.state.version) > 0) {
      const newChanges=[];
			let i;
      for(i = 0; i < data.length; i++) {
				if(this.compareVersion(data[i].version, this.state.version) > 0 ) {
					break;
				}
      }
			for(; i < data.length; i++) {
				console.log(i);
				console.log(data[i].changes);
				let changes = data[i].changes;
				if(isZh) {
					changes = data[i].zhChanges;
				}
				for(let j = 0; j < changes.length; j++) {
					newChanges.push(changes[j]);
				}
			}
      this.setState({ updateAvailable: true, newVersion, newChanges });
    }
    else{
      this.setState({ updateAvailable: false });
    }
  }
  checkUpdate() {
    set('lastUpdateCheck',new Date().getTime());
		$.ajax({
			type: 'GET',
			url: 'https://ainoob.com/api/noobox/updateList'
		}).done((updateHistory) => {
			this.setState({ updateHistory }, () => {
				set('updateHistory', updateHistory, () => {
					this.generateReport();
				});
			});
		});
  }
  render() {
    if(!this.state.enabled) {
      return null;
    }
    let newChanges = null;
    let report = <p className="line">{GL('ls_7')}</p>;
    const help = <p className="important" id="help">{GL('ls_9')}<br/><br/>{GL('ls_10')}</p>;
    if(this.state.updateAvailable) {
			report = <p className="line"><a target="_blank" href="https://ainoob.com/project/noobox">{GL('ls_8')+this.state.newVersion}</a></p>;
      newChanges = this.state.newChanges.map(function(elem,index){
        return <div className="listItem" key={index}>{elem}</div>;
      });
    }
    return (
      <CheckUpdateDiv displayHelp={this.state.displayHelp}>
        <h5 className="header">{GL('checkUpdate')}<span className="helpButton" onClick={()=>{this.setState({displayHelp: !this.state.displayHelp})}}>&nbsp;(?)</span></h5>
				{help}
        <div id="info" className="container important">
          {report}
					<div className="btn" onClick={this.checkUpdate}>{GL('checkUpdate')}</div>
					<br />
					<br />
          {newChanges}
        </div>
      </CheckUpdateDiv>
		);
  }
};

export default CheckUpdate;