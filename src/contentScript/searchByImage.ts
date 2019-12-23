export interface ISearchByImage {
  link: string;
  cursor: number;
  engineName: string;
  engineWeight: number;
  processUrl(): Promise<void>;
  processData(): Promise<void>;
}
