<template>
    <view class="room-item-container" @click="onClick">
        <template v-if="isAdd">
            <view class="add-box">
                <uni-icons type="plusempty" size="40" color="#c0c4cc"></uni-icons>
            </view>
            <view class="add-text">添加房间</view>
        </template>
        <template v-else>
            <up-image :src="data.url" mode="aspectFill" width="100%" height="240rpx">
                <template #error>
                    <view style="font-size: 24rpx">加载失败</view>
                </template>
            </up-image>
            <view class="rental-status">{{ data.rentalStatus }}</view>
            <view class="price">￥{{ data.price }}</view>
        </template>
    </view>
</template>

<script setup>
    const props = defineProps({
        data: {
            type: Object,
            default: () => ({}),
        },
        isAdd: {
            type: Boolean,
            default: false,
        },
    });

    const emits = defineEmits(['click']);

    const onClick = () => {
        emits('click', props.data);
    };
</script>

<style lang="scss" scoped>
    .room-item-container {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: $bg-page;
        overflow: hidden;

        .add-box {
            width: 100%;
            height: 240rpx;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 4rpx dashed $gray-c;
            box-sizing: border-box;
        }

        .add-text {
            padding: 20rpx 0;
            font-size: 26rpx;
            font-weight: 300;
            color: $dark-3;
        }

        // 右上角角标
        .rental-status {
            position: absolute;
            top: 0;
            right: 0;
            background-color: $dark-4;
            color: $white;
            padding: 2px 6px;
            border-radius: 0 0 0 8rpx;
            font-size: 20rpx;
            z-index: 1;
        }

        .price {
            padding: 20rpx 0;
            color: $red;
        }
    }
</style>
