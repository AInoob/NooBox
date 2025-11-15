import { imageSearchDao } from '../../dao/imageSearchDao';
import { ISearchResult } from '../../searchResult/stores/searchResultStore';
import { EngineType } from '../../utils/constants';
import { get } from '../../utils/db';
import { logDebug } from '../../utils/debugReporter';
import { createDomParser } from '../../utils/domParser';
import { sendMessageToFrontend } from '../../utils/sendMessageToFrontend';

export class BaseImageSearch {
  protected readonly engine: EngineType;
  protected readonly domParser = createDomParser();

  constructor(engine: EngineType) {
    this.engine = engine;
  }

  public async search(imageUrl: string, cursor: number, result: ISearchResult) {
    await logDebug({
      event: 'engine:start',
      engine: this.engine,
      url: imageUrl
    });

    if (!(await get(('imageSearchUrl_' + this.engine) as any))) {
      result.engineStatus![this.engine] = 'disabled';
      this.updateSearchResult(cursor, result);
      return;
    }
    result.engineStatus![this.engine] = 'loading';
    this.updateSearchResult(cursor, result);
    try {
      await this.searchInternal(imageUrl, result, () => {
        this.updateSearchResult(cursor, result);
      });
      result.engineStatus![this.engine] = 'loaded';
      await logDebug({
        event: 'engine:loaded',
        engine: this.engine,
        url: imageUrl
      });
      this.updateSearchResult(cursor, result);
    } catch (e) {
      console.error(e);
      result.engineStatus![this.engine] = 'error';
      await logDebug({
        event: 'engine:error',
        engine: this.engine,
        url: imageUrl,
        error: e instanceof Error ? e.message : String(e)
      });
      this.updateSearchResult(cursor, result);
    }
  }

  protected async searchInternal(
    _imageUrl: string,
    _result: ISearchResult,
    _updateResultCallback: () => void
  ) {
    throw new Error('Method must be override');
  }

  private updateSearchResult(cursor: number, result: ISearchResult) {
    imageSearchDao
      .add({
        id: cursor,
        createdAt: Date.now(),
        result
      })
      .then(() => {
        sendMessageToFrontend({
          job: 'image_result_update',
          value: {
            cursor
          }
        }).catch(console.error);
      });
  }
}
