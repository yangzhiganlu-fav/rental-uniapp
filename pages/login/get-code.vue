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
                            v-model="verifyForm.code"
                            type="number"
                            maxlength="4"
                            :inputBorder="false"
                        >
                            <template v-slot:right>
                                <button
                                    class="ss-reset-button code-btn code-btn-start"
                                    @tap="getSmsCode('smsLogin', verifyForm.mobile)"
                                >
                                    {{ getSmsTimer('smsLogin') }}
                                </button>
                            </template>
                        </uni-easyinput>
                    </view>
                </uni-forms-item>

                <button class="login-btn" @tap="onConfirm">确认并登录</button>
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
    import { ref, onMounted } from 'vue';
    import sheep from '@/sheep';
    import { code } from '@/sheep/validate/form';
    import { getSmsCode, getSmsTimer } from '@/sheep/hooks/useModal';

    const verifyForm = ref({
        code: '',
    });

    const verifyRules = {
        code: code,
    };

    const verifyRef = ref(null);

    const onConfirm = async () => {
        const validate = await verifyRef.value.validate().catch((err) => {
            console.log('validate error', err);
        });
        if (!validate) return;
        sheep.$router.go('/pages/index/index');
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

    .login-decoration-circle {
        position: absolute;
        top: -60rpx;
        right: -60rpx;
        width: 200rpx;
        height: 200rpx;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(80, 227, 194, 0.1));
        z-index: -1;
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
            border-bottom: 1px solid #eee;
            padding: 20rpx 0;
            &.code-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        }
        .get-code {
            color: #4a90e2;
            font-size: 28rpx;
            white-space: nowrap;
            margin-left: 20rpx;
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
        }
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
</style>
