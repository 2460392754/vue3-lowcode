<template>
    <div class="version">{{ v }}</div>
    <Render />
</template>

<script lang="ts">
import { version } from '@/../package.json';
import { defineComponent } from 'vue';
import Render from '@/components/render.vue';

export default defineComponent({
    components: {
        Render
    },

    setup() {
        const v = 'version: ' + version;

        return {
            v
        };
    }
});
</script>

<style></style>
