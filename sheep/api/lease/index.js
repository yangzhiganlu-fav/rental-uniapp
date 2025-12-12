import request from '@/sheep/request';

const rentApiPath = '/rent';

const LeaseApi = {
    // 获取租约分页列表
    getLeasePage: (data) => {
        return request({
            url: '/lessor/contract/page',
            method: 'POST',
            data,
            custom: {
                apiPath: rentApiPath,
            },
        });
    },
    // 添加租约
    addLease: (data) => {
        return request({
            url: '/lessor/contract/add',
            method: 'POST',
            data,
            custom: {
                apiPath: rentApiPath,
            },
        });
    },
    // 获取租约详情
    getLeaseDetail: (params) => {
        return request({
            url: '/lessor/contract/detail',
            method: 'GET',
            params,
            custom: {
                apiPath: rentApiPath,
            },
        });
    },
    // 退房
    checkOutLease: (params) => {
        return request({
            url: '/lessor/contract/checkOut',
            method: 'PUT',
            params,
            custom: {
                apiPath: rentApiPath,
            },
        });
    },
    // 更新租约
    updateLease: (data) => {
        return request({
            url: '/lessor/contract/update',
            method: 'POST',
            data,
            custom: {
                apiPath: rentApiPath,
            },
        });
    },
    // 签署租约
    signLease: (params) => {
        return request({
            url: '/lessor/contract/approve',
            method: 'PUT',
            params,
            custom: {
                apiPath: rentApiPath,
            },
        });
    },
};

export default LeaseApi;
