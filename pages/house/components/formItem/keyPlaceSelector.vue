<!-- 钥匙位置选择表单项组件-包含action-sheet选择器和备注输入框 -->
<template>
    <up-form-item label="钥匙位置" :borderBottom="true" @click="showPicker">
        <up-input
            v-model.trim="text"
            border="none"
            disabled
            disabledColor="#ffffff"
            placeholder="请选择钥匙位置"
            placeholderClass="placeholder-align-right"
            :clearable="false"
        ></up-input>
        <template #right>
            <up-icon name="arrow-right" class="ss-m-l-12"></up-icon>
        </template>
    </up-form-item>
    <up-form-item v-if="showRemarks" label="备注" :borderBottom="true">
        <up-input
            v-model.trim="keyPlaceValue"
            border="none"
            placeholder="请输入钥匙位置或密码锁密码"
            placeholderClass="placeholder-align-right"
            :clearable="false"
        ></up-input>
    </up-form-item>
    <up-action-sheet
        :actions="options"
        title="钥匙位置"
        :show="show"
        closeOnClickOverlay
        @cancel="show = false"
        @select="onSelect"
    ></up-action-sheet>
</template>

<script setup>
    import { ref, computed } from 'vue';

    const props = defineProps({
        // 钥匙位置类型
        keyPlaceType: {
            type: [Number, String],
            required: true,
        },
        // 钥匙位置备注
        keyPlace: {
            type: String,
            default: '',
        },
    });

    const emit = defineEmits(['update:keyPlaceType', 'update:keyPlace']);

    const keyPlaceValue = computed({
        get() {
            return props.keyPlace;
        },
        set(value) {
            emit('update:keyPlace', value);
        },
    });

    const text = ref('');

    const show = ref(false);

    const options = [
        { name: '密码锁', value: 1 },
        { name: '房东手里', value: 2 },
        { name: '水表箱', value: 3 },
        { name: '电表箱', value: 4 },
        { name: '门后地毯', value: 5 },
        { name: '其他位置', value: 6 },
    ];

    // 判断是否需要显示备注（密码锁或其他位置）
    const showRemarks = computed(() => {
        return props.keyPlaceType === 1 || props.keyPlaceType === 6;
    });

    const showPicker = () => {
        show.value = true;
        uni.hideKeyboard();
    };

    const onSelect = (option) => {
        text.value = option.name;
        emit('update:keyPlaceType', option.value);
        show.value = false;
    };
</script>
