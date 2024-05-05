<template>
    <codemirror
        class="editor" v-model="value" :extensions="extensions"
    />
</template>

<script setup lang="ts">
import { defineModel } from 'vue';

import { Codemirror } from 'vue-codemirror';
import { EditorView } from '@codemirror/view';

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
    githubLight,
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
        extensions: {
            remove: ['HTMLBlock', 'HTMLTag']
        },
        completeHTMLTags: false
    })
];

</script>

<style scoped lang="scss">

</style>