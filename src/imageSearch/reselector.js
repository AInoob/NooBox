import {createSelector} from 'reselect';
import {sortImageByHeight,sortImageByWidth,sortImageByArea} from "SRC/utils/imageUtils";
export const imageSearchSelector     = (state) => {
  let {sortBy,sortByOrder,searchResult} = state.imageSearch;
  if(sortBy === "area"){
    if(sortByOrder !== 0){
      // console.log("1")
      sortImageByArea(searchResult,sortByOrder)
    }else{
      sortByOrder = 2;
    }
  }else if(sortBy === "width"){
    if(sortByOrder !== 0){
      // console.log("2")
        sortImageByWidth(searchResult,sortByOrder)
    }else{
      sortByOrder = 2;
    }
  }else if(sortBy === "height"){
    if(sortByOrder !== 0){
      // console.log("3");
      sortImageByHeight(searchResult,sortByOrder)
    }else{
      sortByOrder = 2;
    }
  }
  return {
    ...state.imageSearch,
    sortyBy:sortBy,
    sortByOrder:sortByOrder,
    searchResult:searchResult,
  };
};

export default createSelector(
  [imageSearchSelector],
  (imageSearch) =>{
    return{
      imageSearch
    }
  }
)