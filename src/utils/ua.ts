export enum BrowserType {
  EDGE = 'EDGE',
  CHROME = 'CHROME',
  FIREFOX = 'FIREFOX'
}

export const browserType = (() => {
  // @ts-ignore
  if (typeof InstallTrigger !== 'undefined') return BrowserType.FIREFOX;
  if (navigator.userAgent.indexOf('Edg') != -1) {
    return BrowserType.EDGE;
  }
  return BrowserType.CHROME;
})();
