<template>
    <up-form-item label="租客性别" prop="renterSex" :borderBottom="true" @click="showActionSheet">
        <up-input
            v-model="displayValue"
            disabled
            disabledColor="#ffffff"
            placeholder="请选择性别"
            border="none"
            placeholderClass="placeholder-align-right"
        ></up-input>
        <template #right>
            <up-icon name="arrow-right" class="ss-p-l-20"></up-icon>
        </template>
    </up-form-item>

    <up-action-sheet
        :show="show"
        :actions="actions"
        title="请选择性别"
        @close="show = false"
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

    const show = ref(false);
    const actions = [
        { name: '男', value: 0 },
        { name: '女', value: 1 },
    ];

    const displayValue = computed(
        () => actions.find((action) => action.value == props.value)?.name || '',
    );

    const showActionSheet = () => {
        show.value = true;
        uni.hideKeyboard();
    };

    const handleSelect = (action) => {
        const data = {
            renterSex: action.value,
        };
        emit('change', data);
        show.value = false;
    };
</script>
