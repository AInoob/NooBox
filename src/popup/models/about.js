import ajax from 'SRC/utils/ajax.js';
import io from 'socket.io-client';
export default {
  namespace: 'about',
  state: {
    socket: null,
    inited: false,
    imageSearch: 0,
    extractImage: 0,
    screenshotSearch: 0,
    videoControl: 0,
    autoRefresh: 0,
  },
  effects: {
    *init({ payload, dispatch }, { call, put }) {
      const data = yield call(
        ajax,
        'https://ainoob.com/api/public/data/?x=' + Math.random(),
        { method: 'GET' },
      );
      if (data.data) {
        let {
          imageSearch,
          extractImage,
          screenshotSearch,
          videoControl,
          autoRefresh,
        } = data.data;
        yield put({
          type: 'updateState',
          payload: {
            inited: true,
            imageSearch: imageSearch,
            extractImage: extractImage,
            screenshotSearch: screenshotSearch,
            videoControl: videoControl,
            autoRefresh: autoRefresh,
            socketListener: false,
          },
        });
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return Object.assign({}, state, payload);
    },
    plusOne(state, { payload }) {
      let obj = {};
      let data = state[payload];
      obj[payload] = data + 1;
      return Object.assign({}, state, obj);
    },
  },
  subscriptions: {
    dataSubscription({ dispatch }) {
      const socket = io('https://ainoob.com:443/');
      const plusOneGenerator = section => {
        return function() {
          dispatch({
            type: 'plusOne',
            payload: section,
          });
        };
      };
      socket.on('imageSearch', plusOneGenerator('imageSearch'));
      socket.on('extractImage', plusOneGenerator('extractImage'));
      socket.on('screenshotSearch', plusOneGenerator('screenshotSearch'));
      socket.on('videoControl', plusOneGenerator('videoControl'));
      socket.on('autoRefresh', plusOneGenerator('autoRefresh'));
    },
  },
};
