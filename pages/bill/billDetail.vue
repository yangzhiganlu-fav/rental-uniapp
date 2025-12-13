<template>
    <s-layout title="账单详情">
        <template #right>
            <up-text text="联系租客" type="primary" size="26rpx"></up-text>
            <!-- <up-text text="查看租约" type="primary" size="26rpx"></up-text> -->
        </template>

        <view class="bill-detail">
            <view class="bill-rental-header">
                <view class="bill-rental-title">绿地新城20号楼2单元112室</view>
                <view class="bill-rental-info-item">
                    <text>租客姓名：张三</text>
                    <view class="bill-tags">
                        <up-tag text="逾期1天" type="error" size="mini"></up-tag>
                    </view>
                </view>
                <view class="bill-rental-info-item">联系方式：138****1234</view>
            </view>

            <!-- <view class="bill-rental-content">
                <view class="bill-rental-content-title">账期 2025-06-11/2025-07-10</view>
                <view class="bill-rental-content-item">
                    <text class="bill-rental-content-item__label">应收款日</text>
                    <text class="bill-rental-content-item__value">2025-06-11</text>
                </view>
                <view class="bill-rental-content-item">
                    <text class="bill-rental-content-item__label">实收款日</text>
                    <text class="bill-rental-content-item__value">2025-06-11</text>
                </view>
                <up-line margin="24rpx 0"></up-line>
                <view class="bill-rental-content-title">应收明细</view>
                <view class="bill-rental-content-item">
                    <text class="bill-rental-content-item__label">租金（1个月）</text>
                    <text class="bill-rental-content-item__value">2500.00</text>
                </view>
                <view class="bill-rental-content-item">
                    <text class="bill-rental-content-item__label">抵扣</text>
                    <text class="bill-rental-content-item__value">-1000.00</text>
                </view>
                <view class="bill-rental-content-item">
                    <text class="bill-rental-content-item__label">押金房屋押金</text>
                    <text class="bill-rental-content-item__value">500.00</text>
                </view>
                <view class="bill-rental-content-item">
                    <text class="bill-rental-content-item__label">应收总计</text>
                    <text class="bill-rental-content-item__value">2000.00</text>
                </view>
                <up-line margin="24rpx 0"></up-line>
                <view class="bill-rental-content-title">扣款明细</view>
                <view class="bill-rental-content-item">
                    <text class="bill-rental-content-item__label">渠道费</text>
                    <text class="bill-rental-content-item__value">-50.00</text>
                </view>
                <up-line margin="24rpx 0"></up-line>
                <view class="bill-rental-content-title">实收总计</view>
                <view class="bill-rental-content-item">
                    <text class="bill-rental-content-item__label">实收总计</text>
                    <text class="bill-rental-content-item__value text-important">￥1950.00</text>
                </view>
                <view class="bill-rental-content-item">
                    <text class="bill-rental-content-item__label">收款渠道</text>
                    <text class="bill-rental-content-item__value">微信支付</text>
                </view>
                <view class="bill-rental-content-item">
                    <text class="bill-rental-content-item__label">账单备注</text>
                    <text class="bill-rental-content-item__value">无</text>
                </view>
            </view> -->

            <view class="bill-rental-content">
                <view class="bill-rental-content-title">账期明细</view>
                <view class="bill-rental-content-item">
                    <text class="bill-rental-content-item__label">租金（1个月）</text>
                    <text class="bill-rental-content-item__value">￥1950.00</text>
                </view>
                <up-line margin="24rpx 0"></up-line>
                <view class="bill-rental-content-title">账单信息</view>
                <view class="bill-rental-content-item">
                    <text class="bill-rental-content-item__label">约定提前收租日</text>
                    <text class="bill-rental-content-item__value">2025-06-11</text>
                </view>
                <view class="bill-rental-content-item">
                    <text class="bill-rental-content-item__label">上期租金到期日</text>
                    <text class="bill-rental-content-item__value">2025-06-11</text>
                </view>
                <view class="bill-rental-content-item">
                    <text class="bill-rental-content-item__label">起止日期</text>
                    <text class="bill-rental-content-item__value">2025-06-11 至 2025-07-10</text>
                </view>
                <up-line margin="24rpx 0"></up-line>
                <view class="bill-rental-content-item">
                    <text class="bill-rental-content-item__label">账期备注</text>
                    <text class="bill-rental-content-item__value">租金 12/10-01/10</text>
                </view>
                <up-line margin="24rpx 0"></up-line>
                <view class="bill-rental-content-item">
                    <text class="bill-rental-content-item__label">支付凭证</text>
                    <text class="bill-rental-content-item__value"></text>
                </view>
            </view>
        </view>

        <su-fixed bottom>
            <view class="bill-action-bar">
                <view class="urge-btn" @tap="onUrge">
                    <up-icon name="chat" size="24" color="#3c9cff"></up-icon>
                    <text class="urge-text">催账</text>
                </view>
                <view class="action-btn">
                    <up-button type="primary" shape="circle">已收款</up-button>
                </view>
            </view>
        </su-fixed>
    </s-layout>
</template>

<script setup></script>

<style lang="scss" scoped>
    .bill-detail {
        padding: 0 16rpx 160rpx 16rpx;
        background-color: $bg-page;

        .bill-rental-header {
            background-color: $white;
            padding-bottom: 16rpx;

            .bill-rental-title {
                padding: 24rpx 32rpx;
                margin: 24rpx 0;
                font-size: 28rpx;
                background-color: #4e8dee;
                color: $white;
                border-top-left-radius: 16rpx;
                border-top-right-radius: 16rpx;
            }

            .bill-rental-info-item {
                position: relative;
                padding: 12rpx 32rpx;
                font-size: 28rpx;
                color: $dark-6;
            }

            .bill-tags {
                position: absolute;
                top: 0;
                right: 32rpx;
                display: flex;
                align-items: center;
                gap: 16rpx;
            }
        }

        .bill-rental-content {
            margin-top: 24rpx;
            background-color: $white;
            border-radius: 16rpx;
            padding: 24rpx 32rpx;

            .bill-rental-content-title {
                font-size: 28rpx;
                font-weight: bold;
                color: $dark-7;
                margin-bottom: 16rpx;
            }

            .bill-rental-content-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16rpx 0;
                font-size: 28rpx;
                color: $dark-6;

                &__label {
                    color: $dark-9;
                }

                &__value {
                }

                .text-important {
                    color: #f56c6c;
                    font-weight: bold;
                }
            }
        }
    }
    .bill-action-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx;
        background-color: #fff;
        border-top: 1rpx solid #eee;

        .urge-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 30rpx;

            .urge-text {
                font-size: 24rpx;
                color: var(--ui-primary);
                margin-top: 4rpx;
            }
        }

        .action-btn {
            flex: 1;
        }
    }
</style>
