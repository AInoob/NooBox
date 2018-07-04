import AutoRefresh from "../../components/popupComponent/overview/AutoRefresh";
import Overview from "../../routes/popup/Overview";
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
        const refreshStatus =  yield call(sendMessage,{ job: 'getCurrentTabAutoRefreshStatus' });
        initState.ifRefresh = refreshStatus.active;
        initState.refreshElapsed  = refreshStatus.elapsedTime;
        initState.refreshInterval = refreshStatus.interval;
        //Other Tools
        initState.inited = true;
        yield put({type:"updateState",payload:initState});
        // console.log(ifAutoRefresh);
    },
    *autoRefreshSwitch({payload},{call,put,select}){
      yield call(sendMessage, payload);
    },
    *autoRefreshUpdate({payload},{call,put,select}){
      yield call(sendMessage, payload);
    },
    *imageSearchBegin({payload},{call,put,select}){
      console.log("yes");
      let message ={
        job: "imageSearchBegin",
        data: payload,
      }
      console.log(message);
      yield call(sendMessage,message);
    }
  },
  reducers:{
    updateState(state,{payload}){
      return Object.assign({},state,payload);
    }
  },
}