<template>
    <s-layout tabbar="/pages/house/houseList">
        <!-- 顶部导航栏中间部分 -->
        <template #center>
            <!-- 如果有选中的小区，显示小区名称 -->
            <view v-if="searchForm.selectedCommunity">
                {{ searchForm.selectedCommunity.name }}
            </view>
            <!-- 否则显示房源统计信息，点击可切换统计维度 -->
            <view v-else class="mine-house-count" @tap="toggleHouseCountPopup">
                <view>王某某(分散式)(100000间)</view>
                <uni-icons
                    type="right"
                    size="14"
                    :class="[showHouseCountPopup ? '-rotate-90' : 'rotate-90']"
                ></uni-icons>
            </view>
        </template>

        <!-- 顶部导航栏右侧部分 -->
        <template #right>
            <!-- 编辑模式下显示全选/取消全选和退出 -->
            <view v-if="isEditing" class="options-container">
                <up-text
                    type="primary"
                    text="退出"
                    size="14"
                    class="ss-p-l-20"
                    @tap="exitEditMode"
                ></up-text>
            </view>
            <!-- 如果有选中的小区，显示取消按钮 -->
            <view v-else-if="searchForm.selectedCommunity" class="options-container">
                <up-text
                    type="primary"
                    text="取消"
                    size="14"
                    class="ss-p-l-8"
                    @tap="onCancelSearch"
                ></up-text>
            </view>
            <!-- 否则显示搜索和新增按钮 -->
            <view v-else class="options-container">
                <s-icon name="search" size="40" @tap="navigateTo('/pages/house/houseSearch')" />
                <s-icon
                    name="xinzengfangjian"
                    size="40"
                    @tap="navigateTo('/pages/house/houseAdd')"
                />
            </view>
        </template>

        <!-- 切换房东手中的房源统计维度弹窗 -->
        <my-house-count-popup v-model:show="showHouseCountPopup" @change="onHouseCountTypeChange" />

        <!-- 筛选小区/房源弹框 -->
        <house-filter v-model:showSearch="showFilterPopup" @search="handleSearch" />

        <!-- 小区列表 -->
        <scroll-view class="community-list-page" scroll-y @scrolltolower="loadCommunityList">
            <s-community
                v-for="community in communityList"
                :key="community.id"
                :data="community"
                :checkable="isEditing"
                :selectedIds="selectedRooms"
                @roomClick="handleRoomClick"
                @roomLongPress="handleRoomLongPress"
                @addClick="handleAddClick"
                @editClick="handleEditClick"
            />
        </scroll-view>

        <!-- 底部操作栏 -->
        <view v-if="isEditing" class="footer-action-bar">
            <view class="action-bar-left" @tap.stop="toggleSelectAll">
                <view style="pointer-events: none">
                    <up-radio-group v-model="radioValue">
                        <up-radio label="全选" name="toggle"> </up-radio>
                    </up-radio-group>
                </view>
                <text class="selected-count">已选 {{ selectedRooms.length }} 个房间</text>
            </view>
            <view class="action-bar-right">
                <button class="action-btn delete-btn" @tap="handleBatchDelete">删除</button>
            </view>
        </view>

        <!-- 编辑房间信息弹框 -->
        <edit-room-modal
            v-model="showEditRoomModal"
            :roomData="currentRoomData"
            @save="handleSaveRoomData"
        />
    </s-layout>
</template>

<script setup>
    // 1. 导入依赖
    import sheep from '@/sheep';
    import { ref, reactive, computed, watch } from 'vue';
    import { onShow, onHide, onLoad, onUnload } from '@dcloudio/uni-app';
    import { cloneDeep, merge } from 'lodash-es';

    // 2. 导入组件
    import HouseFilter from './components/houseFilter.vue';
    import MyHouseCountPopup from './components/popup/myHouseCountPopup.vue';
    import EditRoomModal from './components/modal/editRoomModal.vue';

    // 3. 导入静态资源
    import room1 from '/static/room/room1.jpg';
    import room2 from '/static/room/room2.jpeg';
    import room3 from '/static/room/room3.jpeg';

    // 4. 状态定义
    // 4.1 UI控制状态
    const showHouseCountPopup = ref(false); // 是否显示房源统计弹窗
    const showFilterPopup = ref(false); // 是否显示筛选弹窗
    const isEditing = ref(false); // 是否处于编辑模式
    const showEditRoomModal = ref(false); // 是否显示编辑房间弹窗

    // 4.2 数据状态
    const selectedRooms = ref([]); // 选中的房间ID列表
    const communityList = ref([]); // 小区列表数据
    const searchForm = ref({
        selectedCommunity: null, // 当前选中的小区（搜索结果）
    });
    const currentRoomData = reactive({}); // 当前房间数据

    // 计算属性：是否全选
    const isAllSelected = computed(() => {
        if (communityList.value.length === 0) return false;
        let totalRooms = 0;
        communityList.value.forEach((community) => {
            community.houseList.forEach((house) => {
                totalRooms += house.roomList.length;
            });
        });
        return totalRooms > 0 && selectedRooms.value.length === totalRooms;
    });

    const radioValue = ref('');
    watch(isAllSelected, (val) => {
        radioValue.value = val ? 'toggle' : '';
    });

    // 5. 方法定义
    // 5.1 导航与路由
    const navigateTo = (url) => {
        sheep.$router.go(url);
    };

    // 5.2 弹窗控制
    const toggleHouseCountPopup = () => {
        showHouseCountPopup.value = !showHouseCountPopup.value;
    };

    const toggleFilterPopup = () => {
        showFilterPopup.value = !showFilterPopup.value;
    };

    // 5.3 业务逻辑 - 房源统计
    const onHouseCountTypeChange = (val) => {
        console.log('房源统计维度切换为:', val);
    };

    // 5.4 业务逻辑 - 搜索与筛选
    const handleSearch = (newSearchForm) => {
        searchForm.value = merge(cloneDeep(searchForm.value), cloneDeep(newSearchForm));
        console.log('searchForm updated:', searchForm.value);
        // TODO: 触发列表刷新
    };

    const onCancelSearch = () => {
        searchForm.value.selectedCommunity = null;
    };

    // 5.5 业务逻辑 - 房间操作
    // 处理房间点击（详情或选中）
    const handleRoomClick = (data) => {
        if (isEditing.value) {
            // 编辑模式下，点击切换选中状态
            const index = selectedRooms.value.indexOf(data.id);
            if (index > -1) {
                selectedRooms.value.splice(index, 1);
            } else {
                selectedRooms.value.push(data.id);
            }
        } else {
            // 非编辑模式下，跳转详情
            sheep.$router.go('/pages/house/roomDetail', {
                houseId: data.houseId,
                id: data.id,
                roomName: data.roomName || '',
            });
        }
    };

    // 处理房间长按（进入编辑模式）
    const handleRoomLongPress = (data) => {
        if (!isEditing.value) {
            isEditing.value = true;
            // 长按的同时选中该房间
            if (!selectedRooms.value.includes(data.id)) {
                selectedRooms.value.push(data.id);
            }
        }
    };

    // 处理添加按钮点击
    const handleAddClick = (houseId) => {
        sheep.$router.go('/pages/house/roomAdd', { houseId });
    };

    // 处理编辑按钮点击
    const handleEditClick = (roomData) => {
        currentRoomData.buildingNumber = roomData.buildingNumber;
        currentRoomData.unitNumber = roomData.unitNumber;
        currentRoomData.roomNumber = roomData.roomNumber;
        showEditRoomModal.value = true;
    };

    // 保存房间数据
    const handleSaveRoomData = (updatedData) => {
        console.log('保存的房间数据:', updatedData);
        // TODO: 调用接口保存数据
    };

    // 退出编辑模式
    const exitEditMode = () => {
        isEditing.value = false;
        selectedRooms.value = [];
    };

    // 全选/取消全选
    const toggleSelectAll = () => {
        if (isAllSelected.value) {
            selectedRooms.value = [];
        } else {
            const allIds = [];
            communityList.value.forEach((community) => {
                community.houseList.forEach((house) => {
                    house.roomList.forEach((room) => {
                        allIds.push(room.id);
                    });
                });
            });
            selectedRooms.value = allIds;
        }
    };

    // 批量删除
    const handleBatchDelete = () => {
        if (selectedRooms.value.length === 0) {
            sheep.$helper.toast('请先选择房间');
            return;
        }
        uni.showModal({
            title: '提示',
            content: `确定要删除选中的 ${selectedRooms.value.length} 个房间吗？`,
            success: (res) => {
                if (res.confirm) {
                    // TODO: 调用删除接口
                    console.log('Delete rooms:', selectedRooms.value);
                    // 模拟删除成功
                    sheep.$helper.toast('删除成功');
                    exitEditMode();
                }
            },
        });
    };

    // 5.6 数据加载
    const loadCommunityList = async () => {
        // 模拟加载数据
        const newCommunities = Array.from({ length: 1 }).map((_, index) => ({
            id: communityList.value.length + index + 1,
            name: `小区 ${communityList.value.length + index + 1}`,
            roomCount: 100,
            houseList: Array.from({ length: 3 }).map((__, houseIndex) => ({
                id: houseIndex + 1,
                isShared: houseIndex % 2 === 0,
                buildingNumber: Math.floor(Math.random() * 20) + 1,
                unitNumber: Math.floor(Math.random() * 10) + 1,
                roomNumber: Math.floor(Math.random() * 100) + 1,
                roomList: Array.from({ length: 3 }).map((___, roomIndex) => ({
                    id: roomIndex + 1,
                    rentalStatus: ['空置', '已租无租约', '已租有租约', '转租中', '装修中'][
                        Math.floor(Math.random() * 5)
                    ],
                    price: (Math.random() * 5000 + 1000).toFixed(2),
                    url: [room1, room2, room3][Math.floor(Math.random() * 3)],
                })),
            })),
        }));
        communityList.value = communityList.value.concat(newCommunities);
    };

    // 6. 生命周期
    onLoad(() => {
        // 监听搜索目标选择事件
        uni.$on('SELECT_SEARCH_TARGET', (data) => {
            showHouseCountPopup.value = false;
            showFilterPopup.value = false;
            searchForm.value.selectedCommunity = data;
        });
    });

    onUnload(() => {
        uni.$off('SELECT_SEARCH_TARGET');
    });

    onShow(() => {
        loadCommunityList();
    });

    onHide(() => {
        isEditing.value = false;
        selectedRooms.value = [];
    });
</script>

<style lang="scss" scoped>
    .mine-house-count {
        display: flex;
        align-items: center;

        .uni-icons {
            margin-left: 12rpx;
        }

        .-rotate-90 {
            transform: rotate(-90deg);
            transition: all 0.3s;
        }

        .rotate-90 {
            transform: rotate(90deg);
            transition: all 0.3s;
        }
    }

    .options-container {
        display: flex;
        align-items: center;
        gap: $tx-sm;
        padding: 0 $tx-sm;
    }

    .community-list-page {
        flex: 1;
        min-height: 0;
    }

    .footer-action-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100rpx;
        background-color: $white;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 30rpx 0 40rpx;
        box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
        box-sizing: border-box;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);

        .action-bar-left {
            font-size: $tx-base;
            color: $dark-3;

            .selected-count {
                color: $dark-9;
                font-size: $tx-sm;
            }
        }

        .action-bar-right {
            .action-btn {
                font-size: $tx-base;
                padding: 0 30rpx;
                height: 60rpx;
                line-height: 60rpx;
                border-radius: 30rpx;
                background-color: $red;
                color: $white;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;

                &::after {
                    border: none;
                }
            }
        }
    }
</style>
