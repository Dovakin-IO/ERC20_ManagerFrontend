import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm } from '@/services/api';

export default {
  namespace: 'txexport',

  state: {
    checkedValue: '',
    step: {
      payAccount: 'ant-design@alipay.com',
      receiverAccount: 'test@example.com',
      receiverName: 'Alex',
      amount: '500',
    },
  },

  effects: {
    *submitStepForm({ payload }, { call, put }) {
      yield call(fakeSubmitForm, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      yield put(routerRedux.push('/txadmin/export-step-form/result'));
    },
  },

  reducers: {
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        checkedValue: payload.checkedValue,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
  },
};
