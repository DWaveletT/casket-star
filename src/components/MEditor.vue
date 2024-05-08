<template>
    <codemirror
        v-model="value" :extensions="extensions"
    />
</template>

<script setup lang="ts">
import { defineModel, ref, watch } from 'vue';

import { Codemirror } from 'vue-codemirror';
import { EditorView } from '@codemirror/view';

import { markdown } from '@codemirror/lang-markdown';
import { Plugins } from '../CasketStar.vue';

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
            height: '100%',
        }
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