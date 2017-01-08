var React = require('react');
var Helmet = require('react-helmet');
var Link = require('react-router').Link;
module.exports = React.createClass({
  displayName: 'Options',
  getInitialState: function(){
    return {settings:{extractImages:false,imageSearch:false,screenshotSearch:false}};
  },
  componentDidMount: function(){
    var switchList=['extractImages','imageSearch','screenshotSearch','imageSearchUrl_google','imageSearchUrl_baidu','imageSearchUrl_yandex','imageSearchUrl_bing','imageSearchUrl_tineye','imageSearchUrl_saucenao','imageSearchUrl_iqdb'];
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
      <input type="checkbox" onChange={(handler||this.toggleSetting.bind(this,id))} checked={this.state.settings[id]} id={id} />
      <label htmlFor={id} className="checkbox"></label>{GL(id)}
    </div>;
  },
  render: function(){
    var imageSearchEngines=null;
    if(this.state.settings['imageSearch']){
      imageSearchEngines=["imageSearchUrl_google","imageSearchUrl_baidu","imageSearchUrl_tineye","imageSearchUrl_bing","imageSearchUrl_yandex","imageSearchUrl_saucenao","imageSearchUrl_iqdb"].map(function(elem,index){
        return <div className="tab-1" key={index}>{this.getSwitch(elem)}</div>;
      }.bind(this));
    }
    return (
      <div id="options">
        <div className="section">
          <div className="header">{GL('images')}</div>
          {this.getSwitch('imageSearch')}
          {imageSearchEngines}
          {this.getSwitch('extractImages')}
          {this.getSwitch('screenshotSearch')}
        </div>
      </div>);
  }
});
