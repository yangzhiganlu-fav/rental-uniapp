<!-- 楼层选择表单项组件-包含电梯/楼梯选择和楼层选择器 -->
<template>
    <up-form-item label="楼层" :borderBottom="true" class="double-form-item" @click="showPicker">
        <up-choose
            v-model="elevatorValue"
            :options="elevatorOptions"
            itemHeight="50rpx"
            class="top-form-item"
        ></up-choose>
        <up-input
            v-model.trim="text"
            border="none"
            disabled
            disabledColor="#ffffff"
            placeholder="请选择楼层"
            placeholderClass="placeholder-align-right"
            :clearable="false"
            class="bottom-form-item"
        ></up-input>
        <template #right>
            <up-icon name="arrow-right" class="ss-m-l-12"></up-icon>
        </template>
    </up-form-item>
    <up-picker
        ref="pickerRef"
        title="层数/总层数"
        :show="show"
        :columns="columns"
        :defaultIndex="indexs"
        @confirm="onConfirm"
        @cancel="show = false"
        @change="onChange"
    ></up-picker>
</template>

<script setup>
    import { ref, computed } from 'vue';

    const props = defineProps({
        // 所在层
        floor: {
            type: Number,
            required: true,
        },
        // 总层数
        totalFloor: {
            type: Number,
            required: true,
        },
        // 是否有电梯
        isElevator: {
            type: Number,
            required: true,
        },
    });

    const emit = defineEmits(['update:floor', 'update:totalFloor', 'update:isElevator']);

    const elevatorValue = computed({
        get() {
            return props.isElevator === 0 ? 1 : 0;
        },
        set(value) {
            emit('update:isElevator', value === 0 ? 1 : 0);
        },
    });

    const elevatorOptions = [
        { title: '电梯', value: 1 },
        { title: '楼梯', value: 0 },
    ];

    const indexs = computed(() => [
        props.floor - 1 < 0 ? 0 : props.floor - 1,
        props.totalFloor - 1 < 0 ? 0 : props.totalFloor - 1,
    ]);

    const text = computed(() => {
        if (props.floor === 0 && props.totalFloor === 0) {
            return '';
        }
        return `第${props.floor}层 / 共${props.totalFloor}层`;
    });

    const show = ref(false);

    const pickerRef = ref(null);

    const columns = ref([
        Array.from({ length: 99 }, (_, i) => `第${i + 1}层`),
        Array.from({ length: 99 }, (_, i) => `共${i + 1}层`),
    ]);

    const showPicker = () => {
        show.value = true;
        uni.hideKeyboard();
    };

    // 楼层选择器列变化处理 (联动逻辑)
    const onChange = (e) => {
        const { columnIndex, index } = e;
        // 当改变第一列（所在层）时，更新第二列（总层数），确保总层数 >= 所在层
        if (columnIndex === 0) {
            const startFloor = index + 1;
            const totalFloors = Array.from(
                { length: 99 - startFloor + 1 },
                (_, i) => `共${startFloor + i}层`,
            );
            columns.value[1] = totalFloors;
            pickerRef.value?.setColumnValues(1, totalFloors);
        }
    };

    const onConfirm = (e) => {
        emit('update:floor', e.indexs[0] + 1);
        emit('update:totalFloor', e.indexs[0] > e.indexs[1] ? e.indexs[0] + 1 : e.indexs[1] + 1);
        show.value = false;
    };
</script>
