import {
  ISearchResult,
  ISingleSearchResultItem
} from '../../searchResult/stores/searchResultStore';
import { ajax } from '../../utils/ajax';
import { ENGINE_WEIGHTS, EngineType } from '../../utils/constants';
import { BaseImageSearch } from './baseImageSearch';

const YANDEX_BASE_URL = 'https://yandex.com/images/search';

interface IKeywordInfo {
  engine: EngineType;
  keyword: string;
  keywordLink: string;
}

export class YandexImageSearch extends BaseImageSearch {
  public async extractForDebug(html: string, responseUrl: string) {
    let document = this.domParser.parseFromString(html, 'text/html');
    const initialTitle = document?.title || '';
    const ensured = await this.ensureResultsDocument(document, responseUrl);
    document = ensured.document;
    const baseUrl = ensured.responseUrl || responseUrl || YANDEX_BASE_URL;
    const state = this.extractState(document);

    const keyword = this.extractKeyword(document, state);
    const results = this.extractResultItems(document, baseUrl, state);

    return {
      title: document?.title || initialTitle,
      keywords: keyword ? [keyword] : [],
      results
    };
  }

  protected async searchInternal(
    imageUrl: string,
    result: ISearchResult,
    updateResultCallback: () => void
  ) {
    const { body, responseUrl } = await ajax({
      url: this.buildSearchUrl(imageUrl),
      debugTag: 'yandex:search',
      debugBody: true
    });

    result.engineLink![this.engine] = responseUrl;
    updateResultCallback();

    let document = this.domParser.parseFromString(body, 'text/html');
    const ensured = await this.ensureResultsDocument(document, responseUrl);
    document = ensured.document;
    const baseUrl = ensured.responseUrl || responseUrl || YANDEX_BASE_URL;

    const state = this.extractState(document);

    this.appendKeyword(document, result, state);
    this.appendResults(document, result, state, baseUrl);
  }

  private buildSearchUrl(imageUrl: string) {
    return `${YANDEX_BASE_URL}?url=${encodeURIComponent(
      imageUrl
    )}&rpt=imageview`;
  }

  private async ensureResultsDocument(
    document: Document,
    responseUrl: string
  ): Promise<{ document: Document; responseUrl: string }> {
    if (this.hasResults(document)) {
      return { document, responseUrl };
    }

    const bem = document.body?.getAttribute('data-bem');
    if (!bem) {
      return { document, responseUrl };
    }

    try {
      const parsed = JSON.parse(bem);
      const retpath = parsed?.['i-global']?.retpath;
      if (retpath) {
        const normalized = this.absolutize(retpath, responseUrl);
        const { body, responseUrl: retpathResponseUrl } = await ajax({
          url: normalized,
          debugTag: 'yandex:retpath',
          debugBody: false
        });
        const nextDocument = this.domParser.parseFromString(body, 'text/html');
        if (this.hasResults(nextDocument)) {
          return {
            document: nextDocument,
            responseUrl: retpathResponseUrl || normalized
          };
        }
      }
    } catch {
      // ignore JSON errors
    }

    return { document, responseUrl };
  }

  private hasResults(document: Document) {
    return !!document.querySelector(
      '.serp-list, .cbir-section, .similar__thumbs, .other-sites__container'
    );
  }

  private appendKeyword(
    document: Document,
    result: ISearchResult,
    state?: any
  ) {
    const keyword = this.extractKeyword(document, state);
    if (!keyword) {
      return;
    }
    result.searchImageInfo!.push(keyword);
  }

  private appendResults(
    document: Document,
    result: ISearchResult,
    state: any,
    baseUrl: string
  ) {
    const items = this.extractResultItems(document, baseUrl, state);
    items.forEach((item) => result.searchResult!.push(item));
  }

  private extractKeyword(document: Document, state?: any): IKeywordInfo | null {
    const keywordFromState = this.extractKeywordFromState(state);
    const titleCandidate = document.querySelector('.cbir-intent__title');
    const textFromTitle = titleCandidate?.textContent?.trim();
    let keyword = keywordFromState || textFromTitle;

    if (!keyword) {
      const headerInput = document.querySelector(
        'input[name="text"], input[type="search"]'
      ) as HTMLInputElement | null;
      keyword = headerInput?.value?.trim();
    }

    if (!keyword) {
      return null;
    }

    return {
      engine: this.engine,
      keyword,
      keywordLink: `${YANDEX_BASE_URL}?text=${encodeURIComponent(keyword)}`
    };
  }

  private extractResultItems(document: Document, baseUrl: string, state?: any) {
    const items: ISingleSearchResultItem[] = [];
    const seen = new Set<string>();
    let order = 0;

    const pushItem = (item: ISingleSearchResultItem) => {
      const signature = `${item.sourceUrl}|${item.imageUrl}`;
      if (seen.has(signature)) {
        return;
      }
      seen.add(signature);
      item.weight = ENGINE_WEIGHTS.yandex - order + Math.random();
      items.push(item);
      order++;
    };

    const usedState =
      this.collectStateSimilarImages(state, baseUrl, pushItem) +
        this.collectStateSites(state, baseUrl, pushItem) >
      0;

    if (!usedState) {
      this.collectSimilarImages(document, baseUrl, pushItem);
      this.collectSiteResults(document, baseUrl, pushItem);
    }

    if (!items.length) {
      this.collectLegacyResults(document, baseUrl, pushItem);
    }

    return items;
  }

  private collectSimilarImages(
    document: Document,
    baseUrl: string,
    pushItem: (item: ISingleSearchResultItem) => void
  ) {
    const selectors = [
      '.serp-list [role="listitem"] a img',
      '.serp-list a img',
      '.justifier__item a img'
    ];
    const images = Array.from(
      document.querySelectorAll<HTMLImageElement>(selectors.join(','))
    );

    images.forEach((img) => {
      const anchor = img.closest('a');
      if (!anchor) {
        return;
      }

      const thumbRaw =
        img.getAttribute('src') || img.getAttribute('data-src') || '';
      const thumb = this.absolutize(thumbRaw, baseUrl);
      const title =
        this.cleanText(img.getAttribute('alt')) ||
        this.cleanText(anchor.getAttribute('aria-label')) ||
        this.cleanText(anchor.getAttribute('title')) ||
        'Similar image';

      const width = this.parseDimension(
        img.getAttribute('width') || img.getAttribute('data-width')
      );
      const height = this.parseDimension(
        img.getAttribute('height') || img.getAttribute('data-height')
      );

      const item: ISingleSearchResultItem = {
        title,
        thumbUrl: thumb,
        imageUrl: thumb,
        sourceUrl: this.unwrapClick(anchor.getAttribute('href') || '', baseUrl),
        imageInfo: this.buildImageInfo(width, height),
        searchEngine: 'yandex',
        description: '',
        weight: ENGINE_WEIGHTS.yandex
      };

      pushItem(item);
    });
  }
  private extractState(document: Document) {
    try {
      const stateNode = document.querySelector(
        '[data-state*="initialState"][id^="ImagesApp-"]'
      );
      if (!stateNode) {
        return null;
      }
      const raw = stateNode.getAttribute('data-state');
      if (!raw) {
        return null;
      }
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private extractKeywordFromState(state?: any) {
    if (!state || !state.initialState) {
      return null;
    }
    const tags = state.initialState?.cbirTags?.tags;
    if (Array.isArray(tags)) {
      const tag = tags.find(
        (item: any) => typeof item?.text === 'string' && item.text.trim()
      );
      if (tag) {
        return this.cleanText(tag.text);
      }
    }

    const searchText =
      state.initialState?.internalState?.searchInputText ||
      state.initialState?.internalState?.query;
    return this.cleanText(searchText) || null;
  }

  private collectStateSimilarImages(
    state: any,
    baseUrl: string,
    pushItem: (item: ISingleSearchResultItem) => void
  ) {
    const thumbs = state?.initialState?.cbirSimilar?.thumbs;
    if (!Array.isArray(thumbs) || !thumbs.length) {
      return 0;
    }

    thumbs.forEach((thumb: any) => {
      const image = this.absolutize(thumb?.imageUrl || '', baseUrl);
      const source = this.absolutize(thumb?.linkUrl || '', baseUrl);
      if (!source && !image) {
        return;
      }

      const width = this.parseDimension(thumb?.width);
      const height = this.parseDimension(thumb?.height);

      const item: ISingleSearchResultItem = {
        title: this.cleanText(thumb?.title) || 'Similar image',
        thumbUrl: image,
        imageUrl: image,
        sourceUrl: source || image,
        imageInfo: this.buildImageInfo(width, height),
        searchEngine: 'yandex',
        description: '',
        weight: ENGINE_WEIGHTS.yandex
      };

      pushItem(item);
    });

    return thumbs.length;
  }

  private collectStateSites(
    state: any,
    baseUrl: string,
    pushItem: (item: ISingleSearchResultItem) => void
  ) {
    const sitesBuckets = [
      state?.initialState?.cbirSites?.sites,
      state?.initialState?.cbirSitesList?.sites
    ];
    const flattened: any[] = [];
    sitesBuckets.forEach((bucket) => {
      if (Array.isArray(bucket)) {
        bucket.forEach((entry) => flattened.push(entry));
      }
    });

    if (!flattened.length) {
      return 0;
    }

    flattened.forEach((site) => {
      const thumbUrl = site?.thumb?.url || site?.thumbUrl;
      const originalUrl = site?.originalImage?.url || site?.imageUrl;
      const sourceUrl = site?.url || site?.link;
      if (!sourceUrl) {
        return;
      }

      const width =
        this.parseDimension(site?.originalImage?.width) ||
        this.parseDimension(site?.thumb?.width);
      const height =
        this.parseDimension(site?.originalImage?.height) ||
        this.parseDimension(site?.thumb?.height);

      const item: ISingleSearchResultItem = {
        title:
          this.cleanText(site?.title) ||
          this.cleanText(site?.domain) ||
          sourceUrl,
        thumbUrl: this.absolutize(thumbUrl || '', baseUrl),
        imageUrl: this.absolutize(originalUrl || thumbUrl || '', baseUrl),
        sourceUrl: this.unwrapClick(sourceUrl, baseUrl),
        imageInfo: this.buildImageInfo(width, height),
        searchEngine: 'yandex',
        description: this.cleanText(site?.description) || '',
        weight: ENGINE_WEIGHTS.yandex
      };

      pushItem(item);
    });

    return flattened.length;
  }

  private collectSiteResults(
    document: Document,
    baseUrl: string,
    pushItem: (item: ISingleSearchResultItem) => void
  ) {
    const selectors = [
      '.cbir-section .cbir-section__item',
      '.cbir-section .SitesList-Item',
      '.cbir-section .cbir-sites__item',
      '.cbir-sites__list .cbir-sites__item',
      '.other-sites__container li'
    ];

    const containers = Array.from(
      document.querySelectorAll<HTMLElement>(selectors.join(','))
    );

    containers.forEach((container) => {
      const anchor = container.querySelector<HTMLAnchorElement>('a[href]');
      if (!anchor) {
        return;
      }

      const href = this.unwrapClick(anchor.getAttribute('href') || '', baseUrl);
      if (!href) {
        return;
      }

      const thumbImg = container.querySelector<HTMLImageElement>('img');
      const width = this.parseDimension(thumbImg?.getAttribute('width'));
      const height = this.parseDimension(thumbImg?.getAttribute('height'));
      const thumb = thumbImg
        ? this.absolutize(
            thumbImg.getAttribute('src') ||
              thumbImg.getAttribute('data-src') ||
              '',
            baseUrl
          )
        : '';

      const descriptionNode = container.querySelector(
        '[class*="desc"], .cbir-sites__subtitle, .cbir-sites__snippet, p, span'
      );

      const item: ISingleSearchResultItem = {
        title:
          this.cleanText(anchor.textContent) ||
          this.cleanText(anchor.getAttribute('title')) ||
          href,
        thumbUrl: thumb,
        imageUrl: thumb,
        sourceUrl: href,
        imageInfo: this.buildImageInfo(width, height),
        searchEngine: 'yandex',
        description: this.cleanText(descriptionNode?.textContent) || '',
        weight: ENGINE_WEIGHTS.yandex
      };

      pushItem(item);
    });
  }

  private parseDimension(value: any) {
    if (value === null || value === undefined) {
      return undefined;
    }
    const num = Number(value);
    return Number.isFinite(num) ? num : undefined;
  }

  private buildImageInfo(width?: number, height?: number) {
    const info: { width?: number; height?: number } = {};
    if (typeof width === 'number') {
      info.width = width;
    }
    if (typeof height === 'number') {
      info.height = height;
    }
    return info;
  }

  private collectLegacyResults(
    document: Document,
    baseUrl: string,
    pushItem: (item: ISingleSearchResultItem) => void
  ) {
    const similar = document.getElementsByClassName('similar__thumbs');
    if (similar.length > 0) {
      const similarList = Array.from(similar[0].getElementsByTagName('li'));
      for (const singleItem of similarList) {
        const singleResult: ISingleSearchResultItem = {
          title: 'Yandex',
          thumbUrl: '',
          imageUrl: '',
          sourceUrl: '',
          imageInfo: {},
          searchEngine: 'yandex',
          description: '',
          weight: ENGINE_WEIGHTS.yandex
        };
        const imageSource = singleItem.getElementsByTagName('a')[0];
        singleResult.sourceUrl = this.absolutize(
          imageSource.getAttribute('href') || '',
          baseUrl
        );

        const imagePart = singleItem.getElementsByTagName('img')[0];
        const src = imagePart.getAttribute('src');
        if (src) {
          const abs = this.absolutize(src, baseUrl);
          singleResult.thumbUrl = abs;
          singleResult.imageUrl = abs;
        }
        pushItem(singleResult);
      }
    }

    const otherSite = document.getElementsByClassName('other-sites__container');
    if (otherSite.length > 0) {
      const otherSiteList = Array.from(otherSite[0].getElementsByTagName('li'));
      for (const singleItem of otherSiteList) {
        const singleResult: ISingleSearchResultItem = {
          title: '',
          thumbUrl: '',
          imageUrl: '',
          sourceUrl: '',
          imageInfo: {},
          searchEngine: 'yandex',
          description: '',
          weight: ENGINE_WEIGHTS.yandex
        };
        const thumbUrl = singleItem
          .getElementsByClassName('other-sites__preview-link')[0]
          ?.getAttribute('href');
        if (thumbUrl) {
          singleResult.thumbUrl = this.absolutize(thumbUrl, baseUrl);
          singleResult.imageUrl = singleResult.thumbUrl;
        }
        const title = singleItem.getElementsByClassName(
          'other-sites__snippet-title-link'
        )[0];
        if (title) {
          singleResult.title = this.cleanText(title.textContent) || '';
          singleResult.sourceUrl = this.absolutize(
            title.getAttribute('href') || '',
            baseUrl
          );
        }
        const descriptionNode = singleItem.getElementsByClassName(
          'other-sites__snippet-desc'
        )[0];
        if (descriptionNode) {
          singleResult.description = this.cleanText(
            descriptionNode.textContent
          ) as string;
        }
        pushItem(singleResult);
      }
    }
  }

  private absolutize(url: string, base: string) {
    if (!url) {
      return '';
    }
    try {
      return new URL(url, base || YANDEX_BASE_URL).toString();
    } catch {
      return url;
    }
  }

  private unwrapClick(url: string, base: string) {
    const absolute = this.absolutize(url, base);
    try {
      const parsed = new URL(absolute);
      if (
        /yandex\.(ru|com)$/i.test(parsed.hostname) &&
        parsed.pathname.startsWith('/clck')
      ) {
        const actual =
          parsed.searchParams.get('url') ||
          parsed.searchParams.get('redir') ||
          parsed.searchParams.get('data');
        if (actual) {
          return actual;
        }
      }
    } catch {
      return absolute;
    }
    return absolute;
  }

  private cleanText(raw?: string | null) {
    return raw ? raw.replace(/\s+/g, ' ').trim() : '';
  }
}
