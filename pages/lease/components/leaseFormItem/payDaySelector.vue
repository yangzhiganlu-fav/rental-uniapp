<template>
    <up-form-item label="交租日设置" prop="payDay" :borderBottom="true" @click="showPicker = true">
        <up-input
            v-model="displayValue"
            disabled
            disabledColor="#ffffff"
            placeholder="请选择交租日"
            border="none"
            placeholderClass="placeholder-align-right"
        ></up-input>
        <template #right>
            <up-icon name="arrow-right" class="ss-p-l-20"></up-icon>
        </template>
    </up-form-item>

    <up-picker
        :show="showPicker"
        :columns="payDayColumns"
        keyName="label"
        valueName="value"
        @confirm="handleConfirm"
        @cancel="showPicker = false"
        @close="showPicker = false"
        @change="handleChange"
    ></up-picker>
</template>

<script setup>
    import { ref, reactive, computed } from 'vue';

    const props = defineProps({
        value: {
            type: [Number, String],
            default: '',
        },
    });

    const emit = defineEmits(['change']);

    const showPicker = ref(false);

    const payDayColumns = ref([
        [{ label: '每期提前', value: 'advance' }],
        Array.from({ length: 28 }, (_, i) => ({
            label: `${i + 1}天`,
            value: i + 1,
        })),
    ]);

    const displayValue = computed(() => (props.value ? `每期提前${props.value}天` : ''));

    const handleChange = (e) => {
        const { columnIndex, index } = e;
        if (columnIndex === 0) {
            const type = payDayColumns.value[0][index].value;
            if (type === 'fixed_date') {
                payDayColumns.value[1] = Array.from({ length: 28 }, (_, i) => ({
                    label: `每月${i + 1}日`,
                    value: i + 1,
                }));
            } else {
                payDayColumns.value[1] = Array.from({ length: 28 }, (_, i) => ({
                    label: `${i + 1}天`,
                    value: i + 1,
                }));
            }
        }
    };

    const handleConfirm = (e) => {
        const data = {
            payDateBefore: e.value[1].value,
        };
        emit('change', data);
        showPicker.value = false;
    };
</script>
