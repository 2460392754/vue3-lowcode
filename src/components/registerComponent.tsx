import { PropType, reactive, defineComponent, watch, watchEffect } from 'vue';
import { handleRenderEl, JsonData, handleData } from '@/utils/renderEl';
import ElementConfig from '@/lowCode/elementConfig';

const reactiveVal = reactive<string[]>([]);

export default defineComponent({
    props: {
        data: {
            type: [Object, null] as PropType<JsonData | null>,
            required: true
        }
    },

    setup(props) {
        let jsonData = {} as JsonData;

        /**
         * 初始化
         * @param newJsonData
         * @param oldJsonData
         */
        function init(newJsonData, oldJsonData) {
            Object.assign(newJsonData, { ...oldJsonData });

            // 解析 "data"
            if (typeof oldJsonData.data === 'object') {
                const newData = handleData(oldJsonData.data);

                newJsonData.data = {
                    ...newJsonData.data,
                    ...newData
                };
            }
        }

        watchEffect(() => {
            props.data !== null && init(jsonData, props.data);
        });

        return () => handleRenderEl(jsonData.node, jsonData, reactiveVal, 0);

        //
        //
        // ===
        //
        //
        // let jsonData = {
        //     ...props.data
        // };

        // // 解析 "data"
        // if (typeof props.data.data === 'object') {
        //     const newData = handleData(props.data.data);

        //     jsonData.data = {
        //         ...jsonData.data,
        //         ...newData
        //     };
        // }

        // return () => handleRenderEl(jsonData.node, jsonData, reactiveVal, 0);
        //
        //
        // ====
        //
        //
        // return () =>
        //     handleRenderEl(props.data.node, props.data, reactiveVal, 0);
        //
        //
        // ====
        //
        //
        // const cardRef = ref();
        // console.log(cardRef)
        // return () =>
        //     h(ElementConfig['ElCard'], {
        //         ref: cardRef,
        //         onClick: () => {
        //             console.log(cardRef.value);
        //         }
        //     });
    }
});
