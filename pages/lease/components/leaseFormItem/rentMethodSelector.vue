<template>
    <up-form-item label="收租方式" prop="payMethod" :borderBottom="true" @click="showPicker = true">
        <up-input
            v-model="displayValue"
            disabled
            disabledColor="#ffffff"
            placeholder="请选择收租方式"
            border="none"
            placeholderClass="placeholder-align-right"
        ></up-input>
        <template #right>
            <up-icon name="arrow-right" class="ss-p-l-20"></up-icon>
        </template>
    </up-form-item>

    <up-action-sheet
        :show="showPicker"
        :actions="options"
        title="请选择收租方式"
        @close="showPicker = false"
        @select="handleSelect"
    >
    </up-action-sheet>
</template>

<script setup>
    import { ref, computed } from 'vue';

    const props = defineProps({
        value: {
            type: [Number, String],
            default: '',
        },
    });

    const emit = defineEmits(['change']);

    const showPicker = ref(false);
    const options = ref([
        { name: '押一付一', value: 1 },
        { name: '押一付二', value: 2 },
        { name: '押一付三', value: 3 },
        { name: '押二付一', value: 4 },
        { name: '押二付二', value: 5 },
        { name: '押二付三', value: 6 },
    ]);

    const displayValue = computed(
        () => options.value.find((option) => option.value === props.value)?.name || '',
    );

    const handleSelect = (action) => {
        const data = {
            payMethod: action.value,
        };
        emit('change', data);
        showPicker.value = false;
    };
</script>
