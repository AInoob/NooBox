//Using object as a class to wrap different sections and functions
const NooBox = {};
let analyticsOnce = false;
const analyticsLastList = {};
// I don't know why this works, anyway, will keep it in this form for a while
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-77112662-5']);

(() => {
  const ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();

function analytics(request) {
	console.log(_gaq);
	console.log(request);
  if (!analyticsOnce) {
    _gaq.push(['_trackPageview', 'background']);
    analyticsOnce = true;
  }
  const time = new Date().getTime();
  if (!analyticsLastList[request.category] || analyticsLastList[request.category] + 500 < time) {
    analyticsLastList[request.category] = time;
  }
  _gaq.push(['_trackEvent', request.category, request.action, request.label]);
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
//record the search history
NooBox.History.recordImageSearch = null;

NooBox.Notifications.notImage = () => {
	chrome.notifications.create({
		type:'basic',
		iconUrl: '/images/icon_128.png',
		title: GL('reverse_image_search'),
		message: GL('ls_0')
	});
}




//The implementation of functions and variables
NooBox.Options.defaultValues = [
  ['userId', (Math.random().toString(36) + '00000000000000000').slice(2, 19)],
  ['imageSearch', true],
  ['shorcut', false],
  ['unitsConverter', false],
  ['crypter', true],
  ['webmaster', true],
  ['general', true],
  ['background', false],
  ['imageSearchUrl_google', true],
  ['imageSearchUrl_baidu', true],
  ['imageSearchUrl_tineye', true],
  ['imageSearchUrl_bing', true],
  ['imageSearchUrl_yandex', true],
  ['imageSearchUrl_saucenao', true],
  ['imageSearchUrl_iqdb', true],
  ['imageSearchUrl_sogou', true],
  ['extractImages', true],
  ['screenshotSearch', true],
  ['videoControl', false],
  ['displayOrder', []],
  ['checkUpdate', true],
  ['lastUpdateCheck', 0],
  ['updateHistory', []],
  ['history', true]
];

NooBox.Options.constantValues = [
  ['displayList', ['imageSearch', 'videoControl', 'checkUpdate']],
  ['version', '0.9.0.2']
];

NooBox.Options.init = (i) => {
  const constantValues = NooBox.Options.constantValues;
  if (i < constantValues.length) {
    set(constantValues[i][0], constantValues[i][1]);
  }
  const defaultValues = NooBox.Options.defaultValues;
  if (i < defaultValues.length) {
    setIfNull(defaultValues[i][0], defaultValues[i][1], NooBox.Options.init.bind(null, i + 1));
  } else {
    NooBox.Image.updateContextMenu();
  }
}

NooBox.Image.init = () => {
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
}

NooBox.Image.updateContextMenu = () => {
  isOn('imageSearch',
    () => {
      if (!NooBox.Image.handles.imageSearch) {
        NooBox.Image.handles.imageSearch = chrome.contextMenus.create({
          "title": GL("search_this_image"),
          "contexts": ["image"],
          "onclick": NooBox.Image.imageSearch
        });
      }
    },
    () => {
      if (NooBox.Image.handles.imageSearch) {
        chrome.contextMenus.remove(NooBox.Image.handles.imageSearch);
        NooBox.Image.handles.imageSearch = null;
      }
    }
  );
  isOn('extractImages',
    () => {
      if (!NooBox.Image.handles.extractImages) {
        NooBox.Image.handles.extractImages = chrome.contextMenus.create({
          "id": "extractImages",
          "title": GL("extract_images"),
          "contexts": ["all"],
          "onclick": NooBox.Image.extractImages
        });
      }
    },
    () => {
      if (NooBox.Image.handles.extractImages) {
        chrome.contextMenus.remove(NooBox.Image.handles.extractImages);
        NooBox.Image.handles.extractImages = null;
      }
    }
  );
  isOn('screenshotSearch',
    () => {
      if (!NooBox.Image.handles.screenshotSearch) {
        NooBox.Image.handles.screenshotSearch = chrome.contextMenus.create({
          "id": "screenshotSearch",
          "title": GL("screenshot_search"),
          "contexts": ["all"],
          "onclick": NooBox.Image.screenshotSearch
        });
      }
    },
    () => {
      if (NooBox.Image.handles.screenshotSearch) {
        chrome.contextMenus.remove(NooBox.Image.handles.screenshotSearch);
        NooBox.Image.handles.screenshotSearch = null;
      }
    }
  );
}

NooBox.Image.imageSearch = (info) => {
  const source = info.srcUrl || info;
  getDB('imageCursor', (cursor) => {
    if (typeof(cursor) === 'number') {
      cursor++;
    } else {
      cursor = 0;
    }
    setDB('imageCursor', cursor);
    NooBox.History.recordImageSearch(cursor, info);
    getImageSearchEngines(NooBox.Image.engines, (engines) => {
      let action = 'dataURI';
      const result = {
        engines: engines
      };
      for (let j = 0; j < engines.length; j++) {
        result[engines[j]] = {
          result: 'loading'
        };
      }
      const dataURI = encodeURI(source);
      //if it is dataURI, using NooBox.Image.POST to upload the image and search
      if (dataURI.match(/^data/)) {
        result.imageUrl = 'dataURI';
        result.dataURI = dataURI;
        NooBox.Image.POST.general(cursor, result, engines, result.dataURI);
      } else {
        action = 'url';
        result.imageUrl = source;
        for (let i = 0; i < engines.length; i++) {
          ((cursor, engine) => {
            const url2 = NooBox.Image.apiUrls[engine] + source;
            result[engine].url = url2;
            $.ajax({
              url: url2
            }).done((data) => {
              NooBox.Image.fetchFunctions[engine](cursor, result, data);
            }).fail((e) => {
              result[engine].result = 'failed';
              NooBox.Image.update(cursor, result);
              console.log(e);
            });
          })(cursor, engines[i]);
        }
      }
      let type = result.imageUrl;
      if (type != 'dataURI') {
        type = 'url';
      }
      const url = '/image.search.html?cursor=' + cursor + '&image=' + type;
      chrome.tabs.create({ url });
      NooBox.Image.update(cursor, result);
      analytics({
        category: 'imageSearch',
        action: action,
        label: type
      });
    });
  });
}

NooBox.Image.apiUrls = {
  google:   "https://www.google.com/searchbyimage?&image_url=",
  baidu:    "https://image.baidu.com/n/pc_search?queryImageUrl=",
  tineye:   "http://www.tineye.com/search/?url=",
  bing:     "http://www.bing.com/images/search?view=detailv2&iss=sbi&q=imgurl:",
  yandex:   "https://www.yandex.com/images/search?rpt=imageview&img_url=",
  saucenao: "http://saucenao.com/search.php?db=999&url=",
  iqdb:     "http://iqdb.org/?url=",
  sogou:    "http://pic.sogou.com/ris?query=",
};

NooBox.Image.fetchFunctions.google = (cursor, result, data) => {
  try {
    data = data.replace(/<img[^>]*>/g, "");
    const page = $(data);
    const keyword = page.find('._gUb').text();
    const relatedWebsites = [];
    let relatedWebsiteList = $(page.find('#rso').find('._NId')[0]).find('.rc') || [];
    if (relatedWebsiteList.length == 0) {
      relatedWebsiteList = $(page.find('#rso').find('.rgsep')[0]).prev().find('.rc') || [];
    }
    for (let i = 0; i < relatedWebsiteList.length; i++) {
      const website = {
        link: '',
        title: '',
        description: '',
        searchEngine: 'google',
        related: true
      };
      const temp = $(relatedWebsiteList[i]);
      const x = temp.find('a')[0] || {};
      website.link = x.href;
      website.title = x.innerText;
      const y = temp.find('.s').find('.st')[0] || {};
      website.description = y.innerHTML;
      relatedWebsites.push(website);
    }
    const websites = [];
    let websiteList = $(page.find('#rso').find('._NId')).last().find('.rc') || [];
    if (websiteList.length == 0) {
      websiteList = $(page.find('#rso').find('.rgsep')).last().prev().find('.rc') || [];
    }
    for (let i = 0; i < websiteList.length; i++) {
      const website = {
        link: '',
        title: '',
        description: '',
        searchEngine: 'google',
        related: false
      };
      const temp = $(websiteList[i]);
      const x = temp.find('a')[0] || {};
      website.link = x.href;
      website.title = x.innerText;
      const y = temp.find('.s').find('.st')[0] || {};
      website.description = y.innerHTML;
      const z = temp.find('._lyb').find('a')[0] || {};
      if (z.href) {
        const start = z.href.indexOf("imgurl=") + 7;
        const end = z.href.indexOf("&", start);
        if (end == -1)
          website.imageUrl = z.href.slice(start);
        else
          website.imageUrl = z.href.slice(start, end);
      }
      if (website.imageUrl) {
        let cut = website.imageUrl.indexOf('jpg%');
        if (cut != -1) {
          website.imageUrl = website.imageUrl.slice(0, cut + 3);
        }
        cut = website.imageUrl.indexOf('png%');
        if (cut != -1) {
          website.imageUrl = website.imageUrl.slice(0, cut + 3);
        }
        cut = website.imageUrl.indexOf('gif%');
        if (cut != -1) {
          website.imageUrl = website.imageUrl.slice(0, cut + 3);
        }
      }
      websites.push(website);
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

NooBox.Image.fetchFunctions.baidu = (cursor, result, data) => {
  try {
    data = data.replace(/<img[^>]*>/g, "");
    const page = $(data);
    const keyword = page.find('.guess-info-word-link').text() || page.find('.guess-info-text-link').text();
    const relatedWebsites = [];
    let relatedWebsiteLinks = page.find('.guess-baike').find('.guess-baike-title').find('a');
    let relatedWebsiteDescriptions = page.find('.guess-baike').find('.guess-baike-text') || [];
    for (let i = 0; i < relatedWebsiteLinks.length; i++) {
      const website = {};
      website.link = relatedWebsiteLinks[i].href;
      website.title = relatedWebsiteLinks[i].innerText;
      website.description = relatedWebsiteDescriptions[i].innerHTML;
      website.searchEngine = 'baidu';
      website.related = true;
      relatedWebsites.push(website);
    }
    relatedWebsiteLinks = page.find('.guess-newbaike').find('.guess-newbaike-text-title').find('a');
    relatedWebsiteDescriptions = page.find('.guess-newbaike').find('.guess-newbaike-text-box') || [];
    for (let i = 0; i < relatedWebsiteLinks.length; i++) {
      let website = {};
      website.link = relatedWebsiteLinks[i].href;
      website.title = relatedWebsiteLinks[i].innerText;
      website.description = relatedWebsiteDescriptions[i].innerHTML;
      website.searchEngine = 'baidu';
      website.related = true;
      relatedWebsites.push(website);
    }
    const websites = [];
    const websiteList = page.find('.source-card-topic') || [];
    for (let i = 0; i < websiteList.length; i++) {
      const website = {
        searchEngine: 'baidu'
      };
      const temp = $(websiteList[i]);
      const x = temp.find('a')[0] || {};
      website.link = x.href;
      website.title = x.innerText;
      const y = temp.find('.source-card-topic-content')[0] || {};
      website.description = y.innerHTML;
      const z = temp.find('.source-card-topic-same-image')[0];
      if (z) {
        const start = z.style.backgroundImage.indexOf('http');
        const end = z.style.backgroundImage.indexOf('")');
        website.imageUrl = z.style.backgroundImage.slice(start, end);
        website.imageUrl = website.imageUrl.replace(/&amp;/g, '');
      }
      websites.push(website);
    }
    result.baidu.keyword = keyword;
    result.baidu.relatedWebsites = relatedWebsites;
    result.baidu.websites = websites;
    result.baidu.result = 'done';
    NooBox.Image.update(cursor, result);
  } catch (e) {
    console.log(e);
    result.baidu.result = 'failed'
    NooBox.Image.update(cursor, result);
  }
};

NooBox.Image.fetchFunctions.tineye = (cursor, result, data) => {
  data = data.replace(/<img[^>]*>/g, "");
  try {
    data = data.replace(/<img[^>]*>/g, "");
    const page = $(data);
    const websites = [];
    const relatedWebsites = [];
    const websiteList = $(page.find('.match')) || [];
    for (let i = 0; i < websiteList.length; i++) {
      const website = {
        searchEngine: 'tineye',
        related: true,
        description: ''
      };
      const temp = $(websiteList[i]);
      if (temp.find('.top-padding').length > 0) {
        website.title = $(temp).find('h4')[0].title;
        const x = temp.find('.top-padding').find('a')[0] || {};
        website.link = x.href;
        relatedWebsites.push(website);
      } else {
        website.title = $(temp).find('h4')[0].title;
        const x = $(temp).find('p').find('a')[2] || {};
        website.link = x.href;
        website.description = x.href;
        const y = $(temp).find('p').find('a')[1] || {};
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

NooBox.Image.fetchFunctions.bing = (cursor, result, data) => {
  try {
    data = data.replace(/<img[^>]*>/g, "");
    const keyword = $(data).find('.query').text();
    result.bing.keyword = keyword;
    result.bing.result = 'done';
    NooBox.Image.update(cursor, result);
  } catch (e) {
    result.bing.result = 'failed';
    NooBox.Image.update(cursor, result);
    console.log(e);
  }
};

NooBox.Image.fetchFunctions.yandex = (cursor, result, data) => {
  try {
    data = data.replace(/<img[^>]*>/g, "");
    const page = $(data);
    const websites = [];
    const websiteList = $(page.find('.other-sites__item')) || [];
    for (let i = 0; i < websiteList.length; i++) {
      const website = {};
      const temp = $(websiteList[i]);
      const x = temp.find('.other-sites__snippet').find('a')[0] || {};
      website.link = x.href;
      website.title = x.innerText;
      const y = temp.find('.other-sites__desc')[0] || {};
      website.description = y.innerHTML;
      const z = temp.find('.other-sites__preview-link')[0] || {};
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

NooBox.Image.fetchFunctions.saucenao = (cursor, result, data) => {
  try {
    data = data.replace(/ src=/g, " nb-src=");
    const page = $(data);
    const websites = [];
    const relatedWebsites = [];
    const websiteList = $(page.find('.result')) || [];
    for (let i = 0; i < websiteList.length; i++) {
      const website = {
        imageUrl: '',
        searchEngine: 'saucenao',
        related: true
      };
      const temp = $(websiteList[i]);
      website.link = "";
      website.title = "";
      const y = temp.find('.resulttable')[0];
      if (!y) {
        break;
      }
      website.description = y.innerHTML.replace(/(nb-src="\/image|nb-src="image)/g, 'src="http://saucenao.com/image');
      const z = temp.find('.resultimage').find('img')[0];
      if (z) {
        website.imageUrl = z.getAttribute('nb-src');
      }
      const rate = temp.find('.resultsimilarityinfo').text();
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

NooBox.Image.fetchFunctions.iqdb = (cursor, result, data) => {
  try {
    data = data.replace(/ src=\'\/([^\/])/g, " nb-src='$1");
    data = data.replace(/ src=\"\/\//g, ' nb1-src="');
    data = data.replace(/ href=\"\/\//g, ' nb-href="');
    const page = $(data);
    const websites = [];
    const websiteList = $(page.find('table')) || [];
    for (let i = 1; i < websiteList.length - 2; i++) {
      let description = '<table>' + websiteList[i].innerHTML.replace(/nb-src="/g, 'src="http://iqdb.org/') + '</table>';
      description = description.replace(/nb1-src="/g, 'src="http://');
      description = description.replace(/nb-href="/g, 'href="http://');
      const website = {
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

NooBox.Image.fetchFunctions.sogou = (cursor, result, data) => {
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

NooBox.Image.POST.general = (cursor, result, engines, data, uploadedURL) => {
  if (uploadedURL) {
    for (let i = 0; i < engines.length; i++) {
      ((engine) => {
        const url = NooBox.Image.apiUrls[engine] + result.uploadedURL;
        result[engine].url = url;
        $.ajax({ url }).done(
          NooBox.Image.fetchFunctions[engine].bind(null, cursor, result)
        ).fail((e) => {
          result[engine].result = 'failed';
          NooBox.Image.update(cursor, result);
          console.log(e);
        });
      })(engines[i])
    }
  } else {
    NooBox.Image.POST.upload(cursor, result, data, NooBox.Image.POST.general.bind(null, cursor, result, engines, null));
  }
}

NooBox.Image.POST.upload = (cursor, result, data, callback) => {
  $.ajax({
    type: 'POST',
    url: 'https://ainoob.com/api/uploadImage/',
    contentType: 'application/json',
    data: JSON.stringify({
      data: data
    })
  }).done((data) => {
    result.uploadedURL = 'https://ainoob.com/api/getImage/' + data;
    callback(result.uploadedURL);
  });
}

NooBox.Image.update = (i, result) => {
  setDB('NooBox.Image.result_' + i,
    result,
    () => {
      chrome.runtime.sendMessage({
        job: 'image_result_update',
        cursor: i
      }, (response) => {});
    }
  );
}


NooBox.Image.extractImages = (info, tab) => {
  try {
    chrome.tabs.sendMessage(tab.id, {
      job: "extractImages"
    }, {
      frameId: info.frameId
    }, (response) => {
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
    }, (response) => {
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
}

NooBox.Image.screenshotSearch = (info, tab) => {
  chrome.tabs.sendMessage(tab.id, 'loaded', (response) => {
    if (response == 'yes') {
      chrome.tabs.captureVisibleTab(tab.windowId, (dataURL) => {
        chrome.tabs.sendMessage(tab.id, {
          job: "screenshotSearch",
          data: dataURL
        });
      });
    } else {
      chrome.tabs.captureVisibleTab(tab.windowId, (dataURL) => {
        chrome.tabs.executeScript(tab.id, { file: 'thirdParty/jquery.min.js' }, () => {
          if (chrome.runtime.lastError) {
            chrome.notifications.create('screenshotFailed', {
              type: 'basic',
              iconUrl: '/images/icon_128.png',
              title: GL("ls_1"),
              message: GL("ls_2")
            }, voidFunc);
            return;
          }
          chrome.tabs.executeScript(tab.id, { file: 'js/screenshotSearch.js' }, () => {
            chrome.tabs.sendMessage(tab.id, {
              job: "screenshotSearch",
              data: dataURL
            });
          });
        });
      });
    }
  });
}

NooBox.History.recordImageSearch = (cursor, info) => {
  get('totalImageSearch', (data) => {
    data = data || 0;
    set('totalImageSearch', parseInt(data) + 1);
  });
  isOn('history', () => {
    getDB('history_records', (records) => {
      records = records || [];
      const source = info.srcUrl || info;
      records.push({
        date: new Date().getTime(),
        event: 'search',
        cursor,
        info: source
      });
      setDB('history_records', records);
    });
  });
}

NooBox.init = () => {
	window.NooBox = NooBox;
  NooBox.Options.init(0);
  NooBox.Image.init();
  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
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
          }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, request.message, () => {});
          });
        } else if(request.job == 'notImage') {
					chrome.NooBox.Notifications.notImage;
				} else if (request.job == 'getDB') {
          getDB(request.key, (data) => {
            chrome.tabs.sendMessage(sender.tab.id, {
              job: 'returnDB',
              key: request.key,
              data: data
            });
          });
        } else if (request.job == 'urlDownloadZip') {
          const zip = new JSZip();
          const files = request.files;
          console.log(files);
          let remains = files.length;
          let total = files.length;
          let i = 0;
          let file = files[i];
          const reader = new window.FileReader();
          reader.onloadend = () => {
            console.log(remains);
            addImage(reader.result);
          }
          function addImage(dataURI) {
						if(dataURI) {
							const ext = (dataURI.slice(0, 20).match(/image\/(\w*)/) || ['', ''])[1];
							const binary = convertDataURIToBinary(dataURI);
							zip.file(file.name + '.' + ext, binary, {
								base64: false
							});
						}
						else {
							total --;
						}
            remains--;
            chrome.tabs.sendMessage(sender.tab.id, {
              job: 'downloadRemaining',
              remains: remains,
              total: total
            }, () => {});
            if (remains == 0) {
              zip.generateAsync({
                type: 'blob'
              }).then((content) => {
                saveAs(content, 'NooBox.zip');
              });
            } else {
              file = files[++i];
              if (file.url.slice(0, 4) == 'data') {
                addImage(file.url);
              } else {
                fetchBlob(file.url, (blob) => {
									if(blob) {
										reader.readAsDataURL(blob);
									}
									else {
										addImage();
									}
                });
              }
            }
          }
          if (file.url.slice(0, 4) == 'data') {
            addImage(file.url);
          } else {
            fetchBlob(file.url, (blob) => {
							if(blob) {
								reader.readAsDataURL(blob);
							}
							else {
								addImage();
							}
            });
          }
        } else if (request.job == 'videoControl_website_switch') {
          chrome.tabs.query({}, (tabs) => {
            for (let i = 0; i < tabs.length; i++) {
              if (tabs[i].url.indexOf(request.host)) {
                chrome.tabs.sendMessage(tabs[i].id, {
                  job: 'videoConrolContentScriptSwitch',
                  enabled: request.enabled
                }, () => {});
              }
            }
          });
        } else if (request.job == 'videoControl_use') {
          const time = new Date().getTime();
          if (NooBox.temp.lastVideoControl + 10 * 60 * 1000 < time) {
            NooBox.temp.lastVideoControl = time;
            analytics({
              category: 'videoControl',
              action: 'run',
              label: ''
            });
            get('userId', (userId) => {
              get('version', (version) => {
                const hi = {
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
                })
              });
            });
          }
        }
      }
    }
  );
}

document.addEventListener('DOMContentLoaded', NooBox.init);
