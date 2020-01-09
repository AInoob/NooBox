import { ISearchResult } from '../../searchResult/stores/searchResultStore';
import { ajax } from '../../utils/ajax';
import { BaseImageSearch } from './baseImageSearch';

export class TineyeImageSearch extends BaseImageSearch {
  protected async searchInternal(
    imageUrl: string,
    result: ISearchResult,
    updateResultCallback: () => void
  ) {
    const formData = new FormData();
    formData.append('url', imageUrl);
    const postResponse = await ajax({
      url: 'https://tineye.com/search',
      method: 'POST',
      body: formData
    });

    const id = postResponse.body.match(/var base_url = "\/result\/(.*)";/)[1];
    result.engineLink![this.engine] = 'https://tineye.com/search/' + id;
    updateResultCallback();

    throw new Error('Tineye is no longer supported');
  }
}
