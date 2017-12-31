require("babel-core/register");

import 'antd/dist/antd.css';

//The router of NooBox, all component is under Core.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Overview from './Overview';
import History from './History';
import Options from './Options';
import About from './About';
import Navigator from './Navigator';

import styled, { injectGlobal } from 'styled-components';

injectGlobal`
	html, body {
		height: auto !important;
	}
`;

const NooBoxDiv = styled.div`
  font-size: 15px;
  width: 413px;
  .hidden{
		display: none;
	}
	.hide{
		display: none;
	}
	.pointer{
		cursor: pointer;
	}
	.line{
		margin-top: 0.3em;
		margin-bottom: 0.3em;
	}
	.btn{
		font-size: 0.8rem;
		padding: 0 1rem;
		height: 26px;
		line-height: 26px;
		*{
			cursor: pointer;
		}
	}
	.important{
		color: ${props => props.color1};
		font-size: 1rem;
	}
	.tab-1{
		margin-left: 38px;
	}
	h4{
		margin-top: 0px;
	}
	h5{
		margin-bottom: 3px;
	}
	.helpButton{
		font-size: 1rem;
		cursor: pointer;
	}
	.select-wrapper input.select-dropdown{
		background-color: rgba(255,255,255,0.3);
		padding-left: 17px;
	}
	.select-dropdown{
		color:#26a69a;
  }
 
`;

//Log page views
function logPageView() {
}

class NooBox extends React.Component {
	constructor(props) {
		window.browser = chrome;
		super(props);
		this.state = {
			page: {
				overview: <Overview />,
				history: <History />,
				options: <Options />,
				about: <About />,
			}
		};
		shared.styled = {
			color1: '#7a88e8',
			colorOn: '#26a69a',
		};
		window.goTo = location => {
			window.history.pushState(null, null, 'popup.html?location=' + location);
			this.forceUpdate();
		}
	}
	getLocation() {
		const location = getParameterByName('location');
		return Object.keys(this.state.page).includes(location) ? location : 'overview';
	}
	render() {
		const location = this.getLocation();
		let page = this.state.page[location];
		return (
			<div>
				<Navigator location={location} />
				{page}
			</div>
		);
	}
}

//popup.html will be update to different pathname based on the parameter
ReactDOM.render(
	<NooBoxDiv>
		<NooBox />
	</NooBoxDiv>,
	document.getElementById('noobox')
);
