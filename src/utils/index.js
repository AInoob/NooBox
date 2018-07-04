const BASE64_MARKER = ';base64,';

export const fetchBlob = (uri, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', uri, true);
  xhr.responseType = 'blob';

  xhr.onload = function(e) {
		if(xhr.readyState == 4) {
			if (this.status == 200) {
				const blob = new Blob([this.response], {
					type: 'image/png'
				});;
				if (callback) {
					callback(blob);
				}
			}
			else {
				console.log('error! yay');
				callback();
			}
		}
  };
	xhr.onerror = function() {
		console.log('error! yay');
		callback();
	}
  xhr.send();
};

export const convertDataURIToBinary = (dataURI) => {
    console.log(dataURI);
  try {
    const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const base64 = dataURI.substring(base64Index);
    const raw = window.atob(base64);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));
    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  } catch (e) {
    try {
      dataURI = dataURI.replace(/%2/g, '/');
      const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
      const base64 = dataURI.substring(base64Index);
      const raw = window.atob(base64);
      const rawLength = raw.length;
      const array2 = new Uint8Array(new ArrayBuffer(rawLength));
      for (let j = 0; j < rawLength; j++) {
        array2[j] = raw.charCodeAt(j);
      }
      return array2;
    } catch (e) {
      return ;
    }
    console.log(e);
    return array;
  }
}
