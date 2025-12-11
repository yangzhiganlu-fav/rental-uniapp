<template>
    <uni-group
        :title="`${community.communityName}（${community.roomCount}间）`"
        :headStyle="{ backgroundColor: '#000' }"
        style="margin-top: 0"
    >
        <up-card
            v-for="(house, houseIndex) in community.houseList"
            :key="houseIndex"
            class="ss-m-b-24"
        >
            <template #head>
                <view class="house-info">
                    <view class="house-info__rent-type">
                        {{ house.rentType === 0 ? '整租' : '合租' }}
                    </view>
                    <view class="house-info__title">{{ house.title }}</view>
                </view>
            </template>
            <template #body>
                <up-grid :border="false" col="2" gap="12rpx">
                    <up-grid-item
                        v-for="room in house.roomList"
                        :key="room.id"
                        @tap="onRoomClick(house, room)"
                    >
                        <view class="room-card">
                            <view class="room-card__image">
                                <up-image
                                    :src="room.coverPhotoUrl"
                                    mode="aspectFill"
                                    width="100%"
                                    height="240rpx"
                                    bgColor="#eee"
                                ></up-image>
                            </view>
                            <view class="room-card__status">
                                {{ getRoomStatusText(room.roomStatus) }}
                            </view>
                            <view class="room-card__price">￥{{ room.price }}</view>
                        </view>
                    </up-grid-item>
                    <up-grid-item v-if="house.rentType === 1" @tap="onRoomAdd(house)">
                        <view class="room-add">
                            <view class="room-add__icon">
                                <uni-icons type="plusempty" size="40" color="#c0c4cc"></uni-icons>
                            </view>
                            <view class="room-add__text">添加房间</view>
                        </view>
                    </up-grid-item>
                </up-grid>
            </template>
        </up-card>
    </uni-group>
</template>

<script setup>
    const props = defineProps({
        community: {
            type: Object,
            required: true,
        },
    });

    const emit = defineEmits(['room-click', 'room-add']);

    // 房间状态映射
    const getRoomStatusText = (status) => {
        const statusMap = {
            0: '空置',
            1: '已租有租约',
            2: '转租中',
            3: '已租无租约',
        };
        return statusMap[status] || '未知';
    };

    const onRoomClick = (house, room) => {
        emit('room-click', house, room);
    };

    const onRoomAdd = (house) => {
        emit('room-add', house);
    };
</script>

<style lang="scss" scoped>
    // Block: house-info (房源信息)
    .house-info {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        color: $dark-3;
    }

    // Element: house-info__rent-type (租赁类型)
    .house-info__rent-type {
        position: relative;
        margin-right: 16px;

        &::after {
            content: '';
            display: inline-block;
            position: absolute;
            right: -12px;
            top: 50%;
            transform: translateY(-50%);
            height: 6px;
            width: 6px;
            background-color: $dark-3;
            border-radius: 100%;
        }
    }

    // Element: house-info__title (房源标题)
    .house-info__title {
        // 默认样式由父容器继承
    }

    // Block: room-card (房间卡片)
    .room-card {
        width: 100%;
        position: relative;
    }

    // Element: room-card__image (房间图片)
    .room-card__image {
        width: 100%;
        height: 240rpx;
        position: relative;
        transition: all 0.2s;
        background-color: $white;
    }

    // Modifier: room-card__image--checked (选中状态)
    .room-card__image--checked {
        opacity: 0.8;
    }

    // Element: room-card__status (租赁状态)
    .room-card__status {
        position: absolute;
        top: 0;
        left: 0;
        background-color: $dark-4;
        color: $white;
        padding: 2px 6px;
        border-radius: 0 0 8rpx 0;
        font-size: 20rpx;
        z-index: 1;
    }

    // Element: room-card__price (价格)
    .room-card__price {
        text-align: center;
        padding: 20rpx 0;
        color: $red;
        background-color: $bg-page;
    }

    // Block: room-add (添加房间)
    .room-add {
        width: 100%;
    }

    // Element: room-add__icon (添加图标)
    .room-add__icon {
        width: 100%;
        height: 240rpx;
        background-color: $white;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 4rpx dashed $gray-c;
        box-sizing: border-box;
    }

    // Element: room-add__text (添加文字)
    .room-add__text {
        text-align: center;
        padding: 20rpx 0;
        font-size: 26rpx;
        font-weight: 300;
        color: $dark-3;
        background-color: $bg-page;
    }

    :deep(.uni-group__title) {
        justify-content: center;
    }

    :deep(.uni-group__content) {
        padding: 0;
    }

    :deep(.uicon-photo) {
        font-size: 80rpx !important;
        line-height: 80rpx !important;
        color: $gray-c !important;
    }

    :deep(.uicon-error-circle) {
        font-size: 80rpx !important;
        line-height: 80rpx !important;
        color: $gray-c !important;
    }
</style>
