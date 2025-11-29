<template>
    <up-swiper
        :list="list"
        height="400rpx"
        previousMargin="30"
        nextMargin="30"
        circular
        radius="5"
        bgColor="#ffffff"
    >
    </up-swiper>

    <up-box height="160px" gap="12px" :bgColors="['#EEFCFF', '#FCF8FF', '#FDF8F2']">
        <template #left>
            <view>
                <s-icon name="qianyuequeren" size="32" color="#409EFF" />
                <view>签约确认</view>
            </view>
        </template>
        <template #rightTop>
            <view>
                <s-icon name="zhuanzuqueren" size="32" color="#67C23A" />
                <view>转租确认</view>
            </view>
        </template>
        <template #rightBottom>
            <view>
                <s-icon name="daifuliebiao" size="32" color="#FFB020" />
                <view>代付列表</view>
            </view>
        </template>
    </up-box>
</template>

<script setup>
    import { computed, reactive } from 'vue';
    import { onLoad, onPageScroll, onPullDownRefresh } from '@dcloudio/uni-app';
    import sheep from '@/sheep';
    import $share from '@/sheep/platform/share';

    const list = reactive([
        '/static/room/room1.jpg',
        '/static/room/room2.jpeg',
        '/static/room/room3.jpeg',
    ]);

    const template = {
        components: [
            {
                id: 'MenuGridWithTitle',
                property: {
                    column: 5,
                    list: [
                        {
                            title: '签约确认',
                            titleColor: '#333',
                            subtitle: '',
                            subtitleColor: '#bbb',
                            badge: {
                                show: true,
                                textColor: '#fff',
                                bgColor: '#FF6000',
                                text: '1',
                            },
                            iconUrl: 'qianyuequeren',
                            iconSize: 48,
                            iconBgColor: '#409EFF',
                            url: '/pages/house/houseAdd',
                        },
                        {
                            title: '转租确认',
                            titleColor: '#333',
                            subtitle: '',
                            subtitleColor: '#bbb',
                            badge: {
                                show: true,
                                textColor: '#fff',
                                bgColor: '#FF6000',
                                text: '1',
                            },
                            iconUrl: 'zhuanzuqueren',
                            iconSize: 48,
                            iconBgColor: '#67C23A',
                            url: '/pages/house/houseAdd',
                        },
                        {
                            title: '代付列表',
                            titleColor: '#333',
                            subtitle: '',
                            subtitleColor: '#bbb',
                            badge: {
                                show: true,
                                textColor: '#fff',
                                bgColor: '#FF6000',
                                text: '1',
                            },
                            iconUrl: 'daifuliebiao',
                            iconSize: 48,
                            iconBgColor: '#FFB020',
                            url: '/pages/house/houseAdd',
                        },
                        // {
                        //     title: '逾期账单',
                        //     titleColor: '#333',
                        //     subtitle: '',
                        //     subtitleColor: '#bbb',
                        //     badge: {
                        //         show: true,
                        //         textColor: '#fff',
                        //         bgColor: '#FF6000',
                        //         text: '1',
                        //     },
                        //     iconUrl: 'yuqizhangdan',
                        //     iconSize: 48,
                        //     iconBgColor: '#FF6B35',
                        //     url: '/pages/house/houseAdd',
                        // },
                        // {
                        //     title: '待收账单',
                        //     titleColor: '#333',
                        //     subtitle: '',
                        //     subtitleColor: '#bbb',
                        //     badge: {
                        //         show: true,
                        //         textColor: '#fff',
                        //         bgColor: '#FF6000',
                        //         text: '1',
                        //     },
                        //     iconUrl: 'daishouzhangdan',
                        //     iconSize: 48,
                        //     iconBgColor: '#8E6EFF',
                        //     url: '/pages/house/houseAdd',
                        // },
                    ],
                    style: {
                        bgType: 'color',
                        bgColor: '#fff',
                        marginBottom: 8,
                        marginLeft: 8,
                        marginRight: 8,
                        padding: 8,
                        paddingTop: 8,
                        paddingRight: 8,
                        paddingBottom: 8,
                        paddingLeft: 8,
                        borderRadius: 8,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                        borderBottomLeftRadius: 8,
                    },
                },
            },
            {
                id: 'MenuGridStatistic',
                property: {
                    column: 3,
                    // title: '经营概览',
                    // titleIcon: 'jingyingqingkuang',
                    // titleIconSize: 38,
                    // titleIconBgColor: '#8E6EFF',
                    // titleColor: '#333',
                    list: [
                        {
                            title: '已租',
                            subtitle: '100',
                            subtitleAppend: '间',
                        },
                        {
                            title: '未租',
                            subtitle: '100',
                            subtitleAppend: '间',
                        },
                        {
                            title: '本月签约数',
                            subtitle: '100',
                            subtitleAppend: '条',
                        },
                        {
                            title: '本月应收',
                            subtitle: '100,000,000',
                            subtitlePrefix: '¥',
                            subtitleStyle: {
                                color: '#F56C6C',
                            },
                            comment: '100',
                            commentAppend: '（笔）',
                        },
                        {
                            title: '本月待收',
                            subtitle: '100,000,000',
                            subtitlePrefix: '¥',
                            subtitleStyle: {
                                color: '#F56C6C',
                            },
                            comment: '100',
                            commentAppend: '（笔）',
                        },
                        {
                            title: '逾期未收',
                            subtitle: '100,000,000',
                            subtitlePrefix: '¥',
                            subtitleStyle: {
                                color: '#F56C6C',
                            },
                            comment: '100',
                            commentAppend: '（笔）',
                        },
                    ],
                    style: {
                        bgType: 'color',
                        bgColor: '#fff',
                        marginBottom: 8,
                        marginLeft: 8,
                        marginRight: 8,
                        padding: 8,
                        paddingTop: 8,
                        paddingRight: 8,
                        paddingBottom: 8,
                        paddingLeft: 8,
                        borderRadius: 8,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        borderBottomRightRadius: 8,
                        borderBottomLeftRadius: 8,
                    },
                },
            },
        ],
    };

    onLoad((options) => {
        // #ifdef MP
        // 小程序识别二维码
        if (options.scene) {
            const sceneParams = decodeURIComponent(options.scene).split('=');
            options[sceneParams[0]] = sceneParams[1];
        }
        // #endif

        // 预览模板
        if (options.templateId) {
            sheep.$store('app').init(options.templateId);
        }

        // 解析分享信息
        if (options.spm) {
            $share.decryptSpm(options.spm);
        }

        // 进入指定页面(完整页面路径)
        if (options.page) {
            sheep.$router.go(decodeURIComponent(options.page));
        }
    });

    // 下拉刷新
    onPullDownRefresh(() => {
        sheep.$store('app').init();
        setTimeout(function () {
            uni.stopPullDownRefresh();
        }, 800);
    });

    onPageScroll(() => {});
</script>
