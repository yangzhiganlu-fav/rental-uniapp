<template>
    <s-layout title="录入房源" :bgStyle="{ color: '#fff' }">
        <template #navbarRight>
            <button type="primary" size="mini" @tap="onSave">保存</button>
        </template>
        <su-sticky>
            <su-tabs
                :list="tabMaps"
                :scrollable="false"
                :current="currentTab"
                @change="onTabsChange"
            />
        </su-sticky>
        <s-empty
            v-if="!community?.id"
            showAction
            actionText="请选择小区"
            action-url="/pages/house/select"
            icon="/static/data-empty.png"
        />
        <add-house-form v-else ref="addHouseFormRef" :tab="currentTab" />
    </s-layout>
</template>

<script setup>
    import sheep from '@/sheep';
    import { ref } from 'vue';
    import { onShow } from '@dcloudio/uni-app';
    import addHouseForm from './components/addHouseForm.vue';

    const community = ref(null);

    onShow(() => {
        const route = sheep.$router.getCurrentRoute();
        if (route.options?.data) {
            community.value = JSON.parse(route.options.data || '{}');
        }
    });

    const tabMaps = [
        { name: '整租', value: 1 },
        { name: '合租', value: 0 },
    ];

    const currentTab = ref(0);

    const onTabsChange = (e) => {
        currentTab.value = e.index;
    };

    const addHouseFormRef = ref(null);

    const onSave = async () => {
        if (addHouseFormRef.value) {
            const data = await addHouseFormRef.value.validateAndReturnData();
            if (data) {
                uni.showToast({
                    title: '保存成功',
                    icon: 'success',
                });
            }
        }
    };
</script>
