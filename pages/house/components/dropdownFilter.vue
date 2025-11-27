<template>
    <view class="dropdown-slot-content">
        <view class="filter-box" v-for="(group, index) in filterGroups" :key="index">
            <view class="filter-title">{{ group.title }}</view>
            <view class="filter-tags">
                <view
                    class="tag-item"
                    :class="{ active: localValue[group.key] === item.value }"
                    v-for="item in group.options"
                    :key="item.value"
                    @click="updateValue(group.key, item.value)"
                >
                    {{ item.label }}
                </view>
            </view>
        </view>
        <view class="dropdown-footer">
            <button class="btn-reset" @click="resetFilter">重置</button>
            <button class="btn-confirm" type="primary" @click="confirmFilter">确定</button>
        </view>
    </view>
</template>

<script setup>
    import { computed } from 'vue';

    const props = defineProps({
        modelValue: {
            type: Object,
            default: () => ({
                houseStatus: '',
                rentalStatus: '',
                paymentMethod: '',
                hasPhotos: null,
                hasSmartMeter: null,
            }),
        },
    });

    const emit = defineEmits(['update:modelValue', 'confirm', 'close']);

    const localValue = computed({
        get() {
            return props.modelValue;
        },
        set(val) {
            emit('update:modelValue', val);
        },
    });

    const filterGroups = [
        {
            title: '房源状态',
            key: 'houseStatus',
            options: [{ label: '即将下架', value: 'soon' }],
        },
        {
            title: '租约状态',
            key: 'rentalStatus',
            options: [
                { label: '有租约', value: 'withLease' },
                { label: '无租约', value: 'noLease' },
            ],
        },
        {
            title: '付款方式',
            key: 'paymentMethod',
            options: [
                { label: '月付', value: 'monthly' },
                { label: '非月付', value: 'nonMonthly' },
            ],
        },
        {
            title: '招租照片',
            key: 'hasPhotos',
            options: [
                { label: '有照片', value: true },
                { label: '无照片', value: false },
            ],
        },
        {
            title: '智能电表',
            key: 'hasSmartMeter',
            options: [
                { label: '有电表', value: true },
                { label: '无电表', value: false },
            ],
        },
    ];

    const updateValue = (key, value) => {
        const newValue = { ...localValue.value, [key]: value };
        localValue.value = newValue;
    };

    const resetFilter = () => {
        localValue.value = { layout: '', orientation: '' };
    };

    const confirmFilter = () => {
        emit('confirm');
        emit('close');
    };
</script>
