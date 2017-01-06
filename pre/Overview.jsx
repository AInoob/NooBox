var React = require('react');
var Helmet = require('react-helmet');
var Link = require('react-router').Link;
module.exports = React.createClass({
  displayName: 'Overview',
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
  },
  render: function(){
    return <div>Overview</div>;
  }
});
