<template>
    <up-grid :col="col" :border="false" customStyle="margin: 0 -10rpx">
        <!-- Add Button -->
        <up-grid-item class="grid-item-wrap" v-if="showAdd">
            <up-upload
                :fileList="internalUploadList"
                :name="name"
                multiple
                :maxCount="maxCount - modelValue.length"
                width="100%"
                height="100%"
                autoUpload
                :autoUploadDriver="autoUploadDriver"
                :autoUploadAuthUrl="autoUploadAuthUrl"
                :autoUploadHeader="autoUploadHeader"
                :accept="accept"
                :previewImage="false"
                customStyle="width: 100%; height: 100%;"
                @afterAutoUpload="onUploadSuccess"
            >
                <template #trigger>
                    <slot name="upload-trigger">
                        <view class="media-item">
                            <view class="add-box">
                                <uni-icons :type="addIcon" size="30" color="#c0c4cc"></uni-icons>
                            </view>
                        </view>
                    </slot>
                </template>
            </up-upload>
        </up-grid-item>

        <!-- Media Items -->
        <up-grid-item
            class="grid-item-wrap"
            v-for="(item, index) in modelValue"
            :key="item.id || item.url || index"
        >
            <view class="media-item" @tap="onItemClick(item, index)">
                <view class="img-box">
                    <!-- Video -->
                    <template v-if="isVideo(item)">
                        <video
                            :src="item.url"
                            class="media-video"
                            object-fit="cover"
                            :controls="false"
                            :show-center-play-btn="false"
                        ></video>
                        <view class="play-icon">
                            <uni-icons type="caret-right-filled" size="30" color="#fff"></uni-icons>
                        </view>
                    </template>
                    <!-- Image -->
                    <template v-else>
                        <up-image
                            :src="item.url"
                            mode="aspectFill"
                            width="100%"
                            height="100%"
                        ></up-image>
                    </template>

                    <!-- Delete Icon (Standard Mode) -->
                    <view v-if="deletable" class="delete-icon" @tap.stop="onDelete(index)">
                        <uni-icons type="clear" size="20" color="#3c9cff"></uni-icons>
                    </view>

                    <!-- Custom Overlay (Tags, Selection, etc.) -->
                    <slot name="item-overlay" :item="item" :index="index"></slot>
                </view>
            </view>
        </up-grid-item>
    </up-grid>
</template>

<script setup>
    import { ref, computed } from 'vue';

    const props = defineProps({
        modelValue: {
            type: Array,
            default: () => [],
        },
        col: {
            type: [Number, String],
            default: 4,
        },
        maxCount: {
            type: Number,
            default: 9,
        },
        accept: {
            type: String,
            default: 'image', // image, video
        },
        name: {
            type: String,
            default: 'file',
        },
        autoUploadDriver: {
            type: String,
            default: 'oss',
        },
        autoUploadAuthUrl: {
            type: String,
            required: true,
        },
        autoUploadHeader: {
            type: Object,
            default: () => ({}),
        },
        deletable: {
            type: Boolean,
            default: false,
        },
        addIcon: {
            type: String,
            default: 'camera-filled',
        },
    });

    const emit = defineEmits(['update:modelValue', 'click-item', 'delete-item', 'upload-success']);

    const internalUploadList = ref([]);

    const showAdd = computed(() => {
        return props.modelValue.length < props.maxCount;
    });

    const isVideo = (item) => {
        // Check if item is video based on accept prop or file extension/type if available
        // For simplicity, if accept is 'video', we treat all as video, or check item.type
        if (props.accept === 'video') return true;
        // Simple check on URL extension if mixed (not fully robust but works for basic cases)
        if (item.url && /\.(mp4|mov|avi)$/i.test(item.url)) return true;
        return false;
    };

    const onUploadSuccess = () => {
        const list = internalUploadList.value;
        const newItems = [];
        if (list && list.length > 0) {
            for (let i = list.length - 1; i >= 0; i--) {
                const item = list[i];
                if (item.status === 'success' && item.url) {
                    newItems.push({
                        url: item.url,
                        // Add other properties if needed, or let parent handle
                        id: item.url, // Fallback ID
                    });
                    list.splice(i, 1);
                }
            }
        }

        if (newItems.length > 0) {
            // Emit event to let parent handle adding to the list
            // Or we can update modelValue directly if we want to be self-contained
            // But parent might want to add extra fields (like isMain, etc.)
            emit('upload-success', newItems);
        }
    };

    const onItemClick = (item, index) => {
        emit('click-item', { item, index });
    };

    const onDelete = (index) => {
        emit('delete-item', index);
    };
</script>

<style lang="scss" scoped>
    .grid-item-wrap {
        padding: 10rpx;
        box-sizing: border-box;
    }

    :deep(.u-upload__wrap > view) {
        width: 100%;
        height: 100%;
    }

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

            .delete-icon {
                position: absolute;
                top: 0;
                right: 0;
                z-index: 10;
                background-color: transparent;
                border-bottom-left-radius: 8rpx;
                padding: 4rpx;
            }
        }
    }
</style>
