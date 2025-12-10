import App from './App';
import { createSSRApp } from 'vue';
import { setupPinia } from './sheep/store';
import $store from '@/sheep/store';

import uviewPlus from '@/uni_modules/uview-plus';

export function createApp() {
    const app = createSSRApp(App);

    app.use(uviewPlus, () => {
        return {
            options: {
                config: {
                    unit: 'rpx',
                },
            },
        };
    });

    setupPinia(app);

    app.mixin({
        onShow() {
            if (this.route && typeof ROUTES_MAP !== 'undefined') {
                const path = '/' + this.route.replace(/^\//, '');
                const config = ROUTES_MAP[path];
                if (config?.meta?.auth) {
                    const userStore = $store('user');
                    if (!userStore.isLogin) {
                        if (path !== '/pages/login/index') {
                            uni.reLaunch({
                                url: '/pages/login/index',
                            });
                        }
                    }
                }
            }
        },
    });

    return {
        app,
    };
}
