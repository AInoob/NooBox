import {createSelector} from 'reselect';

export const nooboxSelector      = (state) => state.noobox;
export const overviewSelector    = (state) => {
  const overview  = state.overview;
  // console.log(overview);
  let autoRefresh = {
    ifRefresh: overview.ifRefresh,
    refreshInterval:overview.refreshInterval,
    refreshElapsed:overview.refreshElapsed,
  }
  return{
    inited:overview.inited,
    tabId:overview.tabId,
    autoRefresh,
  }
};
export const optionsSelector     = (state) => {
    const options  = state.options;
    
    let experience = 
    ["history",
    "checkUpdate"];

    let tools = [
      "autoRefresh",
      "videoControl",
      "extractImages",
      "imageSearch",
      "imageSearchNewTabFront",
      "screenshotSearch"];
    let experienceChecked = [];
    let toolsChecked      = [];
    for(let i = 0; i< experience.length; i++){
       if(options[experience[i]] === true){
        experienceChecked[experienceChecked.length] = experience[i];
       }
    }
    for(let i = 0; i< tools.length; i++){
       if(options[tools[i]] === true){
        toolsChecked[toolsChecked.length] = tools[i];
       }
    }
    console.log(toolsChecked);
  return{
    toolsChecked:toolsChecked,
    experienceChecked:experienceChecked,
    ...options,
  }
};
export const userHistorySelector = (state) => state.userHistory;
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