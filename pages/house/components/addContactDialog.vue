<template>
    <up-modal
        :show="show"
        showCancelButton
        title="添加联系人"
        width="500rpx"
        @confirm="onConfirm"
        @cancel="close"
    >
        <view class="contact-form">
            <up-form
                ref="formRef"
                :model="formData"
                :rules="rules"
                borderBottom
                errorType="toast"
                labelWidth="60"
                labelAlign="right"
                class="modal-form"
            >
                <up-form-item prop="name" label="姓名">
                    <up-input v-model="formData.name" placeholder="请输入姓名" border="bottom" />
                </up-form-item>
                <up-form-item prop="phone" label="联系方式">
                    <up-input
                        v-model="formData.phone"
                        placeholder="请输入联系方式"
                        border="bottom"
                        type="number"
                        maxlength="11"
                    />
                </up-form-item>
            </up-form>
        </view>
    </up-modal>
</template>

<script setup>
    import sheep from '@/sheep';
    import { ref, unref } from 'vue';

    const emit = defineEmits(['confirm']);

    const show = ref(false);
    const formRef = ref(null);
    const formData = ref({
        name: '',
        phone: '',
    });

    const rules = {
        name: {
            required: true,
            message: '请输入姓名',
            trigger: ['blur', 'change'],
        },
        phone: [
            {
                required: true,
                message: '请输入联系方式',
                trigger: ['blur', 'change'],
            },
            {
                pattern: /^1[3-9]\d{9}$/,
                message: '手机号格式不正确',
                trigger: ['blur', 'change'],
            },
        ],
    };

    const open = () => {
        formData.value = { name: '', phone: '' };
        show.value = true;
    };

    const close = () => {
        show.value = false;
        formRef.value?.resetFields();
    };

    const onConfirm = () => {
        unref(formRef)
            .validate()
            .then(() => {
                emit('confirm', { ...formData.value });
                close();
            })
            .catch(() => {});
    };

    defineExpose({
        open,
        close,
    });
</script>
