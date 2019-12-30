import {
  ISearchResult,
  ISearchResultItem
} from '../../searchResult/stores/searchResultStore';
import { ajax } from '../../utils/ajax';
import { ENGINE_WEIGHTS } from '../../utils/constants';
import { BaseImageSearch } from './baseImageSearch';

export class Ascii2dImageSearch extends BaseImageSearch {
  protected async searchInternal(imageUrl: string, result: ISearchResult) {
    const formData = new FormData();
    formData.append('uri', imageUrl);
    const { body, responseUrl } = await ajax({
      url: 'https://ascii2d.net/search/uri',
      method: 'POST',
      body: formData
    });

    const document = this.domParser.parseFromString(body, 'text/html');
    result.engineLink![this.engine] = responseUrl;
    this.getResults(document, result);
  }

  private getResults(document: Document, result: ISearchResult) {
    const list = document.getElementsByClassName('item-box');
    for (let i = 0; i < list.length; i++) {
      const singleResult: ISearchResultItem = {
        title: 'Possible Match',
        thumbUrl: '',
        imageUrl: '',
        sourceUrl: '',
        imageInfo: {},
        searchEngine: 'ascii2d',
        description: '',
        weight: ENGINE_WEIGHTS.ascii2d - i + Math.random()
      };
      const item = list[i];
      const imageTags = item.getElementsByClassName('image-box');
      if (imageTags.length > 0) {
        const imageTag = imageTags[0];
        const image = imageTag.getElementsByTagName('img')[0];
        if (image) {
          const thumbUrl = image.getAttribute('src') || '';
          singleResult.thumbUrl =
            thumbUrl === '' ? '' : 'https://ascii2d.net' + thumbUrl;
          singleResult.imageUrl =
            thumbUrl === '' ? '' : 'https://ascii2d.net' + thumbUrl;
        }
      }
      const infoTags = item.getElementsByClassName('info-box');
      if (infoTags.length > 0) {
        const infoTag = infoTags[0];
        const sizeInfo = infoTag.getElementsByTagName('small')[0];
        if (sizeInfo) {
          const size = sizeInfo.innerHTML.split(' ')[0].split('x');
          singleResult.imageInfo.width = parseInt(size[0], 0);
          singleResult.imageInfo.height = parseInt(size[1], 0);
        }
        const title = infoTag.getElementsByTagName('a');
        if (title[0]) {
          singleResult.title = title[0].innerHTML;
          singleResult.sourceUrl = title[0].getAttribute('href')!;
        }
        if (title[1]) {
          singleResult.description = 'Author: ' + title[1].innerHTML;
        }
      }
      result.searchResult!.push(singleResult);
    }
  }
}
