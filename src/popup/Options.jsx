import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Checkbox, Row, Col} from 'antd';

const OptionsDiv = styled.div`
	padding-left: 5px;
	padding-right: 25px;
	.header{
		
	}
	.imageSearchSwitch{
		display:inline;
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
				autoRefresh: false,
				history: false,
				checkUpdate: false,
				videoControl: false,
				extractImages: false,
				imageSearch: false,
				imageSearchNewTabFront: false,
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
			'autoRefresh',
			'history',
			'checkUpdate',
			'videoControl',
			'extractImages',
			'imageSearch',
			'imageSearchNewTabFront',
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
        <input className="hide" type="checkbox" onChange={(handler||this.toggleSetting.bind(this,id))} checked={this.state.settings[id]} id={id} />
        <img className="pointer" title={GL(id)} src={'/thirdParty/'+id.slice(15)+'.png'} />
      </label>
    </div>;
  }
  getCheckbox(id,handler) {
    return <p>
			<Checkbox onChange={(handler||this.toggleSetting.bind(this,id))} checked={this.state.settings[id]} id={id}>
				{GL(id)}
			</Checkbox>
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
				// return <div className="tab-1 imageSearchSwitch" key={index}>{this.getImageSearchSwitch(elem)}</div>;
				return <Col className="imageSearchSwitch" span = {3} key={index}>{this.getImageSearchSwitch(elem)}</Col>
      });
    }
    let checkUpdate = null;
    if(this.state.installType != 'normal') {
      checkUpdate = this.getCheckbox('checkUpdate');
    }
    return (
			<OptionsDiv>
				<h5 className="header">{GL('images')}</h5>
					<div className="">
					
					{this.getCheckbox('imageSearchNewTabFront')}
					{this.getCheckbox('extractImages')}
					{this.getCheckbox('screenshotSearch')}
					{this.getCheckbox('imageSearch')}
					<Row gutter ={4}>
						{imageSearchEngines}
					</Row>
					
					</div>

				<h5 className="header">{GL('tools')}</h5>

				<div className="">
					{this.getCheckbox('autoRefresh')}
					{this.getCheckbox('videoControl')}
				</div>

				<h5 className="header">{GL('experience')}</h5>
				<div className="">
					{this.getCheckbox('history')}
					{checkUpdate}
				</div>
			</OptionsDiv>
		);
  }
};

export default Options;