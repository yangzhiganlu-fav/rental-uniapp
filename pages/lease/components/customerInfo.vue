<template>
    <view class="customer-info">
        <view class="info-row">
            <view class="info-label">姓名</view>
            <view class="info-value">{{ leaseData?.renterName }}</view>
        </view>
        <view class="info-row">
            <view class="info-label">性别</view>
            <view class="info-value">{{ formatSex(leaseData?.renterSex) }}</view>
        </view>
        <view class="info-row">
            <view class="info-label">电话</view>
            <view class="info-value">{{ sheep.$helper.maskPhone(leaseData?.renterPhone) }}</view>
        </view>
        <view class="info-row">
            <view class="lease-tags">
                <!-- 待签署：0:待签署 1:已签署（租约进行中） 2：合同终止 -->
                <up-tag
                    v-if="leaseData?.status === 0"
                    text="待签署"
                    type="success"
                    size="mini"
                ></up-tag>

                <!-- 快到期：租约剩余天数 <= 7天 -->
                <up-tag
                    v-if="
                        leaseData?.remainDay !== null &&
                        leaseData?.remainDay !== undefined &&
                        leaseData?.remainDay <= 7
                    "
                    text="快到期"
                    type="warning"
                    size="mini"
                ></up-tag>

                <!-- 即将逾期：逾期天数为负数 -->
                <up-tag
                    v-if="
                        leaseData?.overDueDay !== null &&
                        leaseData?.overDueDay !== undefined &&
                        leaseData?.overDueDay < 0
                    "
                    :text="`${Math.abs(info.overDueDay)}天后逾期`"
                    type="primary"
                    size="mini"
                ></up-tag>

                <!-- 已逾期：逾期天数为正数 -->
                <up-tag
                    v-if="
                        leaseData?.overDueDay !== null &&
                        leaseData?.overDueDay !== undefined &&
                        leaseData?.overDueDay > 0
                    "
                    :text="`逾期${info.overDueDay}天`"
                    type="error"
                    size="mini"
                ></up-tag>

                <!-- 退房时间 actualEndTime -->
                <up-tag
                    v-if="leaseData?.actualEndTime"
                    :text="`${leaseData.actualEndTime} 已退房`"
                    type="info"
                    size="mini"
                ></up-tag>
            </view>
        </view>

        <view class="btn-group">
            <view v-if="leaseData?.idCardFileList?.length" class="btn" @tap="onViewIdCard">
                <view class="btn-icon" style="background-color: #3c9cff">
                    <s-icon name="shenfenzheng" size="52rpx" color="#fff" />
                </view>
                <view class="btn-text">查看证件</view>
            </view>
            <up-line direction="col" length="100rpx" class="seperator"></up-line>
            <view class="btn" @tap="onCallTenant">
                <view class="btn-icon" style="background-color: #4ecdc4">
                    <s-icon name="phone" size="48rpx" color="#fff" />
                </view>
                <view class="btn-text">联系租客</view>
            </view>
        </view>
    </view>
</template>

<script setup>
    import sheep from '@/sheep';

    const props = defineProps({
        leaseData: {
            type: Object,
            default: () => ({}),
        },
    });

    const formatSex = (sex) => {
        if (sex === 0) return '男';
        if (sex === 1) return '女';
        return '未知';
    };

    // 查看证件
    const onViewIdCard = () => {
        sheep.$router.go('/pages/lease/tenantIdCardView', {
            urls: JSON.stringify(props.leaseData?.idCardFileList || []),
        });
    };

    // 拨打电话
    const onCallTenant = () => {
        if (props.leaseData?.renterPhone) {
            uni.makePhoneCall({
                phoneNumber: props.leaseData.renterPhone,
            });
        }
    };
</script>

<style lang="scss" scoped>
    .customer-info {
        position: relative;
        background-color: #fff;
        border-radius: 16rpx;
        padding: 24rpx;
        flex-shrink: 0;

        .info-row {
            display: flex;
            align-items: flex-start;
            font-size: 26rpx;

            & + .info-row {
                margin-top: 32rpx;
            }

            .info-label {
                width: 120rpx;
                color: $dark-6;
            }

            .info-value {
                flex: 1;
                color: $dark-3;
            }

            .lease-tags {
                display: flex;
                gap: 12rpx;
                align-items: center;
                flex-wrap: wrap;
            }
        }

        .btn-group {
            position: absolute;
            top: 12rpx;
            right: 30rpx;
            display: flex;
            align-items: center;

            .btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 16rpx;

                .btn-icon {
                    width: 90rpx;
                    height: 90rpx;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .btn-text {
                    color: $dark-6;
                }
            }

            .seperator {
                margin: 0 36rpx !important;
            }
        }
    }

    :deep(.u-tag__content) {
        display: flex;
        align-items: center;
    }
</style>
