// sometime some browser will throw exception if there is no callback in certain functions,
// so we will just make this dummy function to keep it from failing
import { getGlobalScope } from './runtime';

export const voidFunc = () => {
  getGlobalScope().bello = Math.random();
};
