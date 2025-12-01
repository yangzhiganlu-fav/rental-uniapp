<template>
    <view class="dropdown-slot-content">
        <view class="filter-box">
            <view class="filter-title">租约开始日</view>
            <view class="date-range-box">
                <view class="picker-item">
                    <picker
                        mode="date"
                        :value="localValue.leaseStartDate?.[0]"
                        :end="localValue.leaseStartDate?.[1]"
                        @change="(e) => updateDate('leaseStartDate', 0, e)"
                    >
                        <view class="picker-input">
                            <text
                                :class="{
                                    'text-value': localValue.leaseStartDate?.[0],
                                    'text-placeholder': !localValue.leaseStartDate?.[0],
                                }"
                            >
                                {{ localValue.leaseStartDate?.[0] || '最早日期' }}
                            </text>
                            <uni-icons type="calendar" size="16" color="#c0c4cc"></uni-icons>
                        </view>
                    </picker>
                </view>
                <view class="separator">-</view>
                <view class="picker-item">
                    <picker
                        mode="date"
                        :value="localValue.leaseStartDate?.[1]"
                        :start="localValue.leaseStartDate?.[0]"
                        @change="(e) => updateDate('leaseStartDate', 1, e)"
                    >
                        <view class="picker-input">
                            <text
                                :class="{
                                    'text-value': localValue.leaseStartDate?.[1],
                                    'text-placeholder': !localValue.leaseStartDate?.[1],
                                }"
                            >
                                {{ localValue.leaseStartDate?.[1] || '最晚日期' }}
                            </text>
                            <uni-icons type="calendar" size="16" color="#c0c4cc"></uni-icons>
                        </view>
                    </picker>
                </view>
            </view>
        </view>
        <view class="filter-box">
            <view class="filter-title">租约到期日</view>
            <view class="date-range-box">
                <view class="picker-item">
                    <picker
                        mode="date"
                        :value="localValue.leaseEndDate?.[0]"
                        :end="localValue.leaseEndDate?.[1]"
                        @change="(e) => updateDate('leaseEndDate', 0, e)"
                    >
                        <view class="picker-input">
                            <text
                                :class="{
                                    'text-value': localValue.leaseEndDate?.[0],
                                    'text-placeholder': !localValue.leaseEndDate?.[0],
                                }"
                            >
                                {{ localValue.leaseEndDate?.[0] || '最早日期' }}
                            </text>
                            <uni-icons type="calendar" size="16" color="#c0c4cc"></uni-icons>
                        </view>
                    </picker>
                </view>
                <view class="separator">-</view>
                <view class="picker-item">
                    <picker
                        mode="date"
                        :value="localValue.leaseEndDate?.[1]"
                        :start="localValue.leaseEndDate?.[0]"
                        @change="(e) => updateDate('leaseEndDate', 1, e)"
                    >
                        <view class="picker-input">
                            <text
                                :class="{
                                    'text-value': localValue.leaseEndDate?.[1],
                                    'text-placeholder': !localValue.leaseEndDate?.[1],
                                }"
                            >
                                {{ localValue.leaseEndDate?.[1] || '最晚日期' }}
                            </text>
                            <uni-icons type="calendar" size="16" color="#c0c4cc"></uni-icons>
                        </view>
                    </picker>
                </view>
            </view>
        </view>
        <view class="filter-box">
            <view class="filter-title">租约退房日</view>
            <view class="date-range-box">
                <view class="picker-item">
                    <picker
                        mode="date"
                        :value="localValue.leaseCheckoutDate?.[0]"
                        :end="today"
                        @change="(e) => updateDate('leaseCheckoutDate', 0, e)"
                    >
                        <view class="picker-input">
                            <text
                                :class="{
                                    'text-value': localValue.leaseCheckoutDate?.[0],
                                    'text-placeholder': !localValue.leaseCheckoutDate?.[0],
                                }"
                            >
                                {{ localValue.leaseCheckoutDate?.[0] || '最早日期' }}
                            </text>
                            <uni-icons type="calendar" size="16" color="#c0c4cc"></uni-icons>
                        </view>
                    </picker>
                </view>
                <view class="separator">-</view>
                <view class="picker-item">
                    <view class="picker-input disabled">
                        <text
                            :class="{
                                'text-value': localValue.leaseCheckoutDate?.[1],
                                'text-placeholder': !localValue.leaseCheckoutDate?.[1],
                            }"
                        >
                            {{ localValue.leaseCheckoutDate?.[1] || '今天' }}
                        </text>
                        <uni-icons type="calendar" size="16" color="#c0c4cc"></uni-icons>
                    </view>
                </view>
            </view>
        </view>
        <view class="dropdown-footer">
            <button class="btn-reset" @tap="resetFilter">重置</button>
            <button class="btn-confirm" type="primary" @tap="confirmFilter">确定</button>
        </view>
    </view>
</template>

<script setup>
    import { computed } from 'vue';

    const props = defineProps({
        modelValue: {
            type: Object,
            default: () => ({
                leaseStartDate: [],
                leaseEndDate: [],
                leaseCheckoutDate: [],
            }),
        },
    });

    const emit = defineEmits(['update:modelValue', 'confirm', 'close']);

    const getToday = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const today = getToday();

    const localValue = computed({
        get() {
            return props.modelValue;
        },
        set(val) {
            emit('update:modelValue', val);
        },
    });

    const updateDate = (key, index, e) => {
        const date = e.detail.value;
        const newValue = { ...localValue.value };
        if (!newValue[key]) {
            newValue[key] = [];
        }
        newValue[key][index] = date;

        // 特殊处理租约退房日：如果选择了开始日期，结束日期自动设为今天
        if (key === 'leaseCheckoutDate' && index === 0) {
            newValue[key][1] = today;
        }

        localValue.value = newValue;
    };

    const resetFilter = () => {
        localValue.value = {
            leaseStartDate: [],
            leaseEndDate: [],
            leaseCheckoutDate: [],
        };
    };

    const confirmFilter = () => {
        emit('confirm');
        emit('close');
    };
</script>

<style lang="scss" scoped>
    .date-range-box {
        padding: 0 20rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .picker-item {
            flex: 1;
        }

        .picker-input {
            height: 36px;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            background-color: #fff;

            .text-value {
                color: #333;
                font-size: 14px;
            }

            .text-placeholder {
                color: #999;
                font-size: 14px;
            }

            &.disabled {
                background-color: #f5f7fa;
                cursor: not-allowed;
            }
        }

        .separator {
            margin: 0 10rpx;
            color: #999;
        }
    }
</style>
