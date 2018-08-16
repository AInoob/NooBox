import {engineMap} from 'SRC/constant/settingMap.js';
import {get,set,getDB,setDB} from 'SRC/utils/db.js';
import { sendMessage } from 'SRC/utils/browserUtils';
import { imageSearchUploadSearchAgain } from '../actions';
export default {
  namespace:"imageSearch",
  state:{
    pageId:"",
    inited:false,
    base64:"",
    url:"",
    engineLink:{},
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
    saucenao:false,
    saucenaoDone:false,
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
      yield put({type:"updateState",payload:{pageId:payload}})
      let engineStatus = {};
      let cursor = yield call(getDB,"imageCursor");
      console.log(cursor);
      console.log(payload);
      let dataBaseFlag = false;
      if(cursor != null && payload <= cursor){
        let hasDataBase = yield call(getDB,Number.parseInt(payload));
        console.log(hasDataBase);
        if(hasDataBase){
          engineStatus.base64 = hasDataBase.base64||"";
          engineStatus.url = hasDataBase.url||"";
          engineStatus.searchImageInfo = hasDataBase.searchImageInfo||[];
          engineStatus.searchResult = hasDataBase.searchResult||[];
          engineStatus.engineLink = hasDataBase.engineLink||undefined;
        }
      }
      if(engineStatus.engineLink){
        for(let name in engineStatus.engineLink){
          engineStatus[name] = true;
          engineStatus[name +"Done"] = true;
        }
      }else{
        engineStatus.engineLink = {};
        for(let i = 0; i< engineMap.length; i++){
        let dbName = engineMap[i].dbName;
        let name   = engineMap[i].name;
        let dbNameMax = engineMap[i].dbNameMaxSearch;
        let openCheck  = yield call(get,dbName);
        // let maxSearch  = yield call(get,dbNameMax);
          if(openCheck){
            engineStatus[name] = true
          }
        }
      }
      let displayMode = yield call(get,"displayMode");
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
      // console.log(payload);
       yield call(set,"displayMode",payload);
       yield put({type:"updateState",payload:{displayMode:payload}})
    },
    *uploadSearch({payload},{call,put}){
      const img = payload;
      const workerCanvas = document.createElement('canvas');
      const workerCtx = workerCanvas.getContext('2d');
      workerCanvas.width = img.naturalWidth;
      workerCanvas.height = img.naturalHeight;
      workerCtx.drawImage(img, 0, 0);
      const imgDataURI = workerCanvas.toDataURL();
      let message ={
        job: "beginImageSearch",
        base64: imgDataURI,
      }
      yield call(sendMessage,message);
    },
    *searchAgain({payload},{call,put}){
      let{base64,url} = yield select(state => state.imageSearch);
      let message ={
        job: "beginImageSearch",
        base64: base64 == ""? url : base64,
      }
      yield call(sendMessage,message);
    },
    //Store DB after finish all
    *updateEngineDone({payload},{call,put,select}){
      console.log(payload);
      let{result,cursor} = payload;
      let{base64,url,searchImageInfo,searchResult,pageId,engineLink} = yield select(state => state.imageSearch);
      if(pageId == payload.cursor){
        let data ={
          base64,
          url,
          searchImageInfo,
          searchResult,
          engineLink
        };
        yield call(setDB,cursor,data);
        let doneState = {};
        doneState[result] = true;
        yield put({type:"updateState",payload:doneState})
      }
    },
    *updateInnerState({payload},{call,put,select}){
      const {pageId} = yield select(state => state.imageSearch);
      if(pageId == payload.cursor){
        console.log(payload);
        let {type} = payload;
        yield put({type:type,payload:{
          cursor: payload.cursor,
          result: payload.result,
        }})
      }
    }
  },
  reducers:{
    updateState(state,{payload}){
      return Object.assign({},state,payload);
    },
    updateSortBy(state,{payload}){
      return Object.assign({},state,{sortBy:payload})
    },
    updateSortByOrder(state,{payload}){
      return Object.assign({},state,{sortByOrder:payload})
    },
    updateImageBase64(state,{payload}){
        return Object.assign({},state,{base64:payload.result});
    },
    updateImageUrl(state, {payload}){
        return Object.assign({},state,{url:payload.result});
    },
    updateEngineLink(state,{payload}){
      return Object.assign({},state,{engineLink:payload.result});
    },
    updateSearchResult(state,{payload}){
      let {searchResult} = state;
      let newSearchResult = searchResult.concat(payload.result);
      return Object.assign({},state,{searchResult:newSearchResult});
    },
    updateImageInfo(state,{payload}){
      let{searchImageInfo} = state;
      let newSearchImageInfo = searchImageInfo.concat(payload.result);
      return Object.assign({},state,{searchImageInfo:newSearchImageInfo});
    }
  },
  subscriptions:{
    setupListener({dispatch,history}){
      browser.runtime.onMessage.addListener((message,sender,response) =>{
        let payload;
        if(message.job === "image_result_update"){
          payload ={
            type : "updateSearchResult",
            cursor : message.cursor,
            result : message.result,
          };
        }else if(message.job === "engine_done"){
          payload ={
            type : "updateEngineDone",
            result : message.result,
            cursor : message.cursor,
          };
        }else if(message.job === "image_info_update"){
          payload = {
            type : "updateImageInfo",
            cursor: message.cursor,
            result: message.result
          }
        }else if(message.job === "image_base64"){
          payload ={
            type :"updateImageBase64",
            cursor:message.cursor,
            result:message.result,
          }
        }else if(message.job === "image_url"){
          payload = {
            type :"updateImageUrl",
            cursor: message.cursor,
            result: message.result
          }
        }else if(message.job === "engine_link"){
          payload = {
            type : "updateEngineLink",
            cursor: message.cursor,
            result: message.result
          }
        }
        if(payload){
          dispatch({type:"updateInnerState",payload:payload})
        }
      })
    }
  }
} 