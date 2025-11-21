import { serialize } from './ajax';
import { BELLO_URL, NOOBOX_VERSION } from './constants';
import { getGlobalScope } from './runtime';

let analyticsOnce = false;

type Env = { navigator?: Navigator; screen?: Screen } | null;
const getEnv = (): Env => (getGlobalScope() as any) || null;

const srFrom = (env: Env) =>
  env?.screen && typeof env.screen.width === 'number'
    ? `${env.screen.width}x${env.screen.height}`
    : '0x0';

const sendAnalytics = async (
  params: Record<string, string | number | undefined>
) => {
  console.log('bello');
  const url = BELLO_URL + serialize(params);
  const env = getEnv();
  try {
    if (env?.navigator && typeof env.navigator.sendBeacon === 'function') {
      const ok = env.navigator.sendBeacon(url, '');
      if (ok) {
        return;
      }
    }
  } catch {
    // ignore sendBeacon errors, fall back to fetch
  }
  try {
    await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      keepalive: true
    });
  } catch {
    // best-effort analytics; swallow network failures
  }
};

export const logPageView = async () => {
  const env = getEnv();
  const params = {
    ainoob: Math.random(),
    path: NOOBOX_VERSION,
    referrer: '',
    sr: srFrom(env),
    title: 'background',
    type: 'pageview',
    ua: env?.navigator?.userAgent || '',
    ul: env?.navigator?.language || ''
  };
  await sendAnalytics(params);
};

interface ILogEventRequest {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export const logEvent = (obj: ILogEventRequest) => {
  if (!analyticsOnce) {
    analyticsOnce = true;
    logPageView().catch(console.error);
  }
  const env = getEnv();
  const params = {
    action: obj.action,
    ainoob: Math.random(),
    category: obj.category,
    label: obj.label,
    path: NOOBOX_VERSION,
    sr: srFrom(env),
    type: 'event',
    ua: env?.navigator?.userAgent || '',
    ul: env?.navigator?.language || '',
    value: obj.value || 0
  };
  sendAnalytics(params).catch(console.error);
};
