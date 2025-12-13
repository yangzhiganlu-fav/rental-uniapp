<template>
    <su-sticky bgColor="#fff">
        <up-dropdown ref="uDropdown" borderBottom titleSize="12" activeColor="#2979ff">
            <up-dropdown-item
                :title="statusLabel"
                v-model="localSearchForm.status"
                :options="statusOptions"
                @change="handleConfirm"
            ></up-dropdown-item>

            <up-dropdown-item title="日期范围">
                <view class="dropdown-slot-content">
                    <view class="filter-box">
                        <view class="filter-title">租约开始日</view>
                        <view class="date-range-box">
                            <view class="picker-item">
                                <picker
                                    mode="date"
                                    :value="localSearchForm.startTimeStart"
                                    :end="localSearchForm.startTimeEnd"
                                    @change="(e) => updateDate('startTimeStart', e)"
                                >
                                    <view class="picker-input">
                                        <text
                                            :class="{
                                                'text-value': localSearchForm.startTimeStart,
                                                'text-placeholder': !localSearchForm.startTimeStart,
                                            }"
                                        >
                                            {{ localSearchForm.startTimeStart || '最早日期' }}
                                        </text>
                                        <uni-icons
                                            type="calendar"
                                            size="16"
                                            color="#c0c4cc"
                                        ></uni-icons>
                                    </view>
                                </picker>
                            </view>
                            <view class="separator">-</view>
                            <view class="picker-item">
                                <picker
                                    mode="date"
                                    :value="localSearchForm.startTimeEnd"
                                    :start="localSearchForm.startTimeStart"
                                    @change="(e) => updateDate('startTimeEnd', e)"
                                >
                                    <view class="picker-input">
                                        <text
                                            :class="{
                                                'text-value': localSearchForm.startTimeEnd,
                                                'text-placeholder': !localSearchForm.startTimeEnd,
                                            }"
                                        >
                                            {{ localSearchForm.startTimeEnd || '最晚日期' }}
                                        </text>
                                        <uni-icons
                                            type="calendar"
                                            size="16"
                                            color="#c0c4cc"
                                        ></uni-icons>
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
                                    :value="localSearchForm.endTimeStart"
                                    :end="localSearchForm.endTimeEnd"
                                    @change="(e) => updateDate('endTimeStart', e)"
                                >
                                    <view class="picker-input">
                                        <text
                                            :class="{
                                                'text-value': localSearchForm.endTimeStart,
                                                'text-placeholder': !localSearchForm.endTimeStart,
                                            }"
                                        >
                                            {{ localSearchForm.endTimeStart || '最早日期' }}
                                        </text>
                                        <uni-icons
                                            type="calendar"
                                            size="16"
                                            color="#c0c4cc"
                                        ></uni-icons>
                                    </view>
                                </picker>
                            </view>
                            <view class="separator">-</view>
                            <view class="picker-item">
                                <picker
                                    mode="date"
                                    :value="localSearchForm.endTimeEnd"
                                    :start="localSearchForm.endTimeStart"
                                    @change="(e) => updateDate('endTimeEnd', e)"
                                >
                                    <view class="picker-input">
                                        <text
                                            :class="{
                                                'text-value': localSearchForm.endTimeEnd,
                                                'text-placeholder': !localSearchForm.endTimeEnd,
                                            }"
                                        >
                                            {{ localSearchForm.endTimeEnd || '最晚日期' }}
                                        </text>
                                        <uni-icons
                                            type="calendar"
                                            size="16"
                                            color="#c0c4cc"
                                        ></uni-icons>
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
                                    :value="localSearchForm.actualEndTimeStart"
                                    :end="today"
                                    @change="(e) => updateDate('actualEndTimeStart', e)"
                                >
                                    <view class="picker-input">
                                        <text
                                            :class="{
                                                'text-value': localSearchForm.actualEndTimeStart,
                                                'text-placeholder':
                                                    !localSearchForm.actualEndTimeStart,
                                            }"
                                        >
                                            {{ localSearchForm.actualEndTimeStart || '最早日期' }}
                                        </text>
                                        <uni-icons
                                            type="calendar"
                                            size="16"
                                            color="#c0c4cc"
                                        ></uni-icons>
                                    </view>
                                </picker>
                            </view>
                            <view class="separator">-</view>
                            <view class="picker-item">
                                <view class="picker-input disabled">
                                    <text class="text-value">今天</text>
                                    <uni-icons
                                        type="calendar"
                                        size="16"
                                        color="#c0c4cc"
                                    ></uni-icons>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="dropdown-footer">
                        <up-button class="btn-reset" @tap="resetDateFilter">重置</up-button>
                        <up-button class="btn-confirm" type="primary" @tap="handleConfirm">
                            确定
                        </up-button>
                    </view>
                </view>
            </up-dropdown-item>
        </up-dropdown>
    </su-sticky>
</template>

<script setup>
    import { computed, ref } from 'vue';

    const props = defineProps({
        modelValue: {
            type: Object,
            default: () => ({
                status: '',
                startTimeStart: '',
                startTimeEnd: '',
                endTimeStart: '',
                endTimeEnd: '',
                actualEndTimeStart: '',
                actualEndTimeEnd: '',
            }),
        },
    });

    const emit = defineEmits(['update:modelValue', 'search']);

    const uDropdown = ref(null);

    // 获取今天日期
    const getToday = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const today = getToday();

    // 定义需要同步的字段
    const dateFields = [
        'status',
        'startTimeStart',
        'startTimeEnd',
        'endTimeStart',
        'endTimeEnd',
        'actualEndTimeStart',
        'actualEndTimeEnd',
    ];

    // 使用 computed 实现双向绑定
    const localSearchForm = computed({
        get() {
            const form = {};
            dateFields.forEach((field) => {
                form[field] = props.modelValue[field] || '';
            });
            return form;
        },
        set(val) {
            emit('update:modelValue', {
                ...props.modelValue,
                ...val,
            });
        },
    });

    // 状态选项与动态标题（模板显示选中项的 label）
    const statusOptions = [
        { label: '不限', value: '' },
        { label: '待签署', value: '0' },
        { label: '已签署', value: '1' },
        { label: '已退房', value: '2' },
        { label: '租约快到期', value: '3' },
    ];

    const statusLabel = computed(() => {
        const val = localSearchForm.value.status;
        const opt = statusOptions.find((o) => o.value === val);
        return opt ? opt.label : '租约状态';
    });

    // 更新日期
    const updateDate = (key, e) => {
        const date = e.detail.value;
        const newValue = { ...localSearchForm.value };
        newValue[key] = date;
        localSearchForm.value = newValue;
    };

    // 重置日期筛选
    const resetDateFilter = () => {
        const newValue = { ...localSearchForm.value };
        newValue.startTimeStart = '';
        newValue.startTimeEnd = '';
        newValue.endTimeStart = '';
        newValue.endTimeEnd = '';
        newValue.actualEndTimeStart = '';
        newValue.actualEndTimeEnd = '';
        localSearchForm.value = newValue;
    };

    const handleConfirm = () => {
        uDropdown.value?.close();

        const formData = { ...localSearchForm.value };

        // 更新父组件并触发搜索
        emit('update:modelValue', {
            ...props.modelValue,
            ...formData,
        });
        emit('search', true);
    };
</script>

<style lang="scss" scoped>
    :deep(.u-cell__title-text) {
        font-size: $tx-sm !important;
    }

    .dropdown-slot-content {
        display: flex;
        flex-direction: column;
        padding-top: 20rpx;
        background-color: $white;
    }

    .filter-box {
        margin-bottom: 30rpx;

        .filter-title {
            font-size: 26rpx;
            color: #333;
            padding: 0 30rpx;
            margin-bottom: 20rpx;
        }
    }

    .date-range-box {
        padding: 0 30rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .picker-item {
            flex: 1;
        }

        .picker-input {
            height: 70rpx;
            border: 1px solid #dcdfe6;
            border-radius: 8rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20rpx;
            background-color: #fff;

            .text-value {
                color: #999;
                font-size: 26rpx;
            }

            .text-placeholder {
                color: #999;
                font-size: 26rpx;
            }

            &.disabled {
                background-color: #f5f7fa;
                cursor: not-allowed;
            }
        }

        .separator {
            margin: 0 20rpx;
            color: #999;
            font-size: 28rpx;
        }
    }

    .dropdown-footer {
        display: flex;
        margin-top: 20rpx;

        .btn-reset {
            flex: 1;
        }
        .btn-confirm {
            flex: 2;
        }
    }
</style>
