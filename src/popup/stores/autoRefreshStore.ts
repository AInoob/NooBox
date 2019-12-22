import { observable } from 'mobx';
import {
  defaultTabStatus,
  ITabStatus,
  IUpdateAutoRefresh
} from '../../background/autoRefresh';
import { getActiveTab } from '../../utils/getActiveTab';
import { sendMessageToBackground } from '../../utils/sendMessageToBackground';

export class AutoRefreshStore {
  @observable public elapsedTime: number = 0;
  @observable public active: boolean = false;
  @observable public interval: number = defaultTabStatus.interval;
  private tabStatus: ITabStatus = defaultTabStatus;
  private handle: number | null = null;

  public async getCurrentTabStatus() {
    this.tabStatus = await sendMessageToBackground({
      job: 'getCurrentTabAutoRefreshStatus',
      value: {
        tabId: (await getActiveTab())!.id
      }
    });
    this.updateInfo();
  }

  public async updateAutoRefresh(request: IUpdateAutoRefresh) {
    this.tabStatus = await sendMessageToBackground({
      job: 'updateAutoRefresh',
      value: request
    });
    this.updateInfo();
  }

  private updateInfo() {
    const { handler, lastRefreshedAt, interval } = this.tabStatus;
    let elapsedTime = 0;
    let active = false;
    if (handler) {
      const x = (new Date().getTime() - lastRefreshedAt! - 1000) / 1000;
      elapsedTime = ((Math.floor(x) * 1000) % interval) + 1000;
      active = true;
    }
    this.elapsedTime = elapsedTime;
    this.active = active;
    this.interval = interval;
    if (this.handle) {
      clearInterval(this.handle);
      this.handle = null;
    }
    if (active) {
      this.handle = setInterval(() => {
        this.updateInfo();
      }, 1000);
    }
  }
}
