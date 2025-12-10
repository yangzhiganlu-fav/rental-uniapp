<template>
    <view>
        <up-cell class="blue-value hiden-line" title="钥匙位置" value="编辑" @click="openPicker">
            <template #right-icon>
                <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
            </template>
        </up-cell>
        <up-cell
            v-if="keyPlaceType"
            :title="formatTitle"
            :value="null"
            class="grey-label blue-value"
            @click="openRemarkModal"
        >
            <template #value>
                <view v-if="keyPlaceType === 1 || keyPlaceType === 6" class="ext-blue">
                    {{ keyPlace || '编辑' }}
                </view>
            </template>
            <template #right-icon>
                <uni-icons
                    v-if="keyPlaceType === 1 || keyPlaceType === 6"
                    type="arrowright"
                    size="20"
                    color="#999"
                ></uni-icons>
            </template>
        </up-cell>

        <up-picker
            :show="showPicker"
            :columns="options"
            :defaultIndex="[
                props.keyPlaceType
                    ? options[0].findIndex((item) => item.value === Number(props.keyPlaceType))
                    : 0,
            ]"
            keyName="label"
            valueName="value"
            closeOnClickOverlay
            @confirm="onConfirm"
        ></up-picker>

        <up-modal
            :show="showRemarkModal"
            showCancelButton
            title="钥匙位置备注"
            width="500rpx"
            class="form-sm"
            @confirm="onRemarkConfirm"
            @cancel="showRemarkModal = false"
            @close="onRemarkClose"
        >
            <up-textarea
                v-model.trim="tempRemark"
                placeholder="请输入钥匙位置备注信息"
            ></up-textarea>
        </up-modal>
    </view>
</template>

<script setup>
    import { ref, computed } from 'vue';

    const props = defineProps({
        keyPlaceType: {
            type: [String, Number],
            default: '',
        },
        keyPlace: {
            type: String,
            default: '',
        },
    });

    const emit = defineEmits(['save']);

    const showPicker = ref(false);
    const tempValue = ref([]);
    const showRemarkModal = ref(false);
    const tempRemark = ref('');
    // 1：密码锁 2：房东手里 3：水表箱 4：电表箱 5：门后地毯 6：其他位置
    const options = [
        [
            { label: '密码锁', value: 1 },
            { label: '房东手里', value: 2 },
            { label: '水表箱', value: 3 },
            { label: '电表箱', value: 4 },
            { label: '门后地毯', value: 5 },
            { label: '其他位置', value: 6 },
        ],
    ];

    const formatTitle = computed(() => {
        return options[0].find((item) => item.value === Number(props.keyPlaceType))?.label || '';
    });

    const openPicker = () => {
        tempValue.value = props.keyPlaceType ? [props.keyPlaceType] : [];
        showPicker.value = true;
    };

    const onConfirm = (e) => {
        const newValue = e.value[0].value;
        if (newValue === props.keyPlaceType) {
            showPicker.value = false;
            return;
        }
        if ((newValue !== 1) & (newValue !== 6)) {
            emit('save', {
                keyPlaceType: newValue,
                keyPlace: '',
            });
        } else {
            emit('save', {
                keyPlaceType: newValue,
                keyPlace: props.keyPlace,
            });
        }
        showPicker.value = false;
    };

    const openRemarkModal = () => {
        if (!props.keyPlaceType || (props.keyPlaceType !== 1 && props.keyPlaceType !== 6)) {
            return;
        }
        tempRemark.value = props.keyPlace;
        showRemarkModal.value = true;
    };

    const onRemarkConfirm = () => {
        showRemarkModal.value = false;
        emit('save', {
            keyPlaceType: props.keyPlaceType,
            keyPlace: tempRemark.value,
        });
    };

    const onRemarkClose = () => {
        tempRemark.value = '';
    };
</script>

<style lang="scss" scoped>
    .grey-label {
        :deep(.u-cell__title-text) {
            color: $dark-9;
        }
    }

    .blue-value {
        :deep(.u-cell__value) {
            color: $blue-light;
        }
    }

    .grey-value {
        :deep(.u-cell__value) {
            color: $dark-9;
        }
    }

    .hiden-line {
        :deep(.u-line) {
            display: none;
        }
    }

    .ext-blue {
        color: #3c9cff;
        font-size: 28rpx;
    }
</style>
