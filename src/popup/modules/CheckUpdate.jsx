import React from 'react';
import styled from 'styled-components';
import { Popover, Button } from 'antd';


const CheckUpdateDiv = styled.div`
`;

class CheckUpdate extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			enabled: false,
			newChanges: [],
			updateAvailable: false,
			newVersion: '0',
			version: '0',
			updateHistory: [],
			displayNewChanges: false,
			hideNewChanges: true,
		};
		this.checkUpdate = this.checkUpdate.bind(this);
	}

	//Compare Version
	componentDidMount() {

		get('version', (version) => {

			this.setState({ version }, () => {

				get('updateHistory', (updateHistory) => {

					this.setState({ updateHistory }, this.generateReport);

				});

			});

		});

		isOn('checkUpdate', () => {

			this.setState({ enabled: true });

			get('lastUpdateCheck', (lastCheck) => {

				const time = new Date().getTime();

				if (time > lastCheck + 1000 * 60 * 60) {

					this.checkUpdate();
				}

			});

		});
	}
	compareVersion(a, b) {
		const x = a.split('.').map((elem) => {
			return parseInt(elem);
		});;
		const y = b.split('.').map((elem) => {
			return parseInt(elem);
		});;
		for (let i = 0; i < 4; i++) {
			if (x[i] > y[i]) {
				return 1;
			}
			else if (x[i] < y[i]) {
				return -1;
			}
		}
		return 0;
	}
	generateReport() {
		const data = this.state.updateHistory;
		if (data.length == 0) {
			return;
		}
		const last = data.length - 1;
		const newVersion = data[last].version;
		if (this.compareVersion(newVersion, this.state.version) > 0) {
			const newChanges = [];
			let i;
			for (i = 0; i < data.length; i++) {
				if (this.compareVersion(data[i].version, this.state.version) > 0) {
					break;
				}
			}
			for (; i < data.length; i++) {
				console.log(i);
				console.log(data[i].changes);
				let changes = data[i].changes;
				if (isZh) {
					changes = data[i].zhChanges;
				}
				for (let j = 0; j < changes.length; j++) {
					newChanges.push(changes[j]);
				}
			}
			this.setState({ updateAvailable: true, newVersion, newChanges });
		}
		else {
			this.setState({ updateAvailable: false });
		}
	}

	checkUpdate() {
		set('lastUpdateCheck', new Date().getTime());
		$.ajax({
			type: 'GET',
			url: 'https://ainoob.com/api/noobox/updateList'
		}).done((updateHistory) => {
			this.setState({ updateHistory }, () => {
				set('updateHistory', updateHistory, () => {
					this.generateReport();
				});
			});
		});
	}

	hide() {
		this.setState({
			hideNewChanges: !this.state.hideNewChanges,
		});
	}

	render() {
		if (!this.state.enabled) {
			return null;
		}
		let newChanges;
		// let report = <p className="line">{GL('ls_7')}</p>;

		if (this.state.updateAvailable) {
			newChanges = this.state.newChanges.map(function (elem, index) {

				return <div className="listItem" key={index}>{elem}</div>;

			});
		}

		let updateNote = GL('ls_8') + this.state.newVersion;

		let updatedNote = GL('ls_7');

		let disPlayNote = this.state.updateAvailable ? (
			<div id="updateButton">
				<Popover content={newChanges} title="Update Detail">
					<Button type="primary">{updateNote}</Button>
				</Popover>
			</div>
		) : (
				<div id="updateButton">
					<Button type="dashed">{updatedNote}</Button>
				</div>
			);


		return (
			<CheckUpdateDiv >
				<div id="info">
					{disPlayNote}
				</div>

			</CheckUpdateDiv>
		);
	}
};

export default CheckUpdate;