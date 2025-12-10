<template>
    <s-layout title="租约详情">
        <view class="lease-detail">
            <!-- 客户基础信息 -->
            <customer-info :info="leaseData" />

            <up-tabs :list="list1" :current="currentTab" class="tabs" @click="onTabClick"></up-tabs>

            <scroll-view scroll-y class="tab-content">
                <component :is="currentTabComponent" />
            </scroll-view>
        </view>
    </s-layout>
</template>

<script setup>
    import sheep from '@/sheep';
    import { ref, reactive, computed } from 'vue';
    import CustomerInfo from './components/customerInfo.vue';
    import LeaseInfo from './components/leaseInfo.vue';
    import UnpaidFees from './components/unpaidFees.vue';
    import CollectedFees from './components/collectedFees.vue';

    const leaseId = sheep.$router.getCurrentRoute().options.leaseId;

    // 租约数据
    const leaseData = ref({
        tenantName: '李晓峰',
        gender: '未知',
        phone: '13791957248',
    });

    const list1 = reactive([
        { name: '租约信息' },
        { name: '未收费用', badge: { isDot: true } },
        { name: '已收费用' },
    ]);

    const currentTab = ref(0);

    // 选项卡点击事件
    const onTabClick = (tab) => {
        currentTab.value = tab.index;
    };

    const currentTabComponent = computed(() => {
        if (currentTab.value === 0) return LeaseInfo;
        if (currentTab.value === 1) return UnpaidFees;
        if (currentTab.value === 2) return CollectedFees;
        return null;
    });
</script>

<style lang="scss" scoped>
    .lease-detail {
        flex: 1;
        min-height: 0;
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
