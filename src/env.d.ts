/// <reference types="vite/client" />
import type * as Vue from 'vue';
import type { ElMessage } from 'element-plus';

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare global {
    interface Window {
        $vue: Vue;
        $message: ElMessage;
    }
}
