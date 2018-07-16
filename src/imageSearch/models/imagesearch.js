import {engineMap} from 'SRC/constant/settingMap.js';
import {get,set} from 'SRC/utils/db.js';
export default {
  namespace:"imageSearch",
  state:{
    inited:false,
    base64:"",
    searchImageInfo:[],
    searchResult:[],
    displayMode:2,

    sortBy:"",
    sortByOrder:0,

    google:false,
    googleDone:false,
    googleMax:5,

    baidu:false,
    baiduDone:false,
    baiduMax:1,

    yandex:false,
    yandexDone:false,
    yandexMax:1,

    bing:false,
    bingDone:false,
    bingMax:1,

    tineye:false,
    tineyeDone:false,
    tineyeMax:1,

    sausao:false,
    sausaoDone:false,
    sausaoMax:1,

    iqdb:false,
    iqdbDone:false,
    iqdbMax:1,

    ascii2d:false,
    ascii2dDone:false,
    ascii2dMax:1,
  },
  effects:{
    *init({payload},{call,put}){
      let engineStatus ={};
      for(let i= 0; i< engineMap.length; i++){
        let dbName = engineMap[i].dbName;
        let name   = engineMap[i].name;
        let dbNameMax = engineMap[i].dbNameMaxSearch;
        let openCheck  = yield call(get,dbName);
        let maxSearch  = yield call(get,dbNameMax);
        if(openCheck){
          engineStatus[name] = true;
        }
        if(maxSearch){
          engineStatus[name+"Max"] = maxSearch;
        }else if(maxSearch == undefined || maxSearch == null){
          yield call(set,dbName+"_max")
        }
      }
      let displayMode = yield call(get,"displayMode");
      console.log(displayMode);
      if(displayMode){
        engineStatus.displayMode = displayMode;
      }else if(displayMode == undefined || displayMode == null){
        engineStatus.displayMode = 1;
        yield call(set,"displayMode",1)
      }
      engineStatus.inited = true;
      yield put({type:"updateState",payload:engineStatus})
    },
    *updateDisplayMode({payload},{call,put}){
      console.log(payload);
       yield call(set,"displayMode",payload);
       yield put({type:"updateState",payload:{displayMode:payload}})
    }

  },
  reducers:{
    updateState(state,{payload}){
      return Object.assign({},state,payload);
    },
    updateSearchResult(state,{payload}){
      let{searchResult} = state;
      let newSearchResult = searchResult.concat(payload);
      return Object.assign({},state,{searchResult:newSearchResult});
    },
    updateImageInfo(state,{payload}){
      let{searchImageInfo} = state;
      let newSearchImageInfo = searchImageInfo.concat(payload);
      return Object.assign({},state,{searchImageInfo:newSearchImageInfo});
    }
  },
  subscriptions:{
    setupListener({dispatch}){
      browser.runtime.onMessage.addListener((message,sender,response) =>{
        if(message.job === "image_result_update"){
          dispatch({type:"updateSearchResult",payload:message.result});
        }else if(message.job === "engine_done"){
          let payload ={};
          payload[message.engine+"Done"] = true;
          dispatch({type:"updateState",payload});
        }else if(message.job === "image_info_update"){
          dispatch({type:"updateImageInfo",payload:message.result});
        }else if(message.job === "image_base64"){
          console.log("getIt");
          dispatch({type:"updateState",payload:message.base64})
        }
      })
    }
  }
}