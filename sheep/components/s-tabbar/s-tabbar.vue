<template>
    <view class="u-page__item" v-if="tabbar?.items?.length > 0">
        <su-tabbar
            :value="path"
            :fixed="true"
            :placeholder="true"
            :safeAreaInsetBottom="true"
            :inactiveColor="tabbar.style.color"
            :activeColor="tabbar.style.activeColor"
            :midTabBar="tabbar.mode === 2"
            :customStyle="tabbarStyle"
        >
            <su-tabbar-item
                v-for="(item, index) in tabbar.items"
                :key="item.text"
                :text="item.text"
                :name="item.url"
                :badge="item.badge"
                :dot="item.dot"
                :badgeStyle="tabbar.badgeStyle"
                :isCenter="getTabbarCenter(index)"
                :centerImage="sheep.$url.cdn(item.iconUrl)"
                :icon="item.icon"
                @tap="sheep.$router.go(item.url)"
            >
                <template v-slot:active-icon>
                    <image
                        class="u-page__item__slot-icon"
                        :src="sheep.$url.cdn(item.activeIconUrl)"
                    ></image>
                </template>
                <template v-slot:inactive-icon>
                    <image
                        class="u-page__item__slot-icon"
                        :src="sheep.$url.cdn(item.iconUrl)"
                    ></image>
                </template>
            </su-tabbar-item>
        </su-tabbar>
    </view>
</template>

<script setup>
    import { computed, unref, ref } from 'vue';
    import sheep from '@/sheep';
    import SuTabbar from '@/sheep/ui/su-tabbar/su-tabbar.vue';

    const tabbar = ref({
        mode: 1,
        theme: 'red',
        style: {
            bgType: 'color',
            bgColor: '#fff',
            color: '#282828',
            activeColor: '#409EFF',
        },
        items: [
            {
                text: '首页',
                url: '/pages/index/index',
                icon: 'home',
            },
            {
                text: '房源',
                url: '/pages/house/houseList',
                icon: 'fangdong',
            },
            {
                text: '租约',
                url: '/pages/contract/index',
                icon: 'hetong',
            },
            {
                text: '我的',
                url: '/pages/mine/index',
                icon: 'yonghu',
            },
        ],
    });

    const tabbarStyle = computed(() => {
        const backgroundStyle = tabbar.value.style;
        if (backgroundStyle.bgType === 'color') {
            return { background: backgroundStyle.bgColor };
        }
        if (backgroundStyle.bgType === 'img')
            return {
                background: `url(${sheep.$url.cdn(
                    backgroundStyle.bgImg,
                )}) no-repeat top center / 100% auto`,
            };
    });

    const getTabbarCenter = (index) => {
        if (unref(tabbar).mode !== 2) return false;
        return unref(tabbar).items % 2 > 0
            ? Math.ceil(unref(tabbar).items.length / 2) === index + 1
            : false;
    };

    const props = defineProps({
        path: String,
        default: '',
    });
</script>

<style lang="scss">
    .u-page {
        padding: 0;

        &__item {
            &__title {
                color: var(--textSize);
                background-color: #fff;
                padding: 15px;
                font-size: 15px;

                &__slot-title {
                    color: var(--textSize);
                    font-size: 14px;
                }
            }

            &__slot-icon {
                width: 25px;
                height: 25px;
            }
        }
    }
</style>
