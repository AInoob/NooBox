import { getGlobalScope } from './runtime';

interface IDebugPayload {
  event: string;
  engine?: string;
  tag?: string;
  url?: string;
  responseUrl?: string;
  status?: number;
  body?: string;
  error?: string;
  extra?: any;
}

const DEBUG_ENDPOINT = 'http://localhost:3030/log';

export const isDebugEnabled = (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      chrome.storage.sync.get('debugMode', (res) => {
        resolve(!!res.debugMode);
      });
    } catch {
      resolve(false);
    }
  });
};

export const logDebug = async (payload: IDebugPayload) => {
  if (!(await isDebugEnabled())) {
    return;
  }
  try {
    await fetch(DEBUG_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ts: new Date().toISOString(),
        ...payload
      })
    });
  } catch (error) {
    const globalScope = getGlobalScope();
    globalScope.console?.debug?.('[NooBox Debug] send failed', error?.message);
  }
};
