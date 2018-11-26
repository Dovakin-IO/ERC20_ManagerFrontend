import { queryUserList } from "@/services/serverapi";
import { notification } from "antd";

export default {
  namespace: "txuserlist",

  state: {
    data: [],
    pagination: {
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUserList, payload);
      yield put({
        type: "save",
        payload: response
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        data: payload.list,
        pagination: payload.page,
      };
    },
  }
};
