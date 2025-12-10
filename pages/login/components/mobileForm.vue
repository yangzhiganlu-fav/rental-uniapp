<template>
    <up-form ref="formRef" :model="form" :rules="rules" errorType="toast" class="login-form">
        <up-form-item prop="mobile">
            <view class="form-item">
                <s-icon name="mobile" size="40" color="#999"></s-icon>
                <uni-easyinput
                    type="number"
                    placeholder="请输入手机号"
                    v-model.trim="form.mobile"
                    maxlength="11"
                    :inputBorder="false"
                    :clearable="false"
                />
            </view>
        </up-form-item>
        <up-form-item prop="code">
            <view class="form-item">
                <s-icon name="renzheng" size="40" color="#999"></s-icon>
                <uni-easyinput
                    placeholder="请输入验证码"
                    v-model.trim="form.code"
                    type="number"
                    maxlength="4"
                    :inputBorder="false"
                    :clearable="false"
                >
                    <template #right>
                        <up-text
                            :type="codeText !== '获取验证码' ? 'info' : 'primary'"
                            :text="codeText"
                            style="width: auto; flex: 0 0 auto; flex-direction: row-reverse"
                            @tap="getSmsCode('smsLogin', form.mobile)"
                        ></up-text>
                    </template>
                </uni-easyinput>
            </view>
        </up-form-item>
        <button class="btn-gradient" @tap="onLogin">登录</button>
    </up-form>
</template>

<script setup>
    import { ref, reactive, computed } from 'vue';
    import { getSmsCode, getSmsTimer } from '@/sheep/hooks/useModal';

    const emits = defineEmits(['login']);

    const formRef = ref(null);

    const form = reactive({
        mobile: '',
        code: '',
    });

    const rules = {
        mobile: [{ required: true, message: '请输入手机号', trigger: ['blur', 'change'] }],
        code: [{ required: true, message: '请输入验证码', trigger: ['blur', 'change'] }],
    };

    const codeText = computed(() => getSmsTimer('smsLogin'));

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
