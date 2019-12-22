// sometime some browser will throw exception if there is no callback in certain functions,
// so we will just make this dummy function to keep it from failing

export const voidFunc = () => {
  (window as any).bello = Math.random();
};
