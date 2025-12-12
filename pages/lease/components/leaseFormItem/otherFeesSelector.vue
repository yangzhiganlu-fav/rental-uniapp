<template>
    <up-form-item
        label="其他费用"
        prop="otherFees"
        :borderBottom="!feesList.length"
        class="other-fee"
    >
        <up-button
            type="warning"
            size="small"
            icon="plus"
            plain
            iconColor="#ff9900"
            color="#ff9900"
            :customStyle="{ width: '200rpx', marginLeft: '0', marginRight: '0' }"
            @tap="showPicker = true"
        >
            添加费用
        </up-button>
    </up-form-item>

    <template v-for="(item, index) in feesList" :key="item.id">
        <up-form-item
            :label="index === 0 ? '每月固定费用' : ' '"
            :borderBottom="index === feesList.length - 1 && !hasOtherBill"
        >
            <view class="ss-flex ss-items-center ss-w-100">
                <text class="ss-m-r-20">{{ item.name }}</text>
                <up-input
                    v-model="item.amount"
                    placeholder="请输入金额"
                    border="none"
                    type="number"
                    inputAlign="right"
                    placeholderClass="placeholder-align-right"
                    @blur="handleAmountChange"
                >
                    <template #suffix>
                        <view class="ss-m-l-4">元</view>
                    </template>
                </up-input>
                <up-icon
                    name="close-circle"
                    color="#ccc"
                    class="ss-m-l-20"
                    @click="removeItem(index)"
                ></up-icon>
            </view>
        </up-form-item>
    </template>

    <up-form-item
        v-if="hasOtherBill"
        label="其他费用描述"
        :borderBottom="true"
        labelPosition="top"
        class="custom-form-item-label"
    >
        <up-textarea
            v-model.trim="otherBillDescValue"
            placeholder="请输入其他费用描述"
            @blur="handleDescChange"
        ></up-textarea>
    </up-form-item>

    <up-picker
        :show="showPicker"
        :columns="feeColumns"
        keyName="label"
        valueName="value"
        @confirm="handleConfirm"
        @cancel="showPicker = false"
        @close="showPicker = false"
    ></up-picker>
</template>

<script setup>
    import { reactive, ref, computed, watch } from 'vue';

    const props = defineProps({
        electricityBill: {
            type: [Number, String],
            default: '',
        },
        waterBill: {
            type: [Number, String],
            default: '',
        },
        netBill: {
            type: [Number, String],
            default: '',
        },
        gasBill: {
            type: [Number, String],
            default: '',
        },
        otherBill: {
            type: [Number, String],
            default: '',
        },
        otherBillDesc: {
            type: String,
            default: '',
        },
    });

    const emit = defineEmits(['change']);

    const showPicker = ref(false);

    // 费用类型映射
    const feeTypeMap = {
        electricityBill: '公用电费',
        waterBill: '水费',
        netBill: '网费',
        gasBill: '燃气费',
        otherBill: '其他',
    };

    const feeColumns = [
        [{ label: '每月固定费用', value: 'monthly' }],
        [
            { label: '公用电费', value: 'electricityBill' },
            { label: '水费', value: 'waterBill' },
            { label: '网费', value: 'netBill' },
            { label: '燃气费', value: 'gasBill' },
            { label: '其他', value: 'otherBill' },
        ],
    ];

    const feesList = reactive([]);
    const otherBillDescValue = ref('');

    // 检查是否包含其他费用
    const hasOtherBill = computed(() => {
        return feesList.some((item) => item.type === 'otherBill');
    });

    // 从props初始化费用列表
    const initFeesList = () => {
        Object.keys(feeTypeMap).forEach((key) => {
            if (props[key]) {
                feesList.push({
                    name: feeTypeMap[key],
                    amount: props[key],
                    type: key,
                    id: Date.now() + Math.random(),
                });
            }
        });
        // 初始化其他费用描述
        if (props.otherBillDesc) {
            otherBillDescValue.value = props.otherBillDesc;
        }
    };

    watch(
        () => [
            props.electricityBill,
            props.waterBill,
            props.netBill,
            props.gasBill,
            props.otherBill,
            props.otherBillDesc,
        ],
        () => {
            feesList.length = 0; // 清空现有列表
            initFeesList();
        },
        { immediate: true },
    );

    const handleConfirm = (e) => {
        const { value } = e;
        const selectedItem = value[1]; // 第二列才是具体的费用项
        const itemName = selectedItem.label;
        const itemType = selectedItem.value;

        const exists = feesList.some((item) => item.type === itemType);
        if (exists) {
            uni.showToast({
                title: '该费用项已添加',
                icon: 'none',
            });
            return;
        }

        feesList.push({
            name: itemName,
            amount: '',
            type: itemType,
            id: Date.now(),
        });

        emitChange();
        showPicker.value = false;
    };

    const removeItem = (index) => {
        feesList.splice(index, 1);
        emitChange();
    };

    const handleAmountChange = () => {
        emitChange();
    };

    const handleDescChange = () => {
        emitChange();
    };

    const emitChange = () => {
        // 将费用列表转换为独立字段
        const data = {};
        feesList.forEach((item) => {
            if (item.type) {
                data[item.type] = item.amount;
            }
        });
        // 如果有其他费用，添加描述字段
        if (hasOtherBill.value) {
            data.otherBillDesc = otherBillDescValue.value;
        }
        emit('change', data);
    };
</script>

<style lang="scss" scoped>
    .other-fee {
        :deep(.u-form-item__body__right__content__slot) {
            justify-content: flex-end;
        }

        :deep(.u-icon__icon) {
            font-size: 14px !important;
        }
    }
</style>
