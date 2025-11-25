import request from '@/sheep/request';

const HouseApi = {
    // 获得房屋列表
    getHouseList: (params) => {
        return request({
            url: '/member/house/list',
            method: 'GET',
            params,
        });
    },
};

export default HouseApi;
