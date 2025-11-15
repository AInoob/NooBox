import { ajax, serialize } from './ajax';
import { BELLO_URL, NOOBOX_VERSION } from './constants';
import { getGlobalScope } from './runtime';

let analyticsOnce = false;

const getEnv = () => {
  const globalScope = getGlobalScope();
  if (!globalScope || !globalScope.navigator || !globalScope.screen) {
    return null;
  }
  return globalScope;
};

export const logPageView = async () => {
  const env = getEnv();
  if (!env) {
    return;
  }

  const params = {
    ainoob: Math.random(),
    path: NOOBOX_VERSION,
    referrer: '',
    sr: env.screen.width + 'x' + env.screen.height,
    title: 'background',
    type: 'pageview',
    ua: env.navigator.userAgent,
    ul: env.navigator.language
  };
  await ajax({ url: BELLO_URL + serialize(params) });
};

interface ILogEventRequest {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export const logEvent = (obj: ILogEventRequest) => {
  const env = getEnv();
  if (!env) {
    return;
  }
  if (!analyticsOnce) {
    analyticsOnce = true;
    logPageView().catch(console.error);
  }
  const params = {
    action: obj.action,
    ainoob: Math.random(),
    category: obj.category,
    label: obj.label,
    path: NOOBOX_VERSION,
    sr: env.screen.width + 'x' + env.screen.height,
    type: 'event',
    ua: env.navigator.userAgent,
    ul: env.navigator.language,
    value: obj.value || 0
  };
  ajax({ url: BELLO_URL + serialize(params) }).catch(console.error);
};
