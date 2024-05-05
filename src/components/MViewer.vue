<template>
    <div class="viewer">
        <div v-html="html" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineModel } from 'vue';

import { Plugin, Processor, unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { Plugins } from '~/StarCasket.vue';
import { Root } from 'hast';

const props = defineProps<{
    plugins: Plugins
}>();

const value = defineModel<string>({
    required: true
});

const emits = defineEmits<{
    update: [Root]
}>();

const rehypeExpose: Plugin<[], Root, Root> = function (){
    return (tree) => { emits('update', tree); }
}

function getProcessor(){
    const processor = unified();

    processor.use(remarkParse);

    if(props.plugins.remark){
        for(const plugin of props.plugins.remark)
            processor.use(plugin);
    }

    processor.use(remarkRehype, props.plugins.remarkRehypeOptions);

    if(props.plugins.rehype){
        for(const plugin of props.plugins.rehype)
            processor.use(plugin);
    }

    processor.use(rehypeExpose);

    processor.use(rehypeStringify);

    processor.freeze();

    return processor;
}

const processor = getProcessor();

const html = ref<string>('');

async function render(markdown: string){
    return processor.process(markdown);
}

function updateHTML(){
    try {
        render(value.value).then((m) => {
            html.value = m.toString();
        });
    } catch(e){
        console.log(e);
    }
}

watch(value, () => {
    updateHTML();
});

onMounted(() => {
    updateHTML();
})

</script>

<style scoped lang="scss">
.viewer {
    overflow-wrap: break-word;

    :deep(h1), :deep(h2) {
        padding-bottom: .2em;
        border-bottom: solid 1px #eee;
    }

    :deep(h1) {
        margin: .5rem 0;
        font-size: 2em;
    }

    :deep(h2) {
        margin: .5rem 0;
        font-size: 1.5em;
    }

    :deep(h3) {
        margin: .5rem 0;
        font-size: 1.17em;
    }

    :deep(h4) {
        margin: .5rem 0;
        font-size: 1em;
    }

    :deep(h5) {
        margin: .5rem 0;
        font-size: .83em;
    }

    :deep(h6) {
        margin: .5rem 0;
        font-size: .67em;
    }

    :deep(img) {
        max-width: 100%;
    }

    :deep(p) {
        margin: 1rem 0;
    }

    :deep(ul) {
        padding-left: 1.5em;
        list-style: outside disc;
    }

    :deep(ol) {
        padding-left: 1.5em;
        list-style: outside decimal;
    }

    :deep(hr) {
        margin: 1em 0;
        height: 0;
        border: none;
        border-bottom: solid 1px #eee;
    }

    :deep(pre), :deep(code) {
        font-family: monospace;
        font-size: .875em;
        background-color: #fafafa;
        border: 1px solid #e8e8e8;
        border-radius: 2px;
    }

    :deep(.katex-display) {
        overflow-x: auto;
        overflow-y: hidden;
    }

    :deep(pre) {
        margin: 0;
        padding: 1em;
        overflow-x: auto;
        overflow-y: hidden;

        & > code {
            font-size: unset;
            margin: 0;
            padding: 0;
            white-space: pre;
            border: none;
        }
    }

    :deep(code) {
        margin: 0 .2em;
        padding: .1em .2em;
        white-space: pre-wrap;
        tab-size: 4; /* stylelint-disable-line */
        -moz-tab-size: 4; /* stylelint-disable-line */
    }

    :deep(p) code,
    :deep(li) code {
        display: inline;
        overflow-wrap: break-word;
        word-break: break-all;
    }

}
</style>