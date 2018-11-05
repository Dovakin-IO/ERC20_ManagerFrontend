import { queryUserInfo, addContractAddress } from "@/services/serverapi";
import { notification } from "antd";

export default {
  namespace: "txuser",

  state: {
    user: {
      settlement_account_name: "",
      real_name: "",
      mobile: "",
      create_time: "",
      order_id: "",
      cpct_address: "",
      transferFromCount: 0,
      transferToCount: 0,
      transferTotal: 0
    },
    list: [],
    isAddSuccess: ""
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUserInfo, payload);
      yield put({
        type: "save",
        payload: response
      });
    },
    *addAddress({ payload }, { call, put }) {
      const response = yield call(addContractAddress, payload);
      if (response) {
        if (response.status == "1") {
          notification.open({
            message: "修改失败！",
            description: "不能重复添加地址！"
          });
          return;
        }
        notification.open({
          message: "修改成功！",
          description: "请牢记您的新地址，之前的地址不再可用"
        });
        yield put({
          type: "add",
          payload: response,
          isModifyAddress: true
        });
        yield put({
          type: "fetch",
          payload: {
            settlement_account_name: response.settlement_account_name
          }
        });
      }
    }
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        list: payload.list,
        user: payload.user
      };
    },
    add(state, { payload }) {
      return {
        ...state,
        isAddSuccess: payload.status
      };
    }
  }
};
