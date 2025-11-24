<template>
    <s-layout title="首页" tabbar="/pages/index/index">
        <Agent v-if="role === 'agent'" />
        <Landlord v-else-if="role === 'landlord'" />
        <s-empty v-else icon="/static/data-empty.png" text="未知身份，请联系管理员" />
    </s-layout>
</template>

<script setup>
    import { ref } from 'vue';
    import { onLoad } from '@dcloudio/uni-app';
    import Agent from './agent.vue';
    import Landlord from './landlord.vue';

    const role = ref('landlord');

    onLoad(() => {
        uni.hideTabBar({
            fail: () => {},
        });
    });
</script>
