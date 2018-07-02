import {createAction} from 'redux-actions';

export const nooboxTest        =  createAction('noobox/test');
export const overviewInit      =  createAction('overview/init');
//Auto Refresh
export const autoRefreshSwtich =  createAction('overview/autoRefreshSwitch');
export const autoRefreshUpdate =  createAction('overview/autoRefreshUpdate');

export const imageSearchBegin  =  createAction('overview/imageSearchBegin');