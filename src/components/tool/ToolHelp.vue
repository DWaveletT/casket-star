<template>
    <m-dialog @close="doClose">
        <template #header>
            帮助手册我还没写
        </template>

        <div>
            <h2>Todo</h2>

            <ul>
                <li>快捷方式（比如按 Ctrl+B 自动将选中范围加粗）；</li>
                <li>研究一下手机适配；</li>
                <li>修可能存在的 bug。</li>
            </ul>
        </div>
    </m-dialog>
</template>

<script setup lang="ts">

import { render } from 'vue';

import MDialog from '~/components/dialog/MDialog.vue';

const props = defineProps<{
    confirm: (lang: string, code: string) => void,
    container: HTMLDivElement
}>();

function doClose(){
    render(null, props.container);
}


</script>