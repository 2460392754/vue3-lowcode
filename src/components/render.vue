<template>
    <div>
        <Upload @uploadSuccess="onUploadSuccess" />
        <Download :content="json" />
        <RegisterComponent :data="json" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import RegisterComponent from './registerComponent';
import Download from './download.vue';
import Upload from './upload.vue';
// import Demo from '@/assets/dynamic.json';

export default defineComponent({
    components: {
        RegisterComponent,
        Download,
        Upload
    },

    setup() {
        const json = ref(null);

        // json.value = Demo;

        /**
         * 上传成功
         * @param content
         */
        function onUploadSuccess(content: string) {
            json.value = JSON.parse(content);

            console.log(json);
        }

        return {
            json,
            onUploadSuccess
        };
    }
});
</script>
