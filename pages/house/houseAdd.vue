<template>
    <s-layout title="录入房源">
        <template #right>
            <button v-if="community?.id" type="primary" size="mini" @tap="onSave">保存</button>
        </template>
        <su-sticky>
            <su-tabs
                :list="tabMaps"
                :scrollable="false"
                :current="currentTab"
                @change="onTabsChange"
            />
        </su-sticky>
        <s-empty
            v-if="!community?.id"
            showAction
            actionText="请选择小区"
            action-url="/pages/house/communitySelect"
            icon="/static/data-empty.png"
        />

        <view v-else class="form-container">
            <uni-forms ref="formRef" :model="formData" label-width="140" label-align="left">
                <uni-forms-item label="小区" name="communityName">
                    <view
                        class="trigger"
                        @tap="
                            sheep.$router.go('/pages/house/communitySelect', {
                                communityName: formData.communityName,
                            })
                        "
                    >
                        <text v-if="formData.communityName" class="value-text">
                            {{ formData.communityName }}
                        </text>
                        <text v-else class="placeholder">请选择小区</text>
                        <uni-icons type="right" color="#333" size="16" class="icon-trigger" />
                    </view>
                </uni-forms-item>

                <uni-forms-item label="楼号" name="building">
                    <uni-easyinput
                        v-model.trim="formData.building"
                        placeholder="请输入楼号"
                        :inputBorder="false"
                        :clearable="false"
                        trim="both"
                    />
                </uni-forms-item>

                <uni-forms-item label="单元号" name="unit">
                    <uni-easyinput
                        v-model.trim="formData.unit"
                        placeholder="请输入单元号"
                        :inputBorder="false"
                        :clearable="false"
                        trim="both"
                    />
                </uni-forms-item>

                <uni-forms-item label="室号" name="room">
                    <uni-easyinput
                        v-model.trim="formData.room"
                        placeholder="请输入室号"
                        :inputBorder="false"
                        :clearable="false"
                    />
                </uni-forms-item>

                <uni-forms-item label="当前户型" name="currentRoomType">
                    <view class="trigger" @tap="showCurrentRoomTypePicker = true">
                        <text v-if="formData.currentRoomType?.length" class="value-text">
                            {{
                                `${formData.currentRoomType[0] + 1}室 ${
                                    formData.currentRoomType[1]
                                } 厅 ${formData.currentRoomType[2]}卫`
                            }}
                        </text>
                        <text v-else class="placeholder">请选择户型</text>
                        <uni-icons type="right" color="#333" size="16" class="icon-trigger" />
                    </view>
                </uni-forms-item>

                <uni-forms-item name="originalRoomType">
                    <template #label>
                        <view class="form-item-label">
                            <text class="main-text">原始户型</text>
                            <text class="sub-text">(选填)</text>
                        </view>
                    </template>
                    <view class="trigger" @tap="showOriginalRoomTypePicker = true">
                        <text v-if="formData.originalRoomType?.length" class="value-text">
                            {{
                                `${formData.originalRoomType[0] + 1}室 ${
                                    formData.originalRoomType[1]
                                } 厅 ${formData.originalRoomType[2]}卫`
                            }}
                        </text>
                        <text v-else class="placeholder">请选择户型</text>
                        <uni-icons type="right" color="#333" size="16" class="icon-trigger" />
                    </view>
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
                        <view class="trigger floor-picker" @tap="openFloorPicker">
                            <text v-if="formData.floor?.length" class="value-text">
                                {{ `第${formData.floor[0] + 1}层，共${formData.floor[1] + 1}层` }}
                            </text>
                            <text v-else class="placeholder">请选择</text>
                            <uni-icons type="right" color="#333" size="16" class="icon-trigger" />
                        </view>
                    </view>
                </uni-forms-item>

                <uni-forms-item v-if="currentTab === 1" label="整套面积" name="area">
                    <uni-easyinput
                        v-model.trim="formData.area"
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

                <uni-forms-item v-if="currentTab === 1" label="租金" name="price">
                    <uni-easyinput
                        v-model.trim="formData.price"
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

                <uni-forms-item v-if="currentTab === 1" label="出租状态" name="rentStatus">
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
                            <view class="add-contact-btn" @tap.stop="showAddContactPopup">
                                <s-icon name="plus" size="24" color="#ff9900" />
                                <text>添加</text>
                            </view>
                        </view>
                    </template>
                    <view class="trigger" @tap="showContactList">
                        <text class="placeholder">查看</text>
                        <uni-icons type="right" color="#999" size="16"></uni-icons>
                    </view>
                </uni-forms-item>

                <up-picker
                    :show="showCurrentRoomTypePicker"
                    :columns="houseTypeRange"
                    :defaultIndex="formData.currentRoomType"
                    @confirm="onCurrentRoomTypeChange"
                    @cancel="showCurrentRoomTypePicker = false"
                ></up-picker>

                <up-picker
                    :show="showOriginalRoomTypePicker"
                    :columns="houseTypeRange"
                    :defaultIndex="formData.originalRoomType"
                    @confirm="onOriginalHouseTypeChange"
                    @cancel="showOriginalRoomTypePicker = false"
                ></up-picker>

                <up-picker
                    ref="floorPickerRef"
                    title="层数/总层数"
                    :show="showFloorPicker"
                    :columns="floorRange"
                    :defaultIndex="formData.floor"
                    @confirm="onFloorChange"
                    @cancel="showFloorPicker = false"
                    @change="onFloorPickerChange"
                ></up-picker>
            </uni-forms>

            <add-contact-modal ref="addContactModalRef" @confirm="onConfirmContact" />

            <contact-list-popup ref="contactListPopupRef" :contacts="formData.contacts" />
        </view>
    </s-layout>
</template>

<script setup>
    import sheep from '@/sheep';
    import { ref, watch } from 'vue';
    import { onLoad, onUnload } from '@dcloudio/uni-app';
    import AddContactModal from './components/modal/addContactModal.vue';
    import ContactListPopup from './components/popup/contactListPopup.vue';

    // =================================================================================================
    // 状态定义
    // =================================================================================================
    const community = ref(null);
    const currentTab = ref(0);
    const tabMaps = [
        { name: '合租', value: 0 },
        { name: '整租', value: 1 },
    ];

    // =================================================================================================
    // 表单数据定义
    // =================================================================================================
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
        floor: [],
        contacts: [],
    });

    // =================================================================================================
    // 户型选择逻辑 (当前户型 & 原始户型)
    // =================================================================================================
    // 户型选择器数据源：室、厅、卫
    const houseTypeRange = [
        new Array(24).fill(0).map((_, i) => `${(i + 1).toString()}室`),
        new Array(25).fill(0).map((_, i) => `${i.toString()}厅`),
        new Array(25).fill(0).map((_, i) => `${i.toString()}卫`),
    ];

    // 当前户型选择器状态
    const showCurrentRoomTypePicker = ref(false);
    // 处理当前户型变更
    const onCurrentRoomTypeChange = (e) => {
        formData.value.currentRoomType = e.indexs;
        showCurrentRoomTypePicker.value = false;
    };

    // 原始户型选择器状态
    const showOriginalRoomTypePicker = ref(false);
    // 处理原始户型变更
    const onOriginalHouseTypeChange = (e) => {
        formData.value.originalRoomType = e.indexs;
        showOriginalRoomTypePicker.value = false;
    };

    // =================================================================================================
    // 楼层选择逻辑
    // =================================================================================================
    // 楼层选择器数据源：所在层、总层数
    const floorRange = [
        new Array(99).fill(0).map((_, i) => `第${i + 1}层`),
        new Array(99).fill(0).map((_, i) => `共${i + 1}层`),
    ];

    const showFloorPicker = ref(false);
    const floorPickerRef = ref(null);

    // 打开楼层选择器
    const openFloorPicker = () => {
        showFloorPicker.value = true;
    };

    // 确认楼层选择
    const onFloorChange = (e) => {
        // 提取数字并转换为索引 (0-based)
        const floorVal = parseInt(e.value[0].replace(/\D/g, '')) - 1;
        const totalVal = parseInt(e.value[1].replace(/\D/g, '')) - 1;
        formData.value.floor = [floorVal, totalVal];
        showFloorPicker.value = false;
    };

    // 楼层选择器列变化处理 (联动逻辑)
    const onFloorPickerChange = (e) => {
        const { columnIndex, index, indexs } = e;
        // 当改变第一列（所在层）时，更新第二列（总层数），确保总层数 >= 所在层
        if (columnIndex === 0) {
            const startFloor = index + 1;
            const totalFloors = new Array(99 - startFloor + 1)
                .fill(0)
                .map((_, i) => `共${startFloor + i}层`);
            floorPickerRef.value.setColumnValues(1, totalFloors);
        }
    };

    // =================================================================================================
    // 联系人逻辑
    // =================================================================================================
    const addContactModalRef = ref(null);
    const contactListPopupRef = ref(null);

    // 显示添加联系人弹窗
    const showAddContactPopup = () => {
        addContactModalRef.value?.open();
    };

    // 显示联系人列表弹窗
    const showContactList = () => {
        contactListPopupRef.value?.open();
    };

    // 确认添加联系人回调
    const onConfirmContact = (contact) => {
        formData.value.contacts.push(contact);
    };

    // =================================================================================================
    // 页面事件处理
    // =================================================================================================
    const onTabsChange = (e) => {
        currentTab.value = e.index;
    };

    // 验证表单数据并返回，如果有错误则提示
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
        } else if (currentTab.value === 1 && !formData.value.area) {
            errorMessage = '请输入整套面积';
        } else if (currentTab.value === 1 && !formData.value.price) {
            errorMessage = '请输入租金';
        } else if (currentTab.value === 1 && !formData.value.rentStatus) {
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

    const onSave = () => {
        const data = validateAndReturnData();
        if (data) {
            uni.showToast({
                title: '保存成功',
                icon: 'success',
            });
            // TODO: 提交数据到后端
        }
    };

    // =================================================================================================
    // 生命周期钩子
    // =================================================================================================
    onLoad(() => {
        uni.$on('SELECT_COMMUNITY', (data) => {
            community.value = data;
        });
    });

    onUnload(() => {
        uni.$off('SELECT_COMMUNITY');
    });

    // 监听 community 变化，更新 formData
    watch(
        community,
        (newVal) => {
            if (newVal) {
                formData.value.communityId = newVal.id;
                formData.value.communityName = newVal.name;
            }
        },
        { immediate: true },
    );
</script>

<style lang="scss" scoped>
    .form-container {
        padding: 0 20rpx 240rpx 20rpx;
        background-color: $white;
    }

    .floor-picker {
        display: block;
        margin-top: $tx-sm;
        text-align: right;
    }

    :deep(.uni-forms-item__label) {
        color: $black;
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
