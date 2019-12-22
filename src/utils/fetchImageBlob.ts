export const fetchImageBlob = (uri: string, callback: any) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', uri, true);
  xhr.responseType = 'blob';

  xhr.onload = function() {
    if (xhr.readyState === 4) {
      if (this.status === 200) {
        const blob = new Blob([this.response], {
          type: 'image/png'
        });
        if (callback) {
          callback(blob);
        }
      } else {
        console.error('fetchImageBlob receive error code: ' + this.status);
        callback();
      }
    }
  };
  xhr.onerror = (e) => {
    callback();
    console.error('fetchImageBlob failed ' + e);
  };
  xhr.send();
};
