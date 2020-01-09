import { observable } from 'mobx';
import { imageSearchDao } from '../../dao/imageSearchDao';
import { OptionsStore } from '../../shared/stores/optionsStore';
import { EngineType } from '../../utils/constants';
import { getBase64FromImage } from '../../utils/getBase64FromImage';
import { getImageWidth } from '../../utils/getImageWidth';
import { sendMessageToBackground } from '../../utils/sendMessageToBackground';
import { ISendMessageToFrontendRequest } from '../../utils/sendMessageToFrontend';

interface IImageInfo {
  height?: number;
  width?: number;
}

interface ISearchImageInfo {
  engine: EngineType;
  keyword: string;
  keywordLink: string;
}

export interface ISingleSearchResultItem {
  description: string;
  imageInfo: IImageInfo;
  imageUrl: string;
  searchEngine: EngineType;
  sourceUrl: string;
  thumbUrl: string;
  title: string;
  weight: number;
}

export type EngineStatusType = 'disabled' | 'loading' | 'loaded' | 'error';

export interface ISearchResult {
  url?: string;
  base64?: string;
  engineLink?: { [key in EngineType]?: string };
  searchImageInfo?: ISearchImageInfo[];
  searchResult?: ISingleSearchResultItem[];
  engineStatus?: { [key in EngineType]?: EngineStatusType };
}

const DEFAULT_MODAL_IMAGE_WIDTH = 512;

export class SearchResultStore {
  @observable public result: ISearchResult = {};
  @observable public modelImageUrl: string = '';
  @observable public modelImageWidth: number = DEFAULT_MODAL_IMAGE_WIDTH;
  @observable public modelOpened: boolean = false;
  @observable public hasUpdate: boolean = false;
  private optionsStore: OptionsStore;

  private cursor: number;

  constructor(optionsStore: OptionsStore) {
    this.optionsStore = optionsStore;
    this.setUpListener();
    this.updateResult().catch(console.error);
  }

  public closeImageModel() {
    this.modelOpened = false;
  }

  public async openImageModel(modelImageUrl: string) {
    try {
      this.modelImageWidth = await getImageWidth(modelImageUrl);
    } catch {
      this.modelImageWidth = DEFAULT_MODAL_IMAGE_WIDTH;
    }
    this.modelImageUrl = modelImageUrl;
    this.modelOpened = true;
  }

  public async searchImage(base64OrUrl: string) {
    await sendMessageToBackground({
      job: 'beginImageSearch',
      value: {
        base64OrUrl
      }
    });
  }

  public async uploadSearch(img: any) {
    const base64 = getBase64FromImage(img);
    await sendMessageToBackground({
      job: 'beginImageSearch',
      value: {
        base64OrUrl: base64
      }
    });
  }

  public async updateResult(forceUpdate?: boolean) {
    if (
      !forceUpdate &&
      this.optionsStore.options.updateSearchResult === 'manual' &&
      this.result.searchResult!.length > 0
    ) {
      this.hasUpdate = true;
    } else {
      this.cursor = parseInt(window.location.hash.substr(2), 0);
      const result = await imageSearchDao.get(this.cursor);
      this.result = result!.result;
      this.hasUpdate = false;
    }
  }

  private setUpListener() {
    chrome.runtime.onMessage.addListener(
      async (request: ISendMessageToFrontendRequest, _sender, sendResponse) => {
        switch (request.job) {
          case 'image_result_update':
            sendResponse(null);
            const { cursor } = request.value;
            if (this.cursor === cursor) {
              await this.updateResult();
            }
            break;
        }
      }
    );
  }
}
