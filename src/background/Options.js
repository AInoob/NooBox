import { isOptionOn, getDB, setDB, deleteDB, set, get } from '../utils/db';
import { HISTORY_DB_KEY } from '../constant/constants';
import { defaultValues, constantValues } from '../constant/values';
import data from './data';

export default class Options {
  constructor() {}
  async init() {
    let keyList = Object.keys(defaultValues);
    for (let i = 0; i < keyList.length; i++) {
      const key = keyList[i];
      const currentValue = await get(key);
      if (
        currentValue == undefined ||
        currentValue == null ||
        JSON.stringify(currentValue) === '{}'
      ) {
        await set(key, defaultValues[key]);
      }
      const value = await get(key);
      data.Options.values[key] = value;
    }

    keyList = Object.keys(constantValues);
    for (let i = 0; i < keyList.length; i++) {
      const key = keyList[i];
      await set(key, constantValues[key]);
      data.Options.values[key] = constantValues[key];
    }
  }
}
