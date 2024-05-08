<template>
    <m-dialog @close="doClose">
        <template #header>
            插入代码
        </template>

        <div>
            <div class="cs-dialog-item">
                <div class="cs-dialog-item-label">
                    选择语言
                </div>
                <select v-model="lang" class="cs-dialog-item-content">
                    <option v-for="option in list" :key="option.value" :value="option.value">
                        {{ option.name }}
                    </option>
                </select>
            </div>
            <div class="cs-dialog-item">
                <div class="cs-dialog-item-label" style="min-height: 50vh;">
                    代码
                </div>

                <textarea class="cs-dialog-item-content" v-model="code" />
            </div>

            <div class="cs-dialog-submit-area">
                <button class="cs-dialog-button cs-dialog-button-info" @click="doClose" >取消</button>
                <button class="cs-dialog-button cs-dialog-button-info" @click="() => {
                    props.confirm(lang, code);
                    doClose();
                }" >确认</button>
            </div>
        </div>
    </m-dialog>
</template>

<script setup lang="ts">

import { ref, render } from 'vue';

import MDialog from '~/components/dialog/MDialog.vue';

const props = defineProps<{
    confirm: (lang: string, code: string) => void,
    container: HTMLDivElement
}>();

function doClose(){
    render(null, props.container);
}

const lang = ref('');
const code = ref('');

const list: {
    value: string,
    name: string
}[] = [
    {value:        'cpp', name:        'C++'},
    {value:     'pascal', name:     'Pascal'},
    {value:          'c', name:          'C'},
    {value: 'javascript', name: 'Javascript'},
    {value:       'java', name:       'Java'},
    {value:   'markdown', name:   'Markdown'},
    {value:      'latex', name:      'LaTeX'}
];

</script>