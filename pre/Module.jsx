var React = require('react');
var ImageSearch = require('./modules/ImageSearch.jsx');
var VideoControl = require('./modules/VideoControl.jsx');
var Reader = require('./modules/Reader.jsx');
var Notifier = require('./modules/Notifier.jsx');
module.exports = React.createClass({
  displayName: 'Module',
  render: function(){
    var core=null;
    switch(this.props.name){
      case 'imageSearch':
        core=<ImageSearch />;
        break;
      case 'videoControl':
        core=<VideoControl />;
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
