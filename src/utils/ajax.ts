interface IAjax {
  method?: 'GET' | 'POST' | 'DELETE';
  url: string;
  body?: string;
  headers?: {
    [index: string]: string;
  };
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

export const ajax = (params: IAjax) => {
  const { method, url, body, headers } = params;
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status < 299 && this.status >= 200) {
          resolve(this.responseText);
        } else {
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
