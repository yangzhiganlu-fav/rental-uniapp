<template>
    <view>
        <!-- 起始日 -->
        <up-form-item label="起租日" prop="startDate" @click="handleShowStartPicker">
            <up-input
                v-model="startDate"
                disabled
                disabledColor="#ffffff"
                placeholder="请选择起租日"
                border="none"
                :disabled="disableStartDate"
                placeholderClass="placeholder-align-right"
            ></up-input>
            <template v-if="!disableStartDate" #right>
                <up-icon name="arrow-right" class="ss-p-l-20"></up-icon>
            </template>
        </up-form-item>

        <!-- 快捷选项 -->
        <up-form-item :borderBottom="true" class="shortcut">
            <uni-data-checkbox
                mode="tag"
                v-model="shortcutValue"
                :localdata="shortcutOptions"
                :disabled="!startDate"
                @change="handleShortcutChange"
            ></uni-data-checkbox>
        </up-form-item>

        <!-- 终止日 -->
        <up-form-item
            label="终止日"
            prop="endDate"
            :borderBottom="true"
            @click="showEndPicker = true"
        >
            <up-input
                v-model="endDate"
                disabled
                disabledColor="#ffffff"
                placeholder="请选择终止日"
                border="none"
                placeholderClass="placeholder-align-right"
            ></up-input>
            <template #right>
                <up-icon name="arrow-right" class="ss-p-l-20"></up-icon>
            </template>
        </up-form-item>

        <!-- 起始日选择器 -->
        <up-calendar
            :show="showStartPicker"
            mode="single"
            showLunar
            closeOnClickOverlay
            :monthNum="12"
            :showTitle="false"
            @close="showStartPicker = false"
            @confirm="handleStartConfirm"
        ></up-calendar>

        <!-- 终止日选择器 -->
        <up-calendar
            :show="showEndPicker"
            mode="single"
            showLunar
            closeOnClickOverlay
            :monthNum="12"
            :showTitle="false"
            @close="showEndPicker = false"
            @confirm="handleEndConfirm"
        ></up-calendar>
    </view>
</template>

<script setup>
    import { ref, watch } from 'vue';

    const props = defineProps({
        startDateValue: {
            type: String,
            default: '',
        },
        endDateValue: {
            type: String,
            default: '',
        },
        disableStartDate: {
            type: Boolean,
            default: false,
        },
        disableEndDate: {
            type: Boolean,
            default: false,
        },
    });

    const emit = defineEmits(['change']);

    const showStartPicker = ref(false);
    const showEndPicker = ref(false);
    const startDate = ref(props.startDateValue);
    const endDate = ref(props.endDateValue);
    const shortcutValue = ref('');

    const shortcutOptions = ref([
        { text: '1年', value: 12 },
        { text: '6个月', value: 6 },
        { text: '3个月', value: 3 },
        { text: '1个月', value: 1 },
    ]);

    watch(
        () => [props.startDateValue, props.endDateValue],
        (newVal) => {
            startDate.value = newVal[0];
            endDate.value = newVal[1];
        },
        { immediate: true, deep: true },
    );

    const handleShowStartPicker = () => {
        if (props.disableStartDate) {
            return;
        }
        showStartPicker.value = true;
    };

    const handleStartConfirm = (date) => {
        const selectedDate = date[0];
        startDate.value = selectedDate;
        emit('change', {
            startTime: selectedDate,
            endTime: endDate.value,
        });
        shortcutValue.value = '';
        showStartPicker.value = false;
    };

    const handleEndConfirm = (date) => {
        const selectedDate = date[0];
        endDate.value = selectedDate;
        emit('change', {
            startTime: startDate.value,
            endTime: selectedDate,
        });
        // 计算并回显快捷选项
        calculateShortcutValue();
        showEndPicker.value = false;
    };

    const calculateEndDate = (shortcut, startDate) => {
        const monthsToAdd = shortcut;
        const start = new Date(startDate);
        const end = new Date(start.getFullYear(), start.getMonth() + monthsToAdd, start.getDate());
        const year = end.getFullYear();
        const month = String(end.getMonth() + 1).padStart(2, '0');
        const day = String(end.getDate()).padStart(2, '0');
        const selectedDate = `${year}-${month}-${day}`;
        return selectedDate;
    };

    const handleShortcutChange = () => {
        if (!startDate.value) {
            shortcutValue.value = '';
            uni.showToast({
                title: '请先选择起租日',
                icon: 'none',
            });
            return;
        }

        const selectedDate = calculateEndDate(shortcutValue.value, startDate.value);

        endDate.value = selectedDate;
        emit('change', {
            startTime: startDate.value,
            endTime: selectedDate,
        });
    };

    const calculateShortcutValue = () => {
        if (!startDate.value || !endDate.value) {
            shortcutValue.value = '';
            return;
        }
        shortcutValue.value = '';
        const months = shortcutOptions.value.map((item) => item.value);
        for (let i = 0; i < months.length; i++) {
            const calculatedEndDate = calculateEndDate(months[i], startDate.value);
            if (calculatedEndDate === endDate.value) {
                shortcutValue.value = months[i];
                return;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .shortcut {
        :deep(.is--tag) {
            margin: 0;
            flex: 1 !important;
            padding: 16rpx 32rpx !important;
            background-color: $white !important;
            color: $dark-6 !important;
            .checklist-text {
                font-size: 26rpx !important;
            }
        }
        :deep(.is--tag.is-checked) {
            border-color: $orange-light !important;
            background-color: $white !important;

            & .checklist-text {
                color: $orange-light !important;
            }
        }
        :deep(.checklist-content) {
            justify-content: center !important;
        }
    }
</style>
