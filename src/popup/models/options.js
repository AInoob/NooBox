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
    *init({payload},{call,put}){
      let currentTool   = [];
      let currentExp    = [];
      let currentEngine = {};
      let showEngines   = true;
      let showExps      = true;
      let showTools     = true;
      for(let i = 0; i< toolSettingMap.length; i++){
        let checked = yield call(get,toolSettingMap[i].name);
        
        if(toolSettingMap[i].name == "imageSearch" && !checked[toolSettingMap[i].name]){
          showEngines = false;
        }

        if(checked && checked[toolSettingMap[i].name]){
          currentTool[currentTool.length] = toolSettingMap[i].name
        }
      }
      for(let i = 0; i<expSettingMap.length; i++){
        let checked = yield call(get,expSettingMap[i].name);
        if(checked && checked[expSettingMap[i].name]){
          currentExp[currentExp.length] = expSettingMap[i].name;
        }
      }
      for(let i = 0; i<engineMap.length; i++){
        let checked = yield call(get,engineMap[i].dbName);
        if(checked && checked[engineMap[i].dbName]){
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
      let showEngines = true;
      let {currentTool} = yield select(state => state.options);
      if(currentTool.length > newSetting.length){
        for(let name of currentTool){
          if(!newSetting.includes(name)){
            if(name == "imageSearch"){
             showEngines = false;
            }
            yield call(set,name,false);
          }
        }
        currentTool = newSetting;
      }else{
        for(let name of newSetting){
          if(!currentTool.includes(name)){
            if(name == "imageSearch"){
              showEngines = true;
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