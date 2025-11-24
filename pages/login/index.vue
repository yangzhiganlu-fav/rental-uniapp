<template>
    <view class="role-selection-page">
        <view class="header-section">
            <view class="title-wrapper">
                <text class="main-title">欢迎使用</text>
                <text class="sub-title">请选择您的登录身份</text>
            </view>
            <view class="login-decoration-circle"></view>
        </view>

        <view class="role-cards-section">
            <view
                class="role-card landlord-card"
                hover-class="card-hover"
                @tap="handleSelect('landlord')"
            >
                <view class="card-content">
                    <view class="text-group">
                        <text class="role-name">我是房东</text>
                        <text class="role-slogan">发布房源 · 轻松收租</text>
                    </view>
                    <view class="icon-box">
                        <image
                            src="/static/imgs/fangdong.png"
                            alt="Landlord"
                            class="landlord-avatar"
                        />
                    </view>
                </view>
                <view class="card-bg-decoration"></view>
            </view>

            <view
                class="role-card agent-card"
                hover-class="card-hover"
                @tap="handleSelect('agent')"
            >
                <view class="card-content">
                    <view class="text-group">
                        <text class="role-name">我是中介</text>
                        <text class="role-slogan">拓展客源 · 高效带看</text>
                    </view>
                    <view class="icon-box">
                        <image src="/static/imgs/zhongjie.png" alt="Agent" class="agent-avatar" />
                    </view>
                </view>
                <view class="card-bg-decoration"></view>
            </view>
        </view>

        <!-- 底部装饰 -->
        <view class="login-bottom-decoration login-circle-left"></view>
        <view class="login-bottom-decoration login-circle-right"></view>
    </view>
</template>

<script setup>
    import sheep from '@/sheep';

    const handleSelect = (role) => {
        sheep.$router.go('/pages/login/login', { role });
    };
</script>

<style lang="scss" scoped>
    .role-selection-page {
        min-height: 100vh;
        background-color: #fff;
        padding: 40rpx;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
    }

    /* 顶部区域 */
    .header-section {
        margin-top: 80rpx;
        margin-bottom: 60rpx;
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

    /* 卡片区域 */
    .role-cards-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 40rpx;
    }

    .role-card {
        position: relative;
        width: 100%;
        height: 240rpx;
        border-radius: 32rpx;
        overflow: hidden;
        box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.08);
        transition: transform 0.2s ease;

        &.card-hover {
            transform: scale(0.98);
        }

        .card-content {
            position: relative;
            z-index: 2;
            height: 100%;
            padding: 0 50rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .text-group {
            display: flex;
            flex-direction: column;

            .role-name {
                font-size: 44rpx;
                font-weight: bold;
                color: #fff;
                margin-bottom: 12rpx;
                text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
            }

            .role-slogan {
                font-size: 26rpx;
                color: rgba(255, 255, 255, 0.9);
            }
        }

        .icon-box {
            width: 120rpx;
            height: 120rpx;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10rpx);
            border: 2rpx solid rgba(255, 255, 255, 0.3);

            .landlord-avatar {
                height: 120rpx;
            }

            .agent-avatar {
                height: 120rpx;
            }
        }

        // 背景装饰
        .card-bg-decoration {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }
    }

    // 房东卡片样式
    .landlord-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

        .card-bg-decoration {
            background-image: radial-gradient(
                circle at 90% 10%,
                rgba(255, 255, 255, 0.1) 0%,
                transparent 50%
            );
        }
    }

    // 中介卡片样式
    .agent-card {
        background: linear-gradient(135deg, #2af598 0%, #009efd 100%);

        .card-bg-decoration {
            background-image: radial-gradient(
                circle at 90% 90%,
                rgba(255, 255, 255, 0.15) 0%,
                transparent 60%
            );
        }
    }

    /* 底部装饰样式已移至全局公共样式 */
    .uni-tabbar-bottom {
        display: none;
    }
</style>
