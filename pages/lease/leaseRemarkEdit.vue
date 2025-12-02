<template>
    <s-layout title="租约备注" :bgStyle="{ backgroundColor: '#fff' }">
        <view class="content">
            <!-- 文字备注 -->
            <view class="section">
                <view class="section-title">文字备注（选填）</view>
                <up-textarea
                    v-model.trim="remark"
                    placeholder="请输入备注信息"
                    border="none"
                    height="160"
                    :maxlength="-1"
                    :customStyle="{ backgroundColor: '#f9f9f9', padding: '20rpx' }"
                ></up-textarea>
            </view>

            <!-- 图片凭证 -->
            <view class="section">
                <view class="section-title">图片凭证（{{ fileList.length }}/6）</view>
                <s-media-upload
                    v-model="fileList"
                    :maxCount="6"
                    :autoUploadAuthUrl="authUrl"
                    :autoUploadHeader="uploadHeader"
                    deletable
                    @upload-success="handleUploadSuccess"
                    @delete-item="handleDelete"
                    @click-item="handlePreview"
                ></s-media-upload>
            </view>
        </view>

        <!-- 底部按钮 -->
        <su-fixed bottom :bgStyles="{ backgroundColor: '#fff' }">
            <view class="footer">
                <up-button
                    type="primary"
                    text="保存"
                    shape="circle"
                    @click="handleSave"
                ></up-button>
            </view>
        </su-fixed>
    </s-layout>
</template>

<script setup>
    import { ref } from 'vue';
    import sheep from '@/sheep';
    import { baseUrl, apiPath } from '@/sheep/config';
    import { getAccessToken, getTenantId } from '@/sheep/request';
    import sMediaUpload from '@/sheep/components/s-media-upload/s-media-upload.vue';

    const remark = ref('');
    const fileList = ref([]);
    const authUrl = baseUrl + apiPath + '/infra/file/presigned-url';
    const uploadHeader = {
        Authorization: 'Bearer ' + getAccessToken(),
        'tenant-id': getTenantId(),
        Accept: '*/*',
    };

    // 上传成功回调
    const handleUploadSuccess = (newItems) => {
        fileList.value.push(...newItems);
    };

    const handlePreview = ({ item, index }) => {
        const urls = fileList.value.map((item) => item.url);
        uni.previewImage({
            urls,
            current: urls[index],
        });
    };

    const handleDelete = (index) => {
        fileList.value.splice(index, 1);
    };

    // 保存
    const handleSave = () => {
        // TODO: 调用保存接口
        console.log('保存数据', {
            remark: remark.value,
            files: fileList.value,
        });

        uni.showToast({
            title: '保存成功',
            icon: 'success',
        });

        setTimeout(() => {
            sheep.$router.back();
        }, 1500);
    };
</script>

<style lang="scss" scoped>
    .content {
        padding: 30rpx;
    }

    .section {
        margin-bottom: 50rpx;
    }

    .section-title {
        font-size: 28rpx;
        font-weight: 500;
        color: #333;
        margin-bottom: 24rpx;
    }

    .footer {
        padding: 20rpx 30rpx;
    }
</style>
