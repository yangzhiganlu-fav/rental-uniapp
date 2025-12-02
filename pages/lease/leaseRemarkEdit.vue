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
                <up-upload
                    :fileList="fileList"
                    @afterRead="afterRead"
                    @delete="deletePic"
                    name="1"
                    multiple
                    :maxCount="6"
                    width="108"
                    height="108"
                ></up-upload>
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

    const remark = ref('');
    const fileList = ref([]);

    // 删除图片
    const deletePic = (event) => {
        fileList.value.splice(event.index, 1);
    };

    // 新增图片
    const afterRead = async (event) => {
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        let lists = [].concat(event.file);
        let fileListLen = fileList.value.length;
        lists.map((item) => {
            fileList.value.push({
                ...item,
                status: 'uploading',
                message: '上传中',
            });
        });
        for (let i = 0; i < lists.length; i++) {
            const result = await sheep.$api.file.uploadFile(lists[i].url);
            let item = fileList.value[fileListLen];
            if (result) {
                fileList.value.splice(
                    fileListLen,
                    1,
                    Object.assign(item, {
                        status: 'success',
                        message: '',
                        url: result.data,
                    }),
                );
            } else {
                fileList.value.splice(
                    fileListLen,
                    1,
                    Object.assign(item, {
                        status: 'failed',
                        message: '上传失败',
                    }),
                );
            }
            fileListLen++;
        }
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
