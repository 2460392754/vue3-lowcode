import { createApp } from 'vue';
import * as Vue from 'vue';
import App from './App.vue';
// ===
import ElementPlus, { ElMessage } from 'element-plus';
import 'element-plus/dist/index.css';
// ===
import * as ElementIcons from '@element-plus/icons-vue';
// ===

const app = createApp(App);

window.$vue = Vue;
window.$message = ElMessage;

Object.keys(ElementIcons).forEach((k) => {
    app.component(k, ElementIcons[k]);
});

app.use(ElementPlus).mount('#app');
