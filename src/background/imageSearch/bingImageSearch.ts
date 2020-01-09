import {
  ISearchResult,
  ISingleSearchResultItem
} from '../../searchResult/stores/searchResultStore';
import { ajax } from '../../utils/ajax';
import { ENGINE_WEIGHTS } from '../../utils/constants';
import { BaseImageSearch } from './baseImageSearch';

export class BingImageSearch extends BaseImageSearch {
  protected async searchInternal(
    imageUrl: string,
    result: ISearchResult,
    updateResultCallback: () => void
  ) {
    const queryString = new URLSearchParams();
    queryString.append('view', 'detailv2');
    queryString.append('iss', 'sbi');
    queryString.append('FORM', 'SBIIRP');
    queryString.append('q', 'imgurl:' + imageUrl);
    queryString.append('idpbck', '1');

    const { body, responseUrl } = await ajax({
      url: 'https://www.bing.com/images/search?' + queryString.toString(),
      method: 'GET'
    });
    result.engineLink![this.engine] = responseUrl;
    updateResultCallback();

    const searchResult = await this.fetchResult(imageUrl, body);
    this.getResults(searchResult, result);
  }

  private getResults(searchResult: any, result: ISearchResult) {
    const {
      imageBasedRelatedSearches,
      relatedSearches,
      visuallySimilarImages
    } = searchResult;
    if (imageBasedRelatedSearches) {
      imageBasedRelatedSearches.value
        .slice(0, 15)
        .forEach((r: any, i: number) => {
          const singleResult: ISingleSearchResultItem = {
            title: r.text,
            thumbUrl: r.thumbnail.url,
            imageUrl: r.thumbnail.url,
            sourceUrl: r.webSearchUrl,
            imageInfo: {},
            searchEngine: 'bing',
            description: '',
            weight: ENGINE_WEIGHTS.bing - i + Math.random()
          };
          result.searchResult!.push(singleResult);
        });
    }
    if (relatedSearches) {
      relatedSearches.value.slice(0, 15).forEach((r: any, i: number) => {
        const singleResult: ISingleSearchResultItem = {
          title: r.text,
          thumbUrl: r.thumbnail.url,
          imageUrl: r.thumbnail.url,
          sourceUrl: r.webSearchUrl,
          imageInfo: {},
          searchEngine: 'bing',
          description: '',
          weight: ENGINE_WEIGHTS.bing - i + Math.random()
        };
        result.searchResult!.push(singleResult);
      });
    }
    if (visuallySimilarImages) {
      visuallySimilarImages.value.slice(0, 15).forEach((r: any, i: number) => {
        const singleResult: ISingleSearchResultItem = {
          title: r.name,
          thumbUrl: r.contentUrl,
          imageUrl: r.contentUrl,
          sourceUrl: r.hostPageUrl,
          imageInfo: {
            height: r.height,
            width: r.width
          },
          searchEngine: 'bing',
          description: '',
          weight: ENGINE_WEIGHTS.bing - i + Math.random()
        };
        result.searchResult!.push(singleResult);
      });
    }
  }

  private async fetchResult(imageUrl: string, body: string) {
    const { skey, ig } = this.getSKeyAndIG(body);
    const queryString = new URLSearchParams();
    queryString.append(
      'modules',
      'brq,objectdetection,objectrecognition,imagebasedrelatedsearches,relatedsearches,image,caption,similarimages,similarproducts'
    );
    queryString.append('imgurl', imageUrl);
    queryString.append('rshighlight', 'true');
    queryString.append('textDecorations', 'true');
    queryString.append('internalFeatures', 'share');
    queryString.append('skey', skey);
    queryString.append('safeSearch', 'Strict');
    queryString.append('IG', ig);
    queryString.append('IID', 'idpins');
    queryString.append('SFX', '1');
    const baseURL = 'https://www.bing.com/images/api/custom/details?';

    const searchResponse = await ajax({
      url: baseURL + queryString.toString(),
      method: 'GET'
    });
    return JSON.parse(searchResponse.body);
  }

  private getSKeyAndIG(body: string) {
    let ig;
    let skey;
    const igStart = body.indexOf('IG:"');
    const igEnd = body.indexOf('",EventID');
    const skeyStart = body.indexOf('skey=');
    const skeyEnd = body.indexOf('&amp;');
    if (igStart !== -1 && igEnd !== -1) {
      const igString = body.substring(igStart, igEnd);
      ig = igString.substring(igString.indexOf('"') + 1, igString.length);
    }
    if (skeyStart !== -1 && skeyEnd !== -1) {
      const skeyEqu = body.substring(skeyStart, skeyEnd);
      skey = skeyEqu.substring(skeyEqu.indexOf('=') + 1, skeyEqu.length);
    }

    if (!ig || !skey) {
      throw new Error('Missing ig & skey');
    }
    return {
      ig,
      skey
    };
  }
}
