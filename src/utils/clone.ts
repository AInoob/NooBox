export const clone = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};
