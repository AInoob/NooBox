export interface ISendMessageToFrontendRequest {
  job: 'image_result_update';
  value?: any;
}

export const sendMessageToFrontend = (
  request: ISendMessageToFrontendRequest
) => {
  return new Promise<any>((resolve) => {
    const popupViews = chrome.extension.getViews({ type: 'popup' });
    const tabViews = chrome.extension.getViews({ type: 'tab' });
    if (popupViews.length === 0 && tabViews.length === 0) {
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
