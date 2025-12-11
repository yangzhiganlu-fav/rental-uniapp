<template>
    <up-popup :show="showPopup" mode="bottom" round="10" @close="close">
        <view class="ss-bg-white" style="font-size: 26rpx">
            <!-- 顶部工具栏 -->
            <view
                class="ss-flex ss-row-between ss-items-center ss-bg-page ss-p-x-30"
                style="height: 80rpx"
            >
                <text class="ss-color-gray" @click="close">取消</text>
                <text class="ss-font-bold">{{ title }}</text>
                <text class="ss-color-primary" @click="confirm">确定</text>
            </view>

            <!-- 多选列表区域 -->
            <scroll-view scroll-y style="max-height: 600rpx">
                <up-checkbox-group
                    v-model="selectedValues"
                    placement="column"
                    iconPlacement="right"
                    class="ss-p-x-30"
                >
                    <view
                        v-for="(item, index) in list"
                        :key="index"
                        class="ss-flex ss-row-between ss-items-center ss-p-y-16 ss-border-bottom"
                        @click="toggleItem(item[valueKey])"
                    >
                        <text>{{ item[labelKey] }}</text>
                        <up-checkbox :name="item[valueKey]" :label="null"></up-checkbox>
                    </view>
                </up-checkbox-group>
            </scroll-view>
        </view>
    </up-popup>
</template>

<script setup>
    import { computed, ref, watch, toRefs } from 'vue';

    const props = defineProps({
        show: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: '请选择(可多选)',
        },
        list: {
            type: Array,
            default: () => [],
        },
        // 默认选中的值
        defaultValues: {
            type: Array,
            default: () => [],
        },
        // 选项对象中显示的属性名
        labelKey: {
            type: String,
            default: 'name',
        },
        // 选项对象中值的属性名
        valueKey: {
            type: String,
            default: 'value',
        },
    });

    const emit = defineEmits(['update:show', 'confirm', 'close']);

    const { defaultValues } = toRefs(props);
    const showPopup = computed({
        get() {
            return props.show;
        },
        set(val) {
            emit('update:show', val);
        },
    });

    const selectedValues = ref([]);

    // 监听 show 变化，打开时初始化选中值
    watch(
        showPopup,
        (val) => {
            if (val) {
                selectedValues.value = [...defaultValues.value];
            }
        },
        { immediate: true },
    );

    const close = () => {
        showPopup.value = false;
        emit('close');
    };

    const confirm = () => {
        emit('confirm', selectedValues.value);
        close();
    };

    const toggleItem = (val) => {
        const index = selectedValues.value.indexOf(val);
        if (index > -1) {
            selectedValues.value.splice(index, 1);
        } else {
            selectedValues.value.push(val);
        }
    };
</script>

<style lang="scss" scoped>
    .popup-content {
        background-color: #fff;
    }

    .ss-color-primary {
        color: $blue-light;
    }
</style>
