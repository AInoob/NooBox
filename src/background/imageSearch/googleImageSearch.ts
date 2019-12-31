import {
  ISearchResult,
  ISearchResultItem
} from '../../searchResult/stores/searchResultStore';
import { ajax } from '../../utils/ajax';
import { ENGINE_WEIGHTS } from '../../utils/constants';
import { BaseImageSearch } from './baseImageSearch';

export class GoogleImageSearch extends BaseImageSearch {
  protected async searchInternal(imageUrl: string, result: ISearchResult) {
    const { body, responseUrl } = await ajax({
      url: 'https://www.google.com/searchbyimage?&image_url=' + imageUrl
    });
    result.engineLink![this.engine] = responseUrl;

    const document = this.domParser.parseFromString(body, 'text/html');
    this.getKeyword(document, result);
    this.getResults(document, result);
  }

  private getKeyword(document: Document, result: ISearchResult) {
    const topStuff = document.getElementById('topstuff');
    if (topStuff) {
      const cardList = topStuff.getElementsByClassName('card-section');
      if (cardList.length > 0) {
        const card = cardList[0];
        const cardNodeList = card.childNodes;
        if (cardNodeList.length > 1) {
          const keywordAnchorList = (cardNodeList[1] as any).getElementsByTagName(
            'a'
          );
          if (keywordAnchorList > 0) {
            const searchImageInfo = {
              engine: this.engine,
              keyword: keywordAnchorList[0].text,
              keywordLink: keywordAnchorList[0].href
            };
            result.searchImageInfo!.push(searchImageInfo);
          }
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
    const websiteList = document.getElementsByClassName('srg');
    const list = websiteList[websiteList.length - 1].getElementsByClassName(
      'g'
    );
    for (let i = 0; i < list.length; i++) {
      const singleResult: ISearchResultItem = {
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
      // process title,imageUrl,sourceUrl and thumbUrl
      // first <a> contains title and imageUrl
      // second <a> contains sourceUrl and thumbUrl
      const tagA = singleItem.getElementsByTagName('a');
      singleResult.sourceUrl = tagA[0].getAttribute('href')!;
      const title = tagA[0].childNodes;
      singleResult.title = (title[0] as any).innerText;
      // new method to dig the image Source
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
      const tagSpan = singleItem.getElementsByClassName('st')[0].childNodes;
      let description = '';
      for (let j = 0; j < tagSpan.length; j++) {
        if (j === 0) {
          if ((tagSpan[j] as any).innerHTML) {
            let size = (tagSpan[j] as any).innerHTML.split('-')[0];
            size = size.replace(/ /g, '').split('×');
            if (size) {
              singleResult.imageInfo.width = Number.parseInt(size[0], 10);
              singleResult.imageInfo.height = Number.parseInt(size[1], 10);
            }
          } else {
            singleResult.imageInfo.width = -1;
            singleResult.imageInfo.height = -1;
          }
        } else {
          description +=
            (tagSpan[j] as any).innerHTML || tagSpan[j].textContent;
        }
      }
      singleResult.description = description;
      result.searchResult!.push(singleResult);
    }
  }
}
