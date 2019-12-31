import { observable } from 'mobx';
import {
  IImageSearchRecord,
  imageSearchDao,
  ImageSearchFieldType
} from '../../dao/imageSearchDao';
import { IDirection } from '../../dao/indexedDbDao';
import { getDefaultAsyncStatus, IAsyncStatus } from './imageStore';

export class ImageSearchHistoryStore {
  @observable public imageSearchList: IImageSearchRecord[] = [];
  private imageSearchHasNext: boolean = true;
  private imageSearchLoadOrderDirection: IDirection = 'backward';
  private imageSearchLoadOrderType: ImageSearchFieldType = 'createdAt';
  private imageSearchLoadStatus: IAsyncStatus = getDefaultAsyncStatus();

  private lastScrollDate: number = 0;

  constructor() {
    this.setUpListener();
    this.loadInitialHistoryList().catch(console.error);
  }

  public async loadInitialHistoryList() {
    try {
      if (this.imageSearchLoadStatus.state !== 'inProgress') {
        const iterateResult = await imageSearchDao.iterate({
          direction: 'backward',
          size: 8,
          type: 'createdAt'
        });
        this.imageSearchList = iterateResult.recordList;
        this.imageSearchHasNext = iterateResult.hasNext;
      }
    } catch (e) {
      this.imageSearchLoadStatus.state = 'error';
      console.error(e);
      this.imageSearchLoadStatus.error = e.toString();
    }
  }

  public async delete(cursor: number) {
    await imageSearchDao.remove(cursor);
    this.imageSearchList = this.imageSearchList.filter((imageSearchRecord) => {
      return imageSearchRecord.id !== cursor;
    });
  }

  public async deleteAll() {
    await imageSearchDao.clear();
    await this.loadInitialHistoryList();
  }

  public async loadMore() {
    try {
      if (
        this.imageSearchHasNext &&
        this.imageSearchLoadStatus.state !== 'inProgress' &&
        this.imageSearchList.length > 0
      ) {
        this.imageSearchLoadStatus.state = 'inProgress';
        const iterateResult = await imageSearchDao.iterate({
          direction: this.imageSearchLoadOrderDirection,
          key: this.imageSearchList[this.imageSearchList.length - 1].createdAt,
          size: 8,
          type: this.imageSearchLoadOrderType
        });
        this.imageSearchList = this.imageSearchList.concat(
          iterateResult.recordList
        );
        this.imageSearchHasNext = iterateResult.hasNext;
        this.imageSearchLoadStatus.state = 'completed';
      }
    } catch (e) {
      this.imageSearchLoadStatus.state = 'error';
      console.error(e);
      this.imageSearchLoadStatus.error = e.toString();
    }
  }

  public async scroll() {
    const imageSearchListDiv = document.getElementById('imageSearchList');
    if (!imageSearchListDiv) {
      return;
    }
    const scrollingElement = document.scrollingElement!;
    if (
      scrollingElement.scrollHeight -
        (scrollingElement.scrollTop + scrollingElement.clientHeight) <
      333
    ) {
      const lastScrollDate = Date.now();
      if (this.lastScrollDate + 300 < lastScrollDate) {
        this.lastScrollDate = lastScrollDate;
        await this.loadMore();
      }
    }
  }

  private setUpListener() {
    document.getElementsByTagName('body')[0].onscroll = () => {
      this.scroll().catch(console.error);
    };
  }
}
