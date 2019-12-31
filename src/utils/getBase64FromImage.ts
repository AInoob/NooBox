export const getBase64FromImage = (img: any) => {
  const workerCanvas = document.createElement('canvas');
  const workerCtx = workerCanvas.getContext('2d')!;
  workerCanvas.width = img.naturalWidth;
  workerCanvas.height = img.naturalHeight;
  workerCtx.drawImage(img, 0, 0);
  return workerCanvas.toDataURL();
};
