import ajax from 'SRC/utils/ajax.js';
import io from 'socket.io-client';
export default {
  namespace: 'about',
  state:{
    socket: null,
    inited:false,
    imageSearch: 0,
    extractImage: 0,
    screenshotSearch: 0,
    videoControl: 0,
    autoRefresh: 0,
  },
  effects:{
    *init({payload},{call,put}){
      window.socket = io('https://ainoob.com:443/');
      const data = yield call(ajax,'https://ainoob.com/api/public/data/?x=' + Math.random(),{method: 'GET'});
      if(data.data){
        let {imageSearch, extractImage, screenshotSearch, videoControl, autoRefresh } = data.data;
        yield put({type:"updateState",payload:{
          inited:true,
          imageSearch:imageSearch,
          extractImage:extractImage,
          screenshotSearch:screenshotSearch,
          videoControl:videoControl,
          autoRefresh:autoRefresh,
        }});
      }
    }
  },
  reducers:{
    updateState(state,{payload}){
      return Object.assign({},state,payload);
    },
    plusOne(state,{payload}){
      let obj = {};
      let data = state[payload];
      obj[payload] = data +1;
      return Object.assign({},state,obj);
    }
  },
}