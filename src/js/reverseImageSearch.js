import {get,set} from 'SRC/utils/db.js';
import ajax from 'SRC/utils/ajax.js';
const HTML = new DOMParser();
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
  fetchGoogleLink: async (link) => {
    // console.log(123+"reachf");
    console.log(link);
    const {data} = await ajax(link,{method: 'GET'});
    const page = HTML.parseFromString(data, "application/xml");
    // let allPageUrlData = page.find('tbody').find('a');
    // let followingPageLink = [];
    // //console.log(page);
    // for(let i = 0; i < 9; i++){
    //   if(allPageUrlData[i] && allPageUrlData[i].className ==="fl" && allPageUrlData[i].href){
    //     followingPageLink[followingPageLink.length] = "https://www.google.com/search?tbs=" + allPageUrlData[i].href.split("search?tbs=")[1];
    //   }
    // }

    const followingPageSrouce = page.getElementsByTagName('tbody')[0].getElementsByTagName('a');
    let followingPageUrl = [];
    for(let i = 0; i< 9; i++){
      
    }
    console.log(page);
  },
  /*Fetch Data by Maximum Setting*/
  fetchGoogleData: async () =>{
    return new Promise(function(resolve,reject){

    })
  },
  /*Fetch Available Page Link On Baidu Return Obj*/
  fetchBaiduLink: async (link) =>{
    return new Promise(function(resolve,reject){

    })
  },
  /*Get Obj From Sand Box And Process Obj by this function*/
  fetchBaiduData: async () =>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchTineyeLink: async (link)=>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchTineyeData: async ()=>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchBingLink:async (link)=>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchBingData: async ()=>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchYandexLink: async (link) =>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchYandexData: async () =>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchSauceNaoLink: async(link) =>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchSauceNaoData: async () =>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchIQDBLink: async (link) =>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchIQDBData: async () =>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchAscii2dLink: async (link) =>{
    return new Promise(function(resolve,reject){

    })
  },
  fetchAscii2dData: async () =>{
    return new Promise(function(resolve,reject){

    })
  }
}