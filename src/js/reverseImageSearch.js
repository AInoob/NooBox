import {get,set} from 'SRC/utils/db.js';
import ajax from 'SRC/utils/ajax.js';

const HTML = new DOMParser();
// Data Format

// Search Image ={
//     keyWord:
//     keyWordLink:
//     engine:
//     imageInfo:{
//      height:""
//      weight:""
//     }
// }

// Result Image ={
//  title:"",
//  thumbUrl:"",
//  imageUrl:"",
//  sourceUrl:"",
//  imageInfor:{
//    height:""
//    weight:""
//  }
//  searchEngine:"",
//  description:"",
// }
export const reverseImageSearch = {
  updateResultImage:(result)=>{
    browser.runtime.sendMessage({
      job:'image_result_update',
      result:result,
    },()=>{
      console.log("Send Search Result");
    })
  },
  engineDone:(engine) =>{
    browser.runtime.sendMessage({
      job:'engine_done',
      engine:engine,
    },()=>{
      console.log("Send Done Message");
    })
  },
  updateSearchImage:(result) =>{
    browser.runtime.sendMessage({
      job:'image_info_update',
      result:result,
    })
  },
  updateImage64:(base64) =>{
    browser.runtime.sendMessage({
      job:'image_base64',
      base64:base64,
    },()=>{
      console.log("Send base 64 Message");
    })
  },
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
   let searchImage = {
          keyword:"",
          keywordLink:"",
          engine:"google",
          imageInfo:{
          }
    }
    // console.log(123+"reachf");
    // console.log(link);
    const {data} = await ajax(link,{method: 'GET'});
    const page = HTML.parseFromString(data,"text/html");
    const followingPageSrouce = page.getElementsByTagName('tbody')[0].getElementsByTagName('a');
    let followingPageUrl = [];
    for(let i = 0; i< followingPageSrouce.length; i++){
      //fl stand for following page in google
      if(followingPageSrouce[i] && followingPageSrouce[i].getAttribute("class") === "fl"){
        followingPageUrl[followingPageUrl.length] = "https://www.google.com"+followingPageSrouce[i].getAttribute("href");
      }
    }
    //get Search Imge Info
    const topstuff = page.getElementById("topstuff").getElementsByClassName("card-section")[0];
    //console.log(topstuff);
    //first child contain size info
    //second child contain keyword info
    const childNode  = topstuff.childNodes;
    const sizeInfo = childNode[0].childNodes[1].childNodes[0].innerHTML.replace(/<br>|&nbsp;|Image size|:|：|图片尺寸|圖片尺寸/g,"");
    if(sizeInfo){
      //"x" is special Character
      let size = sizeInfo.split("×");
      searchImage.imageInfo.width = Number.parseInt(size[0],10);
      searchImage.imageInfo.height = Number.parseInt(size[1],10);
    }
    const keyword  = childNode[1].getElementsByTagName("a")[0];
    if(keyword){
      // console.log(keyword.innerHTML);
      searchImage.keyword = keyword.innerHTML;
      searchImage.keywordLink = "https://www.google.com" +keyword.getAttribute("href");
    }
    // Send Message of Search image info to front page
    reverseImageSearch.updateSearchImage(searchImage);
    // process first page source
    reverseImageSearch.processGoogleData(page);
    //  google
    //  maximum
    if(followingPageUrl.length > 0){
      let fetchFunciton = function(url){
        return new Promise((resolve)=>{
          ajax(url,{method:"GET"}).then(({data}) =>{
            const page = HTML.parseFromString(data,"text/html");
            reverseImageSearch.processGoogleData(page);
            resolve("");
          })
        })
      } 
      let taskSeq = [];
      for(let i = 0; i < followingPageUrl.length; i++){
        taskSeq[taskSeq.length] = fetchFunciton(followingPageUrl[i]);
      }
      await Promise.all(taskSeq);
      reverseImageSearch.engineDone("google");
      //pass done message
    }else{
      //pass done message Directly
      reverseImageSearch.engineDone("google");
    }
    
    // console.log(searchImage);
  },
  /*process Data*/
  processGoogleData: function (page){
      let websiteList = page.getElementsByClassName('srg');
      let list    = websiteList[websiteList.length -1].getElementsByClassName("g");
      let results = [];
      for(let i = 0; i< list.length; i++){
        let singleResult = {
          title:"",
          thumbUrl:"",
          imageUrl:"",
          sourceUrl:"",
          imageInfo:{},
          searchEngine:"google",
          description:"",
        }
        const singleItem = list[i];
        //process title,imageUrl,sourceUrl and thumbUrl
        //first <a> contain title and imageUrl
        //second <a> contain sourceUrl and thumbUrl
        const tagA = singleItem.getElementsByTagName("a");
        singleResult.sourceUrl = tagA[0].getAttribute("href");
        singleResult.title = tagA[0].innerHTML;
        let link = tagA[1].getAttribute("href");
        singleResult.imageUrl = link.substring(link.indexOf("=")+1,link.indexOf("&imgre"));
        singleResult.thumbUrl = singleResult.imageUrl;
        //process description
        //class st span contain N child, first child is size info
        //behind children are description,conbine them
        const tagSpan = singleItem.getElementsByClassName("st")[0].childNodes;
        let description = "";
        for(let i = 0; i< tagSpan.length; i++){
          if(i == 0){
            let size = tagSpan[i].innerHTML.replace(/ |-/g,"").split("×");
            singleResult.imageInfo.width = Number.parseInt(size[0],10);
            singleResult.imageInfo.height =  Number.parseInt(size[1],10);
          }else{
            description += tagSpan[i].innerHTML || tagSpan[i].textContent;
          }
        }
        singleResult.description = description;
        results[results.length] = singleResult;
      }
      reverseImageSearch.updateResultImage(results);
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