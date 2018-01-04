export default NooBox => {
    const AutoRefresh = {};
    AutoRefresh.tabs = {};
    AutoRefresh.update = (tabId, interval, start) => {
        if (!tabId) {
            return;
        }
        let setting = AutoRefresh.tabs[tabId] || { };
        setting.interval = interval;
        let { handler } = setting;
        setting.handler = null;
        if (handler) {
            clearInterval(handler);
        }
        if (start) {
            handler = setInterval(() => {
                chrome.tabs.reload(tabId, {}, () => {});
            }, interval);
            setting.handler = handler;
        }
        AutoRefresh.tabs[tabId] = setting;
    };
    NooBox.AutoRefresh = AutoRefresh;
};