<template>
    <!-- 页面布局组件，设置标题和背景色 -->
    <s-layout :title="roomData.roomName || ''" :bgStyle="{ backgroundColor: '#fff' }">
        <!-- 房间图片轮播图组件 -->
        <room-swiper :list="roomData.photosList || []" @edit="editRoomPhoto"></room-swiper>
        <!-- 表单容器 -->
        <up-cell-group class="form-container">
            <!-- 房间状态部分 -->
            <up-cell class="hiden-line" title="房间状态"></up-cell>

            <!-- 出租状态 -->
            <rental-status-edit
                :value="roomData.rentalStatus"
                @save="handleSave"
            ></rental-status-edit>

            <!-- 房间名称 -->
            <room-name-edit :value="roomData.roomName" @save="handleSave"></room-name-edit>

            <!-- 挂牌价 -->
            <up-cell class="hiden-line" title="挂牌价"></up-cell>
            <price-edit :value="roomData.price" @save="handleSave"></price-edit>

            <!-- 钥匙位置 -->
            <key-location-edit
                :keyPlaceType="roomData.keyPlaceType"
                :keyPlace="roomData.keyPlace"
                @save="handleSave"
            ></key-location-edit>

            <!-- 房东备注 -->
            <remark-edit :value="roomData.remark" @save="handleSave"></remark-edit>

            <!-- 基本信息 -->
            <up-cell class="hiden-line" title="基本信息"></up-cell>
            <up-cell
                title="小区名称"
                :value="roomData.communityName || '暂无'"
                class="grey-label grey-value hiden-line inner-cell"
            ></up-cell>
            <up-cell
                title="小区地址"
                :value="roomData.address || '暂无'"
                class="grey-label grey-value hiden-line inner-cell"
            ></up-cell>

            <!-- 门牌号 -->
            <door-number-edit
                :blockNumber="roomData.blockNumber"
                :unitNumber="roomData.unitNumber"
                :houseNo="roomData.houseNo"
                @save="handleSave"
            ></door-number-edit>

            <up-cell
                title="整套户型"
                :value="
                    roomData.roomNumber && roomData.hallNumber && roomData.toiletNumber
                        ? `${roomData.roomNumber}室${roomData.hallNumber}厅${roomData.toiletNumber}卫`
                        : '暂无'
                "
                class="grey-label grey-value hiden-line inner-cell"
            ></up-cell>

            <!-- 整套面积 -->
            <house-area-edit :value="roomData.area" @save="handleSave"></house-area-edit>

            <!-- 房间面积 -->
            <room-area-edit :value="roomData.roomArea" @save="handleSave"></room-area-edit>

            <!-- 房间朝向 -->
            <orientation-edit
                :isMaster="roomData.isMaster"
                :direction="roomData.direction"
                @save="handleSave"
            ></orientation-edit>

            <!-- 所属楼层 -->
            <floor-edit
                :hasElevator="roomData.hasElevator"
                :floor="roomData.floor"
                :totalFloor="roomData.totalFloor"
                @save="handleSave"
            ></floor-edit>

            <up-cell class="blue-value hiden-line" title="历史租约" value="1">
                <template #right-icon>
                    <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                </template>
            </up-cell>
        </up-cell-group>

        <!-- 底部固定操作栏 -->
        <su-fixed bottom :bgStyles="{ backgroundColor: '#fff' }">
            <view class="button-box">
                <view v-if="roomData.rentalStatus === 0" class="btn-item">
                    <!-- 分享按钮 -->
                    <up-button
                        type="warning"
                        text="分享空房"
                        openType="share"
                        @tap="onShare"
                    ></up-button>
                </view>
                <view class="btn-item">
                    <!-- 录入租约按钮 -->
                    <up-button type="primary" text="录入租约" @tap="onEnterLease"></up-button>
                </view>
            </view>
        </su-fixed>
    </s-layout>
</template>

<script setup>
    import sheep from '@/sheep';
    import { reactive, ref } from 'vue';
    import { onShareAppMessage, onLoad, onPullDownRefresh } from '@dcloudio/uni-app';
    import HouseApi from '@/sheep/api/house';
    import RoomSwiper from './components/roomSwiper.vue';
    import RentalStatusEdit from './components/roomFormItem/rentalStatusEdit.vue';
    import RoomNameEdit from './components/roomFormItem/roomNameEdit.vue';
    import PriceEdit from './components/roomFormItem/priceEdit.vue';
    import KeyLocationEdit from './components/roomFormItem/keyLocationEdit.vue';
    import RemarkEdit from './components/roomFormItem/remarkEdit.vue';
    import DoorNumberEdit from './components/roomFormItem/doorNumberEdit.vue';
    import HouseAreaEdit from './components/roomFormItem/houseAreaEdit.vue';
    import RoomAreaEdit from './components/roomFormItem/roomAreaEdit.vue';
    import OrientationEdit from './components/roomFormItem/orientationEdit.vue';
    import FloorEdit from './components/roomFormItem/floorEdit.vue';

    // 房间数据
    const roomData = ref({
        houseId: '',
        id: '',
    });

    // 页面加载时获取参数，设置标题
    onLoad((options) => {
        roomData.value.houseId = options.houseId || '';
        roomData.value.id = options.id || '';
        loadRoomData();
    });

    // 下拉刷新时重新加载数据
    onPullDownRefresh(async () => {
        roomData.value = {
            houseId: roomData.value.houseId,
            id: roomData.value.id,
        };
        await loadRoomData();
        uni.stopPullDownRefresh();
    });

    // 加载房间数据
    const loadRoomData = async () => {
        const params = {
            id: roomData.value.id,
        };
        const { code, data } = await HouseApi.getRoomDetail(params);
        if (code === 0 && data) {
            Object.assign(roomData.value, data);
        }
    };

    // 统一保存方法
    const handleSave = async (form) => {
        const params = {
            id: roomData.value.id,
            houseId: roomData.value.houseId,
            ...form,
        };
        const { code } = await HouseApi.updateRoom(params);
        if (code === 0) {
            uni.showToast({ title: '保存成功', icon: 'success' });
            Object.assign(roomData.value, form);
        }
    };

    const editRoomPhoto = () => {
        sheep.$router.go('/pages/house/editPhoto');
    };

    const onEnterLease = () => {
        sheep.$router.go('/pages/lease/leaseAdd');
    };

    // 分享功能
    const onShare = () => {
        // #ifdef APP-PLUS
        uni.share({
            provider: 'weixin',
            scene: 'WXSceneSession',
            type: 0,
            href: 'https://example.com',
            title: '房源分享',
            summary: '来看看这个房源',
            imageUrl: roomData.value.photosList?.[0] || '',
            success: (res) => {
                console.log('success:' + JSON.stringify(res));
            },
            fail: (err) => {
                console.log('fail:' + JSON.stringify(err));
            },
        });
        // #endif
    };

    // 小程序分享配置
    onShareAppMessage((res) => {
        return {
            title: '房源分享',
            path: '/pages/house/roomDetail',
            imageUrl: roomData.value.photosList?.[0] || '',
        };
    });
</script>

<style lang="scss" scoped>
    // 页面容器，用于滚动
    .page-container {
        flex: 1;
        min-height: 0;
        overflow: auto;
    }

    // 表单容器样式
    .form-container {
        padding: 0 10rpx 240rpx 0;

        .key-location {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: $tx-sm;
            color: $dark-9;

            .key-location-content {
                flex: 1;
                color: $dark-3;
            }
        }
    }

    // 底部按钮容器样式
    .button-box {
        padding: 16rpx;
        display: flex;
        gap: 20rpx;

        .btn-item {
            flex: 1;
        }
    }

    :deep(.checklist-group) {
        justify-content: flex-end !important;
    }

    :deep(.checklist-box.is--tag) {
        border-radius: 32rpx !important;
    }

    :deep(.u-cell__title-text) {
        font-size: 28rpx !important;
    }
    :deep(.u-cell__value) {
        font-size: 28rpx !important;
    }

    :deep(.u-cell__body > .u-line) {
        margin-top: 12rpx !important;
    }

    // 蓝色值样式
    .blue-value {
        :deep(.u-cell__value) {
            color: $blue-light;
        }
    }

    // 灰色标签样式
    .grey-label {
        :deep(.u-cell__title-text) {
            color: $dark-9;
        }
    }

    // 灰色值样式
    .grey-value {
        :deep(.u-cell__value) {
            color: $dark-9;
        }
    }

    // 隐藏分割线
    .hiden-line {
        :deep(.u-line) {
            display: none;
        }
    }

    // 内部单元格样式调整
    .inner-cell {
        :deep(.u-cell__body) {
            padding: 12rpx 30rpx !important;
        }
    }
</style>
