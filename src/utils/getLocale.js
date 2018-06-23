export default getLocale = (string) => {
  return browser.i18n.getMessage(string);
}
