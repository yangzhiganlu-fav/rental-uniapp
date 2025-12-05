<template>
    <s-layout>
        <!-- 顶部导航栏中间部分 -->
        <template #center>
            <view class="ss-flex ss-flex-col ss-items-center">
                <view class="title">录入租约</view>
                <view class="subtitle">阳光小区9999号楼99室1室</view>
            </view>
        </template>

        <scroll-view scroll-y class="ss-flex-1 ss-min-h-0">
            <up-form
                ref="leaseForm"
                :model="formData"
                :rules="rules"
                label-width="120"
                errorType="toast"
                class="ss-m-t-20 ss-p-b-140 submit-form"
            >
                <up-form-item label="手机号码" prop="phoneNumber">
                    <up-input
                        v-model.trim="formData.phoneNumber"
                        placeholder="请输入11位手机号码"
                        border="none"
                        :clearable="false"
                        placeholderClass="placeholder-align-right"
                    />
                </up-form-item>

                <up-form-item label="租客姓名" prop="name" class="ss-m-t-20">
                    <up-input
                        v-model.trim="formData.name"
                        placeholder=""
                        border="none"
                        :clearable="false"
                        placeholderClass="placeholder-align-right"
                    />
                </up-form-item>

                <up-form-item label="租客性别" prop="gender" @click="showGenderActionSheet">
                    <up-input
                        v-model="formData.gender"
                        disabled
                        disabledColor="#ffffff"
                        placeholder="请选择性别"
                        border="none"
                        placeholderClass="placeholder-align-right"
                    ></up-input>
                    <template #right>
                        <up-icon name="arrow-right" class="ss-p-l-20"></up-icon>
                    </template>
                </up-form-item>

                <up-form-item label="证件类型" prop="idType" @click="showIdTypeActionSheet">
                    <up-input
                        v-model="formData.idType"
                        disabled
                        disabledColor="#ffffff"
                        placeholder="请选择证件类型"
                        border="none"
                        placeholderClass="placeholder-align-right"
                    ></up-input>
                    <template #right>
                        <up-icon name="arrow-right" class="ss-p-l-20"></up-icon>
                    </template>
                </up-form-item>

                <up-form-item label="证件号码" prop="idNumber">
                    <up-input
                        v-model.trim="formData.idNumber"
                        placeholder="请输入证件号码"
                        border="none"
                        :clearable="false"
                        placeholderClass="placeholder-align-right"
                    />
                </up-form-item>

                <up-form-item label="证件照片(选填)" prop="idNumber">
                    <s-media-upload
                        v-model="fileList"
                        :maxCount="3"
                        :col="3"
                        deletable
                        class="ss-w-100"
                        @upload-success="handleUploadSuccess"
                        @delete-item="handleDelete"
                        @click-item="handlePreview"
                    ></s-media-upload>
                </up-form-item>

                <up-form-item label="入住人数" prop="numberOfTenants">
                    <uni-number-box v-model="formData.numberOfTenants" />
                </up-form-item>

                <up-form-item
                    label="起租日"
                    prop="startDate"
                    class="ss-m-t-20 border-none"
                    @click="showStartDatePicker = true"
                >
                    <up-input
                        v-model="formData.startDate"
                        disabled
                        disabledColor="#ffffff"
                        placeholder="请选择起租日"
                        border="none"
                        placeholderClass="placeholder-align-right"
                    ></up-input>
                    <template #right>
                        <up-icon name="arrow-right" class="ss-p-l-20"></up-icon>
                    </template>
                </up-form-item>

                <up-form-item>
                    <uni-data-checkbox
                        mode="tag"
                        v-model="endDateShortcut"
                        :localdata="endDateShortcutOptions"
                        @change="onEndDateShortcutChange"
                    ></uni-data-checkbox>
                </up-form-item>

                <up-form-item label="终止日" prop="endDate" @click="showEndDatePicker = true">
                    <up-input
                        v-model="formData.endDate"
                        disabled
                        disabledColor="#ffffff"
                        placeholder="请选择终止日"
                        border="none"
                        placeholderClass="placeholder-align-right"
                    ></up-input>
                    <template #right>
                        <up-icon name="arrow-right" class="ss-p-l-20"></up-icon>
                    </template>
                </up-form-item>

                <up-form-item
                    label="收租方式"
                    prop="rentCollectionMethod"
                    @click="showRentCollectionMethodPicker = true"
                >
                    <up-input
                        v-model="formData.rentCollectionMethod"
                        disabled
                        disabledColor="#ffffff"
                        placeholder="请选择收租方式日"
                        border="none"
                        placeholderClass="placeholder-align-right"
                    ></up-input>
                    <template #right>
                        <up-icon name="arrow-right" class="ss-p-l-20"></up-icon>
                    </template>
                </up-form-item>

                <up-form-item label="房屋租金" prop="houseRent">
                    <up-input
                        v-model.trim="formData.houseRent"
                        placeholder="请输入租金"
                        border="none"
                        :clearable="false"
                        placeholderClass="placeholder-align-right"
                        type="number"
                    >
                        <template #suffix>
                            <view class="ss-m-l-4 ss-font-28">元</view>
                        </template>
                    </up-input>
                </up-form-item>

                <up-form-item label="房屋押金" prop="houseDeposit">
                    <up-input
                        v-model.trim="formData.houseDeposit"
                        placeholder="请输入金额"
                        border="none"
                        :clearable="false"
                        placeholderClass="placeholder-align-right"
                        type="number"
                    />
                </up-form-item>

                <up-form-item label="其他费用" prop="otherFees">
                    <up-button
                        type="warning"
                        size="small"
                        icon="plus"
                        plain
                        iconColor="#ff9900"
                        color="#ff9900"
                        :customStyle="{ width: '260rpx', marginLeft: '0', marginRight: '0' }"
                        @tap="showOtherFeesPicker = true"
                    >
                        添加费用
                    </up-button>
                </up-form-item>

                <template v-for="(group, key) in otherFeesGroups" :key="key">
                    <template v-for="(item, index) in group.items" :key="item.id">
                        <up-form-item :label="index === 0 ? group.label : ' '">
                            <view class="ss-flex ss-items-center ss-w-100">
                                <text class="ss-m-r-20">{{ item.name }}</text>
                                <up-input
                                    v-model="item.amount"
                                    placeholder="请输入金额"
                                    border="none"
                                    type="number"
                                    inputAlign="right"
                                    placeholderClass="placeholder-align-right"
                                ></up-input>
                                <up-icon
                                    name="close-circle"
                                    color="#ccc"
                                    class="ss-m-l-20"
                                    @click="removeOtherFeesItem(key, index)"
                                ></up-icon>
                            </view>
                        </up-form-item>
                    </template>
                </template>

                <up-form-item label="交租日设置" prop="payDay" @click="showPayDayPicker = true">
                    <up-input
                        v-model="formData.payDay"
                        disabled
                        disabledColor="#ffffff"
                        placeholder="请选择交租日"
                        border="none"
                        placeholderClass="placeholder-align-right"
                    ></up-input>
                    <template #right>
                        <up-icon name="arrow-right" class="ss-p-l-20"></up-icon>
                    </template>
                </up-form-item>

                <up-form-item label="纸质合同(可选)" prop="contractFileList">
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

                <up-form-item
                    label="补充约定"
                    prop="supplementaryAgreement"
                    class="border-none"
                    @click="showSupplementaryAgreementPicker = true"
                >
                    <template #right>
                        <up-icon name="arrow-right" class="ss-p-l-20"></up-icon>
                    </template>
                </up-form-item>

                <up-form-item label-width="0">
                    <view class="custom-textarea">
                        <view
                            v-for="(option, index) in supplementaryAgreementShowList"
                            :key="index"
                            class="textarea-item"
                        >
                            {{ option.name }}
                        </view>
                    </view>
                </up-form-item>

                <up-form-item
                    label="其他补充约定"
                    prop="otherSupplementaryAgreement"
                    label-position="top"
                >
                    <up-textarea
                        v-model.trim="formData.otherSupplementaryAgreement"
                        placeholder="请输入其他补充约定内容"
                        height="300rpx"
                    ></up-textarea>
                </up-form-item>
            </up-form>
        </scroll-view>

        <su-fixed bottom :bgStyles="{ backgroundColor: '#fff' }">
            <view class="ss-p-x-20 ss-p-y-20">
                <up-button
                    type="primary"
                    size="normal"
                    @tap="
                        leaseForm.validate(() => {
                            /* 提交表单逻辑 */
                        })
                    "
                >
                    提交
                </up-button>
            </view>
        </su-fixed>

        <up-action-sheet
            :show="showGender"
            :actions="actions"
            title="请选择性别"
            @close="showGender = false"
            @select="genderSelect"
        >
        </up-action-sheet>

        <up-action-sheet
            :show="showIdType"
            :actions="idTypeOptions"
            title="请选择证件类型"
            @close="showIdType = false"
            @select="idTypeSelect"
        >
        </up-action-sheet>

        <up-calendar
            :show="showStartDatePicker"
            mode="single"
            showLunar
            closeOnClickOverlay
            :monthNum="12"
            :showTitle="false"
            @close="showStartDatePicker = false"
            @confirm="onStartDateConfirm"
        ></up-calendar>

        <up-calendar
            :show="showEndDatePicker"
            mode="single"
            showLunar
            closeOnClickOverlay
            :monthNum="12"
            :showTitle="false"
            @close="showEndDatePicker = false"
            @confirm="onEndDateConfirm"
        ></up-calendar>

        <up-action-sheet
            :show="showRentCollectionMethodPicker"
            :actions="rentCollectionMethodOptions"
            title="请选择收租方式"
            @close="showRentCollectionMethodPicker = false"
            @select="rentCollectionMethodSelect"
        >
        </up-action-sheet>

        <up-picker
            :show="showOtherFeesPicker"
            :columns="otherFeeColumns"
            keyName="label"
            valueName="value"
            @confirm="onOtherFeesConfirm"
            @cancel="showOtherFeesPicker = false"
            @close="showOtherFeesPicker = false"
        ></up-picker>

        <up-picker
            :show="showPayDayPicker"
            :columns="payDayColumns"
            keyName="label"
            valueName="value"
            @confirm="onPayDayConfirm"
            @cancel="showPayDayPicker = false"
            @close="showPayDayPicker = false"
            @change="onPayDayChange"
        ></up-picker>

        <s-select-popup
            v-model:show="showSupplementaryAgreementPicker"
            title="补充约定"
            :list="supplementaryAgreementOptions"
            :default-values="supplementaryAgreementSelected"
            value-key="value"
            label-key="name"
            @confirm="onSupplementaryAgreementConfirm"
        >
        </s-select-popup>
    </s-layout>
</template>

<script setup>
    import { ref, reactive, computed } from 'vue';

    const leaseForm = ref(null);

    const formData = ref({
        phoneNumber: '',
        name: '',
        gender: '',
        idType: '',
        idNumber: '',
        fileList: [],
        numberOfTenants: 1,
        startDate: '',
        endDate: '',
        rentCollectionMethod: '',
        houseRent: '',
        houseDeposit: '',
        otherFees: [],
        payDay: '',
        supplementaryAgreement: '',
        otherSupplementaryAgreement: '',
        contractFileList: [],
    });

    const rules = {
        phoneNumber: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入有效的11位手机号码',
                trigger: 'blur',
            },
        ],
        name: [{ required: true, message: '请输入租客姓名', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择租客性别', trigger: 'change' }],
        idType: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
        idNumber: [{ required: true, message: '请输入证件号码', trigger: 'blur' }],
        numberOfTenants: [{ required: true, message: '请输入入住人数', trigger: 'change' }],
        startDate: [{ required: true, message: '请选择起租日', trigger: 'change' }],
        endDate: [{ required: true, message: '请选择终止日', trigger: 'change' }],
        rentCollectionMethod: [{ required: true, message: '请选择收租方式', trigger: 'change' }],
        houseRent: [{ required: true, message: '请输入房屋租金', trigger: 'blur' }],
        houseDeposit: [{ required: true, message: '请输入房屋押金', trigger: 'blur' }],
        payDay: [{ required: true, message: '请选择交租日', trigger: 'change' }],
    };

    const showGender = ref(false);
    const actions = [
        { name: '男', value: 'male' },
        { name: '女', value: 'female' },
    ];

    const showGenderActionSheet = () => {
        showGender.value = true;
        uni.hideKeyboard();
    };

    const genderSelect = (action) => {
        formData.value.gender = action.name;
        showGender.value = false;
    };

    const showIdType = ref(false);
    const idTypeOptions = ref([
        { name: '中国居民身份证', value: 'id_card' },
        { name: '护照及港澳台同胞证', value: 'passport' },
        { name: '驾照', value: 'driver_license' },
        { name: '户口簿', value: 'hukou' },
    ]);

    const showIdTypeActionSheet = () => {
        showIdType.value = true;
        uni.hideKeyboard();
    };

    const idTypeSelect = (action) => {
        formData.value.idType = action.name;
        showIdType.value = false;
    };

    const fileList = ref([]);

    const handleUploadSuccess = (newItems) => {
        fileList.value.push(...newItems);
        formData.value.fileList = fileList.value;
    };

    const handlePreview = ({ index }) => {
        const urls = fileList.value.map((item) => item.url);
        uni.previewImage({
            urls,
            current: urls[index],
        });
    };

    const handleDelete = (index) => {
        fileList.value.splice(index, 1);
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

    const showStartDatePicker = ref(false);

    const onStartDateConfirm = (date) => {
        formData.value.startDate = date[0];
        endDateShortcut.value = '';
        showStartDatePicker.value = false;
    };

    const endDateShortcut = ref('');

    const endDateShortcutOptions = ref([
        { text: '1年', value: 12 },
        { text: '6个月', value: 6 },
        { text: '3个月', value: 3 },
        { text: '1个月', value: 1 },
    ]);

    const onEndDateShortcutChange = () => {
        if (!formData.value.startDate) {
            endDateShortcut.value = '';
            uni.showToast({
                title: '请先选择起租日',
                icon: 'none',
            });
            return;
        }
        const monthsToAdd = endDateShortcut.value;
        const startDate = new Date(formData.value.startDate);
        const endDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth() + monthsToAdd,
            startDate.getDate(),
        );
        const year = endDate.getFullYear();
        const month = String(endDate.getMonth() + 1).padStart(2, '0');
        const day = String(endDate.getDate()).padStart(2, '0');
        formData.value.endDate = `${year}-${month}-${day}`;
    };

    const showEndDatePicker = ref(false);

    const onEndDateConfirm = (date) => {
        formData.value.endDate = date[0];
        endDateShortcut.value = '';
        showEndDatePicker.value = false;
    };

    const showRentCollectionMethodPicker = ref(false);

    const rentCollectionMethodOptions = ref([
        { name: '付三押一', value: 'pay_three_deposit_one' },
        { name: '付一押三', value: 'pay_one_deposit_three' },
        { name: '付二押三', value: 'pay_two_deposit_three' },
        { name: '付二押一', value: 'pay_two_deposit_one' },
        { name: '付一押一', value: 'pay_one_deposit_one' },
        { name: '付二押二', value: 'pay_two_deposit_two' },
        { name: '付一押二', value: 'pay_one_deposit_two' },
        { name: '付三押二', value: 'pay_three_deposit_two' },
    ]);

    const rentCollectionMethodSelect = (action) => {
        formData.value.rentCollectionMethod = action.name;
        showRentCollectionMethodPicker.value = false;
    };

    const showOtherFeesPicker = ref(false);

    const otherFeeColumns = reactive([
        [
            { label: '每月固定费用', value: 'monthly' },
            { label: '一次性费用', value: 'one_time' },
            { label: '抵扣费用', value: 'deduction' },
        ],
        [
            { label: '房间电费', value: 'room_electricity' },
            { label: '公用电费', value: 'public_electricity' },
            { label: '水费', value: 'water' },
            { label: '物业费', value: 'property_management' },
            { label: '网费', value: 'internet' },
            { label: '燃气费', value: 'gas' },
            { label: '其他', value: 'other' },
        ],
    ]);

    const otherFeesGroups = reactive({
        monthly: { label: '每月固定费用', items: [] },
        one_time: { label: '一次性费用', items: [] },
        deduction: { label: '抵扣费用', items: [] },
    });

    const onOtherFeesConfirm = (e) => {
        const { value } = e;
        const typeKey = value[0].value;
        const itemName = value[1].label;

        const exists = otherFeesGroups[typeKey].items.some((item) => item.name === itemName);
        if (exists) {
            uni.showToast({
                title: '该费用项已添加',
                icon: 'none',
            });
            return;
        }

        otherFeesGroups[typeKey].items.push({
            name: itemName,
            amount: '',
            id: Date.now(),
        });
        showOtherFeesPicker.value = false;
    };

    const removeOtherFeesItem = (groupKey, index) => {
        otherFeesGroups[groupKey].items.splice(index, 1);
    };

    const showPayDayPicker = ref(false);

    const payDayColumns = reactive([
        [
            { label: '每期提前', value: 'advance' },
            { label: '每期延后', value: 'delay' },
            { label: '固定日期', value: 'fixed_date' },
        ],
        Array.from({ length: 28 }, (_, i) => ({
            label: `${i + 1}天`,
            value: i + 1,
        })),
    ]);

    const onPayDayChange = (e) => {
        const { columnIndex, index } = e;
        if (columnIndex === 0) {
            const type = payDayColumns[0][index].value;
            if (type === 'fixed_date') {
                payDayColumns[1] = Array.from({ length: 28 }, (_, i) => ({
                    label: `每月${i + 1}日`,
                    value: i + 1,
                }));
            } else {
                payDayColumns[1] = Array.from({ length: 28 }, (_, i) => ({
                    label: `${i + 1}天`,
                    value: i + 1,
                }));
            }
        }
    };

    const onPayDayConfirm = (e) => {
        const { value } = e;
        formData.value.payDay = `${value[0].label} ${value[1].label}`;
        showPayDayPicker.value = false;
    };

    const supplementaryAgreementOptions = ref([
        { name: '不得携带宠物', value: 'no_pets_allowed' },
        { name: '不可居住孕妇', value: 'no_pregnant' },
        { name: '不可居住老人', value: 'no_elderly' },
        { name: '不可居住小孩', value: 'no_children' },
    ]);

    const supplementaryAgreementSelected = ref([]);

    const supplementaryAgreementShowList = computed(() =>
        supplementaryAgreementOptions.value.filter((option) =>
            supplementaryAgreementSelected.value.includes(option.value),
        ),
    );

    const onSupplementaryAgreementConfirm = (values) => {
        supplementaryAgreementSelected.value = values;
        formData.value.supplementaryAgreement = supplementaryAgreementSelected.value.join(',');
    };

    const showSupplementaryAgreementPicker = ref(false);
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

    .custom-textarea {
        width: 100%;
        border: 1px solid $border-color;
        border-radius: 8rpx;
        padding: 20rpx;
        min-height: 100rpx;
        background-color: $gray-f;
        min-height: 300rpx;
    }

    .textarea-item {
        font-size: 28rpx;
        color: $dark-7;
        margin-bottom: 16rpx;
    }

    .textarea-item:last-child {
        margin-bottom: 0;
    }

    :deep(.checklist-group) {
        gap: 24rpx;
    }

    :deep(.uni-data-checklist .checklist-group .checklist-box) {
        margin: 0 !important;
    }

    :deep(.is--tag) {
        margin: 0;
        flex: 1 !important;
        padding: 16rpx 32rpx !important;
        background-color: $white !important;
        color: $dark-6 !important;
        .checklist-text {
            font-size: 26rpx !important;
        }
    }
    :deep(.is--tag.is-checked) {
        border-color: $orange-light !important;
        background-color: $white !important;

        & .checklist-text {
            color: $orange-light !important;
        }
    }

    :deep(.checklist-content) {
        justify-content: center !important;
    }

    :deep(.u-textarea) {
        margin-top: 32rpx;
        background-color: $gray-f;
    }
</style>
