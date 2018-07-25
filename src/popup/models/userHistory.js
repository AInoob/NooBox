
import {getDB} from 'SRC/utils/db.js';
export default {
  namespace:"userHistory",
  state:{
    inited:false,
  },
  effects:{
    *test({payload},{put,select}){
      console.log(payload);
    },
    *init({payload},{put,call}){
      let imageCursor = yield getDB("imageCursor");
      let dbData = [];
      if(imageCursor != null){
        for(let i = 0; i<= imageCursor; i++){
          let data = yield getDB(i);
          // console.log(data);
          if(data){
            dbData[dbData.length] = {
              dbKey:i,
              data:data,
            }
          }
        }
      }
      // if imageCursor doesn't exist, then finish loading and return empty data
      yield put({type:"updateState",payload:{
        dbData:dbData,
        inited:true,
      }})
    }
  },
  reducers:{
    updateState(state,{payload}){
      return Object.assign({},state,payload);
    }
  },
}