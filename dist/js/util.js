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

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	window.shared = {};

	window.timeagoInstance = null;

	window.isZh = false;

	chrome.i18n.getAcceptLanguages(function (data) {
	  if (data.indexOf('zh') != -1) {
	    isZh = true;
	    try {
	      if (chrome.i18n.getUILanguage().indexOf('zh') == -1) {
	        isZh = false;
	      }
	    } catch (e) {}
	  }
	});

	window.initTimeago = function () {
	  if (isZh) {
	    timeago.register('locale', function (number, index) {
	      return [['刚刚', '片刻后'], ['%s秒前', '%s秒后'], ['1分钟前', '1分钟后'], ['%s分钟前', '%s分钟后'], ['1小时前', '1小时后'], ['%s小时前', '%s小时后'], ['1天前', '1天后'], ['%s天前', '%s天后'], ['1周前', '1周后'], ['%s周前', '%s周后'], ['1月前', '1月后'], ['%s月前', '%s月后'], ['1年前', '1年后'], ['%s年前', '%s年后']][index];
	    });
	  }
	  timeagoInstance = new timeago();
	};

	//Sorting strings without case sensitivity
	window.compare = function (a, b) {
	  var cursor = 0;
	  var lenA = a.length;
	  var lenB = b.length;
	  var aa = a.toLowerCase();
	  var bb = b.toLowerCase();
	  var tempA = void 0,
	      tempB = void 0;
	  while (lenA > cursor && lenB > cursor) {
	    tempA = aa.charCodeAt(cursor);
	    tempB = bb.charCodeAt(cursor);
	    if (tempA == tempB) {
	      cursor++;
	      continue;
	    } else {
	      return tempA - tempB;
	    }
	  }
	  return lenA - lenB;
	};

	window.getLocale = function (string) {
	  return chrome.i18n.getMessage(string);
	};

	window.GL = getLocale;

	window.getChromeVersion = function () {
	  var match = window.navigator.userAgent.match(/Chrom(?:e|ium)\/([0-9\.]+)/);
	  return match ? match[1] : null;
	};

	//get xxx.com
	window.extractDomain = function (url) {
	  if (!url) {
	    return 'error';
	  }
	  var domain = void 0;
	  if (url.indexOf("://") > -1) {
	    domain = url.split('/')[2];
	  } else {
	    domain = url.split('/')[0];
	  }
	  domain = domain.split(':')[0];
	  var list = domain.split('.');
	  return list[list.length - 2] + '.' + list[list.length - 1];
	};

	window.capFirst = function (elem) {
	  var str = getString(elem);
	  return str.charAt(0).toUpperCase() + str.slice(1);
	};

	window.getString = function (elem) {
	  if (elem === undefined || elem === null) {
	    return '';
	  } else {
	    return elem.toString();
	  }
	};

	window.getParameterByName = function (name, url) {
	  if (!url) {
	    url = window.location.href;
	  }
	  name = name.replace(/[\[\]]/g, "\\$&");
	  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	      results = regex.exec(url);
	  if (!results) return null;
	  if (!results[2]) return '';
	  return decodeURIComponent(results[2].replace(/\+/g, " "));
	};

	window.dataUrlFromUrl = function (link, callback) {
	  var img = new Image();
	  img.addEventListener('load', function () {
	    var canvas = document.createElement("canvas");
	    canvas.width = img.width;
	    canvas.height = img.height;
	    var ctx = canvas.getContext('2d');
	    ctx.drawImage(img, 0, 0, img.width, img.height);
	    var dataUrl = canvas.toDataURL();
	    callback(dataUrl);
	  });
	  img.src = link;
	};

	window.isOn = function (key, callbackTrue, callbackFalse, param) {
	  get(key, function (value) {
	    if (value == '1' || value == true) {
	      if (callbackTrue) {
	        callbackTrue(param);
	      }
	    } else {
	      if (callbackFalse) {
	        callbackFalse(param);
	      }
	    }
	  });
	};

	window.setIfNull = function (key, setValue, callback) {
	  get(key, function (value) {
	    if (value == undefined || value == null) {
	      set(key, setValue, callback);
	    } else {
	      if (callback) {
	        callback();
	      }
	    }
	  });
	};

	window.setDB = function (key, value, callback) {
	  var indexedDB = window.indexedDB;
	  var open = indexedDB.open("NooBox", 1);
	  open.onupgradeneeded = function () {
	    var db = open.result;
	    var store = db.createObjectStore("Store", {
	      keyPath: "key"
	    });
	  };
	  open.onsuccess = function () {
	    var db = open.result;
	    var tx = db.transaction("Store", "readwrite");
	    var store = tx.objectStore("Store");
	    var action1 = store.put({
	      key: key,
	      value: value
	    });
	    action1.onsuccess = function () {
	      if (callback) {
	        callback();
	      }
	    };
	    action1.onerror = function () {
	      console.log('setDB fail');
	    };
	  };
	};

	window.getDB = function (key, callback) {
	  if (callback) {
	    var indexedDB = window.indexedDB;
	    var open = indexedDB.open("NooBox", 1);
	    open.onupgradeneeded = function () {
	      var db = open.result;
	      var store = db.createObjectStore("Store", {
	        keyPath: "key"
	      });
	    };
	    open.onsuccess = function () {
	      var db = open.result;
	      var tx = db.transaction("Store", "readwrite");
	      var store = tx.objectStore("Store");
	      var action1 = store.get(key);
	      action1.onsuccess = function (e) {
	        if (e.target.result) {
	          callback(e.target.result.value);
	        } else {
	          callback(null);
	        }
	      };
	      action1.onerror = function () {
	        console.log('getDB fail');
	      };
	    };
	  }
	};

	window.deleteDB = function (key, callback) {
	  var indexedDB = window.indexedDB;
	  var open = indexedDB.open("NooBox", 1);
	  open.onupgradeneeded = function () {
	    var db = open.result;
	    var store = db.createObjectStore("Store", {
	      keyPath: "key"
	    });
	  };
	  open.onsuccess = function () {
	    var db = open.result;
	    var tx = db.transaction("Store", "readwrite");
	    var store = tx.objectStore("Store");
	    var action1 = store.delete(key);
	    action1.onsuccess = function (e) {
	      if (callback) {
	        callback(true);
	      }
	    };
	    action1.onerror = function () {
	      console.log('deleteDB fail');
	      if (callback) {
	        callback(false);
	      }
	    };
	  };
	};
	window.set = function (key, value, callback) {
	  var temp = {};
	  temp[key] = value;
	  chrome.storage.sync.set(temp, callback);
	};

	window.get = function (key, callback) {
	  chrome.storage.sync.get(key, function (result) {
	    if (callback) {
	      callback(result[key]);
	    }
	  });
	};

	window.getImageSearchEngines = function (list, callback, i, result, shared) {
	  if (i == null) {
	    i = -1;
	    shared = [];
	  } else {
	    if (result) {
	      shared.push(list[i]);
	    }
	    if (i == list.length - 1) {
	      callback(shared);
	    }
	  }
	  if (i < list.length - 1) {
	    isOn("imageSearchUrl_" + list[i + 1], getImageSearchEngines.bind(null, list, callback, i + 1, true, shared), getImageSearchEngines.bind(null, list, callback, i + 1, false, shared));
	  }
	};

	window.dataURItoBlob = function (dataURI) {
	  try {
	    var _byteString = atob(dataURI.split(',')[1]);
	  } catch (e) {
	    console.log(e);
	  }
	  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	  var ab = new ArrayBuffer(byteString.length);
	  var ia = new Uint8Array(ab);
	  for (var i = 0; i < byteString.length; i++) {
	    ia[i] = byteString.charCodeAt(i);
	  }
	  var blob = new Blob([ab], {
	    type: mimeString
	  });
	  return blob;
	};

	window.loadIframe = function (url, callback) {
	  $(function () {
	    var ifr = $('<iframe/>', {
	      id: 'baiduIframe',
	      src: url,
	      style: 'display:none'
	    });
	    $('#baiduIframe').on('load', callback);
	    $('body').append(ifr);
	  });
	};
	var BASE64_MARKER = ';base64,';

	window.convertDataURIToBinary = function (dataURI) {
	  try {
	    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
	    var base64 = dataURI.substring(base64Index);
	    var raw = window.atob(base64);
	    var rawLength = raw.length;
	    var _array = new Uint8Array(new ArrayBuffer(rawLength));
	    for (var i = 0; i < rawLength; i++) {
	      _array[i] = raw.charCodeAt(i);
	    }
	    return _array;
	  } catch (e) {
	    try {
	      dataURI = dataURI.replace(/%2/g, '/');
	      var _base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
	      var _base = dataURI.substring(_base64Index);
	      var _raw = window.atob(_base);
	      var _rawLength = _raw.length;
	      var array2 = new Uint8Array(new ArrayBuffer(_rawLength));
	      for (var j = 0; j < _rawLength; j++) {
	        array2[j] = _raw.charCodeAt(j);
	      }
	      return array2;
	    } catch (e) {
	      return;
	    }
	    console.log(e);
	    return array;
	  }
	};

	window.voidFunc = function () {};

	window.fetchBlob = function (uri, callback) {
	  var xhr = new XMLHttpRequest();
	  xhr.open('GET', uri, true);
	  xhr.responseType = 'blob';

	  xhr.onload = function (e) {
	    if (xhr.readyState == 4) {
	      if (this.status == 200) {
	        var blob = new Blob([this.response], {
	          type: 'image/png'
	        });;
	        if (callback) {
	          callback(blob);
	        }
	      } else {
	        console.log('error! yay');
	        callback();
	      }
	    }
	  };
	  xhr.onerror = function () {
	    console.log('error! yay');
	    callback();
	  };
	  xhr.send();
	};

	window.bello = {
	  pageview: function pageview(version) {
	    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) != 'object') return;
	    var data = {
	      type: 'pageview',
	      path: version,
	      title: 'background',
	      referrer: '',
	      ua: navigator.userAgent,
	      sr: screen.width + 'x' + screen.height,
	      ul: navigator.language || navigator.userLanguage,
	      ainoob: Math.random()
	    };
	    this.ajax('https://ainoob.com/bello/noobox' + this.serialize(data));
	  },
	  event: function event(obj) {
	    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) != 'object') return;
	    var data = {
	      type: 'event',
	      category: obj.category,
	      action: obj.action,
	      label: obj.label,
	      value: obj.value || 0,
	      ainoob: Math.random(),
	      ua: navigator.userAgent,
	      sr: screen.width + 'x' + screen.height,
	      path: '0.9.3.8',
	      ul: navigator.language || navigator.userLanguage
	    };
	    this.ajax('https://ainoob.com/bello/noobox' + this.serialize(data));
	  },
	  serialize: function serialize(obj) {
	    return '?' + Object.keys(obj).reduce(function (a, k) {
	      a.push(k + '=' + encodeURIComponent(obj[k]));return a;
	    }, []).join('&');
	  },
	  ajax: function ajax(url) {
	    var request = new XMLHttpRequest();
	    request.open('GET', url, true);
	    request.onload = function () {
	      if (request.status >= 200 && request.status < 400) {
	        console.log(request.responseText);
	      }
	    };
	    request.send();
	  }
	};

/***/ })
/******/ ]);