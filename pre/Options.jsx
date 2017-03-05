var React = require('react');
var Helmet = require('react-helmet');
var Link = require('react-router').Link;
module.exports = React.createClass({
  displayName: 'Options',
  getInitialState: function(){
    return {history:true,installType:'normal',settings:{checkUpdate:false,videoControl:false,extractImages:false,imageSearch:false,screenshotSearch:false,imageSearchUrl_google:false,imageSearchUrl_baidu:false,imageSearchUrl_yandex:false,imageSearchUrl_bing:false,imageSearchUrl_tineye:false,imageSearchUrl_saucenao:false,imageSearchUrl_iqdb:false}};
  },
  componentDidMount: function(){
    var switchList=['history','checkUpdate','videoControl','extractImages','imageSearch','screenshotSearch','imageSearchUrl_google','imageSearchUrl_baidu','imageSearchUrl_yandex','imageSearchUrl_bing','imageSearchUrl_tineye','imageSearchUrl_saucenao','imageSearchUrl_iqdb'];
    chrome.management.getSelf(function(data){
      this.setState({installType:data.installType});
    }.bind(this));
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
      <label htmlFor={id} >
        <input type="checkbox" onChange={(handler||this.toggleSetting.bind(this,id))} checked={this.state.settings[id]} id={id} />
        <span className="lever"></span>
      </label>
      {GL(id)}
    </div>;
  },
  getImageSearchSwitch: function(id,handler){
    return <div className="switch">
      <label htmlFor={id} >
        <input type="checkbox" onChange={(handler||this.toggleSetting.bind(this,id))} checked={this.state.settings[id]} id={id} />
        <img title={GL(id)} src={'/thirdParty/'+id.slice(15)+'.png'} />
      </label>
    </div>;
  },
  getCheckbox: function(id,handler){
    return <p>
      <input type="checkbox" onChange={(handler||this.toggleSetting.bind(this,id))} checked={this.state.settings[id]} id={id} />
      <label htmlFor={id} >{GL(id)}</label>
    </p>;
  },
  render: function(){
    var imageSearchEngines=null;
    if(this.state.settings['imageSearch']){
      imageSearchEngines=["imageSearchUrl_google","imageSearchUrl_baidu","imageSearchUrl_tineye","imageSearchUrl_bing","imageSearchUrl_yandex","imageSearchUrl_saucenao","imageSearchUrl_iqdb"].map(function(elem,index){
        return <div className="tab-1 imageSearchSwitch" key={index}>{this.getImageSearchSwitch(elem)}</div>;
      }.bind(this));
    }
    var checkUpdate=null;
    if(this.state.installType!='normal'){
      checkUpdate=this.getCheckbox('checkUpdate');
    }
    return (
      <div className="container">
        <div id="options">
          <h5 className="header">{GL('images')}</h5>
            <div className="tab-1">
            <p></p>
            {this.getCheckbox('imageSearch')}
            {imageSearchEngines}
            <p></p>
            {this.getCheckbox('extractImages')}
            <p></p>
            {this.getCheckbox('screenshotSearch')}
            <p></p>
          </div>
          <h5 className="header">{GL('videoControl')}</h5>
          <div className="tab-1">
            {this.getCheckbox('videoControl')}
            <p></p>
          </div>
          <h5 className="header">{GL('experience')}</h5>
          <div className="tab-1">
            {this.getCheckbox('record_history')}
            <p></p>
            {checkUpdate}
            <p></p>
          </div>
        </div>
      </div>);
  }
});
