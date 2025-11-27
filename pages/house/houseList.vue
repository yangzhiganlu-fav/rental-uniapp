<template>
    <s-layout tabbar="/pages/house/houseList">
        <template #center>
            <view v-if="searchForm.selectedCommunity">
                {{ searchForm.selectedCommunity.name }}
            </view>
            <view v-else class="mine-house-count" @tap="toggle">
                <view>王某某(分散式)(100000间)</view>
                <uni-icons
                    type="right"
                    size="14"
                    :class="[show ? '-rotate-90' : 'rotate-90']"
                ></uni-icons>
            </view>
        </template>

        <template #right>
            <view v-if="searchForm.selectedCommunity" class="options-container">
                <up-text
                    type="primary"
                    text="取消"
                    size="14"
                    class="ss-p-l-8"
                    @tap="onCancel"
                ></up-text>
            </view>
            <view v-else class="options-container">
                <s-icon name="search" size="40" @click="navigateTo('/pages/house/houseSearch')" />
                <s-icon
                    name="xinzengfangjian"
                    size="40"
                    @click="navigateTo('/pages/house/houseAdd')"
                />
            </view>
        </template>

        <!-- 切换房东手中的房源统计维度弹窗 -->
        <my-house-count-popup v-model:show="show" @change="onIndicatorChange" />

        <!-- 筛选小区/房源弹框 -->
        <house-filter v-model:showSearch="showSearch" @search="handleSearch" />

        <!-- 小区列表 -->
        <house-community-list :list="communityList" @load="loadMore" />
    </s-layout>
</template>

<script setup>
    import sheep from '@/sheep';
    import { ref, reactive } from 'vue';
    import { onShow, onLoad, onUnload } from '@dcloudio/uni-app';
    import { cloneDeep, merge } from 'lodash-es';
    import HouseFilter from './components/houseFilter.vue';
    import HouseCommunityList from './components/houseCommunityList.vue';
    import MyHouseCountPopup from './components/myHouseCountPopup.vue';
    import room1 from '/static/room/room1.jpg';
    import room2 from '/static/room/room2.jpeg';
    import room3 from '/static/room/room3.jpeg';

    const sys_navbar = sheep.$platform.navbar;

    const show = ref(false);
    const showSearch = ref(false);

    const indicatorValue = ref('1');

    const toggle = () => {
        show.value = !show.value;
    };

    const onIndicatorChange = (val) => {
        indicatorValue.value = val;
    };

    const toggleSearch = () => {
        showSearch.value = !showSearch.value;
    };

    const searchForm = ref({
        selectedCommunity: null,
    });

    const handleSearch = (newSearchForm) => {
        searchForm.value = merge(cloneDeep(searchForm.value), cloneDeep(newSearchForm));
        console.log('searchForm updated:', searchForm.value);
        // TODO: 触发列表刷新
    };

    const onCancel = () => {
        searchForm.value.selectedCommunity = null;
    };

    const navigateTo = (url) => {
        sheep.$router.go(url);
    };

    const communityList = ref([]);

    const loadMore = async () => {
        // 直接mock数据
        const newCommunities = Array.from({ length: 1 }).map((_, index) => ({
            id: communityList.value.length + index + 1,
            name: `小区 ${communityList.value.length + index + 1}`,
            roomCount: 100,
            houseList: Array.from({ length: 3 }).map((__, houseIndex) => ({
                id: houseIndex + 1,
                isShared: houseIndex % 2 === 0,
                buildingNumber: Math.floor(Math.random() * 20) + 1,
                unitNumber: Math.floor(Math.random() * 10) + 1,
                roomNumber: Math.floor(Math.random() * 100) + 1,
                roomList: Array.from({ length: 3 }).map((___, roomIndex) => ({
                    id: roomIndex + 1,
                    rentalStatus: ['空置', '已租无租约', '已租有租约', '转租中', '装修中'][
                        Math.floor(Math.random() * 5)
                    ],
                    price: (Math.random() * 5000 + 1000).toFixed(2),
                    url: [room1, room2, room3][Math.floor(Math.random() * 3)],
                })),
            })),
        }));
        communityList.value = communityList.value.concat(newCommunities);
    };

    onLoad(() => {
        uni.$on('SELECT_SEARCH_TARGET', (data) => {
            show.value = false;
            showSearch.value = false;
            searchForm.value.selectedCommunity = data;
        });
    });

    onUnload(() => {
        uni.$off('SELECT_SEARCH_TARGET');
    });

    onShow(() => {
        loadMore();
    });
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

    .options-container {
        display: flex;
        align-items: center;
        gap: 24rpx;
        padding: 0 24rpx;
    }
</style>
