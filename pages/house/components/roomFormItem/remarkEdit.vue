<template>
    <view>
        <up-cell
            class="blue-value"
            :border="!value"
            title="房东备注"
            value="编辑"
            @click="openModal"
        >
            <template #right-icon>
                <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
            </template>
        </up-cell>
        <view v-if="value" class="remark-content">
            {{ value }}
        </view>

        <up-modal
            :show="showModal"
            showCancelButton
            title="房东备注"
            width="500rpx"
            class="form-sm"
            @confirm="onConfirm"
            @cancel="showModal = false"
            @close="onClose"
        >
            <up-textarea v-model.trim="tempValue" placeholder="请输入房东备注"></up-textarea>
        </up-modal>
    </view>
</template>

<script setup>
    import { ref } from 'vue';

    const props = defineProps({
        value: {
            type: String,
            default: '',
        },
    });

    const emit = defineEmits(['save']);

    const showModal = ref(false);
    const tempValue = ref('');

    const openModal = () => {
        tempValue.value = props.value;
        showModal.value = true;
    };

    const onConfirm = () => {
        showModal.value = false;
        emit('save', {
            remark: tempValue.value,
        });
    };

    const onClose = () => {
        tempValue.value = '';
    };
</script>

<style lang="scss" scoped>
    .blue-value {
        :deep(.u-cell__value) {
            color: $blue-light;
        }
    }

    .remark-content {
        padding: 0 32rpx 24rpx;
        color: $dark-9;
        font-size: 28rpx;
        line-height: 1.5;
        white-space: pre-wrap;
        border-bottom: 1px solid rgb(214, 215, 217);
    }
</style>
