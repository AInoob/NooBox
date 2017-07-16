import React from 'react';

module.exports = React.createClass({
  displayName: 'CheckUpdate',
  getInitialState: function () {
    return {installType:'normal',enabled:false,newChanges:[],updateAvailable:false,newVersion:'0',version:'0',updateHistory:[]};
  },
  componentDidMount: function () {
    chrome.management.getSelf((data) => {
      this.setState({installType:data.installType});
    });
    get('version', (version) => {
      this.setState({version:version},function(){
        get('updateHistory', (data) => {
          this.setState({updateHistory:data},this.generateReport);
        });
      });
    });
    isOn('checkUpdate', () => {
      this.setState({enabled:true});
      get('lastUpdateCheck', (lastCheck) => {
        const time=new Date().getTime();
        if(time > lastCheck + 1000*60*60) {
          this.checkUpdate();
        }
      });
    });
  },
  generateReport: function() {
    const data=this.state.updateHistory;
    if(data.length==0){
      return;
    }
    const last = data.length - 1;
    const newVersion = data[last].version;
    if(this.state.version != newVersion) {
      const changes=[];
      let reachCurrent=false;
      for(let i = 0; i < data.length; i++) {
        if(reachCurrent == false) {
          if(data[i].version == this.state.version) {
            reachCurrent = true;
          }
        }
        else {
          let newChanges = data[i].changes;
          if(isZh) {
            newChanges=data[i].zhChanges;
          }
          for(let j = 0; j < newChanges.length; j++) {
            changes.push(newChanges[j]);
          }
        }
      }
      this.setState({updateAvailable:true,newVersion:newVersion,newChanges:changes});
    }
    else{
      this.setState({updateAvailable:false});
    }
  },
  checkUpdate: function() {
    set('lastUpdateCheck',new Date().getTime());
      $.ajax({
        type: 'GET',
        url: 'https://ainoob.com/api/noobox/updateList'
      }).done((data) => {
        this.setState({'updateHistory':data}, () => {
          set('updateHistory', data, () => {
            this.generateReport();
          });
        });
      });
  },
  render: function() {
    if(!this.state.enabled) {
      return null;
    }
    let newChanges=null;
    let header=<p>{GL('ls_7')}</p>
    if(this.state.updateAvailable){
      header=<p><a target="_blank" href="https://ainoob.com/project/noobox">{GL('ls_8')+this.state.newVersion}</a><br/>{GL('ls_9')}<br/>{GL('ls_10')}</p>;
      newChanges=this.state.newChanges.map(function(elem,index){
        return <div className="listItem" key={index}>{elem}</div>;
      });
    }
    return (
      <div className="container" id="checkUpdate">
        <h5 className="header">{GL('checkUpdate')}</h5>
        <div id="info" className="container important">
          {header}
          {newChanges}
          <div className="btn" onClick={this.checkUpdate}>{GL('checkUpdate')}</div>
        </div>
      </div>);
  }
});
