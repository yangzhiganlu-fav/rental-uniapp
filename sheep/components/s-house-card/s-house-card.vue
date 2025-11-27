<template>
    <up-card>
        <template #head>
            <view class="house-head-container">
                <view class="house-rent-type">{{ data.isShared ? '合租' : '整租' }}</view>
                <view>
                    {{ data.buildingNumber }}号楼{{ data.unitNumber }}单元{{ data.roomNumber }}室
                </view>
            </view>
        </template>
        <template #body>
            <up-grid :border="false" col="2" gap="12rpx">
                <up-grid-item v-for="(item, index) in data.roomList" :key="index">
                    <s-room-item :data="item" @click="onRoomClick" />
                </up-grid-item>
                <up-grid-item v-if="props.showAddPicture">
                    <s-room-item isAdd @click="addRoom" />
                </up-grid-item>
            </up-grid>
        </template>
    </up-card>
</template>

<script setup>
    import { onLoad } from '@dcloudio/uni-app';

    const props = defineProps({
        data: {
            type: Object,
            default: () => ({}),
        },
        showAddPicture: {
            type: Boolean,
            default: true,
        },
    });

    const emits = defineEmits(['roomClick']);

    const onRoomClick = (room) => {
        emits('roomClick', 'detail', { houseId: props.data.id, id: room.id });
    };

    const addRoom = () => {
        emits('roomClick', 'add', { houseId: props.data.id, id: '' });
    };
</script>

<style lang="scss" scoped>
    .house-head-container {
        display: flex;
        font-size: 14px;
        font-weight: 600;
        color: $dark-3;

        .house-rent-type {
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
    }
</style>
