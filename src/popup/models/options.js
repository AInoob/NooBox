import {engineMap} from 'SRC/constant/engineNameMap.js';
export default {
  namespace:"options",
  state:{
    autoRefresh: true,
    history: false,
    checkUpdate: false,
    videoControl: false,
    extractImages: true,
    imageSearch: true,
    imageSearchNewTabFront: true,
    screenshotSearch: true,
    imageSearchUrl_google: false,
    imageSearchUrl_baidu: false,
    imageSearchUrl_yandex: false,
    imageSearchUrl_bing: false,
    imageSearchUrl_tineye: false,
    imageSearchUrl_saucenao: false,
    imageSearchUrl_iqdb: false,
    imageSearchUrl_ascii2d: false,
    inited:true,
    tools:[
      "autoRefresh",
      "videoControl",
      "extractImages",
      "imageSearch",
      "imageSearchNewTabFront",
      "screenshotSearch"],
    experience:
    ["history",
    "checkUpdate"],
  },
  effects:{
    *init(){
      let current = 
    },
    *onChecked({payload},{put,select}){
    
    },
    *onCheckEngine({payload},{put,select}){

    },
    *onCheckTool({payload},{put,select}){

    },
    *onCheckExp({payload},{put,select}){

    },
  },
  reducers:{
    updateState(state,{payload}){
      return Object.assign({},state,payload);
    }
  },
}