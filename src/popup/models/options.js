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