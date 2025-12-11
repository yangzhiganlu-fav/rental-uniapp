<template>
    <view class="lease-info">
        <up-form labelWidth="140" :border="false" class="common-form">
            <up-form-item label="租约状态">
                <template #right>
                    <view class="form-value">{{ leaseStatusText }}</view>
                </template>
            </up-form-item>
            <up-form-item label="签约房源">
                <template #right>
                    <view class="form-value">{{ leaseData?.title || '-' }}</view>
                </template>
            </up-form-item>
            <up-form-item label="起止日期">
                <template #right>
                    <view class="form-value">{{ leasePeriod }}</view>
                </template>
            </up-form-item>
            <up-form-item label="租期">
                <template #right>
                    <view class="form-value">{{ leaseDuration }}</view>
                </template>
            </up-form-item>
            <up-form-item label="入住人数">
                <template #right>
                    <view class="form-value">{{ leaseData?.renterNum || '-' }}</view>
                </template>
            </up-form-item>
            <up-form-item label="收款方式">
                <template #right>
                    <view class="form-value">{{ payMethodText }}</view>
                </template>
            </up-form-item>
            <up-form-item label="租金">
                <template #right>
                    <view class="form-value">¥{{ leaseData?.price || 0 }}</view>
                </template>
            </up-form-item>
            <up-form-item label="房屋押金">
                <template #right>
                    <view class="form-value">¥{{ leaseData?.deposit || 0 }}</view>
                </template>
            </up-form-item>
            <up-gap height="20rpx" bgColor="#f6f6f6" class="gap"></up-gap>
            <view class="custom-header">其他补充约定</view>
            <view class="custom-content">{{ leaseData?.remark || '无' }}</view>
            <up-gap height="20rpx" bgColor="#f6f6f6" class="gap"></up-gap>
            <up-form-item
                label="租约备注"
                :borderBottom="false"
                @click="sheep.$router.go('/pages/lease/leaseRemarkEdit')"
            >
                <view class="form-value" style="color: #3c9cff">编辑</view>
                <template #right>
                    <uni-icons
                        type="arrowright"
                        size="20"
                        color="#999"
                        style="margin-left: 10rpx"
                    ></uni-icons>
                </template>
            </up-form-item>
            <up-form-item :borderBottom="false">
                <template #label>
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
            </up-form-item>
            <view class="contract-preview" v-if="contractFileList.length > 0">
                <up-image
                    v-for="(file, index) in contractFileList"
                    :key="index"
                    :src="file.url"
                    width="200rpx"
                    height="280rpx"
                    mode="aspectFill"
                    @click="onPreviewContract(index)"
                    style="margin-right: 20rpx"
                ></up-image>
            </view>
            <view class="contract-preview" v-else>
                <view class="no-contract">暂无合同文件</view>
            </view>
        </up-form>

        <up-gap height="130rpx" bgColor="#f6f6f6"></up-gap>

        <!-- 底部按钮 -->
        <view class="footer-btns">
            <up-button type="error" class="ss-flex-1">退房</up-button>
            <up-button type="primary" class="ss-flex-1">编辑租约</up-button>
        </view>
    </view>
</template>

<script setup>
    import sheep from '@/sheep';
    import { ref, computed } from 'vue';

    const props = defineProps({
        leaseData: {
            type: Object,
            default: () => null,
        },
    });

    // 租约状态文本
    const leaseStatusText = computed(() => {
        if (!props.leaseData) return '-';
        const statusMap = {
            0: '待签署',
            1: '租约进行中',
            2: '合同终止',
        };
        return statusMap[props.leaseData.status] || '-';
    });

    // 支付方式文本
    const payMethodText = computed(() => {
        if (!props.leaseData?.payMethod) return '-';
        const payMethodMap = {
            1: '押一付一',
            2: '押一付二',
            3: '押一付三',
            4: '押二付一',
            5: '押二付二',
            6: '押二付三',
        };
        return payMethodMap[props.leaseData.payMethod] || '-';
    });

    // 租期
    const leasePeriod = computed(() => {
        if (!props.leaseData?.startTime || !props.leaseData?.endTime) return '-';
        return `${props.leaseData.startTime}/${props.leaseData.endTime}`;
    });

    // 租期时长
    const leaseDuration = computed(() => {
        if (!props.leaseData?.startTime || !props.leaseData?.endTime) return '-';
        const start = new Date(props.leaseData.startTime);
        const end = new Date(props.leaseData.endTime);
        const months =
            (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        return `${months}个月`;
    });

    // 合同文件列表
    const contractFileList = computed(() => {
        return props.leaseData?.contractFileList || [];
    });

    const contractUrl = ref('https://cdn.uviewui.com/uview/album/1.jpg');

    // 预览图片
    const onPreviewContract = (index = 0) => {
        if (contractFileList.value.length === 0) {
            uni.showToast({
                title: '暂无合同文件',
                icon: 'none',
            });
            return;
        }
        const urls = contractFileList.value.map((file) => file.url);
        uni.previewImage({
            urls: urls,
            current: index,
        });
    };

    // 下载图片
    const onDownloadContract = () => {
        if (contractFileList.value.length === 0) {
            uni.showToast({
                title: '暂无合同文件',
                icon: 'none',
            });
            return;
        }

        // 如果有多个文件，下载第一个
        const downloadUrl = contractFileList.value[0].url;

        // #ifdef H5
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'contract.jpg';
        a.click();
        // #endif

        // #ifndef H5
        uni.downloadFile({
            url: downloadUrl,
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
    .custom-header {
        padding: 24rpx 0;
        font-size: 28rpx;
        font-weight: bold;
        color: $dark-3;
    }

    .custom-content {
        padding: 0 0 24rpx;
        font-size: 24rpx;
        color: $dark-3;
    }

    .contract-preview {
        padding: 0 32rpx 32rpx;
        display: flex;
        flex-wrap: wrap;

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

        .no-contract {
            width: 100%;
            padding: 40rpx 0;
            text-align: center;
            color: #999;
            font-size: 28rpx;
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

    .form-value {
        color: $dark-3;
        text-align: right;
    }

    :deep(.u-form-item__body) {
        padding: 20rpx 0 !important;
    }

    :deep(.u-form-item__body__right__content__slot) {
        justify-content: flex-end;
    }

    .gap {
        margin: 0 -24rpx;
    }
</style>
