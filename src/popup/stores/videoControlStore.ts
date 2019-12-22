import { observable } from 'mobx';
import { HTML5_VIDEO_CONTROL_OPTION_KEY_PREFIX } from '../../utils/constants';
import { bgSet, get } from '../../utils/db';
import { getActiveTab } from '../../utils/getActiveTab';
import { getHostnameFromUrl } from '../../utils/getHostnameFromUrl';

export class VideoControlStore {
  private static getOptionKey(hostname: string): any {
    return HTML5_VIDEO_CONTROL_OPTION_KEY_PREFIX + hostname;
  }

  @observable public active: boolean = false;
  @observable public hostname: string = 'loading...';

  constructor() {
    this.init().catch(console.error);
  }

  public async toggle() {
    await bgSet(VideoControlStore.getOptionKey(this.hostname), !this.active);
    this.active = !this.active;
  }

  private async init() {
    this.hostname = getHostnameFromUrl((await getActiveTab())!.url!);
    this.active = await get(VideoControlStore.getOptionKey(this.hostname));
  }
}
