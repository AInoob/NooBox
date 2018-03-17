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
        }
        AutoRefresh.tabs[tabId] = setting;
        NooBox.analytics({
            category: 'autoRefresh',
            action
        });
    };
    NooBox.AutoRefresh = AutoRefresh;
};