<template>
    <view class="form-container">
        <uni-forms ref="formRef" :model="formData" label-width="140" label-align="left">
            <uni-forms-item label="小区" name="communityName">
                <view
                    class="trigger"
                    @tap="
                        sheep.$router.go('/pages/house/select', {
                            communityName: formData.communityName,
                        })
                    "
                >
                    <text v-if="formData.communityName" class="value-text">
                        {{ formData.communityName }}
                    </text>
                    <text v-else class="placeholder">请选择小区</text>
                    <uni-icons type="right" color="#999" size="16" class="icon-trigger" />
                </view>
            </uni-forms-item>

            <uni-forms-item label="楼号" name="building">
                <uni-easyinput
                    v-model="formData.building"
                    placeholder="请输入楼号"
                    :inputBorder="false"
                    :clearable="false"
                    trim="both"
                />
            </uni-forms-item>

            <uni-forms-item label="单元号" name="unit">
                <uni-easyinput
                    v-model="formData.unit"
                    placeholder="请输入单元号"
                    :inputBorder="false"
                    :clearable="false"
                    trim="both"
                />
            </uni-forms-item>

            <uni-forms-item label="室号" name="room">
                <uni-easyinput
                    v-model="formData.room"
                    placeholder="请输入室号"
                    :inputBorder="false"
                    :clearable="false"
                />
            </uni-forms-item>

            <uni-forms-item label="当前户型" name="currentRoomType">
                <picker
                    mode="multiSelector"
                    :range="houseTypeRange"
                    :value="formData.currentRoomType"
                    @change="onCurrentRoomTypeChange"
                >
                    <view class="trigger">
                        <text v-if="formData.currentRoomType?.length" class="value-text">
                            {{
                                `${formData.currentRoomType[0] + 1}室${
                                    formData.currentRoomType[1]
                                }厅${formData.currentRoomType[2]}卫`
                            }}
                        </text>
                        <text v-else class="placeholder">请选择户型</text>
                        <uni-icons type="right" color="#999" size="16" class="icon-trigger" />
                    </view>
                </picker>
            </uni-forms-item>

            <uni-forms-item name="originalRoomType">
                <template #label>
                    <view class="form-item-label">
                        <text class="main-text">原始户型</text>
                        <text class="sub-text">(选填)</text>
                    </view>
                </template>
                <picker
                    mode="multiSelector"
                    :range="houseTypeRange"
                    @change="onOriginalHouseTypeChange"
                    :value="formData.originalRoomType"
                >
                    <view class="trigger">
                        <text v-if="formData.originalRoomType?.length" class="value-text">
                            {{
                                `${formData.originalRoomType[0] + 1}室${
                                    formData.originalRoomType[1]
                                }厅${formData.originalRoomType[2]}卫`
                            }}
                        </text>
                        <text v-else class="placeholder">请选择户型</text>
                        <uni-icons type="right" color="#999" size="16" class="icon-trigger" />
                    </view>
                </picker>
            </uni-forms-item>

            <uni-forms-item label="楼层" name="floor">
                <view>
                    <uni-data-checkbox
                        mode="tag"
                        v-model="formData.hasElevator"
                        :localdata="[
                            { text: '电梯', value: 'hasElevator' },
                            { text: '楼梯', value: 'noElevator' },
                        ]"
                        selectedColor="#45cbb9"
                        selectedTextColor="#fff"
                    />
                    <picker
                        mode="multiSelector"
                        :range="floorRange"
                        :value="formData.floor"
                        class="floor-picker"
                        @change="onFloorChange"
                    >
                        <view class="trigger">
                            <text v-if="formData.floor?.length" class="value-text">
                                {{ `第${formData.floor[0] + 1}层，共${formData.floor[1] + 1}层` }}
                            </text>
                            <text v-else class="placeholder">请选择</text>
                            <uni-icons type="right" color="#999" size="16" class="icon-trigger" />
                        </view>
                    </picker>
                </view>
            </uni-forms-item>

            <uni-forms-item v-if="props.tab === 1" label="整套面积" name="area">
                <uni-easyinput
                    v-model="formData.area"
                    type="digit"
                    placeholder="请输入面积"
                    :inputBorder="false"
                    :clearable="false"
                >
                    <template #right>
                        <text>㎡</text>
                    </template>
                </uni-easyinput>
            </uni-forms-item>

            <uni-forms-item v-if="props.tab === 1" label="租金" name="price">
                <uni-easyinput
                    v-model="formData.price"
                    type="digit"
                    placeholder="请输入租金"
                    :inputBorder="false"
                    :clearable="false"
                >
                    <template #right>
                        <text>元/月</text>
                    </template>
                </uni-easyinput>
            </uni-forms-item>

            <uni-forms-item v-if="props.tab === 1" label="出租状态" name="rentStatus">
                <uni-data-checkbox
                    mode="tag"
                    v-model="formData.rentStatus"
                    :localdata="[
                        { text: '已租', value: 'rented' },
                        { text: '未租', value: 'unrented' },
                    ]"
                    selectedColor="#45cbb9"
                    selectedTextColor="#fff"
                />
            </uni-forms-item>

            <uni-forms-item label="带看联系人" name="contacts" label-width="180">
                <template #label>
                    <view class="form-item-label">
                        <text class="main-text">带看联系人</text>
                        <view class="add-contact-btn" @click.stop="showAddContactPopup">
                            <uni-icons type="plusempty" size="12" color="#ff9900"></uni-icons>
                            <text>添加</text>
                        </view>
                    </view>
                </template>
                <view class="trigger" @tap="showContactList">
                    <text class="placeholder">查看</text>
                    <uni-icons type="right" color="#999" size="16"></uni-icons>
                </view>
            </uni-forms-item>
        </uni-forms>
        <add-contact-dialog ref="addContactDialogRef" @confirm="onConfirmContact" />
        <contact-list-popup ref="contactListPopupRef" :contacts="formData.contacts" />
    </view>
</template>

<script setup>
    import sheep from '@/sheep';
    import { ref, computed } from 'vue';
    import { onShow } from '@dcloudio/uni-app';
    import AddContactDialog from './addContactDialog.vue';
    import ContactListPopup from './contactListPopup.vue';

    const props = defineProps({
        tab: {
            type: Number,
            required: true,
        },
    });

    const formRef = ref(null);

    const formData = ref({
        communityName: '',
        communityId: '',
        building: '',
        unit: '',
        room: '',
        currentRoomType: [],
        originalRoomType: [],
        area: '',
        price: '',
        rentStatus: '',
        hasElevator: '',
        floor: '',
        contacts: [],
    });

    const houseTypeRange = [
        new Array(24).fill(0).map((_, i) => `${(i + 1).toString()}室`),
        new Array(25).fill(0).map((_, i) => `${i.toString()}厅`),
        new Array(25).fill(0).map((_, i) => `${i.toString()}卫`),
    ];

    const onCurrentRoomTypeChange = (e) => {
        formData.value.currentRoomType = e.detail.value;
    };

    const onOriginalHouseTypeChange = (e) => {
        formData.value.originalRoomType = e.detail.value;
    };

    const floorRange = [
        new Array(99).fill(0).map((_, i) => `第${i + 1}层`),
        new Array(99).fill(0).map((_, i) => `第${i + 1}层`),
    ];

    const onFloorChange = (e) => {
        formData.value.floor = e.detail.value;
    };

    const addContactDialogRef = ref(null);
    const contactListPopupRef = ref(null);

    const showAddContactPopup = () => {
        addContactDialogRef.value?.open();
    };

    const showContactList = () => {
        contactListPopupRef.value?.open();
    };

    const onConfirmContact = (contact) => {
        formData.value.contacts.push(contact);
    };

    const validateAndReturnData = () => {
        let errorMessage = '';
        if (!formData.value.communityName) {
            errorMessage = '请选择小区';
        } else if (!formData.value.building) {
            errorMessage = '请输入楼号';
        } else if (!formData.value.unit) {
            errorMessage = '请输入单元号';
        } else if (!formData.value.room) {
            errorMessage = '请输入室号';
        } else if (
            !Array.isArray(formData.value.currentRoomType) ||
            !formData.value.currentRoomType.length
        ) {
            errorMessage = '请选择当前户型';
        } else if (
            !Array.isArray(formData.value.originalRoomType) ||
            !formData.value.originalRoomType.length
        ) {
            errorMessage = '请选择原始户型';
        } else if (!formData.value.hasElevator) {
            errorMessage = '请选择楼层类型';
        } else if (!Array.isArray(formData.value.floor) || !formData.value.floor.length) {
            errorMessage = '请选择楼层';
        } else if (props.tab === 1 && !formData.value.area) {
            errorMessage = '请输入整套面积';
        } else if (props.tab === 1 && !formData.value.price) {
            errorMessage = '请输入租金';
        } else if (props.tab === 1 && !formData.value.rentStatus) {
            errorMessage = '请选择出租状态';
        } else if (!Array.isArray(formData.value.contacts) || !formData.value.contacts.length) {
            errorMessage = '请添加带看联系人';
        }

        if (errorMessage) {
            uni.showToast({
                title: errorMessage,
                icon: 'none',
            });
            return null;
        }

        return formData.value;
    };

    onShow(() => {
        const route = sheep.$router.getCurrentRoute();
        const data = JSON.parse(route?.options?.data || '{}');
        if (data.id) {
            formData.value.communityId = data.id;
        }
        if (data.name) {
            formData.value.communityName = data.name;
        }
    });

    defineExpose({
        validateAndReturnData,
    });
</script>

<style lang="scss" scoped>
    .form-item-label {
        display: flex;
        align-items: center;

        .main-text {
            flex-shrink: 0;
            font-size: 28rpx;
            color: #333;
        }

        .sub-text {
            flex-shrink: 0;
            font-size: 22rpx;
            margin-left: 4rpx;
            margin-top: 4rpx;
        }

        .add-contact-btn {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            padding: 6rpx 16rpx;
            border: 1rpx solid #ff9900;
            border-radius: 24rpx;
            margin-left: 16rpx;
            background-color: transparent;
            position: relative;
            z-index: 10;

            text {
                font-size: 24rpx;
                color: #ff9900;
                margin-left: 2rpx;
            }
        }
    }

    .floor-picker {
        display: block;
        margin-top: 24rpx;
        text-align: right;
    }

    :deep(.uni-forms-item__label) {
        color: #333;
    }

    :deep(.checklist-group) {
        justify-content: flex-end !important;
    }

    :deep(.checklist-box.is--tag) {
        border-radius: 32rpx !important;
    }

    :deep(.uni-error-message) {
        display: none;
    }
</style>
