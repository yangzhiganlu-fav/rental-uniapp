<template>
    <view>
        <su-sticky bgColor="#fff" offsetTop="-1">
            <up-dropdown ref="uDropdown" borderBottom titleSize="12" activeColor="#2979ff">
                <up-dropdown-item title="业务状态">
                    <dropdown-business-status
                        v-model="searchForm.businessStatus"
                        @confirm="handleConfirm"
                    />
                </up-dropdown-item>

                <up-dropdown-item
                    title="出租状态"
                    v-model="searchForm.rentalStatus"
                    :options="[
                        { label: '全部', value: '' },
                        { label: '已租', value: 'rented' },
                        { label: '未租', value: 'unrented' },
                        { label: '租客转租中', value: 'subletting' },
                        { label: '装修中', value: 'renovating' },
                    ]"
                    @close="handleConfirm"
                ></up-dropdown-item>

                <up-dropdown-item title="全部小区" v-model="searchForm.location">
                    <dropdown-community v-model="searchForm.location" @confirm="handleConfirm" />
                </up-dropdown-item>

                <up-dropdown-item title="更多筛选">
                    <dropdown-filter v-model="searchForm.filter" @confirm="handleConfirm" />
                </up-dropdown-item>
            </up-dropdown>
        </su-sticky>
    </view>
</template>

<script setup>
    import { ref, reactive } from 'vue';
    import { cloneDeep } from 'lodash-es';
    import DropdownCommunity from './dropdownCommunity.vue';
    import DropdownFilter from './dropdownFilter.vue';
    import DropdownBusinessStatus from './dropdownBusinessStatus.vue';

    const emit = defineEmits(['search']);

    const uDropdown = ref(null);

    const initialSearchForm = {
        businessStatus: {
            rentCollectionStatus: '',
            leaseExpirationStatus: '',
        },
        rentalStatus: '',
        location: '',
        filter: {
            houseStatus: '',
            rentalStatus: '',
            paymentMethod: '',
            hasPhotos: null,
            hasSmartMeter: null,
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
