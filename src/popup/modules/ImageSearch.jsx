import React from 'react';

module.exports = React.createClass({
  displayName: 'ImageSearch',
  reader : new window.FileReader(),
  getInitialState: function() {
    return { enabled: false };
  },
  componentDidMount: function() {
    isOn('imageSearch', () => {
      this.setState({enabled:true});
      this.reader.onloadend = () => {
        const base64data = this.reader.result;                
        chrome.extension.sendMessage({
					job:'analytics',
					category:'uploadSearch',
					ction:'run'
				}, (response) => {
				});
        chrome.extension.sendMessage({job: 'imageSearch_upload', data: base64data });
      }
      get('totalImageSearch', (count) => {
        count = count || 0;
        this.setState({ totalImageSearch: count });
      });
      getImageSearchEngines(["google", "baidu", "tineye", "bing", "yandex", "saucenao", "iqdb"], (engines) => {
        this.setState({engines: engines});
      });
    });
  },
  onDragOver: function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  },
  onDrop: function(e) {
    e.stopPropagation();
    e.preventDefault();
    const url = URL.createObjectURL(e.dataTransfer.files[0]);
    $('#uploadedImage').attr('src', url);
  },
  upload: function(e) {
    const url = URL.createObjectURL(e.target.files[0]);
    $('#uploadedImage').attr('src', url);
  },
  search: function(e) {
    fetchBlob(e.target.src, (blob) => {
      this.reader.readAsDataURL(blob);
    });
  },
  notImage: function(e) {
    chrome.notifications.create({
      type:'basic',
      iconUrl: '/images/icon_128.png',
      title: GL('reverse_image_search'),
      message: GL('ls_0')
    });
  },
  render: function() {
    if(!this.state.enabled) {
      return null;
    }
    const icons=(this.state.engines||[]).map((elem, index) => {
      return (
				<img key={index} src={'/thirdParty/'+elem+'.png'} />
			);
    });
    return (
      <div className="container" id="imageSearch">
        <h5 className="header">{GL('imageSearch')}</h5>
        <div id="info" className="container">
          <p className="important line">{GL('totalSearches')+' : '+this.state.totalImageSearch}</p>
          <div className="btn line">
            <input onChange={this.upload} type='file' id='imageUpload' />
            <label id="imageUploadLabel" htmlFor="imageUpload">{GL('upload_image')}</label>
          </div>
          <img onError={this.notImage} onLoad={this.search} id='uploadedImage' />
          <div id="icons" className="line">
          </div>
        </div>
      </div>
		);
  }
});
