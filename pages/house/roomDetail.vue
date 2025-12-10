<template>
    <!-- 页面布局组件，设置标题和背景色 -->
    <s-layout :title="title" :bgStyle="{ backgroundColor: '#fff' }">
        <!-- 房间图片轮播图组件 -->
        <room-swiper :list="list1" @edit="editRoomPhoto"></room-swiper>
        <!-- 表单容器 -->
        <up-cell-group class="form-container">
            <!-- 房间状态部分 -->
            <up-cell class="hiden-line" title="房间状态"></up-cell>
            <up-cell
                title="出租状态"
                :value="formData.rentalStatus || '暂无'"
                class="grey-label blue-value hiden-line inner-cell"
                @click="openRentalStatusPicker"
            >
                <template #right-icon>
                    <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                </template>
            </up-cell>
            <up-cell
                class="grey-label blue-value inner-cell"
                title="房间名称"
                :value="formData.roomName || '暂无'"
                @click="openRoomNameModal"
            >
                <template #right-icon>
                    <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                </template>
            </up-cell>
            <up-cell class="hiden-line" title="挂牌价"></up-cell>
            <up-cell
                class="blue-value grey-label"
                title="对外租金挂牌价"
                :value="formData.price ? `￥${formData.price}` : '暂无'"
                @click="openPriceModal"
            >
                <template #right-icon>
                    <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                </template>
            </up-cell>
            <up-cell
                class="blue-value hiden-line"
                title="钥匙位置"
                value="编辑"
                @click="openKeyLocationPicker"
            >
                <template #right-icon>
                    <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                </template>
            </up-cell>
            <up-cell
                v-if="formData.keyPlaceType"
                :title="formData.keyPlaceType"
                :value="formData.keyPlace || '无备注信息'"
                class="grey-label grey-value inner-cell"
            ></up-cell>
            <up-cell
                class="blue-value"
                :border="!formData.remark"
                title="房东备注"
                value="编辑"
                @click="openRemarkModal"
            >
                <template #right-icon>
                    <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                </template>
            </up-cell>
            <view v-if="formData.remark" class="remark-content">
                {{ formData.remark }}
            </view>
            <up-cell class="hiden-line" title="基本信息"></up-cell>
            <up-cell
                title="小区名称"
                :value="formData.communityName || '暂无'"
                class="grey-label grey-value hiden-line inner-cell"
            ></up-cell>
            <up-cell
                title="小区地址"
                :value="formData.address || '暂无'"
                class="grey-label grey-value hiden-line inner-cell"
            ></up-cell>
            <up-cell
                class="blue-value grey-label hiden-line inner-cell"
                title="门牌号"
                :value="
                    formData.buildingNumber && formData.unitNumber && formData.roomNumber
                        ? `${formData.buildingNumber}幢${formData.unitNumber}单元${formData.roomNumber}室`
                        : '暂无'
                "
                @click="openRoomModal"
            >
                <template #right-icon>
                    <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                </template>
            </up-cell>
            <up-cell
                title="整套户型"
                :value="
                    formData.roomNumber && formData.hallNumber && formData.toiletNumber
                        ? `${formData.roomNumber}室${formData.hallNumber}厅${formData.toiletNumber}卫`
                        : '暂无'
                "
                class="grey-label grey-value hiden-line inner-cell"
            ></up-cell>
            <up-cell
                class="blue-value grey-label hiden-line inner-cell"
                title="整套面积"
                :value="formData.houseArea ? `${formData.area}平米` : '暂无'"
                @click="openAreaModal"
            >
                <template #right-icon>
                    <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                </template>
            </up-cell>
            <up-cell
                class="blue-value grey-label hiden-line inner-cell"
                title="房间面积"
                :value="formData.roomArea ? `${formData.roomArea}平米` : '暂无'"
                @click="openRoomAreaModal"
            >
                <template #right-icon>
                    <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                </template>
            </up-cell>
            <up-cell
                class="blue-value grey-label hiden-line inner-cell"
                title="房间朝向"
                :value="
                    formData.orientation?.length
                        ? `${formData.orientation[0]} ${formData.orientation[1]}`
                        : '暂无'
                "
                @click="openOrientationPicker"
            >
                <template #right-icon>
                    <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                </template>
            </up-cell>
            <up-cell class="blue-value grey-label inner-cell floor-cell" title="所属楼层">
                <template #value>
                    <view class="floor-cell-content">
                        <up-choose
                            v-model="formData.hasElevator"
                            :options="[
                                { title: '电梯', id: 1 },
                                { title: '楼梯', id: 0 },
                            ]"
                            itemHeight="50rpx"
                        ></up-choose>
                        <view class="floor-text" @tap.stop="openFloorPicker">
                            <text v-if="formData.floor?.length">
                                {{ `第${formData.floor[0] + 1}层，共${formData.floor[1] + 1}层` }}
                            </text>
                            <text v-else>暂无</text>
                            <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                        </view>
                    </view>
                </template>
            </up-cell>
            <up-cell class="blue-value hiden-line" title="历史租约" value="1">
                <template #right-icon>
                    <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                </template>
            </up-cell>
        </up-cell-group>

        <!-- 底部固定操作栏 -->
        <su-fixed bottom :bgStyles="{ backgroundColor: '#fff' }">
            <view class="button-box">
                <view class="btn-item">
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

        <!-- 出租状态选择器 -->
        <up-picker
            v-model="tempRentalStatus"
            v-model:show="rentalStatusShow"
            :columns="rentalStatusOptions"
            keyName="label"
            valueName="value"
            closeOnClickOverlay
            @confirm="onRentalStatusConfirm"
        ></up-picker>

        <!-- 钥匙位置选择器 -->
        <up-picker
            v-model="tempKeyLocation"
            v-model:show="keyLocationShow"
            :columns="keyLocationOptions"
            keyName="label"
            valueName="value"
            closeOnClickOverlay
            @confirm="onKeyLocationConfirm"
        ></up-picker>

        <!-- 对外报价弹窗 -->
        <up-modal
            :show="priceModalShow"
            showCancelButton
            title="对外报价"
            width="500rpx"
            class="form-sm"
            @confirm="onPriceConfirm"
            @cancel="priceModalShow = false"
            @close="onPriceClose"
        >
            <up-input
                v-model.trim="tempPrice"
                placeholder="请输入对外报价"
                border="bottom"
                type="number"
            >
                <template #prefix>
                    <view>￥</view>
                </template>
            </up-input>
        </up-modal>

        <!-- 房东备注弹窗 -->
        <up-modal
            :show="remarkModalShow"
            showCancelButton
            title="房东备注"
            width="500rpx"
            class="form-sm"
            @confirm="onRemarkConfirm"
            @cancel="remarkModalShow = false"
            @close="onRemarkClose"
        >
            <up-textarea v-model.trim="tempRemark" placeholder="请输入房东备注"></up-textarea>
        </up-modal>

        <!-- 整套面积弹窗 -->
        <up-modal
            :show="areaModalShow"
            showCancelButton
            title="整套面积"
            width="500rpx"
            class="form-sm"
            @confirm="onAreaConfirm"
            @cancel="areaModalShow = false"
            @close="onAreaClose"
        >
            <up-input
                v-model.trim="tempArea"
                placeholder="请输入整套面积"
                border="bottom"
                type="number"
            >
                <template #suffix>
                    <view>平米</view>
                </template>
            </up-input>
        </up-modal>

        <!-- 房间面积弹窗 -->
        <up-modal
            :show="roomAreaModalShow"
            showCancelButton
            title="房间面积"
            width="500rpx"
            class="form-sm"
            @confirm="onRoomAreaConfirm"
            @cancel="roomAreaModalShow = false"
            @close="onRoomAreaClose"
        >
            <up-input
                v-model.trim="tempRoomArea"
                placeholder="请输入房间面积"
                border="bottom"
                type="number"
            >
                <template #suffix>
                    <view>平米</view>
                </template>
            </up-input>
        </up-modal>

        <!-- 编辑房间信息弹窗 -->
        <edit-room-modal
            v-model="roomModalShow"
            :roomData="roomData"
            @save="onRoomConfirm"
        ></edit-room-modal>

        <!-- 楼层选择器 -->
        <up-picker
            ref="floorPickerRef"
            title="层数/总层数"
            :show="showFloorPicker"
            :columns="floorRange"
            :defaultIndex="formData.floor"
            @confirm="onFloorConfirm"
            @cancel="showFloorPicker = false"
            @change="onFloorPickerChange"
        ></up-picker>

        <!-- 房间朝向选择器 -->
        <up-picker
            :show="showOrientationPicker"
            :columns="orientationRange"
            :defaultIndex="[0, 0]"
            @confirm="onOrientationConfirm"
            @cancel="showOrientationPicker = false"
        ></up-picker>
    </s-layout>
</template>

<script setup>
    import sheep from '@/sheep';
    import { reactive, ref } from 'vue';
    import { onShareAppMessage, onLoad } from '@dcloudio/uni-app';
    import { useRoomEdit } from './hooks/useRoomEdit';
    import RoomSwiper from './components/roomSwiper.vue';
    import EditRoomModal from './components/editRoomModal.vue';

    // 页面标题，默认为'房源详情'
    const title = ref('房源详情');

    // 页面加载时获取参数，设置标题
    onLoad((options) => {
        if (options.roomName) {
            title.value = options.roomName;
        }
    });

    // 使用自定义Hook获取房间详情相关数据和方法
    const {
        formData,
        rentalStatusShow,
        tempRentalStatus,
        rentalStatusOptions,
        openRentalStatusPicker,
        onRentalStatusConfirm,
        keyLocationShow,
        tempKeyLocation,
        keyLocationOptions,
        openKeyLocationPicker,
        onKeyLocationConfirm,
        priceModalShow,
        tempPrice,
        openPriceModal,
        onPriceConfirm,
        onPriceClose,
        remarkModalShow,
        tempRemark,
        openRemarkModal,
        onRemarkConfirm,
        onRemarkClose,
        roomModalShow,
        roomData,
        openRoomModal,
        onRoomConfirm,
        showFloorPicker,
        floorRange,
        openFloorPicker,
        onFloorConfirm,
        areaModalShow,
        tempArea,
        openAreaModal,
        onAreaConfirm,
        onAreaClose,
        roomAreaModalShow,
        tempRoomArea,
        openRoomAreaModal,
        onRoomAreaConfirm,
        onRoomAreaClose,
        showOrientationPicker,
        orientationRange,
        openOrientationPicker,
        onOrientationConfirm,
    } = useRoomEdit();

    const list1 = reactive([
        '/static/room/room1.jpg',
        '/static/room/room2.jpeg',
        '/static/room/room3.jpeg',
    ]);

    const editRoomPhoto = () => {
        sheep.$router.go('/pages/house/editRoomPhoto');
    };

    const onEnterLease = () => {
        sheep.$router.go('/pages/lease/leaseAdd');
    };

    // 楼层选择器引用
    const floorPickerRef = ref(null);
    // 楼层选择器联动逻辑：选择所在层后，自动更新总层数选项
    const onFloorPickerChange = (e) => {
        const { columnIndex, index } = e;
        if (columnIndex === 0) {
            const startFloor = index + 1;
            const totalFloors = new Array(99 - startFloor + 1)
                .fill(0)
                .map((_, i) => `共${startFloor + i}层`);
            floorPickerRef.value.setColumnValues(1, totalFloors);
        }
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
            imageUrl: list1[0],
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
            imageUrl: list1[0],
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

    // 备注内容样式
    .remark-content {
        padding: 0 32rpx 24rpx;
        color: $dark-9;
        font-size: 28rpx;
        line-height: 1.5;
        white-space: pre-wrap;
        border-bottom: 1px solid rgb(214, 215, 217);
    }

    // 楼层单元格内容布局
    .floor-cell-content {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    // 楼层文本样式
    .floor-text {
        margin-top: 16rpx;
        display: flex;
        align-items: center;
        color: $blue-light;
        font-size: 28rpx;
    }

    // 楼层单元格对齐方式调整
    .floor-cell {
        :deep(.u-cell__body) {
            align-items: baseline !important;
        }
    }
</style>
