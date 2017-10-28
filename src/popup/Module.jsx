import React from 'react';
import ImageSearch from './modules/ImageSearch.jsx';
import VideoControl from './modules/VideoControl.jsx';
import CheckUpdate from './modules/CheckUpdate.jsx';
import AutoRefresh from './modules/AutoRefresh.jsx';

const mod = { ImageSearch, VideoControl, CheckUpdate, AutoRefresh };

module.exports = React.createClass({
  displayName: 'Module',
  render: function () {
    const Core = mod[capFirst(this.props.name)];
    return <div className='module'><Core /></div>;
  }
});
