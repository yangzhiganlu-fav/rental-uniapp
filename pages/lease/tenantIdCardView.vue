<template>
    <s-layout title="证件照片" :bgStyle="{ backgroundColor: '#fff' }">
        <view class="content">
            <view class="card-item">
                <view class="title">身份证人像面</view>
                <view class="image-box">
                    <up-image
                        :src="idCardFront"
                        width="100%"
                        height="100%"
                        mode="aspectFit"
                        :show-loading="true"
                    >
                        <template #error>
                            <view class="error-slot">
                                <uni-icons type="image" size="40" color="#ccc"></uni-icons>
                                <text>暂无图片</text>
                            </view>
                        </template>
                    </up-image>
                </view>
            </view>
            <view class="card-item">
                <view class="title">身份证国徽面</view>
                <view class="image-box">
                    <up-image
                        :src="idCardBack"
                        width="100%"
                        height="100%"
                        mode="aspectFit"
                        :show-loading="true"
                    >
                        <template #error>
                            <view class="error-slot">
                                <uni-icons type="image" size="40" color="#ccc"></uni-icons>
                                <text>暂无图片</text>
                            </view>
                        </template>
                    </up-image>
                </view>
            </view>
        </view>
    </s-layout>
</template>

<script setup>
    import { ref } from 'vue';

    const idCardFront = ref('');
    const idCardBack = ref('');
</script>

<style lang="scss" scoped>
    .content {
        padding: 30rpx;
    }

    .card-item {
        margin-bottom: 50rpx;

        .title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 20rpx;
        }

        .image-box {
            width: 100%;
            height: 400rpx;
            background-color: #f5f5f5;
            border-radius: 12rpx;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1rpx solid #eee;
        }
    }

    .error-slot {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #999;
        font-size: 24rpx;

        text {
            margin-top: 10rpx;
        }
    }
</style>
