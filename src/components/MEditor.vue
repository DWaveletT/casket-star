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
import { getDefaultPlugins } from '~/utils';

const props = withDefaults(defineProps<{
    plugins?: Plugins
}>(), {
    plugins: getDefaultPlugins
});

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
        },
        "&.cm-scroller": {
            'z-index': 'auto',
        },
    }),
    ...(props.plugins.codemirror || [])
];

</script>