import { queryExceptionTx } from '@/services/serverapi';

export default {
  namespace: 'txexceptiontransaction',

  state: {
    dataless:[],
    datamore:[],
    memberCount: 0,
    paginationless: {
    },
    paginationmore: {
    },
  },

  effects: {
    *fetchLess({ payload }, { call, put }) {
        const response = yield call(queryExceptionTx, payload);
        yield put({
            type: 'saveless',
            payload: response,
        })

    },
    *fetchMore({ payload }, { call, put }) {
        const response = yield call(queryExceptionTx, payload);
        yield put({
            type: 'savemore',
            payload: response,
        })
    },
  },

  reducers: {
    saveless(state, { payload }) {
        return {
            ...state,
            dataless: payload.list,
            memberCount: payload.memberCount,
            paginationless: payload.page,
        }
    },
    savemore(state, { payload }) {
        return {
            ...state,
            datamore: payload.list,
            memberCount: payload.memberCount,
            paginationmore: payload.page,
        }
    },
    save(state, { payload }) {
        return {
          ...state,
          data: payload.list,
          pagination: payload.page,
        };
    },
  },
};
