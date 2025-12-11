<template>
    <view>
        <up-form-item
            label="补充约定"
            prop="agree"
            class="border-none"
            :borderBottom="true"
            @click="showPicker = true"
        >
            <view class="edit-text">编辑</view>
            <template #right>
                <up-icon name="arrow-right" class="ss-p-l-20"></up-icon>
            </template>
        </up-form-item>

        <up-form-item label-width="0">
            <view class="custom-textarea">
                <view v-for="(option, index) in displayList" :key="index" class="textarea-item">
                    {{ option.label }}
                </view>
            </view>
        </up-form-item>

        <s-select-popup
            v-model:show="showPicker"
            title="补充约定"
            :list="options"
            :default-values="selectedValues"
            value-key="value"
            label-key="label"
            @confirm="handleConfirm"
        >
        </s-select-popup>
    </view>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue';
    import DictApi from '@/sheep/api/system/dict';

    const props = defineProps({
        value: {
            type: Array,
            default: () => [],
        },
    });

    const emit = defineEmits(['change']);

    const showPicker = ref(false);

    const options = ref([]);

    onMounted(() => {
        fetchOptions();
    });

    const fetchOptions = async () => {
        const { code, data } = await DictApi.getDictDataListByTypePage('contract_agree');
        if (code === 0 && data) {
            options.value =
                data.list?.map((item) => ({
                    label: item.value,
                    value: item.label,
                })) || [];
        }
    };

    const selectedValues = ref([...props.value]);

    const displayList = computed(() =>
        options.value.filter((option) => selectedValues.value.includes(option.value)),
    );

    const handleConfirm = (values) => {
        selectedValues.value = values;
        const data = {
            agree: values,
        };
        emit('change', data);
    };
</script>

<style lang="scss" scoped>
    .custom-textarea {
        width: 100%;
        border: 1px solid $border-color;
        border-radius: 8rpx;
        padding: 20rpx;
        min-height: 100rpx;
        background-color: $gray-f;
        min-height: 300rpx;
    }

    .textarea-item {
        font-size: 28rpx;
        color: $dark-7;
        margin-bottom: 16rpx;
    }

    .textarea-item:last-child {
        margin-bottom: 0;
    }

    .edit-text {
        width: 100%;
        text-align: right;
        color: $blue-light;
    }
</style>
