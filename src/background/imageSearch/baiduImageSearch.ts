import {
  ISearchResult,
  ISingleSearchResultItem
} from '../../searchResult/stores/searchResultStore';
import { ajax } from '../../utils/ajax';
import { BaseImageSearch } from './baseImageSearch';

export class BaiduImageSearch extends BaseImageSearch {
  protected async searchInternal(imageUrl: string, result: ISearchResult) {
    const { body } = await ajax({
      url: 'https://graph.baidu.com/upload?image=' + imageUrl,
      method: 'GET'
    });
    const { data, msg } = JSON.parse(body);
    if (msg === 'Success') {
      const imageKey = data.sign;
      const sameImageChunk = await ajax({
        url:
          'https://graph.baidu.com/ajax/pcsame?sign=' +
          imageKey +
          '&limit=' +
          10,
        method: 'POST'
      });
      const sameImage = JSON.parse(sameImageChunk.body);
      if (typeof sameImage === 'object') {
        this.getResults(sameImage, result);
      }
    }
  }

  private getResults(sameImage: any, result: ISearchResult) {
    const dataList = sameImage.data.list;
    for (let i = 0; i < dataList.length; i++) {
      const singleResult: ISingleSearchResultItem = {
        title: 'Possible Match',
        thumbUrl: '',
        imageUrl: '',
        sourceUrl: '',
        imageInfo: {},
        searchEngine: 'baidu',
        description: '',
        weight: 28 - i + Math.random()
      };
      singleResult.title = dataList[i].title || '';
      singleResult.imageUrl = dataList[i].image_src || '';
      singleResult.sourceUrl = dataList[i].url || '';
      singleResult.thumbUrl = dataList[i].image_src || '';
      singleResult.imageInfo.height = dataList[i].height;
      singleResult.imageInfo.width = dataList[i].width;
      singleResult.description = dataList[i].abstract || '';
      result.searchResult!.push(singleResult);
    }
  }
}
