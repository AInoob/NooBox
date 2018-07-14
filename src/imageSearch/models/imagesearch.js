export default {
  namespace:"imagesearch",
  state:{
    inited:false,
    searchImageResult:{},

    googleStatus:false,
    googleDone:false,
    googleResult:[],

    baiduStatus:false,
    baiduDone:false,
    baiduResult:[],

    yandexStatus:false,
    yandexDone:false,
    yandexResult:[],

    bingStatus:false,
    bingDone:false,
    bingResult:[],

    tineyeStatus:false,
    tineyeDone:false,
    tineyeResult:[],

    sausaoStatus:false,
    sausaoDone:false,
    sausaoResult:[],

    iqdbStatus:false,
    iqdbDone:false,
    iqdbResult:[],

    ascii2dStatus:false,
    ascii2dDone:false,
    ascii2dResult:[],
  },
  effects:{
    *init(){

    }
  },
  reducers:{
    updateState(state,{payload}){
      return Object.assign({},state,payload);
    }
  },
  subscriptions:{
    setupListener(dispatch){
      browser.runtime.onMessage.addListener((message,sender,response) =>{
        if(message.job === "image_result_update"){
          console.log("get message");
        }else if(message.job === "image_done"){

        }else if(message.job === "image_info_update"){
          
        }
      })
    }
  }
}