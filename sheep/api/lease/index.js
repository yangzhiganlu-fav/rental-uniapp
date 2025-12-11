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
};

export default LeaseApi;
