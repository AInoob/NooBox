import 'antd/dist/antd.css';

import React from 'react';
import Website from './Website.jsx';
import styled from 'styled-components';
import Brief from './Components/Brief';
import SearchTabs from './Components/SearchContent/SearchTabs';

const ImageSearchDiv = styled.div`
  margin-top: 3%;
	margin-left: 66px;
  margin-right: 66px;
  .ant-card-body {
    padding: 3px;
    zoom: 1;
  }
	.input-field.col label {
		left: 0rem;
	}
	.input-field{
		width: 200px;
	}
	#brief{
		.card-image{
			width: 291px;
			img{
				max-height: 291px;
			}
		}
		.icon.failed{
			opacity: 0.218;
		}
		.icon.loading::before{
			background-image:url(/thirdParty/loading.svg);
		}
		.icon::before{
			width: 46px;
			height: 46px;
			content: ' ';
			position: absolute;
			z-index: 10;
			margin-left: 0px;
			margin-top: 0px;
			background-size: 46px 46px;
		}
	}
	.card{
		.card-content{
			.keyword{
				display: block;
				margin-bottom: 13px;
				font-size: 18px;
				img{
					width: 20px;
					margin-right: 10px;
				}
			}
		}
		.card-action{
			.icon{
				img{
					width: 46px;
				}
			}
		}
	}
	.website{
		.header{
			a{
				white-space: nowrap;
				overflow: hidden;
				display: block;
			}
		}
		.icon{
			width: 34px;
			left: -50px;
			position: absolute;
		}
		.header{
			font-size: 20px;
		}
		.card-image{
			width: 200px;
			img{
				max-width: 200px;
				max-height: 200px;
				cursor: pointer;
			}
		}
	}
	.website.focus{
		.card-image{
			width: 100%;
			img{
				max-width: 100%;
				max-height: none;
				width: initial;
			}
		}
	}
`;

class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
			order: 'relevance',
			imageSizes: {},
			loadBaidu: false,
      engineWeights: {
        google: 30,
        baidu: 20,
        yandex: 15,
        tineye: 18,
        saucenao: 10,
        iqdb: -100,
        ascii2d: -69,
      },
		};
  }
  componentDidMount() {
    this.updateOrder = this.updateOrder.bind(this);
    this.getInitialData();
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			if(request.job == 'image_result_update' && request.cursor == getParameterByName('cursor')) {
				this.getInitialData();
			}
		});
    get('userId', (userId) => {
      get('version', (version) => {
        const hi = {
          userId,
          url: window.location.pathname+window.location.search,
          title: document.title,
          time: new Date().toLocaleString(),
          version
        };
        $.ajax({
          type: 'POST',
          url: "https://ainoob.com/api/noobox/user/",
          contentType: "application/json",
          data: JSON.stringify(hi)
        }).done((data) => {
          // console.log(data);
        });
      });
    });
    $(document).ready(() => {
      $('select').material_select();
      $('.dropdown-content li').on('click', (e) => {
        this.updateOrder($(e.target).text());
      });
    });
  }
  uploadReSearch() {
    const img=$('#imageInput')[0];
    const workerCanvas = document.createElement('canvas');
    const workerCtx = workerCanvas.getContext('2d');
    workerCanvas.width = img.naturalWidth;
    workerCanvas.height = img.naturalHeight;
    workerCtx.drawImage(img, 0, 0);
    const imgDataURI = workerCanvas.toDataURL();
    chrome.runtime.sendMessage({
			job: 'imageSearch_reSearch',
			data: imgDataURI
		}, (response) => {
      window.close();
    });
  }
  getWeight(related, engine, index) {
    let weight = 0;
    if(related) {
      weight += 100;
    }
    weight += this.state.engineWeights[engine];
    weight -= index;
    return weight;
  }
  reloadBaiduImage(x) {
    let allLoaded = true;
    $('.website.baidu').find('img.image').each((e) => {
      if(!this.naturalWidth || this.naturalWidth == 0) {
        const a = this.src;
        const image = new Image();
        image.onload = function() {
          if(image.naturalWidth && image.naturalWidth > 0) {
            this.src = '';
            setTimeout(() => {
              this.src = a;
            },100);
          }
        };
        image.src = a;
      }
      if(!this.naturalWidth || this.naturalWidth == 0) {
        allLoaded = false;
      }
    });
    if(!allLoaded) {
      newWaiting = 2 * x;
      newWaiting = newWaiting > 2000 ? 2000 : newWaiting;
      setTimeout(this.reloadBaiduImage.bind(this, newWaiting), newWaiting);
    }
  }
  updateWebsites() {
    const websites = [];
    const result=this.state.result;
    for(let i = 0; i < (result.engines || []).length; i++) {
      const engine = result.engines[i];
      if(result.baidu && result.baidu.websites && result.baidu.websites.length > 0 && !this.state.loadBaidu) {
        this.setState({ loadBaidu: true });
        loadIframe(result.baidu.url, voidFunc);
        setTimeout(this.reloadBaiduImage.bind(this, 100), 100);
      }
      for(let j = 0;j < (result[engine].relatedWebsites || []).length; j++) {
        const website = result[engine].relatedWebsites[j];
        website.weight = this.getWeight(true, engine, j);
        const imageSize = this.state.imageSizes[website.imageUrl];
        if(imageSize) {
          website.width = imageSize.width;
          website.height = imageSize.width;
          website.area = imageSize.area;
        }
        websites.push(website);
      }
      for(let j = 0; j < (result[engine].websites || []).length; j++) {
        const website = result[engine].websites[j];
        website.weight = this.getWeight(false, engine, j);
        const imageSize = this.state.imageSizes[website.imageUrl];
        if(imageSize) {
          website.width = imageSize.width;
          website.height = imageSize.width;
          website.area = imageSize.area;
        }
        websites.push(website);
      }
    }
    window.setTimeout(() => this.setState({ websites }),1300);
  }
  getInitialData() {
    const cursor = getParameterByName('cursor');
    getDB('NooBox.Image.result_' + cursor, (data) => {
      //  console.log("test Data");
      // console.log(data);
      this.setState({ result: data });
      this.updateWebsites();
     
    });
  }
  getKeyword(engine) {
    return (
      <a target="_blank" href={((this.state.result||{})[engine]||{}).url} className="keyword">

        <img src={'/thirdParty/'+engine+'.png'} />

        {(((this.state.result || {})[engine] || {}).keyword || '(No suck)')}

      </a>
		);
  }
  getKeywordBeta(engine){
    let keyWord = (( this.state.result || {} )[engine] || {}).keyword || undefined;
    return keyWord;
  }
  dealKeyword(){
    let keyWord = this.getKeywordBeta("google");
    
    if(keyWord != undefined){
     
      return <h3 style = {{fontSize:"1.5rem",textAlign:"center"}}><a target="_blank" href={((this.state.result||{})["google"]||{}).url} className="keyword">{keyWord}</a></h3>
    }
    keyWord = this.getKeywordBeta("baidu");
    if(keyWord != undefined){
      return <h3 style = {{fontSize:"1.5rem",textAlign:"center"}}><a target="_blank" href={((this.state.result||{})["baidu"]||{}).url} className="keyword">{keyWord}</a></h3>
    }

    keyWord = this.getKeywordBeta("bing");
    if(keyWord != undefined){
      return <h3 style = {{fontSize:"1.5rem",textAlign:"center"}}><a target="_blank" href={((this.state.result||{})["bing"]||{}).url} className="keyword">{keyWord}</a></h3>
    }

    return <h3 style = {{fontSize:"1.5rem",textAlign:"center"}}>No Title Info</h3>
  } 
  getImageSize(url) {
    if(this.state.imageSizes[url]) {
      return this.state.imageSizes[url];
    }
    else {
      return {
				width: '',
				height: '',
				area: ''
			};
    }
  }
  updateImageSize(index, url, width, height) {
    this.setState((prevState) => {
      prevState.imageSizes[url] = {};
      prevState.imageSizes[url].width = width;
      prevState.imageSizes[url].height = height;
      if(isNaN(width * height)) {
        prevState.imageSizes[url].area = '';
      }
      else{
        prevState.imageSizes[url].area = width*height;
      }
      return prevState;
    });
  }
  sort(a, b) {
    let r = 0;
    const aa = this.getImageSize(a.imageUrl);
    const bb = this.getImageSize(b.imageUrl);
    if(this.state.order == 'area') {
      r = bb.area - aa.area;
    }
    else if(this.state.order == 'width') {
      r = bb.width - aa.width;
    }
    else if(this.state.order == 'height') {
      r = bb.height - aa.height;
    }
    if(r == 0) {
      r = b.weight - a.weight;
		}
    if(r == 0) {
      r = compare(b.link + b.searchEngine, a.link + a.searchEngine);
    }
    if(isNaN(r)) {
      if(isNaN(aa.area) && isNaN(bb.area)) {
        r=compare(b.link + b.searchEngine, a.link + a.searchEngine);
      }
      if(isNaN(aa.area)) {
        r = 1;
      }
      else {
        r = -1;
      }
    }
    return r;
  }
  updateOrder(order) {
    switch(order) {
      case '相关':
        order = 'relevance';
        break;
      case '面积':
        order = 'area';
        break;
      case '宽度':
        order = 'width';
        break;
      case '高度':
        order = 'height';
        break;
    }
    this.setState({ order: order.toLowerCase() });
  }

  getWebsite() {
    const websites = this.state.websites || [];
    return websites.sort(this.sort.bind(this)).map((website, index) => {
      // console.log(website)
      return (
        <Website key={index} getImageSize={this.getImageSize.bind(this, website.imageUrl)} updateImageSize={this.updateImageSize.bind(this,index)} data={website} />
      );
    });
  }

  render() {
    const result = this.state.result || {};
    const websites2 = this.state.websites || [];

    let uploadReSearch = null;
    let source = result.imageUrl;
    if(source == 'dataURI') {
      source = result.dataURI;
    }
    else {
      uploadReSearch=(
        <div className="btn" onClick={this.uploadReSearch}>
          {GL('ls_5')}
        </div>
			);
    }
    const keywords = (
      <div>
        {this.getKeyword('google')}
        {this.getKeyword('baidu')}
        {this.getKeyword('bing')}
      </div>
		);
    const filter = (
      <div className="input-field col s12">
        <select defaultValue="relevance">
          <option value="relevance">{GL('relevance')}</option>
          <option value="area">{GL('area')}</option>
          <option value="width">{GL('width')}</option>
          <option value="height">{GL('height')}</option>
        </select>
        <label>{GL('sortBy')}</label>
      </div>
    );
    const websites = (
      <div className="websites">
        {this.getWebsite()}
      </div>
    );
    let key = this.dealKeyword();
    // console.log(this.state.websites);
    // console.log("test");
    // console.log(source);
    return (
      <ImageSearchDiv>
        <Brief source ={source} keyword = {key} results = {result|| ""} engines ={result.engines||[""]}/>
        <SearchTabs data = {this.state.websites}/>
        {/* {filter} */}
        {/* {websites} */}
        {uploadReSearch}
      </ImageSearchDiv>
		);
  }
};

export default Result;