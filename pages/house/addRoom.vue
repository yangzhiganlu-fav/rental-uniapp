<template>
    <s-layout title="添加房间">
        <template #right>
            <button type="primary" size="mini" :loading="saveLoading" @tap="onSave">保存</button>
        </template>

        <uni-group title="地址门牌" style="margin-top: 0">
            <up-cell title="小区地址">
                <template #right-icon>
                    <view class="address-info">
                        <view>{{ houseInfo.communityName }}</view>
                        <view class="address-detail">{{ houseInfo.address }}</view>
                    </view>
                </template>
            </up-cell>
            <up-cell title="门牌号">
                <template #right-icon>
                    <view class="address-info">
                        {{
                            `${houseInfo.blockNumber}栋${houseInfo.unitNumber}单元${houseInfo.houseNo}室`
                        }}
                    </view>
                </template>
            </up-cell>
        </uni-group>

        <up-gap height="16rpx" bgColor="#eee"></up-gap>
        <up-form
            ref="upFormRef"
            :model="formData"
            :rules="rules"
            label-width="140"
            errorType="toast"
            class="common-form"
        >
            <up-form-item label-width="0" prop="rentalStatus" :borderBottom="true">
                <view class="room-section-title">
                    <up-icon name="home-fill" size="20" color="#999"></up-icon>
                    <view class="ss-font-28 ss-m-l-12">待添加房间</view>
                </view>
                <up-choose
                    v-model="formData.rentalStatus"
                    :options="rentalStatusOptions"
                    itemHeight="50rpx"
                    class="text-right"
                ></up-choose>
            </up-form-item>

            <up-form-item label="房间名称" prop="roomName" :borderBottom="true">
                <up-input
                    v-model.trim="formData.roomName"
                    border="none"
                    placeholder="请输入房间名称"
                    placeholderClass="placeholder-align-right"
                    :clearable="false"
                />
            </up-form-item>

            <up-form-item label="房间面积" prop="roomArea" :borderBottom="true">
                <up-input
                    v-model.trim="formData.roomArea"
                    border="none"
                    placeholder="请输入房间面积"
                    placeholderClass="placeholder-align-right"
                    :clearable="false"
                    type="number"
                >
                    <template #suffix>
                        <text class="ss-m-l-12">㎡</text>
                    </template>
                </up-input>
            </up-form-item>

            <RoomOrientation
                v-model:isMaster="formData.isMaster"
                v-model:direction="formData.direction"
            />

            <up-form-item label="租金" prop="price" :borderBottom="true">
                <up-input
                    v-model.trim="formData.price"
                    border="none"
                    placeholder="请输入租金"
                    placeholderClass="placeholder-align-right"
                    :clearable="false"
                    type="number"
                >
                    <template #suffix>
                        <text class="ss-m-l-12">元/月</text>
                    </template>
                </up-input>
            </up-form-item>

            <up-gap height="16rpx" bgColor="#f6f6f6" class="gap"></up-gap>

            <KeyPlaceSelector
                v-if="formData.rentalStatus === 0"
                v-model:keyPlaceType="formData.keyPlaceType"
                v-model:keyPlace="formData.keyPlace"
            />
        </up-form>
    </s-layout>
</template>

<script setup>
    import sheep from '@/sheep';
    import { ref, computed } from 'vue';
    import { onLoad } from '@dcloudio/uni-app';
    import RoomOrientation from './components/houseFormItem/roomOrientation.vue';
    import KeyPlaceSelector from './components/houseFormItem/keyPlaceSelector.vue';
    import HouseApi from '@/sheep/api/house';

    const houseInfo = ref({
        communityName: '',
        address: '',
        blockNumber: '',
        unitNumber: '',
        houseNo: '',
    });

    const formData = ref({
        houseId: '',
        roomName: '',
        roomArea: '',
        direction: '',
        price: '',
        isMaster: 0,
        rentalStatus: 0,
        keyPlaceType: '',
        keyPlace: '',
    });

    const rules = {
        roomName: [{ required: true, message: '请输入房间名称' }],
        roomArea: [{ required: true, message: '请输入房间面积' }],
        price: [{ required: true, message: '请输入租金' }],
    };

    const rentalStatusOptions = [
        { title: '未租', id: 0 },
        { title: '已租', id: 1 },
    ];

    const fetchRoomInfo = async () => {
        const params = {
            houseId: formData.value.houseId,
        };
        const { code, data } = await HouseApi.getRoomHouseInfo(params);
        if (code === 0 && data) {
            houseInfo.value = data;
        }
    };

    onLoad((options) => {
        if (options.houseId) {
            formData.value.houseId = options.houseId;
            fetchRoomInfo();
        }
    });

    const isUnrentedRoom = computed(() => formData.value.rentalStatus === 0);

    const showKeyPlaceRemarks = computed(() => {
        const needRemarks = formData.value.keyPlaceType === 1 || formData.value.keyPlaceType === 6;
        return needRemarks && isUnrentedRoom.value;
    });

    const upFormRef = ref(null);
    const saveLoading = ref(false);

    const onSave = async () => {
        const valid = await upFormRef.value?.validate();
        if (!valid) return;
        if (isUnrentedRoom.value && !formData.value.keyPlaceType) {
            uni.showToast({
                title: '请选择钥匙位置',
                icon: 'none',
            });
            return;
        }
        if (showKeyPlaceRemarks.value && !formData.value.keyPlace) {
            uni.showToast({
                title: '请输入钥匙位置或密码锁密码',
                icon: 'none',
            });
            return;
        }
        saveLoading.value = true;
        const { code } = await HouseApi.addNewRoom(formData.value);
        if (code === 0) {
            uni.showToast({
                title: '房间添加成功',
                icon: 'success',
            });
            sheep.$router.back();
        }

        saveLoading.value = false;
    };
</script>

<style lang="scss" scoped>
    .address-info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        color: $dark-9;

        .address-detail {
            margin-top: 16rpx;
            font-size: $tx-sm;
        }
    }

    .room-section-title {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        font-weight: bold;
        flex-shrink: 0;
    }

    :deep(.uni-group__content) {
        padding: 0 !important;
    }
</style>
