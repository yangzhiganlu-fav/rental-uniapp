import { defineStore } from 'pinia';
import $share from '@/sheep/platform/share';
import { clone, cloneDeep } from 'lodash-es';
import app from './app';
import { showAuthModal } from '@/sheep/hooks/useModal';
import UserApi from '@/sheep/api/system/user';

// 默认用户信息
const defaultUserInfo = {
    id: 0, // 用户ID
    username: '', // 用户名
    nickname: '', // 昵称
    avatar: '', // 头像
    sex: 0, // 性别
    mobile: '', // 手机号
    email: '', // 邮箱
    deptId: 0, // 部门ID
    deptName: '', // 部门名称
    postIds: [], // 岗位ID数组
    status: 0, // 状态
    remark: '', // 备注
    loginIp: '', // 登录IP
    loginDate: '', // 登录时间
    createTime: '', // 创建时间
};

const user = defineStore({
    id: 'user',
    state: () => ({
        userId: uni.getStorageSync('userId') || 0, // 用户ID，优先从缓存读取
        userInfo: clone(defaultUserInfo), // 用户信息
        isLogin: !!uni.getStorageSync('token'), // 登录状态
        lastUpdateTime: 0, // 上次更新时间
    }),

    actions: {
        // 获取用户信息
        async getInfo() {
            const { code, data } = await UserApi.getUserInfo({
                id: this.userId,
            });
            if (code !== 0) {
                return;
            }
            this.userInfo = data;
            return Promise.resolve(data);
        },

        setUserId(userId = '') {
            if (!userId) {
                this.userId = 0;
                uni.removeStorageSync('userId');
            } else {
                this.userId = userId;
                uni.setStorageSync('userId', userId);
            }
        },

        // 设置 token
        setToken(token = '', refreshToken = '') {
            if (token === '') {
                this.isLogin = false;
                uni.removeStorageSync('token');
                uni.removeStorageSync('refresh-token');
            } else {
                this.isLogin = true;
                uni.setStorageSync('token', token);
                uni.setStorageSync('refresh-token', refreshToken);
                this.loginAfter();
            }
            return this.isLogin;
        },

        // 更新用户相关信息 (手动限流，5 秒之内不刷新)
        async updateUserData() {
            if (!this.isLogin) {
                this.resetUserData();
                return;
            }
            // 防抖，5 秒之内不刷新
            const nowTime = new Date().getTime();
            if (this.lastUpdateTime + 5000 > nowTime) {
                return;
            }
            this.lastUpdateTime = nowTime;

            // 获取最新信息
            await this.getInfo();
            return this.userInfo;
        },

        // 重置用户默认数据
        resetUserData() {
            // 清空 token
            this.setToken();
            // 清空用户ID
            this.setUserId('');
            // 清空用户相关的缓存
            this.userInfo = clone(defaultUserInfo);
            this.userWallet = clone(defaultUserWallet);
            this.numData = cloneDeep(defaultNumData);
        },

        // 登录后，加载各种信息
        async loginAfter() {
            await this.updateUserData();
            // 登录后设置全局分享参数
            $share.getShareInfo();
        },

        // 登出系统
        async logout() {
            this.resetUserData();
            return !this.isLogin;
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'user-store',
            },
        ],
    },
});

export default user;
