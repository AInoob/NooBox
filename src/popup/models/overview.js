import AutoRefresh from "../components/overview/AutoRefresh";
import Overview from "../routes/Overview";
import { getCurrentTab, sendMessage } from 'SRC/utils/browserUtils';
import { get } from 'SRC/utils/db.js';
export default {
  namespace:"overview",
  state:{
    //Init Control
    inited:false,
    tabId:  0,
    showImageSearch:true,
    showAutoRefresh:true,
    showHtml5Video:true,
    //Auto Refresh
    ifRefresh: false,
    refreshInterval: 3,
    refreshElapsed: 0,
  },
  effects:{
    *init({payload},{put,call,select}){
        // Get All Tool Situation
        let initState   = {};
        let {showImageSearch,showAutoRefresh,showHtml5Video} = yield select(state => state.overview);
        initState.showImageSearch = (yield call(get,"imageSearch"));
        initState.showAutoRefresh = (yield call(get,"autoRefresh"));
        initState.showHtml5Video  = (yield call(get,"videoControl"));
      
        //Init Auto Refresh
        const tabData   = yield call(getCurrentTab);
        initState.tabId = tabData.id;
        //Auto Refresh Status
        const refreshStatus =  yield call(sendMessage,{ job: 'getCurrentTabAutoRefreshStatus', tabId: tabData.id });
        initState.ifRefresh = refreshStatus.active;
        initState.refreshElapsed  = refreshStatus.elapsedTime;
        initState.refreshInterval = refreshStatus.interval;
        //Init Image Search
        //Init H5 Video Control
        //Set Inited
        initState.inited = true;
        yield put({type:"updateState",payload:initState});
        // console.log(ifAutoRefresh);
    },

    *autoRefreshUpdate({payload},{call,put,select}){
      const { tabId, active, interval, startAt } = payload;
      yield call(sendMessage, {
        job: 'updateAutoRefresh',
        active,
        tabId,
        interval,
        startAt,
      });
    },
    *autoRefreshShutDown({},{call,select}){
      let {tabId} = yield select(state => state.overview);
      yield call(sendMessage,{
        job:'updateAutoRefresh',
        active:false,
        tabId,
        interval:3000,
        startAt:0,
      });
      yield put({type:"updateState",payload:{
        ifRefresh:false,
        refreshElapsed:0,
        refreshInterval:3000,
      }})
    },
    *imageSearchBegin({payload},{call,put,select}){
      let message ={
        job: "beginImageSearch",
        base64: payload,
      }
      yield call(sendMessage,message);
    },
  },
  reducers:{
    updateState(state,{payload}){
      return Object.assign({},state,payload);
    },
    hideImageSearch(state){
      return Object.assign({},state,{showImageSearch:false})
    },
    showImageSearch(state){
      return Object.assign({},state,{showImageSearch:true})
    },
    hideAutoRefresh(state){
      return Object.assign({},state,{showAutoRefresh:false})
    },
    showAutoRefresh(state){
      return Object.assign({},state,{showAutoRefresh:true})
    },
    hideHtml5Video(state){
      return Object.assign({},state,{showHtml5Video:false})
    },
    showHtml5Video(state){
      return Object.assign({},state,{showHtml5Video:true})
    }
  },
}
