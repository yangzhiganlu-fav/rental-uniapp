<template>
    <s-layout title="编辑租约">
        <view class="lease-rental-info">
            <view class="lease-rental-address">
                <up-icon name="map" size="16" color="#fff"></up-icon>
                <view class="lease-rental-community-name">棕榈湾</view>
                <view class="lease-rental-room-address">3号楼 402室</view>
            </view>
            <view class="lease-rental-name">租客姓名：{{ leaseData.renterName }}</view>
            <view class="lease-rental-phone">
                租客电话：{{ sheep.$helper.maskPhone(leaseData.renterPhone) }}
            </view>
            <view class="btn" @tap="onCallTenant">
                <view class="btn-icon" style="background-color: #4ecdc4">
                    <s-icon name="phone" size="48rpx" color="#fff" />
                </view>
                <view class="btn-text">联系租客</view>
            </view>
        </view>
        <up-form :model="leaseData" label-width="140" class="common-form">
            <date-selector
                :startDateValue="leaseData.startTime"
                :endDateValue="leaseData.endTime"
                :disableStartDate="true"
                @change="handleFormChange"
            />

            <up-form-item label="房屋租金" prop="price" :borderBottom="true">
                <up-input
                    v-model.trim="leaseData.price"
                    placeholder="请输入房屋租金"
                    border="none"
                    :clearable="false"
                    placeholderClass="placeholder-align-right"
                    type="number"
                >
                    <template #suffix>
                        <view class="ss-m-l-4">元</view>
                    </template>
                </up-input>
            </up-form-item>

            <up-form-item label="已收房屋押金" prop="deposit" :borderBottom="true">
                <up-input
                    v-model.trim="leaseData.deposit"
                    placeholder="请输入房屋押金"
                    border="none"
                    :clearable="false"
                    disabled
                    disabledColor="#ffffff"
                    placeholderClass="placeholder-align-right"
                    type="number"
                >
                    <template #suffix>
                        <view class="ss-m-l-4">元</view>
                    </template>
                </up-input>
            </up-form-item>

            <other-fees-selector
                :electricityBill="leaseData.electricityBill"
                :waterBill="leaseData.waterBill"
                :netBill="leaseData.netBill"
                :gasBill="leaseData.gasBill"
                :otherBill="leaseData.otherBill"
                :otherBillDesc="leaseData.otherBillDesc"
                @change="handleFormChange"
            />

            <rent-method-selector :value="leaseData.payMethod" @change="handleFormChange" />

            <supplementary-agreement-selector :value="leaseData.agree" @change="handleFormChange" />

            <up-form-item
                label="其他补充约定"
                prop="otherAgree"
                label-position="top"
                :borderBottom="true"
                class="custom-form-item-label"
            >
                <up-textarea
                    v-model.trim="leaseData.otherAgree"
                    placeholder="请输入其他补充约定内容"
                    height="160rpx"
                ></up-textarea>
            </up-form-item>

            <up-form-item label="租约备注" labelPosition="top" class="custom-form-item-label">
                <up-textarea
                    v-model="leaseData.remark"
                    placeholder="暂无备注"
                    height="160rpx"
                ></up-textarea>
            </up-form-item>

            <view class="img-title">图片凭证</view>

            <s-media-upload
                v-model="leaseData.remarkFileList"
                :maxCount="3"
                :col="3"
                deletable
                class="ss-w-100"
                @upload-success="handleUploadSuccess"
                @delete-item="handleDelete"
                @click-item="handlePreview"
            ></s-media-upload>
        </up-form>

        <up-gap height="130rpx" bgColor="#f6f6f6"></up-gap>

        <su-fixed bottom :bgStyles="{ backgroundColor: '#fff' }">
            <view class="ss-p-x-20 ss-p-y-20">
                <up-button type="primary" :loading="submitLoading" @tap="onSubmit">提交</up-button>
            </view>
        </su-fixed>

        <!-- 终止日选择器 -->
        <up-calendar
            :show="showEndPicker"
            mode="single"
            showLunar
            closeOnClickOverlay
            :monthNum="12"
            :showTitle="false"
            @close="showEndPicker = false"
            @confirm="handleEndConfirm"
        ></up-calendar>
    </s-layout>
</template>

<script setup>
    import sheep from '@/sheep';
    import { ref } from 'vue';
    import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app';
    import DateSelector from './components/leaseFormItem/dateSelector.vue';
    import OtherFeesSelector from './components/leaseFormItem/otherFeesSelector.vue';
    import RentMethodSelector from './components/leaseFormItem/rentMethodSelector.vue';
    import SupplementaryAgreementSelector from './components/leaseFormItem/supplementaryAgreementSelector.vue';
    import LeaseApi from '@/sheep/api/lease';

    const leaseId = ref('');

    const leaseData = ref({
        startTime: '',
        leaseTerm: '',
        endTime: '',
        price: '',
        deposit: '',
        electricityBill: '',
        waterBill: '',
        netBill: '',
        gasBill: '',
        otherBill: '',
        otherBillDesc: '',
        payMethod: '',
        agree: [],
        otherAgree: '',
        remark: '',
        remarkFileList: [],
    });

    onLoad((options) => {
        leaseId.value = options.leaseId || '';
        fetchLeaseDetail();
    });

    onPullDownRefresh(async () => {
        await fetchLeaseDetail();
        uni.stopPullDownRefresh();
    });

    const fetchLeaseDetail = async () => {
        const { code, data } = await LeaseApi.getLeaseDetail({ id: leaseId.value });
        if (code === 0 && data) {
            leaseData.value = {
                ...leaseData.value,
                ...data,
                agree: data.agree ? data.agree.split(',') : [],
            };
        } else {
            leaseData.value = null;
        }
    };

    const showEndPicker = ref(false);

    const handleEndConfirm = (date) => {
        const selectedDate = date[0];
        leaseData.value.endTime = selectedDate;
        showEndPicker.value = false;
    };

    const handleFormChange = (data) => {
        Object.assign(leaseData.value, data);
    };

    const handleUploadSuccess = (file, fileList) => {
        leaseData.value.remarkFileList = fileList;
    };

    const handleDelete = (file, fileList) => {
        leaseData.value.remarkFileList = fileList;
    };

    const handlePreview = (file, fileList, index) => {
        uni.previewImage({
            urls: fileList.map((item) => item.url),
            current: index,
        });
    };

    const onCallTenant = () => {
        if (leaseData.value.tenantPhone) {
            uni.makePhoneCall({
                phoneNumber: leaseData.value.tenantPhone,
            });
        }
    };

    const submitLoading = ref(false);

    const onSubmit = async () => {
        submitLoading.value = true;
        const { code } = await LeaseApi.updateLease({
            id: leaseId.value,
            ...leaseData.value,
            agree: leaseData.value.agree.join(','),
        });
        if (code === 0) {
            uni.showToast({
                title: '租约更新成功',
                icon: 'success',
            });
            sheep.$router.back();
        }
        submitLoading.value = false;
    };
</script>

<style lang="scss" scoped>
    .lease-rental-info {
        position: relative;
        background-color: #be9e89;
        padding: 32rpx;
        color: #ffffff;
        font-size: 28rpx;

        .lease-rental-address {
            display: flex;
            align-items: baseline;
            margin-bottom: 32rpx;

            .lease-rental-community-name {
                margin-left: 12rpx;
                font-size: 32rpx;
            }

            .lease-rental-room-address {
                font-size: 26rpx;
                margin-left: 40rpx;
            }
        }

        .lease-rental-name,
        .lease-rental-phone {
            font-size: 26rpx;
            margin-bottom: 24rpx;
        }

        .btn {
            position: absolute;
            top: 50rpx;
            right: 32rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16rpx;

            .btn-icon {
                width: 90rpx;
                height: 90rpx;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .btn-text {
                color: $white;
                font-size: 26rpx;
            }
        }
    }

    .img-title {
        display: flex;
        align-items: center;
        font-size: 26rpx;
        margin-bottom: 20rpx;
    }
</style>
