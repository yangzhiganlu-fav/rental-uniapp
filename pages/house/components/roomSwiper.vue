<template>
    <view class="swiper-box">
        <up-swiper
            :list="list"
            height="200"
            @change="change"
            :indicatorStyle="{ right: '20rpx', bottom: '20rpx' }"
        >
            <template #default="{ item }">
                <video
                    v-if="item.type === 'video/mp4'"
                    :src="item.url"
                    style="width: 100%; height: 100%"
                    objectFit="cover"
                    controls
                ></video>
                <image
                    v-else
                    :src="item.url"
                    mode="aspectFill"
                    style="width: 100%; height: 100%"
                ></image>
            </template>
            <template #indicator>
                <view class="indicator">
                    <up-icon
                        :name="list[currentNum]?.type === 'video/mp4' ? 'play-circle' : 'photo'"
                        color="#fff"
                        size="14"
                    ></up-icon>
                    <text class="indicator-text">{{ currentNum + 1 }}/{{ list.length }}</text>
                </view>
            </template>
        </up-swiper>
        <view class="edit-icon" @tap="onEditClick">
            <up-icon name="edit-pen" color="#fff" size="20"></up-icon>
        </view>
    </view>
</template>

<script setup>
    import { ref } from 'vue';

    const props = defineProps({
        list: {
            type: Array,
            default: () => [],
        },
    });

    const emits = defineEmits(['edit']);

    const currentNum = ref(0);

    const change = (e) => {
        currentNum.value = e.current;
    };

    const onEditClick = () => {
        emits('edit');
    };
</script>

<style lang="scss" scoped>
    .swiper-box {
        position: relative;
        .indicator {
            @include flex;
            flex-direction: row;
            align-items: center;
            padding: 6rpx 12rpx;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 100rpx;
            .indicator-text {
                color: $white;
                font-size: $tx-sm;
                margin-left: 6rpx;
            }
        }
        .edit-icon {
            position: absolute;
            top: 20rpx;
            right: 20rpx;
            z-index: 10;
            background-color: rgba(0, 0, 0, 0.5);
            padding: 10rpx;
            border-radius: 50%;
        }
    }
</style>
