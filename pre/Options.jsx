var React = require('react');
var Helmet = require('react-helmet');
var Link = require('react-router').Link;
module.exports = React.createClass({
  displayName: 'Options',
  getInitialState: function(){
    return {settings:{extractImages:false,imageSearch:false,screenshotSearch:false}};
  },
  componentDidMount: function(){
    var switchList=['extractImages','imageSearch','screenshotSearch'];
    for(var i=0;i<switchList.length;i++){
      isOn(
        switchList[i],
        function(ii){
          this.setState(function(prevState){
            prevState.settings[switchList[ii]]=true;
            return prevState;
          });
        }.bind(this,i),
        function(ii){
          this.setState(function(prevState){
            prevState.settings[switchList[ii]]=false;
            return prevState;
          });
        }.bind(this,i)
      );
    }
  },
  toggleSetting: function(id){
    var newValue=!this.state.settings[id];
    set(id,newValue,function(){
      this.setState(function(prevState){
        prevState.settings[id]=newValue;
        return prevState;
      });
      chrome.extension.sendMessage({job: id});
    }.bind(this));
  },
  getSwitch: function(id,handler){
    return <div className="switch">
      <input type="checkbox" onChange={CW.bind(null,(handler||this.toggleSetting.bind(this,id)),'Options','option-switch',id)} checked={this.state.settings[id]} id={id} />
      <label htmlFor={id} className="checkbox"></label>{GL(id)}
    </div>;
  },
  render: function(){
    return (
      <div id="options">
        <div className="section">
          <div className="header">{GL('images')}</div>
          {this.getSwitch('imageSearch')}
          {this.getSwitch('extractImages')}
          {this.getSwitch('screenshotSearch')}
        </div>
      </div>);
  }
});
