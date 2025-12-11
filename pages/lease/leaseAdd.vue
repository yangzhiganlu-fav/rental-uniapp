<template>
    <s-layout>
        <!-- 顶部导航栏中间部分 -->
        <template #center>
            <view class="ss-flex ss-flex-col ss-items-center">
                <view class="title">录入租约</view>
                <view class="subtitle">{{ title }}</view>
            </view>
        </template>

        <up-form :model="formData" label-width="120" errorType="toast" class="common-form">
            <up-form-item label="手机号码" prop="renterPhone" :borderBottom="true">
                <up-input
                    v-model.trim="formData.renterPhone"
                    placeholder="请输入11位手机号码"
                    :clearable="false"
                    border="none"
                    placeholderClass="placeholder-align-right"
                    type="number"
                />
            </up-form-item>

            <up-form-item label="租客姓名" prop="renterName" class="ss-m-t-20" :borderBottom="true">
                <up-input
                    v-model.trim="formData.renterName"
                    placeholder="请输入租客姓名"
                    border="none"
                    :clearable="false"
                    placeholderClass="placeholder-align-right"
                />
            </up-form-item>

            <gender-selector :value="formData.renterSex" @change="handleFormChange" />

            <up-form-item label="证件号码" prop="idNumber" :borderBottom="true">
                <up-input
                    v-model.trim="formData.idNumber"
                    placeholder="请输入证件号码"
                    border="none"
                    :clearable="false"
                    placeholderClass="placeholder-align-right"
                />
            </up-form-item>

            <up-form-item label="证件照片(选填)" :borderBottom="true">
                <s-media-upload
                    v-model="idCardFileList"
                    :maxCount="3"
                    :col="3"
                    deletable
                    class="ss-w-100"
                    @upload-success="handleUploadSuccess"
                    @delete-item="handleDelete"
                    @click-item="handlePreview"
                ></s-media-upload>
            </up-form-item>

            <up-form-item label="入住人数" prop="renterNum" :borderBottom="true" class="renterNum">
                <uni-number-box v-model="formData.renterNum" :min="1" />
            </up-form-item>

            <up-gap height="16rpx" bgColor="#f6f6f6" class="gap"></up-gap>

            <date-selector
                :startDateValue="formData.startTime"
                :endDateValue="formData.endTime"
                label="起租日"
                placeholder="请选择起租日"
                :showShortcut="true"
                :borderBottom="false"
                @change="handleFormChange"
            />

            <rent-method-selector :value="formData.payMethod" @change="handleFormChange" />

            <up-form-item label="房屋租金" prop="price" :borderBottom="true">
                <up-input
                    v-model.trim="formData.price"
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

            <up-form-item label="房屋押金" prop="deposit" :borderBottom="true">
                <up-input
                    v-model.trim="formData.deposit"
                    placeholder="请输入房屋押金"
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

            <other-fees-selector
                :electricityBill="formData.electricityBill"
                :waterBill="formData.waterBill"
                :netBill="formData.netBill"
                :gasBill="formData.gasBill"
                :otherBill="formData.otherBill"
                :otherBillDesc="formData.otherBillDesc"
                @change="handleFormChange"
            />

            <pay-day-selector :value="formData.payDateBefore" @change="handleFormChange" />

            <up-form-item label="纸质合同(可选)" prop="contractFileList" :borderBottom="true">
                <s-media-upload
                    v-model="contractFileList"
                    :maxCount="3"
                    :col="3"
                    deletable
                    class="ss-w-100"
                    @upload-success="handleContractUploadSuccess"
                    @delete-item="handleContractDelete"
                    @click-item="handleContractPreview"
                ></s-media-upload>
            </up-form-item>

            <supplementary-agreement-selector :value="formData.agree" @change="handleFormChange" />

            <up-form-item
                label="其他补充约定"
                prop="otherAgree"
                label-position="top"
                :borderBottom="true"
                class="other-supplementary-agreement"
            >
                <up-textarea
                    v-model.trim="formData.otherAgree"
                    placeholder="请输入其他补充约定内容"
                    height="300rpx"
                ></up-textarea>
            </up-form-item>
        </up-form>

        <up-gap height="140rpx" bgColor="#f6f6f6"></up-gap>

        <su-fixed bottom :bgStyles="{ backgroundColor: '#fff' }">
            <view class="ss-p-x-20 ss-p-y-20">
                <up-button type="primary" size="normal" @tap="onSubmit"> 提交 </up-button>
            </view>
        </su-fixed>
    </s-layout>
</template>

<script setup>
    import { ref } from 'vue';
    import { onLoad } from '@dcloudio/uni-app';
    import GenderSelector from './components/leaseFormItem/genderSelector.vue';
    import DateSelector from './components/leaseFormItem/dateSelector.vue';
    import RentMethodSelector from './components/leaseFormItem/rentMethodSelector.vue';
    import OtherFeesSelector from './components/leaseFormItem/otherFeesSelector.vue';
    import PayDaySelector from './components/leaseFormItem/payDaySelector.vue';
    import SupplementaryAgreementSelector from './components/leaseFormItem/supplementaryAgreementSelector.vue';
    import LeaseApi from '@/sheep/api/lease';
    import sheep from '@/sheep';

    const title = ref('');

    onLoad((options) => {
        formData.value.roomId = options.id || '';
        title.value = `${options.communityName || ''}${options.blockNumber || ''}号楼${
            options.unitNumber || ''
        }室${options.houseNo || ''}`;
    });

    const formData = ref({
        roomId: '',
        renterPhone: '',
        renterName: '',
        renterSex: 0,
        idNumber: '',
        idCardFileList: [],
        renterNum: 1,
        startTime: '',
        endTime: '',
        payMethod: '',
        price: '',
        deposit: '',
        payDay: '',
        agree: [],
        otherAgree: '',
        contractFileList: [],
        // 各类费用
        electricityBill: '',
        waterBill: '',
        netBill: '',
        gasBill: '',
        otherBill: '',
        otherBillDesc: '',
    });

    // 统一的表单变更处理函数
    const handleFormChange = (data) => {
        Object.assign(formData.value, data);
    };

    const idCardFileList = ref([]);

    const handleUploadSuccess = (newItems) => {
        idCardFileList.value.push(...newItems);
        formData.value.idCardFileList = idCardFileList.value;
    };

    const handlePreview = ({ index }) => {
        const urls = idCardFileList.value.map((item) => item.url);
        uni.previewImage({
            urls,
            current: urls[index],
        });
    };

    const handleDelete = (index) => {
        idCardFileList.value.splice(index, 1);
    };

    const contractFileList = ref([]);

    const handleContractUploadSuccess = (newItems) => {
        contractFileList.value.push(...newItems);
        formData.value.contractFileList = contractFileList.value;
    };

    const handleContractPreview = ({ index }) => {
        const urls = contractFileList.value.map((item) => item.url);
        uni.previewImage({
            urls,
            current: urls[index],
        });
    };

    const handleContractDelete = (index) => {
        contractFileList.value.splice(index, 1);
    };

    const onSubmit = async () => {
        const isValid = validateFields();
        if (!isValid) return;
        const params = {
            ...formData.value,
            agree: formData.value.agree.join(','),
        };
        const { code } = await LeaseApi.addLease(params);
        if (code === 0) {
            uni.showToast({
                title: '租约录入成功',
                icon: 'success',
            });
            sheep.$router.back();
        }
    };

    const validateFields = () => {
        if (!formData.value.renterPhone) {
            uni.showToast({
                title: '请输入租客手机号码',
                icon: 'none',
            });
            return false;
        }
        if (!formData.value.renterName) {
            uni.showToast({
                title: '请输入租客姓名',
                icon: 'none',
            });
            return false;
        }
        if (formData.value.renterSex === '') {
            uni.showToast({
                title: '请选择租客性别',
                icon: 'none',
            });
            return false;
        }
        if (!formData.value.idNumber) {
            uni.showToast({
                title: '请输入证件号码',
                icon: 'none',
            });
            return false;
        }
        if (!formData.value.renterNum || formData.value.renterNum <= 0) {
            uni.showToast({
                title: '请输入正确的入住人数',
                icon: 'none',
            });
            return false;
        }
        if (!formData.value.startTime) {
            uni.showToast({
                title: '请选择起租日',
                icon: 'none',
            });
            return false;
        }
        if (!formData.value.endTime) {
            uni.showToast({
                title: '请选择终止日',
                icon: 'none',
            });
            return false;
        }
        if (!formData.value.payMethod) {
            uni.showToast({
                title: '请选择租赁方式',
                icon: 'none',
            });
            return false;
        }
        if (!formData.value.price) {
            uni.showToast({
                title: '请输入房屋租金',
                icon: 'none',
            });
            return false;
        }
        if (!formData.value.deposit) {
            uni.showToast({
                title: '请输入房屋押金',
                icon: 'none',
            });
            return false;
        }
        if (!formData.value.payDateBefore) {
            uni.showToast({
                title: '请选择每月交租日',
                icon: 'none',
            });
            return false;
        }
        return true;
    };
</script>

<style lang="scss" scoped>
    .title {
        font-size: 28rpx;
        font-weight: bold;
        color: $dark-3;
    }

    .subtitle {
        font-size: 22rpx;
        color: $dark-9;
        margin-top: 8rpx;
    }

    .gap {
        margin: 0 -24rpx;
    }

    .renterNum {
        :deep(.u-form-item__body__right__content__slot) {
            justify-content: flex-end;
        }

        :deep(.uni-input-input) {
            text-align: center;
        }
    }

    .other-supplementary-agreement {
        :deep(.u-form-item__body__left) {
            margin-bottom: 20rpx !important;
        }
    }
</style>
