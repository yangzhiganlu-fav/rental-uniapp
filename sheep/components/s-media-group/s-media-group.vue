<template>
    <view class="media-group">
        <view class="group-title">{{ title }}</view>
        <view class="media-grid">
            <!-- Add Button -->
            <view class="grid-item">
                <s-media-item type="add" :isVideo="isVideo" @click="onAdd"></s-media-item>
            </view>
            <!-- Medias -->
            <view class="grid-item" v-for="(item, index) in list" :key="item.id || index">
                <s-media-item
                    :data="item"
                    :checkable="checkable"
                    :checked="selectedIds.includes(item.id)"
                    :isVideo="isVideo"
                    @click="onItemClick(item)"
                ></s-media-item>
            </view>
        </view>
    </view>
</template>

<script setup>
    import sMediaItem from '@/sheep/components/s-media-item/s-media-item.vue';

    const props = defineProps({
        title: {
            type: String,
            default: '',
        },
        list: {
            type: Array,
            default: () => [],
        },
        checkable: {
            type: Boolean,
            default: false,
        },
        selectedIds: {
            type: Array,
            default: () => [],
        },
        isVideo: {
            type: Boolean,
            default: false,
        },
    });

    const emits = defineEmits(['add', 'itemClick']);

    const onAdd = () => {
        emits('add');
    };

    const onItemClick = (item) => {
        emits('itemClick', item);
    };
</script>

<style lang="scss" scoped>
    .media-group {
        margin-bottom: 30rpx;
        padding: 0 30rpx;

        .group-title {
            font-size: 30rpx;
            font-weight: bold;
            margin-bottom: 20rpx;
            color: #333;
        }

        .media-grid {
            display: flex;
            flex-wrap: wrap;
            margin: 0 -10rpx; // Negative margin for gutter

            .grid-item {
                width: 25%; // 4 columns
                padding: 10rpx;
                box-sizing: border-box;
            }
        }
    }
</style>
