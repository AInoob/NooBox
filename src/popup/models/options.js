import {engineMap,toolSettingMap,expSettingMap} from 'SRC/constant/settingMap.js';
import {get,set} from 'SRC/utils/db.js';
export default {
  namespace:"options",
  state:{
    inited:false,
  },
  effects:{
    *init({payload},{call,put}){
      let currentTool   = [];
      let currentExp    = [];
      let currentEngine = {};
      for(let i = 0; i< toolSettingMap.length; i++){
        let checked = yield call(get,toolSettingMap[i].name);
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
      yield put({type:"updateState",payload:{currentTool,currentExp,currentEngine,inited:true}})
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
      let newSetting = payload.filter(name => name !== "image");

      let {currentTool} = yield select(state => state.options);
      if(currentTool.length > newSetting.length){
        for(let name of currentTool){
          if(!newSetting.includes(name)){
            yield call(set,name,false);
          }
        }
        currentTool = newSetting;
      }else{
        for(let name of newSetting){
          if(!currentTool.includes(name)){
            yield call(set,name,true);
          }
        }
        currentTool = newSetting;
      }
      yield put({type:"updateState",payload:{currentTool:newSetting}})
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