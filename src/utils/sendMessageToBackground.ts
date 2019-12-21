export interface ISendMessageToBackgroundRequest {
  job: 'getBasics' | 'reloadBasics' | 'set' | 'cleanFakeFans' | 'removeFan';
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
