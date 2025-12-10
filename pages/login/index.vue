<template>
    <view class="login-page">
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
            <account-form v-show="currentTab === 'account'" @login="onAccountLogin" />
            <mobile-form v-show="currentTab === 'mobile'" @login="onMobileLogin" />
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
    import AuthUtil from '@/sheep/api/system/auth';
    import { ref } from 'vue';
    import AccountForm from './components/accountForm.vue';
    import MobileForm from './components/mobileForm.vue';

    const currentTab = ref('mobile');
    const consent = ref(false);

    const showConsentModal = () => {
        uni.showModal({
            content: '请同意《用户协议》与《隐私政策》',
            showCancel: false,
        });
    };

    const onAccountLogin = async (formData) => {
        if (!consent.value) {
            showConsentModal();
            return;
        }
        const { code, data } = await AuthUtil.login(formData);
        if (code === 0 && data.userType === 2) {
            sheep.$router.go('/pages/index/index');
        }
    };

    const onMobileLogin = async (formData) => {
        if (!consent.value) {
            showConsentModal();
            return;
        }
        const { code, data } = await AuthUtil.smsLogin(formData);
        if (code === 0 && data.userType === 2) {
            sheep.$router.go('/pages/index/index');
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

        .tabs-section {
            display: flex;
            padding: 0 40rpx;
            margin-bottom: 40rpx;

            .tab-item {
                font-size: 32rpx;
                line-height: 50rpx;
                color: $dark-9;
                margin-right: 40rpx;
                padding-bottom: 10rpx;
                position: relative;
                transition: all 0.3s;

                &.active {
                    color: $black;
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
                        background: linear-gradient(90deg, $blue-light, $green-light);
                        border-radius: 3rpx;
                    }
                }
            }
        }

        .content-section {
            flex: 1;
            z-index: 2;
        }

        .login-decoration-circle {
            position: absolute;
            top: -60rpx;
            right: -60rpx;
            width: 200rpx;
            height: 200rpx;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba($blue-light, 0.1), rgba($green-light, 0.1));
            z-index: -1;
        }

        .login-bottom-decoration {
            position: absolute;
            border-radius: 50%;
            z-index: 0;
            pointer-events: none;
        }

        .login-circle-left {
            width: 500rpx;
            height: 500rpx;
            bottom: -150rpx;
            left: -150rpx;
            background: linear-gradient(135deg, rgba(118, 75, 162, 0.1), rgba(118, 75, 162, 0.05));
        }

        .login-circle-right {
            width: 300rpx;
            height: 300rpx;
            bottom: 150rpx;
            right: -80rpx;
            background: linear-gradient(135deg, rgba(42, 245, 152, 0.1), rgba(42, 245, 152, 0.05));
        }

        /* 登录页面头部 */
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
                color: $black;
                margin-bottom: 16rpx;
                letter-spacing: 2rpx;
            }

            .sub-title {
                font-size: 30rpx;
                color: $dark-9;
                font-weight: 400;
            }
        }

        /* 登录页面底部 */
        .footer-section {
            padding: 60rpx 0;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            z-index: 2;

            .footer-text {
                font-size: 24rpx;
                color: $gray-c;
                text-align: center;
                margin-left: 10rpx;

                .highlighted-text {
                    color: $blue-light;
                    text-decoration: underline;
                }
            }
        }
    }
</style>
