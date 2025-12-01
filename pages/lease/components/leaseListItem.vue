<template>
    <up-card
        :title="lease.address"
        :subTitle="lease.tenant"
        titleSize="24rpx"
        subTitleSize="24rpx"
        titleColor="#333333"
        subTitleColor="#666666"
        margin="0"
        :show-foot="false"
        @click="onTap"
    >
        <template #body>
            <view class="lease-body">
                <view class="lease-info">
                    <view class="lease-dates">{{ lease.startDate }}/{{ lease.endDate }}</view>
                    <view class="lease-status">
                        <view class="lease-status-icon">
                            <s-icon name="qianhetong" size="24rpx" color="#fff" />
                        </view>
                        <view class="lease-status-text">{{ lease.status }}</view>
                    </view>
                </view>
                <view class="lease-tags">
                    <up-tag text="电子合同" type="primary" plain size="mini"></up-tag>
                    <up-tag text="快到期" type="warning" size="mini"></up-tag>
                </view>
            </view>
        </template>
    </up-card>
</template>

<script setup>
    import { defineProps, defineEmits } from 'vue';

    const props = defineProps({
        lease: {
            type: Object,
            required: true,
        },
    });

    const emit = defineEmits(['tap']);

    const onTap = () => {
        emit('onTap', props.lease);
    };
</script>

<style lang="scss" scoped>
    .lease-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: $tx-sm;

        .lease-address {
            color: $dark-6;
        }

        .lease-tenant {
            color: $dark-3;
            font-weight: bold;
        }
    }

    .lease-body {
        font-size: $tx-sm;

        .lease-info {
            display: flex;
            align-items: center;
            margin-bottom: 48rpx;

            .lease-status {
                font-size: 22rpx;
                margin-left: 24rpx;
                display: flex;
                align-items: stretch;
                border: 1px solid $tan;
                border-radius: 6rpx;
                overflow: hidden;
            }

            .lease-status-icon {
                background-color: $tan;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 6rpx 8rpx;
            }

            .lease-status-text {
                color: $tan;
                padding: 0 8rpx;
                display: flex;
                align-items: center;
            }
        }

        .lease-tags {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }
</style>
