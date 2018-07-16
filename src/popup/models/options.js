import {engineMap,toolSettingMap,expSettingMap} from 'SRC/constant/settingMap.js';
//get set meaning chrome sync
import {get,set} from 'SRC/utils/db.js';
export default {
  namespace:"options",
  state:{
    inited:false,
    showExps:true,
    showTools:true,
    showEngines:true,
  },
  effects:{
    *init({payload},{call,put,select}){
      let currentTool   = [];
      let currentExp    = [];
      let currentEngine = {};
      let {showEngines,showExps,showTools}   = yield select(state => state.options);
      for(let i = 0; i< toolSettingMap.length; i++){
        let checked = yield call(get,toolSettingMap[i].name);

        if(toolSettingMap[i].name == "imageSearch" && !checked){
          showEngines = false;
        }

        if(checked){
          currentTool[currentTool.length] = toolSettingMap[i].name
        }
      }
      for(let i = 0; i<expSettingMap.length; i++){
        let checked = yield call(get,expSettingMap[i].name);
        if(checked){
          currentExp[currentExp.length] = expSettingMap[i].name;
        }
      }
      for(let i = 0; i<engineMap.length; i++){
        let checked = yield call(get,engineMap[i].dbName);
        if(checked){
          currentEngine[engineMap[i].dbName] = true;
        }else{
          currentEngine[engineMap[i].dbName] = false;
        }
      }
      yield put({type:"updateState",payload:{currentTool,currentExp,currentEngine,inited:true,showEngines:showEngines}})
    },

    *onCheckEngine({payload},{call,put,select}){
      let {currentEngine} = yield select(state => state.options);
      if(currentEngine[payload]){
         yield call(set,payload,false);
         currentEngine[payload] = false;
      }else{
        yield call(set,payload,true);
        currentEngine[payload] = true;
      }
      yield put({type:"updateState",payload:{currentEngine}})
    },

    *onCheckTool({payload},{call,put,select}){
      let newSetting  = payload.filter(name => name !== "image");
      let {currentTool,showEngines} = yield select(state => state.options);
      if(currentTool.length > newSetting.length){
        //Close Tool
        for(let name of currentTool){
          if(!newSetting.includes(name)){
            if(name == "imageSearch"){
              showEngines = false;
              yield put({type:"overview/hideImageSearch"})
            }
            if(name == "autoRefresh"){
              yield put({type:"overview/autoRefreshShutDown"});
              yield put({type:"overview/hideAutoRefresh"});
            }
            if(name == "videoControl"){
              yield put({type:"overview/hideHtml5Video"});
            }

            yield call(set,name,false);
          }
        }
        currentTool = newSetting;
      }else{
        //Open Tool
        for(let name of newSetting){
          if(!currentTool.includes(name)){
            if(name == "imageSearch"){
              showEngines = true;
              yield put({type:"overview/showImageSearch"})
            }
            if(name == "autoRefresh"){
              yield put({type:"overview/showAutoRefresh"});
            }
            if(name == "videoControl"){
              yield put({type:"overview/showHtml5Video"});
            }
            yield call(set,name,true);
          }
        }
        currentTool = newSetting;
      }
      yield put({type:"updateState",payload:{currentTool:newSetting,showEngines}})
    },
    *onCheckExp({payload},{call,put,select}){
      // if the setting has parent
      // let newSetting = payload.fliter(name => name !== "image");
      let newSetting = payload;
      let {currentExp} = yield select(state => state.options);
      console.log(currentExp);
      if(currentExp.length > newSetting.length){
        for(let name of currentExp){
          if(!newSetting.includes(name)){
            yield call(set,name,false);
          }
        }
        currentExp = newSetting;
      }else{
        for(let name of newSetting){
          if(!currentExp.includes(name)){
            yield call(set,name,true);
          }
        }
        currentExp = newSetting;
      }
      console.log(currentExp);
      yield put({type:"updateState",payload:{currentExp:currentExp}})
    },
  },
  reducers:{
    updateState(state,{payload}){
      return Object.assign({},state,payload);
    }
  },
}