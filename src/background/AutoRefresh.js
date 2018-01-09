export default NooBox => {
    const AutoRefresh = {};
    AutoRefresh.tabs = {};
    AutoRefresh.update = (tabId, interval, start) => {
        if (!tabId) {
            return;
        }
        let action = 'stop';
        let setting = AutoRefresh.tabs[tabId] || { };
        setting.interval = interval;
        let { handler } = setting;
        setting.handler = null;
        if (handler) {
            clearInterval(handler);
        }
<<<<<<< HEAD
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
=======
        if (start) {
            if (handler) {
                action = 'updateInterval';
            }
            else {
                action = 'start';
            }
            handler = setInterval(() => {
                chrome.tabs.reload(tabId, {}, () => {});
            }, interval);
            setting.handler = handler;
>>>>>>> df0fe3aa4b60c823377194c706f13d3b0a8c1bb4
        }
        AutoRefresh.tabs[tabId] = setting;
        NooBox.analytics({
            category: 'autoRefresh',
            action
        });
    };
    NooBox.AutoRefresh = AutoRefresh;
};