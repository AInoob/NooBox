//basically Website will display the website block and update image size if the image is loaded
var React = require('react');
module.exports = React.createClass({
  displayName: 'Website',
  getInitialState: function(){
    return {focus:false};
  },
  componentDidMount: function(){
    var website=this.props.data;
    if(website.searchEngine=='iqdb'){
      var match=website.description.match(/(\d+)×(\d+)/);
      if(match){
        this.props.updateImageSize(website.imageUrl,parseInt(match[1]),parseInt(match[2]));
      }
    }
  },
  focus: function(){
    this.setState({focus:!this.state.focus});
  },
  getSize: function(e){
    this.props.updateImageSize(e.target.src,e.target.naturalWidth,e.target.naturalHeight);
  },
  render: function(){
    var hidden='';
    var website=this.props.data;
    var focus='';
    if(this.state.focus){
      focus='focus';
    }
    var size='';
    var imageSize=this.props.getImageSize();
    if(website.searchEngine&&website.searchEngine!='google'&&website.searchEngine!='iqdb'){
      size=imageSize.width+' x '+imageSize.height+' - ';
    }
    var related='';
    if(website.related){
      related=' related';
    }
    if(website.searchEngine=='iqdb'&&website.description.indexOf('No relevant matches')!=-1){
      hidden=' hidden';
    }
    return (
      <div className={"website section "+website.searchEngine+related+hidden}>
        <div className="header">
          <img className="icon" src={'/thirdParty/'+website.searchEngine+'.png'} />
          <a target="_blank" href={website.link}>{website.title}</a>
        </div>
        <img onLoad={this.getSize} onClick={this.focus} className={"image "+focus} src={website.imageUrl} />
        <div className="description" dangerouslySetInnerHTML={{__html: size+website.description}}></div>
      </div>);
  }
});
