import React from 'react';
import styled from 'styled-components';

const ImageSearchDiv = styled.div`
	#help{
		height: ${props => props.displayHelp? 'initial' : '0px'};
		overflow: hidden;
		margin: 0;
	}
`;

class ImageSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { enabled: false, displayHelp: false };
    this.reader = new window.FileReader();
    this.search = this.search.bind(this);
  }
  componentDidMount() {
    isOn('imageSearch', () => {
      this.setState({enabled:true});
      this.reader.onloadend = () => {
        const base64data = this.reader.result;                
        chrome.extension.sendMessage({
					job:'analytics',
					category:'uploadSearch',
					action:'run'
				}, () => {});
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
  }
  onDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }
  onDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    const url = URL.createObjectURL(e.dataTransfer.files[0]);
    $('#uploadedImage').attr('src', url);
  }
  upload(e) {
    const url = URL.createObjectURL(e.target.files[0]);
    $('#uploadedImage').attr('src', url);
  }
  search(e) {
    fetchBlob(e.target.src, (blob) => {
      this.reader.readAsDataURL(blob);
    });
  }
  notImage(e) {
    chrome.notifications.create({
      type:'basic',
      iconUrl: '/images/icon_128.png',
      title: GL('reverse_image_search'),
      message: GL('ls_0')
    });
  }
  render() {
    if(!this.state.enabled) {
      return null;
    }
    const icons = (this.state.engines||[]).map((elem, index) => {
      return (
				<img key={index} src={'/thirdParty/'+elem+'.png'} />
			);
    });
    const help = <p className="important" id="help">{GL('ls_11')}<br/><br/>{GL('ls_12')}<br/><br/>{GL('ls_13')}</p>;
    return (
      <ImageSearchDiv displayHelp={this.state.displayHelp} className="container">
        <h5 className="header">{GL('imageSearch')}<span className="helpButton" onClick={()=>{this.setState({displayHelp: !this.state.displayHelp})}}>&nbsp;(?)</span></h5>
				{help}
        <div id="info" className="container">
          <p className="important line">{GL('totalSearches')+' : '+this.state.totalImageSearch}</p>
          <div className="btn line">
            <input onChange={this.upload} type='file' accept="image/*" id='imageUpload' />
            <label id="imageUploadLabel" onDragOver={this.onDragOver} onDrop={this.onDrop} htmlFor="imageUpload">{GL('upload_image')}</label>
          </div>
          <img onError={this.notImage} onLoad={this.search} id='uploadedImage' />
          <div id="icons" className="line">
          </div>
        </div>
      </ImageSearchDiv>
		);
  }
};

export default ImageSearch;