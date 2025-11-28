<template>
    <s-layout title="房源详情" :bgStyle="{ backgroundColor: '#fff' }">
        <view class="page-container">
            <room-swiper :list="list1" @edit="editRoomPhoto"></room-swiper>
            <up-cell-group class="form-container">
                <up-cell class="hiden-line" title="房间状态"></up-cell>
                <up-cell title="出租状态" value="已租" class="grey-label blue-value">
                    <template #right-icon>
                        <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                    </template>
                </up-cell>
                <up-cell class="hiden-line" title="挂牌价"></up-cell>
                <up-cell class="blue-value grey-label" title="对外租金挂牌价" value="￥2500">
                    <template #right-icon>
                        <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                    </template>
                </up-cell>
                <up-cell class="blue-value hiden-line" title="钥匙位置" value="编辑">
                    <template #right-icon>
                        <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                    </template>
                </up-cell>
                <up-cell
                    title="门口"
                    value="11/01 23:40"
                    class="grey-label grey-value inner-cell"
                ></up-cell>
                <up-cell class="blue-value" title="房东备注" value="编辑">
                    <template #right-icon>
                        <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                    </template>
                </up-cell>
                <up-cell class="hiden-line" title="基本信息"></up-cell>
                <up-cell
                    title="小区名称"
                    value="棕榈湾"
                    class="grey-label grey-value hiden-line inner-cell"
                ></up-cell>
                <up-cell
                    title="小区地址"
                    value="棕榈湾路123号"
                    class="grey-label grey-value hiden-line inner-cell"
                ></up-cell>
                <up-cell
                    class="blue-value grey-label hiden-line inner-cell"
                    title="门牌号"
                    value="编辑"
                >
                    <template #right-icon>
                        <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                    </template>
                </up-cell>
                <up-cell
                    title="整套户型"
                    value="2室1厅1卫"
                    class="grey-label grey-value hiden-line inner-cell"
                ></up-cell>
                <up-cell
                    class="blue-value grey-label hiden-line inner-cell"
                    title="整套面积"
                    value="编辑"
                >
                    <template #right-icon>
                        <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                    </template>
                </up-cell>
                <up-cell
                    class="blue-value grey-label hiden-line inner-cell"
                    title="所属楼层"
                    value="编辑"
                >
                    <template #right-icon>
                        <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                    </template>
                </up-cell>
                <up-cell title="带看联系人" value="王某某"></up-cell>
                <up-cell class="blue-value hiden-line" title="历史租约" value="编辑">
                    <template #right-icon>
                        <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                    </template>
                </up-cell>
            </up-cell-group>
        </view>
        <su-fixed bottom :bgStyles="{ backgroundColor: '#fff' }">
            <view class="button-box">
                <up-button type="primary" block>录入租约</up-button>
            </view>
        </su-fixed>
    </s-layout>
</template>

<script setup>
    import { reactive } from 'vue';
    import RoomSwiper from './components/roomSwiper.vue';

    // 使用 reactive 创建响应式数组
    const list1 = reactive([
        '/static/room/room1.jpg',
        '/static/room/room2.jpeg',
        '/static/room/room3.jpeg',
    ]);

    const editRoomPhoto = () => {
        console.log('editRoomPhoto');
    };

    const formData = reactive({
        rentalStatus: '已出租',
    });
</script>

<style lang="scss" scoped>
    .page-container {
        flex: 1;
        min-height: 0;
        overflow: auto;
    }

    .form-container {
        padding: 0 10rpx 240rpx 0;

        .key-location {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 24rpx;
            color: $dark-9;

            .key-location-content {
                flex: 1;
                color: $dark-3;
            }
        }
    }

    .button-box {
        padding: 16rpx;
    }

    :deep(.checklist-group) {
        justify-content: flex-end !important;
    }

    :deep(.checklist-box.is--tag) {
        border-radius: 32rpx !important;
    }

    .blue-value {
        :deep(.u-cell__value) {
            color: $blue-light;
        }
    }

    .grey-label {
        :deep(.u-cell__title-text) {
            color: $dark-9;
        }
    }

    .grey-value {
        :deep(.u-cell__value) {
            color: $dark-9;
        }
    }

    .hiden-line {
        :deep(.u-line) {
            display: none;
        }
    }

    .inner-cell {
        :deep(.u-cell__body) {
            padding: 8rpx 30rpx !important;
        }
    }
</style>
