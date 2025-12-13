<template>
    <su-sticky bgColor="#fff">
        <up-dropdown ref="uDropdown" borderBottom titleSize="12" activeColor="#2979ff">
            <up-dropdown-item
                :title="rentalStatusLabel"
                v-model="searchForm.rentalStatus"
                :options="rentalStatusOptions"
                @change="handleConfirm"
            ></up-dropdown-item>

            <up-dropdown-item title="小区" class="bg-white">
                <view class="dropdown-slot-content">
                    <scroll-view scroll-y :style="{ flex: 1, minHeight: '0' }">
                        <up-collapse :border="false" :value="collapseValues">
                            <up-collapse-item
                                v-for="community in communityList"
                                :key="community.id"
                                :title="community.county"
                                :isLink="false"
                            >
                                <view class="community-list">
                                    <view
                                        class="community-item"
                                        :class="{
                                            active: searchForm.communityIds.includes(item.id),
                                        }"
                                        v-for="(item, idx) in community.list"
                                        :key="idx"
                                        @tap="onSelectCommunity(item)"
                                    >
                                        {{ item.communityName }}
                                    </view>
                                </view>
                            </up-collapse-item>
                        </up-collapse>
                    </scroll-view>
                    <view class="dropdown-footer">
                        <up-button class="btn-reset" @tap="resetCommunityFilter">重置</up-button>
                        <up-button class="btn-confirm" type="primary" @tap="handleConfirm">
                            确定
                        </up-button>
                    </view>
                </view>
            </up-dropdown-item>
        </up-dropdown>
    </su-sticky>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import { onLoad } from '@dcloudio/uni-app';
    import HouseApi from '@/sheep/api/house';

    const props = defineProps({
        modelValue: {
            type: Object,
            default: () => ({
                communityName: '',
                rentalStatus: '',
                communityIds: [],
            }),
        },
    });

    const emit = defineEmits(['search', 'update:modelValue']);

    const searchForm = computed({
        get() {
            return props.modelValue;
        },
        set(value) {
            emit('update:modelValue', value);
        },
    });

    // 租赁状态选项与动态标题
    const rentalStatusOptions = [
        { label: '全部', value: '' },
        { label: '已租', value: '1' },
        { label: '未租', value: '0' },
        { label: '租客转租中', value: '2' },
    ];

    const rentalStatusLabel = computed(() => {
        const val = searchForm.value.rentalStatus;
        const opt = rentalStatusOptions.find((o) => o.value === val);
        return opt ? opt.label : '全部';
    });

    // 小区列表数据
    const communityList = ref([]);

    const collapseValues = ref([]);

    // 加载小区数据
    const loadCommunityData = async () => {
        const params = {
            communityName: searchForm.value.communityName || '',
            isExist: true,
        };
        communityList.value = [];
        const { code, data } = await HouseApi.getCommunityList(params);
        if (code === 0 && data) {
            communityList.value = data;
            collapseValues.value = new Array(data.length)
                .fill(0)
                .map((item, index) => (item = index));
        }
    };

    onLoad(() => {
        loadCommunityData();
    });

    const onSelectCommunity = (item) => {
        const index = searchForm.value.communityIds.indexOf(item.id);
        if (index > -1) {
            searchForm.value.communityIds.splice(index, 1);
        } else {
            searchForm.value.communityIds.push(item.id);
        }
    };

    const resetCommunityFilter = () => {
        searchForm.value.communityIds = [];
    };

    const uDropdown = ref(null);

    const handleConfirm = () => {
        uDropdown.value?.close();
        emit('search');
    };
</script>

<style lang="scss" scoped>
    :deep(.u-cell__title-text) {
        font-size: $tx-sm !important;
    }

    :deep(.u-cell__title) {
        font-size: $tx-sm !important;
    }

    .dropdown-slot-content {
        display: flex;
        flex-direction: column;
        height: 60vh;
    }

    .community-list {
        display: flex;
        flex-direction: column;
        padding: 0 20rpx;
    }

    .community-item {
        padding: 20rpx 0;
        border-bottom: 1px solid #f5f5f5;
        font-size: $tx-sm;
        color: $dark-3;

        &.active {
            color: $blue-light;
            font-weight: bold;
        }

        &:last-child {
            border-bottom: none;
        }
    }
</style>
