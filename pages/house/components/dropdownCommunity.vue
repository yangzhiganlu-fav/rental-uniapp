<template>
    <view class="dropdown-slot-content">
        <scroll-view scroll-y :style="{ flex: 1, minHeight: '0' }">
            <up-collapse accordion>
                <up-collapse-item
                    v-for="(section, index) in list"
                    :key="index"
                    :title="section.title"
                >
                    <view class="community-list">
                        <view
                            class="community-item"
                            :class="{ active: localValue === item.value }"
                            v-for="(item, idx) in section.items"
                            :key="idx"
                            @click="onSelect(item)"
                        >
                            {{ item.label }}
                        </view>
                    </view>
                </up-collapse-item>
            </up-collapse>
        </scroll-view>
        <view class="dropdown-footer">
            <button class="btn-reset" @click="resetFilter">重置</button>
            <button class="btn-confirm" type="primary" @click="confirmFilter">确定</button>
        </view>
    </view>
</template>

<script setup>
    import { computed, ref, onMounted } from 'vue';

    const props = defineProps({
        modelValue: {
            type: String,
            default: '',
        },
    });

    const emit = defineEmits(['update:modelValue', 'confirm', 'close']);

    const list = ref([]);

    const loadData = () => {
        const mockList = [];
        const districts = [
            '朝阳区',
            '海淀区',
            '丰台区',
            '西城区',
            '东城区',
            '通州区',
            '昌平区',
            '大兴区',
        ];

        districts.forEach((district, index) => {
            const items = [];
            // 每个区造 5-10 个小区
            const count = Math.floor(Math.random() * 6) + 25;
            for (let i = 0; i < count; i++) {
                items.push({
                    label: `${district}小区${i + 1}号`,
                    value: `${index}_${i}`,
                });
            }

            mockList.push({
                title: district,
                items: items,
            });
        });
        list.value = mockList;
    };

    onMounted(() => {
        loadData();
    });

    const localValue = computed({
        get() {
            return props.modelValue;
        },
        set(val) {
            emit('update:modelValue', val);
        },
    });

    const onSelect = (item) => {
        localValue.value = item.value;
    };

    const resetFilter = () => {
        localValue.value = '';
    };

    const confirmFilter = () => {
        emit('confirm');
        emit('close');
    };
</script>

<style lang="scss" scoped>
    .dropdown-slot-content {
        display: flex;
        flex-direction: column;
        height: 60vh;
    }

    .community-list {
        display: flex;
        flex-direction: column;
        padding: 0 10px;
    }

    .community-item {
        padding: 10px 0;
        border-bottom: 1px solid #f5f5f5;
        font-size: 12px;
        color: #333;

        &.active {
            color: #2979ff;
            font-weight: bold;
        }

        &:last-child {
            border-bottom: none;
        }
    }

    :deep(.u-cell__title) {
        font-size: 12px !important;
    }
</style>
