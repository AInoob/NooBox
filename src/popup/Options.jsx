import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';

const OptionsDiv = styled.div`
	padding-left: 25px;
	padding-right: 25px;
	p{
		margin:0px;
		clear:both;
	}
	.imageSearchSwitch{
		float: left;
		img{
			width: 30px;
		}
		input:not(:checked){
			&+img{
				opacity: 0.3;
			}
		}
	}
`;

class Options extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
			history: true,
			installType: 'normal',
			settings: {
				history: false,
				checkUpdate: false,
				videoControl: false,
				extractImages: false,
				imageSearch: false,
				screenshotSearch: false,
				imageSearchUrl_google: false,
				imageSearchUrl_baidu: false,
				imageSearchUrl_yandex: false,
				imageSearchUrl_bing: false,
				imageSearchUrl_tineye: false,
				imageSearchUrl_saucenao: false,
				imageSearchUrl_iqdb: false,
				imageSearchUrl_ascii2d: false,
			}
		};
  }
  componentDidMount() {
    const switchList = [
			'history',
			'checkUpdate',
			'videoControl',
			'extractImages',
			'imageSearch',
			'screenshotSearch',
			'imageSearchUrl_google',
			'imageSearchUrl_baidu',
			'imageSearchUrl_yandex',
			'imageSearchUrl_bing',
			'imageSearchUrl_tineye',
			'imageSearchUrl_saucenao',
			'imageSearchUrl_iqdb',
			'imageSearchUrl_ascii2d',
		];
    chrome.management.getSelf((data) => {
      this.setState({
				installType: data.installType
			});
    });
    for(let i = 0; i < switchList.length; i++) {
      isOn(
        switchList[i],
        function(ii) {
          this.setState((prevState) => {
            prevState.settings[switchList[ii]] = true;
            return prevState;
          });
        }.bind(this,i),
        function(ii) {
          this.setState((prevState) => {
            prevState.settings[switchList[ii]] = false;
            return prevState;
          });
        }.bind(this,i)
      );
    }
  }
  toggleSetting(id) {
    const newValue = !this.state.settings[id];
    set(id, newValue, () => {
      this.setState((prevState) => {
        prevState.settings[id] = newValue;
        return prevState;
      });
      chrome.extension.sendMessage({ job: id });
    });
  }
  getSwitch(id, handler) {
    return <div className="switch">
      <label htmlFor={id} >
        <input type="checkbox" onChange={(handler||this.toggleSetting.bind(this,id))} checked={this.state.settings[id]} id={id} />
        <span className="lever"></span>
      </label>
      {GL(id)}
    </div>;
  }
  getImageSearchSwitch(id, handler) {
    return <div className="switch">
      <label htmlFor={id} >
        <input type="checkbox" onChange={(handler||this.toggleSetting.bind(this,id))} checked={this.state.settings[id]} id={id} />
        <img title={GL(id)} src={'/thirdParty/'+id.slice(15)+'.png'} />
      </label>
    </div>;
  }
  getCheckbox(id,handler) {
    return <p>
      <input type="checkbox" onChange={(handler||this.toggleSetting.bind(this,id))} checked={this.state.settings[id]} id={id} />
      <label htmlFor={id} >{GL(id)}</label>
    </p>;
  }
  render() {
    let imageSearchEngines = null;
    if(this.state.settings['imageSearch']) {
      imageSearchEngines= [
				"imageSearchUrl_google",
				"imageSearchUrl_baidu",
				"imageSearchUrl_tineye",
				"imageSearchUrl_bing",
				"imageSearchUrl_yandex",
				"imageSearchUrl_saucenao",
				"imageSearchUrl_iqdb",
				"imageSearchUrl_ascii2d",
			].map((elem, index) => {
        return <div className="tab-1 imageSearchSwitch" key={index}>{this.getImageSearchSwitch(elem)}</div>;
      });
    }
    let checkUpdate = null;
    if(this.state.installType != 'normal') {
      checkUpdate = this.getCheckbox('checkUpdate');
    }
    return (
			<OptionsDiv>
				<h5 className="header">{GL('images')}</h5>
					<div className="tab-1">
					<p></p>
					{this.getCheckbox('imageSearch')}
					{imageSearchEngines}
					<p></p>
					{this.getCheckbox('extractImages')}
					<p></p>
					{this.getCheckbox('screenshotSearch')}
					<p></p>
				</div>
				<h5 className="header">{GL('videoControl')}</h5>
				<div className="tab-1">
					{this.getCheckbox('videoControl')}
					<p></p>
				</div>
				<h5 className="header">{GL('experience')}</h5>
				<div className="tab-1">
					{this.getCheckbox('history')}
					<p></p>
					{checkUpdate}
					<p></p>
				</div>
			</OptionsDiv>
		);
  }
};

export default Options;