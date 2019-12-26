export interface ISearchByImage {
  imageLink: string;
  cursor: number;
  resultObj: any;
  generateResult(): Promise<void>;
}

export interface ISingleSearchResult {
  title: string | undefined;
  thumbUrl: string | undefined | null;
  imageUrl: string | undefined | null;
  sourceUrl: string | undefined | null;
  imageInfo: any;
  searchEngine: string | undefined | null;
  description: string | undefined | null;
  weight: number;
}
