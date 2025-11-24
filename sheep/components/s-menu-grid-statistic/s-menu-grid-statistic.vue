<!-- 装修基础组件：宫格导航 -->
<template>
    <view :style="[bgStyle, { marginLeft: `${data.space}px` }]">
        <!-- 标题行（可选），不影响下面的 grid 布局 -->
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
            <uni-grid-item v-for="(item, index) in data.list" :key="index">
                <view class="grid-item-box ss-flex ss-flex-col ss-row-center ss-col-center">
                    <view class="title-box ss-flex ss-flex-col ss-row-center ss-col-center">
                        <view
                            class="grid-text flex-center"
                            :style="{
                                ...(item.titleStyle || {}),
                            }"
                        >
                            <view
                                v-if="item.titlePrefix"
                                :style="{ ...(item.titlePrefixStyle || { marginRight: '4rpx' }) }"
                            >
                                {{ item.titlePrefix }}
                            </view>
                            <view>{{ item.title }}</view>
                            <view
                                v-if="item.titleAppend"
                                :style="{ ...(item.titleAppendStyle || { marginLeft: '4rpx' }) }"
                            >
                                {{ item.titleAppend }}
                            </view>
                        </view>
                        <view
                            class="grid-tip flex-center mt-4"
                            :style="{
                                ...(item.subtitleStyle || {}),
                            }"
                        >
                            <view
                                v-if="item.subtitlePrefix"
                                :style="{
                                    ...(item.subtitlePrefixStyle || { marginRight: '4rpx' }),
                                }"
                            >
                                {{ item.subtitlePrefix }}
                            </view>
                            <view>
                                {{ item.subtitle }}
                            </view>
                            <view
                                v-if="item.subtitleAppend"
                                :style="{ ...(item.subtitleAppendStyle || { marginLeft: '4rpx' }) }"
                            >
                                {{ item.subtitleAppend }}
                            </view>
                        </view>
                        <view
                            class="grid-comment flex-center mt-4"
                            :style="{ color: item.commentColor }"
                        >
                            <view
                                v-if="item.commentPrefix"
                                :style="{ ...(item.commentPrefixStyle || { marginRight: '4rpx' }) }"
                            >
                                {{ item.commentPrefix }}
                            </view>
                            <view>
                                {{ item.comment }}
                            </view>
                            <view
                                v-if="item.commentAppend"
                                :style="{ ...(item.commentAppendStyle || { marginLeft: '4rpx' }) }"
                            >
                                {{ item.commentAppend }}
                            </view>
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
            .grid-text {
                font-size: 32rpx;
                font-weight: bold;
                white-space: nowrap;
                text-align: center;
            }
            .grid-tip {
                font-size: 24rpx;
                white-space: nowrap;
                text-align: center;
            }
            .grid-comment {
                font-size: 24rpx;
                white-space: nowrap;
                text-align: center;
            }
        }
    }
    .menu-title-bg {
        padding: 16rpx;
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
    .flex-center {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .mt-4 {
        margin-bottom: 4rpx;
    }
</style>
