import request from '@/sheep/request';
import { rentApiPath } from '@/sheep/config';

const HouseApi = {
    // 获得小区列表
    getCommunityList: (params) => {
        return request({
            url: '/lessor/community/list',
            method: 'POST',
            params,
            custom: {
                apiPath: rentApiPath,
            },
        });
    },
    // 获取小区->房屋->房间分页列表
    getRoomPage: (data) => {
        return request({
            url: '/lessor/room/page',
            method: 'POST',
            data,
            custom: {
                apiPath: rentApiPath,
            },
        });
    },
    // 添加整租房
    addSingleRoom: (data) => {
        return request({
            url: '/lessor/room/addSingleRoom',
            method: 'POST',
            data,
            custom: {
                apiPath: rentApiPath,
            },
        });
    },
    // 添加合租房
    addMultiRoom: (data) => {
        return request({
            url: '/lessor/room/addMultiRoom',
            method: 'POST',
            data,
            custom: {
                apiPath: rentApiPath,
            },
        });
    },
    // 查询房间信息
    getRoomHouseInfo: (params) => {
        return request({
            url: '/lessor/room/houseInfo',
            method: 'GET',
            params,
            custom: {
                apiPath: rentApiPath,
            },
        });
    },
    // 合租-添加一个新房间
    addNewRoom: (data) => {
        return request({
            url: '/lessor/room/addNewRoom',
            method: 'POST',
            data,
            custom: {
                apiPath: rentApiPath,
            },
        });
    },
    // 获取房间详情
    getRoomDetail: (params) => {
        return request({
            url: '/lessor/room/detail',
            method: 'GET',
            params,
            custom: {
                apiPath: rentApiPath,
            },
        });
    },
};

export default HouseApi;
