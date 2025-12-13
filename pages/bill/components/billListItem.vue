<template>
    <view class="bill-list-item">
        <view class="bill-info">
            <view class="bill-title">{{ bill.title }}</view>
            <view class="bill-amount">￥{{ bill.amount }}</view>
        </view>
        <view class="bill-detail">
            <view class="bill-date">约定提前收租日：{{ bill.date }}</view>
            <view class="bill-tags">
                <up-tag text="催租中" type="primary" size="mini"></up-tag>
                <up-tag text="剩余1天" type="success" size="mini"></up-tag>
                <up-tag text="逾期1天" type="error" size="mini"></up-tag>
            </view>
        </view>
        <up-line></up-line>
        <view class="bill-footer">
            <view class="bill-rental-address">{{ bill.rentalAddress }}</view>
            <view class="bill-rental-name">{{ bill.rentalName }}</view>
        </view>
    </view>
</template>

<script setup>
    import { defineProps } from 'vue';

    const props = defineProps({
        bill: {
            type: Object,
            default: () => ({}),
        },
    });
</script>

<style lang="scss" scoped>
    .bill-list-item {
        padding: 24rpx;
        background-color: $white;
        margin-bottom: 16rpx;
        display: flex;
        flex-direction: column;
        gap: 24rpx;

        .bill-info {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .bill-title {
                font-size: 28rpx;
                font-weight: 600;
            }

            .bill-amount {
                font-size: 28rpx;
                font-weight: 600;
            }
        }

        .bill-detail {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .bill-date {
                font-size: 24rpx;
                color: $dark-6;
            }

            .bill-tags {
                display: flex;
                gap: 12rpx;
            }
        }

        .bill-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .bill-rental-address,
            .bill-rental-name {
                font-size: 24rpx;
                color: $dark-6;
            }
        }
    }
</style>
