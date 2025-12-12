<template>
    <up-cell
        title="出租状态"
        :value="displayValue"
        :class="['grey-label', disabled ? '' : 'blue-value', 'hiden-line', 'inner-cell']"
        @click="openPicker"
    >
        <template v-if="!disabled" #right-icon>
            <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
        </template>
    </up-cell>

    <up-picker
        :show="showPicker"
        :columns="options"
        :defaultIndex="[props.value ? 0 : 1]"
        keyName="label"
        valueName="value"
        closeOnClickOverlay
        @confirm="onConfirm"
    ></up-picker>
</template>

<script setup>
    import { ref, computed } from 'vue';

    const props = defineProps({
        value: {
            type: [Number, String],
            default: 0,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    });

    const emit = defineEmits(['save']);

    const showPicker = ref(false);
    const tempValue = ref([]);

    const options = [
        [
            { label: '已租', value: 1 },
            { label: '未租', value: 0 },
        ],
    ];

    const displayValue = computed(() => {
        return options[0].find((item) => item.value === props.value)?.label || '暂无';
    });

    const openPicker = () => {
        if (props.disabled) return;
        tempValue.value = props.value ? [props.value] : [];
        showPicker.value = true;
    };

    const onConfirm = (e) => {
        const newValue = e.value[0].value;
        showPicker.value = false;
        emit('save', {
            rentalStatus: newValue,
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
