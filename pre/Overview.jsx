var React = require('react');
var Helmet = require('react-helmet');
var Link = require('react-router').Link;
var Module = require('./Module.jsx');
module.exports = React.createClass({
  displayName: 'Overview',
  getInitialState: function(){
    return {modules:[]};
  },
  componentDidMount: function(){
    shared.goTo=this.props.router.push;
    if(window.location.pathname.indexOf('popup')!=-1){
      var page=getParameterByName('page');
      if(page){
        this.props.router.push(page);
        if(page=='overview'){
          this.getInitialData();
        }
      }
      else{
        get('defaultPage',function(url){
          this.props.router.push((url||'overview'));
          if(!url||url=='overview'){
            this.getInitialData();
          }
        }.bind(this));
      }
    }
    else{
      this.getInitialData();
    }
  },
  getInitialData: function(){
    get('modules',function(modules){
      this.setState({modules:modules});
    }.bind(this));
  },
  render: function(){
    console.log(this.state);
    var modules=this.state.modules.map(function(elem,index){
      return <Module key={index} name={elem} />
    });
    return <div id="overview" className="section">{modules}</div>;
  }
});
