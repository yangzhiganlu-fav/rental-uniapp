<template>
    <up-popup :show="show" @close="close">
        <view class="popup-content">
            <view class="popup-header">
                <text class="popup-title">房源联系人</text>
                <text class="popup-cancel" @tap="close">取消</text>
            </view>
            <view class="popup-body">
                <up-list v-if="contacts.length" height="400rpx">
                    <up-list-item v-for="(item, index) in contacts" :key="index">
                        <view class="contact-item">
                            <text class="contact-name">{{ item.name }}</text>
                            <text class="contact-phone">{{ item.phone }}</text>
                        </view>
                    </up-list-item>
                </up-list>
                <view v-else class="empty-tip">暂无联系人</view>
            </view>
        </view>
    </up-popup>
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

    .empty-tip {
        text-align: center;
        padding: 40rpx 0;
        color: #999;
        font-size: 28rpx;
    }
</style>
