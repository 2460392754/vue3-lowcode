import * as ElementPlus from 'element-plus';

const component = {};

// 筛选出 element-plus 组件，例如："ElButton"
Object.keys(ElementPlus).forEach((k) => {
    if (/^El/.test(k)) {
        component[k] = ElementPlus[k];
    }
});

export default component;
