import { queryTransaction } from '@/services/serverapi';

export default {
    namespace: 'txdetail',
    state: {
        userInfo: {
            settlement_account_name: '',
            name: '',
            mobile: '',
            cpct_address: '',
        },
        txInfo: {
            txHash: '',
            blockHeight: '',
            timestamp: '',
            token_from: '',
            token_to: '',
            value: '',
            gasLimit: '',
            gasPrice: '',
            gasUsed: '',
        },
    },
    
    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(queryTransaction, payload);
            yield put({
                type: 'save',
                payload: response,
            })
        }
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                userInfo: action.payload.userInfo,
                txInfo: action.payload.txInfo,
            };
        },
    }
}