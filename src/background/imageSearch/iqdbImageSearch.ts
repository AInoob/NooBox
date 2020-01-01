import {
  ISearchResult,
  ISingleSearchResultItem
} from '../../searchResult/stores/searchResultStore';
import { ajax } from '../../utils/ajax';
import { ENGINE_WEIGHTS } from '../../utils/constants';
import { BaseImageSearch } from './baseImageSearch';

export class IqdbImageSearch extends BaseImageSearch {
  protected async searchInternal(imageUrl: string, result: ISearchResult) {
    const { body, responseUrl } = await ajax({
      url: 'https://iqdb.org/?url=' + imageUrl
    });

    result.engineLink![this.engine] = responseUrl;
    const document = this.domParser.parseFromString(body, 'text/html');
    this.getResults(document, result);
  }

  private getResults(document: Document, result: ISearchResult) {
    const containers = document.getElementsByClassName('pages');
    if (containers.length > 0) {
      for (let i = 0; i < containers.length; i++) {
        const singleContainer = containers[i];
        const list = singleContainer.getElementsByTagName('div');
        for (let j = 0; j < list.length; j++) {
          const singleItem = list.item(j);
          if (!singleItem) {
            continue;
          }
          const header = singleItem.getElementsByTagName('th')[0];
          if (header == null || header.innerHTML === 'Possible match') {
            const singleResult: ISingleSearchResultItem = {
              title: 'Possible Match',
              thumbUrl: '',
              imageUrl: '',
              sourceUrl: '',
              imageInfo: {},
              searchEngine: 'iqdb',
              description: '',
              weight: ENGINE_WEIGHTS.iqdb - i + Math.random()
            };
            const data = singleItem.getElementsByTagName('td');
            // 0 image
            const imageData = data[0].getElementsByTagName('a')[0];
            if (imageData) {
              let sourceUrl = imageData.getAttribute('href') || '';
              if (sourceUrl.indexOf('http') !== -1) {
                sourceUrl =
                  'http:' +
                  sourceUrl.substring(
                    sourceUrl.indexOf('//'),
                    sourceUrl.length
                  );
              } else if (sourceUrl.indexOf('https') === -1) {
                sourceUrl = 'https:' + sourceUrl;
              }
              singleResult.sourceUrl = sourceUrl === '' ? '' : sourceUrl;
              const thumbUrl = imageData.getElementsByTagName('img')[0];
              if (thumbUrl) {
                const link = thumbUrl.getAttribute('src') || '';

                singleResult.thumbUrl =
                  link === '' ? '' : 'http://iqdb.org/' + link;
                singleResult.imageUrl =
                  link === '' ? '' : 'http://iqdb.org/' + link;
              }
            }
            // 1 uploader info: pass
            // 2 size info
            const sizeInfo = data[2].innerHTML;
            if (sizeInfo) {
              const size = sizeInfo.split(' ')[0].split('×');
              singleResult.imageInfo.width = parseInt(size[0], 0);
              singleResult.imageInfo.height = parseInt(size[1], 0);
            }
            // 3 description
            const description = data[3].innerHTML;
            if (description) {
              singleResult.description = description;
            }
            result.searchResult!.push(singleResult);
          }
        }
      }
    }
  }
}
