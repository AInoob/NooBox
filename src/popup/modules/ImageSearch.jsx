import React from 'react';
import styled from 'styled-components';
import { Upload, Icon, message, Button, Popover } from 'antd';
const Dragger = Upload.Dragger;

const ImageSearchDiv = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
	#help{
		height: ${props => props.displayHelp ? 'initial' : '0px'};
		overflow: hidden;
		margin: 0;
	}
	
	#uploadIcon{
	    font-size: 50px;
	    color: #49a9ee;
	}
	#uploadButton{
	    height: 70px;
	    width:  100%;
	}
	
	#imageUpload,#uploadedImage{
 		display:none;
 	}
 	
 	#imageUploadLabel{
 	    position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }
  
  #uploadArea{
    width: 100%
    }
    
  #pop{
        display:inline;
        margin-left: 10px;
        font-size: 15px;
    }
  
  #imageSearchHeader{
      font-size: 15px;
      margin-bottom: 5px;
  }
  

  
   
  
    
`;
// New Help Button
const content = (
  <div>
    <p id='test'>
      {GL('ls_12')}
    </p> <br />
    <p>
      {GL('ls_13')} <br />
    </p> <br />
  </div>
);

const pop = (
  <div id="pop">
    <Popover content={content} title="Help" >
      <Icon type="question-circle" />
    </Popover>
  </div>

);

class ImageSearch extends React.Component {

  //Constructor
  constructor(props) {
    super(props);
    this.state = { enabled: false, displayHelp: false };
    this.reader = new window.FileReader();
    this.search = this.search.bind(this);
  }


  componentDidMount() {
    isOn('imageSearch', () => {
      this.setState({ enabled: true });
      this.reader.onloadend = () => {
        const base64data = this.reader.result;
        chrome.extension.sendMessage({
          job: 'analytics',
          category: 'uploadSearch',
          action: 'run'
        }, () => { });
        chrome.extension.sendMessage({ job: 'imageSearch_upload', data: base64data });
      }

      get('totalImageSearch', (count) => {
        count = count || 0;
        this.setState({ totalImageSearch: count });
      });

      getImageSearchEngines(["google", "baidu", "tineye", "bing", "yandex", "saucenao", "iqdb"], (engines) => {

        this.setState({ engines: engines });

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

  //Get the image and create an URI for it, then load the image
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
      type: 'basic',
      iconUrl: '/images/icon_128.png',
      title: GL('reverse_image_search'),
      message: GL('ls_0')
    });
  }

  render() {
    if (!this.state.enabled) {
      return null;
    }

    //Unused, Then Delete?
    // const icons = (this.state.engines||[]).map((elem, index) => {
    //     return (
    //         <img key={index} src={'/thirdParty/'+elem+'.png'} />
    //     );
    // });

    return (
      <ImageSearchDiv className="container">
        <h5 className="header" id="imageSearchHeader">
          {GL('imageSearch')}
          {pop}
        </h5>



        {/*<div id="info" className="container">*/}
        {/*/!*<p className="important line">{GL('totalSearches')+' : '+this.state.totalImageSearch}</p>*!/*/}

        <div id="uploadArea">

          <Button id='uploadButton' type="dashed">

            <p className="ant-upload-drag-icon">

              <Icon id="uploadIcon" type="inbox" />

            </p>

            <p className="ant-upload-text"></p>

            <input onChange={this.upload} type='file' accept="image/*" id='imageUpload' />

            <label id="imageUploadLabel" onDragOver={this.onDragOver} onDrop={this.onDrop}
              htmlFor="imageUpload" />

          </Button>
        </div>

        <img onError={this.notImage} onLoad={this.search} id='uploadedImage' />

        <div id="icons" className="line" />

        {/*</div>*/}
      </ImageSearchDiv>
    );
  }
};

export default ImageSearch;