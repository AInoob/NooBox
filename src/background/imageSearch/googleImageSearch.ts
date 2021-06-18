import {
  ISearchResult,
  ISingleSearchResultItem
} from '../../searchResult/stores/searchResultStore';
import { ajax } from '../../utils/ajax';
import { ENGINE_WEIGHTS } from '../../utils/constants';
import { BaseImageSearch } from './baseImageSearch';

export class GoogleImageSearch extends BaseImageSearch {
  protected async searchInternal(
    imageUrl: string,
    result: ISearchResult,
    updateResultCallback: () => void
  ) {
    const { body, responseUrl } = await ajax({
      url: 'https://www.google.com/searchbyimage?&image_url=' + imageUrl
    });

    result.engineLink![this.engine] = responseUrl;
    updateResultCallback();

    const document = this.domParser.parseFromString(body, 'text/html');
    (window as any).d = document;
    this.getKeyword(document, result);
    updateResultCallback();

    this.getResults(document, result);
  }

  private getKeyword(document: Document, result: ISearchResult) {
    const topStuff = document.getElementById('topstuff');
    if (topStuff) {
      const cardList = topStuff.getElementsByClassName('card-section');
      if (cardList.length > 0) {
        const card = cardList[0];
        const anchorList = card.getElementsByTagName('a');
        if (anchorList.length > 0) {
          const keyword = anchorList[anchorList.length - 1].text;
          const searchImageInfo = {
            engine: this.engine,
            keyword,
            keywordLink:
              'https://www.google.com/search?q=' + encodeURIComponent(keyword)
          };
          result.searchImageInfo!.push(searchImageInfo);
        }
      }
    }
  }

  private parseImageLink(link: string) {
    const parseReg = /(http|https).*(\.jpg&imgrefurl|\.jpeg&imgrefurl|\.png&imgrefurl|\.gif&imgrefurl|\.svg&imgrefurl|&imgrefurl)/g;
    const parseResult = link.match(parseReg);
    if (parseResult) {
      const resultLink = parseResult[0];
      return resultLink.substring(0, resultLink.length - 10);
    } else {
      return null;
    }
  }

  private getResults(document: Document, result: ISearchResult) {
    const list = document.getElementsByClassName('g');
    for (let i = 0; i < list.length; i++) {
      const singleResult: ISingleSearchResultItem = {
        title: '',
        thumbUrl: '',
        imageUrl: '',
        sourceUrl: '',
        imageInfo: {},
        searchEngine: 'google',
        description: '',
        weight: ENGINE_WEIGHTS.google - i + Math.random()
      };
      const singleItem = list[i];
      const tagA = singleItem.getElementsByTagName('a');
      singleResult.sourceUrl = tagA[0].getAttribute('href')!;
      const title = tagA[0].childNodes;
      singleResult.title = (title[1] as any).innerText;
      if (!singleResult.title) {
        singleResult.title = (tagA[0].childNodes as any).innerText;
      }
      for (let j = 2; j < tagA.length; j++) {
        if (tagA[j]) {
          let link = tagA[j].getAttribute('href');
          link = this.parseImageLink(link!);
          if (link) {
            singleResult.imageUrl = link;
            singleResult.thumbUrl = link;
            break;
          }
        }
      }
      const tagSpan = singleItem.getElementsByTagName('span');
      let description = '';
      if (tagSpan.length > 0) {
        description = tagSpan[tagSpan.length - 1].innerText;
      }
      singleResult.imageInfo.width = -1;
      singleResult.imageInfo.height = -1;
      for (let j = 0; j < tagSpan.length; j++) {
        const s = tagSpan[j].innerText;
        if (s) {
          const match = s.match(/(\d+) × (\d+)/);
          if (match) {
            singleResult.imageInfo.width = Number.parseInt(match[1], 10);
            singleResult.imageInfo.height = Number.parseInt(match[2], 10);
          }
        }
      }
      singleResult.description = description;
      result.searchResult!.push(singleResult);
    }
  }
}
