import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import viteCompression from 'vite-plugin-compression';
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
        })
    ],

    // 路径映射
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.jsx', '.vue', '.json'],
        alias: {
            '@': Path.resolve(__dirname, './src')
        }
    }
});
