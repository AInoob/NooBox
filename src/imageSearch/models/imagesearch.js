import {engineMap} from 'SRC/constant/settingMap.js';
import {get,set,getDB,setDB} from 'SRC/utils/db.js';
export default {
  namespace:"imageSearch",
  state:{
    pageId:"",
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
      yield put({type:"updateState",payload:{pageId:payload}})
      let engineStatus = {};
      let cursor = yield call(getDB,"imageCursor");
      let dataBaseFlag = false;
      
      if(cursor != null && payload <= cursor){
        let hasDataBase = yield call(getDB,Number.parseInt(payload));
        if(hasDataBase){
          engineStatus.base64 = hasDataBase.base64;
          engineStatus.searchImageInfo = hasDataBase.searchImageInfo;
          engineStatus.searchResult = hasDataBase.searchResult;
          dataBaseFlag = true;
        }
      }
      for(let i = 0; i< engineMap.length; i++){
        let dbName = engineMap[i].dbName;
        let name   = engineMap[i].name;
        let dbNameMax = engineMap[i].dbNameMaxSearch;
        let openCheck  = yield call(get,dbName);
        let maxSearch  = yield call(get,dbNameMax);
        if(openCheck){
          engineStatus[name] = true;
          if(dataBaseFlag){
            engineStatus[name +"Done"] = true;
          }
        }
        if(maxSearch){
          engineStatus[name+"Max"] = maxSearch;
        }else if(maxSearch == undefined || maxSearch == null){
          yield call(set,dbName+"_max")
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
      console.log(payload);
       yield call(set,"displayMode",payload);
       yield put({type:"updateState",payload:{displayMode:payload}})
    },
    *updateEngineDone({payload},{call,put,select}){
      console.log(payload);
      let{base64,searchImageInfo,searchResult,pageId} = yield select(state => state.imageSearch);
      if(pageId == payload.cursor){
        let data ={
          base64,
          searchImageInfo,
          searchResult,
        }
        yield call(setDB,"imageCursor",payload.cursor);
        yield call(setDB,payload.cursor,data);
        let doneState = {};
        doneState[payload.engine+"Done"] = true;
        yield put({type:"updateState",payload:doneState})
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

    updateImageData(state,{payload}){
      console.log(state);
      let {pageId} = state;
      
      console.log(payload);
      console.log(pageId == payload.cursor);
      console.log(pageId);
      console.log(payload.cursor);
      if(pageId == payload.cursor){
        return Object.assign({},state,{base64:payload.result});
      }else{
        return state;
      } 
    },
    updateSearchResult(state,{payload}){
      let { pageId,searchResult } = state;
      if(pageId == payload.cursor){
        let newSearchResult = searchResult.concat(payload.result);
        return Object.assign({},state,{searchResult:newSearchResult});
      }else{
        return state;
      }
   
    },
    updateImageInfo(state,{payload}){
      let{pageId,searchImageInfo} = state;
      if(pageId == payload.cursor){
        let newSearchImageInfo = searchImageInfo.concat(payload.result);
        return Object.assign({},state,{searchImageInfo:newSearchImageInfo});
      }else{
        return state;
      }
    }
  },
  subscriptions:{
    setupListener({dispatch,history}){
      browser.runtime.onMessage.addListener((message,sender,response) =>{
        let type;
        let payload;
      
        if(message.job === "image_result_update"){
          type = "updateSearchResult";
          payload ={
            cursor : message.cursor,
            result : message.result
          };
        }else if(message.job === "engine_done"){
          type = "updateEngineDone";
          payload ={
            engine : message.engine,
            cursor : message.cursor,
          };
        }else if(message.job === "image_info_update"){
          type = "updateImageInfo";
          payload = {
            cursor: message.cursor,
            result: message.result
          }
        }else if(message.job === "image_base64"){
          console.log(message);
          type ="updateImageData"
          payload ={
            cursor:message.cursor,
            result:message.result,
          }
        }
        if(type){
          dispatch({type:type,payload:payload})
        }
      })
    }
  }
}