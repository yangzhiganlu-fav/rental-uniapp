<template>
    <uni-group
        :title="`${data.name}（${data.roomCount}间）`"
        :headStyle="{ backgroundColor: '#000' }"
        style="margin-top: 0"
    >
        <s-house-card
            v-for="house in data.houseList"
            :key="house.id"
            :data="house"
            :checkable="checkable"
            :selectedIds="selectedIds"
            @roomClick="(room) => onRoomClick(house.id, room)"
            @roomLongPress="onRoomLongPress"
            @addClick="onAddClick"
        />
    </uni-group>
</template>

<script setup>
    import sHouseCard from '@/sheep/components/s-house-card/s-house-card.vue';

    const props = defineProps({
        data: {
            type: Object,
            default: () => ({}),
        },
        // 是否处于可选择（编辑）状态
        checkable: {
            type: Boolean,
            default: false,
        },
        selectedIds: {
            type: Array,
            default: () => [],
        },
    });

    const emits = defineEmits(['roomClick', 'roomLongPress', 'addClick']);

    const onRoomClick = (houseId, room) => {
        // 包装一下，带上 houseId，方便上层业务处理
        emits('roomClick', { houseId, ...room });
    };

    const onRoomLongPress = (room) => {
        emits('roomLongPress', room);
    };

    const onAddClick = (houseId) => {
        emits('addClick', houseId);
    };
</script>

<style lang="scss" scoped>
    :deep(.uni-group__title) {
        justify-content: center;
    }

    :deep(.uni-group__content) {
        padding: 0 !important;
    }
</style>
