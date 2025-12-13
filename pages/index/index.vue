<template>
    <s-layout title="首页" tabbar="/pages/index/index">
        <view class="landlord-page">
            <up-swiper
                :list="list"
                height="320rpx"
                previousMargin="40"
                nextMargin="40"
                circular
                radius="5"
                bgColor="#fff"
                class="flex-shrink-0"
            >
            </up-swiper>

            <!-- 待办事项 -->
            <s-menu-grid
                :data="todoList"
                :styles="{
                    bgType: 'color',
                    bgColor: '#fff',
                    marginBottom: 16,
                    marginLeft: 16,
                    marginRight: 16,
                    padding: 16,
                    paddingTop: 16,
                    paddingRight: 16,
                    paddingBottom: 16,
                    paddingLeft: 16,
                    borderRadius: 16,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    borderBottomRightRadius: 16,
                    borderBottomLeftRadius: 16,
                }"
                class="flex-shrink-0"
            />

            <!-- 经营概览 -->
            <view class="section">
                <view class="section-header">
                    <view class="title">经营概览</view>
                </view>
                <view class="statistic-grid">
                    <view
                        class="statistic-item"
                        v-for="(item, index) in statisticList"
                        :key="index"
                        :class="'bg-' + (index % 6)"
                        @tap="navigateTo(item)"
                    >
                        <view class="stat-icon">
                            <s-icon
                                :name="item.iconName"
                                :size="item.iconSize"
                                :color="item.iconColor"
                            />
                        </view>
                        <view class="stat-content">
                            <view class="stat-title">
                                <text>{{ item.title }}</text>
                                <view class="stat-count" v-if="item.count">
                                    <up-count-to
                                        :endVal="item.count"
                                        separator=","
                                        color="rgba(255, 255, 255, 0.9)"
                                        fontSize="24rpx"
                                    ></up-count-to>
                                    <text>{{ item.countSuffix }}</text>
                                </view>
                            </view>
                            <view class="stat-value">
                                <text class="prefix" v-if="item.subtitlePrefix">{{
                                    item.subtitlePrefix
                                }}</text>
                                <up-count-to
                                    :endVal="item.subtitle"
                                    separator=","
                                    color="#fff"
                                    fontSize="36rpx"
                                    :bold="true"
                                ></up-count-to>
                                <text class="suffix" v-if="item.subtitleAppend">{{
                                    item.subtitleAppend
                                }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </s-layout>
</template>

<script setup>
    import { reactive } from 'vue';
    import sheep from '@/sheep';
    import CountApi from '@/sheep/api/index/count';
    import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app';

    const list = reactive([
        '/static/room/room1.jpg',
        '/static/room/room2.jpeg',
        '/static/room/room3.jpeg',
    ]);

    // 待办事项
    const todoList = reactive({
        column: 4,
        list: [
            {
                title: '签约确认',
                iconUrl: 'qianyuequeren',
                url: '/pages/house/houseAdd',
                iconSize: 62,
                iconColor: '#79bbff',
                badge: {
                    show: true,
                    textColor: '#fff',
                    bgColor: '#ff8f8f',
                    text: '1',
                },
            },
            {
                title: '转租确认',
                iconUrl: 'zhuanzuqueren',
                url: '/pages/house/houseAdd',
                iconSize: 62,
                iconColor: '#79bbff',
                badge: {
                    show: true,
                    textColor: '#fff',
                    bgColor: '#ff8f8f',
                    text: '1',
                },
            },
            {
                title: '代付列表',
                iconUrl: 'daifuliebiao',
                url: '/pages/house/houseAdd',
                iconSize: 62,
                iconColor: '#79bbff',
                badge: {
                    show: true,
                    textColor: '#fff',
                    bgColor: '#ff8f8f',
                    text: '1',
                },
            },
        ],
    });

    // 经营概览
    const statisticList = reactive([
        {
            title: '已租',
            subtitle: '100',
            subtitleAppend: '间',
            iconName: 'yizu',
            iconSize: 50,
            iconColor: '#4caf50',
        },
        {
            title: '未租',
            subtitle: '100',
            subtitleAppend: '间',
            iconName: 'weizu',
            iconSize: 44,
            iconColor: '#6a75ca',
        },
        {
            title: '本月签约数',
            subtitle: '100',
            subtitleAppend: '条',
            iconName: 'qianyue',
            iconSize: 50,
            iconColor: '#e86a58',
        },
        {
            title: '本月应收',
            subtitle: '100000000',
            subtitlePrefix: '¥',
            count: '174',
            countSuffix: ' (笔)',
            iconName: 'yingshou',
            iconSize: 58,
            iconColor: '#ff9800',
        },
        {
            title: '本月待收',
            subtitle: '100000000',
            subtitlePrefix: '¥',
            count: '174',
            countSuffix: ' (笔)',
            iconName: 'daishou',
            iconSize: 50,
            iconColor: '#9c27b0',
        },
        {
            title: '逾期未收',
            subtitle: '100000000',
            subtitlePrefix: '¥',
            count: '146',
            countSuffix: ' (笔)',
            iconName: 'yuqi',
            iconSize: 44,
            iconColor: '#1abc9c',
        },
    ]);

    const fetchCountData = async () => {
        const { code, data } = await CountApi.getCountData();
        if (code === 0 && data) {
            statisticList[0].subtitle = data.rentCount || 0;
            statisticList[1].subtitle = data.notRentCount || 0;
            statisticList[2].subtitle = data.signCount || 0;
            statisticList[3].subtitle = data.bill || 0;
            statisticList[3].count = data.billCount || 0;
            statisticList[4].subtitle = data.bill || 0;
            statisticList[4].count = data.billCount || 0;
            statisticList[5].subtitle = data.overdueBill || 0;
            statisticList[5].count = data.overdueBillCount || 0;
        }
    };

    const navigateTo = (item) => {
        switch (item.title) {
            case '已租':
                uni.switchTab({
                    url: '/pages/house/index',
                });
                uni.setStorageSync('rentalStatus', '1');
                break;
            case '未租':
                uni.switchTab({
                    url: '/pages/house/index',
                });
                uni.setStorageSync('rentalStatus', '0');
                break;
            case '本月签约数':
                uni.switchTab({
                    url: '/pages/lease/index',
                });
                uni.setStorageSync('leaseStatus', '1');
                break;
            case '本月应收':
                sheep.$router.go('/pages/bill/index', {});
                break;
            case '本月待收':
                sheep.$router.go('/pages/bill/index', {});
                break;
            case '逾期未收':
                sheep.$router.go('/pages/bill/index', {});
                break;
            default:
                break;
        }
    };

    onLoad(() => {
        uni.hideTabBar({
            fail: () => {},
        });
        fetchCountData();
    });

    onPullDownRefresh(() => {
        sheep.$store('app').init();
        fetchCountData();
        let timer = setTimeout(() => {
            uni.stopPullDownRefresh();
            clearTimeout(timer);
            timer = null;
        }, 800);
    });
</script>

<style lang="scss" scoped>
    .flex-shrink-0 {
        flex-shrink: 0;
    }

    .landlord-page {
        display: flex;
        flex-direction: column;
        gap: 20rpx;
        padding: 20rpx;
    }

    .section {
        flex-shrink: 0;
        background-color: #fff;
        padding-bottom: 20rpx;

        .section-header {
            padding: 20rpx;
            .title {
                font-size: 32rpx;
                font-weight: bold;
                color: #333;
            }
        }

        .statistic-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20rpx;
            padding: 0 10rpx;
        }

        .statistic-item {
            border-radius: 24rpx;
            padding: 26rpx;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 180rpx;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

            // 背景圆圈装饰
            &::after {
                content: '';
                position: absolute;
                right: -20rpx;
                bottom: -20rpx;
                width: 120rpx;
                height: 120rpx;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                z-index: 0;
            }

            &::before {
                content: '';
                position: absolute;
                right: 40rpx;
                top: -20rpx;
                width: 80rpx;
                height: 80rpx;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                z-index: 0;
            }

            .stat-icon {
                margin-bottom: 20rpx;
                z-index: 1;
                background-color: #fff;
                border-radius: 100%;
                width: 80rpx;
                height: 80rpx;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .stat-content {
                z-index: 1;
                .stat-title {
                    font-size: 26rpx;
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: 10rpx;
                    display: flex;
                    align-items: center;
                }

                .stat-count {
                    font-size: 24rpx;
                    color: rgba(255, 255, 255, 0.9);
                    margin-left: 30rpx;
                    display: flex;
                    align-items: center;
                }
                .stat-value {
                    font-size: 36rpx;
                    font-weight: bold;
                    color: #fff;

                    .prefix {
                        font-size: 24rpx;
                        margin-right: 4rpx;
                    }
                    .suffix {
                        font-size: 24rpx;
                        margin-left: 4rpx;
                    }
                }
            }
        }
    }

    // 颜色类
    .bg-0 {
        background: $dash-green;
    }
    .bg-1 {
        background: $dash-blue;
    }
    .bg-2 {
        background: $dash-red;
    }
    .bg-3 {
        background: $dash-yellow;
    }
    .bg-4 {
        background: $dash-purple;
    }
    .bg-5 {
        background: $dash-cyan;
    }
</style>
