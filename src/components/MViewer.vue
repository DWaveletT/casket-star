<template>
    <div ref="real" class="marked" v-html="html" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';

import { type Plugin, unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

import { type Plugins } from '~/CasketStar.vue';
import { type Root } from 'hast';

import { debounce } from 'lodash-es';
import { getDefaultPlugins } from '~/utils';

const props = withDefaults(defineProps<{
    plugins?: Plugins,
    interval?: number
}>(),{
    plugins: getDefaultPlugins,
    interval: 0
});

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
    return (t) => { tree.value = t; };
};

function getProcessor(){
    const processor = unified();

    // Parse raw text to Mdast.
    processor.use(remarkParse);

    // Use remark plugins transmitted to Casket.
    if(props.plugins.remark)
        processor.use(props.plugins.remark);

    // Transform Mdast to Hast.
    processor.use(remarkRehype, props.plugins.remarkRehypeOptions);

    // Use rehype plugins transmitted to Casket.
    if(props.plugins.rehype)
        processor.use(props.plugins.rehype);

    // A builtin plugin to pass Mdast to Casket.
    processor.use(rehypeExpose);

    // Allow HTML produced by rehype plugins.
    // However, HTML written by the users are proibited if props.plugins.remarkRehypeOptions.allowDangerousHtml is not true.
    processor.use(rehypeStringify, { allowDangerousHtml: true });

    processor.freeze();

    return processor;
}

const processor = getProcessor();

const updateHTML = debounce(() => {
    try {
        html.value = processor.processSync(value.value) as unknown as string;

        nextTick().then(() => { emits('update', tree.value as Root, real.value as HTMLDivElement); });
    } catch(e){
        console.log(e);
    }
}, props.interval);

watch(value, () => {
    updateHTML();
});

onMounted(() => {
    updateHTML();
});

</script>