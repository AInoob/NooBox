export default {
  waitForSandBox:(pareseObj) =>{
    return new Promise(function(resolve,reject){
      //移除 listener
      let remove = function(){
        window.removeEventListener("message",trigger);
      }
      //触发Resolve
      let trigger = function(event){
        // console.log(this)
        // console.log(remove);
        remove();
        resolve(event.data);
      }
      //添加Listener 
      window.addEventListener("message",trigger);
      //把数据发送Sandbox
      document.getElementById('theFrame').contentWindow.postMessage(parseObj, '*');
    })
  },
  /*Fetch Available Page Link On Goolge*/
  fetchGoogleLink:() => {
    return new Promise(function(resolve,reject){

    })
  },
  /*Fetch Data by Maximum Setting*/
  fetchGoogleData:() =>{
    return new Promise(function(resolve,reject){

    })
  },
  /*Fetch Available Page Link On Baidu Return Obj*/
  fetchBaiduLink:() =>{
    return new Promise(function(resolve,reject){

    })
  },
  /*Get Obj From Sand Box And Process Obj by this function*/
  fetchBaiduData:() =>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchTineyeLink:()=>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchTineyeData:()=>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchBingLink:()=>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchBingData:()=>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchYandexLink:() =>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchYandexData:() =>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchSauceNaoLink:() =>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchSauceNaoData:() =>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchIQDBLink:() =>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchIQDBData:() =>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchAscii2dLink:() =>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchAscii2dData:() =>{
    return new Promise(function(resolve,reject){

    })
  }
}