<template>
    <s-layout title="租约详情">
        <view class="lease-detail">
            <customer-info :leaseData="leaseData" />

            <up-tabs
                :list="tabList"
                :current="currentTab"
                class="tabs"
                @click="onTabClick"
            ></up-tabs>

            <up-gap height="20rpx" bgColor="#f6f6f6"></up-gap>

            <scroll-view scroll-y class="tab-content">
                <component :is="currentTabComponent" :leaseData="leaseData" />
            </scroll-view>
        </view>
    </s-layout>
</template>

<script setup>
    import { ref, reactive, computed } from 'vue';
    import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app';
    import CustomerInfo from './components/customerInfo.vue';
    import LeaseInfo from './components/leaseInfo.vue';
    import UnpaidFees from './components/unpaidFees.vue';
    import CollectedFees from './components/collectedFees.vue';
    import LeaseApi from '@/sheep/api/lease';

    const leaseId = ref('');

    onLoad((options) => {
        leaseId.value = options.leaseId || '';
        fetchLeaseDetail();
    });

    onPullDownRefresh(async () => {
        await fetchLeaseDetail();
        uni.stopPullDownRefresh();
    });

    // 租约数据
    const leaseData = ref(null);

    const tabList = reactive([{ name: '租约信息' }, { name: '未收费用' }, { name: '已收费用' }]);

    const currentTab = ref(0);

    const onTabClick = (tab) => {
        currentTab.value = tab.index;
    };

    const currentTabComponent = computed(() => {
        if (currentTab.value === 0) return LeaseInfo;
        if (currentTab.value === 1) return UnpaidFees;
        if (currentTab.value === 2) return CollectedFees;
        return null;
    });

    const fetchLeaseDetail = async () => {
        const { code, data } = await LeaseApi.getLeaseDetail({ id: leaseId.value });
        if (code === 0 && data) {
            leaseData.value = data;
        } else {
            leaseData.value = null;
        }
    };
</script>

<style lang="scss" scoped>
    .lease-detail {
        height: 100%;
        display: flex;
        flex-direction: column;

        .tabs {
            margin-top: 20rpx;
            background-color: #fff;
            flex-shrink: 0;

            :deep(.u-tabs__wrapper__nav__item) {
                flex: 1;
            }
        }

        .tab-content {
            flex: 1;
            min-height: 0;
            overflow: auto;
        }
    }
</style>
