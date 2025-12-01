<template>
    <s-layout tabbar="/pages/index/index">
        <template #center>
            <!-- 显示房源统计信息，点击可切换统计维度 -->
            <view class="mine-house-count" @tap="toggleHouseCountPopup">
                <view>王某某(分散式)(100000间)</view>
                <uni-icons
                    type="right"
                    size="14"
                    :class="[showHouseCountPopup ? '-rotate-90' : 'rotate-90']"
                ></uni-icons>
            </view>
        </template>

        <!-- 切换房东手中的房源统计维度弹窗 -->
        <my-house-count-popup v-model:show="showHouseCountPopup" @change="onHouseCountTypeChange" />

        <scroll-view
            scroll-y
            refresher-enabled
            :refresher-triggered="isTriggered"
            @refresherrefresh="onRefresh"
            style="flex: 1; min-height: 0"
        >
            <Agent v-if="role === 'agent'" />
            <Landlord v-else-if="role === 'landlord'" />
            <s-empty v-else icon="/static/data-empty.png" text="未知身份，请联系管理员" />
        </scroll-view>
    </s-layout>
</template>

<script setup>
    import { ref } from 'vue';
    import sheep from '@/sheep';
    import Agent from './agent.vue';
    import Landlord from './landlord.vue';
    import $share from '@/sheep/platform/share';
    import { onLoad, onPageScroll, onPullDownRefresh } from '@dcloudio/uni-app';
    import MyHouseCountPopup from '@/pages/house/components/popup/myHouseCountPopup.vue';

    const role = ref('landlord');
    const isTriggered = ref(false);
    const showHouseCountPopup = ref(false);

    const toggleHouseCountPopup = () => {
        showHouseCountPopup.value = !showHouseCountPopup.value;
    };

    const onHouseCountTypeChange = (val) => {
        console.log('房源统计维度切换为:', val);
    };

    onLoad((options) => {
        uni.hideTabBar({
            fail: () => {},
        });
        // #ifdef MP
        // 小程序识别二维码
        if (options.scene) {
            const sceneParams = decodeURIComponent(options.scene).split('=');
            console.log('sceneParams=>', sceneParams);
            options[sceneParams[0]] = sceneParams[1];
        }
        // #endif

        // 预览模板
        if (options.templateId) {
            sheep.$store('app').init(options.templateId);
        }

        // 解析分享信息
        if (options.spm) {
            $share.decryptSpm(options.spm);
        }

        // 进入指定页面(完整页面路径)
        if (options.page) {
            sheep.$router.go(decodeURIComponent(options.page));
        }
    });

    async function onRefresh() {
        isTriggered.value = true;
        await sheep.$store('app').init();
        setTimeout(() => {
            isTriggered.value = false;
        }, 800);
    }
</script>

<style lang="scss" scoped>
    .mine-house-count {
        display: flex;
        align-items: center;

        .uni-icons {
            margin-left: 12rpx;
        }

        .-rotate-90 {
            transform: rotate(-90deg);
            transition: all 0.3s;
        }

        .rotate-90 {
            transform: rotate(90deg);
            transition: all 0.3s;
        }
    }
</style>
