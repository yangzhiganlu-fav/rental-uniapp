<template>
    <s-layout
        title="搜索"
        tools="search"
        :defaultSearch="state.keyword"
        placeholderText="搜索小区/门牌/姓名/手机号"
        @searchInput="onInput"
        class="page-house-search"
    >
        <template #right>
            <up-text type="primary" text="取消" size="12" class="ss-p-l-8" @tap="cancel"></up-text>
        </template>

        <view class="search-content" v-if="state.keyword">
            <!-- 小区 Section -->
            <uni-group title="小区" v-if="state.communityList.length" style="margin-top: 0">
                <up-cell
                    v-for="(item, index) in state.communityList"
                    :key="'c_' + index"
                    :border="true"
                    clickable
                    @click="onSelect(item)"
                >
                    <template #title>
                        <view class="ss-flex">
                            <text
                                v-for="(part, i) in getHighlightedText(item.name, state.keyword)"
                                :key="i"
                                :class="{ 'highlight-red': part.highlight }"
                            >
                                {{ part.text }}
                            </text>
                        </view>
                    </template>
                    <template #value>
                        <text>{{ item.count }}套</text>
                    </template>
                </up-cell>
            </uni-group>

            <!-- 租客 Section -->
            <uni-group title="租客" v-if="state.tenantList.length" style="margin-top: 0">
                <up-cell
                    v-for="(item, index) in state.tenantList"
                    :key="'t_' + index"
                    :border="true"
                    clickable
                    @click="onSelect(item)"
                >
                    <template #title>
                        <view class="ss-flex">
                            <text
                                v-for="(part, i) in getHighlightedText(item.name, state.keyword)"
                                :key="i"
                                :class="{ 'highlight-red': part.highlight }"
                            >
                                {{ part.text }}
                            </text>
                        </view>
                    </template>
                    <template #value>
                        <view class="ss-flex">
                            <text
                                v-for="(part, i) in getHighlightedText(item.mobile, state.keyword)"
                                :key="i"
                                :class="{ 'highlight-red': part.highlight }"
                            >
                                {{ part.text }}
                            </text>
                        </view>
                    </template>
                </up-cell>
            </uni-group>

            <!-- Empty State -->
            <view
                v-if="
                    state.hasSearched &&
                    state.communityList.length === 0 &&
                    state.tenantList.length === 0
                "
                class="ss-p-t-50"
            >
                <s-empty icon="/static/data-empty.png" text="未找到相关结果" />
            </view>
        </view>
    </s-layout>
</template>

<script setup>
    import sheep from '@/sheep';
    import { debounce } from 'lodash-es';
    import { reactive } from 'vue';

    const state = reactive({
        keyword: '',
        communityList: [],
        tenantList: [],
        hasSearched: false,
    });

    const onInput = debounce((value) => {
        state.keyword = value;
        if (!value) {
            state.communityList = [];
            state.tenantList = [];
            state.hasSearched = false;
            return;
        }
        search();
    }, 300);

    const search = async () => {
        state.hasSearched = true;

        // Mock Data Logic based on keyword
        const mockCommunities = [
            { id: 1, name: '绿地21城繁华里 ( 绿地青青家园 )', count: 3 },
            { id: 2, name: '万科城市花园', count: 1 },
        ];

        const mockTenants = [
            { id: 1, name: '', mobile: '13912759306' },
            { id: 2, name: '侯聪瑞', mobile: '13782311642' },
            { id: 3, name: '林开铺', mobile: '18621282933' },
            { id: 4, name: '侯虹宇', mobile: '19235103504' },
            { id: 5, name: '范锦明', mobile: '18576507960' },
            { id: 6, name: '邹明辉', mobile: '15137853792' },
            { id: 7, name: '洪庭梁', mobile: '13957055884' },
            { id: 8, name: '王文英', mobile: '13816674421' },
            { id: 9, name: '王亮', mobile: '13072188675' },
            { id: 10, name: '潘建云', mobile: '13601962582' },
        ];

        // Filter mocks
        state.communityList = mockCommunities.filter((c) => c.name.includes(state.keyword));
        state.tenantList = mockTenants.filter(
            (t) => (t.name && t.name.includes(state.keyword)) || t.mobile.includes(state.keyword),
        );
    };

    const getHighlightedText = (text, keyword) => {
        if (!text) return [];
        if (!keyword) return [{ text, highlight: false }];
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const parts = text.split(new RegExp(`(${escapedKeyword})`, 'gi'));
        return parts.map((part) => ({
            text: part,
            highlight: part.toLowerCase() === keyword.toLowerCase(),
        }));
    };

    const onSelect = (item) => {
        uni.$emit('SELECT_SEARCH_TARGET', item);
        sheep.$router.back();
    };

    const cancel = () => {
        sheep.$router.back();
    };
</script>

<style lang="scss" scoped>
    .page-house-search {
        :deep(.uni-searchbar__box) {
            border-radius: 30rpx !important;
        }
    }

    :deep(.uni-group__content) {
        padding: 0 !important;
    }
</style>
