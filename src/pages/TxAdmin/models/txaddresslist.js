import { queryCredible } from '@/services/serverapi';

export default {
    namespace: 'txaddresslist',
    state: {
        info: {
            addressCount: 0,
            transactionCount: 0,
            transactionValue: 0,
        },
        list: [
            // {
            //     title: '地址1',
            //     logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
            //     address: '0x3c58d368231ba6853f566e6779de602821728e75',
            //     href: 'https://etherscan.io/address/0x3c58d368231ba6853f566e6779de602821728e75#tokentxns',
            //     percent: '63',
            // },
            // {
            //     title: '地址2',
            //     logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
            //     address: '0x3c58d368231ba6853f566e6779de602821728e75',
            //     href: 'https://etherscan.io/address/0x3c58d368231ba6853f566e6779de602821728e75#tokentxns',
            //     percent: '98',
            // }
        ],
    },
    
    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(queryCredible, payload);
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
                list: action.payload.list,
                info: action.payload.info,
                // userInfo: action.payload.userInfo,
                // txInfo: action.payload.txInfo,
            };
        },
    }
}