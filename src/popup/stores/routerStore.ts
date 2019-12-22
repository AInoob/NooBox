import { observable } from 'mobx';

export type LocationType = 'overview' | 'history' | 'options' | 'about';

export class RouterStore {
  @observable public location: LocationType = 'overview';

  public goTo(location: LocationType) {
    this.location = location;
  }
}
