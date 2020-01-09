import { clone } from '../utils/clone';
import { HTML5_VIDEO_CONTROL_OPTION_KEY_PREFIX } from '../utils/constants';
import { get, set } from '../utils/db';
import { Image } from './image';
import { VideoControl } from './videoControl';

export interface IOptions {
  autoRefresh: boolean;
  displayMode: 1 | 2;
  sortBy: 'relevance' | 'area' | 'width' | 'height';
  extractImages: boolean;
  history: boolean;
  imageSearch: boolean;
  imageSearchNewTabFront: boolean;
  imageSearchUrl_ascii2d: boolean;
  imageSearchUrl_baidu: boolean;
  imageSearchUrl_bing: boolean;
  imageSearchUrl_google: boolean;
  imageSearchUrl_iqdb: boolean;
  imageSearchUrl_saucenao: boolean;
  imageSearchUrl_sogou: boolean;
  imageSearchUrl_tineye: boolean;
  imageSearchUrl_yandex: boolean;
  screenshotSearch: boolean;
  userId: string;
  videoControl: boolean;
  updateSearchResult: 'auto' | 'manual';
}

export const defaultOptions: IOptions = {
  autoRefresh: true,
  displayMode: 1,
  sortBy: 'relevance',
  extractImages: true,
  history: true,
  imageSearch: true,
  imageSearchNewTabFront: true,
  imageSearchUrl_ascii2d: false,
  imageSearchUrl_baidu: true,
  imageSearchUrl_bing: true,
  imageSearchUrl_google: true,
  imageSearchUrl_iqdb: false,
  imageSearchUrl_saucenao: false,
  imageSearchUrl_sogou: false,
  imageSearchUrl_tineye: true,
  imageSearchUrl_yandex: true,
  screenshotSearch: true,
  updateSearchResult: 'auto',
  userId:
    (Math.random().toString(36) + '00000000000000000').slice(2, 19) +
    (Math.random().toString(36) + '00000000000000000').slice(2, 19),
  videoControl: false
};

export class Options {
  private options: IOptions = clone(defaultOptions);
  private image: Image;
  private videoControl: VideoControl;
  constructor(image: Image, videoControl: VideoControl) {
    this.image = image;
    this.videoControl = videoControl;
    this.init().catch(console.error);
  }

  public getOptions() {
    return clone(this.options);
  }

  public async set(key: keyof IOptions, value: any) {
    await set(key, value);
    this.options[key as keyof IOptions] = value as never;
    if (
      key === 'videoControl' ||
      key.startsWith(HTML5_VIDEO_CONTROL_OPTION_KEY_PREFIX)
    ) {
      this.videoControl.notifyVideoControlSwitch(
        key.substr(HTML5_VIDEO_CONTROL_OPTION_KEY_PREFIX.length),
        value
      );
    } else if (key === 'screenshotSearch') {
      this.image.updateScreenshotSearchContextMenu().catch(console.error);
    } else if (key === 'extractImages') {
      this.image.updateExtractImageContextMenu().catch(console.error);
    } else if (key === 'imageSearch') {
      this.image.updateImageSearchContextMenu().catch(console.error);
    }
  }
  private async init() {
    const keyList: Array<keyof IOptions> = Object.keys(defaultOptions) as any;
    for (const key of keyList) {
      const currentValue = await get(key);
      if (
        currentValue === undefined ||
        currentValue === null ||
        JSON.stringify(currentValue) === '{}'
      ) {
        await set(key, defaultOptions[key]);
      }
      this.options[key] = (await get(key)) as never;
    }
    await this.image.init();
  }
}
