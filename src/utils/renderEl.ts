import { h } from 'vue';
import ElementConfig from '@/lowCode/elementConfig';

export interface JsonData {
    node: CustonNode;
    data?: CustomData;
    methods: CustomMethods;
}

export interface CustonNode {
    type: string;
    props: {
        [key: string]: any;
    };
    children: CustonNodeChildrenDefault;
}

interface CustomData {
    [key: string]: any;
}

interface CustomMethods {
    [key: string]: {
        args: string[];
        func: string;
    };
}

interface CustonNodeChildrenDefault {
    default: string | CustonNode[];
}

interface AnyObj {
    [key: string]: any;
}

/**
 * 处理渲染
 * @param data
 * @param valObj
 * @param id
 * @returns
 */
export function handleRenderEl(
    node: CustonNode,
    jsonData: JsonData,
    valObj: string[],
    id: number
) {
    // 处理 空数据
    if (typeof jsonData.node === 'undefined') return;

    let renderList;

    // 内容
    if (typeof node.children === 'object') {
        if (Array.isArray(node.children.default)) {
            renderList = node.children.default.map((item) => {
                return handleRenderEl(item, jsonData, valObj, id++);
            });
        } else {
            renderList = node.children.default;
        }
    }

    // 渲染
    if (typeof node.type === 'string') {
        const tempProps = {
            ...node.props
        };

        handleBindEvent(tempProps, jsonData);
        handleElRefBind(tempProps, jsonData);
        handleBindValue(tempProps, jsonData);

        // style 判断
        if (typeof node.props.styles !== 'undefined') {
            tempProps.style = handleStyle(node.props.style);
        }

        return h(
            ElementConfig[node.type] || node.type,
            {
                // 引用分离，避免重复渲染
                ...node.props,
                ...tempProps
            },
            {
                default: () => renderList
            }
        );
    }

    throw new TypeError('格式错误');
}

/**
 * 处理 数据绑定
 * @param props
 * @param valObj
 * @param id
 * @returns
 */
// function handleBindValue(props: AnyObj, valObj: string[], id: number) {
//     const tempProps: AnyObj = {};

//     // 作用域引用拆分，避免重复渲染
//     Object.keys(props).forEach((k) => {
//         if (/^v-model:/.test(k)) {
//             const tempK = k.replace(/v-model:/, '');
//             const tempArr = tempK.split('');
//             tempArr[0] = tempArr[0].toUpperCase();

//             // 'modelXxxx', 例如: 'modelValue'
//             const bindName = 'model' + tempArr.join('');

//             // 赋值
//             tempProps[bindName] = valObj[id];

//             // 事件监听
//             tempProps['onUpdate:' + bindName] = (val) => {
//                 // 组件数据更新
//                 valObj[id] = val;

//                 // json同步数据
//                 props[bindName] = val;
//             };
//         }
//     });

//     return tempProps;
// }
function handleBindValue(tempProps: AnyObj, jsonData: JsonData) {
    Object.keys(tempProps).forEach((k) => {
        const val = tempProps[k];

        // 匹配命中
        if (hasJsonPathMatch(val)) {
            const { afterPath } = handleParseJsonPathMatch(jsonData, val)[0];

            tempProps[k] = eval(afterPath);
        }
    });

    // console.log(tempProps);
}

/**
 * 处理 样式转换
 * @param style
 * @returns
 */
function handleStyle(style: AnyObj) {
    return Object.keys(style).map((k) => {
        return `${k}:${style[k]};`;
    });
}

/**
 * 处理 事件绑定
 * @param props
 * @param methods
 * @returns
 */
function handleBindEvent(tempProps: AnyObj, jsonData: JsonData) {
    Object.keys(tempProps).forEach((eventName) => {
        // 事件名称匹配 onXxxx, 例如: 'onClick'
        if (/^on[A-Z]+/.test(eventName)) {
            const toEventName: string = tempProps[eventName];

            let { func } = eval(
                handleParseJsonPathMatch(jsonData, toEventName)[0].afterPath
            );

            // 匹配命中，解析规则
            if (hasJsonPathMatch(func)) {
                const mathcRes = handleParseJsonPathMatch(jsonData, func);

                mathcRes.forEach((item) => {
                    func = func.replace(
                        new RegExp(item.beforePath),
                        item.afterPath
                    );
                });
            }

            tempProps[eventName] = function () {
                eval(func);
            };
        }
    });
}

/**
 * 处理 data
 * @param data
 * @returns
 */
export function handleData(data: CustomData) {
    const tempData = {};
    const kList = Object.keys(data);

    if (kList.length === 0) {
        return tempData;
    }

    kList.forEach(async (k) => {
        const v = data[k];

        // "eval('xxx')", 例如: "eval('console.log(`is eval`)')"
        if (/^eval(.*?)$/.test(v)) {
            // tempData[k + 'A'] = ref('AAA');
            // data[k] = window.$vue.ref('AAA');
            tempData[k] = eval(v.replace(/^eval\(/, '').replace(/\)$/, ''));
        }
    });

    return tempData;
}

/**
 * 处理 组件 ref 绑定
 * @param tempProps
 * @param jsonData
 */
function handleElRefBind(tempProps: AnyObj, jsonData: JsonData) {
    // 跳过 解析
    if (typeof tempProps.ref === 'undefined') {
        return tempProps;
    }

    // 数据命中，"#data.xxxxx#", 例如："#data.formRef#" => "data.formRef"
    if (!hasJsonPathMatch(tempProps.ref)) {
        return tempProps;
    }

    tempProps.ref = eval(
        handleParseJsonPathMatch(jsonData, tempProps.ref)[0].afterPath
    );
}

/**
 * 处理 json文件 路径解析
 * @param jsonData
 * @param matchPath
 * @returns
 */
function handleParseJsonPathMatch(jsonData: JsonData, matchPath: string) {
    if (!hasJsonPathMatch(matchPath)) {
        console.error(matchPath);
        throw new TypeError('json解析属性错误');
    }

    return matchPath.match(/{{[\S\d]+}}/g).map((name) => {
        const pathList = name.replace(/[{}]/g, '').split('.');
        const afterPath = pathList.map((path) => `["${path}"]`).join('');

        return {
            afterPath: 'jsonData' + afterPath,
            beforePath: name
        };
    });
}

/**
 * 是否有 json文件 路径匹配, 例如 "{{data.formRef}})", "{{methods.onSubmit}}"
 * @param matchPath
 * @returns
 */
function hasJsonPathMatch(matchPath: string): boolean {
    return /{{[\S\d]+}}/.test(matchPath);
}
