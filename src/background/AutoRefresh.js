export default NooBox => {
    const AutoRefresh = {};
    AutoRefresh.tabs = {};
    AutoRefresh.update = (tabId, interval, start, userAction) => {
        if (!tabId) {
            return;
        }
        let action = 'stop';
        let setting = AutoRefresh.tabs[tabId] || { };
        if (interval) {
            setting.interval = interval;
        }
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
                chrome.tabs.reload(tabId, {}, () => {
                    console.log('refresh');
                });
            }, interval);
            setting.handler = handler;
        }
        AutoRefresh.tabs[tabId] = setting;
        if (userAction) {
            NooBox.analytics({
                category: 'autoRefresh',
                action
            });
        }
    };
    NooBox.AutoRefresh = AutoRefresh;
};