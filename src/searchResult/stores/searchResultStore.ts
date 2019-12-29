import { observable } from 'mobx';
import { EngineType } from '../../utils/constants';
import { getDB } from '../../utils/db';
import { getImageWidth } from '../../utils/getImageWidth';
import { ISendMessageToFrontendRequest } from '../../utils/sendMessageToFrontend';

interface IImageInfo {
  height?: number;
  width?: number;
}

interface ISearchImageInfo {
  engine: EngineType;
  imageInfo: IImageInfo;
  keyword: string;
  keywordLink: string;
}

export interface ISearchResultItem {
  description: string;
  imageInfo: IImageInfo;
  imageUrl: string;
  searchEngine: EngineType;
  sourceUrl: string;
  thumbUrl: string;
  title: string;
  weight: number;
}

interface ISearchResult {
  url?: string;
  base64?: string;
  engineLink?: { [key in EngineType]?: string };
  searchImageInfo?: ISearchImageInfo[];
  searchResult?: ISearchResultItem[];
}

const DEFAULT_MODAL_IMAGE_WIDTH = 512;

export class SearchResultStore {
  @observable public result: ISearchResult = {};
  @observable public modelImageUrl: string = '';
  @observable public modelImageWidth: number = DEFAULT_MODAL_IMAGE_WIDTH;
  @observable public modelOpened: boolean = false;

  private cursor: string;

  constructor() {
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

  private async updateResult() {
    this.cursor = window.location.hash.substr(2);
    const result = await getDB(parseInt(this.cursor, 0) as any);
    this.result = result;
    console.log(result);
  }

  private setUpListener() {
    chrome.runtime.onMessage.addListener(
      async (request: ISendMessageToFrontendRequest, _sender, sendResponse) => {
        switch (request.job) {
          case 'image_result_update':
            sendResponse(null);
            const { cursor } = request.value;
            if (this.cursor === cursor.toString()) {
              await this.updateResult();
            }
            break;
        }
      }
    );
  }
}
