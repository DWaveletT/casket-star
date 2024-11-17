<template>
    <codemirror
        v-model="value" :extensions="extensions" :disabled="props.disabled"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { Codemirror } from 'vue-codemirror';
import { EditorView } from '@codemirror/view';

import { Plugins } from '~/CasketStar.vue';
import { getDefaultPlugins } from '~/utils';

const props = withDefaults(defineProps<{
    plugins?: Plugins,
    disabled?: boolean,
}>(), {
    plugins: getDefaultPlugins,
    disable: false
});

const value = defineModel<string>({
    required: true
});

const extensions = computed(() => {
    return [
        // Enable automatic line wrapping
        EditorView.lineWrapping,
        EditorView.theme({
            // Disable the native dashed border when codemirror is focused.
            "&.cm-focused": {
                outline: 'none',
            },
            // Make the editor occupy the entire height.
            "&.cm-editor": {
                height: '100%',
            },
            // 1. z-index: auto
            //    Solve the problem that codemirror cannot be scrolled when in full-screen.
            //    I'm confused why z-index is set to 0 by default.
            // 2. overflow-anchor: none
            //    To prevent Brower scrolling when deleting the text at the end.
            ".cm-scroller": {
                'z-index': '2',
                'overflow-anchor': 'none',
            },
        }),

        // Allow addtional plugins provided by the user.
        // Such as themes, key-binding, etc.
        ...(props.plugins.codemirror || [])
    ];
});

</script>