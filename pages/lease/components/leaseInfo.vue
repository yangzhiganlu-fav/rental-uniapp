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
                    <view class="form-value">{{ leaseData?.rentMonth || '-' }}</view>
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
            <up-form-item label="其他补充约定" labelPosition="top" class="custom-form-item-label">
                <up-textarea
                    v-model="otherBillDesc"
                    placeholder="暂无补充约定"
                    height="160rpx"
                    :disabled="true"
                ></up-textarea>
            </up-form-item>
            <up-gap height="20rpx" bgColor="#f6f6f6" class="gap"></up-gap>
            <up-form-item label="租约备注" labelPosition="top" class="custom-form-item-label">
                <up-textarea
                    v-model="textRemark"
                    placeholder="暂无备注"
                    height="160rpx"
                    :disabled="true"
                ></up-textarea>
            </up-form-item>
            <view class="img-title">图片凭证</view>
            <view class="img-preview" v-if="remarkImageList.length > 0">
                <up-image
                    v-for="(file, index) in remarkImageList"
                    :key="index"
                    :src="file.url"
                    width="200rpx"
                    height="280rpx"
                    mode="aspectFill"
                    class="ss-m-r-20"
                    @click="onPreviewRemarkImage(index)"
                ></up-image>
            </view>
            <view class="img-preview" v-else>
                <view class="no-img">暂无图片凭证</view>
            </view>
            <view class="img-title">
                <text class="ss-m-r-20">电子合同</text>
                <uni-icons
                    type="download"
                    size="24"
                    color="#3c9cff"
                    @click="onDownloadContract"
                ></uni-icons>
            </view>
            <view class="img-preview" v-if="contractFileList.length > 0">
                <up-image
                    v-for="(file, index) in contractFileList"
                    :key="index"
                    :src="file.url"
                    width="200rpx"
                    height="280rpx"
                    mode="aspectFill"
                    class="ss-m-r-20"
                    @click="onPreviewContract(index)"
                ></up-image>
            </view>
            <view class="img-preview" v-else>
                <view class="no-img">暂无合同文件</view>
            </view>
        </up-form>

        <up-gap height="130rpx" bgColor="#f6f6f6" v-if="leaseData?.status !== 2"></up-gap>

        <!-- 底部按钮 -->
        <view class="footer-btns" v-if="leaseData?.status === 0">
            <!-- 状态0：待签署 - 签署同意和签署拒绝按钮 -->
            <up-button type="error" :loading="signLoading" class="ss-flex-1" @click="handleSign(2)">
                签署拒绝
            </up-button>
            <up-button
                type="success"
                :loading="signLoading"
                class="ss-flex-1"
                @click="handleSign(1)"
            >
                签署同意
            </up-button>
        </view>

        <view class="footer-btns" v-else-if="leaseData?.status === 1">
            <!-- 状态1：已签署 - 退房、编辑租约按钮 -->
            <up-button
                type="error"
                :loading="checkOutLoading"
                class="ss-flex-1"
                @click="handleCheckOut"
            >
                退房
            </up-button>
            <up-button type="primary" class="ss-flex-1" @click="handleEditLease">
                编辑租约
            </up-button>
        </view>
    </view>
</template>

<script setup>
    import sheep from '@/sheep';
    import { ref, computed, watch } from 'vue';
    import LeaseApi from '@/sheep/api/lease';

    const props = defineProps({
        leaseData: {
            type: Object,
            default: () => null,
        },
    });

    const checkOutLoading = ref(false);

    // 退房操作
    const handleCheckOut = async () => {
        checkOutLoading.value = true;
        const { code } = await LeaseApi.checkOutLease({ id: props.leaseData.id });
        if (code === 0) {
            uni.showToast({
                title: '退房成功',
                icon: 'success',
            });
            sheep.$router.back();
        }
        checkOutLoading.value = false;
    };

    const signLoading = ref(false);

    // 签署租约
    const handleSign = async (status) => {
        signLoading.value = true;
        const { code } = await LeaseApi.signLease({
            id: props.leaseData.id,
            status, // 状态 1：通过，2：拒绝
        });
        if (code === 0) {
            uni.showToast({
                title: status === 1 ? '签署同意成功' : '签署拒绝成功',
                icon: 'success',
            });
            sheep.$router.back();
        }
        signLoading.value = false;
    };

    // 其他补充约定
    const otherBillDesc = ref(props.leaseData?.otherBillDesc || '');

    // 文字备注
    const textRemark = ref(props.leaseData?.remark || '');

    // 图片备注列表
    const imageRemarkList = ref(props.leaseData?.remarkFileList || []);

    // 监听 leaseData 变化，获取初始化值后停止监控
    watch(
        () => props.leaseData,
        (newData) => {
            if (newData) {
                otherBillDesc.value = newData.otherBillDesc || '';
                textRemark.value = newData.remark || '';
                imageRemarkList.value = newData.remarkFileList || [];
            }
        },
        { immediate: true },
    );

    // 租约状态文本
    const leaseStatusText = computed(() => {
        if (!props.leaseData) return '-';
        const statusMap = {
            0: '待签署',
            1: '已签署',
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

    // 备注图片列表
    const remarkImageList = computed(() => {
        return props.leaseData?.remarkFileList || [];
    });

    const onPreviewRemarkImage = (index = 0) => {
        const urls = remarkImageList.value.map((file) => file.url);
        uni.previewImage({
            urls: urls,
            current: index,
        });
    };

    // 合同文件列表
    const contractFileList = computed(() => {
        return props.leaseData?.contractFileList || [];
    });

    // 预览图片
    const onPreviewContract = (index = 0) => {
        const urls = contractFileList.value.map((file) => file.url);
        uni.previewImage({
            urls: urls,
            current: index,
        });
    };

    // 下载全部合同文件
    const onDownloadContract = () => {
        sheep.$helper.downloadImagesToPhotosAlbum({
            urls: contractFileList.value.map((file) => file.url),
        });
    };

    const handleEditLease = () => {
        sheep.$router.go('/pages/lease/leaseEdit', {
            leaseId: props.leaseData.id,
        });
    };
</script>

<style lang="scss" scoped>
    .img-preview {
        padding-bottom: 24rpx;
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
            font-size: 26rpx;
        }

        .no-img {
            width: 100%;
            padding: 40rpx 0;
            color: #999;
            font-size: 26rpx;
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
        color: $dark-6;
        text-align: right;
        font-size: 26rpx;
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

    :deep(.u-form-item__body__left__content__label) {
        color: $dark-6;
    }

    .img-title {
        display: flex;
        align-items: center;
        font-size: 26rpx;
        color: $dark-6;
        margin-bottom: 20rpx;
    }
</style>
