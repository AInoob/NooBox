export const getBase64FromFile = (
  file: File
): Promise<string | ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      resolve(this.result!);
    };
    reader.onerror = (e) => {
      reject(e);
    };
  });
};
