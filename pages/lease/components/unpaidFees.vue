<template>
    <view class="unpaid-fees">
        <view class="fee-item" v-for="(item, index) in list" :key="index">
            <up-card
                :title="item.roomName"
                :show-foot="false"
                :border="false"
                margin="0"
                titleSize="28rpx"
                titleColor="#999"
            >
                <template #body>
                    <view class="fee-body">
                        <!-- 费用列表 -->
                        <view class="fee-row" v-for="(fee, fIndex) in item.fees" :key="fIndex">
                            <text class="label">{{ fee.name }}</text>
                            <text class="value">{{ fee.amount }}</text>
                        </view>

                        <!-- 总计 -->
                        <view class="fee-row">
                            <text class="label">总计</text>
                            <text class="value">{{ item.total }}</text>
                        </view>

                        <!-- 账期 -->
                        <view class="fee-row">
                            <text class="label">账期</text>
                            <text class="value">{{ item.period }}</text>
                        </view>

                        <!-- 约定提前收租日 -->
                        <view class="fee-row">
                            <text class="label">约定提前收租日</text>
                            <text class="value">{{ item.collectionDate }}</text>
                        </view>
                    </view>
                </template>
            </up-card>
        </view>
    </view>
</template>

<script setup>
    import { ref } from 'vue';

    // 模拟数据，实际应从接口获取
    const list = ref([
        {
            roomName: '棕榈湾48幢/栋802室E',
            fees: [
                { name: '租金(1个月)', amount: '920.00' },
                { name: '抵扣', amount: '-920.00' },
                { name: '押金:房屋押金', amount: '920.00' },
            ],
            total: '920',
            period: '2025-12-26/2026-01-25',
            collectionDate: '2025-12-26',
        },
        {
            roomName: '棕榈湾48幢/栋802室E',
            fees: [{ name: '租金(1个月)', amount: '920.00' }],
            total: '920',
            period: '2026-01-26/2026-02-25',
            collectionDate: '2026-01-18',
        },
    ]);
</script>

<style lang="scss" scoped>
    .unpaid-fees {
        padding: 20rpx;
        background-color: #f5f5f5;
    }

    .fee-item {
        margin-bottom: 20rpx;

        :deep(.u-card) {
            border-radius: 16rpx;
        }
    }

    .fee-body {
        padding-top: 10rpx;

        .fee-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32rpx;
            font-size: 28rpx;

            .label {
                flex: 1;
                color: #999;
            }

            .value {
                margin-left: 20rpx;
                color: #666;
            }
        }
    }
</style>
