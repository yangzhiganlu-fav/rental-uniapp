<template>
    <s-block
        v-for="(item, index) in template.components"
        :key="index"
        :styles="item.property.style"
    >
        <s-block-item :type="item.id" :data="item.property" :styles="item.property.style" />
    </s-block>
</template>

<script setup>
    import { computed } from 'vue';
    import { onLoad, onPageScroll, onPullDownRefresh } from '@dcloudio/uni-app';
    import sheep from '@/sheep';
    import $share from '@/sheep/platform/share';

    const template = {
        components: [
            {
                id: 'Carousel',
                property: {
                    indicator: 'dot',
                    autoplay: true,
                    interval: 3,
                    type: 'default',
                    items: [
                        { type: 'img', imgUrl: '/static/room/room1.png', url: '' },
                        { type: 'img', imgUrl: '/static/room/room2.png', url: '' },
                        { type: 'img', imgUrl: '/static/room/room3.png', url: '' },
                    ],
                    style: {
                        bgType: 'color',
                        bgColor: '#fff',
                        marginBottom: 8,
                    },
                },
            },
            // {
            //     id: 'MenuGrid',
            //     property: {
            //         column: 4,
            //         list: [
            //             {
            //                 title: '录入房源',
            //                 titleColor: '#333',
            //                 subtitle: '',
            //                 subtitleColor: '#bbb',
            //                 badge: {
            //                     show: false,
            //                 },
            //                 iconUrl: 'lurufangyuan',
            //                 iconSize: 64,
            //                 iconColor: '#409EFF',
            //                 url: '/pages/house/houseAdd',
            //             },
            //             {
            //                 title: '添加租约',
            //                 titleColor: '#333',
            //                 subtitle: '',
            //                 subtitleColor: '#bbb',
            //                 badge: {
            //                     show: false,
            //                 },
            //                 iconUrl: 'tianjiazuyue',
            //                 iconSize: 64,
            //                 iconColor: '#67C23A',
            //                 url: '/pages/house/houseAdd',
            //             },
            //             {
            //                 title: '房态维护',
            //                 titleColor: '#333',
            //                 subtitle: '',
            //                 subtitleColor: '#bbb',
            //                 badge: {
            //                     show: false,
            //                 },
            //                 iconUrl: 'fangtaiweihu',
            //                 iconSize: 64,
            //                 iconColor: '#FFB020',
            //                 url: '/pages/house/houseAdd',
            //             },
            //             {
            //                 title: '联系客服',
            //                 titleColor: '#333',
            //                 subtitle: '',
            //                 subtitleColor: '#bbb',
            //                 badge: {
            //                     show: false,
            //                 },
            //                 iconUrl: 'kefu',
            //                 iconSize: 64,
            //                 iconColor: '#F56C6C',
            //                 url: '/pages/house/houseAdd',
            //             },
            //         ],
            //         style: {
            //             bgType: 'color',
            //             bgColor: '#fff',
            //             marginBottom: 8,
            //             marginLeft: 8,
            //             marginRight: 8,
            //             padding: 8,
            //             paddingTop: 8,
            //             paddingRight: 8,
            //             paddingBottom: 8,
            //             paddingLeft: 8,
            //             borderRadius: 8,
            //             borderTopLeftRadius: 8,
            //             borderTopRightRadius: 8,
            //             borderBottomRightRadius: 8,
            //             borderBottomLeftRadius: 8,
            //         },
            //     },
            // },
            {
                id: 'MenuGridWithTitle',
                property: {
                    column: 5,
                    // title: '待办事项',
                    // titleIcon: 'daibanshixiang',
                    // titleIconSize: 38,
                    // titleIconBgColor: '#8E6EFF',
                    // titleColor: '#333',
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
