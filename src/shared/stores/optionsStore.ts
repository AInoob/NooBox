import { observable } from 'mobx';
import { defaultOptions, IOptions } from '../../background/options';
import { clone } from '../../utils/clone';
import { bgSet } from '../../utils/db';
import { sendMessageToBackground } from '../../utils/sendMessageToBackground';

export class OptionsStore {
  @observable public options: IOptions = clone(defaultOptions);

  constructor() {
    this.init().catch(console.error);
  }

  public async update(key: keyof IOptions, value: any) {
    await bgSet(key, value);
    this.options[key] = value as never;
  }

  private async init() {
    this.options = await sendMessageToBackground({
      job: 'getOptions'
    });
  }
}
