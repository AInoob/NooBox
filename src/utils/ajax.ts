import { logDebug } from './debugReporter';
import { getGlobalScope } from './runtime';

export interface IAjaxRequest {
  method?: 'GET' | 'POST' | 'DELETE';
  url: string;
  body?: string | FormData;
  headers?: {
    [index: string]: string;
  };
  debugTag?: string;
  debugBody?: boolean;
}

export interface IAjaxResponse {
  body?: any;
  responseUrl: string;
}

export const serialize = (obj: any) => {
  return (
    '?' +
    Object.keys(obj)
      .reduce((a: any, k: any) => {
        a.push(k + '=' + encodeURIComponent(obj[k]));
        return a;
      }, [])
      .join('&')
  );
};

export const ajax = async (params: IAjaxRequest): Promise<IAjaxResponse> => {
  const { method, url, body, headers } = params;
  const globalScope = getGlobalScope();

  if (typeof globalScope.XMLHttpRequest === 'undefined') {
    const response = await fetch(url, {
      method: method || 'GET',
      headers,
      body
    });

    const bodyText = await response.text();

    if (!response.ok) {
      await logDebug({
        event: 'ajax:error',
        tag: params.debugTag,
        url,
        responseUrl: response.url,
        status: response.status,
        body: params.debugBody ? bodyText?.slice(0, 15000) : undefined
      });
      throw new Error(
        `HTTP ${response.status}: ${response.statusText || 'Unknown error'}`
      );
    }

    await logDebug({
      event: 'ajax:success',
      tag: params.debugTag,
      url,
      responseUrl: response.url,
      status: response.status,
      body: params.debugBody ? bodyText?.slice(0, 15000) : undefined
    });

    return {
      body: bodyText,
      responseUrl: response.url
    };
  }

  return new Promise<IAjaxResponse>((resolve, reject) => {
    const xhr = new globalScope.XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status < 299 && this.status >= 200) {
          logDebug({
            event: 'ajax:success',
            tag: params.debugTag,
            url,
            responseUrl: this.responseURL,
            status: this.status,
            body: params.debugBody
              ? (this.responseText || '').slice(0, 15000)
              : undefined
          }).catch(() => undefined);
          resolve({
            body: this.responseText,
            responseUrl: this.responseURL
          });
        } else {
          logDebug({
            event: 'ajax:error',
            tag: params.debugTag,
            url,
            responseUrl: this.responseURL,
            status: this.status,
            body: params.debugBody
              ? (this.responseText || '').slice(0, 15000)
              : undefined
          }).catch(() => undefined);
          reject(this.responseText);
        }
      }
    };
    xhr.onerror = () => {
      reject('XHR error');
    };
    xhr.open(method || 'GET', url, true);
    if (headers) {
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });
    }
    xhr.send(body);
  });
};
