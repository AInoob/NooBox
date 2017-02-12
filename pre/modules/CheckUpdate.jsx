var React = require('react');
module.exports = React.createClass({
  displayName: 'CheckUpdate',
  getInitialState: function(){
    return {enabled:false,newChanges:[],updateAvailable:false,newVersion:'0',version:'0',updateHistory:[]};
  },
  componentDidMount: function(){
    get('version',function(version){
      this.setState({version:version},function(){
        get('updateHistory',function(data){
          this.setState({updateHistory:data},this.generateReport);
        }.bind(this));
      });
    }.bind(this));
    isOn('checkUpdate',function(){
      this.setState({enabled:true});
      get('lastUpdateCheck',function(lastCheck){
        var time=new Date().getTime();
        if(time>lastCheck+1000*60*60){
          this.checkUpdate();
        }
      }.bind(this));
    }.bind(this));
  },
  generateReport: function(){
    console.log('generateReport');
    console.log(this.state.updateHistory);
    var data=this.state.updateHistory;
    if(data.length==0){
      return;
    }
    var last=data.length-1;
    newVersion=data[last].version;
    if(this.state.version!=newVersion){
      var changes=[];
      var reachCurrent=false;
      for(var i=0;i<data.length;i++){
        if(reachCurrent==false){
          if(data[i].version==this.state.version){
            reachCurrent=true;
          }
        }
        else{
          var newChanges=data[i].changes;
          if(isZh){
            newChanges=data[i].zhChanges;
          }
          for(var j=0;j<newChanges.length;j++){
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
  checkUpdate: function(){
    set('lastUpdateCheck',new Date().getTime());
      $.ajax({
        type:'GET',
        url:'https://ainoob.com/api/noobox/updateList'
      }).done(function(data){
        this.setState({'updateHistory':data},function(){
          set('updateHistory',data,function(){
            this.generateReport();
          }.bind(this));
        }.bind(this));
      }.bind(this));
  },
  render: function(){
    if(!this.state.enabled){
      return null;
    }
    var newChanges=null;
    var header=<p>{GL('ls_7')}</p>
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
