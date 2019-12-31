import { ISearchResult } from '../searchResult/stores/searchResultStore';
import { IndexedDbDao } from './indexedDbDao';

export interface IImageSearchRecord {
  result: ISearchResult;
  createdAt: number;
  id: number;
}

export type ImageSearchFieldType = 'id' | 'createdAt';

class ImageSearchDao extends IndexedDbDao<
  IImageSearchRecord,
  ImageSearchFieldType
> {
  constructor() {
    super('ImageSearch');
  }
}

export const imageSearchDao = new ImageSearchDao();
