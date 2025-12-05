<template>
    <s-layout title="账单详情" :bgStyle="{ color: '#f6f6f6' }">
        <template #right>
            <view class="nav-right-btn" @tap="onRightBtnClick">
                {{ type === 'paid' ? '联系租客' : '查看租约' }}
            </view>
        </template>

        <view class="page-container">
            <!-- 房源信息卡片 -->
            <view class="header-card">
                <view class="header-title">
                    {{ detail.houseName }}
                </view>
                <view class="header-body">
                    <view class="info-row">
                        <text class="label">租客姓名：</text>
                        <view class="value-box">
                            <text class="value">{{ detail.tenantName }}</text>
                            <view
                                v-if="type === 'unpaid' && detail.remainingDays"
                                class="tag ml-20"
                            >
                                剩余{{ detail.remainingDays }}天
                            </view>
                        </view>
                    </view>
                    <view class="info-row">
                        <text class="label">联系电话：</text>
                        <text class="value">{{ detail.tenantPhone }}</text>
                    </view>
                </view>
            </view>

            <!-- 已收费用详情 -->
            <template v-if="type === 'paid'">
                <!-- 账期信息 -->
                <view class="info-card">
                    <view class="card-header">
                        <text class="card-title">账期{{ detail.period }}</text>
                        <view class="card-action" @tap="viewVoucher">
                            <text class="action-text">查看收款凭证</text>
                            <up-icon name="arrow-right" size="12" color="#3c9cff"></up-icon>
                        </view>
                    </view>
                    <view class="info-row">
                        <text class="label">应收款日</text>
                        <text class="value">{{ detail.receivableDate }}</text>
                    </view>
                    <view class="info-row">
                        <text class="label">实收款日</text>
                        <text class="value">{{ detail.actualReceiptDate }}</text>
                    </view>
                </view>

                <!-- 应收明细 -->
                <view class="info-card">
                    <view class="card-header">
                        <view class="card-title">应收明细</view>
                    </view>
                    <view
                        class="info-row"
                        v-for="(item, index) in detail.receivableItems"
                        :key="index"
                    >
                        <text class="label">{{ item.label }}</text>
                        <text class="value">{{ item.amount }}</text>
                    </view>
                    <view class="info-row is-total">
                        <text class="label">应收总计</text>
                        <text class="value font-bold">{{ detail.receivableTotal }}</text>
                    </view>
                </view>
            </template>

            <!-- 未收费用详情 -->
            <template v-else>
                <!-- 账单明细 -->
                <view class="info-card">
                    <view class="card-header">
                        <view class="card-title">账单明细</view>
                    </view>
                    <view class="info-row" v-for="(item, index) in detail.billItems" :key="index">
                        <text class="label">{{ item.label }}</text>
                        <text class="value">{{ item.amount }}</text>
                    </view>
                </view>

                <!-- 账单信息 -->
                <view class="info-card">
                    <view class="card-header">
                        <view class="card-title">账单信息</view>
                    </view>
                    <view class="info-row">
                        <text class="label">约定提前收租日</text>
                        <text class="value">{{ detail.agreedCollectionDate }}</text>
                    </view>
                    <view class="info-row">
                        <text class="label">起止日期</text>
                        <text class="value">{{ detail.startDate }} 至 {{ detail.endDate }}</text>
                    </view>
                </view>

                <!-- 账单备注 -->
                <view class="info-card" @tap="viewRemark">
                    <view class="info-row">
                        <text class="label">账单备注</text>
                        <view class="value-box">
                            <text class="value mr-10">{{ detail.remark }}</text>
                            <up-icon name="arrow-right" size="12" color="#999"></up-icon>
                        </view>
                    </view>
                </view>

                <!-- 支付凭证 -->
                <view class="info-card">
                    <view class="card-header">
                        <view class="card-title">支付凭证</view>
                    </view>
                    <view class="voucher-content">
                        <!-- 这里可以放置图片上传或展示组件 -->
                        暂无凭证
                    </view>
                </view>
            </template>
        </view>

        <!-- 底部按钮 (仅未收状态显示) -->
        <su-fixed bottom placeholder v-if="type === 'unpaid'">
            <view class="footer-box">
                <view class="urge-btn" @tap="onUrge">
                    <up-icon name="chat" size="24" color="#3c9cff"></up-icon>
                    <text class="urge-text">催账</text>
                </view>
                <view class="action-btn">
                    <up-button type="primary" shape="circle" @tap="onConfirmCollection"
                        >已收款</up-button
                    >
                </view>
            </view>
        </su-fixed>
    </s-layout>
</template>

<script setup>
    import { ref } from 'vue';
    import { onLoad } from '@dcloudio/uni-app';
    import sheep from '@/sheep';

    const type = ref('paid'); // 'paid' | 'unpaid'

    // 模拟数据
    const detail = ref({});

    const mockData = {
        paid: {
            houseName: '黄城花园西区52幢/栋A单元301室-22',
            tenantName: '万伟',
            tenantPhone: '18221184283',
            period: '2025-11-23/2025-12-22',
            receivableDate: '2025-11-22',
            actualReceiptDate: '2025-11-22',
            receivableItems: [
                { label: '租金(1个月)', amount: '1280.00' },
                { label: '抵扣', amount: '-1280.00' },
                { label: '押金:房屋押金', amount: '1280.00' },
            ],
            receivableTotal: '1280',
            deductionItems: [{ label: '渠道费', amount: '-9.68' }],
            actualTotal: '1270.32',
            channel: '巴乐兔代付',
            remark: '租金 11/23-12/22',
        },
        unpaid: {
            houseName: '棕榈湾48幢/栋802室E',
            tenantName: '李晓峰',
            tenantPhone: '13791957248',
            remainingDays: 21,
            billItems: [
                { label: '租金(1个月)', amount: '¥920.00' },
                { label: '抵扣', amount: '¥-920.00' },
                { label: '押金:房屋押金', amount: '¥920.00' },
            ],
            agreedCollectionDate: '2025-12-26',
            startDate: '2025-12-26',
            endDate: '2026-01-25',
            remark: '租金 12/26-01/25',
        },
    };

    onLoad((options) => {
        console.log('options:', options);
        // 优先从 options 获取，也可以尝试从 sheep.$router 获取
        if (options.type) {
            type.value = options.type;
        } else {
            const routeOptions = sheep.$router.getCurrentRoute().options;
            if (routeOptions && routeOptions.type) {
                type.value = routeOptions.type;
            }
        }

        // 加载对应数据
        detail.value = mockData[type.value] || mockData.paid;
    });

    const onRightBtnClick = () => {
        if (type.value === 'paid') {
            uni.makePhoneCall({ phoneNumber: detail.value.tenantPhone });
        } else {
            // 查看租约逻辑
            console.log('查看租约');
        }
    };

    const viewVoucher = () => {
        console.log('查看收款凭证');
    };

    const viewRemark = () => {
        console.log('查看备注');
    };

    const onUrge = () => {
        console.log('催账');
    };

    const onConfirmCollection = () => {
        console.log('已收款');
    };
</script>

<style lang="scss" scoped>
    .page-container {
        padding: 20rpx;
    }

    .nav-right-btn {
        padding-right: 30rpx;
        font-size: 28rpx;
        color: var(--ui-primary);
    }

    .header-card {
        background-color: #fff;
        border-radius: 16rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
        overflow: hidden;

        .header-title {
            font-size: 32rpx;
            font-weight: 500;
            padding: 30rpx;
            background-color: #3c9cff;
            color: #fff;
        }

        .header-body {
            padding: 30rpx;
        }
    }

    .info-card {
        background-color: #fff;
        padding: 30rpx;
        border-radius: 16rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30rpx;

            .card-title {
                font-size: 30rpx;
                font-weight: 500;
                color: #999;
            }

            .card-action {
                display: flex;
                align-items: center;
                color: var(--ui-primary);

                .action-text {
                    font-size: 26rpx;
                }
            }
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20rpx;

            &:last-child {
                margin-bottom: 0;
            }

            &.is-total {
                margin-top: 20rpx;
                border-top: 1rpx solid #eee;
                padding-top: 20rpx;
            }
        }

        .voucher-content {
            padding: 20rpx 0;
            color: #999;
            font-size: 24rpx;
        }
    }

    .label {
        color: #666;
        font-size: 28rpx;
    }

    .value-box {
        display: flex;
        align-items: center;
    }

    .value {
        color: #333;
        font-size: 28rpx;
    }

    .tag {
        background-color: #4cd964;
        color: #fff;
        font-size: 22rpx;
        padding: 4rpx 12rpx;
        border-radius: 6rpx;
    }

    .footer-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx;
        background-color: #fff;
        border-top: 1rpx solid #eee;

        .urge-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 30rpx;

            .urge-text {
                font-size: 24rpx;
                color: var(--ui-primary);
                margin-top: 4rpx;
            }
        }

        .action-btn {
            flex: 1;
        }
    }

    // 辅助类
    .ml-20 {
        margin-left: 20rpx;
    }
    .mr-10 {
        margin-right: 10rpx;
    }
    .font-bold {
        font-weight: bold;
    }
</style>
