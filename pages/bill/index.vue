<template>
    <s-layout title="账单">
        <!-- 展示账单总额 -->
        <view class="bill-total-amount">
            <up-icon name="rmb-circle-fill" size="16" color="#ccc" />
            <text class="ss-m-l-8">账单总额：￥{{ totalAmount }}（共{{ totalCount }}笔）</text>
        </view>
        <!-- 账单列表 -->
        <bill-list-item
            v-for="bill in bills"
            :key="bill.id"
            :bill="bill"
            @tap="handleClick(bill)"
        />
    </s-layout>
</template>

<script setup>
    import sheep from '@/sheep';
    import { ref } from 'vue';
    import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app';
    import BillListItem from './components/billListItem.vue';

    // 模拟账单数据
    const bills = ref([
        {
            id: 1,
            title: '租金（1个月）',
            amount: 10000.22,
            date: '2024-06-15',
            status: '已支付',
            rentalAddress: '绿城·桃花源小区12栋3单元502',
            rentalName: '张三',
        },
        {
            id: 2,
            title: '水费（1个月）',
            amount: 150.5,
            date: '2024-06-10',
            status: '未支付',
            rentalAddress: '绿城·桃花源小区12栋3单元502',
            rentalName: '张三',
        },
        {
            id: 3,
            title: '电费（1个月）',
            amount: 200.75,
            date: '2024-06-12',
            status: '已支付',
            rentalAddress: '绿城·桃花源小区12栋3单元502',
            rentalName: '张三',
        },
        // 更多账单数据...
    ]);

    const totalAmount = ref(89992.47);
    const totalCount = ref(2000);

    onLoad(() => {
        fetchBillData();
    });

    onPullDownRefresh(async () => {
        await fetchBillData();
        uni.stopPullDownRefresh();
    });

    const fetchBillData = async () => {
        // 模拟数据获取逻辑
        // 实际应用中可调用API获取数据
    };

    const handleClick = (bill) => {
        sheep.$router.go('/pages/bill/billDetail');
    };
</script>

<style lang="scss" scoped>
    .bill-total-amount {
        font-size: 26rpx;
        padding: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: $bg-page;
        color: $dark-9;
    }
</style>
