<template
    ><s-layout title="录入房源">
        <template #right>
            <button
                v-if="community?.id"
                type="primary"
                size="mini"
                :loading="saveLoading"
                @tap="onSave"
            >
                保存
            </button>
        </template>
        <su-sticky>
            <su-tabs
                :list="tabMaps"
                :scrollable="false"
                :current="currentTab"
                @change="onTabsChange"
            />
        </su-sticky>
        <view class="community-name" @tap="onSelectCommunity">
            {{ community?.communityName }}
        </view>
        <s-empty
            v-if="!community?.id"
            showAction
            actionText="请选择小区"
            action-url="/pages/house/communitySelect"
            icon="/static/data-empty.png"
        />
        <up-form
            v-else
            ref="upFormRef"
            :model="formData"
            :rules="rules"
            label-width="140"
            errorType="toast"
            class="common-form"
        >
            <up-form-item label="楼号" prop="blockNumber" :borderBottom="true">
                <up-input
                    v-model.trim="formData.blockNumber"
                    border="none"
                    placeholder="请输入楼号"
                    placeholderClass="placeholder-align-right"
                    :clearable="false"
                    type="number"
                />
            </up-form-item>

            <up-form-item label="单元号" prop="unitNumber" :borderBottom="true">
                <up-input
                    v-model.trim="formData.unitNumber"
                    border="none"
                    placeholder="请输入单元号"
                    placeholderClass="placeholder-align-right"
                    :clearable="false"
                    type="number"
                />
            </up-form-item>

            <up-form-item label="室号" prop="houseNo" :borderBottom="true">
                <up-input
                    v-model.trim="formData.houseNo"
                    border="none"
                    placeholder="请输入室号"
                    placeholderClass="placeholder-align-right"
                    :clearable="false"
                    type="number"
                />
            </up-form-item>

            <HouseLayout
                v-model:roomNumber="formData.roomNumber"
                v-model:hallNumber="formData.hallNumber"
                v-model:toiletNumber="formData.toiletNumber"
                :rentType="rentType"
            />

            <FloorSelector
                v-model:floor="formData.floor"
                v-model:totalFloor="formData.totalFloor"
                v-model:isElevator="formData.isElevator"
            />

            <!-- 整租独有字段 -->
            <template v-if="rentType === 0">
                <up-form-item label="整套面积" prop="houseArea" :borderBottom="true">
                    <up-input
                        v-model.trim="formData.houseArea"
                        border="none"
                        placeholder="请输入整套面积"
                        placeholderClass="placeholder-align-right"
                        :clearable="false"
                        type="number"
                    >
                        <template #suffix>
                            <text class="ss-m-l-12">㎡</text>
                        </template>
                    </up-input>
                </up-form-item>
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
                <up-form-item label="出租状态" prop="rentalStatus" :borderBottom="true">
                    <up-choose
                        v-model="formData.rentalStatus"
                        :options="rentalStatusOptions"
                        itemHeight="50rpx"
                        class="text-right"
                    ></up-choose>
                </up-form-item>
            </template>

            <!-- 合租独有字段 -->
            <template v-if="rentType === 1">
                <template v-for="(room, index) in formData.roomList" :key="index">
                    <up-gap height="16rpx" bgColor="#f6f6f6" class="gap"></up-gap>
                    <up-form-item
                        label-width="0"
                        :prop="`roomList.${index}.rentalStatus`"
                        :borderBottom="true"
                    >
                        <view class="room-section-title">
                            <up-icon name="home-fill" size="20" color="#999"></up-icon>
                            <view class="ss-font-28 ss-m-l-12">房间-{{ getLetter(index) }}</view>
                        </view>
                        <up-choose
                            v-model="room.rentalStatus"
                            :options="rentalStatusOptions"
                            itemHeight="50rpx"
                            class="text-right"
                        ></up-choose>
                    </up-form-item>

                    <up-form-item
                        label="房间名称"
                        :prop="`roomList.${index}.roomName`"
                        :borderBottom="true"
                    >
                        <up-input
                            v-model.trim="room.roomName"
                            border="none"
                            placeholder="请输入房间名称"
                            placeholderClass="placeholder-align-right"
                            :clearable="false"
                        />
                    </up-form-item>

                    <up-form-item
                        label="房间面积"
                        :prop="`roomList.${index}.roomArea`"
                        :borderBottom="true"
                    >
                        <up-input
                            v-model.trim="room.roomArea"
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
                        v-model:isMaster="room.isMaster"
                        v-model:direction="room.direction"
                    />

                    <up-form-item
                        label="租金"
                        :prop="`roomList.${index}.price`"
                        :borderBottom="true"
                    >
                        <up-input
                            v-model.trim="room.price"
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
                </template>

                <up-gap height="16rpx" bgColor="#f6f6f6" class="gap"></up-gap>
            </template>

            <KeyPlaceSelector
                v-if="showKeyPlaceSelector"
                v-model:keyPlaceType="formData.keyPlaceType"
                v-model:keyPlace="formData.keyPlace"
            />
        </up-form>

        <up-gap height="50rpx" bgColor="#f6f6f6"></up-gap>
    </s-layout>
</template>

<script setup>
    import sheep from '@/sheep';
    import { ref, computed, watch } from 'vue';
    import { onLoad, onUnload } from '@dcloudio/uni-app';
    import HouseLayout from './components/houseFormItem/houseLayout.vue';
    import FloorSelector from './components/houseFormItem/floorSelector.vue';
    import RoomOrientation from './components/houseFormItem/roomOrientation.vue';
    import KeyPlaceSelector from './components/houseFormItem/keyPlaceSelector.vue';
    import HouseApi from '@/sheep/api/house';

    const community = ref(null);

    const formData = ref({
        communityId: '', // 小区ID（必需）
        blockNumber: '', // 楼号
        unitNumber: '', // 单元号
        houseNo: '', // 房间号
        roomNumber: '', // 室
        hallNumber: '', // 厅
        toiletNumber: '', // 卫
        isElevator: 1, // 是否有电梯 0：楼梯房 1：电梯房
        floor: '', // 所在楼层
        totalFloor: '', // 总楼层
        houseArea: '', // 房屋面积（整租）
        price: '', // 出租金额,整数（整租）
        rentalStatus: 0, // 出租情况 0:待租 1：已出租（整租）
        keyPlace: '', // 钥匙位置,选择密码锁和其他位置时需要填写
        keyPlaceType: '', // 钥匙位置类型 1：密码锁 2：房东手里 3：水表箱 4：电表箱 5：门后地毯 6：其他位置
        roomList: [], // 房间列表，合租时需要
    });

    onLoad(() => {
        uni.$on('SELECT_COMMUNITY', (data) => {
            community.value = data;
            formData.value.communityId = data.id;
        });
    });

    onUnload(() => {
        uni.$off('SELECT_COMMUNITY');
    });

    const currentTab = ref(0);

    const rentType = ref(1);

    const tabMaps = [
        { name: '合租', value: 1 },
        { name: '整租', value: 0 },
    ];

    const onTabsChange = (e) => {
        currentTab.value = e.index;
        rentType.value = e.value;
        if (rentType.value === 1 && formData.value.roomNumber < 2) {
            formData.value.roomNumber = 2;
        }
    };

    const rentalStatusOptions = [
        { title: '未租', id: 0 },
        { title: '已租', id: 1 },
    ];

    const rules = {
        blockNumber: [{ required: true, message: '请输入楼号' }],
        unitNumber: [{ required: true, message: '请输入单元号' }],
        houseNo: [{ required: true, message: '请输入室号' }],
    };

    // 获取字母标识 (A, B, C, ...)
    const getLetter = (index) => {
        return String.fromCharCode(65 + index);
    };

    // 判断是否显示钥匙位置选择器
    const showKeyPlaceSelector = computed(() => {
        if (rentType.value === 1) {
            // 合租：有未租房间时显示
            return formData.value.roomList.some((room) => room.rentalStatus === 0);
        } else {
            // 整租：未租状态显示
            return formData.value.rentalStatus === 0;
        }
    });

    // 监听 roomNumber 变化，动态生成 roomList（仅合租）
    watch(
        () => formData.value.roomNumber,
        (newRoomNumber) => {
            if (rentType.value === 1 && newRoomNumber && newRoomNumber > 0) {
                const currentRoomList = formData.value.roomList || [];
                const newRoomList = [];

                for (let i = 0; i < newRoomNumber; i++) {
                    // 保留已存在的房间数据，或创建新的
                    newRoomList.push(
                        currentRoomList[i] || {
                            roomName: '',
                            isMaster: 0,
                            roomArea: '',
                            direction: '',
                            price: '',
                            rentalStatus: 0,
                        },
                    );
                }

                // 如果房间数减少，删除多余的房间
                formData.value.roomList = newRoomList;
            } else if (rentType.value === 1) {
                formData.value.roomList = [];
            }
        },
        { immediate: true },
    );

    const onSelectCommunity = () => {
        sheep.$router.go('/pages/house/communitySelect', {
            communityName: community.value ? community.value.communityName : '',
        });
    };

    const upFormRef = ref(null);
    const saveLoading = ref(false);

    const isNullable = (value) => {
        return value === null || value === undefined || value === '';
    };

    const onSave = async () => {
        const valid = await upFormRef.value?.validate();
        if (!valid) return;
        if (
            isNullable(formData.value.roomNumber) ||
            isNullable(formData.value.hallNumber) ||
            isNullable(formData.value.toiletNumber)
        ) {
            uni.showToast({
                title: '请选择当前户型',
                icon: 'none',
            });
            return;
        }
        if (isNullable(formData.value.isElevator)) {
            uni.showToast({
                title: '请选择是否有电梯',
                icon: 'none',
            });
            return;
        }
        if (isNullable(formData.value.floor) || isNullable(formData.value.totalFloor)) {
            uni.showToast({
                title: '请选择楼层',
                icon: 'none',
            });
            return;
        }
        if (rentType.value === 1) {
            for (let i = 0; i < formData.value.roomList.length; i++) {
                const room = formData.value.roomList[i];
                if (isNullable(room.roomName)) {
                    uni.showToast({
                        title: `请输入房间-${getLetter(i)}名称`,
                        icon: 'none',
                    });
                    return;
                }
                if (isNullable(room.roomArea)) {
                    uni.showToast({
                        title: `请输入房间-${getLetter(i)}面积`,
                        icon: 'none',
                    });
                    return;
                }
                if (isNullable(room.direction)) {
                    uni.showToast({
                        title: `请选择房间-${getLetter(i)}朝向`,
                        icon: 'none',
                    });
                    return;
                }
                if (isNullable(room.price)) {
                    uni.showToast({
                        title: `请输入房间-${getLetter(i)}租金`,
                        icon: 'none',
                    });
                    return;
                }
            }

            if (showKeyPlaceSelector.value) {
                if (isNullable(formData.value.keyPlaceType)) {
                    uni.showToast({
                        title: '请选择钥匙位置',
                        icon: 'none',
                    });
                    return;
                }
                if (formData.value.keyPlaceType === 1 || formData.value.keyPlaceType === 6) {
                    if (isNullable(formData.value.keyPlace)) {
                        uni.showToast({
                            title: '请输入钥匙位置或密码锁密码',
                            icon: 'none',
                        });
                        return;
                    }
                }
            }
            // 合租
            onSaveMultiple();
        } else {
            if (isNullable(formData.value.houseArea)) {
                uni.showToast({
                    title: '请输入整套面积',
                    icon: 'none',
                });
                return;
            }
            if (isNullable(formData.value.price)) {
                uni.showToast({
                    title: '请输入租金',
                    icon: 'none',
                });
                return;
            }

            if (showKeyPlaceSelector.value) {
                if (isNullable(formData.value.keyPlaceType)) {
                    uni.showToast({
                        title: '请选择钥匙位置',
                        icon: 'none',
                    });
                    return;
                }
                if (formData.value.keyPlaceType === 1 || formData.value.keyPlaceType === 6) {
                    if (isNullable(formData.value.keyPlace)) {
                        uni.showToast({
                            title: '请输入钥匙位置或密码锁密码',
                            icon: 'none',
                        });
                        return;
                    }
                }
            }
            // 整租
            onSaveSingle();
        }
    };

    const onSaveSingle = async () => {
        saveLoading.value = true;
        const params = {
            communityId: formData.value.communityId,
            blockNumber: formData.value.blockNumber,
            unitNumber: formData.value.unitNumber,
            houseNo: formData.value.houseNo,
            roomNumber: formData.value.roomNumber,
            hallNumber: formData.value.hallNumber,
            toiletNumber: formData.value.toiletNumber,
            isElevator: formData.value.isElevator,
            floor: formData.value.floor,
            totalFloor: formData.value.totalFloor,
            houseArea: formData.value.houseArea,
            price: formData.value.price,
            rentalStatus: formData.value.rentalStatus,
            keyPlace: formData.value.keyPlace,
            keyPlaceType: formData.value.keyPlaceType,
        };
        const { code } = await HouseApi.addSingleRoom(params);
        if (code === 0) {
            uni.showToast({
                title: '添加成功',
                icon: 'success',
            });
            sheep.$router.back();
        }
        saveLoading.value = false;
    };

    const onSaveMultiple = async () => {
        saveLoading.value = true;
        const params = {
            communityId: formData.value.communityId,
            blockNumber: formData.value.blockNumber,
            unitNumber: formData.value.unitNumber,
            houseNo: formData.value.houseNo,
            roomNumber: formData.value.roomNumber,
            hallNumber: formData.value.hallNumber,
            toiletNumber: formData.value.toiletNumber,
            isElevator: formData.value.isElevator,
            floor: formData.value.floor,
            totalFloor: formData.value.totalFloor,
            keyPlace: formData.value.keyPlace,
            keyPlaceType: formData.value.keyPlaceType,
            roomInfoList: formData.value.roomList.map((room) => ({
                roomName: room.roomName,
                roomArea: room.roomArea,
                direction: room.direction,
                price: room.price,
                rentalStatus: room.rentalStatus,
                isMaster: room.isMaster,
            })),
        };
        const { code } = await HouseApi.addMultiRoom(params);
        if (code === 0) {
            uni.showToast({
                title: '添加成功',
                icon: 'success',
            });
            sheep.$router.back();
        }
        saveLoading.value = false;
    };
</script>

<style lang="scss" scoped>
    .community-name {
        padding: 24rpx 0;
        font-size: 28rpx;
        color: $blue-light;
        text-align: center;
    }
    .gap {
        margin: 0 -24rpx;
    }
    .room-section-title {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        font-weight: bold;
        flex-shrink: 0;
    }
</style>
