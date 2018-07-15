import {createSelector} from 'reselect';

export const imageSearchSelector     = (state) => state.imageSearch;

export default createSelector(
  [imageSearchSelector],
  (imageSearch) =>{
    return{
      imageSearch
    }
  }
)