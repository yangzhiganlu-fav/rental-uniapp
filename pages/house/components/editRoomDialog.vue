<template>
    <up-modal
        :show="visible"
        showCancelButton
        title="修改房号"
        width="500rpx"
        @confirm="onSave"
        @cancel="onCancel"
    >
        <view class="room-form">
            <up-form
                ref="formRef"
                :model="formData"
                :rules="rules"
                errorType="toast"
                class="modal-form"
            >
                <up-form-item prop="buildingNumber">
                    <up-input
                        v-model="formData.buildingNumber"
                        placeholder="请输入幢/栋"
                        inputAlign="right"
                    >
                        <template #suffix>
                            <view style="width: 80rpx; text-align: right">幢/栋</view>
                        </template>
                    </up-input>
                </up-form-item>
                <up-form-item prop="unitNumber">
                    <up-input
                        v-model="formData.unitNumber"
                        placeholder="请输入单元"
                        inputAlign="right"
                    >
                        <template #suffix>
                            <view style="width: 80rpx; text-align: right">单元</view>
                        </template>
                    </up-input>
                </up-form-item>
                <up-form-item prop="roomNumber">
                    <up-input
                        v-model="formData.roomNumber"
                        placeholder="请输入室"
                        inputAlign="right"
                    >
                        <template #suffix>
                            <view style="width: 80rpx; text-align: right">室</view>
                        </template>
                    </up-input>
                </up-form-item>
            </up-form>
        </view>
    </up-modal>
</template>

<script setup>
    import { ref, reactive, computed, defineProps, defineEmits, unref } from 'vue';

    // 接收父组件传递的属性
    const props = defineProps({
        modelValue: {
            type: Boolean,
            default: false,
        },
        roomData: {
            type: Object,
            default: () => ({
                buildingNumber: '',
                unitNumber: '',
                roomNumber: '',
            }),
        },
    });

    // 向父组件发送事件
    const emit = defineEmits(['update:modelValue', 'save']);

    // 控制弹框显示状态
    const visible = computed({
        get: () => props.modelValue,
        set: (value) => emit('update:modelValue', value),
    });

    // 表单数据
    const formRef = ref(null);
    const formData = reactive({
        buildingNumber: '',
        unitNumber: '',
        roomNumber: '',
    });

    // 表单验证规则
    const rules = {
        buildingNumber: {
            required: true,
            message: '请输入号楼',
            trigger: ['blur', 'change'],
        },
        unitNumber: {
            required: true,
            message: '请输入单元',
            trigger: ['blur', 'change'],
        },
        roomNumber: {
            required: true,
            message: '请输入室',
            trigger: ['blur', 'change'],
        },
    };

    // 初始化表单数据
    const resetFormData = () => {
        formData.buildingNumber = props.roomData.buildingNumber || '';
        formData.unitNumber = props.roomData.unitNumber || '';
        formData.roomNumber = props.roomData.roomNumber || '';
    };
    resetFormData();

    // 取消操作
    const onCancel = () => {
        visible.value = false;
        formRef.value?.resetFields();
    };

    // 保存操作
    const onSave = () => {
        unref(formRef)
            .validate()
            .then(() => {
                emit('save', { ...formData });
                visible.value = false;
            })
            .catch(() => {});
    };

    // 暴露方法供父组件调用
    defineExpose({
        resetFormData,
    });
</script>

<style lang="scss" scoped>
    .unit-text {
        width: 40px;
        text-align: left;
        margin-left: 10px;
    }
</style>
