import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJsx()],

    // 路径映射
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.jsx', '.vue', '.json'],
        alias: {
            '@': Path.resolve(__dirname, './src')
        }
    }
});
