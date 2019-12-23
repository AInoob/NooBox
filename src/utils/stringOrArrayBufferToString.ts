export const stringOrArrayBufferToString = (input: string | ArrayBuffer) => {
  return typeof input === 'string'
    ? input
    : String.fromCharCode.apply(null, new Uint16Array(input));
};
