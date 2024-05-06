<template>
    <div class="viewer" ref="real" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineModel, Ref } from 'vue';

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

const real = ref<HTMLDivElement | null>(null);
const tree = ref<Root | null>(null);

const emits = defineEmits<{
    update: [Root, HTMLDivElement]
}>();

const rehypeExpose: Plugin<[], Root, Root> = function (){
    return (t) => { tree.value = t; }
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

async function render(markdown: string){
    return processor.process(markdown);
}

function updateHTML(){
    try {
        render(value.value).then((m) => {
            real.value!.innerHTML = m.toString();

            setTimeout(() => emits('update', tree.value as Root, real.value as HTMLDivElement), 100);
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

<style lang="scss">

$erro-color-raw: 'F56C6C';
$warn-color-raw: 'E6A23C';
$succ-color-raw: '67C23A';
$info-color-raw: '409EFF';

$erro-color: #F56C6C;
$warn-color: #E6A23C;
$succ-color: #67C23A;
$info-color: #409EFF;

.viewer {
    position: relative;
    word-wrap: break-word;

    --text-color-h: black;
    --text-color-p: black;
    --text-color-i: #666666;

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

        text-align: justify;
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
        tab-size: 4;
        -moz-tab-size: 4;
    }

    :deep(p) code,
    :deep(li) code {
        display: inline;
        overflow-wrap: break-word;
        word-break: break-all;
    }

    :deep(strong) {
        font-weight: bold;
    }

    :deep(em) {
        // color: var(--text-color-i);
        // font-style: normal;
        // font-family: Georgia, "Times New Roman", Times, Kai, "Kaiti SC", KaiTi, BiauKai, FontAwesome, serif;
    }

    :deep(blockquote) {
        margin: 0.5em 0;
        padding: 0.2em 0 0.2em 0.8em;

        border-left: 4px solid $info-color;
        background-color: rgb(from $info-color r g b / 0.3);
        
        blockquote {
            margin-left: -0.2em;
            background-color: transparent;
        }
    }

    .video {
        width: 100%;
        
        aspect-ratio: 16 / 9;
    }

    .callout {
        margin: 0.5em 0;
        padding: 0.1em 0.5em;
        border-radius: 5px;

        background-color: rgb(255 255 255 / 0.6);

        overflow: hidden;

        .code-container {
            margin: 0.5em 0em 0.5em 2em;
        }

        &.has-headline {
            > p:first-child {
                margin: -0.1em -0.5em 0 -0.5em;
                padding: 0.5em;
            }
        }

        &.info {
            p, li {
                color: var(--callout-text-info);
            }

            border: 1px solid $info-color;
            box-shadow: 2px 2px 5px rgb(from $info-color r g b / 0.5);

            &.has-headline {
                > p:first-child {
                    background-color: rgb(from $info-color r g b / 0.4);
                    color: var(--callout-head-info);
                    
                    &::before {
                        float: left;
                        content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="%23#{$info-color-raw}"/></svg>');

                        margin: 2px 0.4em 2px 0;
                        width: 18px;
                        height: 18px;
                    }
                }
            }
        }
        
        &.error {
            p, li {
                color: var(--callout-text-erro);
            }
            border: 1px solid $erro-color;
            box-shadow: 2px 2px 5px rgb(from $erro-color r g b / 0.5);

            &.has-headline {
                > p:first-child {
                    background-color: rgb(from $erro-color r g b / 0.4);
                    color: var(--callout-head-erro);
                    
                    &::before {
                        float: left;
                        content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" fill="%23#{$erro-color-raw}"/></svg>');

                        margin: 2px 0.4em 2px 0;
                        width: 18px;
                        height: 18px;
                    }
                }
            }
        }

        &.success {
            p, li {
                color: var(--callout-text-succ);
            }
            border: 1px solid $succ-color;
            box-shadow: 2px 2px 5px rgb(from $succ-color r g b / 0.5);

            &.has-headline {
                > p:first-child {
                    background-color: rgb(from $succ-color r g b / 0.4);
                    color: var(--callout-head-succ);
                    
                    &::before {
                        float: left;
                        content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" fill="%23#{$succ-color-raw}"/></svg>');

                        margin: 2px 0.4em 2px 0;
                        width: 18px;
                        height: 18px;
                    }
                }
            }
        }

        &.warning {
            p, li {
                color: var(--callout-text-warn);
            }
            border: 1px solid $warn-color;
            box-shadow: 2px 2px 5px rgb(from $warn-color r g b / 0.5);

            &.has-headline {
                > p:first-child {
                    background-color: rgb(from $warn-color r g b / 0.4);
                    color: var(--callout-head-warn);
                    
                    &::before {
                        float: left;
                        content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" fill="%23#{$warn-color-raw}"/></svg>');

                        margin: 2px 0.4em 2px 0;
                        width: 18px;
                        height: 18px;
                    }
                }
            }
        }
    }

    .callout .callout {
        background-color: transparent;
    }

    code {
        font-family: consolas
    }

    .code-container {
        border: 1px solid rgb(from var(--minor-color-l3) r g b / 0.5);
        background-color: rgb(from var(--page-color) r g b / 0.5);
        position: relative;

        margin-left: 0.5em;
        margin-right: -0.5em;

        > .line-number {
            box-sizing: content-box;

            position: absolute;
            right: 100%;

            padding: 1em 0.5em;

            font-family: consolas;

            > .number {
                display: block;
                text-align: right;
            }
        }

        > .copy-button {
            position: absolute;

            top: 0.5em;
            right: 0.5em;

            padding: 0.6em 0.6em;

            display: flex;
            align-items: center;
            justify-content: center;

            transition:
                0.2s ease-in-out opacity,
                0.2s ease-in-out color,
                0.2s ease-in-out background-color;

            color: var(--minor-color);
            background-color: var(--minor-color-l4);

            border: none;
            border-radius: 4px;

            cursor: pointer;

            opacity: 0;
        }

        &:hover > .copy-button {
            opacity: 1;

            &:hover {
                color: var(--minor-color-l4);
                background-color: var(--text-minor-color-h);
            }
        }

        .hljs {
            background-color: transparent;
        }
    }
}
</style>