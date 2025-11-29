<template>
    <view class="room-item-container" @tap.stop="onClick" @longpress.stop="onLongPress">
        <!-- 添加模式 -->
        <template v-if="type === 'add'">
            <view class="add-box">
                <uni-icons type="plusempty" size="40" color="#c0c4cc"></uni-icons>
            </view>
            <view class="add-text">{{ addText }}</view>
        </template>

        <!-- 展示模式 -->
        <template v-else>
            <view class="img-box" :class="{ 'is-checked': checked }">
                <up-image :src="data.url" mode="aspectFill" width="100%" height="240rpx">
                    <template #error>
                        <view style="font-size: 24rpx">加载失败</view>
                    </template>
                </up-image>
                <!-- 选中标记 -->
                <view class="check-icon" v-if="checkable">
                    <up-radio-group :modelValue="checked ? data.id : ''" size="28rpx">
                        <up-radio :name="data.id" :label="null"></up-radio>
                    </up-radio-group>
                </view>
            </view>
            <view class="rental-status">{{ data.rentalStatus }}</view>
            <view class="price">￥{{ data.price }}</view>
        </template>
    </view>
</template>

<script setup>
    const props = defineProps({
        data: {
            type: Object,
            default: () => ({}),
        },
        // 类型：'display' | 'add'
        type: {
            type: String,
            default: 'display',
        },
        // 是否处于可选择（编辑）状态
        checkable: {
            type: Boolean,
            default: false,
        },
        // 是否被选中
        checked: {
            type: Boolean,
            default: false,
        },
        addText: {
            type: String,
            default: '添加房间',
        },
    });

    const emits = defineEmits(['click', 'longpress']);

    const onClick = () => {
        emits('click', props.data);
    };

    const onLongPress = () => {
        // 只有展示类型的卡片才触发长按
        if (props.type === 'display') {
            emits('longpress', props.data);
        }
    };
</script>

<style lang="scss" scoped>
    .room-item-container {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: $bg-page;
        overflow: hidden;

        .img-box {
            width: 100%;
            height: 240rpx;
            position: relative;
            transition: all 0.2s;

            &.is-checked {
                // 选中时可以加个边框或者遮罩效果
                opacity: 0.8;
            }

            .check-icon {
                position: absolute;
                top: 0;
                right: 0;
                z-index: 10;
                pointer-events: none;
            }
        }

        .add-box {
            width: 100%;
            height: 240rpx;
            background-color: $white;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 4rpx dashed $gray-c;
            box-sizing: border-box;
        }

        .add-text {
            padding: 20rpx 0;
            font-size: 26rpx;
            font-weight: 300;
            color: $dark-3;
        }

        // 左上角角标
        .rental-status {
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

        .price {
            padding: 20rpx 0;
            color: $red;
        }
    }
</style>
