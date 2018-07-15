export default {
  namespace:"imageSearch",
  state:{
    inited:false,
    base64:"",
    searchImageInfo:[],
    searchResult:[],
    displayMode:0,
    sortBy:{by:"",order:0},

    googleStatus:false,
    googleDone:false,
    googleMaxSearch:5,
    // googleResult:[],

    baiduStatus:false,
    baiduDone:false,
    baiduMaxSearch:1,
    // baiduResult:[],

    yandexStatus:false,
    yandexDone:false,
    yandexMaxSearch:1,
    // yandexResult:[],

    bingStatus:false,
    bingDone:false,
    bingMaxSearch:1,
    // bingResult:[],

    tineyeStatus:false,
    tineyeDone:false,
    tineyeMaxSearch:1,
    // tineyeResult:[],

    sausaoStatus:false,
    sausaoDone:false,
    sausaoMaxSearch:1,
    // sausaoResult:[],

    iqdbStatus:false,
    iqdbDone:false,
    iqdbMaxSearch:1,
    // iqdbResult:[],

    ascii2dStatus:false,
    ascii2dDone:false,
    ascii2dMaxSearch:1,
    // ascii2dResult:[],
  },
  effects:{
    *init(){

    }
  },
  reducers:{
    updateState(state,{payload}){
      return Object.assign({},state,payload);
    },
    updateSearchResult(state,{payload}){
      let{searchResult} = state;
      let newSearchResult = searchResult.concat(payload);
      return Object.assign({},state,{searchResult:newSearchResult});
    },
    updateImageInfo(state,{payload}){
      let{searchImageInfo} = state;
      let newSearchImageInfo = searchImageInfo.concat(payload);
      return Object.assign({},state,{searchImageInfo:newSearchImageInfo});
    }
  },
  subscriptions:{
    setupListener({dispatch}){
      browser.runtime.onMessage.addListener((message,sender,response) =>{
        if(message.job === "image_result_update"){
          dispatch({type:"updateSearchResult",payload:message.result});
        }else if(message.job === "engine_done"){
          let payload ={};
          payload[message.engine+"Done"] = true;
          dispatch({type:"updateState",payload});
        }else if(message.job === "image_info_update"){
          dispatch({type:"updateImageInfo",payload:message.result});
        }else if(message.job === "image_base64"){
          dispatch({type:"updateState",payload:{base64:message.base64}})
        }
      })
    }
  }
}