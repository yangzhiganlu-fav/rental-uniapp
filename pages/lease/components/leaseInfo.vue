<template>
    <view class="lease-info">
        <!-- 租约基本信息 -->
        <view class="card no-padding">
            <up-cell-group :border="false">
                <up-cell
                    class="grey-label grey-value hiden-line inner-cell"
                    title="租约状态"
                    value="待付款"
                ></up-cell>
                <up-cell class="grey-label grey-value hiden-line inner-cell" title="签约房源">
                    <template #value>
                        <view class="ss-flex-1 text-right">棕榈湾48幢/栋802室E</view>
                    </template>
                </up-cell>
                <up-cell class="grey-label grey-value hiden-line inner-cell" title="起止日期">
                    <template #value>
                        <view class="ss-flex-1 text-right">2025-12-26/2026-12-25</view>
                    </template>
                </up-cell>
                <up-cell
                    class="grey-label grey-value hiden-line inner-cell"
                    title="租期"
                    value="12个月"
                ></up-cell>
                <up-cell class="grey-label grey-value hiden-line inner-cell" title="入住人数">
                    <template #value>
                        <view class="ss-flex-1 text-right">1</view>
                    </template>
                </up-cell>
                <up-cell class="grey-label grey-value inner-cell" title="收款方式">
                    <template #value>
                        <view class="ss-flex-1 text-right">付一押一</view>
                    </template>
                </up-cell>

                <up-cell
                    class="grey-label grey-value hiden-line"
                    title="租金"
                    value="¥920"
                ></up-cell>
                <up-cell
                    class="grey-label grey-value hiden-line inner-cell"
                    title="房屋押金"
                    value="¥920"
                ></up-cell>
            </up-cell-group>
        </view>

        <!-- 其他补充约定 -->
        <view class="card no-padding">
            <up-cell-group :border="false">
                <view class="custom-header">其他补充约定</view>
                <view class="custom-content">无</view>
            </up-cell-group>
        </view>

        <!-- 备注与清单 -->
        <view class="card no-padding">
            <up-cell-group :border="false">
                <up-cell
                    class="grey-label blue-value inner-cell"
                    title="租约备注"
                    value="编辑备注"
                    @click="sheep.$router.go('/pages/lease/leaseRemarkEdit')"
                >
                    <template #right-icon>
                        <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
                    </template>
                </up-cell>
            </up-cell-group>
        </view>

        <!-- 电子合同 -->
        <view class="card no-padding">
            <up-cell-group :border="false">
                <up-cell class="grey-label grey-value hiden-line inner-cell">
                    <template #title>
                        <view style="display: flex; align-items: center">
                            <text style="margin-right: 20rpx">电子合同</text>
                            <uni-icons
                                type="download"
                                size="28"
                                color="#3c9cff"
                                @click="onDownloadContract"
                            ></uni-icons>
                        </view>
                    </template>
                </up-cell>
                <view class="contract-preview">
                    <up-image
                        :src="contractUrl"
                        width="200rpx"
                        height="280rpx"
                        mode="aspectFill"
                        @click="onPreviewContract"
                    ></up-image>
                </view>
            </up-cell-group>
        </view>

        <!-- 底部占位 -->
        <view class="footer-placeholder"></view>

        <!-- 底部按钮 -->
        <view class="footer-btns">
            <up-button type="error" class="ss-flex-1">退房</up-button>
            <up-button type="primary" class="ss-flex-1">编辑租约</up-button>
        </view>
    </view>
</template>

<script setup>
    import sheep from '@/sheep';
    import { ref } from 'vue';

    const contractUrl = ref('https://cdn.uviewui.com/uview/album/1.jpg');

    // 预览图片
    const onPreviewContract = () => {
        uni.previewImage({
            urls: [contractUrl.value],
            current: 0,
        });
    };

    // 下载图片
    const onDownloadContract = () => {
        // #ifdef H5
        const a = document.createElement('a');
        a.href = contractUrl.value;
        a.download = 'contract.jpg';
        a.click();
        // #endif

        // #ifndef H5
        uni.downloadFile({
            url: contractUrl.value,
            success: (res) => {
                if (res.statusCode === 200) {
                    uni.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: function () {
                            uni.showToast({
                                title: '保存成功',
                                icon: 'success',
                            });
                        },
                        fail: function (err) {
                            console.log(err);
                            uni.showToast({
                                title: '保存失败',
                                icon: 'none',
                            });
                        },
                    });
                }
            },
        });
        // #endif
    };
</script>

<style lang="scss" scoped>
    .card {
        background-color: #fff;
        border-radius: 16rpx;
        margin-bottom: 20rpx;
        overflow: hidden; // 确保圆角生效

        &.no-padding {
            padding: 0;
        }
    }

    .custom-header {
        padding: 24rpx 32rpx;
        font-size: 30rpx;
        font-weight: bold;
        color: $dark-3;
    }

    .custom-content {
        padding: 0 32rpx 24rpx;
        font-size: 28rpx;
        color: $dark-6;
    }

    .contract-preview {
        padding: 0 32rpx 32rpx;
        .contract-img {
            width: 200rpx;
            height: 280rpx;
            background-color: #f5f5f5;
            border: 1rpx solid #eee;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999;
            font-size: 24rpx;
        }
    }

    .footer-placeholder {
        height: 120rpx;
        width: 100%;
    }

    .footer-btns {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: #fff;
        padding: 20rpx 30rpx;
        box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
        display: flex;
        gap: 20rpx;
        z-index: 100;
        box-sizing: border-box;
        padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
        padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    }

    // 灰色标签样式
    .grey-label {
        :deep(.u-cell__title-text) {
            color: $dark-6;
        }
    }

    // 灰色值样式
    .grey-value {
        :deep(.u-cell__value) {
            color: $dark-3;
        }
    }

    // 蓝色值样式
    .blue-value {
        :deep(.u-cell__value) {
            color: $blue-light;
        }
    }

    // 隐藏分割线
    .hiden-line {
        :deep(.u-line) {
            display: none;
        }
    }

    // 内部单元格样式调整
    .inner-cell {
        :deep(.u-cell__body) {
            padding: 20rpx 32rpx !important;
        }
    }

    :deep(.u-cell__body__content) {
        flex: none;
    }
</style>
