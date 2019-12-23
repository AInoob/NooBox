import { observable } from 'mobx';
import { getBase64FromFile } from '../../utils/getBase64FromFile';
import { sendMessageToBackground } from '../../utils/sendMessageToBackground';
import { stringOrArrayBufferToString } from '../../utils/stringOrArrayBufferToString';
import { wait } from '../../utils/wait';

export type StateType = 'notStarted' | 'inProgress' | 'completed' | 'error';

export interface IAsyncStatus {
  state: StateType;
  error?: string;
}

export const getDefaultAsyncStatus = (): IAsyncStatus => {
  return {
    state: 'notStarted'
  };
};

export class ImageStore {
  @observable public status: IAsyncStatus = getDefaultAsyncStatus();

  public async uploadImage(file: any) {
    try {
      this.status.state = 'inProgress';
      const base64 = stringOrArrayBufferToString(await getBase64FromFile(file));
      await wait(3000);
      await sendMessageToBackground({
        job: 'beginImageSearch',
        value: {
          base64
        }
      });
    } catch (e) {
      this.status.state = 'error';
    }
  }
}
