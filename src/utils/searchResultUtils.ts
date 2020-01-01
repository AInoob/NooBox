import { ISingleSearchResultItem } from '../searchResult/stores/searchResultStore';

const imageHeightFor404 = 264 / 475;

export const getImageWidth = (searchResult: ISingleSearchResultItem) => {
  if (
    searchResult.imageInfo.width == null ||
    searchResult.imageInfo.width <= 0
  ) {
    return 1;
  }
  return searchResult.imageInfo.width;
};

export const getImageHeight = (searchResult: ISingleSearchResultItem) => {
  if (
    searchResult.imageInfo.height == null ||
    searchResult.imageInfo.height <= 0
  ) {
    return imageHeightFor404;
  }
  return searchResult.imageInfo.height;
};
