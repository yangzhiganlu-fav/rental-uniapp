<template>
    <up-card
        :title="lease.title"
        :subTitle="lease.renterName"
        titleSize="24rpx"
        subTitleSize="24rpx"
        titleColor="#999"
        subTitleColor="#666"
        margin="0"
        :show-foot="false"
        @click="onClick"
    >
        <template #body>
            <view class="lease-body">
                <view class="lease-dates">
                    <text>{{ lease.startTime || '--' }}</text>
                    <text>/</text>
                    <text>{{ lease.endTime || '--' }}</text>
                </view>
                <view class="lease-tags">
                    <!-- 待签署：0:待签署 1:已签署（租约进行中） 2：合同终止 -->
                    <up-tag
                        v-if="lease.status === 0"
                        text="待签署"
                        type="success"
                        size="mini"
                    ></up-tag>

                    <!-- 快到期：租约剩余天数 <= 7天 -->
                    <up-tag
                        v-if="
                            lease.remainDay !== null &&
                            lease.remainDay !== undefined &&
                            lease.remainDay <= 7
                        "
                        text="快到期"
                        type="warning"
                        size="mini"
                    ></up-tag>

                    <!-- 即将逾期：逾期天数为负数 -->
                    <up-tag
                        v-if="
                            lease.overDueDay !== null &&
                            lease.overDueDay !== undefined &&
                            lease.overDueDay < 0
                        "
                        :text="`${Math.abs(lease.overDueDay)}天后逾期`"
                        type="primary"
                        size="mini"
                    ></up-tag>

                    <!-- 已逾期：逾期天数为正数 -->
                    <up-tag
                        v-if="
                            lease.overDueDay !== null &&
                            lease.overDueDay !== undefined &&
                            lease.overDueDay > 0
                        "
                        :text="`逾期${lease.overDueDay}天`"
                        type="error"
                        size="mini"
                    ></up-tag>

                    <!-- 退房时间 actualEndTime -->
                    <up-tag
                        v-if="lease.actualEndTime"
                        :text="`${lease.actualEndTime} 已退房`"
                        size="mini"
                    ></up-tag>
                </view>
            </view>
        </template>
    </up-card>
</template>

<script setup>
    const props = defineProps({
        lease: {
            type: Object,
            required: true,
        },
    });

    const emit = defineEmits(['click']);

    const onClick = () => {
        emit('click', props.lease);
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
    }

    .lease-body {
        font-size: $tx-sm;

        .lease-dates {
            padding: 10rpx 0 40rpx 0;
            font-size: 24rpx;
            color: $dark-9;
        }

        .lease-tags {
            display: flex;
            gap: 12rpx;
            align-items: center;
            justify-content: flex-end;
        }
    }
</style>
