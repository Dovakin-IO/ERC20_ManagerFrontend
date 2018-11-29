import { queryUserInfo, addContractAddress,exportVoucherPDF, queryMemberLog } from "@/services/serverapi";
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
    logs: [],
    mutiUser: [],
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
        });
        yield put({
          type: "fetch",
          payload: {
            settlement_account_name: response.settlement_account_name
          }
        });
      }
    },
    *export({ payload }, { call, put }) {
      const response = yield call(exportVoucherPDF, payload);
      if(response) {
          setTimeout(window.open("http://47.244.9.96:8083/" + response.uri), 500);
          // window.open("http://192.168.0.194:8083/" + response.uri);
          notification.open({
            message: "正在导出！!!!!!",
            description: "电子回执单将以PDF格式的文件下载到您的电脑，请注意查看",
            style: {
              width: 600,
              marginLeft: 335 - 600,
            },
          });
      }
  }
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        logs: payload.logs,
        list: payload.list,
        user: payload.user,
        mutiUser: payload.mutiUser,
      };
    },
    add(state, { payload }) {
      return {
        ...state,
        isAddSuccess: payload.status,
      };
    }
  }
};
