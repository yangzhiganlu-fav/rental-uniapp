<template>
    <up-form ref="formRef" :model="form" :rules="rules" errorType="toast" class="login-form">
        <up-form-item prop="username">
            <view class="form-item">
                <s-icon name="yonghu" size="40" color="#999"></s-icon>
                <uni-easyinput
                    v-model.trim="form.username"
                    placeholder="请输入账号"
                    :inputBorder="false"
                    :clearable="false"
                />
            </view>
        </up-form-item>
        <up-form-item prop="password">
            <view class="form-item">
                <s-icon name="mima" size="40" color="#999"></s-icon>
                <uni-easyinput
                    v-model.trim="form.password"
                    type="password"
                    placeholder="请输入密码"
                    :inputBorder="false"
                    :clearable="false"
                />
            </view>
        </up-form-item>
        <button class="btn-gradient" @tap="onLogin">登录</button>
    </up-form>
</template>

<script setup>
    import { ref } from 'vue';

    const emits = defineEmits(['login']);

    const formRef = ref(null);

    const form = ref({
        username: '',
        password: '',
    });

    const rules = {
        username: [{ required: true, message: '请输入账号', trigger: ['blur', 'change'] }],
        password: [{ required: true, message: '请输入密码', trigger: ['blur', 'change'] }],
    };

    const onLogin = () => {
        formRef.value.validate().then((valid) => {
            if (valid) {
                emits('login', form.value);
            }
        });
    };
</script>

<style lang="scss" scoped>
    .login-form {
        padding: 0 40rpx;
        .form-item {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 20rpx;
            border-bottom: 1rpx solid $gray-e;
            padding: 20rpx 0;
            &.code-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        }
    }

    /* 渐变按钮 */
    .btn-gradient {
        margin-top: 60rpx;
        background: linear-gradient(90deg, $blue-light, $green-light);
        color: $white;
        border-radius: 40rpx;
        font-size: 32rpx;
        font-weight: bold;
        &::after {
            border: none;
        }
    }
</style>
