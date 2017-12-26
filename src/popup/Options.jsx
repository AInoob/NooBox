import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Switch, Icon, Card, Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;
const CheckboxGroup2 = Checkbox.Group;
const CheckboxGroup3 = Checkbox.Group;

const imageSearchOptions = [GL("screenshotSearch"), GL("extractImages"), GL("imageSearch")];
const imageSearchOptionsValue = ["screenshotSearch", "extractImages", "imageSearch"];

const h5VideoControlOptions = [GL('videoControl')];
const h5VideoControlOptionsValue = ["videoControl"];

const experienceOptions = [GL('history'), GL('checkUpdate')];
const experienceOptionsValue = ['history', 'checkUpdate'];

const OptionsDiv = styled.div`
	padding-left: 20px;
	padding-right: 20px;
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
	.header{
		font-size:15px;
	}
	#cardTitleStyle{
		font-size:12px;
	}
	
	.ant-card-grid {
    border-radius: 0;
    border: 0;
    box-shadow: 0px 0 0 0 #e9e9e9, 0 0px 0 0 #e9e9e9, 0px 0px 0 0 #e9e9e9, 0px 0 0 0 #e9e9e9 inset, 0 0px 0 0 #e9e9e9 inset;
    width: 10%;
    float: left;
    padding: 10px;
    -webkit-transition: all .3s;
    transition: all .3s;
}

  #checkboxName{
	 display:inline;
	 width: 30px;
	}
	.ant-checkbox-wrapper{
		display:inline-block;
		font-size:12px;
		font-weight:600;
		width:100%
	}

	.checkBoxHeader{
		display:inline;
		font-size:16px;
	}
	#p1{
		margin-bottom: 5px;
	}
`;

class Options extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imageSearchCheckedList: [],
			imageSearchIndeterminate: true,
			imageSearchCheckAll: false,
			imageSearchMap: this.mapFunction(imageSearchOptions, imageSearchOptionsValue),

			h5VideoControlCheckedList: [],
			h5VideoControlIndeterminate: true,
			h5VideoControlCheckAll: false,
			h5VideoControlMap: this.mapFunction(h5VideoControlOptions, h5VideoControlOptionsValue),

			experienceCheckedList: [],
			experienceInderterminate: true,
			experienceCheckAll: false,
			experienceMap: this.mapFunction(experienceOptions, experienceOptionsValue),

			history: true,
			installType: 'normal',
			settings: {
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
		for (let i = 0; i < switchList.length; i++) {
			isOn(
				switchList[i],
				function (ii) {
					this.setState((prevState) => {
						prevState.settings[switchList[ii]] = true;

						if (imageSearchOptionsValue.includes(switchList[ii])) {

							prevState.imageSearchCheckedList.push(GL(switchList[ii]));

							if (prevState.imageSearchCheckedList.length === imageSearchOptions.length) {

								prevState.imageSearchIndeterminate = false;
								prevState.imageSearchCheckAll = true;

							}
						}

						if (h5VideoControlOptionsValue.includes(switchList[ii])) {

							prevState.h5VideoControlCheckedList.push(GL(switchList[ii]));
							if (prevState.h5VideoControlCheckedList.length == h5VideoControlOptions.length) {
								prevState.h5VideoControlIndeterminate == false;
								prevState.h5VideoControlCheckAll == true;
							}
						}

						if (experienceOptionsValue.includes(switchList[ii])) {

							prevState.experienceCheckedList.push(GL(switchList[ii]));
							if (prevState.experienceCheckedList.length === experienceOptions) {
								prevState.experienceInderterminate == false;
								prevState.experienceCheckAll == true;
							}
						}

						return prevState;
					});
				}.bind(this, i),
				function (ii) {
					this.setState((prevState) => {
						prevState.settings[switchList[ii]] = false;
						return prevState;
					});
				}.bind(this, i)
			);
		}
	}

	toggleSetting(id, checkedList, passBy) {
		const newValue = !this.state.settings[id];
		set(id, newValue, () => {
			this.setState((prevState) => {
				prevState.settings[id] = newValue;

				if (imageSearchOptionsValue.includes(id) && passBy === "onChangeImage") {
					prevState.imageSearchCheckedList = checkedList;
					prevState.imageSearchIndeterminate = !!checkedList.length && (checkedList.length < imageSearchOptions.length);
					prevState.imageSearchCheckAll = checkedList.length === imageSearchOptions.length;
				} else if (imageSearchOptionsValue.includes(id) && passBy === "onChangeImageAll") {
					prevState.imageSearchCheckedList = checkedList;
					prevState.imageSearchIndeterminate = false;
					if (checkedList.length == 0) {
						prevState.imageSearchCheckAll = false;
					} else {
						prevState.imageSearchCheckAll = true;
					}
				} else if (h5VideoControlOptionsValue.includes(id) && passBy == "onChangeH5VideoControl") {
					prevState.h5VideoControlCheckedList = checkedList;
					prevState.h5VideoControlIndeterminate = !!checkedList.length && (checkedList.length < h5VideoControlOptions.length);
					prevState.h5VideoControlCheckAll = checkedList.length === h5VideoControlOptions.length;
				} else if (h5VideoControlOptionsValue.includes(id) && passBy == "onChangeH5VideoControlAll") {
					prevState.h5VideoControlCheckedList = checkedList;
					prevState.h5VideoControlIndeterminate = false;
					if (checkedList.length == 0) {
						prevState.onChangeH5VideoControlAll = false;
					} else {
						prevState.onChangeH5VideoControlAll = true;
					}

				} else if (experienceOptionsValue.includes(id) && passBy === "onChangeExperience") {
					prevState.experienceCheckedList = checkedList;
					prevState.experienceInderterminate = !!checkedList.length && (checkedList.length < h5VideoControlOptions.length);
					prevState.experienceCheckAll = checkedList.length === h5VideoControlOptions.length;
				} else if (experienceOptionsValue.includes(id) && passBy === "onChangeExperienceAll") {
					prevState.experienceCheckedList = checkedList;
					prevState.experienceInderterminate = false;
					if (checkedList.length == 0) {
						prevState.experienceCheckAll = false;
					} else {
						prevState.experienceCheckAll = true;
					}
				}

				return prevState;
			});
			chrome.extension.sendMessage({ job: id });
		});

	}

	getSwitch(id, handler) {
		return (
			<div className="switch">
				<label htmlFor={id} >
					<input type="checkbox" onChange={(handler || this.toggleSetting.bind(this, id))} checked={this.state.settings[id]} id={id} />
					<span className="lever"></span>
				</label>
				{GL(id)}
			</div>
		);
	}
	getImageSearchSwitch(id, handler) {
		return <div className="switch">
			<label htmlFor={id} >
				<input type="checkbox" onChange={(handler || this.toggleSetting.bind(this, id))} checked={this.state.settings[id]} id={id} />
				<img title={GL(id)} src={'/thirdParty/' + id.slice(15) + '.png'} />
			</label>
		</div>;
	}

	getCheckbox(id, handler) {
		return (
			<Checkbox id="checkBox" onChange={(handler || this.toggleSetting.bind(this, id))} checked={this.state.settings[id]} id={id} ><p id="checkboxName">{GL(id)}</p></Checkbox>
		);
	}


	onChangeImage(checkedValues) {
		for (let i = 0; i < checkedValues.length; i++) {
			let value = this.state.imageSearchMap.get(checkedValues[i]);
			if (!this.state.settings[value]) {
				this.toggleSetting(value, checkedValues, "onChangeImage");
			}
		}
		for (let i = 0; i < imageSearchOptions.length; i++) {
			let value = this.state.imageSearchMap.get(imageSearchOptions[i]);
			if (this.state.settings[value] && !checkedValues.includes(imageSearchOptions[i])) {
				this.toggleSetting(value, checkedValues, "onChangeImage");
			}
		}
	}
	onChangeImageAll(e) {
		if (e.target.checked) {
			for (let i = 0; i < imageSearchOptions.length; i++) {
				let key = imageSearchOptions[i];
				let value = this.state.imageSearchMap.get(key);
				if (!this.state.settings[value]) {
					let updateList = this.state.imageSearchCheckedList;
					updateList.push(key);
					this.toggleSetting(value, updateList, "onChangeImageAll");
				}
			}
		} else {
			for (let i = 0; i < imageSearchOptions.length; i++) {
				let key = imageSearchOptions[i];
				let value = this.state.imageSearchMap.get(key);
				if (this.state.settings[value]) {
					let updateList = this.state.imageSearchCheckedList;
					let index = updateList.indexOf(key);
					updateList.splice(index, 1);
					this.toggleSetting(value, updateList, "onChangeImageAll");
				}
			}
		}
	}
	onChangeH5VideoControl(checkedValues) {


		for (let i = 0; i < checkedValues.length; i++) {
			let value = this.state.h5VideoControlMap.get(checkedValues[i]);

			if (!this.state.settings[value]) {

				this.toggleSetting(value, checkedValues, "onChangeH5VideoControl");
			}
		}

		for (let i = 0; i < h5VideoControlOptions.length; i++) {
			let value = this.state.h5VideoControlMap.get(h5VideoControlOptions[i]);

			if (this.state.settings[value] && !checkedValues.includes(h5VideoControlOptions[i])) {
				this.toggleSetting(value, checkedValues, "onChangeH5VideoControl");
			}
		}

	}
	onChangeH5VideoControlAll(e) {
		if (e.target.checked) {
			for (let i = 0; i < h5VideoControlOptions.length; i++) {
				let key = h5VideoControlOptions[i];
				let value = this.state.h5VideoControlMap.get(key);
				if (!this.state.settings[value]) {
					let updateList = this.state.h5VideoControlCheckedList;
					updateList.push(key);
					this.toggleSetting(value, updateList, "onChangeH5VideoControlAll");
				}
			}
		} else {
			for (let i = 0; i < h5VideoControlOptions.length; i++) {
				let key = h5VideoControlOptions[i];
				let value = this.state.h5VideoControlMap.get(key);
				if (this.state.settings[value]) {
					let updateList = this.state.h5VideoControlCheckedList;
					let index = updateList.indexOf(key);
					updateList.splice(index, 1);
					this.toggleSetting(value, updateList, "onChangeH5VideoControlAll");
				}
			}
		}
	}
	onChangeExperience(checkedValues) {

		for (let i = 0; i < checkedValues.length; i++) {
			let value = this.state.experienceMap.get(checkedValues[i]);

			console.log(value + " " + this.state.settings[value]);

			if (!this.state.settings[value]) {

				this.toggleSetting(value, checkedValues, "onChangeExperience");
			}
		}
		for (let i = 0; i < experienceOptions.length; i++) {
			let value = this.state.experienceMap.get(experienceOptions[i]);


			if (this.state.settings[value] && !checkedValues.includes(experienceOptions[i])) {
				console.log("option Scan" + value + " " + this.state.settings[value]);
				this.toggleSetting(value, checkedValues, "onChangeExperience");
			}
		}

	}
	onChangeExperienceAll(e) {
		if (e.target.checked) {
			for (let i = 0; i < experienceOptions.length; i++) {
				let key = experienceOptions[i];
				let value = this.state.experienceMap.get(key);
				if (!this.state.settings[value]) {
					let updateList = this.state.experienceCheckedList;
					updateList.push(key);
					this.toggleSetting(value, updateList, "onChangeExperienceAll");
				}
			}
		} else {
			for (let i = 0; i < experienceOptions.length; i++) {
				let key = experienceOptions[i];
				let value = this.state.experienceMap.get(key);
				if (this.state.settings[value]) {
					let updateList = this.state.experienceCheckedList;
					let index = updateList.indexOf(key);
					updateList.splice(index, 1);
					this.toggleSetting(value, updateList, "onChangeExperienceAll");
				}
			}
		}
	}
	mapFunction(list1, list2) {
		let m = new Map();
		for (let i = 0; i < list1.length; i++) {
			m.set(list1[i], list2[i]);
		}
		return m;
	}
	render() {

		let imageSearchEngines = null;
		if (this.state.settings['imageSearch']) {
			imageSearchEngines = [
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
				return <Card.Grid className="tab-1 imageSearchSwitch" key={index} >{this.getImageSearchSwitch(elem)}</Card.Grid>;
			});
		}
		let checkUpdate = null;
		if (this.state.installType != 'normal') {
			checkUpdate = this.getCheckbox('checkUpdate');
		}

		let imageSearchEnginesCard = (
			<Card noHovering>
				{imageSearchEngines}
			</Card>
		);

		if (!imageSearchEngines) {
			imageSearchEngines = null;
			imageSearchEnginesCard = null;
		}
		return (
			<OptionsDiv>
				<div id="p1">
					<h5 className="checkBoxHeader">{GL('images')}</h5>
					<CheckboxGroup options={imageSearchOptions} defaultValue={this.state.imageSearchCheckedList} onChange={this.onChangeImage.bind(this)} />
					{imageSearchEnginesCard}
				</div>


				<div id="p1">
					<h2 className="checkBoxHeader">{GL('videoControl')}</h2>
					{/* <div style={{ borderBottom: '1px solid #E9E9E9' }}>
								<Checkbox
									indeterminate = {this.state.h5VideoControlIndeterminate}
									checked = {this.state.h5VideoControlCheckAll}
									onChange = {this.onChangeH5VideoControlAll.bind(this)}
							
									></Checkbox>	
							</div> */}
					<CheckboxGroup2 options={h5VideoControlOptions} defaultValue={this.state.h5VideoControlCheckedList} onChange={this.onChangeH5VideoControl.bind(this)} />
				</div>

				<div id="p1">
					<h2 className="checkBoxHeader">{GL('experience')}</h2>

					{/* <div style={{ borderBottom: '1px solid #E9E9E9' }}>
									<Checkbox
									indeterminate = {this.state.experienceInderterminate}
									checked = {this.state.experienceCheckAll}
									onChange = {this.onChangeExperienceAll.bind(this)}
								><h2 className = "checkBoxHeader">{GL('experience')}</h2></Checkbox>	
							</div> */}

					<CheckboxGroup3 options={experienceOptions} defaultValue={this.state.experienceCheckedList} onChange={this.onChangeExperience.bind(this)} />
				</div>





				{/* <h5 className="header">{GL('videoControl')}</h5>
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

				</div> */}
			</OptionsDiv>
		);
	}
};

export default Options;