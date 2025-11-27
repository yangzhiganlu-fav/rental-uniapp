import App from './App';
import { createSSRApp } from 'vue';
import { setupPinia } from './sheep/store';
import uviewPlus from '@/uni_modules/uview-plus';

export function createApp() {
    const app = createSSRApp(App);

    app.use(uviewPlus);

    setupPinia(app);

    return {
        app,
    };
}
