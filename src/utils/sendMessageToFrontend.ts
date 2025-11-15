export interface ISendMessageToFrontendRequest {
  job: 'image_result_update';
  value?: any;
}

export const sendMessageToFrontend = (
  request: ISendMessageToFrontendRequest
) => {
  return new Promise<any>((resolve) => {
    try {
      const extensionApi = chrome.extension;
      if (extensionApi && extensionApi.getViews) {
        const popupViews = extensionApi.getViews({ type: 'popup' });
        const tabViews = extensionApi.getViews({ type: 'tab' });
        if (popupViews.length === 0 && tabViews.length === 0) {
          return resolve();
        }
      }
    } catch {
      // Ignore view detection errors (service worker context)
    }

    chrome.runtime.sendMessage(
      JSON.parse(JSON.stringify(request)),
      (response) => {
        const lastError = chrome.runtime.lastError;
        if (
          lastError &&
          !lastError.message?.includes('Could not establish connection')
        ) {
          console.error(lastError);
        }
        return resolve(response);
      }
    );
  });
};
