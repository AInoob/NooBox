var React = require('react');
var Helmet = require('react-helmet');
var Link = require('react-router').Link;
var Website = require('./Website.jsx');
module.exports = React.createClass({
  displayName: 'Result',
  getInitialState: function(){
    return {order:'relavance',imageSizes:{},loadBaidu:false};
  },
  componentDidMount: function(){
    this.getInitialData();
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if(request.job=='image_result_update'&&request.cursor==getParameterByName('cursor')){
          this.getInitialData();
        }
      }.bind(this)
    );
  },
  engineWeights:{
    google: 30,
    baidu: 20,
    yandex: 15,
    tineye: 18,
    saucenao: 10,
    iqdb: -100
  },
  getWeight: function(related,engine,index){
    var weight=0;
    if(related){
      weight+=100;
    }
    weight+=this.engineWeights[engine];
    weight-=index;
    return weight;
  },
  reloadBaiduImage: function(x){
    var allLoaded=true;
    $('.website.baidu').find('img.image').each(function(e){
      if(!this.naturalWidth||this.naturalWidth==0){
        var a=this.src;
        var image = new Image();
        image.onload = function() {
          if(image.naturalWidth&&image.naturalWidth>0){
            this.src='';
            setTimeout(function(){
              this.src=a;
            }.bind(this),100);
          }
        }.bind(this);
        image.src=a;
      }
      if(!this.naturalWidth||this.naturalWidth==0){
        allLoaded=false;
      }
    });
    if(!allLoaded){
      var newWaiting=2*x;
      newWaiting=newWaiting>2000?2000:newWaiting;
      setTimeout(this.reloadBaiduImage.bind(this,newWaiting),newWaiting);
    }
  },
  updateWebsites: function(){
    var websites=[];
    var result=this.state.result;
    for(var i=0;i<(result.engines||[]).length;i++){
      var engine=result.engines[i];
      if(result.baidu&&result.baidu.websites&&result.baidu.websites.length>0&&!this.state.loadBaidu){
        console.log(result.baidu.url);
        this.setState({loadBaidu:true});
        console.log('loading Iframe');
        loadIframe(result.baidu.url,voidFunc);
        setTimeout(this.reloadBaiduImage.bind(this,100),100);
      }
      for(var j=0;j<(result[engine].relatedWebsites||[]).length;j++){
        var website=result[engine].relatedWebsites[j];
        website.weight=this.getWeight(true,engine,j);
        var imageSize=this.state.imageSizes[website.imageUrl];
        if(imageSize){
          website.width=imageSize.width;
          website.height=imageSize.width;
          website.area=imageSize.area;
        }
        websites.push(website);
      }
      for(var j=0;j<(result[engine].websites||[]).length;j++){
        var website=result[engine].websites[j];
        website.weight=this.getWeight(false,engine,j);
        var imageSize=this.state.imageSizes[website.imageUrl];
        if(imageSize){
          website.width=imageSize.width;
          website.height=imageSize.width;
          website.area=imageSize.area;
        }
        websites.push(website);
      }
    }
    this.setState({websites:websites});
  },
  getInitialData: function(){
    var cursor=getParameterByName('cursor');
    getDB('NooBox.Image.result_'+cursor,function(data){
      this.setState({result:data});
      this.updateWebsites();
      console.log(data);
    }.bind(this));
  },
  getKeyword: function(engine){
    return (
      <a target="_blank" href={((this.state.result||{})[engine]||{}).url} className={"keyword "+engine}>
        {(((this.state.result||{})[engine]||{}).keyword||'(none)')}
      </a>);
  },
  getImageSize: function(url){
    if(this.state.imageSizes[url]){
      return this.state.imageSizes[url];
    }
    else{
      return {width:'',height:'',area:''};
    }
  },
  updateImageSize: function(index,url,width,height){
    this.setState(function(prevState){
      prevState.imageSizes[url]={};
      prevState.imageSizes[url].width=width;
      prevState.imageSizes[url].height=height;
      if(isNaN(width*height)){
        prevState.imageSizes[url].area='';
      }
      else{
        prevState.imageSizes[url].area=width*height;
      }
      return prevState;
    });
  },
  sort: function(a,b){
    var r=0;
    var aa=this.getImageSize(a.imageUrl);
    var bb=this.getImageSize(b.imageUrl);
    if(this.state.order=='area'){
      r=bb.area-aa.area;
    }
    else if(this.state.order=='width'){
      r=bb.width-aa.width;
    }
    else if(this.state.order=='height'){
      r=bb.height-aa.height;
    }
    if(r==0)
      r=b.weight-a.weight;
    if(r==0){
      r=compare(b.link+b.searchEngine,a.link+a.searchEngine);
    }
    if(isNaN(r)){
      if(isNaN(aa.area)&&isNaN(bb.area)){
        r=compare(b.link+b.searchEngine,a.link+a.searchEngine);
      }
      if(isNaN(aa.area)){
        r=1;
      }
      else{
        r=-1;
      }
    }
    return r;
  },
  getWebsite: function(){
    var websites=this.state.websites||[];
    return websites.sort(this.sort).map(function(website,index){
      return (
        <Website key={index} getImageSize={this.getImageSize.bind(this,website.imageUrl)} updateImageSize={this.updateImageSize.bind(this,index)} data={website} />
      );
    }.bind(this));
  },
  updateOrder: function(order){
    this.setState({order:order});
  },
  getButton: function(name){
    var focus='';
    if(name==this.state.order){
      focus='focus';
    }
    return (
      <div onClick={this.updateOrder.bind(this,name)} className={'button '+focus}>{GL(name)}</div>
    );
  },
  render: function(){
    var result=this.state.result||{};
    var source=result.imageUrl;
    if(source=='dataURI'){
      source=result.dataURI;
    }
    var keywords=(
      <div>
        {this.getKeyword('google')}
        {this.getKeyword('baidu')}
        {this.getKeyword('bing')}
      </div>);
    var icons=(result.engines||[]).map(function(elem,index){
      return (
        <a key={index} className={"icon "+result[elem].result} target="_blank" href={(result[elem]||{}).url}>
          <img src={'/thirdParty/'+elem+'.png'} />
        </a>);
    });
    var filter=(
      <div className="filter section">
        <div className="header">{GL('sortBy')}</div>
        {this.getButton('relavance')}
        {this.getButton('area')}
        {this.getButton('width')}
        {this.getButton('height')}
      </div>
    );
    var brief=(
      <div className="brief">
        <div className="section image">
          <div className="header">{GL('image')}</div>
          <img src={source} />
        </div>
        <div className="section keywords">
          <div className="header">{GL('keywords')}</div>
          {keywords}
        </div>
        <div className="section more">
          <div className="header">{GL('more')}</div>
          {icons}
        </div>
      </div>);
    var websites=(
      <div className="websites">
        {this.getWebsite()}
      </div>);
    return (
      <div id="imageSearchResult">
        {brief}
        {filter}
        {websites}
      </div>);
  }
});