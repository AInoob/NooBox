import {get,set} from 'SRC/utils/db.js';
import ajax from 'SRC/utils/ajax.js';

const HTML = new DOMParser();
// Data Format

// searchImage ={
//     keyWord:
//     keyWordLink:
//     engine:
//     imageInfo:{
//      height:""
//      weight:""
//     }
// }

// resultImage ={
//  title:"",
//  Image Display Url
//  thumbUrl:"",
//  Original Image Url
//  imageUrl:"",
//  Image Where url
//  sourceUrl:"",
//  Image Info
//  imageInfo:{
//    height:""
//    weight:""
//  }
//  searchEngine:"",
//  description:"",
// }
export const reverseImageSearch = {
  updateResultImage:(result,cursor)=>{
    browser.runtime.sendMessage({
      job:'image_result_update',
      result:result,
      cursor:cursor
    },()=>{
      console.log("Send Search Result");
    })
  },
  engineDone:(engine,cursor) =>{
    browser.runtime.sendMessage({
      job:'engine_done',
      engine:engine,
      cursor:cursor,
    },()=>{
      console.log("Send Done Message");
    })
  },
  updateSearchImage:(result,cursor) =>{
    browser.runtime.sendMessage({
      job:'image_info_update',
      result:result,
      cursor:cursor,
    })
  },
  updateImage64:(base64,cursor) =>{
    browser.runtime.sendMessage({
      job:'image_base64',
      result:base64,
      cursor:cursor,
    },()=>{
      console.log("Send base 64 Message");
    })
  },
  waitForSandBox:(parseObj) =>{
    return new Promise(function(resolve,reject){
      //移除 listener
      let remove = function(){
        window.removeEventListener("message",trigger);
      }
      //触发Resolve
      let trigger = function(event){
        console.log("callback123");
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
  fetchGoogleLink: async (link,cursor) => {
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
      // console.log(childNode[1]);
      // console.log(keyword.innerHTML);
      searchImage.keyword = keyword.innerHTML;
      searchImage.keywordLink = "https://www.google.com" +keyword.getAttribute("href");
    }
    // Send message of search image info to front page
    reverseImageSearch.updateSearchImage(searchImage,cursor);
    // Process first page source
    let firstPage = reverseImageSearch.processGoogleData(page);
    //  google
    //  maximum
    if(followingPageUrl.length > 0){
      let tempFunciton = function(url){
        return new Promise((resolve)=>{
          ajax(url,{method:"GET"}).then(({data}) =>{
            const page = HTML.parseFromString(data,"text/html");
            let singleResult = reverseImageSearch.processGoogleData(page);
            resolve(singleResult);
          })
        })
      } 
      let taskSeq = [];
      //Raynor First Version, cut the search Number to 25
      if(followingPageUrl.length > 2){
         followingPageUrl.length = 2;
      }
      for(let i = 0; i < followingPageUrl.length; i++){
        taskSeq[taskSeq.length] = tempFunciton(followingPageUrl[i]);
      }
      let results = await Promise.all(taskSeq);
      //merge results to first page
      for(let i = 0; i< results.length; i++){
        firstPage = firstPage.concat(results[i]);
      }
    }
      reverseImageSearch.updateResultImage(firstPage,cursor);
      //pass done message Directly
      reverseImageSearch.engineDone("google",cursor);
   
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
            let size = tagSpan[i].innerHTML.split("-")[0];
            size = size.replace(/ /g,"").split("×");
            if(size){
              singleResult.imageInfo.width = Number.parseInt(size[0],10);
              singleResult.imageInfo.height =  Number.parseInt(size[1],10);
            }
          }else{
            description += tagSpan[i].innerHTML || tagSpan[i].textContent;
          }
        }
        singleResult.description = description;
        results[results.length] = singleResult;
      }
      return results;
  },
  /*Fetch Available Page Link On Baidu Return Obj*/
  fetchBaiduLink: async (link,cursor) =>{
    let searchImage = {
      keyword:"",
      keywordLink:"",
      engine:"baidu",
      imageInfo:{
      }
    }
    const {data} = await ajax(link,{method: 'GET'});
    let baiduObj = {};
    //Parse Db
    const page   =  HTML.parseFromString(data,"text/html");
    let node = page.getElementsByTagName('script')[2].innerHTML;
    node = node.substring(17,node.indexOf("bd.queryImageUrl")-1);
    baiduObj.dbString = "bd = " + node;
    let {simiList,sameList,guessWord} = await reverseImageSearch.waitForSandBox(baiduObj);
    //Get result from sandbox
    console.log("success");
    searchImage.keyword = guessWord;
    // Send message of search image info to front page
    reverseImageSearch.updateSearchImage(searchImage,cursor);
    //Raynor Version
    //Pick 5 from sameList
    let count  = 25;
    let result =[];
    if(sameList.length > 5){
      sameList.length = 5;
    }
    count -= sameList.length;
    for(let i = 0; i< sameList.length; i++){
      let singleResult = {
        title: sameList[i].fromPageTitle || "",
        thumbUrl:  sameList[i].thumbURL || "",
        imageUrl:  sameList[i].objURL ||"",
        sourceUrl: sameList[i].fromURL  ||"",
        imageInfo:{
          height:sameList[i].height,
          width:sameList[i].width,
        },
        searchEngine:"baidu",
        description:sameList[i].textHost || "",
      }
      result[result.length] = singleResult;
    }

    //Pick 20 from simiList
    if(simiList > count){
      simiList.length = count;
    }
    for(let i = 0; i< simiList.length; i++){
      let singleResult = {
        title: simiList[i].fromPageTitle || "",
        thumbUrl:  simiList[i].MiddleThumbnailImageUrl || "",
        imageUrl:  simiList[i].objURL ||"",
        sourceUrl: simiList[i].fromURL  ||"",
        imageInfo:{
          height:simiList[i].height,
          width:simiList[i].width,
        },
        searchEngine:"baidu",
        description:simiList[i].FromPageSummary || "",
      }
      result[result.length] = singleResult;
    }
    reverseImageSearch.updateResultImage(result,cursor);
    //pass done message Directly
    reverseImageSearch.engineDone("baidu",cursor);
  },
  /*Get Obj From Sand Box And Process Obj by this function*/
  fetchBaiduData: async () =>{
    /* Dummy Code To Maintain File Shape*/
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