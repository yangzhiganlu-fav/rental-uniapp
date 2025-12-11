<template>
    <up-cell
        class="grey-value grey-label hiden-line inner-cell"
        title="门牌号"
        :value="displayValue"
    >
        <template #right-icon>
            <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
        </template>
    </up-cell>

    <up-modal
        :show="showModal"
        showCancelButton
        title="修改房号"
        width="500rpx"
        @confirm="onConfirm"
        @cancel="showModal = false"
        @close="onClose"
    >
        <up-form ref="formRef" :model="formData" :rules="rules" errorType="toast" class="form-sm">
            <up-form-item prop="blockNumber">
                <up-input
                    v-model.trim="formData.blockNumber"
                    placeholder="请输入幢/栋"
                    inputAlign="right"
                    type="number"
                >
                    <template #suffix>
                        <view style="width: 80rpx; text-align: right">幢/栋</view>
                    </template>
                </up-input>
            </up-form-item>
            <up-form-item prop="unitNumber">
                <up-input
                    v-model.trim="formData.unitNumber"
                    placeholder="请输入单元"
                    inputAlign="right"
                    type="number"
                >
                    <template #suffix>
                        <view style="width: 80rpx; text-align: right">单元</view>
                    </template>
                </up-input>
            </up-form-item>
            <up-form-item prop="houseNo">
                <up-input
                    v-model.trim="formData.houseNo"
                    placeholder="请输入室"
                    inputAlign="right"
                    type="number"
                >
                    <template #suffix>
                        <view style="width: 80rpx; text-align: right">室</view>
                    </template>
                </up-input>
            </up-form-item>
        </up-form>
    </up-modal>
</template>

<script setup>
    import { ref, computed, reactive, unref } from 'vue';

    const props = defineProps({
        blockNumber: {
            type: [String, Number],
            default: '',
        },
        unitNumber: {
            type: [String, Number],
            default: '',
        },
        houseNo: {
            type: [String, Number],
            default: '',
        },
    });

    const emit = defineEmits(['save']);

    const showModal = ref(false);
    const formRef = ref(null);
    const formData = reactive({
        blockNumber: '',
        unitNumber: '',
        houseNo: '',
    });

    // 表单验证规则
    const rules = {
        blockNumber: {
            required: true,
            message: '请输入楼号',
            trigger: ['blur', 'change'],
        },
        unitNumber: {
            required: true,
            message: '请输入单元号',
            trigger: ['blur', 'change'],
        },
        houseNo: {
            required: true,
            message: '请输入房号',
            trigger: ['blur', 'change'],
        },
    };

    const displayValue = computed(() => {
        if (props.blockNumber && props.unitNumber && props.houseNo) {
            return `${props.blockNumber}幢 ${props.unitNumber}单元 ${props.houseNo}室`;
        }
        return '暂无';
    });

    const openModal = () => {
        formData.blockNumber =
            props.blockNumber !== '' && props.blockNumber != null ? String(props.blockNumber) : '';
        formData.unitNumber =
            props.unitNumber !== '' && props.unitNumber != null ? String(props.unitNumber) : '';
        formData.houseNo =
            props.houseNo !== '' && props.houseNo != null ? String(props.houseNo) : '';
        showModal.value = true;
    };

    const onClose = () => {
        showModal.value = false;
        formRef.value?.resetFields();
    };

    const onConfirm = () => {
        unref(formRef)
            .validate()
            .then(() => {
                showModal.value = false;
                emit('save', { ...formData });
            })
            .catch(() => {});
    };
</script>

<style lang="scss" scoped>
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
