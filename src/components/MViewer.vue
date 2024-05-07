<template>
    <div class="markdown" ref="real" />
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

</style>