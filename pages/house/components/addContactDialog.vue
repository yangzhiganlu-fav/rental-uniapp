<template>
    <su-dialog :show="show" title="添加联系人" @close="close" @confirm="onConfirm">
        <view class="contact-form">
            <uni-forms
                ref="formRef"
                :model="formData"
                :rules="rules"
                label-width="80px"
                label-align="left"
            >
                <uni-forms-item label="姓名" name="name">
                    <uni-easyinput
                        v-model="formData.name"
                        placeholder="请输入姓名"
                        :inputBorder="false"
                        trim="both"
                    />
                </uni-forms-item>
                <uni-forms-item label="联系方式" name="phone">
                    <uni-easyinput
                        v-model="formData.phone"
                        placeholder="请输入联系方式"
                        :inputBorder="false"
                        type="number"
                        trim="both"
                        :maxlength="11"
                    />
                </uni-forms-item>
            </uni-forms>
        </view>
    </su-dialog>
</template>

<script setup>
    import sheep from '@/sheep';
    import { ref } from 'vue';
    import { mobile } from '@/sheep/validate/form';

    const emit = defineEmits(['confirm']);

    const show = ref(false);
    const formRef = ref(null);
    const formData = ref({
        name: '',
        phone: '',
    });

    const rules = {
        name: {
            rules: [{ required: true, errorMessage: '请输入姓名' }],
        },
        phone: mobile,
    };

    const open = () => {
        formData.value = { name: '', phone: '' };
        show.value = true;
    };

    const close = () => {
        show.value = false;
    };

    const onConfirm = async () => {
        try {
            await formRef.value.validate();
            emit('confirm', { ...formData.value });
            close();
        } catch (e) {
            if (e && e.length) {
                uni.showToast({
                    title: e[0].errorMessage || '表单验证失败',
                    icon: 'none',
                });
            }
        }
    };

    defineExpose({
        open,
        close,
    });
</script>

<style lang="scss" scoped>
    .contact-form {
        width: 100%;
    }

    :deep(.uni-dialog-title-text) {
        color: #3d9bff !important;
    }

    :deep(.uni-forms-item__label) {
        color: #333;
    }

    :deep(.uni-error-message) {
        display: none;
    }
</style>
