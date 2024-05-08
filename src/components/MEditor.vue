<template>
    <codemirror
        v-model="value" :extensions="extensions"
    />
</template>

<script setup lang="ts">
import { defineModel } from 'vue';

import { Codemirror } from 'vue-codemirror';
import { EditorView } from '@codemirror/view';

import { Plugins } from '~/CasketStar.vue';

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
    ...(props.plugins.codemirror || [])
];

</script>