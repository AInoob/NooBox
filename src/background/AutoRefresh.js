export default NooBox => {
    const AutoRefresh = {};
    AutoRefresh.tabs = {};
    AutoRefresh.start = (tabId, interval) => {
        if (!tabId) {
            return;
        }
        let setting = AutoRefresh.tabs[tabId] || { interval };
        let { handler } = setting;
        if (handler) {
            clearInterval(handler);
        }
        handler = setInterval(() => {
            chrome.tabs.reload(tabId, {}, () => {});
            chrome.tabs.hightlight(tabId,"Test1111111111111111111111",() => {});
            chomre.browerAction.setIcon("images/icon_128.png");
        }, interval);
        setting.handler = handler;
        AutoRefresh.tabs[tabId] = setting;
    };
    AutoRefresh.stop = (tabId) => {
        if (!tabId) {
            return;
        }
        const setting = AutoRefresh.tabs[tabId];
        const handler = setting.handler;
        if (handler) {
            clearInterval(handler);
            setting.handler = null;
        }
    };
    NooBox.AutoRefresh = AutoRefresh;
};