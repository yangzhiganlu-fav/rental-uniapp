<!-- 房间朝向表单项组件-包含卧型/朝向选择器 -->
<template>
    <up-form-item label="卧型/朝向" :borderBottom="true" @click="showPicker">
        <up-input
            v-model.trim="text"
            border="none"
            disabled
            disabledColor="#ffffff"
            placeholder="请选择卧型/朝向"
            placeholderClass="placeholder-align-right"
            :clearable="false"
        ></up-input>
        <template #right>
            <up-icon name="arrow-right" class="ss-m-l-12"></up-icon>
        </template>
    </up-form-item>
    <up-picker
        title="卧型/朝向"
        :show="show"
        :columns="columns"
        @confirm="onConfirm"
        @cancel="show = false"
    ></up-picker>
</template>

<script setup>
    import { ref } from 'vue';

    const props = defineProps({
        // 是否主卧 1:主卧 0:次卧
        isMaster: {
            type: Number,
            required: true,
        },
        // 朝向
        direction: {
            type: String,
            required: true,
        },
    });

    const emit = defineEmits(['update:isMaster', 'update:direction']);

    const text = ref('');

    const show = ref(false);

    const columns = [
        ['主卧', '次卧'],
        ['朝东', '朝南', '朝西', '朝北'],
    ];

    const showPicker = () => {
        show.value = true;
        uni.hideKeyboard();
    };

    const onConfirm = (e) => {
        const roomType = e.value[0]; // 主卧/次卧
        const direction = e.value[1].replace('朝', ''); // 去掉"朝"字,只保留方向

        text.value = `${roomType} ${e.value[1]}`;
        emit('update:isMaster', roomType === '主卧' ? 1 : 0);
        emit('update:direction', direction);
        show.value = false;
    };
</script>
