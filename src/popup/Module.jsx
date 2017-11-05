import React from 'react';
import ImageSearch from './modules/ImageSearch.jsx';
import VideoControl from './modules/VideoControl.jsx';
import CheckUpdate from './modules/CheckUpdate.jsx';
import AutoRefresh from './modules/AutoRefresh.jsx';

const mod = { ImageSearch, VideoControl, CheckUpdate, AutoRefresh };

class Module extends React.Component {
  render() {
    const Core = mod[capFirst(this.props.name)];
    return <div className='module'><Core /></div>;
  }
};

export default Module;