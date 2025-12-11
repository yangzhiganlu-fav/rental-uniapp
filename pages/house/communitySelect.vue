<template>
    <s-layout
        title="选择小区"
        tools="search"
        v-model:searchText="communityName"
        placeholderText="搜索小区名"
        class="house-select"
        @search="fetchCommunityList"
    >
        <template #right>
            <up-text type="primary" text="取消" size="12" class="ss-p-l-8" @tap="cancel"></up-text>
        </template>
        <uni-group title="小区" style="margin-top: 0">
            <up-list v-if="houseList?.length" height="100%">
                <up-list-item v-for="house in houseList" :key="house.id">
                    <up-cell
                        :title="house.communityName"
                        :border="true"
                        clickable
                        @click="selectHouse(house)"
                    ></up-cell>
                </up-list-item>
            </up-list>
            <s-empty v-else icon="/static/data-empty.png" text="暂无数据" />
        </uni-group>
    </s-layout>
</template>

<script setup>
    import sheep from '@/sheep';
    import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app';
    import { ref } from 'vue';
    import HouseApi from '@/sheep/api/house';

    const communityName = ref('');

    const houseList = ref([]);

    const fetchCommunityList = async () => {
        const params = {
            communityName: communityName.value || '',
            isExist: true,
        };
        const { code, data } = await HouseApi.getCommunityList(params);
        if (code === 0) {
            houseList.value = data.reduce((accumulator, current) => {
                if (current.list && Array.isArray(current.list)) {
                    return accumulator.concat(current.list);
                }
                return accumulator;
            }, []);
        } else {
            houseList.value = [];
        }
    };

    const selectHouse = (item) => {
        uni.$emit('SELECT_COMMUNITY', item);
        sheep.$router.back();
    };

    const cancel = () => {
        sheep.$router.back();
    };

    onLoad(() => {
        const route = sheep.$router.getCurrentRoute();
        if (route.options) {
            communityName.value = route.options.communityName;
        }
        fetchCommunityList();
    });

    onPullDownRefresh(async () => {
        await fetchCommunityList();
        uni.stopPullDownRefresh();
    });
</script>

<style lang="scss" scoped>
    :deep(.uni-group) {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    :deep(.uni-group__title) {
        flex-shrink: 0;
    }
    :deep(.uni-group__content) {
        padding: 0 !important;
        flex: 1;
        overflow: auto;
    }
</style>
