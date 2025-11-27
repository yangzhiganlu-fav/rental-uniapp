<template>
    <s-layout title="添加房间" :bgStyle="{ color: '#666' }">
        <template #right>
            <button type="primary" size="mini" @tap="onSave">保存</button>
        </template>

        <view class="content-wrapper">
            <uni-group title="地址门牌" style="margin-top: 0">
                <up-cell title="小区地址">
                    <template #right-icon>
                        <view class="address-info">
                            <view>光明新区南路</view>
                            <view class="address-detail">花桥镇光明路1235号</view>
                        </view>
                    </template>
                </up-cell>
                <up-cell title="门牌号">
                    <template #right-icon>
                        <view class="address-info">12栋302室</view>
                    </template>
                </up-cell>
            </uni-group>

            <up-gap height="20" bgColor="#eee"></up-gap>

            <view class="form-container">
                <uni-forms ref="formRef" :model="formData" label-width="140" label-align="left">
                    <uni-forms-item name="roomName">
                        <template #label>
                            <view class="form-item-label">
                                <uni-icons type="home-filled" size="24" color="#999"></uni-icons>
                                <text class="bold-text">待添加房间</text>
                            </view>
                        </template>
                        <uni-data-checkbox
                            mode="tag"
                            v-model="formData.rentStatus"
                            :localdata="rentStatusRange"
                            selectedColor="#45cbb9"
                            selectedTextColor="#fff"
                        />
                    </uni-forms-item>

                    <uni-forms-item label="房间名称" name="roomName">
                        <uni-easyinput
                            v-model="formData.roomName"
                            placeholder="请输入房间名称"
                            :inputBorder="false"
                            :clearable="false"
                        />
                    </uni-forms-item>

                    <uni-forms-item label="房间面积" name="area">
                        <uni-easyinput
                            v-model="formData.area"
                            type="digit"
                            placeholder="请输入"
                            :inputBorder="false"
                            :clearable="false"
                        >
                            <template #right>
                                <text>㎡</text>
                            </template>
                        </uni-easyinput>
                    </uni-forms-item>

                    <uni-forms-item label="卧型/朝向" name="orientation">
                        <view class="trigger" @click="showOrientationPicker = true">
                            <text v-if="formData.orientation?.length" class="value-text">
                                {{ `${formData.orientation[0]} ${formData.orientation[1]}` }}
                            </text>
                            <text v-else class="placeholder">请选择</text>
                            <uni-icons type="right" color="#999" size="16" class="icon-trigger" />
                        </view>
                    </uni-forms-item>

                    <uni-forms-item label="租金" name="price">
                        <uni-easyinput
                            v-model="formData.price"
                            type="digit"
                            placeholder="请输入"
                            :inputBorder="false"
                            :clearable="false"
                        >
                            <template #right>
                                <text>元/月</text>
                            </template>
                        </uni-easyinput>
                    </uni-forms-item>

                    <uni-forms-item label="短租费用" name="shortTermPrice">
                        <uni-easyinput
                            v-model="formData.shortTermPrice"
                            type="digit"
                            placeholder="请输入"
                            :inputBorder="false"
                            :clearable="false"
                        />
                    </uni-forms-item>

                    <uni-forms-item label="每月收费标准" label-width="200">
                        <view class="trigger">
                            <view class="edit-fee-btn" @tap="onEditFee">编辑费用</view>
                        </view>
                    </uni-forms-item>

                    <uni-forms-item label="带看联系人" name="contacts" label-width="230">
                        <template #label>
                            <view class="form-item-label">
                                <text class="main-text">带看联系人</text>
                                <view class="add-contact-btn" @click.stop="showAddContactPopup">
                                    <uni-icons
                                        type="plusempty"
                                        size="12"
                                        color="#ff9900"
                                    ></uni-icons>
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
            </view>
        </view>

        <up-picker
            :show="showOrientationPicker"
            :columns="orientationRange"
            :defaultIndex="orientationIndex"
            @confirm="onOrientationConfirm"
            @cancel="showOrientationPicker = false"
        ></up-picker>

        <add-contact-dialog ref="addContactDialogRef" @confirm="onConfirmContact" />
        <contact-list-popup ref="contactListPopupRef" :contacts="formData.contacts" />
    </s-layout>
</template>

<script setup>
    import { ref } from 'vue';
    import AddContactDialog from './components/addContactDialog.vue';
    import ContactListPopup from './components/contactListPopup.vue';

    // =================================================================================================
    // 表单数据定义
    // =================================================================================================
    const formRef = ref(null);
    const formData = ref({
        rentStatus: 'unrented',
        roomName: '',
        area: '',
        orientation: [],
        price: '',
        shortTermPrice: '',
        contacts: [],
    });

    const rentStatusRange = [
        { text: '未租', value: 'unrented' },
        { text: '已租', value: 'rented' },
    ];

    // =================================================================================================
    // 卧型/朝向选择逻辑
    // =================================================================================================
    const showOrientationPicker = ref(false);
    const orientationIndex = ref([0, 0]);
    const orientationRange = [
        ['主卧', '次卧'],
        ['朝东', '朝南', '朝西', '朝北'],
    ];

    const onOrientationConfirm = (e) => {
        formData.value.orientation = e.value;
        orientationIndex.value = e.indexs;
        showOrientationPicker.value = false;
    };

    // =================================================================================================
    // 费用编辑逻辑
    // =================================================================================================
    const onEditFee = () => {
        uni.showToast({
            title: '编辑费用功能开发中',
            icon: 'none',
        });
    };

    // =================================================================================================
    // 联系人逻辑
    // =================================================================================================
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

    // =================================================================================================
    // 保存逻辑
    // =================================================================================================
    const onSave = () => {
        let errorMessage = '';
        if (!formData.value.roomName) {
            errorMessage = '请输入房间名称';
        } else if (!formData.value.area) {
            errorMessage = '请输入房间面积';
        } else if (!formData.value.orientation || formData.value.orientation.length === 0) {
            errorMessage = '请选择卧型/朝向';
        } else if (!formData.value.price) {
            errorMessage = '请输入租金';
        } else if (!formData.value.contacts || formData.value.contacts.length === 0) {
            errorMessage = '请添加带看联系人';
        }

        if (errorMessage) {
            uni.showToast({
                title: errorMessage,
                icon: 'none',
            });
            return;
        }

        uni.showToast({
            title: '保存成功',
            icon: 'success',
        });
        // TODO: 提交数据到后端
    };
</script>

<style lang="scss" scoped>
    .address-info {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        color: #999;

        .address-detail {
            margin-top: 16rpx;
            font-size: 24rpx;
        }
    }

    :deep(.uni-group__content) {
        padding: 0 !important;
    }

    .content-wrapper {
        height: 100%;
        background-color: #fff;
    }

    .form-container {
        padding: 0 30rpx;
    }

    .form-item-label {
        display: flex;
        align-items: center;

        .main-text {
            flex-shrink: 0;
            font-size: 28rpx;
            color: #333;
        }

        .bold-text {
            flex-shrink: 0;
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
            margin-left: 8rpx;
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

    .edit-fee-btn {
        font-size: 24rpx;
        color: #ff9900;
        border: 1rpx solid #ff9900;
        padding: 6rpx 20rpx;
        border-radius: 24rpx;
    }

    :deep(.uni-forms-item__label) {
        color: #333;
    }

    :deep(.checklist-box.is--tag) {
        border-radius: 32rpx !important;
    }

    :deep(.uni-error-message) {
        display: none;
    }

    :deep(.uni-data-checklist .checklist-group) {
        flex-direction: row-reverse !important;
    }

    :deep(.u-cell__title-text) {
        font-size: 28rpx;
        color: #333;
    }
</style>
