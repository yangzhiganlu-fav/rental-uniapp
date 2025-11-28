<template>
    <up-card>
        <template #head>
            <view class="house-info">
                <view class="house-rent-type">{{ data.isShared ? '合租' : '整租' }}</view>
                <view>
                    {{ data.buildingNumber }}号楼{{ data.unitNumber }}单元{{ data.roomNumber }}室
                </view>
                <s-icon name="edit" size="34" color="#999" class="edit-icon" @tap="onEditClick" />
            </view>
            <view class="house-tags">
                <up-tag text="上传资质" plain size="mini" type="error"></up-tag>
                <up-tag text="认证失败，重新上传" plain size="mini" type="error"></up-tag>
                <up-tag text="生活缴费" plain size="mini" type="warning"></up-tag>
            </view>
        </template>
        <template #body>
            <up-grid :border="false" col="2" gap="12rpx">
                <up-grid-item v-for="(item, index) in data.roomList" :key="index">
                    <s-room
                        :data="item"
                        :checkable="checkable"
                        :checked="isChecked(item.id)"
                        @click="onRoomClick"
                        @longpress="onRoomLongPress"
                    />
                </up-grid-item>
                <up-grid-item v-if="showAddPicture">
                    <s-room type="add" @click="addRoom" />
                </up-grid-item>
            </up-grid>
        </template>
    </up-card>
</template>

<script setup>
    const props = defineProps({
        data: {
            type: Object,
            default: () => ({}),
        },
        showAddPicture: {
            type: Boolean,
            default: true,
        },
        // 是否处于可选择（编辑）状态
        checkable: {
            type: Boolean,
            default: false,
        },
        selectedIds: {
            type: Array,
            default: () => [],
        },
    });

    const emits = defineEmits(['roomClick', 'roomLongPress', 'addClick', 'editClick']);

    const isChecked = (id) => {
        return props.selectedIds.includes(id);
    };

    const onRoomClick = (room) => {
        emits('roomClick', room);
    };

    const onRoomLongPress = (room) => {
        emits('roomLongPress', room);
    };

    const addRoom = () => {
        emits('addClick', props.data.id);
    };

    const onEditClick = () => {
        emits('editClick', props.data);
    };
</script>

<style lang="scss" scoped>
    .house-info {
        display: flex;
        align-items: center;
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

        .edit-icon {
            margin-left: 12rpx;
        }
    }

    .house-tags {
        margin-top: 12rpx;
        display: flex;
        gap: 12rpx;
    }
</style>
