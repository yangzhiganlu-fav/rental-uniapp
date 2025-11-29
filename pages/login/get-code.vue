<template>
    <view class="login-page">
        <!-- Header -->
        <view class="header-section">
            <view class="title-wrapper">
                <text class="main-title">获取验证码</text>
                <text class="sub-title">请输入您收到的验证码以登录</text>
            </view>
            <view class="login-decoration-circle"></view>
        </view>

        <view class="content-section">
            <uni-forms ref="verifyRef" :model="verifyForm" :rules="verifyRules" class="login-form">
                <uni-forms-item name="code">
                    <view class="form-item">
                        <s-icon name="renzheng" size="40" color="#999"></s-icon>
                        <uni-easyinput
                            placeholder="请输入验证码"
                            v-model.trim="verifyForm.code"
                            type="number"
                            maxlength="4"
                            :inputBorder="false"
                            :clearable="false"
                        >
                            <template #right>
                                <up-code ref="uCodeRef" @change="codeChange"></up-code>
                                <up-text
                                    :type="loading ? 'info' : 'primary'"
                                    :text="tips"
                                    style="width: auto; flex: 0 0 auto; flex-direction: row-reverse"
                                    @tap="getCode"
                                ></up-text>
                            </template>
                        </uni-easyinput>
                    </view>
                </uni-forms-item>

                <button class="btn-gradient" @tap="onConfirm">确认并登录</button>
            </uni-forms>
        </view>

        <view class="footer-section">
            <text class="footer-text">若未收到验证码，请稍候或重新获取</text>
        </view>

        <view class="login-bottom-decoration login-circle-left"></view>
        <view class="login-bottom-decoration login-circle-right"></view>
    </view>
</template>

<script setup>
    import sheep from '@/sheep';
    import { ref, onMounted } from 'vue';
    import { code } from '@/sheep/validate/form';

    const verifyForm = ref({
        code: '',
    });

    const verifyRules = {
        code: code,
    };

    const verifyRef = ref(null);

    const onConfirm = async () => {
        try {
            await verifyRef.value.validate();
            sheep.$router.go('/pages/index/index');
        } catch (error) {
            if (error && error.length > 0) {
                uni.showToast({
                    title: error[0].errorMessage,
                    icon: 'none',
                });
            }
        }
    };

    const uCodeRef = ref(null);

    const tips = ref('获取验证码');

    const loading = ref(false);

    const codeChange = (text) => {
        tips.value = text;
    };

    const getCode = () => {
        if (uCodeRef.value?.canGetCode) {
            loading.value = true;
            setTimeout(() => {
                uni.hideLoading();
                uCodeRef.value?.start();
                loading.value = false;
            }, 2000);
        }
    };
</script>

<style lang="scss" scoped>
    .login-page {
        min-height: 100vh;
        background-color: $white;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
    }

    .tabs-section {
        display: none;
    }

    .content-section {
        flex: 1;
        z-index: 2;
    }

    .login-form {
        padding: 0 40rpx;
        .form-item {
            display: flex;
            align-items: center;
            gap: 20rpx;
            border-bottom: 1rpx solid $gray-e;
            padding: 20rpx 0;
        }
    }
</style>
