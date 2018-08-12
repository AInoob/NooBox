export const sendMessage = (content) => {
  return new Promise((resolve) => {
    browser.runtime.sendMessage(content, response =>{
      resolve(response);
    })
  })
};

export const sendTabMessage = (tabId,content) =>{
  return new Promise((resolve) =>{
    browser.tabs.sendMessage(tabId,{
      ...content
    },()=>{resolve()})
  })
};
export const getCurrentTab = () => {
  return new Promise(resolve => {
    browser.tabs.query({ 'active': true, 'lastFocusedWindow': true }, tabs => {
      if (tabs[0]) {
        resolve(tabs[0]);
      }
      else {
        resolve(null);
      }
    });
  });
};
export const generateNewTabUrl = (path) =>{
  return new Promise(resolve =>{
    let url = browser.runtime.getURL(path);
    resolve(url);
  });
}

export const createNewTab = (url) =>{
  return new Promise(resolve =>{
    browser.tabs.create({url,active:true}, async tab => {
      browser.tabs.onUpdated.addListener(function listener (tabId, info) {
          if (info.status === 'complete' && tabId === tab.id) {
              chrome.tabs.onUpdated.removeListener(listener);
              resolve();
          }
      });
    });
  })
}

export const createSandbox =() =>{
  return new Promise(resolve =>{
    let sandbox = document.createElement("iframe");
    sandbox.onload = function(){
      console.log("Load Sanbox");
      resolve();
    }
    sandbox.id  = "theFrame";
    sandbox.src = "sandbox.html";
    document.getElementsByTagName("body")[0].appendChild(sandbox);
  })
}