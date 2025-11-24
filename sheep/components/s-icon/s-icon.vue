<template>
    <view
        class="s-icon iconfont"
        :class="['icon-' + name]"
        :style="[iconStyle]"
        @tap="onClick"
    ></view>
</template>

<script>
    import { addUnit } from '@/sheep/helper';

    export default {
        name: 's-icon',
        props: {
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
        },
        computed: {
            iconStyle() {
                return {
                    color: this.color,
                    fontSize: addUnit(this.size, 'rpx'),
                    ...this.customStyle,
                };
            },
        },
        methods: {
            onClick(e) {
                this.$emit('click', e);
            },
        },
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
