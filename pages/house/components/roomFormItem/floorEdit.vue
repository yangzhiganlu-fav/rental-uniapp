<template>
    <up-cell class="blue-value grey-label inner-cell floor-cell" title="所属楼层">
        <template #value>
            <view class="floor-cell-content">
                <up-choose
                    v-model="elevatorValue"
                    :options="[
                        { title: '电梯', value: 1 },
                        { title: '楼梯', value: 0 },
                    ]"
                    itemHeight="50rpx"
                    @change="onElevatorChange"
                ></up-choose>
                <view class="floor-text" @tap.stop="openPicker">
                    <text v-if="floor !== '' && totalFloor !== ''">
                        {{ `第${floor + 1}层,共${totalFloor + 1}层` }}
                    </text>
                    <text v-else>暂无</text>
                    <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                </view>
            </view>
        </template>
    </up-cell>

    <up-picker
        ref="floorPickerRef"
        title="层数/总层数"
        :show="showPicker"
        :columns="floorRange"
        :defaultIndex="[floor || 0, totalFloor || 0]"
        @confirm="onConfirm"
        @cancel="showPicker = false"
        @change="onPickerChange"
    ></up-picker>
</template>

<script setup>
    import { ref, computed } from 'vue';

    const props = defineProps({
        hasElevator: {
            type: [String, Number],
            default: '',
        },
        floor: {
            type: [String, Number],
            default: '',
        },
        totalFloor: {
            type: [String, Number],
            default: '',
        },
    });

    const emit = defineEmits(['save']);

    const elevatorValue = computed({
        get() {
            return props.hasElevator === 0 ? 1 : 0;
        },
        set(value) {
            emit('save', {
                hasElevator: value === 0 ? 1 : 0,
                floor: props.floor,
            });
        },
    });

    const showPicker = ref(false);
    const floorPickerRef = ref(null);

    const floorRange = [
        new Array(99).fill(0).map((_, i) => `第${i + 1}层`),
        new Array(99).fill(0).map((_, i) => `共${i + 1}层`),
    ];

    const openPicker = () => {
        showPicker.value = true;
    };

    const onElevatorChange = (e) => {
        emit('save', {
            hasElevator: e,
        });
    };

    const onConfirm = (e) => {
        const floorVal = parseInt(e.value[0].replace(/\D/g, '')) - 1;
        const totalVal = parseInt(e.value[1].replace(/\D/g, '')) - 1;
        showPicker.value = false;
        emit('save', {
            floor: floorVal,
            totalFloor: totalVal,
        });
    };

    const onPickerChange = (e) => {
        const { columnIndex, index } = e;
        if (columnIndex === 0) {
            const startFloor = index + 1;
            const totalFloors = new Array(99 - startFloor + 1)
                .fill(0)
                .map((_, i) => `共${startFloor + i}层`);
            floorPickerRef.value.setColumnValues(1, totalFloors);
        }
    };
</script>

<style lang="scss" scoped>
    .grey-label {
        :deep(.u-cell__title-text) {
            color: $dark-9;
        }
    }

    .blue-value {
        :deep(.u-cell__value) {
            color: $blue-light;
        }
    }

    .inner-cell {
        :deep(.u-cell__body) {
            padding: 12rpx 30rpx !important;
        }
    }

    .floor-cell {
        :deep(.u-cell__body) {
            align-items: baseline !important;
        }
    }

    .floor-cell-content {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .floor-text {
        margin-top: 16rpx;
        display: flex;
        align-items: center;
        color: $blue-light;
        font-size: 28rpx;
    }
</style>
