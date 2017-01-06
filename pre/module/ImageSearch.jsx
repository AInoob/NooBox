var React = require('react');
module.exports = React.createClass({
  displayName: 'ImageSearch',
  reader : new window.FileReader(),
  componentDidMount: function(){
    this.reader.onloadend = function() {
      base64data = this.reader.result;                
      chrome.extension.sendMessage({job: 'imageSearch_upload',data:base64data });
    }.bind(this)
  },
  onDragOver: function(e){
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  },
  onDrop: function(e){
    e.stopPropagation();
    e.preventDefault();
    var url=URL.createObjectURL(e.dataTransfer.files[0]);
    $('#uploadedImage').attr('src',url);
  },
  upload: function(e){
    var url=URL.createObjectURL(e.target.files[0]);
    $('#uploadedImage').attr('src',url);
  },
  search: function(e){
    fetchBlob(e.target.src, function(blob) {
      this.reader.readAsDataURL(blob);
    }.bind(this));
  },
  notImage: function(e){
    chrome.notifications.create({
      type:'basic',
      iconUrl: '/images/icon_128.png',
      title: GL('reverse_image_search'),
      message: GL('ls_0')
    });
  },
  render: function(){
    return (
      <div id="imageSearch">
        <input onChange={this.upload} type='file' id='imageUpload' />
        <label onDrop={this.onDrop} onDragOver={this.onDragOver} id='imageUploadLabel' htmlFor='imageUpload'></label>
        <img onError={this.notImage} onLoad={this.search} id='uploadedImage' />
      </div>);
  }
});
