export interface ISendMessageToBackgroundRequest {
  job:
    | 'getCurrentTabAutoRefreshStatus'
    | 'set'
    | 'updateAutoRefresh'
    | 'urlDownloadZip'
    | 'videoControl'
    | 'beginImageSearch'
    | 'analytics'
    | 'getOptions';
  value?: any;
}

export const sendMessageToBackground = (
  request: ISendMessageToBackgroundRequest
) => {
  return new Promise<any>((resolve) => {
    chrome.runtime.sendMessage(
      JSON.parse(JSON.stringify(request)),
      (response) => {
        const lastError = chrome.runtime.lastError;
        if (lastError) {
          console.error(lastError);
        }
        return resolve(response);
      }
    );
  });
};
