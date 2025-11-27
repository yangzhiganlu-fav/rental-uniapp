<template>
    <view class="dropdown-slot-content">
        <view class="filter-box" v-for="group in filterGroups" :key="group.key">
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
            default: () => ({ rentCollectionStatus: '', leaseExpirationStatus: '' }),
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
            title: '收租金',
            key: 'rentCollectionStatus',
            options: [
                { label: '全部', value: '' },
                { label: '3天内即将逾期', value: 'overdue_soon' },
                { label: '已经逾期', value: 'overdue' },
                { label: '正常租金状态', value: 'normal' },
            ],
        },
        {
            title: '租约到期',
            key: 'leaseExpirationStatus',
            options: [
                { label: '全部', value: '' },
                { label: '租客租约快到期', value: 'expiring_soon' },
                { label: '正常租约状态', value: 'normal' },
            ],
        },
    ];

    const updateValue = (key, value) => {
        const newValue = { ...localValue.value, [key]: value };
        localValue.value = newValue;
    };

    const resetFilter = () => {
        localValue.value = { rentCollectionStatus: '', leaseExpirationStatus: '' };
    };

    const confirmFilter = () => {
        emit('confirm');
        emit('close');
    };
</script>
