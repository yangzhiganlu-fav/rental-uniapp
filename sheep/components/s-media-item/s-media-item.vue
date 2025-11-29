<template>
    <view class="media-item" @tap="onClick">
        <!-- Add Mode -->
        <view v-if="type === 'add'" class="add-box">
            <uni-icons
                :type="isVideo ? 'videocam-filled' : 'camera-filled'"
                size="30"
                color="#c0c4cc"
            ></uni-icons>
        </view>

        <!-- Display Mode -->
        <view v-else class="img-box">
            <up-image
                v-if="!isVideo"
                :src="data.url"
                mode="aspectFill"
                width="100%"
                height="100%"
            ></up-image>

            <video
                v-else
                :src="data.url"
                class="media-video"
                object-fit="cover"
                :controls="false"
                poster="/static/room/room1.jpg"
            ></video>

            <!-- Tags (Only for photos) -->
            <view class="tags" v-if="!isVideo">
                <view v-if="data.isMain" class="tag main">主图</view>
                <view v-else-if="data.isDisplayed" class="tag displayed">已展示</view>
            </view>

            <!-- Checkbox (Edit Mode) -->
            <view class="check-icon" v-if="checkable">
                <up-radio-group :modelValue="checked ? data.id : ''" size="28rpx">
                    <up-radio :name="data.id" :label="null"></up-radio>
                </up-radio-group>
            </view>
        </view>
    </view>
</template>

<script setup>
    const props = defineProps({
        data: {
            type: Object,
            default: () => ({}),
        },
        type: {
            type: String,
            default: 'display', // 'display' | 'add'
        },
        checkable: {
            type: Boolean,
            default: false,
        },
        checked: {
            type: Boolean,
            default: false,
        },
        isVideo: {
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
    .media-item {
        width: 100%;
        height: 0;
        padding-bottom: 100%; // Square
        position: relative;
        border-radius: 8rpx;
        overflow: hidden;
        background-color: #f5f5f5;

        .add-box,
        .img-box {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .add-box {
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2rpx dashed #dcdfe6;
            box-sizing: border-box;
        }

        .img-box {
            .media-video {
                width: 100%;
                height: 100%;
                display: block;
            }

            .tags {
                position: absolute;
                top: 0;
                left: 0;
                display: flex;
                flex-wrap: wrap;
                z-index: 5;

                .tag {
                    font-size: 20rpx;
                    padding: 2rpx 6rpx;
                    color: #fff;
                    margin-right: 4rpx;
                    border-bottom-right-radius: 8rpx;

                    &.main {
                        background-color: #4a90e2;
                    }
                    &.displayed {
                        background-color: #a0cfff;
                    }
                }
            }

            .check-icon {
                position: absolute;
                top: -6rpx;
                right: -8rpx;
                z-index: 10;
                pointer-events: none;
            }

            .play-icon {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 60rpx;
                height: 60rpx;
                background-color: rgba(0, 0, 0, 0.3);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 5;
            }
        }
    }

    :deep(.uni-video-cover-play-button) {
        font-size: 40rpx !important;
    }
</style>
