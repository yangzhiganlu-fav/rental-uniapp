<template>
    <s-layout title="我的" tabbar="/pages/mine/index" :showNavbar="false">
        <view class="ss-p-b-30">
            <!-- Header -->
            <view
                class="header-box ss-flex ss-row-between ss-col-center ss-p-x-30 ss-p-y-40 bg-white"
                :style="[{ paddingTop: sheep.$platform.navbar + 'px' }]"
            >
                <view class="ss-flex ss-col-center">
                    <image
                        class="avatar ss-m-r-24"
                        src="/static/imgs/fangdong.png"
                        mode="aspectFill"
                    ></image>
                    <view>
                        <view class="nickname ss-font-32 ss-font-bold ss-m-b-10">
                            {{ userInfo.nickname }}
                        </view>
                        <view class="mobile ss-font-24 text-gray">
                            {{ userInfo.mobile }}
                        </view>
                    </view>
                </view>
                <button
                    class="logout-btn ss-reset-button ss-flex ss-row-center ss-col-center"
                    @tap="onLogout"
                >
                    退出登录
                </button>
            </view>

            <!-- My Services -->
            <view class="service-box ss-m-20 ss-p-20 bg-white ss-r-10">
                <view class="title ss-font-30 ss-font-bold ss-m-b-30 ss-p-l-10">我的服务</view>
                <view class="ss-flex ss-flex-wrap">
                    <!-- Privacy Policy -->
                    <view
                        class="service-item ss-flex-col ss-col-center ss-m-b-30"
                        @tap="onLink('privacy')"
                    >
                        <s-icon name="yinsizhengce" size="50" color="#3c9cff"></s-icon>
                        <text class="ss-font-24 ss-m-t-16 text-dark">隐私政策</text>
                    </view>
                    <!-- User Agreement -->
                    <view
                        class="service-item ss-flex-col ss-col-center ss-m-b-30"
                        @tap="onLink('agreement')"
                    >
                        <s-icon name="yonghuxieyi" size="50" color="#3c9cff"></s-icon>
                        <text class="ss-font-24 ss-m-t-16 text-dark">用户协议</text>
                    </view>
                    <!-- change password -->
                    <view
                        class="service-item ss-flex-col ss-col-center ss-m-b-30"
                        @tap="sheep.$router.go('/pages/user/change-password')"
                    >
                        <s-icon name="xiugaimima" size="50" color="#3c9cff"></s-icon>
                        <text class="ss-font-24 ss-m-t-16 text-dark">修改密码</text>
                    </view>
                </view>
            </view>
        </view>
    </s-layout>
</template>

<script setup>
    import { computed } from 'vue';
    import sheep from '@/sheep';

    const userInfo = computed(() => sheep.$store('user').userInfo);

    userInfo.value.nickname = '王某某';
    userInfo.value.mobile = '138****1234';

    function onLogout() {
        uni.showModal({
            title: '提示',
            content: '确定要退出登录吗？',
            success: function (res) {
                if (res.confirm) {
                    sheep.$store('user').logout();
                }
            },
        });
    }

    function onLink(type) {
        let path = '';
        if (type === 'privacy') {
            path = '/pages/public/richtext?id=privacy'; // Adjust path as needed
        } else if (type === 'agreement') {
            path = '/pages/public/richtext?id=agreement'; // Adjust path as needed
        }
        if (path) {
            // sheep.$router.go(path);
        }
    }
</script>

<style lang="scss" scoped>
    .header-box {
        background-color: $white;
        .avatar {
            width: 110rpx;
            height: 110rpx;
            border-radius: 50%;
        }
        .logout-btn {
            width: 160rpx;
            height: 60rpx;
            border: 1rpx solid $gray-c;
            border-radius: 30rpx;
            font-size: 26rpx;
            color: $dark-6;
            align-self: flex-start;
        }
    }
    .service-box {
        .service-item {
            width: 25%;
        }
    }
</style>
