<template>
    <s-layout
        title="选择小区"
        tools="search"
        :defaultSearch="state.communityName"
        placeholderText="搜索小区名"
        @searchInput="onInput"
        class="page-select-house"
    >
        <template #right>
            <up-text type="primary" text="取消" size="14" class="ss-p-l-8" @tap="cancel"></up-text>
        </template>
        <uni-group
            :title="state.communityName ? '小区' : '已录入小区'"
            style="margin-top: 0"
            @scrolltolower="loadmore"
        >
            <up-list @scrolltolower="loadmore" height="100%">
                <up-list-item v-for="(item, index) in houseList" :key="index">
                    <up-cell :title="item.name" :border="true" clickable @click="selectHouse(item)">
                        <template #icon>
                            <s-icon
                                v-if="!state.communityName"
                                name="history"
                                size="34"
                                color="#bbb"
                                class="ss-m-r-20"
                            />
                        </template>
                    </up-cell>
                </up-list-item>
                <view v-if="houseList.length === 0 && state.listParams.status !== 'loading'">
                    <s-empty icon="/static/data-empty.png" />
                </view>
                <uni-load-more
                    v-if="houseList.length > 0 || state.listParams.status === 'loading'"
                    :status="state.listParams.status"
                />
            </up-list>
        </uni-group>
    </s-layout>
</template>

<script setup>
    import sheep from '@/sheep';
    import { onLoad } from '@dcloudio/uni-app';
    import { debounce } from 'lodash-es';
    import { ref, reactive } from 'vue';
    import HouseApi from '@/sheep/api/house';

    const state = reactive({
        communityName: '',
        listParams: {
            page: 1,
            pageSize: 20,
            status: 'more',
        },
    });

    const houseList = ref([]);

    const onInput = debounce((value) => {
        state.communityName = value;
        state.listParams.page = 1;
        state.listParams.status = 'more';
        houseList.value = [];
        loadmore();
    }, 300);

    const loadmore = async () => {
        if (state.listParams.status === 'loading' || state.listParams.status === 'noMore') return;
        state.listParams.status = 'loading';
        const { code, data } = await HouseApi.getHouseList({
            communityName: state.communityName,
            page: state.listParams.page,
            pageSize: state.listParams.pageSize,
        });
        if (code === 0) {
            if (Array.isArray(data) && data.length > 0) {
                houseList.value.push(...data);
                if (data.length < state.listParams.pageSize) {
                    state.listParams.status = 'noMore';
                } else {
                    state.listParams.page++;
                    state.listParams.status = 'more';
                }
            } else {
                state.listParams.status = 'noMore';
            }
        } else {
            // 模拟数据逻辑
            if (state.listParams.page > 10) {
                state.listParams.status = 'noMore';
                return;
            }
            await new Promise((resolve) => setTimeout(resolve, 500));
            state.listParams.status = 'more';
            houseList.value.push(
                ...new Array(20).fill(null).map((item, index) => ({
                    id: (state.listParams.page - 1) * 20 + index + 1,
                    name: '测试小区-' + ((state.listParams.page - 1) * 20 + index + 1),
                })),
            );
            state.listParams.page++;
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
            state.communityName = route.options.communityName;
        }
        loadmore();
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
