import request from '@/sheep/request';
import { rentApiPath } from '@/sheep/config';

const CountApi = {
    // 获取经营概览数据
    getCountData: () => {
        return request({
            url: '/lessor/common/count',
            method: 'GET',
            custom: {
                apiPath: rentApiPath,
            },
        });
    },
};

export default CountApi;
