const isBase64 = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
const isUrl = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

export const checkUrlOrBase64 = (item: string) => {
  if (item.match(isBase64)) {
    return 'base64';
  } else if (item.match(isUrl)) {
    return 'url';
  } else {
    return 'unknown';
  }
};
