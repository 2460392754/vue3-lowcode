import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import viteCompression from 'vite-plugin-compression';
import importToCDN from 'vite-plugin-cdn-import';
import Path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    base: './',

    plugins: [
        vue(),
        vueJsx(),

        // gzip压缩
        viteCompression({
            verbose: false,
            disable: false,
            threshold: 1024 * 10,
            algorithm: 'gzip',
            ext: '.gz'
        }),

        // cdn
        importToCDN({
            modules: [
                {
                    name: 'vue',
                    var: 'Vue',
                    path: 'https://cdn.bootcdn.net/ajax/libs/vue/3.2.25/vue.runtime.global.prod.min.js'
                },
                {
                    name: 'element-plus',
                    var: 'ElementPlus',
                    path: 'https://cdn.bootcdn.net/ajax/libs/element-plus/2.1.2/index.full.min.js',
                    css: 'https://cdn.bootcdn.net/ajax/libs/element-plus/2.1.2/index.min.css'
                },
                {
                    name: '@element-plus/icons-vue',
                    var: 'ElementPlusIconsVue',
                    path: 'https://unpkg.com/@element-plus/icons-vue@1.1.1/dist/index.iife.min.js'
                }
            ]
        }),
    ],

    build: {
        // css 文件合并
        cssCodeSplit: false,

        // gzip 压缩报告输出
        reportCompressedSize: false

        // chunk 分割
        // rollupOptions: {
        //     output: {
        //         manualChunks: {
        //             'lib/element-plus-icons': ['@element-plus/icons-vue']
        //         }
        //     }
        // }
    },

    // 路径映射
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.jsx', '.vue', '.json'],
        alias: {
            '@': Path.resolve(__dirname, './src')
        }
    }
});
