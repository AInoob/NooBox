import AutoRefresh from "../components/overview/AutoRefresh";
import Overview from "../routes/Overview";
import { getCurrentTab, sendMessage } from 'SRC/utils/browserUtils';
import { get,set } from 'SRC/utils/db.js';
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
    //H5 Video Control
    websiteEnable:false,
    hostName:"",
  },
  effects:{
    *init({payload},{put,call,select}){
        // Get All Tool Situation
        let initState   = {};
        // let {showImageSearch,showAutoRefresh,showHtml5Video} = yield select(state => state.overview);
        initState.showImageSearch = (yield call(get,"imageSearch"));
        initState.showAutoRefresh = (yield call(get,"autoRefresh"));
        initState.showHtml5Video  = (yield call(get,"videoControl"));
        //Init Auto Refresh
        const tabData   = yield call(getCurrentTab);
        // console.log(tabData);
        initState.tabId = tabData.id;
        //Auto Refresh Status
        const refreshStatus =  yield call(sendMessage,{ job: 'getCurrentTabAutoRefreshStatus', tabId: tabData.id });
        initState.ifRefresh = refreshStatus.active;
        initState.refreshElapsed  = refreshStatus.elapsedTime;
        initState.refreshInterval = refreshStatus.interval;
        //Init Image Search
        //Init H5 Video Control
        const url = tabData.url;
        const tagA = document.createElement('a');
        tagA.href = url;
        initState.hostName = tagA.hostname;
        let websiteEnable = yield call(get,tagA.hostname);
        if(websiteEnable == null){
          websiteEnable = false;
          yield call(set,tagA.hostname,websiteEnable);
        }
        let message ={
          job: 'videoControl_website_switch',
          host: tagA.hostname,
          isEnable: websiteEnable,
        };
        yield call(sendMessage,message);
        initState.websiteEnable = websiteEnable;
        //Get Host Name
        //const h5videoControl  = yield call(sendMessage,{ job :})
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
    *html5VideoWebsiteSwitch({payload},{call,put,select}){
      const {websiteEnable,hostName} =  yield select(state => state.overview);
      let newStatus ={}
      if(websiteEnable){
        newStatus.websiteEnable = !websiteEnable;
      }else{
        newStatus.websiteEnable = !websiteEnable;
      }
      let message ={
        job: 'videoControl_website_switch',
        host: hostName,
        isEnable: websiteEnable,
      };
      yield call(sendMessage,message);
      //console.log(!websiteEnable)
      yield call(set,hostName,!websiteEnable);
      yield put({type:"updateState",payload:newStatus});
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
