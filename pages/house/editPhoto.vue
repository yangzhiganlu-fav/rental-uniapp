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
                    @upload-success="(newItems) => handleUploadSuccess(group, newItems)"
                    @click-item="(e) => onMediaClick(e.item, group)"
                >
                    <template #item-overlay="{ item }">
                        <view class="tags" v-if="current === 0">
                            <view v-if="item.isCover === 1" class="tag main">主图</view>
                            <view v-else class="tag displayed">已展示</view>
                        </view>
                        <view class="check-icon" v-if="isEditMode">
                            <up-radio-group
                                :modelValue="selectedIds.includes(item.url) ? item.url : ''"
                                size="28rpx"
                            >
                                <up-radio :name="item.url" :label="null"></up-radio>
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
                        <up-button type="primary" @tap="onComplete">完成</up-button>
                    </view>
                </template>
            </view>
        </su-fixed>
    </s-layout>
</template>

<script setup>
    import { ref, reactive, computed } from 'vue';
    import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app';
    import HouseApi from '@/sheep/api/house';

    const roomId = ref('');
    const loading = ref(false);

    onLoad((options) => {
        roomId.value = options.id || '';
        if (roomId.value) {
            loadRoomData();
        }
    });

    onPullDownRefresh(async () => {
        await loadRoomData();
        uni.stopPullDownRefresh();
    });

    // 加载房间数据
    const loadRoomData = async () => {
        try {
            loading.value = true;
            const res = await HouseApi.getRoomDetail({ id: roomId.value });

            if (res.code === 0 && res.data) {
                const fileList = res.data.photoList || [];

                // 清空现有数据
                photoGroups.forEach((group) => (group.items = []));
                videoGroups.forEach((group) => (group.items = []));

                // 分类填充数据
                fileList.forEach((file) => {
                    const item = {
                        url: file.url,
                        type: file.type,
                        isCover: file.isCover || 0,
                        code: file.code,
                    };

                    // 根据 code 判断是图片还是视频（code=6 为视频，1-5为图片分类）
                    if (file.code === 6) {
                        const videoGroup = videoGroups.find((g) => g.code === 6);
                        if (videoGroup) {
                            videoGroup.items.push(item);
                        }
                    } else {
                        // 图片，根据 code 分类（1=卧室, 2=客厅, 3=卫生间, 4=厨房, 5=周边环境）
                        const photoGroup = photoGroups.find((g) => g.code === file.code);
                        if (photoGroup) {
                            photoGroup.items.push(item);
                        }
                    }
                });
            }
        } catch (error) {
            console.error('加载房间数据失败:', error);
            uni.showToast({
                title: '加载数据失败',
                icon: 'none',
            });
        } finally {
            loading.value = false;
        }
    };
    const list = ref(['照片', '视频']);
    const current = ref(0);
    const isEditMode = ref(false);
    const editType = ref(null); // 'delete' | 'setMain' | null
    const selectedIds = ref([]);

    // 照片分类 code: 1=卧室, 2=客厅, 3=卫生间, 4=厨房, 5=周边环境
    const photoGroups = reactive([
        {
            name: '卧室',
            code: 1,
            items: [],
        },
        {
            name: '客厅',
            code: 2,
            items: [],
        },
        {
            name: '卫生间',
            code: 3,
            items: [],
        },
        {
            name: '厨房',
            code: 4,
            items: [],
        },
        {
            name: '周边环境',
            code: 5,
            items: [],
        },
    ]);

    // 视频分组（code: 6）
    const videoGroups = reactive([
        {
            name: '房源视频',
            code: 6,
            items: [],
        },
    ]);

    const currentGroups = computed(() => (current.value === 0 ? photoGroups : videoGroups));

    // 处理上传成功 - 上传成功后全量更新到后端
    const handleUploadSuccess = async (group, newItems) => {
        // 添加新上传的文件到组中
        newItems.forEach((item) => {
            const fileItem = {
                url: item.url,
                type: item.type || (current.value === 0 ? 'image' : 'video'),
                isCover: 0,
                code: group.code,
                thumb: item.thumb || '', // 视频封面图
            };

            group.items.push(fileItem);
        });

        // 上传成功后立即全量更新到后端
        await saveAllPhotos();
    };

    // 全量保存所有照片和视频到后端
    const saveAllPhotos = async () => {
        const fileList = getFileList();

        try {
            const res = await HouseApi.updateRoomPhotos({
                roomId: roomId.value,
                fileList: fileList,
            });

            if (res.code === 0) {
                console.log('照片/视频同步成功');
            }
        } catch (error) {
            console.error('同步照片/视频失败:', error);
            uni.showToast({
                title: '同步失败，请稍后重试',
                icon: 'none',
            });
        }
    };

    // 切换标签页
    const onClickTab = (e) => {
        if (current.value !== e.currentIndex) {
            current.value = e.currentIndex;
            exitEditMode(); // 切换标签时退出编辑模式
        }
    };

    // 进入编辑模式
    const enterEditMode = (type) => {
        editType.value = type;
        isEditMode.value = true;
        selectedIds.value = [];
    };

    // 退出编辑模式
    const exitEditMode = () => {
        editType.value = null;
        isEditMode.value = false;
        selectedIds.value = [];
    };

    // 切换全选状态
    const toggleSelectAll = () => {
        const allUrls = [];
        currentGroups.value.forEach((group) => {
            group.items.forEach((item) => allUrls.push(item.url));
        });

        if (selectedIds.value.length === allUrls.length) {
            selectedIds.value = [];
        } else {
            selectedIds.value = allUrls;
        }
    };

    // 点击媒体项
    const onMediaClick = (item, group) => {
        if (isEditMode.value) {
            if (editType.value === 'setMain') {
                // 设置主图模式：单选
                selectedIds.value = [item.url];
            } else {
                // 删除模式：多选
                const index = selectedIds.value.indexOf(item.url);
                if (index > -1) {
                    selectedIds.value.splice(index, 1);
                } else {
                    selectedIds.value.push(item.url);
                }
            }
        } else {
            // 预览模式
            if (current.value === 0) {
                uni.previewImage({
                    urls: group.items.map((i) => i.url),
                    current: item.url,
                });
            } else {
                // 预览视频
                console.log('预览视频', item);
            }
        }
    };

    // 确认删除
    const confirmDelete = async () => {
        if (selectedIds.value.length === 0) return;

        uni.showModal({
            title: '提示',
            content: '确定要删除选中的项目吗？',
            success: async (res) => {
                if (res.confirm) {
                    currentGroups.value.forEach((group) => {
                        group.items = group.items.filter(
                            (item) => !selectedIds.value.includes(item.url),
                        );
                    });
                    exitEditMode();

                    // 删除后立即同步到后端
                    await saveAllPhotos();

                    uni.showToast({
                        title: '删除成功',
                        icon: 'success',
                    });
                }
            },
        });
    };

    // 确认设置主图
    const confirmSetMain = async () => {
        if (selectedIds.value.length !== 1) {
            uni.showToast({
                title: '请选择一张照片设为主图',
                icon: 'none',
            });
            return;
        }

        const selectedUrl = selectedIds.value[0];

        // 查找目标照片和分组
        let targetGroup = null;
        let targetItem = null;

        for (const group of photoGroups) {
            const item = group.items.find((i) => i.url === selectedUrl);
            if (item) {
                targetGroup = group;
                targetItem = item;
                break;
            }
        }

        if (targetGroup && targetItem) {
            // 清除所有照片的主图标记
            photoGroups.forEach((group) => {
                group.items.forEach((i) => {
                    i.isCover = 0;
                });
            });

            // 设置选中照片为主图
            targetItem.isCover = 1;

            exitEditMode();

            // 设置主图后立即同步到后端
            await saveAllPhotos();

            uni.showToast({
                title: '设置成功',
                icon: 'success',
            });
        }
    };

    // 获取格式化的 fileList 数据（用于提交给后端）
    const getFileList = () => {
        const fileList = [];

        // 收集所有照片（code: 1=卧室, 2=客厅, 3=卫生间, 4=厨房, 5=周边环境）
        photoGroups.forEach((group) => {
            group.items.forEach((item) => {
                fileList.push({
                    url: item.url,
                    type: item.type || 'image',
                    isCover: item.isCover || 0,
                    code: group.code,
                });
            });
        });

        // 收集所有视频（code: 6，isCover固定为0）
        videoGroups.forEach((group) => {
            group.items.forEach((item) => {
                fileList.push({
                    url: item.url,
                    type: item.type || 'video',
                    isCover: 0, // 视频没有主图概念
                    code: group.code, // 使用 group.code 确保是 6
                    thumb: item.thumb || '', // 视频封面图
                });
            });
        });

        return fileList;
    };

    // 完成编辑
    const onComplete = async () => {
        const fileList = getFileList();

        console.log('提交的 fileList:', fileList);

        try {
            await HouseApi.updateRoomPhotos({
                roomId: roomId.value,
                fileList: fileList,
            });

            uni.showToast({
                title: '保存成功',
                icon: 'success',
            });

            setTimeout(() => {
                uni.navigateBack();
            }, 1500);
        } catch (error) {
            console.error('保存失败:', error);
            uni.showToast({
                title: '保存失败',
                icon: 'none',
            });
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
