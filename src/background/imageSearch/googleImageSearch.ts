import { ISearchResult } from '../../searchResult/stores/searchResultStore';
import { BaseImageSearch } from './baseImageSearch';

export class GoogleImageSearch extends BaseImageSearch {
  protected async searchInternal(imageUrl: string, result: ISearchResult) {
    result.searchImageInfo!.push({
      engine: this.engine,
      keyword: 'bello',
      keywordLink: 'https://ainoob.com/' + imageUrl
    });
  }
}
