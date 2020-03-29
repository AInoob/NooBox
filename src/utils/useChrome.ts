export const useChrome = () => {
  if ((window as any).browser) {
    console.log('using chrome instead of browser');
    (window as any).chrome = (window as any).browser;
    console.log('done using chrome instead of browser');
  }
};
