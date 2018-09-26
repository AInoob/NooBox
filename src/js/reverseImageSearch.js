import {
  get,
  set,
  setDB
} from 'SRC/utils/db.js';
import ajax from 'SRC/utils/ajax.js';
import ENGINE_DONE from  'SRC/constant/constants.js';
import { ENGINE_WEIGHTS } from '../constant/constants';
const HTML = new DOMParser();
// Data Format
export const reverseImageSearch = {
  updateResultImage: (result, cursor) => {
    browser.runtime.sendMessage({
      job: 'image_result_update',
      result: result,
      cursor: cursor
    }, () => {
      // console.log("Send Search Result");
    })
  },
  updateImage64: (base64, cursor) => {
    browser.runtime.sendMessage({
      job: 'image_base64',
      result: base64,
      cursor: cursor,
    }, () => {
      // console.log("Send base 64 Message");
    })
  },
  updateImageUrl: (url, cursor) => {
    browser.runtime.sendMessage({
      job: 'image_url',
      result: url,
      cursor: cursor,
    }, () => {})
  },
  reportError: (cursor) => {

  },
  waitForSandBox: (parseObj) => {
    return new Promise(function(resolve, reject) {
      //移除 listener
      let remove = function() {
        window.removeEventListener("message", trigger);
      }
      //触发Resolve
      let trigger = function(event) {
        // console.log(this)
        // console.log(remove);
        remove();
        resolve(event.data);
      }
      //添加Listener
      window.addEventListener("message", trigger);
      //把数据发送Sandbox
      document.getElementById('theFrame').contentWindow.postMessage(parseObj, '*');
    })
  },
  /*Fetch Available Page Link On Goolge*/
  fetchGoogleLink: async (link, cursor,resultObj) => {
    try{
      let searchImage = {
        keyword: "",
        keywordLink: "",
        engine: "google",
        imageInfo: {},
      }
      // console.log(123+"reachf");
      // console.log(link);
      const {
        data,
        err
      } = await ajax(link, {
        method: 'GET'
      });
      if(err){
        throw err
      }
      const page = HTML.parseFromString(data, "text/html");
      const followingPageSrouce = page.getElementsByTagName('tbody')[0].getElementsByTagName('a');
      let followingPageUrl = [];
      for (let i = 0; i < followingPageSrouce.length; i++) {
        //fl stand for following page in google
        if (followingPageSrouce[i] && followingPageSrouce[i].getAttribute("class") === "fl") {
          followingPageUrl[followingPageUrl.length] = "https://www.google.com" + followingPageSrouce[i].getAttribute("href");
        }
      }
      //get Search Imge Info
      const topstuff = page.getElementById("topstuff").getElementsByClassName("card-section")[0];
      //console.log(topstuff);
      //first child contain size info
      //second child contain keyword info
      const childNode = topstuff.childNodes;
      const sizeInfo = childNode[0].childNodes[1].childNodes[0].innerHTML.replace(/<br>|&nbsp;|Image size|:|：|图片尺寸|圖片尺寸/g, "");
      if (sizeInfo) {
        //"x" is special Character
        let size = sizeInfo.split("×");
        searchImage.imageInfo.width = Number.parseInt(size[0], 10);
        searchImage.imageInfo.height = Number.parseInt(size[1], 10);
      }
      const keyword = childNode[1].getElementsByTagName("a")[0];
      if (keyword) {
        // console.log(childNode[1]);
        // console.log(keyword.innerHTML);
        searchImage.keyword = keyword.innerHTML;
        searchImage.keywordLink = "https://www.google.com" + keyword.getAttribute("href");
      }
      // Send message of search image info to front page
      resultObj.searchImageInfo = resultObj.searchImageInfo.concat(searchImage);
      // Process first page source
      let firstPage = reverseImageSearch.processGoogleData(page);
      //  google
      //  maximum
      if (followingPageUrl.length > 0) {
        let tempFunciton = function(url) {
          return new Promise((resolve) => {
            ajax(url, {
              method: "GET"
            }).then(({
              data
            }) => {
              const page = HTML.parseFromString(data, "text/html");
              let singleResult = reverseImageSearch.processGoogleData(page);
              resolve(singleResult);
            }).catch(err => resolve(err))
          })
        }
        let taskSeq = [];
        //Raynor First Version, cut the search Number to 25
        if (followingPageUrl.length > 2) {
          followingPageUrl.length = 2;
        }
        for (let i = 0; i < followingPageUrl.length; i++) {
          taskSeq[taskSeq.length] = tempFunciton(followingPageUrl[i]);
        }
        let results = await Promise.all(taskSeq);
        //merge results to first page
        for (let i = 0; i < results.length; i++) {
          if(results[i] instanceof Error){
            throw results[i];
          }
          firstPage = firstPage.concat(results[i]);
        }
      }
      resultObj.searchResult = resultObj.searchResult.concat(firstPage);
      resultObj["googleDone"] = true;
      await setDB(cursor,resultObj);
      reverseImageSearch.updateResultImage(resultObj, cursor);
    }catch(e){
      resultObj["googleDone"] = true;
      reverseImageSearch.updateResultImage(resultObj, cursor);
    }
  },
  /*process Data*/
  processGoogleData: function(page) {
    let websiteList = page.getElementsByClassName('srg');
    let list = websiteList[websiteList.length - 1].getElementsByClassName("g");
    let results = [];
    for (let i = 0; i < list.length; i++) {
      let singleResult = {
        title: "",
        thumbUrl: "",
        imageUrl: "",
        sourceUrl: "",
        imageInfo: {},
        searchEngine: "google",
        description: "",
        weight: ENGINE_WEIGHTS.google - i + Math.random(),
      }
      const singleItem = list[i];
      //process title,imageUrl,sourceUrl and thumbUrl
      //first <a> contain title and imageUrl
      //second <a> contain sourceUrl and thumbUrl
      const tagA = singleItem.getElementsByTagName("a");
      singleResult.sourceUrl = tagA[0].getAttribute("href");
      singleResult.title = tagA[0].innerText;
      let link = tagA[1].getAttribute("href");
      singleResult.imageUrl = link.substring(link.indexOf("=") + 1, link.indexOf("&imgre"));
      if (!singleResult.imageUrl) {
        let tempImgLink = tagA[3].getAttribute("href");
        tempImgLink = tempImgLink.substr(tempImgLink.indexOf("imgurl=") + "imgurl=".length);
        tempImgLink = tempImgLink.substr(0, tempImgLink.indexOf("&"));
        console.log(tempImgLink);
        if (tempImgLink.match(/\:s$/)) {
          tempImgLink = tempImgLink.substr(0, tempImgLink.length - 2);
          console.log(tempImgLink);
        }
        else {
          tempImgLink = tempImgLink.substr(0, tempImgLink.indexOf("%3"));
          console.log(tempImgLink);
        }
        singleResult.imageUrl = tempImgLink;
      }
      singleResult.thumbUrl = singleResult.imageUrl;
      //process description
      //class st span contain N child, first child is size info
      //behind children are description,conbine them
      const tagSpan = singleItem.getElementsByClassName("st")[0].childNodes;
      let description = "";
      for (let i = 0; i < tagSpan.length; i++) {
        if (i == 0) {
          if (tagSpan[i].innerHTML) {
            let size = tagSpan[i].innerHTML.split("-")[0];
            size = size.replace(/ /g, "").split("×");
            if (size) {
              singleResult.imageInfo.width = Number.parseInt(size[0], 10);
              singleResult.imageInfo.height = Number.parseInt(size[1], 10);
            }
          } else {
            singleResult.imageInfo.width = -1;
            singleResult.imageInfo.height = -1;
          }
        } else {
          description += tagSpan[i].innerHTML || tagSpan[i].textContent;
        }
      }
      singleResult.description = description;
      results[results.length] = singleResult;
    }
    return results;
  },
  /*Fetch Available Page Link On Baidu Return Obj*/
  fetchBaiduLink: async (link, cursor,resultObj) => {
    try{
      let searchImage = {
        keyword: "",
        keywordLink: "",
        engine: "baidu",
        imageInfo: {}
      }
      // console.log(link)
      const {
        data,
        err,
      } = await ajax(link, {
        method: 'GET'
      });
      if(err){
        throw err;
      }
      // console.log(data);
      let baiduObj = {};
      //Parse Db
      const page = HTML.parseFromString(data, "text/html");
      let node = page.getElementsByTagName('script')[1].innerHTML;
      // console.log(page.getElementsByTagName('script'));
      node = node.substring(17, node.indexOf("bd.queryImageUrl") - 1);
      baiduObj.dbString = "bd = " + node;
      // console.log(baiduObj.dbString);
      let obj = await reverseImageSearch.waitForSandBox(baiduObj);
      // console.log(obj);
      let {
        simiList,
        sameSizeList,
        guessWord,
        multitags
      } = obj;
      // console.log(simiList);
      //Get result from sandbox
      // console.log("success");
      searchImage.keyword = guessWord == "" ? multitags || "" : guessWord;
      if(searchImage.keyword != ""){
        searchImage.keywordLink = "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&ch=&tn=baiduerr&bar=&wd=" + searchImage.keyword
      }
      // Send message of search image info to front page
      resultObj.searchImageInfo = resultObj.searchImageInfo.concat(searchImage);
      //Raynor Version
      //Pick 5 from sameSizeList
      let count = 25;
      let result = [];
      if (sameSizeList) {
        if (sameSizeList.length > 5) {
          sameSizeList.length = 5;
        }
        count -= sameSizeList.length;
        for (let i = 0; i < sameSizeList.length; i++) {
          let singleResult = {
            title: sameSizeList[i].fromPageTitle || "",
            thumbUrl: sameSizeList[i].thumbURL || "",
            imageUrl: sameSizeList[i].objURL || "",
            sourceUrl: sameSizeList[i].fromURL || "",
            imageInfo: {
              height: sameSizeList[i].height,
              width: sameSizeList[i].width,
            },
            searchEngine: "baidu",
            description: sameSizeList[i].textHost || "",
            weight: ENGINE_WEIGHTS.baidu - i + Math.random() - 4,
          }
          result[result.length] = singleResult;
        }
      }

      if (simiList) {
        if (simiList > count) {
          simiList.length = count;
        }
        for (let i = 0; i < simiList.length; i++) {
          let singleResult = {
            title: simiList[i].fromPageTitle || simiList[i].FromPageSummary || simiList[i].FromPageSummaryOrig || "",
            thumbUrl: simiList[i].MiddleThumbnailImageUrl || "",
            imageUrl: simiList[i].ObjURL.indexOf("timgsa.baidu.com") != -1 ? simiList[i].ObjURL.substring(simiList[i].ObjURL.indexOf("src=")+4,simiList[i].ObjURL.length): simiList[i].ObjURL|| "",
            sourceUrl: simiList[i].FromURL || "",
            imageInfo: {
              height: simiList[i].ImageHeight,
              width: simiList[i].ImageWidth,
            },
            searchEngine: "baidu",
            description: simiList[i].FromPageSummary || "",
            weight: ENGINE_WEIGHTS.baidu - i + Math.random(),
          }
          result[result.length] = singleResult;
        }
      }
      resultObj.searchResult = resultObj.searchResult.concat(result);
      resultObj["baiduDone"] = true;
      await setDB(cursor,resultObj);
      reverseImageSearch.updateResultImage(resultObj, cursor);
    }catch(e){
      resultObj["baiduDone"] = true;
      reverseImageSearch.updateResultImage(resultObj, cursor);
    }

  },
  /*Get Obj From Sand Box And Process Obj by this function*/
  processBaiduData: async () => {
    /* Dummy Code To Maintain File Shape*/
  },
  fetchTineyeLink: async (link, cursor,resultObj) => {
    try{
      let searchImage = {
        keyword: "",
        keywordLink: "",
        engine: "tineye",
        imageInfo: {}
      }
      resultObj.searchImageInfo = resultObj.searchImageInfo.concat(searchImage);
      //Tineye doesn't have image Info
      const {
        data,
        err,
      } = await ajax(link, {
        method: 'GET'
      });
      if(err){
        throw err;
      }
      const page = HTML.parseFromString(data, "text/html");
      //Get Total Search Result
      const totalSearchResult = Number.parseInt(page.getElementsByClassName("search-details")[0].getElementsByTagName("h2")[0].innerHTML.split(" ")[0]);
      //Get Curreent Search Link
      const links = page.getElementsByTagName("link");
      let pageLink;
      for (let i = 0; i < links.length; i++) {
        if (links[i].getAttribute("href").indexOf("https") != -1 && links[i].getAttribute("rel") == "shortcut icon") {
          pageLink = links[i].getAttribute("href").replace("query", "search");
        }
      }
      //if pageLink exist
      if (pageLink) {
        if (totalSearchResult && totalSearchResult !== 0) {
          // let searchNumber = 20;
          // if(totalSearchResult){
          //   searchNumber = totalSearchResult >= 20 ? 20: totalSearchResult;
          // }
          let firstPage = reverseImageSearch.processTineyeData(page);
          const followingPageExist = page.getElementsByClassName("pagination-bottom")[0]
          if (followingPageExist) {
            let followingPage = followingPageExist.getElementsByTagName("a");
            let tempFunciton = function(url) {
              return new Promise((resolve) => {
                ajax(url, {
                  method: "GET"
                }).then(({
                  data
                }) => {
                  const page = HTML.parseFromString(data, "text/html");
                  let singleResult = reverseImageSearch.processTineyeData(page);
                  resolve(singleResult);
                }).catch(err => resolve(err))
              })
            }
            let taskSeq = [];
            for (let i = 0; i < followingPage.length - 1 && i < 2; i++) {
              let link = pageLink + followingPage[i].getAttribute("href");
              taskSeq[taskSeq.length] = tempFunciton(link);
            }
            let result = await Promise.all(taskSeq);
            for (let i = 0; i < result.length; i++) {
              if(result[i] instanceof Error){
                throw result[i];
              }
              firstPage = firstPage.concat(result[i]);
            }
          }
          resultObj.searchResult = resultObj.searchResult.concat(firstPage);
          await setDB(cursor,resultObj);
        }
      }
      resultObj["tineyeDone"] = true;
      reverseImageSearch.updateResultImage(resultObj, cursor);
    }catch(e){
      resultObj["tineyeDone"] = true;
      reverseImageSearch.updateResultImage(resultObj, cursor);
    }

  },
  processTineyeData: (page) => {
    const list = page.getElementsByClassName("match-row") || [];
    let results = [];
    let weightCount = 0;
    for (let i = 0; i < list.length; i++) {
      let singleResult = {
        title: "",
        thumbUrl: "",
        imageUrl: "",
        sourceUrl: "",
        imageInfo: {},
        searchEngine: "tineye",
        description: "",
        weight: ENGINE_WEIGHTS.tineye - i + Math.random(),
      }
      let singleItem = list[i];
      //match thum contain thumbUrl and Size
      let thumbAndSize = singleItem.getElementsByClassName("match-thumb")[0];
      singleResult.thumbUrl = thumbAndSize.getElementsByTagName("img")[0].getAttribute("src") || "";
      //get size info
      let sizeInfo = thumbAndSize.getElementsByTagName("span")[1].innerHTML;
      if (sizeInfo) {
        sizeInfo = sizeInfo.substring(0, sizeInfo.indexOf(",")).split("x");
        singleResult.imageInfo.width = Number.parseInt(sizeInfo[0], 10);
        singleResult.imageInfo.height = Number.parseInt(sizeInfo[1], 10);
      }
      singleResult.title = singleItem.getElementsByTagName("h4")[0].getElementsByTagName("a")[0].innerHTML.replace(/&nbsp;|\n/g, "") || "";

      //image Url Source Url
      const urlPart = singleItem.getElementsByClassName("match-details")[0].getElementsByTagName("p");
      if (urlPart) {
        for (let i = 0; i < urlPart.length; i++) {
          let singleTagP = urlPart[i];
          let type = singleTagP.getAttribute("class");
          if (!type && singleResult.sourceUrl === "") {
            let sourceUrl = singleTagP.getElementsByTagName("a")[0];
            if (sourceUrl) {
              singleResult.sourceUrl = sourceUrl.getAttribute("href");
            }
          } else if (type && type.indexOf("image-link") !== -1 && singleResult.imageUrl === "") {
            let imageUrl = singleTagP.getElementsByTagName("a")[0];
            if (imageUrl) {
              singleResult.imageUrl = imageUrl.getAttribute("href");
            }
          }
        }
      }
      results[results.length] = singleResult;
    }
    return results;
  },
  fetchBingLink: async (link, imageLink, cursor,resultObj) => {
    try{
      let searchImage = {
        keyword: "",
        keywordLink: "",
        engine: "bing",
        imageInfo: {}
      }
      const {
        data,
        err,
      } = await ajax(link, {
        method: "GET",
        credentials: "same-origin"
      });
      if(err){
        throw err;
      }
      const page = HTML.parseFromString(data, "text/html");
      let allScript = page.getElementsByTagName("script");
      let ig;
      let skey;
      for (let i = 0; i < allScript.length; i++) {
        let singleItem = allScript[i].innerHTML;
        if (singleItem.indexOf("IG:\"") != -1) {
          let igString = singleItem.substring(singleItem.indexOf("IG:\""), singleItem.indexOf("\",EventID"));
          ig = igString.substring(igString.indexOf("\"") + 1, igString.length);
        }
        if (singleItem.indexOf("skey=") != -1) {
          let skeyEqu = singleItem.substring(singleItem.indexOf("skey="), singleItem.indexOf("&safeSearch="));
          skey = skeyEqu.substring(skeyEqu.indexOf("=") + 1, skeyEqu.length);
        }
        if (ig && skey) {
          break;
        }
      }
      //magic sh*t stuff LOL
      if (ig && skey) {
        let halfAnd = "&"
        let baseURL = "https://www.bing.com/images/api/custom/details?";
        let modules = "modules=brq,objectdetection,objectrecognition,imagebasedrelatedsearches,relatedsearches,image,caption,similarimages,similarproducts";
        let imageurl = "imgurl=" + imageLink;
        let rshighlight = "rshighlight=true";
        let textDecorations = "textDecorations=true";
        let internalFeatures = "internalFeatures=share";
        let skeyString = "skey=" + skey;
        let safeSearch = "safeSearch=Strict";
        let IGString = "IG=" + ig;
        let IID = "IID=idpins";
        let SFX = "SFX=1";
        let magicLink = baseURL + halfAnd +
          modules + halfAnd +
          imageurl + halfAnd +
          rshighlight + halfAnd +
          textDecorations + halfAnd +
          internalFeatures + halfAnd +
          skeyString + halfAnd +
          safeSearch + halfAnd +
          IGString + halfAnd +
          IID + halfAnd +
          SFX;
        const {
          data,
          err,
        } = await ajax(magicLink, {
          method: "GET",
          credentials: "same-origin"
        });
        // console.log(data);
        // console.log(data);
        if(err){
          throw err;
        }
        let {
          bestRepresentativeQuery,
          image
        } = data;
        if (bestRepresentativeQuery) {
          searchImage.keyword = bestRepresentativeQuery.displayText || bestRepresentativeQuery.text || "";
          searchImage.keywordLink = bestRepresentativeQuery.webSearchUrl || "";
        }
        if (image) {
          searchImage.imageInfo.width = image.width || "";
          searchImage.imageInfo.height = image.height || "";
        }
        resultObj.searchImageInfo = resultObj.searchImageInfo.concat(searchImage);
        let results = reverseImageSearch.processBingData(data);
        resultObj.searchResult = resultObj.searchResult.concat(results);
        await setDB(cursor,resultObj);
      }
      resultObj["bingDone"] = true;
      reverseImageSearch.updateResultImage(resultObj, cursor);
    }catch(e){
      resultObj["bingDone"] = true;
      reverseImageSearch.updateResultImage(resultObj, cursor);
    }
  },
  processBingData: (data) => {
    let results = [];
    let {
      imageBasedRelatedSearches,
      relatedSearches,
      visuallySimilarImages
    } = data;
    if (imageBasedRelatedSearches && imageBasedRelatedSearches.value.length > 0) {
      let content = imageBasedRelatedSearches.value;
      for (let i = 0; i < content.length; i++) {
        let singleResult = {
          title: "",
          thumbUrl: "",
          imageUrl: "",
          sourceUrl: "",
          imageInfo: {},
          searchEngine: "bing",
          description: "",
          weight: ENGINE_WEIGHTS.bing - i + Math.random() - 2,
        }
        singleResult.thumbUrl = content[i].thumbnail.url;
        singleResult.title = content[i].text || content[i].displayText || "";
        singleResult.sourceUrl = content[i].webSearchUrl;
        singleResult.imageUrl = content[i].thumbnail.url;
        singleResult.imageInfo.width = -1;
        singleResult.imageInfo.height = -1;
        results[results.length] = singleResult;
      }
    }

    if (relatedSearches && relatedSearches.value.length > 0) {
      let content = relatedSearches.value;
      for (let i = 0; i < content.length; i++) {
        let singleResult = {
          title: "",
          thumbUrl: "",
          imageUrl: "",
          sourceUrl: "",
          imageInfo: {},
          searchEngine: "bing",
          description: "",
          weight: ENGINE_WEIGHTS.bing - i + Math.random() - 2,
        }
        singleResult.thumbUrl = content[i].thumbnail.url;
        singleResult.title = content[i].text || content[i].displayText || "";
        singleResult.sourceUrl = content[i].webSearchUrl;
        singleResult.imageUrl = content[i].thumbnail.url;
        singleResult.imageInfo.width = -1;
        singleResult.imageInfo.height = -1;
        results[results.length] = singleResult;
      }
    }

    if (visuallySimilarImages && visuallySimilarImages.value.length > 0) {
      let content = visuallySimilarImages.value;
      for (let i = 0; i < content.length; i++) {
        let singleResult = {
          title: "",
          thumbUrl: "",
          imageUrl: "",
          sourceUrl: "",
          imageInfo: {},
          searchEngine: "bing",
          description: "",
          weight: ENGINE_WEIGHTS.bing - i + Math.random(),
        }
        singleResult.thumbUrl = content[i].thumbnailUrl;
        singleResult.title = content[i].name || "";
        singleResult.sourceUrl = content[i].hostPageUrl || content[i].hostPageDisplayUrl || "";
        singleResult.imageUrl = content[i].contentUrl;
        singleResult.imageInfo.width = content[i].width;
        singleResult.imageInfo.height = content[i].height;
        results[results.length] = singleResult;
      }
    }
    return results;
  },
  fetchYandexLink: async (link, cursor,resultObj) => {
    try{
      let searchImage = {
        keyword: "",
        keywordLink: "",
        engine: "yandex",
        imageInfo: {}
      }
      const {
        data,
        err
      } = await ajax(link, {
        method: 'GET'
      });
      if(err){
        throw err;
      }
      const page = HTML.parseFromString(data, "text/html");
      window.x = page;
      let sizeInfo = page.getElementsByClassName("original-image__thumb-info")[0];
      if (sizeInfo) {
        let size = sizeInfo.innerHTML.split("×");
        searchImage.imageInfo.width = size[0];
        searchImage.imageInfo.height = size[1];
      }
      let keywordWrapper = page.getElementsByClassName("tags__content");
      if (keywordWrapper.length != 0) {
        keywords = keywordWrapper[0].getElementsByTagName("a");
        if (keywords.length > 0) {
          searchImage.keyword = keywords[0].innerHTML;
          searchImage.keywordLink = keywords[0].getAttribute("href");
        }
      } else {
        searchImage.keyword = "";
      }
      resultObj.searchImageInfo = resultObj.searchImageInfo.concat(searchImage);
      let results = reverseImageSearch.processYandexData(page);
      // console.log(results);
      resultObj.searchResult = resultObj.searchResult.concat(results);
      resultObj["yandexDone"] = true;
      await setDB(cursor,resultObj);
      reverseImageSearch.updateResultImage(resultObj, cursor);
    }catch(e){
      resultObj["yandexDone"] = true;
      reverseImageSearch.updateResultImage(resultObj, cursor);
    }
  },
  processYandexData: (page) => {
    let results = [];
    let similar = page.getElementsByClassName("similar__thumbs");
    if (similar.length > 0) {
      const similarList = similar[0].getElementsByTagName("li");
      for (let i = 0; i < similarList.length; i++) {
        let singleResult = {
          title: "",
          thumbUrl: "",
          imageUrl: "",
          sourceUrl: "",
          imageInfo: {},
          searchEngine: "yandex",
          description: "",
          weight : ENGINE_WEIGHTS.yandex - i + Math.random(),
        }
        singleResult.title = "Yandex";
        let singleItem = similarList[i];
        let sizeInfo = singleItem.getAttribute("style").split(";");
        if (sizeInfo) {
          let maxWidth = Number.parseInt(sizeInfo[0].substring(sizeInfo[0].indexOf(":") + 1, sizeInfo[0].indexOf("px")), 10);
          let width = Number.parseInt(sizeInfo[1].substring(sizeInfo[1].indexOf(":") + 1, sizeInfo[1].indexOf("px")), 10);
          let aveWidth = Math.floor((maxWidth + width) / 2);
          singleResult.imageInfo.width = aveWidth;
          singleResult.imageInfo.height = 130;
        }
        let imageSource = singleItem.getElementsByTagName("a")[0];
        singleResult.sourceUrl = "https://yandex.com" + imageSource.getAttribute("href");

        let imagePart = singleItem.getElementsByTagName("img")[0];
        singleResult.thumbUrl = "https:" + imagePart.getAttribute("src");
        singleResult.imageUrl = "https:" + imagePart.getAttribute("src");
        results[results.length] = singleResult;
      }
    }
    let otherSite = page.getElementsByClassName("other-sites__container");
    if (otherSite.length > 0) {
      const otherSiteList = otherSite[0].getElementsByTagName("li");
      for (let i = 0; i < otherSiteList.length; i++) {
        let singleResult = {
          title: "",
          thumbUrl: "",
          imageUrl: "",
          sourceUrl: "",
          imageInfo: {},
          searchEngine: "yandex",
          description: "",
          weight : ENGINE_WEIGHTS.yandex - i + Math.random() - 10,
        }
        let singleItem = otherSiteList[i];
        let thumbUrl = singleItem.getElementsByClassName("other-sites__preview-link")[0].getAttribute("href");
        singleResult.thumbUrl = thumbUrl;
        singleResult.imageUrl = thumbUrl;
        let sizeInfo = singleItem.getElementsByClassName("other-sites__meta")[0].innerHTML || singleItem.getElementsByClassName("serp-item__meta")[0].innerHTML || undefined;
        if (sizeInfo) {
          const size = sizeInfo.split("×");
          singleResult.imageInfo.width = Number.parseInt(size[0], 10);
          singleResult.imageInfo.height = Number.parseInt(size[1], 10);
        }
        let title = singleItem.getElementsByClassName("other-sites__title-link")[0];
        singleResult.title = title.innerHTML;
        singleResult.sourceUrl = title.getAttribute("href");
        let description = singleItem.getElementsByClassName("other-sites__desc")[0].innerHTML;
        singleResult.description = description;
        results[results.length] = singleResult;
      }
    }
    return results;
  },
  fetchSauceNaoLink: async (link, cursor,resultObj) => {
    try{
      let searchImage = {
        keyword: "",
        keywordLink: "",
        engine: "saucenao",
        imageInfo: {}
      }
      //sausnao doesn't have search Image Info
      const {
        data,
        err
      } = await ajax(link, {
        method: "GET",
        credentials: "same-origin"
      });
      if(err){
        throw err;
      }
      const page = HTML.parseFromString(data, "text/html");
      let results = reverseImageSearch.processSauceNaoData(page);
      resultObj.searchImageInfo = resultObj.searchImageInfo.concat(searchImage);
      resultObj.searchResult = resultObj.searchResult.concat(results);
      resultObj["saucenaoDone"] = true;
      await setDB(cursor,resultObj);
      reverseImageSearch.updateResultImage(resultObj, cursor);
    }catch(e){
      resultObj["saucenaoDone"] = true;
      reverseImageSearch.updateResultImage(resultObj, cursor);
    }

  },
  processSauceNaoData: (page) => {
    let results = [];
    let list = page.getElementsByClassName("result");
    if (list.length > 0) {
      for (let i = 1; i < list.length; i++) {
        let singleResult = {
          title: "",
          thumbUrl: "",
          imageUrl: "",
          sourceUrl: "",
          imageInfo: {},
          searchEngine: "saucenao",
          description: "",
          weight: ENGINE_WEIGHTS.saucenao - i + Math.random(),
        };
        let singleItem = list[i];
        let resultImage = singleItem.getElementsByClassName("resultimage")[0];
        if (resultImage) {
          let soureUrl = resultImage.getElementsByTagName("a")[0];
          if (soureUrl) {
            singleResult.sourceUrl = soureUrl.getAttribute("href") || "";
          }
          let thumbUrl = resultImage.getElementsByTagName("img")[0];
          if (thumbUrl) {
            singleResult.thumbUrl = thumbUrl.getAttribute("data-src") || thumbUrl.getAttribute("src") || "";
            singleResult.imageUrl = thumbUrl.getAttribute("data-src") || thumbUrl.getAttribute("src") || "";
          }
        }
        let resultContent = singleItem.getElementsByClassName("resultcontent")[0];
        if (resultContent) {
          let title = resultContent.getElementsByTagName("strong")[0];

          if (title) {
            singleResult.title = title.innerHTML;
          }
        }
        singleResult.imageInfo.height = -1;
        singleResult.imageInfo.width = -1;
        results[results.length] = singleResult;
      }
    }
    return results;
  },
  fetchIQDBLink: async (link, cursor,resultObj) => {
    try{
      let searchImage = {
        keyword: "",
        keywordLink: "",
        engine: "iqdb",
        imageInfo: {}
      }
      const {
        data,
        err
      } = await ajax(link, {
        method: "GET"
      });
      if(err){
        throw err;
      }
      const page = HTML.parseFromString(data, "text/html");
      let results = reverseImageSearch.processIQDBData(page);
      resultObj.searchImageInfo = resultObj.searchImageInfo.concat(searchImage);
      resultObj.searchResult = resultObj.searchResult.concat(results);
      resultObj["iqdbDone"] = true;
      await setDB(cursor,resultObj);
      reverseImageSearch.updateResultImage(resultObj, cursor);
    }catch(e){
      resultObj["iqdbDone"] = true;
      reverseImageSearch.updateResultImage(resultObj, cursor);
    }
  },
  processIQDBData: (page) => {
    let results = [];
    //contain possibly match and more
    const containers = page.getElementsByClassName("pages");
    if (containers.length > 0) {
      for (let i = 0; i < containers.length; i++) {
        let singleContainer = containers[i];
        let list = singleContainer.getElementsByTagName("div");
        for (let j = 0; j < list.length; j++) {
          let singleItem = list[j];
          let header = singleItem.getElementsByTagName("th")[0];
          if (header == undefined || header.innerHTML == "Possible match") {
            let singleResult = {
              title: "Possible Match",
              thumbUrl: "",
              imageUrl: "",
              sourceUrl: "",
              imageInfo: {},
              searchEngine: "iqdb",
              description: "",
              weight: ENGINE_WEIGHTS.iqdb - i + Math.random(),
            };
            let data = singleItem.getElementsByTagName("td");
            //# 0 image
            let imageData = data[0].getElementsByTagName("a")[0];
            if (imageData) {
              let sourceUrl = imageData.getAttribute("href") || "";
              if(sourceUrl.indexOf("http") != -1){
                sourceUrl = "http:" + sourceUrl.substring(sourceUrl.indexOf("//"),sourceUrl.length);
              }else if(sourceUrl.indexOf("https") == -1){
                sourceUrl = "https:"+ sourceUrl;
              }
              singleResult.sourceUrl = sourceUrl == "" ? "" : sourceUrl;
              let thumbUrl = imageData.getElementsByTagName("img")[0]
              if (thumbUrl) {
                let link = thumbUrl.getAttribute("src") || "";

                singleResult.thumbUrl = link == "" ? "" : "http://iqdb.org/" + link;
                singleResult.imageUrl = link == "" ? "" : "http://iqdb.org/" + link;
              }
            }
            //# 1 uploader info: pass
            //# 2 size info
            let sizeInfo = data[2].innerHTML;
            if (sizeInfo) {
              let size = sizeInfo.split(" ")[0].split("×");
              singleResult.imageInfo.width = size[0];
              singleResult.imageInfo.height = size[1];
            }
            //# 3 description
            let description = data[3].innerHTML;
            if (description) {
              singleResult.description = description;
            }
            results[results.length] = singleResult;
          } else {
            continue;
          }
        }
      }
    }
    return results;
  },
  fetchAscii2dLink: async (api, link, cursor,resultObj) => {
    try{
      let searchImage = {
        keyword: "",
        keywordLink: "",
        engine: "ascii2d",
        imageInfo: {}
      }
      var formData = new FormData();
      formData.append("uri", link)
      const {
        data,
        err
      } = await ajax(api, {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });
      // console.log(data);
      const page = HTML.parseFromString(data, "text/html");
      let results = reverseImageSearch.fetchAscii2dData(page);
      let engineLinks = page.getElementsByClassName("detail-link pull-xs-right hidden-sm-down gray-link")[0];
      if(engineLinks){
        let engineLink = engineLinks.getElementsByTagName("a")[0].href || "";
        if(engineLink != ""){
          engineLink = "https://ascii2d.net" + engineLink.substring(engineLink.indexOf("/search/"),engineLink.length);
        }else{
          engineLink =  "https://ascii2d.net";
        }
        resultObj.engineLink["ascii2d"] = engineLink;
      }

      // window.x = page;
      resultObj.searchImageInfo = resultObj.searchImageInfo.concat(searchImage);
      resultObj.searchResult = resultObj.searchResult.concat(results);
      resultObj["ascii2dDone"] = true;
      await setDB(cursor,resultObj);
      reverseImageSearch.updateResultImage(resultObj, cursor);
    }catch(e){
      resultObj["ascii2dDone"] = true;
      reverseImageSearch.updateResultImage(resultObj, cursor);
    }
  },
  fetchAscii2dData: (page) => {
    let results = [];
    let list = page.getElementsByClassName("item-box");
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        let singleResult = {
          title: "Possible Match",
          thumbUrl: "",
          imageUrl: "",
          sourceUrl: "",
          imageInfo: {},
          searchEngine: "ascii2d",
          description: "",
          weight: ENGINE_WEIGHTS.ascii2d - i + Math.random(),
        };
        let item = list[i];
        let imageTag = item.getElementsByClassName("image-box")[0];
        if (imageTag) {
          let image = imageTag.getElementsByTagName("img")[0];
          if (image) {
            let thumbUrl = image.getAttribute("src") || "";
            // console.log(thumbUrl);
            singleResult.thumbUrl = thumbUrl == "" ? "" : "https://ascii2d.net" + thumbUrl;
            singleResult.imageUrl = thumbUrl == "" ? "" : "https://ascii2d.net" + thumbUrl;
          }

        }
        let infoTag = item.getElementsByClassName("info-box")[0];
        if (infoTag) {
          let sizeInfo = infoTag.getElementsByTagName("small")[0];
          if (sizeInfo) {
            let size = sizeInfo.innerHTML.split(" ")[0].split("x");
            singleResult.imageInfo.width = size[0];
            singleResult.imageInfo.height = size[1];
          }
          let title = infoTag.getElementsByTagName("a");
          if (title[0]) {
            singleResult.title = title[0].innerHTML;
            singleResult.sourceUrl = title[0].getAttribute("href");
          }
          if (title[1]) {
            singleResult.description = "Author: " + title[1].innerHTML;
          }
        }
        results[results.length] = singleResult;
      }
    }
    return results;
  }
}
