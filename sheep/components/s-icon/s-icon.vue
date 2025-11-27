<template>
    <view
        class="s-icon iconfont"
        :class="['icon-' + name]"
        :style="[iconStyle]"
        @tap="onClick"
    ></view>
</template>

<script setup>
    import { computed } from 'vue';
    import { addUnit } from '@/sheep/helper';

    const props = defineProps({
        name: {
            type: String,
            default: '',
        },
        color: {
            type: String,
            default: '',
        },
        size: {
            type: [Number, String],
            default: 32,
        },
        customStyle: {
            type: Object,
            default: () => ({}),
        },
    });

    const emits = defineEmits(['click']);

    const iconStyle = computed(() => {
        return {
            color: props.color,
            fontSize: addUnit(props.size, 'rpx'),
            ...props.customStyle,
        };
    });

    const onClick = (e) => {
        emits('click', e);
    };
</script>

<style>
    @import url('/static/font/iconfont.css');
</style>

<style scoped>
    .s-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
    }
</style>
