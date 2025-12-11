<template>
    <s-layout title="证件照片" :bgStyle="{ backgroundColor: '#fff' }">
        <view class="content">
            <view v-for="(url, index) in urls" :key="index" class="image-box">
                <up-image
                    :src="url"
                    width="100%"
                    height="100%"
                    mode="aspectFit"
                    :show-loading="true"
                    @click="handlePreview(index)"
                >
                    <template #error>
                        <view class="error-slot">
                            <uni-icons type="image" size="40" color="#ccc"></uni-icons>
                            <text>暂无图片</text>
                        </view>
                    </template>
                </up-image>
            </view>
        </view>
    </s-layout>
</template>

<script setup>
    import { ref } from 'vue';
    import { onLoad } from '@dcloudio/uni-app';

    const urls = ref([]);

    onLoad((options) => {
        const fileUrls = options.urls ? JSON.parse(options.urls) : [];
        urls.value = fileUrls.map((item) => item.url);
    });

    const handlePreview = (index) => {
        uni.previewImage({
            urls: urls.value,
            current: urls.value[index],
        });
    };
</script>

<style lang="scss" scoped>
    .content {
        padding: 30rpx;
    }

    .image-box {
        width: 100%;
        height: 400rpx;
        background-color: #f5f5f5;
        border-radius: 12rpx;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 30rpx;
    }

    .error-slot {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #999;
        font-size: 24rpx;

        text {
            margin-top: 10rpx;
        }
    }
</style>
