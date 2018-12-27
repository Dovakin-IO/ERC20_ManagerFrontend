import { stringify } from 'qs';
import request from '@/utils/request';

// export async function queryTransactions(params) {
//     return request(`/api/api/tx?${stringify(params)}`);
// }


export async function queryTransactions(params) {
    return request('/api/api/tx', {
        method: 'POST',
        body: {
            ...params,
        }
    })
}

export async function queryTransaction(params) {
    return request('/api/api/tx/detail', {
        method: 'POST',
        body: {
            ...params,
        }
    })
}

export async function queryUserInfo(params) {
    return request('/api/api/user/detail', {
        method: 'POST',
        body: {
            ...params,
        }
    })
}

export async function queryUserList(params) {
    return request('/api/api/user/list', {
        method: 'POST',
        body: {
            ...params,
        }
    })
}

export async function queryUserEditInfo(params) {
    return request('/api/api/user/editinfo', {
        method: 'POST',
        body: {
            ...params,
        }
    })
}

export async function updateUserEditInfo(params) {
    return request('/api/api/user/edit', {
        method: 'POST',
        body: {
            ...params,
        }
    })
}

export async function addContractAddress(params) {
    return request('/api/api/address/add', {
        method: 'POST',
        body: {
            ...params,
        }
    })
}

export async function queryCredible(params) {
    return request('/api/api/admin/credible', {
        method: 'POST',
        body: {
            ...params,
        }
    })
}

export async function exportVoucherPDF(params) {
    return request('/api/api/export/voucher', {
        method: 'POST',
        body: {
            ...params,
        }
    })
}

export async function exportMember(params) {
    return request('/api/api/export/member', {
        method: 'POST',
        body: {
            ...params,
        }
    })
}

export async function queryMemberLog(params) {
    return request('/api/api/log/member', {
        method: 'POST',
        body: {
            ...params,
        }
    })
}

export async function queryExceptionTx(params) {
    return request('/api/api/tx/exception', {
        method: 'POST',
        body: {
            ...params,
        }
    })
}