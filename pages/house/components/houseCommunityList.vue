<template>
    <scroll-view class="community-list-page" scroll-y @scrolltolower="loadMore">
        <uni-group
            v-for="community in list"
            :key="community.id"
            :title="`${community.name}（${community.roomCount}间）`"
            :headStyle="{ backgroundColor: '#000' }"
            style="margin-top: 0"
        >
            <s-house-card
                v-for="house in community.houseList"
                :key="house.id"
                :data="house"
                @roomClick="handleRoomClick"
            />
        </uni-group>
    </scroll-view>
</template>

<script setup>
    import sheep from '@/sheep';
    import sHouseCard from '@/sheep/components/s-house-card/s-house-card.vue';

    const props = defineProps({
        list: {
            type: Array,
            default: () => [],
        },
    });

    const emits = defineEmits(['load']);

    const loadMore = () => {
        emits('load');
    };

    const handleRoomClick = (type, data) => {
        if (type === 'detail') {
            sheep.$router.go('/pages/house/roomDetail', { houseId: data.houseId, id: data.id });
        } else if (type === 'add') {
            sheep.$router.go('/pages/house/roomAdd', { houseId: data.houseId });
        }
    };
</script>

<style lang="scss" scoped>
    .community-list-page {
        flex: 1;
        min-height: 0;
    }

    :deep(.uni-group__title) {
        justify-content: center;
    }

    :deep(.uni-group__content) {
        padding: 0 !important;
    }
</style>
