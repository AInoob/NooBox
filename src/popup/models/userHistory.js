import { getDB, deleteDB, setDB } from 'SRC/utils/db.js';
import { getCurrentTab, sendMessage } from 'SRC/utils/browserUtils';
export default {
  namespace: 'userHistory',
  state: {
    inited: false,
  },
  effects: {
    *test({ payload }, { put, select }) {
      console.log(payload);
    },
    *init({ payload }, { put, call }) {
      let imageCursor = yield getDB('imageCursor');
      let dbData = [];
      if (imageCursor != null) {
        for (let i = imageCursor; i >= 0; i--) {
          let data = yield getDB(i);
          // console.log(data);
          if (data) {
            dbData[dbData.length] = {
              dbKey: i,
              data: data,
            };
          }
        }
      }
      // if imageCursor doesn't exist, then finish loading and return empty data
      yield put({
        type: 'updateState',
        payload: {
          dbData: dbData,
          inited: true,
        },
      });
    },
    *deleteSingle({ payload }, { select, put, call }) {
      yield call(deleteDB, payload);
      let { dbData } = yield select(state => state.userHistory);
      let newdbData = dbData.filter(e => e.dbKey !== payload);
      yield put({
        type: 'updateState',
        payload: {
          dbData: newdbData,
        },
      });
    },
    *deleteAll({ payload }, { put, call }) {
      let imageCursor = yield getDB('imageCursor');
      if (imageCursor != null) {
        for (let i = 0; i <= imageCursor; i++) {
          yield call(deleteDB, i);
        }
        yield call(setDB, 'imageCursor', -1);
      }
      yield put({
        type: 'updateState',
        payload: {
          dbData: [],
        },
      });
    },
    *loadImageHistory({ payload }, { put, call }) {
      yield call(sendMessage, {
        job: 'loadImageHistory',
        cursor: payload,
      });
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return Object.assign({}, state, payload);
    },
  },
};
