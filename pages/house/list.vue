<template>
    <s-layout navbar="empty" class="page-select-house">
        <view class="page-container">
            <view class="header-box bg-white">
                <view class="ss-p-x-24" :style="{ paddingTop: sys_statusBar + 'px' }">
                    <uni-search-bar
                        class="ss-flex-1"
                        radius="33"
                        placeholder="搜索小区名"
                        cancelButton="always"
                        :cancelButtonStyle="{ color: '#409eff' }"
                        bgColor="#eeeeee"
                        @clear="onClear"
                        @cancel="onCancel"
                        @input="onInput"
                    />
                </view>
            </view>
            <view class="ss-p-x-28 ss-p-y-20 title-text">
                {{ state.communityName ? '小区' : '已录入小区' }}
            </view>
            <view class="content-box">
                <scroll-view
                    class="scroll-view"
                    scroll-y
                    @scrolltolower="loadmore"
                    :lower-threshold="50"
                >
                    <view class="ss-flex-col ss-p-x-28 ss-p-y-20">
                        <view
                            v-for="(item, index) in houseList"
                            :key="index"
                            class="ss-flex ss-p-y-20 border-b"
                            @tap="selectHouse(item)"
                        >
                            <s-icon name="zhuzhaixiaoqu" size="40" color="#409eff" />
                            <text class="ss-text-28 ss-m-l-20">{{ item.name }}</text>
                        </view>
                        <s-empty
                            v-if="houseList.length === 0 && state.listParams.status !== 'loading'"
                            icon="/static/data-empty.png"
                        />
                    </view>
                    <uni-load-more
                        v-if="houseList.length > 0 || state.listParams.status === 'loading'"
                        :status="state.listParams.status"
                    />
                </scroll-view>
            </view>
        </view>
    </s-layout>
</template>

<script setup>
    import sheep from '@/sheep';
    import { onLoad } from '@dcloudio/uni-app';
    import { debounce } from 'lodash-es';
    import { computed, ref, reactive } from 'vue';
    import HouseApi from '@/sheep/api/house';

    const sys_statusBar = sheep.$platform.device.statusBarHeight;

    const state = reactive({
        communityName: '',
        listParams: {
            page: 1,
            pageSize: 20,
            status: 'more',
        },
    });

    const houseList = ref([]);

    const onCancel = () => {
        sheep.$router.back();
    };

    const onClear = () => {
        state.communityName = '';
        state.listParams.page = 1;
        state.listParams.status = 'more';
        houseList.value = [];
    };

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
        sheep.$router.go('/pages/house/add-house', {
            data: JSON.stringify(item),
        });
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
    .page-select-house {
        height: 100%;
    }

    .page-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .header-box {
        flex-shrink: 0;
        z-index: 10;
    }

    .content-box {
        background-color: #fff;
        flex: 1;
        height: 0;
        position: relative;
    }

    .scroll-view {
        height: 100%;
    }

    .title-text {
        font-size: 26rpx;
        color: #999;
    }

    .border-b {
        border-bottom: 1px solid #eee;
    }
</style>
