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

            <template v-if="current === 0">
                <s-media-group
                    v-for="(group, index) in photoGroups"
                    :key="index"
                    :title="group.name"
                    :list="group.items"
                    :checkable="isEditMode"
                    :selectedIds="selectedIds"
                    @add="onAddPhoto(group)"
                    @itemClick="onPhotoClick($event, group)"
                ></s-media-group>
            </template>
            <template v-if="current === 1">
                <s-media-group
                    v-for="(group, index) in videoGroups"
                    :key="`video-${index}`"
                    :title="group.name"
                    :list="group.items"
                    :checkable="isEditMode"
                    :selectedIds="selectedIds"
                    :isVideo="true"
                    @add="onAddVideo(group)"
                    @itemClick="onVideoClick($event, group)"
                ></s-media-group>
            </template>
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
                    <!-- Photo Mode -->
                    <view class="tab-actions" v-if="current === 0">
                        <view class="action-btn" @tap="enterEditMode('delete')">
                            <uni-icons type="trash" size="24" color="#666"></uni-icons>
                            <text>删除</text>
                        </view>
                        <view class="action-btn" @tap="enterEditMode('setMain')">
                            <uni-icons type="star" size="24" color="#666"></uni-icons>
                            <text>设为主图</text>
                        </view>
                        <up-button type="primary">完成</up-button>
                    </view>
                    <!-- Video Mode -->
                    <view class="tab-actions" v-else>
                        <view class="action-btn" @tap="enterEditMode('delete')">
                            <uni-icons type="trash" size="24" color="#666"></uni-icons>
                            <text>删除</text>
                        </view>
                        <up-button type="primary">完成</up-button>
                    </view>
                </template>
            </view>
        </su-fixed>
    </s-layout>
</template>

<script setup>
    import { ref, reactive } from 'vue';
    import sMediaGroup from '@/sheep/components/s-media-group/s-media-group.vue';

    const list = ref(['照片', '视频']);
    const current = ref(0);
    const isEditMode = ref(false);
    const editType = ref(null); // 'delete' | 'setMain' | null
    const selectedIds = ref([]);

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
        if (current.value === 0) {
            photoGroups.forEach((group) => {
                group.items.forEach((item) => allIds.push(item.id));
            });
        } else {
            videoGroups.forEach((group) => {
                group.items.forEach((item) => allIds.push(item.id));
            });
        }

        if (selectedIds.value.length === allIds.length) {
            selectedIds.value = [];
        } else {
            selectedIds.value = allIds;
        }
    };

    const onAddPhoto = (group) => {
        uni.chooseImage({
            count: 9,
            success: (res) => {
                res.tempFilePaths.forEach((filePath) => {
                    group.items.push({
                        id: filePath,
                        url: filePath,
                        isMain: false,
                        isDisplayed: true,
                        isPrivate: true,
                    });
                });
            },
        });
    };

    const onAddVideo = (group) => {
        uni.chooseVideo({
            success: (res) => {
                group.items.push({
                    id: res.tempFilePath,
                    url: res.tempFilePath,
                });
            },
        });
    };

    const onPhotoClick = (item, group) => {
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
            uni.previewImage({
                urls: group.items.map((i) => i.url),
                current: item.url,
            });
        }
    };

    const onVideoClick = (item, group) => {
        if (isEditMode.value) {
            // Multiple selection for delete (Video only supports delete in edit mode)
            const index = selectedIds.value.indexOf(item.id);
            if (index > -1) {
                selectedIds.value.splice(index, 1);
            } else {
                selectedIds.value.push(item.id);
            }
        } else {
            // Preview video
            console.log('Preview video', item);
            // Implement video preview logic
        }
    };

    const confirmDelete = () => {
        if (selectedIds.value.length === 0) return;

        uni.showModal({
            title: '提示',
            content: '确定要删除选中的项目吗？',
            success: (res) => {
                if (res.confirm) {
                    // Delete logic
                    if (current.value === 0) {
                        photoGroups.forEach((group) => {
                            group.items = group.items.filter(
                                (item) => !selectedIds.value.includes(item.id),
                            );
                        });
                    } else {
                        videoGroups.forEach((group) => {
                            group.items = group.items.filter(
                                (item) => !selectedIds.value.includes(item.id),
                            );
                        });
                    }
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
</style>
