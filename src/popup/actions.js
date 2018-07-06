import {createAction} from 'redux-actions';

export const nooboxTest         =  createAction('noobox/test');
export const overviewInit       =  createAction('overview/init');
//Auto Refresh
export const autoRefreshUpdate  =  createAction('overview/autoRefreshUpdate');
export const imageSearchBegin   =  createAction('overview/imageSearchBegin');

export const optionsInit        =  createAction('options/init');
export const optionsCheckEngine =  createAction('options/onCheckEngine');
export const optionsCheckTool   =  createAction('options/onCheckTool');
export const optionsCheckExp    =  createAction('options/onCheckExp');
