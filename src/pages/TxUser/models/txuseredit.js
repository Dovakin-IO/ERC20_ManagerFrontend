import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryUserEditInfo, updateUserEditInfo } from "@/services/serverapi";

export default {
    namespace: 'txuseredit',
  
    state: {
        user: {
            settlementAccountName: '',
            realName: '',
            mobile: '',
            email: '',
            cpctAddress: '',
            orderId: '',
            areaName: '',
        },
    },
  
    effects: {
      *fetch({ payload }, {call, put}) {
        const response = yield call(queryUserEditInfo, payload);
        if(response) {
            yield put({
                type: 'save',
                payload: response,
            })
        }
      },
      *submitRegularForm({ payload }, { call }) {
        const response = yield call(updateUserEditInfo, payload);
        if(response) {
            if(response.status === "1"){
                message.error(response.message);
            }
            message.success(response.message);
        }
        
      },
    },
  
    reducers: {
      save(state, { payload }) {
          return {
            ...state,
            user: payload,
          }
      },
    },
  };
  