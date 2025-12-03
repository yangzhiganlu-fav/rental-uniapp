<template>
    <su-popup :show="showPopup" type="top" :space="sys_navbar" @maskClick="close">
        <view class="search-popup-container">
            <view class="search-box">
                <uni-easyinput
                    v-model.trim="keyword"
                    prefixIcon="search"
                    placeholder="请输入搜索内容"
                    :inputBorder="false"
                    :clearable="false"
                    @confirm="search"
                ></uni-easyinput>
            </view>
            <view class="search-btn" @tap="search">查询</view>
        </view>
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

    const emits = defineEmits(['update:show', 'search']);

    const sys_navbar = sheep.$platform.navbar;
    const keyword = ref('');

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

    const search = () => {
        emits('search', keyword.value);
        close();
    };
</script>

<style lang="scss" scoped>
    .search-popup-container {
        display: flex;
        align-items: center;
        padding: 20rpx;
        background-color: #fff;
        border-top: 2rpx solid #e5e5e5;
    }

    .search-box {
        flex: 1;
        background-color: #f5f5f5;
        border-radius: 30rpx;
        padding: 0 20rpx;
        margin-right: 20rpx;

        :deep(.uni-easyinput__content) {
            background-color: transparent !important;
            border: none !important;
        }
    }

    .search-btn {
        font-size: 28rpx;
        color: $blue;
        padding: 10rpx 20rpx;
    }
</style>
