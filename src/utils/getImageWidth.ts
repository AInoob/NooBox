export const getImageWidth = (url: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = function() {
      resolve((this as any).width);
    };
    img.onerror = reject;
  });
};
