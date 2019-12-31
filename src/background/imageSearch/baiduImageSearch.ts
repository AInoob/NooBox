import { ISearchResult } from '../../searchResult/stores/searchResultStore';
import { ajax } from '../../utils/ajax';
import { BaseImageSearch } from './baseImageSearch';

export class BaiduImageSearch extends BaseImageSearch {
  protected async searchInternal(imageUrl: string, result: ISearchResult) {
    const { body, responseUrl } = await ajax({
      url: 'https://graph.baidu.com/upload?image=' + imageUrl
    });
    result.engineLink![this.engine] = responseUrl;

    const document = this.domParser.parseFromString(body, 'text/html');
    this.getKeyword(document, result);
    this.getResults(document, result);
  }

  private getKeyword(document: Document, result: ISearchResult) {
    console.log(document + ' ' + result);
  }

  private getResults(document: Document, result: ISearchResult) {
    console.log(document + ' ' + result);
  }
}
