export default () => {
  window.browser = chrome;
  window["i18n"]   = (string) =>{
    // console.log(string);
    // console.log(chrome.i18n.getMessage("video_control"));
    return chrome.i18n.getMessage(string)
  }
}
