<template>
    <codemirror
        v-model="value" :extensions="extensions"
    />
</template>

<script setup lang="ts">
import { defineModel, computed } from 'vue';

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

const extensions = computed(() => {
    const list = [
        // Enable automatic line wrapping
        EditorView.lineWrapping,
        EditorView.theme({
            // Disable the native dashed border when codemirror is focused.
            "&.cm-focused": {
                outline: 'none'
            },
            // Make the editor occupy the entire height.
            "&.cm-editor": {
                height: '100%',
            },
            // Solve the problem that codemirror cannot be scrolled when in full-screen.
            // I'm confused why z-index is set to 0 by default.
            "&.cm-scroller": {
                'z-index': 'auto',
            },
        }),

        // Allow addtional plugins provided by the user.
        // Such as themes, key-binding, etc.
        props.plugins.codemirror || []
    ];
    return list;
});

</script>