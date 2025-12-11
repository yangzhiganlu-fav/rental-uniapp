<template>
    <s-layout
        tabbar="/pages/house/index"
        tools="search"
        searchClearButton="auto"
        v-model:searchText="searchForm.searchText"
        placeholderText="小区/门牌号/房间号/姓名/手机号"
        @search="onCommunitySearch"
    >
        <template #right>
            <s-icon
                name="xinzengfangjian"
                size="40"
                class="ss-m-l-12"
                @tap="sheep.$router.go('/pages/house/addHouse')"
            />
        </template>

        <dropdown v-model="searchForm" @search="onSearch" />

        <community-group
            v-for="community in communityList"
            :key="community.communityId"
            :community="community"
            @room-click="onRoomClick"
            @room-add="onRoomAdd"
        />

        <up-loadmore :status="loadStatus" line fontSize="12" marginTop="16" marginBottom="16" />
    </s-layout>
</template>

<script setup>
    import sheep from '@/sheep';
    import { ref } from 'vue';
    import { onLoad, onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
    import { unionBy } from 'lodash-es';
    import Dropdown from './components/dropdown.vue';
    import CommunityGroup from './components/communityGroup.vue';
    import HouseApi from '@/sheep/api/house';

    const searchForm = ref({
        searchText: '',
        rentalStatus: '',
        communityIds: [],
        pageSize: 5,
        pageNo: 1,
    });

    const communityList = ref([]);

    const total = ref(0);

    const loadStatus = ref('loadmore'); // loadmore | loading | nomore

    const onSearch = async (isRefresh = true) => {
        // 防止重复加载
        if (loadStatus.value === 'loading') return;

        if (isRefresh) {
            communityList.value = [];
            total.value = 0;
            searchForm.value.pageNo = 1;
        }

        loadStatus.value = 'loading';

        const { code, data } = await HouseApi.getRoomPage(searchForm.value);

        if (code === 0 && data) {
            const newList = data.list || [];

            newList.forEach((newCommunity) => {
                const existingCommunity = communityList.value.find(
                    (c) => c.communityId === newCommunity.communityId,
                );

                if (existingCommunity) {
                    // 合并 houseList
                    newCommunity.houseList.forEach((newHouse) => {
                        const existingHouse = existingCommunity.houseList.find(
                            (h) => h.title === newHouse.title,
                        );

                        if (existingHouse) {
                            // 使用 unionBy 按 id 去重合并 roomList
                            existingHouse.roomList = unionBy(
                                existingHouse.roomList,
                                newHouse.roomList,
                                'id',
                            );
                        } else {
                            existingCommunity.houseList.push(newHouse);
                        }
                    });

                    // 更新 roomCount
                    existingCommunity.roomCount = existingCommunity.houseList.reduce(
                        (sum, house) => sum + house.roomList.length,
                        0,
                    );
                } else {
                    communityList.value.push(newCommunity);
                }
            });

            total.value = data.total || 0;

            // 计算当前已加载的房源总数（所有 houseList 中的 house 元素总和）
            const loadedHouseCount = communityList.value.reduce((sum, community) => {
                return sum + community.houseList.length;
            }, 0);

            // 判断是否加载完成（total 是 house 的总数）
            if (total.value === 0) {
                loadStatus.value = 'nomore';
            } else if (loadedHouseCount >= total.value) {
                loadStatus.value = 'nomore';
            } else {
                loadStatus.value = 'loadmore';
            }
        } else {
            // 请求失败时，如果已有数据则保持 loadmore 状态，否则显示 nomore
            loadStatus.value = communityList.value.length > 0 ? 'loadmore' : 'nomore';
        }
    };

    const onCommunitySearch = (e) => {
        searchForm.value.searchText = e;
        onSearch(true);
    };

    const onRoomClick = (house, room) => {
        sheep.$router.go('/pages/house/roomDetail', {
            houseId: house.houseId,
            id: room.id,
            // 房间状态 0:待租 1：已出租有租约 2:转租 3：已出无租约
            roomStatus: room.roomStatus,
        });
    };

    const onRoomAdd = (house) => {
        sheep.$router.go('/pages/house/addRoom', {
            houseId: house.houseId,
        });
    };

    onLoad(() => {
        uni.hideTabBar({
            fail: () => {},
        });
    });

    onShow(() => {
        onSearch();
    });

    onPullDownRefresh(async () => {
        searchForm.value.pageNo = 1;
        await onSearch(true);
        uni.stopPullDownRefresh();
    });

    onReachBottom(async () => {
        if (loadStatus.value === 'loadmore' && communityList.value.length < total.value) {
            searchForm.value.pageNo += 1;
            onSearch(false);
        }
    });
</script>
