import { createAction } from 'redux-actions';

export const nooboxTest = createAction('noobox/test');
export const overviewInit = createAction('overview/init');
//Auto Refresh
export const autoRefreshUpdate = createAction('overview/autoRefreshUpdate');
export const imageSearchBegin = createAction('overview/imageSearchBegin');
export const h5WebsiteSwitch = createAction('overview/html5VideoWebsiteSwitch');
//History
export const userHistoryInit = createAction('userHistory/init');
export const userHistoryDeleteSingle = createAction('userHistory/deleteSingle');
export const userHistoryDeleteAll = createAction('userHistory/deleteAll');
export const userHistoryLoadHisotry = createAction(
  'userHistory/loadImageHistory',
);

//options
export const optionsInit = createAction('options/init');
export const optionsCheckEngine = createAction('options/onCheckEngine');
export const optionsCheckTool = createAction('options/onCheckTool');
export const optionsCheckExp = createAction('options/onCheckExp');
export const optionsExpandTree = createAction('options/onExpandTree');
//about
export const aboutInit = createAction('about/init');
export const plusOne = createAction('about/plusOne');
export const updateState = createAction('about/updateState');
