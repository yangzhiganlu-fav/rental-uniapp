import { loadEnv } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import path from 'path';
// import viteCompression from 'vite-plugin-compression';
import uniReadPagesV3Plugin from './sheep/router/utils/uni-read-pages-v3';
import mpliveMainfestPlugin from './sheep/libs/mplive-manifest-plugin';

// https://vitejs.dev/config/
export default (command, mode) => {
    const env = loadEnv(mode, __dirname, 'SHOPRO_');
    return {
        envPrefix: 'SHOPRO_',
        plugins: [
            uni(),
            // viteCompression({
            // 	verbose: false
            // }),
            uniReadPagesV3Plugin({
                pagesJsonDir: path.resolve(__dirname, './pages.json'),
                includes: ['path', 'aliasPath', 'name', 'meta'],
            }),
            mpliveMainfestPlugin(env.SHOPRO_MPLIVE_ON),
        ],
        server: {
            host: true,
            // open: true,
            port: env.SHOPRO_DEV_PORT,
            hmr: {
                overlay: true,
            },
        },
        css: {
            postcss: {
                plugins: [
                    require('postcss-pxtorpx-pro')({
                        unit: 'rpx', // 转换单位
                        unitPrecision: 5, // 精度
                        propList: ['*'], // 转换的属性列表，*代表所有属性
                        minPixelValue: 2, // 最小转换值
                        // 根据设计稿调整转换比率，例如设计稿宽375px，则1px -> 2rpx
                        transform: (x) => 2 * x,
                    }),
                ],
            },
        },
    };
};
