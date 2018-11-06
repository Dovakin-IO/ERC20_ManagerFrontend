import { queryTransactions, exportVoucherPDF } from '@/services/serverapi';
import { stat } from 'fs';

export default {
    namespace: 'tx',

    state: {
        data: [],
        pagination: {
        },
    },

    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(queryTransactions, payload);
            yield put({
                type: 'save',
                payload: response,
            })
        },
        *export({ payload }, { call, put }) {
            const response = yield call(exportVoucherPDF, payload);
            if(response) {
                window.open("http://localhost:8083/" + response.uri);
            }
        }
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                data: action.payload.list,
                pagination: action.payload.page,
            };
        },
    },
};