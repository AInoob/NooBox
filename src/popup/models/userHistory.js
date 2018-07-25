
import {getDB,deleteDB} from 'SRC/utils/db.js';
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
    },
    *deleteSingle({payload},{select,put,call}){
        console.log(payload);
        yield call(deleteDB,payload);
        console.log("successfully delete");
        let {dbData} = yield select(state => state.userHistory);
        let newdbData = dbData.filter(e => e.dbKey !== payload);
        console.log(newdbData);
        yield put({type:"updateState",payload:{
          dbData:newdbData,
        }});
    }
  },
  reducers:{
    updateState(state,{payload}){
      return Object.assign({},state,payload);
    }
  },
}