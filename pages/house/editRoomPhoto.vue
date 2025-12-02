<template>
    <s-layout :bgStyle="{ backgroundColor: '#fff' }">
        <template #center>
            <uni-segmented-control
                :values="list"
                :current="current"
                activeColor="#4a90e2"
                @clickItem="onClickTab"
            ></uni-segmented-control>
        </template>

        <!-- Content -->
        <view class="content-container">
            <view class="tips">
                提醒：请保证上传照片和视频的真实性，平台会对照片真实性进行检查，一经查实虚假照片您的房源照片将会被下架。此处仅展示房东上传的照片和视频
            </view>

            <view
                class="media-group"
                v-for="(group, index) in currentGroups"
                :key="`${current}-${index}`"
            >
                <view class="group-title">{{ group.name }}</view>
                <s-media-upload
                    v-model="group.items"
                    :maxCount="9"
                    :accept="current === 0 ? 'image' : 'video'"
                    :addIcon="current === 0 ? 'camera-filled' : 'videocam-filled'"
                    :autoUploadAuthUrl="authUrl"
                    :autoUploadHeader="uploadHeader"
                    @upload-success="(newItems) => handleUploadSuccess(group, newItems)"
                    @click-item="(e) => onMediaClick(e.item, group)"
                >
                    <template #item-overlay="{ item }">
                        <view class="tags" v-if="current === 0">
                            <view v-if="item.isMain" class="tag main">主图</view>
                            <view v-else-if="item.isDisplayed" class="tag displayed"> 已展示 </view>
                        </view>
                        <view class="check-icon" v-if="isEditMode">
                            <up-radio-group
                                :modelValue="selectedIds.includes(item.id) ? item.id : ''"
                                size="28rpx"
                            >
                                <up-radio :name="item.id" :label="null"></up-radio>
                            </up-radio-group>
                        </view>
                    </template>
                </s-media-upload>
            </view>
        </view>

        <!-- Bottom Bar -->
        <su-fixed bottom :bgStyles="{ backgroundColor: '#fff' }">
            <view class="bottom-bar">
                <!-- Delete Mode -->
                <template v-if="editType === 'delete'">
                    <view class="left-actions">
                        <view class="action-item" @tap="exitEditMode">
                            <uni-icons type="minus-filled" size="24" color="#999"></uni-icons>
                            <text>取消</text>
                        </view>
                        <view class="action-item" @tap="toggleSelectAll">
                            <uni-icons type="checkbox-filled" size="24" color="#999"></uni-icons>
                            <text>全选</text>
                        </view>
                    </view>
                    <up-button type="primary" @tap="confirmDelete">删除</up-button>
                </template>

                <!-- Set Main Mode -->
                <template v-else-if="editType === 'setMain'">
                    <view class="left-actions">
                        <view class="action-item" @tap="exitEditMode">
                            <uni-icons type="minus-filled" size="24" color="#999"></uni-icons>
                            <text>取消</text>
                        </view>
                    </view>
                    <up-button type="primary" @tap="confirmSetMain">设为主图</up-button>
                </template>

                <!-- View Mode Actions -->
                <template v-else>
                    <view class="tab-actions">
                        <view class="action-btn" @tap="enterEditMode('delete')">
                            <uni-icons type="trash" size="24" color="#666"></uni-icons>
                            <text>删除</text>
                        </view>
                        <view
                            class="action-btn"
                            @tap="enterEditMode('setMain')"
                            v-if="current === 0"
                        >
                            <uni-icons type="star" size="24" color="#666"></uni-icons>
                            <text>设为主图</text>
                        </view>
                        <up-button type="primary">完成</up-button>
                    </view>
                </template>
            </view>
        </su-fixed>
    </s-layout>
</template>

<script setup>
    import { ref, reactive, computed } from 'vue';
    import { baseUrl, apiPath } from '@/sheep/config';
    import { getAccessToken, getTenantId } from '@/sheep/request';
    import sMediaUpload from '@/sheep/components/s-media-upload/s-media-upload.vue';

    const list = ref(['照片', '视频']);
    const current = ref(0);
    const isEditMode = ref(false);
    const editType = ref(null); // 'delete' | 'setMain' | null
    const selectedIds = ref([]);

    const authUrl = baseUrl + apiPath + '/infra/file/presigned-url';
    const uploadHeader = {
        Authorization: 'Bearer ' + getAccessToken(),
        'tenant-id': getTenantId(),
        Accept: '*/*',
    };

    // Mock Data
    const photoGroups = reactive([
        {
            name: '卧室',
            items: [
                {
                    id: '1',
                    url: '/static/rooms/room1.jpg',
                    isMain: true,
                    isDisplayed: true,
                    isPrivate: true,
                },
                {
                    id: '2',
                    url: '/static/rooms/room2.jpeg',
                    isMain: false,
                    isDisplayed: true,
                    isPrivate: true,
                },
                {
                    id: '3',
                    url: 'https://via.placeholder.com/150',
                    isMain: false,
                    isDisplayed: true,
                    isPrivate: true,
                },
                {
                    id: '4',
                    url: 'https://via.placeholder.com/150',
                    isMain: false,
                    isDisplayed: true,
                    isPrivate: true,
                },
            ],
        },
        {
            name: '客厅',
            items: [],
        },
        {
            name: '卫生间',
            items: [
                {
                    id: '5',
                    url: 'https://via.placeholder.com/150',
                    isMain: false,
                    isDisplayed: true,
                    isPrivate: true,
                },
            ],
        },
        {
            name: '厨房',
            items: [
                {
                    id: '6',
                    url: 'https://via.placeholder.com/150',
                    isMain: false,
                    isDisplayed: true,
                    isPrivate: true,
                },
                {
                    id: '7',
                    url: 'https://via.placeholder.com/150',
                    isMain: false,
                    isDisplayed: true,
                    isPrivate: true,
                },
            ],
        },
        {
            name: '周边环境',
            items: [],
        },
    ]);

    const videoGroups = reactive([
        {
            name: '房源视频',
            items: [
                {
                    id: 'v1',
                    url: 'https://via.placeholder.com/150', // Replace with video thumbnail
                },
            ],
        },
    ]);

    const currentGroups = computed(() => (current.value === 0 ? photoGroups : videoGroups));

    const handleUploadSuccess = (group, newItems) => {
        newItems.forEach((item) => {
            group.items.push({
                id: item.url,
                url: item.url,
                isMain: false,
                isDisplayed: true,
                isPrivate: true,
                thumb: item.thumb || '', // 视频封面
            });
        });
    };

    const onClickTab = (e) => {
        if (current.value !== e.currentIndex) {
            current.value = e.currentIndex;
            exitEditMode(); // Exit edit mode when switching tabs
        }
    };

    const enterEditMode = (type) => {
        editType.value = type;
        isEditMode.value = true;
        selectedIds.value = [];
    };

    const exitEditMode = () => {
        editType.value = null;
        isEditMode.value = false;
        selectedIds.value = [];
    };

    const toggleSelectAll = () => {
        const allIds = [];
        currentGroups.value.forEach((group) => {
            group.items.forEach((item) => allIds.push(item.id));
        });

        if (selectedIds.value.length === allIds.length) {
            selectedIds.value = [];
        } else {
            selectedIds.value = allIds;
        }
    };

    const onMediaClick = (item, group) => {
        if (isEditMode.value) {
            if (editType.value === 'setMain') {
                // Single selection for setMain
                selectedIds.value = [item.id];
            } else {
                // Multiple selection for delete
                const index = selectedIds.value.indexOf(item.id);
                if (index > -1) {
                    selectedIds.value.splice(index, 1);
                } else {
                    selectedIds.value.push(item.id);
                }
            }
        } else {
            if (current.value === 0) {
                uni.previewImage({
                    urls: group.items.map((i) => i.url),
                    current: item.url,
                });
            } else {
                // Preview video
                console.log('Preview video', item);
            }
        }
    };

    const confirmDelete = () => {
        if (selectedIds.value.length === 0) return;

        uni.showModal({
            title: '提示',
            content: '确定要删除选中的项目吗？',
            success: (res) => {
                if (res.confirm) {
                    currentGroups.value.forEach((group) => {
                        group.items = group.items.filter(
                            (item) => !selectedIds.value.includes(item.id),
                        );
                    });
                    exitEditMode();
                }
            },
        });
    };

    const confirmSetMain = () => {
        if (selectedIds.value.length !== 1) {
            uni.showToast({
                title: '请选择一张照片设为主图',
                icon: 'none',
            });
            return;
        }

        const selectedId = selectedIds.value[0];

        // Find the photo and its group
        let targetGroup = null;
        let targetItem = null;

        for (const group of photoGroups) {
            const item = group.items.find((i) => i.id === selectedId);
            if (item) {
                targetGroup = group;
                targetItem = item;
                break;
            }
        }

        if (targetGroup && targetItem) {
            targetGroup.items.forEach((i) => (i.isMain = false));
            targetItem.isMain = true;

            uni.showToast({
                title: '设置成功',
                icon: 'success',
            });

            exitEditMode();
        }
    };
</script>

<style lang="scss" scoped>
    :deep(.segmented-control) {
        width: 50vw;
        height: 60rpx;
    }

    .content-container {
        flex: 1;
        min-height: 0;
        overflow: auto;
        padding-bottom: 100rpx;
    }

    .tips {
        padding: 20rpx 30rpx;
        background-color: #fff9e6;
        color: #e6a23c;
        font-size: 24rpx;
        margin-bottom: 20rpx;
    }

    .media-group {
        margin-bottom: 30rpx;
        padding: 0 30rpx;

        .group-title {
            font-size: 30rpx;
            font-weight: bold;
            margin-bottom: 20rpx;
            color: #333;
        }
    }

    .bottom-bar {
        height: 100rpx;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 30rpx;
        box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

        // View Mode
        .tab-actions {
            width: 100%;
            display: flex;
            justify-content: space-around;
            gap: 40rpx;

            .action-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: 20rpx;
                color: #666;
                flex-shrink: 0;
            }
        }

        // Edit Mode
        .left-actions {
            display: flex;
            align-items: center;

            .action-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-right: 40rpx;
                font-size: 20rpx;
                color: #999;
            }
        }
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
</style>
