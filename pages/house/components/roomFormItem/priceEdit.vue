<template>
    <up-cell
        class="blue-value grey-label"
        title="对外租金挂牌价"
        :value="displayValue"
        @click="openModal"
    >
        <template #right-icon>
            <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
        </template>
    </up-cell>

    <up-modal
        :show="showModal"
        showCancelButton
        title="对外报价"
        width="500rpx"
        class="form-sm"
        @confirm="onConfirm"
        @cancel="showModal = false"
        @close="onClose"
    >
        <up-input
            v-model.trim="tempValue"
            placeholder="请输入对外报价"
            border="bottom"
            type="number"
        >
            <template #prefix>
                <view>￥</view>
            </template>
        </up-input>
    </up-modal>
</template>

<script setup>
    import { ref, computed } from 'vue';

    const props = defineProps({
        value: {
            type: [String, Number],
            default: '',
        },
    });

    const emit = defineEmits(['save']);

    const showModal = ref(false);
    const tempValue = ref('');

    const displayValue = computed(() => {
        return props.value ? `￥${props.value}` : '暂无';
    });

    const openModal = () => {
        tempValue.value = props.value;
        showModal.value = true;
    };

    const onConfirm = () => {
        if (!tempValue.value) {
            uni.showToast({
                title: '请输入对外报价',
                icon: 'none',
            });
            return;
        }
        showModal.value = false;
        emit('save', {
            price: tempValue.value,
        });
    };

    const onClose = () => {
        tempValue.value = '';
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
</style>
