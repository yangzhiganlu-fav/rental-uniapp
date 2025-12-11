<template>
    <s-layout
        tabbar="/pages/lease/index"
        tools="search"
        searchClearButton="auto"
        v-model:searchText="searchForm.searchText"
        placeholderText="小区/门牌号/房间号/姓名/手机号"
        @search="handleSearch"
    >
        <!-- 租约筛选组件 -->
        <lease-filter v-model="searchForm" @search="onSearch" />

        <!-- 租约列表 -->
        <view v-for="lease in leaseList" :key="lease.id" class="ss-p-b-0 ss-p-x-16 ss-p-t-16">
            <lease-list-item :lease="lease" @click="navigateTo(lease)" />
        </view>

        <up-loadmore :status="loadStatus" line fontSize="12" marginTop="16" marginBottom="16" />
    </s-layout>
</template>

<script setup>
    import sheep from '@/sheep';
    import { ref } from 'vue';
    import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
    import LeaseFilter from './components/leaseFilter.vue';
    import LeaseListItem from './components/leaseListItem.vue';
    import LeaseApi from '@/sheep/api/lease';

    const searchForm = ref({
        searchText: '',
        status: '', // 合同状态 0:待签署 1:已签署（租约进行中） 2：合同终止 3:即将到期
        startTimeStart: '', // 合同约定开始时间-左区间
        startTimeEnd: '', // 合同约定开始时间-右区间
        endTimeStart: '', // 租约结束时间-左区间
        endTimeEnd: '', // 租约结束时间-右区间
        actualEndTimeStart: '', // 实际终止时间(退房日期)-左区间
        actualEndTimeEnd: '', // 实际终止时间(退房日期)-右区间
        lessorId: '', // 房东ID（可选）
        roomId: '', // 房源ID（可选）
        pageSize: 10,
        pageNo: 1,
    });

    const leaseList = ref([]);
    const total = ref(0);
    const loadStatus = ref('loadmore'); // loadmore | loading | nomore

    const navigateTo = (lease) => {
        sheep.$router.go('/pages/lease/leaseDetail', { leaseId: lease.id });
    };

    const onSearch = async (isRefresh = true) => {
        // 防止重复加载
        if (loadStatus.value === 'loading') return;

        if (isRefresh) {
            leaseList.value = [];
            total.value = 0;
            searchForm.value.pageNo = 1;
        }

        loadStatus.value = 'loading';

        const { code, data } = await LeaseApi.getLeasePage(searchForm.value);

        if (code === 0 && data) {
            const newList = data.list || [];

            if (isRefresh) {
                leaseList.value = newList;
            } else {
                leaseList.value.push(...newList);
            }

            total.value = data.total || 0;

            // 判断是否加载完成
            if (total.value === 0) {
                loadStatus.value = 'nomore';
            } else if (leaseList.value.length >= total.value) {
                loadStatus.value = 'nomore';
            } else {
                loadStatus.value = 'loadmore';
            }
        } else {
            // 请求失败时，如果已有数据则保持 loadmore 状态，否则显示 nomore
            loadStatus.value = leaseList.value.length > 0 ? 'loadmore' : 'nomore';
        }
    };

    const handleSearch = (searchText) => {
        searchForm.value.searchText = searchText;
        onSearch(true);
    };

    onLoad(() => {
        uni.hideTabBar({
            fail: () => {},
        });
    });

    onShow(() => {
        onSearch();
    });

    onPullDownRefresh(async () => {
        searchForm.value.pageNo = 1;
        await onSearch(true);
        uni.stopPullDownRefresh();
    });

    onReachBottom(async () => {
        if (loadStatus.value === 'loadmore' && leaseList.value.length < total.value) {
            searchForm.value.pageNo += 1;
            onSearch(false);
        }
    });
</script>
