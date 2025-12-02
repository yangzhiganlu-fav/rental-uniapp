<template>
    <view class="customer-info">
        <view class="info-row">
            <view class="info-label">姓名</view>
            <view class="info-value">{{ info.tenantName }}</view>
        </view>
        <view class="info-row">
            <view class="info-label">性别</view>
            <view class="info-value">{{ info.gender }}</view>
        </view>
        <view class="info-row">
            <view class="info-label">电话</view>
            <view class="info-value">{{ info.phone }}</view>
        </view>
        <view class="info-row">
            <up-tag
                text="电子合同"
                type="primary"
                plain
                size="mini"
                style="margin-right: 16rpx"
            ></up-tag>
            <up-tag text="7天后逾期" type="error" plain size="mini"></up-tag>
        </view>

        <view class="btn-group">
            <view class="btn" @tap="onCallTenant">
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
    const props = defineProps({
        info: {
            type: Object,
            default: () => ({}),
        },
    });

    // 拨打电话
    const onCallTenant = () => {
        if (props.info.phone) {
            uni.makePhoneCall({
                phoneNumber: props.info.phone,
            });
        }
    };
</script>

<style lang="scss" scoped>
    .customer-info {
        position: relative;
        background-color: #fff;
        border-radius: 16rpx;
        padding: 32rpx 24rpx;
        flex-shrink: 0;

        .info-row {
            display: flex;
            align-items: flex-start;
            font-size: 28rpx;

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
</style>
