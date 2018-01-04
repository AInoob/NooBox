require("babel-core/register");
require("babel-polyfill");

import { defaultValues, constantValues } from './values';
import createImage from './Image';
import createHistory from './History';
import createAutoRefresh from './AutoRefresh';

const NooBox = {};
createImage(NooBox);
createHistory(NooBox);
createAutoRefresh(NooBox);
let analyticsOnce = false;
const analyticsLastList = {};

function analytics(request) {
  if (!analyticsOnce) {
		bello.pageview(NooBox.Options.constantValues[1][1]);
    analyticsOnce = true;
  }
  const time = new Date().getTime();
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
NooBox.Webmaster = {};
NooBox.Options = {
  defaultValues,
  constantValues,
};
NooBox.Notifications = {};
//Default settings, will be set to correspond values if the settings does not exist
//Store in chrome.storage.sync
//Image section


NooBox.Notifications.notImage = () => {
	chrome.notifications.create({
		type:'basic',
		iconUrl: '/images/icon_128.png',
		title: GL('reverse_image_search'),
		message: GL('ls_0')
	});
}

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
  chrome.management.getSelf((data) => {
    if(data.installType == 'normal') {
      set('checkUpdate', false);
    }
  });
}

NooBox.init = () => {
	window.NooBox = NooBox;
  NooBox.Options.init(0);
  chrome.tabs.onRemoved.addListener(tabId => {
    NooBox.AutoRefresh.stopRefresh(tabId);
  });
  // chrome.tabs.onReplaced(tabId => {
  // });
  chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
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
					NooBox.Image.downloadExtractImages(sender, request.files);
        } else if (request.job == 'videoControl_website_switch') {
					let action = 'enable';
					if(request.enable) {
						action = 'disable';
					}
					analytics({
						category: 'videoControlWebsiteSwitch',
						action,
						label: ''
					});
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
        } else if (request.job == 'updateAutoRefresh') {
          const { tabId, interval, handler } = request;
          NooBox.AutoRefresh.update(tabId, interval, handler);
        } else if (request.job == 'currentTabAutoRefreshState') {
          const { tabId } = request;
          const setting = NooBox.AutoRefresh.tabs[tabId];
          sendResponse( setting );
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
