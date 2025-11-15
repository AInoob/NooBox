import { getGlobalScope } from './runtime';

export const useChrome = () => {
  const globalScope = getGlobalScope();
  if (globalScope.browser && !globalScope.chrome) {
    console.log('using chrome instead of browser');
    globalScope.chrome = globalScope.browser;
    console.log('done using chrome instead of browser');
  }
};
