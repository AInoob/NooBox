export const getHostnameFromUrl = (url: string) => {
  const tagA = document.createElement('a');
  tagA.href = url;
  return tagA.hostname;
};
