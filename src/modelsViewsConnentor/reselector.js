import {createSelector} from 'reselect';

export const nooboxSelector      = (state) => state.noobox;
export const overviewSelector    = (state) => state.overview;
export const userHistorySelector = (state) => state.userHistory;
export const optionsSelector     = (state) => state.options;
export default createSelector(
  [nooboxSelector,overviewSelector,userHistorySelector,optionsSelector],
  (noobox,overview,userHistory,options)=>{
  return{
    noobox,
    overview,
    userHistory,
    options,
  }
})