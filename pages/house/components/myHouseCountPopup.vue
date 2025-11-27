<template>
    <su-popup :show="showPopup" type="top" :space="sys_navbar" @maskClick="close">
        <view class="house-count-container">
            <text>房源数量统计显示：</text>
            <uni-data-checkbox
                v-model="indicatorValue"
                :localdata="[
                    { text: '房源套数', value: '1' },
                    { text: '房间间数', value: '2' },
                ]"
                @change="onChange"
            />
        </view>
        <uni-group title="我的机构列表" mode="card">
            <view class="org-list-item">王某某(分散式)</view>
        </uni-group>
    </su-popup>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import sheep from '@/sheep';

    const props = defineProps({
        show: {
            type: Boolean,
            default: false,
        },
    });

    const emits = defineEmits(['update:show', 'change']);

    const sys_navbar = sheep.$platform.navbar;
    const indicatorValue = ref('1');

    const showPopup = computed({
        get() {
            return props.show;
        },
        set(val) {
            emits('update:show', val);
        },
    });

    const close = () => {
        showPopup.value = false;
    };

    const onChange = (e) => {
        emits('change', e.detail.value);
    };
</script>

<style lang="scss" scoped>
    .house-count-container {
        display: flex;
        align-items: center;
        padding: 10px;
        font-size: 14px;
        border-top: 1px solid #e5e5e5;
    }

    .org-list-item {
        text-align: center;
        font-size: 12px !important;
        color: #2979ff;
    }

    :deep(.checklist-group) {
        justify-content: flex-end;
    }

    :deep(.checklist-text) {
        font-size: 14px !important;
    }

    :deep(.u-cell__title-text) {
        font-size: 12px !important;
    }

    :deep(.uni-group__title) {
        padding-left: 0 !important;
        justify-content: center;
    }
</style>
