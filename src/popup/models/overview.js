import AutoRefresh from "../components/overview/AutoRefresh";
import Overview from "../routes/Overview";
import {getCurrentTab, sendMessage} from 'SRC/utils/browserUtils';

export default {
  namespace:"overview",
  state:{
    inited:false,
    tabId:  0,
    ifRefresh: false,
    refreshInterval: 3,
    refreshElapsed: 0,
  },
  effects:{
    *init({payload},{put,call,select}){
        let initState   = {};
        const tabData   = yield call(getCurrentTab);
        initState.tabId = tabData.id;
        //Auto Refresh Status
        const refreshStatus =  yield call(sendMessage,{ job: 'getCurrentTabAutoRefreshStatus', tabId: tabData.id });
        initState.ifRefresh = refreshStatus.active;
        initState.refreshElapsed  = refreshStatus.elapsedTime;
        initState.refreshInterval = refreshStatus.interval;
        //Other Tools
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
    *imageSearchBegin({payload},{call,put,select}){
      let message ={
        job: "beginImageSearch",
        base64: payload,
      }
      console.log("asdfsdfdsf");
      yield call(sendMessage,message);
    }
  },
  reducers:{
    updateState(state,{payload}){
      return Object.assign({},state,payload);
    }
  },
}
