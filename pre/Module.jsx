var React = require('react');
var ImageSearch = require('./module/ImageSearch.jsx');
var Reader = require('./module/Reader.jsx');
var Notifier = require('./module/Notifier.jsx');
module.exports = React.createClass({
  displayName: 'Module',
  render: function(){
    var core=null;
    switch(this.props.name){
      case 'imageSearch':
        core=<ImageSearch />;
        break;
      case 'notifier':
        core=<Notifier />;
        break;
      case 'reader':
        core=<Reader />;
        break;
    }
    return <div className='module'>{core}</div>;
  }
});
