<!-- 户型表单项组件-包含选择器功能 -->
<template>
    <up-form-item label="户型" :borderBottom="true" @click="showPicker">
        <up-input
            v-model.trim="text"
            border="none"
            disabled
            disabledColor="#ffffff"
            placeholder="请选择户型"
            placeholderClass="placeholder-align-right"
            :clearable="false"
        ></up-input>
        <template #right>
            <up-icon name="arrow-right" class="ss-m-l-12"></up-icon>
        </template>
    </up-form-item>
    <up-picker
        :show="show"
        :columns="columns"
        :defaultIndex="indexs"
        @confirm="onConfirm"
        @cancel="show = false"
    ></up-picker>
</template>

<script setup>
    import { ref, computed } from 'vue';

    const props = defineProps({
        // 室
        roomNumber: {
            type: [Number, String],
            required: true,
        },
        // 厅
        hallNumber: {
            type: [Number, String],
            required: true,
        },
        // 卫
        toiletNumber: {
            type: [Number, String],
            required: true,
        },
        // 0: 整租 1: 合租
        rentType: {
            type: Number,
            required: true,
        },
    });

    const emit = defineEmits(['update:roomNumber', 'update:hallNumber', 'update:toiletNumber']);

    const indexs = computed(() => {
        const roomIndex = props.rentType === 0 ? props.roomNumber - 1 : props.roomNumber - 2;
        return [roomIndex < 0 ? 0 : roomIndex, props.hallNumber || 0, props.toiletNumber || 0];
    });

    const text = computed(() => {
        if (props.roomNumber === '' && props.hallNumber === '' && props.toiletNumber === '') {
            return '';
        }
        return `${props.roomNumber}室 ${props.hallNumber}厅 ${props.toiletNumber}卫`;
    });

    const show = ref(false);

    const columns = computed(() => [
        Array.from({ length: 10 }, (_, i) => `${props.rentType === 0 ? i + 1 : i + 2}室`),
        Array.from({ length: 10 }, (_, i) => `${i}厅`),
        Array.from({ length: 10 }, (_, i) => `${i}卫`),
    ]);

    const showPicker = () => {
        show.value = true;
        uni.hideKeyboard();
    };

    const onConfirm = (e) => {
        emit('update:roomNumber', e.indexs[0] + (props.rentType === 0 ? 1 : 2));
        emit('update:hallNumber', e.indexs[1]);
        emit('update:toiletNumber', e.indexs[2]);
        show.value = false;
    };
</script>
