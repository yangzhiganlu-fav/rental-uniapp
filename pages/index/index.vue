<template>
    <s-layout title="首页" tabbar="/pages/index/index" :bgStyle="{ color: '#f5f5f5' }">
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

    const role = ref('landlord');
    const isTriggered = ref(false);

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
