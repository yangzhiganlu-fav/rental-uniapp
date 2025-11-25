<template>
    <su-popup :show="show" round="20" @maskClick="close">
        <view class="popup-content">
            <view class="popup-header">
                <text class="popup-title">房源联系人</text>
                <text class="popup-cancel" @tap="close">取消</text>
            </view>
            <view class="popup-body">
                <view class="contact-item" v-for="(item, index) in contacts" :key="index">
                    <text class="contact-name">{{ item.name }}</text>
                    <text class="contact-phone">{{ item.phone }}</text>
                </view>
                <view v-if="!contacts.length" class="empty-tip"> 暂无联系人 </view>
            </view>
        </view>
    </su-popup>
</template>

<script setup>
    import { ref } from 'vue';

    const props = defineProps({
        contacts: {
            type: Array,
            default: () => [],
        },
    });

    const show = ref(false);

    const open = () => {
        show.value = true;
    };

    const close = () => {
        show.value = false;
    };

    defineExpose({
        open,
        close,
    });
</script>

<style lang="scss" scoped>
    .popup-content {
        .popup-header {
            padding: 30rpx 0;
            position: relative;
            text-align: center;
            padding-bottom: 20rpx;
            border-bottom: 1rpx solid #eee;
            background-color: #eee;

            .popup-title {
                font-size: 30rpx;
                color: #3d9bff;
            }

            .popup-cancel {
                font-size: 28rpx;
                color: #3d9bff;
                position: absolute;
                right: 32rpx;
            }
        }

        .popup-body {
            .contact-item {
                text-align: center;
                padding: 20rpx 0;
                border-bottom: 1rpx solid #f0f0f0;

                .contact-name {
                    font-size: 28rpx;
                    color: #333;
                }

                .contact-phone {
                    margin-left: 15rpx;
                    font-size: 28rpx;
                    color: #666;
                }
            }
        }
    }

    .empty-tip {
        text-align: center;
        padding: 40rpx 0;
        color: #999;
        font-size: 28rpx;
    }
</style>
