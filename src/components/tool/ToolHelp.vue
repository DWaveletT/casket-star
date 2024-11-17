<template>
    <m-dialog @close="doClose">
        <template #header>
            {{ i18n('help') }}
        </template>
            
        <div>
            帮助手册：<a href="https://www.luogu.com.cn/article/70w8j2pj">https://www.luogu.com.cn/article/70w8j2pj</a>。
        </div>
    </m-dialog>
</template>

<script setup lang="ts">

import { render } from 'vue';

import MDialog from '~/components/MDialog.vue';
import { i18n } from '~/utils';

const props = defineProps<{
    confirm: (lang: string, code: string) => void,
    container: HTMLDivElement
}>();

function doClose(){
    render(null, props.container);
}

</script>