//basically Website will display the website block and update image size if the image is loaded
import React from 'react';

export default class Website extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false
    };
  }
	componentDidMount() {
		const website = this.props.data;
		if (website.searchEngine == 'iqdb') {
			const match = website.description.match(/(\d+)×(\d+)/);
			if (match) {
				this.props.updateImageSize(website.imageUrl, parseInt(match[1]), parseInt(match[2]));
			}
		}
	}
	focus() {
		this.setState({
			focus: !this.state.focus
		});
	}
	getSize(e) {
		this.props.updateImageSize(e.target.src, e.target.naturalWidth, e.target.naturalHeight);
	}
	render() {
		let hidden = '';
		const website = this.props.data;
		let focus = '';
		if (this.state.focus) {
			focus = ' focus';
		}
		let size = '';
		let imageSize = this.props.getImageSize();
		if (website.searchEngine && website.searchEngine != 'google' && website.searchEngine != 'iqdb') {
			size = imageSize.width + ' x ' + imageSize.height + ' - ';
		}
		let related = '';
		if (website.related) {
			related = ' related';
		}
		if (website.searchEngine == 'iqdb' && website.description.indexOf('No relevant matches') != -1) {
			hidden = ' hidden';
		}
		let horizontal = ' horizontal';
		if (focus) {
			horizontal = '';
		}
		return (
			<div className={"website card" + horizontal + focus + related + hidden}>
				<div className="card-image">
					<img onLoad={this.getSize.bind(this)} onClick={this.focus.bind(this)}	className={"image "+focus} src={website.imageUrl} /> 
				</div>
				<div className="card-stack container" >
					<div className="caard-content">
						<div className="header" >
							<img className="icon" src={'/thirdParty/'+website.searchEngine+'.png'} />
							<a target="_blank" title={website.link} href={website.link}>{website.title}</a>
						</div> 
						<div className="description" dangerouslySetInnerHTML={{__html: size + website.description}}>
						</div>
					</div>
				</div>
			</div>
		);
	}
};