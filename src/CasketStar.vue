<template>
    <div class="casket cs-main" :class="{ 'cs-full-screen': casket.fullScreen }">
        <div class="cs-header">
            <m-toolbar
                :toolbarl="props.toolbarl"
                :toolbarr="props.toolbarr"
                :get-codemirror="getCodemirror"
                :get-casketstar="getCasketStar"
                :dialog="dialog"
            />
        </div>
        <div class="cs-content">
            <div
                v-if="casket.showEditor"
                class="cs-editor"
                :class="{
                    'cs-midline': casket.showViewer,
                    'cs-zone-half': casket.showViewer, 'cs-zone-full': !casket.showViewer
                }"
                @mouseover="currentOver = 'editor'"
            >
                <m-editor v-model="value" :plugins="plugins" @ready="handleEditorReady" />
            </div>
            <div
                v-if="casket.showViewer"
                class="cs-viewer"
                :class="{
                    'cs-zone-half':  casket.showEditor, 'cs-zone-full': !casket.showEditor
                }"
                ref="viewer"
                @scroll="handleViewerScroll"
                @mouseover="currentOver = 'viewer'"
            >
                <m-viewer v-model="value" :plugins="plugins" @update="handleViewerUpdate" :interval="interval" />
            </div>
        </div>
        <div class="cs-footer">
            <div class="cs-footer-left">
                字数统计：{{ getCodemirror()?.state.doc.length || 0 }} 字符
            </div>

            <div class="cs-footer-right">
                <span class="cs-footer-button" @click="handleSync">{{ scrollSync ? '禁用滚动' : '启用滚动' }}</span>
                <span class="cs-footer-button" @click="handleBack">回到顶部</span>
            </div>
        </div>
        
        <teleport to="body">
            <div class="casket" ref="dialog" />
        </teleport>
    </div>

</template>

<script setup lang="ts">
import { ref, onBeforeMount, onMounted, watch, provide } from 'vue';

import MEditor from './components/MEditor.vue';
import MViewer from './components/MViewer.vue';

import MToolbar, { Toolbar } from './components/MToolbar.vue';

import { Extension } from '@codemirror/state';

import { getDefaultPlugins, getDefaultToolbarL, getDefaultToolbarR } from './utils';
import { EditorView } from '@codemirror/view';
import { Options } from 'remark-rehype';
import { Root } from 'hast';

import { debounce } from 'lodash-es';
import { getI18n } from './lang';

const interval = ref(0);

let codemirror: EditorView | undefined = undefined;

type Plugin = () => void;

export interface Plugins {
    remark?: (Plugin | [Plugin, object])[],
    rehype?: (Plugin | [Plugin, object])[],
    remarkRehypeOptions?: Options,
    codemirror?: Extension[]
}

export interface CasketView {
    showEditor: boolean,
    showViewer: boolean,
    fullScreen: boolean,
}

const casket = ref<CasketView>({
    showEditor: true,
    showViewer: true,
    fullScreen: false
});

watch(casket.value, () => { updateScrollSync() });

const props = withDefaults(defineProps<{
    plugins?: Plugins,
    toolbarl?: Toolbar,
    toolbarr?: Toolbar,
    lang?: string
}>(), {
    plugins: () => getDefaultPlugins(),
    toolbarl: () => getDefaultToolbarL(),
    toolbarr: () => getDefaultToolbarR(),
    lang: 'en_US'
});

const value = defineModel<string>({ required: true });
const i18n = getI18n(props.lang);

provide('i18n', i18n);

function handleEditorReady(payload: {
    view: EditorView
}){
    codemirror = payload.view;
    editor.value = codemirror.scrollDOM as HTMLDivElement;
    editor.value.onscroll = handleEditorScroll;
}

let top1: number[] = [];
let top2: number[] = [];

const scrollSync = ref<boolean>(true);

const editor = ref<HTMLDivElement | null>(null);
const viewer = ref<HTMLDivElement | null>(null);
const dialog = ref<HTMLDivElement | null>(null);

let tree:           Root | null = null;
let real: HTMLDivElement | null = null;

function getMaxEditorTop(){
    if(!editor.value)
        return 0;
    return editor.value.scrollHeight - editor.value.getBoundingClientRect().height;
}
function getMaxViewerTop(){
    if(!viewer.value)
        return 0;
    return viewer.value.scrollHeight - viewer.value.getBoundingClientRect().height;
}

function InitSyncScroll(){
    if(!codemirror || !editor.value || !viewer.value || !scrollSync.value)
        return;
    if(!tree || !real)
        return;
    
    top1 = [0], top2 = [0];

    for(const node of tree.children){

        if(node.position?.start.offset !== undefined){
            top1.push(node.position.start.offset);
        }
    }

    const delta = viewer.value.scrollTop - viewer.value.getBoundingClientRect().top;

    let maxBottom = 0;

    for(const [key, node] of Object.entries(real.children))
        if(!node.classList.contains('katex-display')){
        const { top, bottom } = node.getBoundingClientRect();
        top2.push(top + delta);
        maxBottom = bottom + delta;
    }
    
    top1.push(codemirror.state.doc.length);
    top2.push(maxBottom);

}

const updateScrollSync = debounce(InitSyncScroll, 200);

function handleViewerUpdate(t: Root, r: HTMLDivElement){
    tree = t;
    real = r;
    updateScrollSync();
}

function getCodemirror(){
    return codemirror;
}

function getCasketStar(){
    return casket.value;
}

let currentOver = "editor";

function handleEditorScroll(e: Event){
    if(currentOver !== "editor" || !codemirror || !scrollSync.value)
        return;

    const topEditor = (e.target as HTMLDivElement).scrollTop;
    const pos = codemirror.lineBlockAtHeight(topEditor).from;

    if(topEditor + 1 >= getMaxEditorTop()){
        viewer.value?.scrollTo({ top: getMaxViewerTop() + 10 });
        return;
    }

    for(let i = 0;i + 1 < top1.length;i ++){
        const l = top1[i];
        const r = top1[i + 1];

        const topl = codemirror.lineBlockAt(l).top;
        const topr = codemirror.lineBlockAt(r).top;

        if(l <= pos && pos < r){
            const rate = (topEditor - topl) / (topr - topl);
            const topViewer = 
                top2[i] + rate * (top2[i + 1] - top2[i]);
            viewer.value?.scrollTo({ top: topViewer});
            return;
        }
    }
}

function handleViewerScroll(e: Event){
    if(currentOver !== "viewer" || !codemirror || !scrollSync.value)
        return;

    const topViewer = (e.target as HTMLDivElement).scrollTop;
    
    if(topViewer + 1 >= getMaxViewerTop()){
        editor.value?.scrollTo({ top: getMaxEditorTop() + 10 });
        return;
    }

    for(let i = 0;i + 1 < top1.length;i ++){
        const l = top2[i];
        const r = top2[i + 1];

        const rate = (topViewer - l) / (r - l);

        if(l <= topViewer && topViewer < r){
            const l = top1[i];
            const r = top1[i + 1];

            const topl = codemirror.lineBlockAt(l).top;
            const topr = codemirror.lineBlockAt(r).top;

            const margin = rate * (topr - topl);

            editor.value?.scrollTo({ top: topl + margin });
            return;
        }
    }
}

function handleSync(){
    if(scrollSync.value) {
        scrollSync.value = false;
    } else {
        scrollSync.value = true;
        updateScrollSync();
    }
}

function handleBack(){
    if(editor.value){
        editor.value.scrollTo({ top: 0 });
    }
    if(viewer.value){
        viewer.value.scrollTo({ top: 0 });
    }
}

onMounted(() => {
    addEventListener('resize', updateScrollSync);
})

onBeforeMount(() => {
    codemirror?.dispatch();
});

</script>
