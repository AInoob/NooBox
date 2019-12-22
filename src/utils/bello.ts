import { ajax, serialize } from './ajax';
import { BELLO_URL, NOOBOX_VERSION } from './constants';

let analyticsOnce = false;

export const logPageView = async () => {
  const params = {
    ainoob: Math.random(),
    path: NOOBOX_VERSION,
    referrer: '',
    sr: screen.width + 'x' + screen.height,
    title: 'background',
    type: 'pageview',
    ua: navigator.userAgent,
    ul: navigator.language
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
  if (typeof window !== 'object') {
    return;
  }
  if (!analyticsOnce) {
    analyticsOnce = true;
    logPageView().catch(console.error);
  }
  // console.log(obj);
  const params = {
    action: obj.action,
    ainoob: Math.random(),
    category: obj.category,
    label: obj.label,
    path: NOOBOX_VERSION,
    sr: screen.width + 'x' + screen.height,
    type: 'event',
    ua: navigator.userAgent,
    ul: navigator.language,
    value: obj.value || 0
  };
  ajax({ url: BELLO_URL + serialize(params) }).catch(console.error);
};
