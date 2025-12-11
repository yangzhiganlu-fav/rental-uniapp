<template>
    <up-grid :col="col" :border="false" customStyle="margin: 0 -10rpx">
        <!-- Add Button -->
        <up-grid-item class="grid-item-wrap" v-if="showAdd">
            <up-upload
                v-model:fileList="internalUploadList"
                :name="name"
                multiple
                :maxCount="maxCount - modelValue.length"
                width="100%"
                height="100%"
                autoUpload
                autoDelete
                customAfterAutoUpload
                :autoUploadDriver="autoUploadDriver"
                :autoUploadAuthUrl="autoUploadAuthUrl"
                :autoUploadHeader="autoUploadHeader"
                :accept="accept"
                :previewImage="false"
                :getVideoThumb="getVideoThumb"
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

        <!-- 媒体项 -->
        <up-grid-item
            class="grid-item-wrap"
            v-for="(item, index) in modelValue"
            :key="item.url || index"
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
    import { baseUrl, apiPath } from '@/sheep/config';
    import { getAccessToken, getTenantId } from '@/sheep/request';

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
            default: 'image', // image, video, all
        },
        name: {
            type: String,
            default: 'file',
        },
        autoUploadDriver: {
            type: String,
            default: 'oss', // oss, local
        },
        autoUploadAuthUrl: {
            type: String,
            default: `${baseUrl}${apiPath}/infra/file/presigned-url`,
        },
        autoUploadHeader: {
            type: Object,
            default: () => ({
                Authorization: `Bearer ${getAccessToken()}`,
                'tenant-id': getTenantId(),
                Accept: '*/*',
            }),
        },
        deletable: {
            type: Boolean,
            default: false,
        },
        addIcon: {
            type: String,
            default: 'camera-filled',
        },
        getVideoThumb: {
            type: Boolean,
            default: true, // 视频上传后是否获取封面图(仅支持OSS模式)
        },
    });

    const emit = defineEmits(['update:modelValue', 'click-item', 'delete-item', 'upload-success']);

    const internalUploadList = ref([]);

    const showAdd = computed(() => {
        return props.modelValue.length < props.maxCount;
    });

    // 判断是否为视频
    const isVideo = (item) => {
        // 根据 accept 属性判断
        if (props.accept === 'video') return true;
        // 根据 URL 扩展名判断
        if (item.url && /\.(mp4|mov|avi)$/i.test(item.url)) return true;
        // 根据 type 字段判断
        if (item.type && item.type.startsWith('video/')) return true;
        return false;
    };

    // 处理上传成功
    const onUploadSuccess = (response) => {
        console.log('afterAutoUpload response:', response);

        // OSS模式和local模式的响应处理
        if (props.autoUploadDriver === 'oss') {
            // OSS模式：后端返回签名信息，前端直接上传到OSS
            // response包含OSS返回的信息
            const fileData = response.data || {};
            let url = fileData.url || '';
            const thumb = fileData.thumb || ''; // 视频封面图

            // 调用回调函数，告诉 up-upload 组件使用这个 URL
            if (response.callback && typeof response.callback === 'function') {
                const fileInfo = {
                    url: url,
                };

                // 如果有视频封面图，添加到返回信息中
                if (thumb) {
                    fileInfo.thumb = thumb;
                }

                response.callback(fileInfo);
            }

            // 通知父组件文件上传成功
            if (url) {
                const newItem = {
                    url: url,
                    type: isVideoFile(url) ? 'video' : 'image',
                };

                // 如果有封面图，添加到结果中
                if (thumb) {
                    newItem.thumb = thumb;
                }

                emit('upload-success', [newItem]);

                // 更新modelValue
                const updatedList = [...props.modelValue, newItem];
                emit('update:modelValue', updatedList);
            }
        } else {
            // local模式：后端直接返回上传后的URL
            const fileData = response.data || {};
            const url = fileData.url; // 后端返回的访问URL

            if (url) {
                // 调用回调函数，告诉 up-upload 组件使用这个 URL
                if (response.callback && typeof response.callback === 'function') {
                    response.callback({
                        url: url,
                    });
                }

                // 通知父组件文件上传成功
                const newItem = {
                    url: url,
                    type: isVideoFile(url) ? 'video' : 'image',
                };

                emit('upload-success', [newItem]);

                // 更新modelValue
                const updatedList = [...props.modelValue, newItem];
                emit('update:modelValue', updatedList);
            }
        }
    };

    // 判断是否为视频文件
    const isVideoFile = (url) => {
        if (!url) return false;
        const videoExts = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.m4v', '.3gp', '.mkv'];
        return videoExts.some((ext) => url.toLowerCase().includes(ext));
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
