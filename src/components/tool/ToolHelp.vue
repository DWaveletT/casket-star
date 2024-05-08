<template>
    <m-dialog @close="emits('close')">
        <template #header>
            帮助手册我还没写
        </template>

        <div>
            <h2>Todo</h2>

            <ul>
                <li>快捷方式（比如按 Ctrl+B 自动将选中范围加粗）；</li>
                <li>设置（是否开启快捷方式/显示工具栏）；</li>
                <li>研究一下手机适配；</li>
                <li>调整一下样式；</li>
                <li>把组件打包放到 npm 上面去，新建一个 Playground；</li>
                <li>修可能存在的 bug。</li>
            </ul>
        </div>
    </m-dialog>
</template>

<script setup lang="ts">

import { ref } from 'vue';

import MDialog from '../dialog/MDialog.vue';

const emits = defineEmits<{
    close: []
}>();

</script>