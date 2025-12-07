import DiyApi from '@/sheep/api/promotion/diy';
import { getTenantByWebsite } from '@/sheep/api/infra/tenant';
import { getTenantId } from '@/sheep/request';
import { defineStore } from 'pinia';
import $platform from '@/sheep/platform';
import $router from '@/sheep/router';
import user from './user';
import sys from './sys';
import { baseUrl, h5Url } from '@/sheep/config';

const app = defineStore({
    id: 'app',
    state: () => ({
        info: {
            // 应用信息
            name: '', // 商城名称
            logo: '', // logo
            version: '', // 版本号
            copyright: '', // 版权信息 I
            copytime: '', // 版权信息 II

            cdnurl: '', // 云存储域名
            filesystem: '', // 云存储平台
        },
        platform: {
            share: {
                methods: [], // 支持的分享方式
                forwardInfo: {}, // 默认转发信息
                posterInfo: {}, // 海报信息
                linkAddress: '', // 复制链接地址
            },
            bind_mobile: 0, // 登陆后绑定手机号提醒 (弱提醒，可手动关闭)
        },
        template: {
            // 店铺装修模板
            basic: {}, // 基本信息
            home: {
                // 首页模板
                style: {},
                data: [],
            },
            user: {
                // 个人中心模板
                style: {},
                data: [],
            },
        },
        shareInfo: {}, // 全局分享信息
        has_wechat_trade_managed: 0, // 小程序发货信息管理  0 没有 || 1 有
    }),
    actions: {
        // 获取Shopro应用配置和模板
        async init() {
            // 检查网络
            const networkStatus = await $platform.checkNetwork();
            if (!networkStatus) {
                $router.error('NetworkError');
            }

            // 检查配置
            if (typeof baseUrl === 'undefined') {
                $router.error('EnvError');
            }
            this.info = {
                name: '旅途之家',
                logo: 'https://static.iocoder.cn/ruoyi-vue-pro-logo.png',
                version: '2025.12',
                copyright: '全部开源，个人与企业可 100% 免费使用',
                copytime: 'Copyright© 2018-2025',

                cdnurl: 'https://file.sheepjs.com', // 云存储域名
                filesystem: 'qcloud', // 云存储平台
            };
            this.platform = {
                share: {
                    methods: ['forward', 'poster', 'link'],
                    linkAddress: h5Url,
                    posterInfo: {
                        user_bg: '/static/img/shop/config/user-poster-bg.png',
                        goods_bg: '/static/img/shop/config/goods-poster-bg.png',
                        groupon_bg: '/static/img/shop/config/groupon-poster-bg.png',
                    },
                    forwardInfo: {
                        title: '',
                        image: '',
                        desc: '',
                    },
                },
                bind_mobile: 0,
            };
            this.has_wechat_trade_managed = 0;

            // 模拟用户登录
            const userStore = user();
            if (userStore.isLogin) {
                userStore.loginAfter();
            }
            return Promise.resolve(true);
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'app-store',
            },
        ],
    },
});

export default app;
