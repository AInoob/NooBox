export const getI18nMessage = (
  message: string,
  messageForPlural?: string,
  count?: number
) => {
  if (count && count > 1 && messageForPlural) {
    return chrome.i18n.getMessage(messageForPlural);
  }
  return chrome.i18n.getMessage(message);
};
