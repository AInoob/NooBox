import React from 'react';

module.exports = React.createClass({
  displayName: 'VideoControl',
  getInitialState: function() {
    return { enabled: false, websiteEnabled: true };
  },
  componentDidMount: function() {
    isOn('videoControl', () => {
      this.setState({ enabled: true });
      chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true}, (tabs) => {
        let url = "";
        if(tabs[0]) {
					url = tabs[0].url;
				}
        const a = document.createElement('a');
        a.href = url;
        const host = a.hostname;
        this.setState({ host });
        getDB('videoControl_website_'+host, (enabled) => {
          if(enabled == false) {
            this.setState({ websiteEnabled: false });
          }
        });
      });
    });
  },
  toggle: function() {
    const websiteEnabled=!this.state.websiteEnabled;
    setDB('videoControl_website_'+this.state.host, websiteEnabled, () => {
      this.setState({ websiteEnabled });
      chrome.runtime.sendMessage({
				job: 'videoControl_website_switch',
				host: this.state.host,
				enabled: websiteEnabled,
			});
    });
  },
  render: function() {
    if(!this.state.enabled) {
      return null;
    }
    var symbol = '☁';
    if(this.state.websiteEnabled) {
      symbol = '☀';
    }
    return (
      <div className="container" id="videoControl">
        <h5 className="header">{GL('videoControl')}</h5>
        <div id="info" className="container">
          <p className="important line">{this.state.host}</p>
          <input type="checkbox" id="enabled" readOnly checked={this.state.websiteEnabled} />
          <span onClick={this.toggle}>{symbol}</span>
        </div>
      </div>);
  }
});
