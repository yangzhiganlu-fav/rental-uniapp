<template>
    <view>
        <su-sticky bgColor="#fff" offsetTop="-1">
            <up-dropdown ref="uDropdown" borderBottom titleSize="12" activeColor="#2979ff">
                <up-dropdown-item
                    title="默认排序"
                    v-model="searchForm.sortOrder"
                    :options="[
                        { label: '默认排序', value: 'default' },
                        { label: '按时间升序', value: 'timeAsc' },
                        { label: '按时间降序', value: 'timeDesc' },
                    ]"
                    @close="handleConfirm"
                ></up-dropdown-item>

                <up-dropdown-item
                    title="租约状态"
                    v-model="searchForm.leaseStatus"
                    :options="[
                        { label: '不限', value: '' },
                        { label: '已退房', value: 'checkedOut' },
                        { label: '租约快到期', value: 'nearExpiry' },
                        { label: '待签署', value: 'pendingSignature' },
                        { label: '即将逾期', value: 'nearOverdue' },
                        { label: '逾期欠款', value: 'overdue' },
                        { label: '已签署', value: 'signed' },
                        { label: '定金', value: 'deposit' },
                    ]"
                    @close="handleConfirm"
                ></up-dropdown-item>

                <up-dropdown-item title="日期范围">
                    <dropdown-date-range v-model="searchForm.dateRanges" @confirm="handleConfirm" />
                </up-dropdown-item>
            </up-dropdown>
        </su-sticky>
    </view>
</template>

<script setup>
    import { ref, reactive } from 'vue';
    import { cloneDeep } from 'lodash-es';
    import DropdownDateRange from './dropdown/dropdownDateRange.vue';

    const emit = defineEmits(['search']);

    const uDropdown = ref(null);

    const initialSearchForm = {
        sortOrder: 'default',
        leaseStatus: '',
        dateRanges: {
            leaseStartDate: [],
            leaseEndDate: [],
            leaseCheckoutDate: [],
        },
    };

    // 响应式表单数据
    const searchForm = reactive(cloneDeep(initialSearchForm));

    const handleConfirm = () => {
        uDropdown.value?.close();
        emit('search', searchForm);
    };
</script>

<style lang="scss" scoped>
    :deep(.u-cell__title-text) {
        font-size: $tx-sm !important;
    }
</style>
