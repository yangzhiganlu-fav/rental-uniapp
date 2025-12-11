import request from '@/sheep/request';

const DictApi = {
    // 根据字典类型查询字典数据信息
    getDictDataListByType: (type) => {
        return request({
            url: `/system/dict-data/type`,
            method: 'GET',
            params: {
                type,
            },
        });
    },
    // 根据字典类型分页查询字典数据信息
    getDictDataListByTypePage: (type, pageNo = 1, pageSize = 100) => {
        return request({
            url: `/system/dict-data/page`,
            method: 'GET',
            params: {
                dictType: type,
                pageNo,
                pageSize,
            },
        });
    },
};

export default DictApi;
