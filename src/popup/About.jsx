import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import {Icon} from 'antd';
const AboutDiv = styled.div`
	.shareItem{
		float: left;
		width: 42px;
		margin-left: 3px;
		img{
			width: 100%;
		}
	}
	.container{
		margin-top: -11px;
		margin-bottom: -11px;
		overflow: hidden;
	}
`;

class About extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      what:       false,
      privacy:    false,
      ack:        false,

    }
  }
  switchIcon(name){
    switch (name){
      case "what":
        if(this.state[name]){
          return(<Icon type="minus-circle"onClick = {() => this.handleClickWhat()}/>)
        }else{
          return(<Icon type="plus-circle"   onClick = {() => this.handleClickWhat()}/>)
        }
        break;
      case "privacy":
        if(this.state[name]){
          return(<Icon type="minus-circle"onClick = {() => this.handleClickPrivacy()}/>)
        }else{
          return(<Icon type="plus-circle"   onClick = {() => this.handleClickPrivacy()}/>)
        }
        break;
      case "ack":
        if(this.state[name]){
          return(<Icon type="minus-circle"onClick = {() => this.handleClickAck()}/>)
        }else{
          return(<Icon type="plus-circle"   onClick = {() => this.handleClickAck()}/>)
        }
        break;
    }
  }
  handleClickWhat(){
    this.setState ({
      what: !this.state.what,
    });
  }
  handleClickPrivacy(){
    this.setState ({
      privacy: !this.state.privacy,
    });
  }
  handleClickAck(){
    this.setState({
      ack: !this.state.ack,
    });
  }

  render() {
    let whatSwitch = this.switchIcon("what");
    let privacySwitch = this.switchIcon("privacy");
    let ackSwitch = this.switchIcon("ack");

    let shareList = [{
      imageName: 'facebookShare',
      link: 'https://www.facebook.com/sharer/sharer.php?u=https%3A//ainoob.com/project/noobox',
    }, {
      imageName: 'googleShare',
      link: 'https://plus.google.com/share?url=https%3A//ainoob.com/project/noobox',
    }, {
      imageName: 'linkedinShare',
      link: 'https://www.linkedin.com/shareArticle?mini=true&url=https%3A//ainoob.com/project/noobox&title=NooBox%20---%20A%20ultimate%20extension%20for%20Chrome%20extensions%%20managing&summary=&source=',
    }, {
      imageName: 'twitterShare',
      link: 'https://twitter.com/home?status=https%3A//ainoob.com/project/noobox',
    }, {
      imageName: 'sinaShare',
      link: 'http://www.jiathis.com/send/?webid=tsina&url=https://ainoob.com/project/noobox&title=NooBox',
    }, {
      imageName: 'wechatShare',
      link: 'http://www.jiathis.com/send/?webid=weixin&url=https://ainoob.com/project/noobox&title=NooBox',
    }, {
      imageName: 'renrenShare',
      link: 'http://www.jiathis.com/send/?webid=renren&url=https://ainoob.com/project/noobox&title=NooBox',
    }].map((website, index) => {
      return (
        <a
          key={index}
          className="shareItem"
          target="_blank"
          href={website.link}
        >
            <img className="shareIcon" src={`thirdParty/${website.imageName}.png`} />
        </a>
      );
    });

    switch(chrome.i18n.getUILanguage()) {
      case 'zh-CN':
        let whatZh   = this.state.what ? (  <div>
          <p>二箱是一个为你提供使用功能的Chrome拓展</p>
          <p>二箱免费并且开源，你可以在
            <a target="_blank" href="https://github.com/AInoob/NooBox">这里</a>找到源代码.
          </p>
        </div>): "";

        let privacyZh = this.state.privacy ? (<div>
          <p>二箱会上传你使用二箱的数据，这么做是为了让AInoob知道有人在用二箱。
            不过AInoob并不能知道你是谁，和你搜索了什么。二箱不会偷取你的任何隐私和历史记录。</p>
        </div>):"";

        let ackZh = this.state.ack ? (<div>
          <li>超级感谢<a href="https://github.com/zhtw2013" target="_blank">zhtw2013</a>提供的繁体翻译！</li>
          <li>二箱使用了Facebook的<a href="https://github.com/facebook/react" target="_blank">React(BSD协议)</a>作为底层建筑</li>
          <li>二箱使用了JS Foundation的<a href="https://jquery.com/" target="_blank">jQuery(MIT协议)</a>来处理一些DOM和Ajax请求</li>
          <li>二箱使用了Hust.cc的<a href="https://github.com/hustcc/timeago.js" target="_blank">Timeago(MIT协议)</a>来显示时间</li>
        </div>):"";

        return (
          <AboutDiv>
            <div className="section container">
              <h5 className="header">二箱是啥？{whatSwitch}</h5>
              {whatZh}
            </div>
            <div className="section container">
              <h5 className="header">隐私 {privacySwitch}</h5>
              {privacyZh}
            </div>

            <div className="section container">
              <h5 className="header">鸣谢 {ackSwitch}</h5>
              {ackZh}
            </div>

            <div className="section container">
              <h5 className="header">分享咩?</h5>
              <p>你喜欢二管家吗？如果觉得还不错，那就考虑一下分享二管家吧~</p>
              {shareList}
            </div>
          </AboutDiv>
        )
      case 'zh-TW':
        let whatZhtw = this.state.what ? (<div>
          <p>二箱是一個為你提供使用功能的Chrome擴充功能</p>
          <p>二箱免費並且開源，你可以在<a target="_blank" href="https://github.com/AInoob/NooBox">這裡</a>找到原始碼.</p>
        </div>): "";

        let privacyZhtw = this.state.privacy? (<div>
          <p>二箱會上傳你使用二箱的資料，這麼做是為了讓AInoob知道有人在用二箱。
            不過AInoob並不能知道你是誰，和你搜尋了什麼。二箱不會竊取你的任何隱私和歷史記錄。</p>
        </div>):"";

        let ackZhtw = this.state.ack? (<div>
          <li>超級感謝<a href="https://github.com/zhtw2013" target="_blank">zhtw2013</a>提供的繁體翻譯！</li>
          <li>二箱使用了Facebook的<a href="https://github.com/facebook/react" target="_blank">React(BSD授權條款)</a>作為底層構築</li>
          <li>二箱使用了JS Foundation的<a href="https://jquery.com/" target="_blank">jQuery(MIT授權條款)</a>來處理一些DOM和Ajax要求</li>
          <li>二箱使用了Hust.cc的<a href="https://github.com/hustcc/timeago.js" target="_blank">Timeago(MIT授權條款)</a>來顯示時間</li>
        </div>): "";

        return (
          <AboutDiv>
            <div className="section container">
              <h5 className="header">二箱是什麼？{whatSwitch}</h5>
              {whatZhtw}
            </div>
            <div className="section container">
              <h5 className="header">隱私 {privacySwitch}</h5>
              {privacyZhtw}
            </div>

            <div className="section container">
              <h5 className="header">鳴謝 {ackSwitch} </h5>
              {ackZhtw}
            </div>

            <div className="section container">
              <h5 className="header">分享咩?</h5>
              <p>你喜歡二管家嗎？如果覺得還不錯，那就考慮一下，將二管家分享給朋友吧~</p>
              {shareList}
            </div>
          </AboutDiv>
        );
      default:
        let whatEng  = this.state.what ? (<div>
          <p>NooBox is a Chrome extension that brings you useful functionalities.</p>
          <p>NooBox is a free and open source software, you can find the source code
            <a target="_blank" href="https://github.com/AInoob/NooBox">here</a>.
          </p>
        </div>): "";

        let ackEng = this.state.ack ?(<div>
          <li>Special thanks to <a href="https://github.com/zhtw2013" target="_blank">zhtw2013</a>
            for providing zh-TW translation!</li>
          <li>NooBox uses <a href="https://github.com/facebook/react" target="_blank">React(BSD Liscense)</a>
            from Facebook to build the bases</li>
          <li>NooBox uses <a href="https://jquery.com/" target="_blank">jQuery(MIT Liscense)</a>
            from JS Foundation to handle DOM and Ajax requests</li>
          <li>NooBox uses <a href="https://github.com/hustcc/timeago.js" target="_blank">Timeago(MIT Liscense)</a>
            from Hust.cc to display timeago</li>
        </div>):"";

        let privacyEng = this.state.privacy ?(<div>
          <p>NooBox does upload your usage of NooBox to the server, it is doing
            so so that AInoob can know if someone is using it or not.
            NooBox does not track who you are or read your history.</p>
        </div>):"";

        return (
          <AboutDiv>
            <div className="section container">
              <h5 className="header">What is NooBox? {whatSwitch}</h5>
              {whatEng}
            </div>
            <div className="section container">
              <h5 className="header">Privacy {privacySwitch}</h5>
              {privacyEng}
            </div>

            <div className="section container">
              <h5 className="header">Acknowledgements {ackSwitch}</h5>
              {ackEng}
            </div>

            <div className="section container">
              <h5 className="header">Share please?</h5>
              <p>Do you like NooBox? If so, please consider sharing it!</p>
              {shareList}
            </div>
          </AboutDiv>
        );
    }
  }
};

export default About;
