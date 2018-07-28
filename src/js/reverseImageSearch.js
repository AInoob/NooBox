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
    // console.log(link)
    const {data} = await ajax(link,{method: 'GET'});
    // console.log(data);
    let baiduObj = {};
    //Parse Db
    const page   =  HTML.parseFromString(data,"text/html");
    let node = page.getElementsByTagName('script')[1].innerHTML;
    // console.log(page.getElementsByTagName('script'));
    node = node.substring(17,node.indexOf("bd.queryImageUrl")-1);
    baiduObj.dbString = "bd = " + node;
    // console.log(baiduObj.dbString);
    let {simiList,sameSizeList,guessWord,multitags} = await reverseImageSearch.waitForSandBox(baiduObj);
    //Get result from sandbox
    // console.log("success");
    searchImage.keyword = guessWord == "" ? multitags||"" :guessWord;
    // Send message of search image info to front page
    reverseImageSearch.updateSearchImage(searchImage,cursor);
    //Raynor Version
    //Pick 5 from sameSizeList
    let count  = 25;
    let result =[];
    if(sameSizeList){
      if(sameSizeList.length > 5){
        sameSizeList.length = 5;
      }
      count -= sameSizeList.length;
      for(let i = 0; i< sameSizeList.length; i++){
        let singleResult = {
          title: sameSizeList[i].fromPageTitle || "",
          thumbUrl:  sameSizeList[i].thumbURL || "",
          imageUrl:  sameSizeList[i].objURL ||"",
          sourceUrl: sameSizeList[i].fromURL  ||"",
          imageInfo:{
            height:sameSizeList[i].height,
            width:sameSizeList[i].width,
          },
          searchEngine:"baidu",
          description:sameSizeList[i].textHost || "",
        }
        result[result.length] = singleResult;
      }
    }
   
    if(simiList){
      if(simiList > count){
        simiList.length = count;
      }
      for(let i = 0; i< simiList.length; i++){
        let singleResult = {
          title: simiList[i].fromPageTitle || simiList[i].FromPageSummary || simiList[i].FromPageSummaryOrig || "",
          thumbUrl:  simiList[i].MiddleThumbnailImageUrl || "",
          imageUrl:  simiList[i].ObjURL ||"",
          sourceUrl: simiList[i].FromURL  ||"",
          imageInfo:{
            height:simiList[i].ImageHeight,
            width:simiList[i].ImageWidth,
          },
          searchEngine:"baidu",
          description:simiList[i].FromPageSummary || "",
        }
        result[result.length] = singleResult;
      }
    }
    //Pick 20 from simiList
    reverseImageSearch.updateResultImage(result,cursor);
    //pass done message Directly
    reverseImageSearch.engineDone("baidu",cursor);
  },
  /*Get Obj From Sand Box And Process Obj by this function*/
  processBaiduData: async () =>{
    /* Dummy Code To Maintain File Shape*/
  },
  fetchTineyeLink: async (link,cursor)=>{
    let searchImage = {
      keyword:"",
      keywordLink:"",
      engine:"tineye",
      imageInfo:{
      }
    }
    reverseImageSearch.updateSearchImage(searchImage,cursor);
    //Tineye doesn't have image Info
    const {data} = await ajax(link,{method: 'GET'});
    const page = HTML.parseFromString(data,"text/html");
    //Get Total Search Result
    const totalSearchResult = Number.parseInt(page.getElementsByClassName("search-details")[0].getElementsByTagName("h2")[0].innerHTML.split(" ")[0]);
    //Get Curreent Search Link
    const links       = page.getElementsByTagName("link");
    let   pageLink;
    for(let i = 0; i< links.length; i++){
      if(links[i].getAttribute("href").indexOf("https") != -1 && links[i].getAttribute("rel") == "shortcut icon"){
        pageLink = links[i].getAttribute("href").replace("query","search");
      }
    }
    //if pageLink exist
    if(pageLink){
      if(totalSearchResult && totalSearchResult !== 0){
        // let searchNumber = 20;
        // if(totalSearchResult){
        //   searchNumber = totalSearchResult >= 20 ? 20: totalSearchResult;
        // }
        let firstPage = reverseImageSearch.processTineyeData(page);
        const followingPage = page.getElementsByClassName("pagination-bottom")[0].getElementsByTagName("a");
        if(followingPage){
          let tempFunciton = function(url){
            return new Promise((resolve)=>{
              ajax(url,{method:"GET"}).then(({data}) =>{
                const page = HTML.parseFromString(data,"text/html");
                let singleResult = reverseImageSearch.processTineyeData(page);
                resolve(singleResult);
              })
            })
          }
          let taskSeq =[]; 
          for(let i = 0; i < followingPage.length - 1 && i<2; i++){
            let link = pageLink+followingPage[i].getAttribute("href");
            taskSeq[taskSeq.length] = tempFunciton(link);
          }
          let result = await Promise.all(taskSeq);
    
          for(let i = 0; i< result.length; i++){
            firstPage = firstPage.concat(result[i]);
          }
        }
        reverseImageSearch.updateResultImage(firstPage,cursor);
        }
    }
    reverseImageSearch.engineDone("tineye",cursor);
  },
  processTineyeData:  (page)=>{
    const list = page.getElementsByClassName("match-row") || [];
    let results = [];
    for(let i = 0; i< list.length; i++){
      let singleResult = {
        title:"",
        thumbUrl:"",
        imageUrl:"",
        sourceUrl:"",
        imageInfo:{},
        searchEngine:"tineye",
        description:"",
      }
      let singleItem = list[i];
      //match thum contain thumbUrl and Size
      let thumbAndSize = singleItem.getElementsByClassName("match-thumb")[0];
      singleResult.thumbUrl = thumbAndSize.getElementsByTagName("img")[0].getAttribute("src")||"";
      //get size info
      let sizeInfo = thumbAndSize.getElementsByTagName("span")[1].innerHTML;
      if(sizeInfo){
        sizeInfo = sizeInfo.substring(0,sizeInfo.indexOf(",")).split("x");
        singleResult.imageInfo.width = Number.parseInt(sizeInfo[0],10);
        singleResult.imageInfo.height = Number.parseInt(sizeInfo[1],10);
      }
      singleResult.title = singleItem.getElementsByTagName("h4")[0].getElementsByTagName("a")[0].innerHTML.replace(/&nbsp;|\n/g,"") || "";

      //image Url Source Url
      const urlPart = singleItem.getElementsByClassName("match-details")[0].getElementsByTagName("p");
      if(urlPart){
        for(let i = 0; i< urlPart.length; i++){
          let singleTagP = urlPart[i];
          let type = singleTagP.getAttribute("class");
          if(!type && singleResult.sourceUrl === ""){
            singleResult.sourceUrl = singleTagP.getElementsByTagName("a")[0].getAttribute("href");
          }else if(type && type.indexOf("image-link") !== -1 &&  singleResult.imageUrl === ""){
            singleResult.imageUrl = singleTagP.getElementsByTagName("a")[0].getAttribute("href");
          }
        }
      }
      results[results.length] = singleResult;
    }
    return results;
  },
  fetchBingLink:async (link)=>{

  },
  fetchBingData: async ()=>{
   
  },
  fetchYandexLink: async (link) =>{
    console.log(link)
    let searchImage = {
      keyword:"",
      keywordLink:"",
      engine:"yandex",
      imageInfo:{
      }
    }
    const {data} = await ajax(link,{method: 'GET'});
    const page = HTML.parseFromString(data,"text/html");
    window.x = page;
    let sizeInfo = page.getElementsByClassName("original-image__thumb-info")[0];
    if(sizeInfo){
      let size = sizeInfo.innerHTML.split("×");
      searchImage.imageInfo.width = size[0];
      searchImage.imageInfo.height = size[1];
    }
    let keywordWrapper = page.getElementsByClassName("tags__content");
    let keyword
    console.log(keywordWrapper);
    if(keywordWrapper){
      keywords = keywordWrapper[0].getElementsByTagName("a");
      if(keywords.length > 0){
        searchImage.keyword = keywords[0].innerHTML;
        searchImage.keywordLink = keywords[0].getAttribute("href");
      }
    }
    console.log(searchImage);
  },
  fetchYandexData: async () =>{
   
  },
  fetchSauceNaoLink: async(link) =>{
   
  },
  fetchSauceNaoData: async () =>{

  },
  fetchIQDBLink: async (link) =>{
  
  },
  fetchIQDBData: async () =>{
 
  },
  fetchAscii2dLink: async (link) =>{
   
  },
  fetchAscii2dData: async () =>{
   
  }
}