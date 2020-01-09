import {
  ISearchResult,
  ISingleSearchResultItem
} from '../../searchResult/stores/searchResultStore';
import { ajax } from '../../utils/ajax';
import { ENGINE_WEIGHTS } from '../../utils/constants';
import { BaseImageSearch } from './baseImageSearch';

export class YandexImageSearch extends BaseImageSearch {
  protected async searchInternal(
    imageUrl: string,
    result: ISearchResult,
    updateResultCallback: () => void
  ) {
    const { body, responseUrl } = await ajax({
      url:
        'https://yandex.com/images/search?source=collections&rpt=imageview&url=' +
        imageUrl
    });
    result.engineLink![this.engine] = responseUrl;
    updateResultCallback();

    const document = this.domParser.parseFromString(body, 'text/html');
    this.getKeyword(document, result);
    this.getResults(document, result);
  }

  private getKeyword(document: Document, result: ISearchResult) {
    const keywordWrapper = document.getElementsByClassName('tags__content');
    const searchImageInfo = {
      engine: this.engine,
      keyword: '',
      keywordLink: ''
    };
    if (keywordWrapper.length !== 0) {
      const keywords = keywordWrapper[0].getElementsByTagName('a');
      if (keywords.length > 0) {
        searchImageInfo.keyword = keywords[0].innerHTML;
        searchImageInfo.keywordLink = keywords[0].getAttribute('href')!;
      }
      result.searchImageInfo!.push(searchImageInfo);
    }
  }

  private getResults(document: Document, result: ISearchResult) {
    const similar = document.getElementsByClassName('similar__thumbs');
    if (similar.length > 0) {
      const similarList = similar[0].getElementsByTagName('li');
      for (let i = 0; i < similarList.length; i++) {
        const singleResult: ISingleSearchResultItem = {
          title: '',
          thumbUrl: '',
          imageUrl: '',
          sourceUrl: '',
          imageInfo: {},
          searchEngine: 'yandex',
          description: '',
          weight: ENGINE_WEIGHTS.yandex - i + Math.random()
        };
        singleResult.title = 'Yandex';
        const singleItem = similarList[i];
        const sizeInfo = singleItem.getAttribute('style')!.split(';');
        if (sizeInfo) {
          const maxWidth = Number.parseInt(
            sizeInfo[0].substring(
              sizeInfo[0].indexOf(':') + 1,
              sizeInfo[0].indexOf('px')
            ),
            10
          );
          const width = Number.parseInt(
            sizeInfo[1].substring(
              sizeInfo[1].indexOf(':') + 1,
              sizeInfo[1].indexOf('px')
            ),
            10
          );
          singleResult.imageInfo.width = Math.floor((maxWidth + width) / 2);
          singleResult.imageInfo.height = 130;
        }
        const imageSource = singleItem.getElementsByTagName('a')[0];
        singleResult.sourceUrl =
          'https://yandex.com' + imageSource.getAttribute('href');

        const imagePart = singleItem.getElementsByTagName('img')[0];
        singleResult.thumbUrl = 'https:' + imagePart.getAttribute('src');
        singleResult.imageUrl = 'https:' + imagePart.getAttribute('src');
        result.searchResult!.push(singleResult);
      }
    }
    const otherSite = document.getElementsByClassName('other-sites__container');
    if (otherSite.length > 0) {
      const otherSiteList = otherSite[0].getElementsByTagName('li');
      for (let i = 0; i < otherSiteList.length; i++) {
        const singleResult: ISingleSearchResultItem = {
          title: '',
          thumbUrl: '',
          imageUrl: '',
          sourceUrl: '',
          imageInfo: {},
          searchEngine: 'yandex',
          description: '',
          weight: ENGINE_WEIGHTS.yandex - i + Math.random() - 10
        };
        const singleItem = otherSiteList[i];
        const thumbUrl = singleItem
          .getElementsByClassName('other-sites__preview-link')[0]
          .getAttribute('href');
        singleResult.thumbUrl = thumbUrl || '';
        singleResult.imageUrl = thumbUrl || '';
        const sizeInfo =
          singleItem.getElementsByClassName('other-sites__meta')[0].innerHTML ||
          singleItem.getElementsByClassName('serp-item__meta')[0].innerHTML ||
          undefined;
        if (sizeInfo) {
          const size = sizeInfo.split('×');
          singleResult.imageInfo.width = Number.parseInt(size[0], 10);
          singleResult.imageInfo.height = Number.parseInt(size[1], 10);
        }
        const title = singleItem.getElementsByClassName(
          'other-sites__title-link'
        )[0];
        singleResult.title = title.innerHTML;
        singleResult.sourceUrl = title.getAttribute('href') || '';
        singleResult.description = singleItem.getElementsByClassName(
          'other-sites__desc'
        )[0].innerHTML;
        result.searchResult!.push(singleResult);
      }
    }
  }
}
