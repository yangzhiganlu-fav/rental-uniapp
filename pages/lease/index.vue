<template>
    <s-layout tabbar="/pages/lease/index">
        <!-- 顶部导航栏中间部分 -->
        <template #center>
            <!-- 否则显示房源统计信息，点击可切换统计维度 -->
            <view class="mine-house-count" @tap="toggleHouseCountPopup">
                <view>王某某(分散式)(100000间)</view>
                <uni-icons
                    type="right"
                    size="14"
                    :class="[showHouseCountPopup ? '-rotate-90' : 'rotate-90']"
                ></uni-icons>
            </view>
        </template>

        <!-- 顶部导航栏右侧部分 -->
        <template #right>
            <s-icon name="search" size="40" @tap="toggleSearchPopup" />
        </template>

        <!-- 租约筛选组件 -->
        <lease-filter @search="onSearch" />

        <!-- 租约列表 -->

        <scroll-view class="lease-list" scroll-y @scrolltolower="loadMore">
            <view v-for="lease in leaseList" :key="lease.id" class="ss-p-16 ss-m-b-12">
                <lease-list-item
                    :lease="lease"
                    @onTap="navigateTo(`/pages/lease/leaseDetail`, { leaseId: lease.id })"
                />
            </view>
        </scroll-view>

        <!-- 搜索弹窗 -->
        <search-popup v-model:show="isSearchPopupVisible" @search="handleKeywordSearch" />

        <!-- 切换房东手中的房源统计维度弹窗 -->
        <my-house-count-popup v-model:show="showHouseCountPopup" @change="onHouseCountTypeChange" />
    </s-layout>
</template>

<script setup>
    import sheep from '@/sheep';
    import { ref } from 'vue';
    import MyHouseCountPopup from '@/pages/house/components/popup/myHouseCountPopup.vue';
    import LeaseFilter from './components/leaseFilter.vue';
    import LeaseListItem from './components/leaseListItem.vue';
    import SearchPopup from '@/pages/house/components/popup/searchPopup.vue';

    const showHouseCountPopup = ref(false); // 是否显示房源统计弹窗
    const isSearchPopupVisible = ref(false); // 是否显示搜索弹窗

    const searchForm = ref({
        selectedCommunity: null, // 当前选中的小区（搜索结果）
    });

    const navigateTo = (url, options = {}) => {
        sheep.$router.go(url, options);
    };

    const toggleHouseCountPopup = () => {
        showHouseCountPopup.value = !showHouseCountPopup.value;
        isSearchPopupVisible.value = false;
    };

    const toggleSearchPopup = () => {
        isSearchPopupVisible.value = !isSearchPopupVisible.value;
        showHouseCountPopup.value = false;
    };

    const onHouseCountTypeChange = (type) => {
        console.log('Selected house count type:', type);
    };

    const onSearch = (filters) => {
        console.log('Lease filters applied:', filters);
    };

    const handleKeywordSearch = (keyword) => {
        console.log('搜索关键字:', keyword);
        // TODO: 实现搜索逻辑
    };

    const leaseList = ref([
        // 示例租约数据
        {
            id: 1,
            address: '小区A-101',
            tenant: '王某某',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            status: '可续租',
        },
        {
            id: 2,
            address: '小区B-202',
            tenant: '王某某',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            status: '可续租',
        },
        {
            id: 3,
            address: '小区C-303',
            tenant: '王某某',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            status: '可续租',
        },
        {
            id: 4,
            address: '小区D-404',
            tenant: '王某某',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            status: '可续租',
        },
        {
            id: 5,
            address: '小区E-505',
            tenant: '王某某',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            status: '可续租',
        },
        {
            id: 6,
            address: '小区F-606',
            tenant: '王某某',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            status: '可续租',
        },
    ]);

    const loadMore = () => {
        leaseList.value = leaseList.value.concat([
            {
                id: leaseList.value.length + 1,
                address: `小区D-${leaseList.value.length + 1}01`,
                status: '已签署',
            },
        ]);
    };
</script>

<style lang="scss" scoped>
    .mine-house-count {
        display: flex;
        align-items: center;

        .uni-icons {
            margin-left: 12rpx;
        }

        .-rotate-90 {
            transform: rotate(-90deg);
            transition: all 0.3s;
        }

        .rotate-90 {
            transform: rotate(90deg);
            transition: all 0.3s;
        }
    }

    .lease-list {
        flex: 1;
        min-height: 0;
    }

    :deep(.uni-scroll-view-content > *) {
        margin-bottom: 0;
        padding-bottom: 0;
    }
</style>
