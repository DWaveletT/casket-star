<template>
    <codemirror
        class="editor" v-model="value" :extensions="extensions"
    />
</template>

<script setup lang="ts">
import { defineModel } from 'vue';

import { Codemirror } from 'vue-codemirror';
import { EditorView, scrollPastEnd } from '@codemirror/view';

import { githubLight } from '@ddietr/codemirror-themes/github-light';

import { markdown } from '@codemirror/lang-markdown';
import { Plugins } from '~/StarCasket.vue';

import { Ref } from 'vue';

const props = defineProps<{
    plugins: Plugins
}>();

const value = defineModel<string>({
    required: true
});

const extensions = [
    EditorView.lineWrapping,
    EditorView.theme({
        "&.cm-focused": {
            outline: 'none'
        },
        "&.cm-editor": {
            height: '100%'
        },
    }),
    markdown({
        extensions: [
            {
                remove: ['HTMLBlock', 'HTMLTag']
            },
            ...(props.plugins.codemirror?.markdown || [])
        ],
        completeHTMLTags: false,
        
    }),
    ...(props.plugins.codemirror?.editor || [])
];

</script>

<style scoped lang="scss">

</style>