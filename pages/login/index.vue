<template>
    <view class="login-page">
        <!-- Header -->
        <view class="header-section">
            <view class="title-wrapper">
                <text class="main-title">欢迎登录</text>
                <text class="sub-title">请选择登录方式</text>
            </view>
            <view class="login-decoration-circle"></view>
        </view>

        <view class="tabs-section">
            <view
                class="tab-item"
                :class="{ active: currentTab === 'mobile' }"
                @tap="currentTab = 'mobile'"
            >
                手机登录
            </view>
            <view
                class="tab-item"
                :class="{ active: currentTab === 'account' }"
                @tap="currentTab = 'account'"
            >
                账号登录
            </view>
        </view>

        <view class="content-section">
            <uni-forms
                v-if="currentTab === 'account'"
                ref="accountLoginRef"
                :model="accountForm"
                :rules="accountRules"
                class="login-form"
            >
                <uni-forms-item name="username">
                    <view class="form-item">
                        <s-icon name="yonghu" size="40" color="#999"></s-icon>
                        <uni-easyinput
                            v-model="accountForm.username"
                            placeholder="请输入账号"
                            :inputBorder="false"
                            :clearable="false"
                        />
                    </view>
                </uni-forms-item>
                <uni-forms-item name="password">
                    <view class="form-item">
                        <s-icon name="mima" size="40" color="#999"></s-icon>
                        <uni-easyinput
                            v-model="accountForm.password"
                            type="password"
                            placeholder="请输入密码"
                            :inputBorder="false"
                            :clearable="false"
                        />
                    </view>
                </uni-forms-item>
                <button class="login-btn" @tap="onAccountLogin">登录</button>
            </uni-forms>

            <uni-forms
                v-else
                ref="mobileLoginRef"
                :model="mobileForm"
                :rules="mobileRules"
                class="login-form"
            >
                <uni-forms-item name="mobile">
                    <view class="form-item">
                        <s-icon name="mobile" size="40" color="#999"></s-icon>
                        <uni-easyinput
                            type="number"
                            placeholder="请输入手机号"
                            v-model="mobileForm.mobile"
                            :inputBorder="false"
                            :clearable="false"
                        />
                    </view>
                </uni-forms-item>
                <uni-forms-item name="code">
                    <view class="form-item">
                        <s-icon name="renzheng" size="40" color="#999"></s-icon>
                        <uni-easyinput
                            placeholder="请输入验证码"
                            v-model="mobileForm.code"
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
                <button class="login-btn" @tap="onMobileLogin">登录</button>
            </uni-forms>
        </view>

        <view class="footer-section">
            <radio
                :checked="consent"
                color="#4a90e2"
                style="transform: scale(0.7)"
                @tap="consent = !consent"
            ></radio>
            <text class="footer-text">
                登录即代表同意
                <text class="highlighted-text">《用户协议》</text>
                与
                <text class="highlighted-text">《隐私政策》</text>
            </text>
        </view>

        <view class="login-bottom-decoration login-circle-left"></view>
        <view class="login-bottom-decoration login-circle-right"></view>
    </view>
</template>

<script setup>
    import sheep from '@/sheep';
    import { ref, unref } from 'vue';
    import { mobile, code, password } from '@/sheep/validate/form';

    const currentTab = ref('mobile');
    const consent = ref(false);

    const accountForm = ref({
        username: '',
        password: '',
    });
    const accountRules = {
        username: {
            rules: [{ required: true, errorMessage: '请输入账号' }],
        },
        password: password,
    };
    const accountLoginRef = ref(null);

    const mobileForm = ref({
        mobile: '',
        code: '',
    });
    const mobileRules = {
        mobile: mobile,
        code: code,
    };
    const mobileLoginRef = ref(null);

    const showConsentModal = () => {
        uni.showModal({
            content: '请同意《用户协议》与《隐私政策》',
            showCancel: false,
        });
    };

    const onAccountLogin = async () => {
        try {
            await unref(accountLoginRef).validate();
            if (!consent.value) {
                showConsentModal();
                return;
            }
            sheep.$router.go('/pages/login/get-code');
        } catch (error) {
            if (error && error.length > 0) {
                uni.showToast({
                    title: error[0].errorMessage,
                    icon: 'none',
                });
            }
        }
    };

    const onMobileLogin = async () => {
        try {
            await unref(mobileLoginRef)?.validate();
            if (!consent.value) {
                showConsentModal();
                return;
            }
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
        background-color: #fff;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
    }

    .header-section {
        margin-top: 120rpx;
        margin-bottom: 40rpx;
        padding: 0 40rpx;
        position: relative;
        z-index: 2;

        .title-wrapper {
            display: flex;
            flex-direction: column;
        }

        .main-title {
            font-size: 56rpx;
            font-weight: 800;
            color: #333;
            margin-bottom: 16rpx;
            letter-spacing: 2rpx;
        }

        .sub-title {
            font-size: 30rpx;
            color: #999;
            font-weight: 400;
        }
    }

    .tabs-section {
        display: flex;
        padding: 0 40rpx;
        margin-bottom: 40rpx;

        .tab-item {
            font-size: 32rpx;
            line-height: 50rpx;
            color: #999;
            margin-right: 40rpx;
            padding-bottom: 10rpx;
            position: relative;
            transition: all 0.3s;

            &.active {
                color: #333;
                font-weight: bold;
                font-size: 36rpx;

                &::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 40rpx;
                    height: 6rpx;
                    background: linear-gradient(90deg, #4a90e2, #50e3c2);
                    border-radius: 3rpx;
                }
            }
        }
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
            border-bottom: 1px solid #eee;
            padding: 20rpx 0;
            &.code-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        }
        .login-btn {
            margin-top: 60rpx;
            background: linear-gradient(90deg, #4a90e2, #50e3c2);
            color: #fff;
            border-radius: 40rpx;
            font-size: 32rpx;
            font-weight: bold;
            &::after {
                border: none;
            }
        }
    }

    .footer-section {
        padding: 60rpx 0;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 2;

        .footer-text {
            font-size: 24rpx;
            color: #ccc;
            text-align: center;
            margin-left: 10rpx;

            .highlighted-text {
                color: #4a90e2;
                text-decoration: underline;
            }
        }
    }
</style>
