import { routerRedux } from 'dva/router';
import {
  OVERVIEW_URL,
  HISTORY_URL,
  OPTIONS_URL,
  ABOUT_URL,
} from 'SRC/constant/navURL.js';
export default {
  namespace: 'noobox',
  state: {},
  effects: {
    *pushToOverview({ payload }, { put }) {
      yield put(routerRedux.push(OVERVIEW_URL));
      yield put({ type: 'overview/init' });
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return Object.assign({}, state, payload);
    },
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname == '/') {
          console.log('trigger');
          dispatch({ type: 'pushToOverview' });
        }
      });
    },
  },
};
