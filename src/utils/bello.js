import { get } from './db';
import {BELLO_URL} from "../constant/constants";
import ajax from './ajax';
import { serialize } from '.';

export const logPageView = async () => {
  if(typeof window != 'object')
    return;
  const params = {
    type: 'pageview',
    path: await get('version'),
    title: 'background',
    referrer: '',
    ua: navigator.userAgent,
    sr: screen.width + 'x' + screen.height,
    ul: navigator.language || navigator.userLanguage,
    ainoob: Math.random(),
  }
  await ajax(BELLO_URL + serialize(params));
};

export const logEvent = async obj => {
  if(typeof window !== 'object')
    return;
  // console.log(obj);
  const params = {
    type: 'event',
    category: obj.category,
    action: obj.action,
    label: obj.label,
    value: obj.value || 0,
    ua: navigator.userAgent,
    sr: screen.width + 'x' + screen.height,
    path: await get('version'),
    ul: navigator.language || navigator.userLanguage,
    ainoob: Math.random(),
  }
  await ajax(BELLO_URL + serialize(params));
};
