/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	"use strict";

	//Using object as a class to wrap different sections and functions
	var NooBox = {};
	var analyticsOnce = false;
	var analyticsLastList = {};

	function analytics(request) {
	  if (!analyticsOnce) {
	    bello.pageview(NooBox.Options.constantValues[1][1]);
	    analyticsOnce = true;
	  }
	  var time = new Date().getTime();
	  if (!analyticsLastList[request.category] || analyticsLastList[request.category] + 500 < time) {
	    analyticsLastList[request.category] = time;
	  }

	  bello.event({
	    category: request.category,
	    action: request.action,
	    label: request.label
	  });
	}
	NooBox.temp = {
	  lastVideoControl: 0
	};
	NooBox.Image = {};
	NooBox.Webmaster = {};
	NooBox.History = {};
	NooBox.Options = {};
	NooBox.Notifications = {};
	//Options section
	NooBox.Options.init = null;
	//Default settings, will be set to correspond values if the settings does not exist
	//Store in chrome.storage.sync
	NooBox.Options.defaultValues = null;
	//Image section
	NooBox.Image.reverseSearchCursor = 0;
	//contains functions that will fetch the useful data from search engines
	NooBox.Image.fetchFunctions = {};
	//Handles of context menu
	NooBox.Image.handles = {};
	//Functions to upload image to the internet
	NooBox.Image.POST = {};
	//servers for uploading
	NooBox.Image.POST.servers = ['ainoob.com'];
	//the order of uploading if one failed
	NooBox.Image.POST.serverOrder = [0];
	//functions for uploading
	NooBox.Image.POST.server = {};
	//upload the image then call itself, which will call fetch functions
	NooBox.Image.POST.general = null;
	//call POST.server[x] to upload image
	NooBox.Image.POST.upload = null;
	//add or remove image context menus
	NooBox.Image.updateContextMenu = null;
	//list of search engines
	NooBox.Image.engines = ["google", "baidu", "tineye", "bing", "yandex", "saucenao", "iqdb"];
	//URLs for each search engine
	NooBox.Image.apiUrls = null;
	//search an image given URL or dataURI
	NooBox.Image.imageSearch = null;
	//update result in DB and send message to image.search.html
	NooBox.Image.update = null;
	//inject and run scripts to current tab
	NooBox.Image.screenshotSearch = null;
	//inject and run scripts to current tab
	NooBox.Image.extractImages = null;
	//download extracted images
	NooBox.Image.downloadExtractImages = null;
	//record the search history
	NooBox.History.recordImageSearch = null;

	NooBox.Notifications.notImage = function () {
	  chrome.notifications.create({
	    type: 'basic',
	    iconUrl: '/images/icon_128.png',
	    title: GL('reverse_image_search'),
	    message: GL('ls_0')
	  });
	};

	//The implementation of functions and variables
	NooBox.Options.defaultValues = [['userId', (Math.random().toString(36) + '00000000000000000').slice(2, 19)], ['imageSearch', true], ['shorcut', false], ['unitsConverter', false], ['crypter', true], ['webmaster', true], ['general', true], ['background', false], ['imageSearchUrl_google', true], ['imageSearchUrl_baidu', true], ['imageSearchUrl_tineye', true], ['imageSearchUrl_bing', true], ['imageSearchUrl_yandex', true], ['imageSearchUrl_saucenao', true], ['imageSearchUrl_iqdb', true], ['imageSearchUrl_sogou', true], ['extractImages', true], ['screenshotSearch', true], ['videoControl', false], ['displayOrder', []], ['checkUpdate', true], ['lastUpdateCheck', 0], ['updateHistory', []], ['history', true]];

	NooBox.Options.constantValues = [['displayList', ['imageSearch', 'videoControl', 'checkUpdate']], ['version', '0.9.3.5']];

	NooBox.Options.init = function (i) {
	  var constantValues = NooBox.Options.constantValues;
	  if (i < constantValues.length) {
	    set(constantValues[i][0], constantValues[i][1]);
	  }
	  var defaultValues = NooBox.Options.defaultValues;
	  if (i < defaultValues.length) {
	    setIfNull(defaultValues[i][0], defaultValues[i][1], NooBox.Options.init.bind(null, i + 1));
	  } else {
	    NooBox.Image.updateContextMenu();
	  }
	};

	NooBox.Image.init = function () {
	  // I failed to find a way
	  /*NooBox.Image.imageReader = new window.FileReader();
	  NooBox.Image.imageReader.onloadend = () => {
	  	const base64data = this.reader.result;                
	  	chrome.runtime.sendMessage({
	  		job:'analytics',
	  		category:'uploadSearch',
	  		action:'run'
	  	}, () => {});
	  	chrome.runtime.sendMessage({job: 'imageSearch_upload', data: base64data });
	  }
	  NooBox.Image.imageHolder = document.createElement('img');
	  NooBox.Image.imageHolder.onerror = chrome.runtime.sendMessage({ job: 'notImage' });
	  NooBox.Image.onload = function() {
	  	fetchBlob(e.target.src, (blob) => {
	  		NooBox.Image.imageReader.readAsDataURL(blob);
	  	});
	  }
	  	NooBox.Image.imageFileSelector = document.createElement('input');
	  NooBox.Image.imageFileSelector.type = 'file';
	  NooBox.Image.imageFileSelector.id = 'imageFileSelector';
	  NooBox.Image.imageFileSelector.addEventListener('change', (e) => {
	  	const imageUrl = URL.createObjectURL(e.target.files[0]);
	  	NooBox.Image.imageHolder.src = imageUrl;
	  });*/
	};

	NooBox.Image.updateContextMenu = function () {
	  isOn('imageSearch', function () {
	    if (!NooBox.Image.handles.imageSearch) {
	      NooBox.Image.handles.imageSearch = chrome.contextMenus.create({
	        "title": GL("search_this_image"),
	        "contexts": ["image"],
	        "onclick": NooBox.Image.imageSearch
	      });
	    }
	  }, function () {
	    if (NooBox.Image.handles.imageSearch) {
	      chrome.contextMenus.remove(NooBox.Image.handles.imageSearch);
	      NooBox.Image.handles.imageSearch = null;
	    }
	  });
	  isOn('extractImages', function () {
	    if (!NooBox.Image.handles.extractImages) {
	      NooBox.Image.handles.extractImages = chrome.contextMenus.create({
	        "id": "extractImages",
	        "title": GL("extract_images"),
	        "contexts": ["all"],
	        "onclick": NooBox.Image.extractImages
	      });
	    }
	  }, function () {
	    if (NooBox.Image.handles.extractImages) {
	      chrome.contextMenus.remove(NooBox.Image.handles.extractImages);
	      NooBox.Image.handles.extractImages = null;
	    }
	  });
	  isOn('screenshotSearch', function () {
	    if (!NooBox.Image.handles.screenshotSearch) {
	      NooBox.Image.handles.screenshotSearch = chrome.contextMenus.create({
	        "id": "screenshotSearch",
	        "title": GL("screenshot_search"),
	        "contexts": ["all"],
	        "onclick": NooBox.Image.screenshotSearch
	      });
	    }
	  }, function () {
	    if (NooBox.Image.handles.screenshotSearch) {
	      chrome.contextMenus.remove(NooBox.Image.handles.screenshotSearch);
	      NooBox.Image.handles.screenshotSearch = null;
	    }
	  });
	};

	NooBox.Image.imageSearch = function (info) {
	  var source = info.srcUrl || info;
	  getDB('imageCursor', function (cursor) {
	    if (typeof cursor === 'number') {
	      cursor++;
	    } else {
	      cursor = 0;
	    }
	    setDB('imageCursor', cursor);
	    NooBox.History.recordImageSearch(cursor, info);
	    getImageSearchEngines(NooBox.Image.engines, function (engines) {
	      var action = 'dataURI';
	      var result = {
	        engines: engines
	      };
	      for (var j = 0; j < engines.length; j++) {
	        result[engines[j]] = {
	          result: 'loading'
	        };
	      }
	      var dataURI = encodeURI(source);
	      //if it is dataURI, using NooBox.Image.POST to upload the image and search
	      if (dataURI.match(/^data/)) {
	        result.imageUrl = 'dataURI';
	        result.dataURI = dataURI;
	        NooBox.Image.POST.general(cursor, result, engines, result.dataURI);
	      } else {
	        action = 'url';
	        result.imageUrl = source;
	        for (var i = 0; i < engines.length; i++) {
	          (function (cursor, engine) {
	            var url2 = NooBox.Image.apiUrls[engine] + source;
	            result[engine].url = url2;
	            $.ajax({
	              url: url2
	            }).done(function (data) {
	              NooBox.Image.fetchFunctions[engine](cursor, result, data);
	            }).fail(function (e) {
	              result[engine].result = 'failed';
	              NooBox.Image.update(cursor, result);
	              console.log(e);
	            });
	          })(cursor, engines[i]);
	        }
	      }
	      var type = result.imageUrl;
	      if (type != 'dataURI') {
	        type = 'url';
	      }
	      var url = '/image.search.html?cursor=' + cursor + '&image=' + type;
	      chrome.tabs.create({ url: url });
	      NooBox.Image.update(cursor, result);
	      analytics({
	        category: 'imageSearch',
	        action: action,
	        label: type
	      });
	    });
	  });
	};

	NooBox.Image.apiUrls = {
	  google: "https://www.google.com/searchbyimage?&image_url=",
	  baidu: "https://image.baidu.com/n/pc_search?queryImageUrl=",
	  tineye: "http://www.tineye.com/search/?url=",
	  bing: "http://www.bing.com/images/search?view=detailv2&iss=sbi&q=imgurl:",
	  yandex: "https://www.yandex.com/images/search?rpt=imageview&img_url=",
	  saucenao: "http://saucenao.com/search.php?db=999&url=",
	  iqdb: "http://iqdb.org/?url=",
	  sogou: "http://pic.sogou.com/ris?query="
	};

	NooBox.Image.fetchFunctions.google = function (cursor, result, data) {
	  try {
	    data = data.replace(/<img[^>]*>/g, "");
	    var page = $(data);
	    var keyword = page.find('._gUb').text();
	    var relatedWebsites = [];
	    var relatedWebsiteList = $(page.find('#rso').find('._NId')[0]).find('.rc') || [];
	    if (relatedWebsiteList.length == 0) {
	      relatedWebsiteList = $(page.find('#rso').find('.rgsep')[0]).prev().find('.rc') || [];
	    }
	    for (var i = 0; i < relatedWebsiteList.length; i++) {
	      var website = {
	        link: '',
	        title: '',
	        description: '',
	        searchEngine: 'google',
	        related: true
	      };
	      var temp = $(relatedWebsiteList[i]);
	      var _x = temp.find('a')[0] || {};
	      website.link = _x.href;
	      website.title = _x.innerText;
	      var y = temp.find('.s').find('.st')[0] || {};
	      website.description = y.innerHTML;
	      relatedWebsites.push(website);
	    }
	    var websites = [];
	    var websiteList = $(page.find('#rso').find('._NId')).last().find('.rc') || [];
	    if (websiteList.length == 0) {
	      websiteList = $(page.find('#rso').find('.rgsep')).last().prev().find('.rc') || [];
	    }
	    for (var _i = 0; _i < websiteList.length; _i++) {
	      var _website = {
	        link: '',
	        title: '',
	        description: '',
	        searchEngine: 'google',
	        related: false
	      };
	      var _temp = $(websiteList[_i]);
	      var _x2 = _temp.find('a')[0] || {};
	      _website.link = _x2.href;
	      _website.title = _x2.innerText;
	      var _y = _temp.find('.s').find('.st')[0] || {};
	      _website.description = _y.innerHTML;
	      var z = _temp.find('._lyb').find('a')[0] || {};
	      if (z.href) {
	        var start = z.href.indexOf("imgurl=") + 7;
	        var end = z.href.indexOf("&", start);
	        if (end == -1) _website.imageUrl = z.href.slice(start);else _website.imageUrl = z.href.slice(start, end);
	      }
	      if (_website.imageUrl) {
	        var cut = _website.imageUrl.indexOf('jpg%');
	        if (cut != -1) {
	          _website.imageUrl = _website.imageUrl.slice(0, cut + 3);
	        }
	        cut = _website.imageUrl.indexOf('png%');
	        if (cut != -1) {
	          _website.imageUrl = _website.imageUrl.slice(0, cut + 3);
	        }
	        cut = _website.imageUrl.indexOf('gif%');
	        if (cut != -1) {
	          _website.imageUrl = _website.imageUrl.slice(0, cut + 3);
	        }
	      }
	      websites.push(_website);
	    }
	    result.google.keyword = keyword;
	    result.google.relatedWebsites = relatedWebsites;
	    result.google.websites = websites;
	    result.google.result = 'done';
	    NooBox.Image.update(cursor, result);
	  } catch (e) {
	    console.log(e);
	    result.google.result = 'failed';
	    NooBox.Image.update(cursor, result);
	  }
	};

	NooBox.Image.fetchFunctions.baidu = function (cursor, result, data) {
	  try {
	    data = data.replace(/<img[^>]*>/g, "");
	    var page = $(data);
	    var keyword = page.find('.guess-info-word-link').text() || page.find('.guess-info-text-link').text();
	    var relatedWebsites = [];
	    var relatedWebsiteLinks = page.find('.guess-baike').find('.guess-baike-title').find('a');
	    var relatedWebsiteDescriptions = page.find('.guess-baike').find('.guess-baike-text') || [];
	    for (var i = 0; i < relatedWebsiteLinks.length; i++) {
	      var website = {};
	      website.link = relatedWebsiteLinks[i].href;
	      website.title = relatedWebsiteLinks[i].innerText;
	      website.description = relatedWebsiteDescriptions[i].innerHTML;
	      website.searchEngine = 'baidu';
	      website.related = true;
	      relatedWebsites.push(website);
	    }
	    relatedWebsiteLinks = page.find('.guess-newbaike').find('.guess-newbaike-text-title').find('a');
	    relatedWebsiteDescriptions = page.find('.guess-newbaike').find('.guess-newbaike-text-box') || [];
	    for (var _i2 = 0; _i2 < relatedWebsiteLinks.length; _i2++) {
	      var _website2 = {};
	      _website2.link = relatedWebsiteLinks[_i2].href;
	      _website2.title = relatedWebsiteLinks[_i2].innerText;
	      _website2.description = relatedWebsiteDescriptions[_i2].innerHTML;
	      _website2.searchEngine = 'baidu';
	      _website2.related = true;
	      relatedWebsites.push(_website2);
	    }
	    var websites = [];
	    var websiteList = page.find('.source-card-topic') || [];
	    for (var _i3 = 0; _i3 < websiteList.length; _i3++) {
	      var _website3 = {
	        searchEngine: 'baidu'
	      };
	      var temp = $(websiteList[_i3]);
	      var _x3 = temp.find('a')[0] || {};
	      _website3.link = _x3.href;
	      _website3.title = _x3.innerText;
	      var y = temp.find('.source-card-topic-content')[0] || {};
	      _website3.description = y.innerHTML;
	      var z = temp.find('.source-card-topic-same-image')[0];
	      if (z) {
	        var start = z.style.backgroundImage.indexOf('http');
	        var end = z.style.backgroundImage.indexOf('")');
	        _website3.imageUrl = z.style.backgroundImage.slice(start, end);
	        _website3.imageUrl = _website3.imageUrl.replace(/&amp;/g, '');
	      }
	      websites.push(_website3);
	    }
	    result.baidu.keyword = keyword;
	    result.baidu.relatedWebsites = relatedWebsites;
	    result.baidu.websites = websites;
	    result.baidu.result = 'done';
	    NooBox.Image.update(cursor, result);
	  } catch (e) {
	    console.log(e);
	    result.baidu.result = 'failed';
	    NooBox.Image.update(cursor, result);
	  }
	};

	NooBox.Image.fetchFunctions.tineye = function (cursor, result, data) {
	  data = data.replace(/<img[^>]*>/g, "");
	  try {
	    data = data.replace(/<img[^>]*>/g, "");
	    var page = $(data);
	    var websites = [];
	    var relatedWebsites = [];
	    var websiteList = $(page.find('.match')) || [];
	    for (var i = 0; i < websiteList.length; i++) {
	      var website = {
	        searchEngine: 'tineye',
	        related: true,
	        description: ''
	      };
	      var temp = $(websiteList[i]);
	      if (temp.find('.top-padding').length > 0) {
	        website.title = $(temp).find('h4')[0].title;
	        var _x4 = temp.find('.top-padding').find('a')[0] || {};
	        website.link = _x4.href;
	        relatedWebsites.push(website);
	      } else {
	        website.title = $(temp).find('h4')[0].title;
	        var _x5 = $(temp).find('p').find('a')[2] || {};
	        website.link = _x5.href;
	        website.description = _x5.href;
	        var y = $(temp).find('p').find('a')[1] || {};
	        website.imageUrl = y.href;
	        website.searchEngine = 'tineye';
	        websites.push(website);
	      }
	    }
	    result.tineye.websites = websites;
	    result.tineye.relatedWebsites = relatedWebsites;
	    result.tineye.result = 'done';
	    NooBox.Image.update(cursor, result);
	  } catch (e) {
	    result.tineye.result = 'failed';
	    NooBox.Image.update(cursor, result);
	    console.log(e);
	  }
	};

	NooBox.Image.fetchFunctions.bing = function (cursor, result, data) {
	  try {
	    data = data.replace(/<img[^>]*>/g, "");
	    var keyword = $(data).find('.query').text();
	    result.bing.keyword = keyword;
	    result.bing.result = 'done';
	    NooBox.Image.update(cursor, result);
	  } catch (e) {
	    result.bing.result = 'failed';
	    NooBox.Image.update(cursor, result);
	    console.log(e);
	  }
	};

	NooBox.Image.fetchFunctions.yandex = function (cursor, result, data) {
	  try {
	    data = data.replace(/<img[^>]*>/g, "");
	    var page = $(data);
	    var websites = [];
	    var websiteList = $(page.find('.other-sites__item')) || [];
	    for (var i = 0; i < websiteList.length; i++) {
	      var website = {};
	      var temp = $(websiteList[i]);
	      var _x6 = temp.find('.other-sites__snippet').find('a')[0] || {};
	      website.link = _x6.href;
	      website.title = _x6.innerText;
	      var y = temp.find('.other-sites__desc')[0] || {};
	      website.description = y.innerHTML;
	      var z = temp.find('.other-sites__preview-link')[0] || {};
	      website.imageUrl = z.href;
	      website.searchEngine = 'yandex';
	      websites.push(website);
	    }
	    result.yandex.websites = websites;
	    result.yandex.result = 'done';
	    NooBox.Image.update(cursor, result);
	  } catch (e) {
	    result.yandex.result = 'failed';
	    NooBox.Image.update(cursor, result);
	    console.log(e);
	  }
	};

	NooBox.Image.fetchFunctions.saucenao = function (cursor, result, data) {
	  try {
	    data = data.replace(/ src=/g, " nb-src=");
	    var page = $(data);
	    var websites = [];
	    var relatedWebsites = [];
	    var websiteList = $(page.find('.result')) || [];
	    for (var i = 0; i < websiteList.length; i++) {
	      var website = {
	        imageUrl: '',
	        searchEngine: 'saucenao',
	        related: true
	      };
	      var temp = $(websiteList[i]);
	      website.link = "";
	      website.title = "";
	      var y = temp.find('.resulttable')[0];
	      if (!y) {
	        break;
	      }
	      website.description = y.innerHTML.replace(/(nb-src="\/image|nb-src="image)/g, 'src="http://saucenao.com/image');
	      var z = temp.find('.resultimage').find('img')[0];
	      if (z) {
	        website.imageUrl = z.getAttribute('nb-src');
	      }
	      var rate = temp.find('.resultsimilarityinfo').text();
	      if (rate.replace('%', '') > 90) {
	        relatedWebsites.push(website);
	      } else {
	        websites.push(website);
	      }
	    }
	    result.saucenao.relatedWebsites = relatedWebsites;
	    result.saucenao.websites = websites;
	    result.saucenao.result = 'done';
	    NooBox.Image.update(cursor, result);
	  } catch (e) {
	    result.saucenao.result = 'failed';
	    NooBox.Image.update(cursor, result);
	    console.log(e);
	  }
	};

	NooBox.Image.fetchFunctions.iqdb = function (cursor, result, data) {
	  try {
	    data = data.replace(/ src=\'\/([^\/])/g, " nb-src='$1");
	    data = data.replace(/ src=\"\/\//g, ' nb1-src="');
	    data = data.replace(/ href=\"\/\//g, ' nb-href="');
	    var page = $(data);
	    var websites = [];
	    var websiteList = $(page.find('table')) || [];
	    for (var i = 1; i < websiteList.length - 2; i++) {
	      var description = '<table>' + websiteList[i].innerHTML.replace(/nb-src="/g, 'src="http://iqdb.org/') + '</table>';
	      description = description.replace(/nb1-src="/g, 'src="http://');
	      description = description.replace(/nb-href="/g, 'href="http://');
	      var website = {
	        link: "",
	        title: "",
	        imageUrl: "",
	        searchEngine: "iqdb",
	        description: description,
	        related: true
	      };
	      if (websiteList[i].innerHTML.indexOf("Best match") != -1) {
	        result.iqdb.relatedWebsites = [website];
	      } else {
	        websites.push(website);
	      }
	    }
	    result.iqdb.websites = [];
	    result.iqdb.result = 'done';
	    NooBox.Image.update(cursor, result);
	  } catch (e) {
	    result.iqdb.result = 'failed';
	    NooBox.Image.update(cursor, result);
	    console.log(e);
	  }
	};

	var x;

	NooBox.Image.fetchFunctions.sogou = function (cursor, result, data) {
	  try {
	    data = data.replace(/<img[^>]*>/g, "");
	    x = $(data);
	    var websites = [];
	    /*var page=$(data);
	    var websiteList=$(page.find('.other-sites__item'))||[];
	    for(var i=0;i<websiteList.length;i++){
	      var website={};
	      var temp=$(websiteList[i]);
	      var x=temp.find('.other-sites__snippet').find('a')[0]||{};
	      website.link=x.href;
	      website.title=x.innerText;
	      var y=temp.find('.other-sites__desc')[0]||{};
	      website.description=y.innerHTML;
	      var z=temp.find('.other-sites__preview-link')[0]||{};
	      website.imageUrl=z.href;
	      website.searchEngine='sogou';
	      websites.push(website);
	    }*/
	    result.sogou.websites = websites;
	    result.sogou.result = 'done';
	    NooBox.Image.update(cursor, result);
	  } catch (e) {
	    result.sogou.result = 'failed';
	    NooBox.Image.update(cursor, result);
	    console.log(e);
	  }
	};

	NooBox.Image.POST.general = function (cursor, result, engines, data, uploadedURL) {
	  if (uploadedURL) {
	    for (var i = 0; i < engines.length; i++) {
	      (function (engine) {
	        var url = NooBox.Image.apiUrls[engine] + result.uploadedURL;
	        result[engine].url = url;
	        $.ajax({ url: url }).done(NooBox.Image.fetchFunctions[engine].bind(null, cursor, result)).fail(function (e) {
	          result[engine].result = 'failed';
	          NooBox.Image.update(cursor, result);
	          console.log(e);
	        });
	      })(engines[i]);
	    }
	  } else {
	    NooBox.Image.POST.upload(cursor, result, data, NooBox.Image.POST.general.bind(null, cursor, result, engines, null));
	  }
	};

	NooBox.Image.POST.upload = function (cursor, result, data, callback) {
	  $.ajax({
	    type: 'POST',
	    url: 'https://ainoob.com/api/uploadImage/',
	    contentType: 'application/json',
	    data: JSON.stringify({
	      data: data
	    })
	  }).done(function (data) {
	    result.uploadedURL = 'https://ainoob.com/api/getImage/' + data;
	    callback(result.uploadedURL);
	  });
	};

	NooBox.Image.update = function (i, result) {
	  setDB('NooBox.Image.result_' + i, result, function () {
	    chrome.runtime.sendMessage({
	      job: 'image_result_update',
	      cursor: i
	    }, function (response) {});
	  });
	};

	NooBox.Image.extractImages = function (info, tab) {
	  try {
	    chrome.tabs.sendMessage(tab.id, {
	      job: "extractImages"
	    }, {
	      frameId: info.frameId
	    }, function (response) {
	      if (!response) {
	        chrome.notifications.create('extractImages', {
	          type: 'basic',
	          iconUrl: '/images/icon_128.png',
	          title: chrome.i18n.getMessage("extractImages"),
	          message: chrome.i18n.getMessage("ls_4")
	        }, voidFunc);
	      }
	    });
	  } catch (e) {
	    chrome.tabs.sendMessage(tab.id, {
	      job: "extractImages"
	    }, function (response) {
	      if (!response) {
	        chrome.notifications.create('extractImages', {
	          type: 'basic',
	          iconUrl: '/images/icon_128.png',
	          title: chrome.i18n.getMessage("extractImages"),
	          message: chrome.i18n.getMessage("ls_4")
	        }, voidFunc);
	      }
	    });
	  }
	};

	NooBox.Image.downloadExtractImages = function (sender, files) {
	  analytics({
	    category: 'downloadExtractImages',
	    action: 'run'
	  });
	  var zip = new JSZip();
	  var remains = files.length;
	  var total = files.length;
	  var i = 0;
	  var file = files[i];
	  var reader = new window.FileReader();
	  reader.onloadend = function () {
	    console.log(remains);
	    addImage(reader.result);
	  };
	  function addImage(dataURI) {
	    if (dataURI) {
	      var ext = (dataURI.slice(0, 20).match(/image\/(\w*)/) || ['', ''])[1];
	      var binary = convertDataURIToBinary(dataURI);
	      zip.file(file.name + '.' + ext, binary, {
	        base64: false
	      });
	    } else {
	      total--;
	    }
	    remains--;
	    chrome.tabs.sendMessage(sender.tab.id, {
	      job: 'downloadRemaining',
	      remains: remains,
	      total: total
	    }, function () {});
	    if (remains == 0) {
	      zip.generateAsync({
	        type: 'blob'
	      }).then(function (content) {
	        saveAs(content, 'NooBox.zip');
	      });
	    } else {
	      file = files[++i];
	      if (file.url.slice(0, 4) == 'data') {
	        addImage(file.url);
	      } else {
	        fetchBlob(file.url, function (blob) {
	          if (blob) {
	            reader.readAsDataURL(blob);
	          } else {
	            addImage();
	          }
	        });
	      }
	    }
	  }
	  if (file.url.slice(0, 4) == 'data') {
	    addImage(file.url);
	  } else {
	    fetchBlob(file.url, function (blob) {
	      if (blob) {
	        reader.readAsDataURL(blob);
	      } else {
	        addImage();
	      }
	    });
	  }
	};

	NooBox.Image.screenshotSearch = function (info, tab) {
	  chrome.tabs.sendMessage(tab.id, 'loaded', function (response) {
	    if (response == 'yes') {
	      chrome.tabs.captureVisibleTab(tab.windowId, function (dataURL) {
	        chrome.tabs.sendMessage(tab.id, {
	          job: "screenshotSearch",
	          data: dataURL
	        });
	      });
	    } else {
	      chrome.tabs.captureVisibleTab(tab.windowId, function (dataURL) {
	        chrome.tabs.executeScript(tab.id, { file: 'thirdParty/jquery.min.js' }, function () {
	          if (chrome.runtime.lastError) {
	            chrome.notifications.create('screenshotFailed', {
	              type: 'basic',
	              iconUrl: '/images/icon_128.png',
	              title: GL("ls_1"),
	              message: GL("ls_2")
	            }, voidFunc);
	            return;
	          }
	          chrome.tabs.executeScript(tab.id, { file: 'js/screenshotSearch.js' }, function () {
	            chrome.tabs.sendMessage(tab.id, {
	              job: "screenshotSearch",
	              data: dataURL
	            });
	          });
	        });
	      });
	    }
	  });
	};

	NooBox.History.recordImageSearch = function (cursor, info) {
	  get('totalImageSearch', function (data) {
	    data = data || 0;
	    set('totalImageSearch', parseInt(data) + 1);
	  });
	  isOn('history', function () {
	    getDB('history_records', function (records) {
	      records = records || [];
	      var source = info.srcUrl || info;
	      records.push({
	        date: new Date().getTime(),
	        event: 'search',
	        cursor: cursor,
	        info: source
	      });
	      setDB('history_records', records);
	    });
	  });
	};

	NooBox.init = function () {
	  window.NooBox = NooBox;
	  NooBox.Options.init(0);
	  NooBox.Image.init();
	  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	    if ('job' in request) {
	      if (request.job == 'imageSearch_upload' || request.job == 'imageSearch_reSearch') {
	        if (request.job == 'imageSearch_reSerach') {
	          analytics({
	            category: 'uploadReSearch',
	            action: 'run'
	          });
	        }
	        NooBox.Image.imageSearch(request.data);
	      } else if (request.job == 'imageSearch' || request.job == 'extractImages' || request.job == 'screenshotSearch') {
	        NooBox.Image.updateContextMenu();
	      } else if (request.job == 'analytics') {
	        analytics(request);
	      } else if (request.job == 'uploadImage') {
	        console.log('uploadImage');
	        NooBox.Image.imageFileSelector.click();
	      } else if (request.job == 'passToFront') {
	        chrome.tabs.query({
	          active: true,
	          currentWindow: true
	        }, function (tabs) {
	          chrome.tabs.sendMessage(tabs[0].id, request.message, function () {});
	        });
	      } else if (request.job == 'notImage') {
	        chrome.NooBox.Notifications.notImage;
	      } else if (request.job == 'getDB') {
	        getDB(request.key, function (data) {
	          chrome.tabs.sendMessage(sender.tab.id, {
	            job: 'returnDB',
	            key: request.key,
	            data: data
	          });
	        });
	      } else if (request.job == 'urlDownloadZip') {
	        NooBox.Image.downloadExtractImages(sender, request.files);
	      } else if (request.job == 'videoControl_website_switch') {
	        var action = 'enable';
	        if (request.enable) {
	          action = 'disable';
	        }
	        analytics({
	          category: 'videoControlWebsiteSwitch',
	          action: action,
	          label: ''
	        });
	        chrome.tabs.query({}, function (tabs) {
	          for (var i = 0; i < tabs.length; i++) {
	            if (tabs[i].url.indexOf(request.host)) {
	              chrome.tabs.sendMessage(tabs[i].id, {
	                job: 'videoConrolContentScriptSwitch',
	                enabled: request.enabled
	              }, function () {});
	            }
	          }
	        });
	      } else if (request.job == 'videoControl_use') {
	        var time = new Date().getTime();
	        if (NooBox.temp.lastVideoControl + 10 * 60 * 1000 < time) {
	          NooBox.temp.lastVideoControl = time;
	          analytics({
	            category: 'videoControl',
	            action: 'run',
	            label: ''
	          });
	          get('userId', function (userId) {
	            get('version', function (version) {
	              var hi = {
	                userId: userId,
	                url: 'videoControl',
	                title: document.title,
	                time: new Date().toLocaleString(),
	                version: version
	              };
	              $.ajax({
	                type: 'POST',
	                url: "https://ainoob.com/api/noobox/user/",
	                contentType: "application/json",
	                data: JSON.stringify(hi)
	              });
	            });
	          });
	        }
	      }
	    }
	  });
	};

	document.addEventListener('DOMContentLoaded', NooBox.init);

/***/ })
/******/ ]);