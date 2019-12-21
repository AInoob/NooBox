export interface ISendMessageToFrontendRequest {
  job: 'updateBasicsToFrontend' | 'fanRemoved';
  value?: any;
}

export const sendMessageToFrontend = (
  request: ISendMessageToFrontendRequest
) => {
  return new Promise<any>((resolve) => {
    const views = chrome.extension.getViews({ type: 'popup' });
    if (views.length === 0) {
      return resolve();
    }
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
