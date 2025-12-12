<template>
    <s-layout title="我的" tabbar="/pages/mine/index" :showNavbar="false">
        <view class="mine-page">
            <view class="header-box">
                <view class="user-info">
                    <image class="avatar" src="/static/imgs/fangdong.png" mode="aspectFill"></image>
                    <view class="info-text">
                        <view class="nickname">{{ userInfo.nickname }}</view>
                        <view class="mobile">{{ sheep.$helper.maskPhone(userInfo.mobile) }}</view>
                    </view>
                </view>
                <view>
                    <up-button plain shape="circle" class="logout-btn" @tap="onLogout">
                        退出登录
                    </up-button>
                </view>
            </view>
            <view class="service-box">
                <view class="service-title">我的服务</view>
                <s-menu-grid
                    :data="serviceList"
                    :styles="{
                        bgType: 'color',
                        bgColor: '#fff',
                        padding: 16,
                        paddingTop: 0,
                    }"
                />
            </view>
        </view>
    </s-layout>
</template>

<script setup>
    import { computed, reactive } from 'vue';
    import sheep from '@/sheep';
    import AuthUtil from '@/sheep/api/system/auth';

    const userInfo = computed(() => sheep.$store('user').userInfo);

    // 我的服务列表
    const serviceList = reactive({
        column: 4,
        list: [
            {
                title: '隐私政策',
                iconUrl: 'yinsizhengce',
                url: '/pages/public/richtext?id=privacy',
                iconSize: 56,
                iconColor: '#3c9cff',
                badge: {
                    show: false,
                },
            },
            {
                title: '用户协议',
                iconUrl: 'yonghuxieyi',
                url: '/pages/public/richtext?id=agreement',
                iconSize: 56,
                iconColor: '#3c9cff',
                badge: {
                    show: false,
                },
            },
            {
                title: '修改密码',
                iconUrl: 'xiugaimima',
                url: '/pages/user/change-password',
                iconSize: 56,
                iconColor: '#3c9cff',
                badge: {
                    show: false,
                },
            },
        ],
    });

    const onLogout = () => {
        uni.showModal({
            title: '提示',
            content: '确认退出账号？',
            success: async function (res) {
                if (!res.confirm) {
                    return;
                }
                const { code } = await AuthUtil.logout();
                if (code === 0) {
                    sheep.$store('user').logout();
                }
            },
        });
    };
</script>

<style lang="scss" scoped>
    .mine-page {
        padding-bottom: 30rpx;
    }

    .header-box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        padding: 40rpx 30rpx;
        background-color: $white;

        .user-info {
            display: flex;
            flex-direction: row;
            align-items: center;

            .avatar {
                width: 110rpx;
                height: 110rpx;
                margin-right: 24rpx;
                border-radius: 50%;
            }

            .info-text {
                .nickname {
                    margin-bottom: 10rpx;
                    font-size: 32rpx;
                    font-weight: bold;
                }

                .mobile {
                    font-size: 24rpx;
                    color: $dark-6;
                }
            }
        }

        .logout-btn {
            width: 160rpx;
            height: 60rpx;
            padding: 0;
            line-height: 1;

            &::after {
                border: none;
            }
        }
    }

    .service-box {
        margin-top: 20rpx;
        background-color: $white;
        border-radius: 10rpx;

        .service-title {
            padding: 20rpx 30rpx 20rpx;
            font-size: 30rpx;
            font-weight: bold;
        }
    }
</style>
