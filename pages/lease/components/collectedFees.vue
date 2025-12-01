<template>
    <view class="collected-fees">
        <view class="fee-item" v-for="(item, index) in list" :key="index">
            <up-card :show-head="false" :show-foot="false" :border="false" margin="0">
                <template #body>
                    <view class="fee-content">
                        <view class="card-head">
                            <text class="period">【账期】 {{ item.period }}</text>
                            <view class="payment-tag">
                                <text>{{ item.paymentMethod }}</text>
                            </view>
                            <up-icon name="arrow-right" size="12" color="#3c9cff"></up-icon>
                        </view>
                        <view class="card-body">
                            <text class="date">【实收日期】 {{ item.collectionDate }}</text>
                            <text class="amount">实收 {{ item.amount }}</text>
                        </view>
                    </view>
                </template>
            </up-card>
        </view>
    </view>
</template>

<script setup>
    import { ref } from 'vue';

    // 模拟数据
    const list = ref([
        {
            period: '2025-11-23/2025-12-22',
            collectionDate: '2025-11-22',
            amount: '1270.00',
            paymentMethod: '租好点支付',
        },
        {
            period: '2025-10-23/2025-11-22',
            collectionDate: '2025-10-22',
            amount: '1270.00',
            paymentMethod: '租好点支付',
        },
    ]);
</script>

<style lang="scss" scoped>
    .collected-fees {
        padding: 20rpx;
        background-color: $uni-bg-color;
        color: $dark-9;
    }

    .fee-item {
        margin-bottom: 20rpx;

        :deep(.u-card) {
            border-radius: 16rpx;
        }
    }

    .fee-content {
        padding: 10rpx 0;
    }

    .card-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 20rpx;
        border-bottom: 1rpx solid $uni-bg-color;
        margin-bottom: 20rpx;

        .period {
            font-size: 28rpx;
        }

        .payment-tag {
            display: flex;
            align-items: center;
            background-color: #e6f1fc;
            padding: 4rpx 12rpx;
            border-radius: 8rpx;

            text {
                font-size: 24rpx;
                color: #3c9cff;
                margin-right: 4rpx;
            }
        }
    }

    .card-body {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28rpx;

        .amount {
            font-weight: bold;
        }
    }
</style>
