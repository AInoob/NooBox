import {
  ISearchResult,
  ISearchResultItem
} from '../../searchResult/stores/searchResultStore';
import { ajax } from '../../utils/ajax';
import { ENGINE_WEIGHTS } from '../../utils/constants';
import { BaseImageSearch } from './baseImageSearch';

export class SauceNaoImageSearch extends BaseImageSearch {
  protected async searchInternal(imageUrl: string, result: ISearchResult) {
    const { body } = await ajax({
      url: 'http://saucenao.com/search.php?db=999&url=' + imageUrl
    });

    const document = this.domParser.parseFromString(body, 'text/html');
    this.getResults(document, result);
  }

  private getResults(document: Document, result: ISearchResult) {
    const list = document.getElementsByClassName('result');
    if (list.length > 0) {
      for (let i = 1; i < list.length; i++) {
        const singleResult: ISearchResultItem = {
          title: '',
          thumbUrl: '',
          imageUrl: '',
          sourceUrl: '',
          imageInfo: {},
          searchEngine: 'saucenao',
          description: '',
          weight: ENGINE_WEIGHTS.saucenao - i + Math.random()
        };
        const singleItem = list[i];
        const resultImage = singleItem.getElementsByClassName('resultimage')[0];
        if (resultImage) {
          const sourceUrl = resultImage.getElementsByTagName('a')[0];
          if (sourceUrl) {
            singleResult.sourceUrl = sourceUrl.getAttribute('href') || '';
          }
          const thumbUrl = resultImage.getElementsByTagName('img')[0];
          if (thumbUrl) {
            singleResult.thumbUrl =
              thumbUrl.getAttribute('data-src') ||
              thumbUrl.getAttribute('src') ||
              '';
            singleResult.imageUrl =
              thumbUrl.getAttribute('data-src') ||
              thumbUrl.getAttribute('src') ||
              '';
          }
        }
        const resultContent = singleItem.getElementsByClassName(
          'resultcontent'
        )[0];
        if (resultContent) {
          const title = resultContent.getElementsByTagName('strong')[0];

          if (title) {
            singleResult.title = title.innerHTML;
          }
        }
        singleResult.imageInfo.height = -1;
        singleResult.imageInfo.width = -1;
        result.searchResult!.push(singleResult);
      }
    }
  }
}
