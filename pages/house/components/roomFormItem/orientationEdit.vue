<template>
    <up-cell
        class="blue-value grey-label hiden-line inner-cell"
        title="房间朝向"
        :value="displayValue"
        @click="openPicker"
    >
        <template #right-icon>
            <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
        </template>
    </up-cell>

    <up-picker
        :show="showPicker"
        :columns="orientationRange"
        :defaultIndex="defaultIndex"
        @confirm="onConfirm"
        @cancel="showPicker = false"
    ></up-picker>
</template>

<script setup>
    import { ref, computed } from 'vue';

    const props = defineProps({
        isMaster: {
            type: [Number, String],
            default: '',
        },
        direction: {
            type: String,
            default: '',
        },
    });

    const emit = defineEmits(['save']);

    const showPicker = ref(false);

    const orientationRange = [
        ['主卧', '次卧'],
        ['朝东', '朝南', '朝西', '朝北'],
    ];

    const defaultIndex = computed(() => {
        if (!props.isMaster && !props.direction) {
            return [0, 0];
        }
        const masterIndex = props.isMaster == 1 ? 0 : 1;
        const directionIndex = orientationRange[1].findIndex((dir) => dir === props.direction);
        return [masterIndex, directionIndex !== -1 ? directionIndex : 0];
    });

    const displayValue = computed(() => {
        if (props.isMaster !== '' && props.direction) {
            const masterText = props.isMaster == 1 ? '主卧' : '次卧';
            return `${masterText} ${props.direction}`;
        }
        return '暂无';
    });

    const openPicker = () => {
        showPicker.value = true;
    };

    const onConfirm = (e) => {
        showPicker.value = false;
        const masterValue = e.value[0] === '主卧' ? 1 : 0;
        const directionValue = e.value[1];
        emit('save', {
            isMaster: masterValue,
            direction: directionValue,
        });
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

    .hiden-line {
        :deep(.u-line) {
            display: none;
        }
    }

    .inner-cell {
        :deep(.u-cell__body) {
            padding: 12rpx 30rpx !important;
        }
    }
</style>
