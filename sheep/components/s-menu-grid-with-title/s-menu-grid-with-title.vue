<!-- 装修基础组件：宫格导航 -->
<template>
    <view :style="[bgStyle, { marginLeft: `${data.space}px` }]">
        <view v-if="data.title" class="menu-title-row">
            <view
                v-if="data.titleIconBgColor"
                class="menu-title-bg"
                :style="{ backgroundColor: data.titleIconBgColor }"
            >
                <s-icon
                    v-if="data.titleIcon"
                    :name="data.titleIcon"
                    :size="data.titleIconSize || 36"
                    color="#fff"
                />
            </view>
            <s-icon
                v-else-if="data.titleIcon"
                :name="data.titleIcon"
                :size="data.titleIconSize || 36"
                :color="data.titleIconColor || '#333'"
            />
            <view class="menu-title-text" :style="{ color: data.titleColor || '#333' }">
                {{ data.title }}
            </view>
        </view>

        <uni-grid :showBorder="Boolean(data.border)" :column="data.column">
            <uni-grid-item
                v-for="(item, index) in data.list"
                :key="index"
                @tap="sheep.$router.go(item.url)"
            >
                <view class="grid-item-box ss-flex ss-flex-col ss-row-center ss-col-center">
                    <view class="img-box">
                        <view
                            class="tag-box"
                            v-if="item.badge.show"
                            :style="[
                                { background: item.badge.bgColor, color: item.badge.textColor },
                            ]"
                        >
                            {{ item.badge.text }}
                        </view>
                        <view
                            v-if="item.iconBgColor"
                            class="menu-bg"
                            :style="{ backgroundColor: item.iconBgColor }"
                        >
                            <s-icon
                                :name="item.iconUrl"
                                :size="item.iconSize"
                                color="#fff"
                            ></s-icon>
                        </view>
                        <s-icon
                            v-else
                            :name="item.iconUrl"
                            :size="item.iconSize"
                            :color="item.iconColor"
                        ></s-icon>
                    </view>

                    <view class="title-box ss-flex ss-flex-col ss-row-center ss-col-center">
                        <view class="grid-text" :style="[{ color: item.titleColor }]">
                            {{ item.title }}
                        </view>
                        <view class="grid-tip" :style="[{ color: item.subtitleColor }]">
                            {{ item.subtitle }}
                        </view>
                    </view>
                </view>
            </uni-grid-item>
        </uni-grid>
    </view>
</template>

<script setup>
    import sheep from '@/sheep';
    import { computed } from 'vue';

    const props = defineProps({
        // 装修数据
        data: {
            type: Object,
            default: () => ({}),
        },
        // 装修样式
        styles: {
            type: Object,
            default: () => ({}),
        },
    });
    // 设置背景样式
    const bgStyle = computed(() => {
        // 直接从 props.styles 解构
        const { bgType, bgImg, bgColor } = props.styles;

        // 根据 bgType 返回相应的样式
        return {
            background:
                bgType === 'img' ? `url(${bgImg}) no-repeat top center / 100% 100%` : bgColor,
        };
    });
</script>

<style lang="scss" scoped>
    .menu-image {
        width: 24px;
        height: 24px;
    }

    .menu-title-row {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;
        /* 向左偏移一些，使标题位置比 grid 略左，不影响 grid 布局 */
        transform: translateX(-8rpx);
        /* 保证标题不会遮挡其他内容 */
        z-index: 1;
    }

    .menu-title-text {
        font-size: 30rpx;
        font-weight: 600;
        margin-left: 10rpx;
    }

    .grid-item-box {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;

        .img-box {
            position: relative;

            .tag-box {
                position: absolute;
                z-index: 2;
                top: 0;
                right: 0;
                font-size: 2em;
                line-height: 1;
                padding: 0.4em 0.6em 0.3em;
                transform: scale(0.4) translateX(0.5em) translatey(-0.6em);
                transform-origin: 100% 0;
                border-radius: 200rpx;
                white-space: nowrap;
            }
        }

        .title-box {
            .grid-tip {
                font-size: 24rpx;
                white-space: nowrap;
                text-align: center;
            }
        }
    }
    .menu-title-bg {
        padding: 16rpx;
        margin-bottom: 8rpx;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .menu-bg {
        padding: 16rpx;
        border-radius: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
