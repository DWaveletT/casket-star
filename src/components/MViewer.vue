<template>
    <div class="markdown" v-html="html" ref="real" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineModel } from 'vue';

import { Plugin, unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { Plugins } from '~/CasketStar.vue';

import { Root } from 'hast';

import { throttle } from 'lodash-es';

const props = defineProps<{
    plugins: Plugins,
    interval: number
}>();

const value = defineModel<string>({
    required: true
});

const real = ref<HTMLDivElement | null>(null);
const tree = ref<Root | null>(null);

const html = ref('');

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
        for(const plugin of props.plugins.remark){
            if(Array.isArray(plugin))
                processor.use(plugin[0], plugin[1] as unknown as boolean);
            else
                processor.use(plugin);
        }
    }

    processor.use(remarkRehype, props.plugins.remarkRehypeOptions);

    if(props.plugins.rehype){
        for(const plugin of props.plugins.rehype){
            if(Array.isArray(plugin))
                processor.use(plugin[0], plugin[1] as unknown as boolean);
            else
                processor.use(plugin);
        }
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

const updateHTML = throttle(() => {
    try {
        render(value.value).then((m) => {
            html.value = m.toString();

            setTimeout(() => emits('update', tree.value as Root, real.value as HTMLDivElement), 1000);
        });
    } catch(e){
        console.log(e);
    }
}, props.interval);

watch(value, () => {
    updateHTML();
});

onMounted(() => {
    updateHTML();
})

</script>