<template>
    <m-dialog @close="doClose">
        <template #header>
            {{ i18n('code-insert') }}
        </template>

        <div>
            <div class="cs-dialog-item">
                <div class="cs-dialog-item-label">
                    {{ i18n('code-select') }}
                </div>
                <select v-model="lang" class="cs-dialog-item-content">
                    <option v-for="option in list" :key="option.value" :value="option.value">
                        {{ option.name }}
                    </option>
                </select>
            </div>
            <div class="cs-dialog-item">
                <div class="cs-dialog-item-label" style="min-height: 50vh;">
                    {{ i18n('code') }}
                </div>

                <textarea v-model="code" class="cs-dialog-item-content" />
            </div>

            <div class="cs-dialog-submit-area">
                <button class="cs-dialog-button cs-dialog-button-info" @click="doClose">{{ i18n('cancel') }}</button>
                <button
                    class="cs-dialog-button cs-dialog-button-info" @click="() => {
                        props.confirm(lang, code);
                        doClose();
                    }"
                >
                    {{ i18n('confirm') }}
                </button>
            </div>
        </div>
    </m-dialog>
</template>

<script setup lang="ts">

import { ref, render } from 'vue';

import MDialog from '~/components/MDialog.vue';
import { i18n } from '~/utils';

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