<template>
    <el-upload
        action="https://xxxx"
        accpet="json"
        :before-upload="onBeforeUpload"
    >
        <el-button type="primary">上传json</el-button>
    </el-upload>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    emits: ['uploadSuccess'],

    setup(props, ctx) {
        function onBeforeUpload(file) {
            const reader = new FileReader();

            reader.readAsText(file);
            reader.onload = function (event) {
                ctx.emit('uploadSuccess', event.target.result);
            };

            return false;
        }

        return {
            onBeforeUpload
        };
    }
});
</script>
