<template>
    <el-button type="primary" @click="onClickOutputJson">导出json</el-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { download } from '@/utils/file';
import { ElMessage } from 'element-plus';

export default defineComponent({
    props: {
        content: {
            type: [Object, null],
            required: true
        }
    },
    setup(props) {
        /**
         * 导出 json
         */
        function onClickOutputJson() {
            if (props.content === null) {
                return ElMessage.error('请上传内容');
            }
            download(JSON.stringify(props.content, null, 4), 'json文件.json');
        }

        return {
            onClickOutputJson
        };
    }
});
</script>
