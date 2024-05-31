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
                <m-editor
                    v-model="value" :plugins="plugins" @ready="handleEditorReady"
                />

                <div class="cs-upload" :class="{ dragging }">
                    放下图片上传
                </div>
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
                <m-viewer v-model="value" :plugins="plugins" @update="handleViewerUpdate" :interval="casket.interval" />
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

import { EditorSelection, Extension } from '@codemirror/state';

import { getDefaultPlugins, getDefaultToolbarL, getDefaultToolbarR } from './utils';
import { EditorView } from '@codemirror/view';
import { Options } from 'remark-rehype';
import { Root } from 'hast';

import { debounce } from 'lodash-es';
import { getI18n } from './lang';

let codemirror: EditorView | undefined = undefined;

type Plugin = () => void;

export interface Plugins {
    remark?: (Plugin | [Plugin, object])[],
    rehype?: (Plugin | [Plugin, object])[],
    remarkRehypeOptions?: Options,
    codemirror?: Extension[]
}

export type Uploader = (data: FileList) => {
    url: string,
    alt: string
}[] | undefined

const props = withDefaults(defineProps<{
    plugins?: Plugins,
    toolbarl?: Toolbar,
    toolbarr?: Toolbar,
    lang?: string,

    upload?: Uploader
}>(), {
    plugins: () => getDefaultPlugins(),
    toolbarl: () => getDefaultToolbarL(),
    toolbarr: () => getDefaultToolbarR(),
    lang: 'en_US',

    upload: () => undefined
});

export interface CasketView {
    showEditor: boolean,
    showViewer: boolean,
    fullScreen: boolean,

    interval: number,

    data: Record<string, unknown>
}

const casket = ref<CasketView>({
    showEditor: true,
    showViewer: true,
    fullScreen: false,

    interval: 100,

    data: {
        upload: props.upload
    }
});

watch(casket.value, () => { updateScrollSync() });

const value = defineModel<string>({ required: true });
const i18n = getI18n(props.lang);

const dragging = ref(false);

provide('i18n', i18n);

function handleEditorReady(payload: {
    view: EditorView
}){
    codemirror = payload.view;
    editor.value = codemirror.scrollDOM as HTMLDivElement;
    editor.value.onscroll = handleEditorScroll;

    editor.value.ondragover = handleDragOver;
    editor.value.ondragenter = handleDragEnter;
    editor.value.ondragleave = handleDragLeave;
    editor.value.ondrop = handleDrop;
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

    handleEditorScroll();
}

function getCodemirror(){
    return codemirror;
}

function getCasketStar(){
    return casket.value;
}

let currentOver = "editor";

function handleEditorScroll(){
    if(currentOver !== "editor" || !codemirror || !editor.value || !scrollSync.value)
        return;

    const topEditor = editor.value.scrollTop;
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

function handleViewerScroll(){
    if(currentOver !== "viewer" || !codemirror || !viewer.value || !scrollSync.value)
        return;

    const topViewer = viewer.value.scrollTop;
    
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

function handleDragEnter(e: DragEvent){
    if(!e.dataTransfer?.items)
        return;

    for(let i = 0;i < e.dataTransfer.items.length;i ++){
        if(e.dataTransfer.items[i].kind === 'file'){
            dragging.value = true;
            return;
        }
    }
}
function handleDragLeave(e: DragEvent){
    dragging.value = false;
}

function handleDragOver(e: DragEvent){
    e.preventDefault();
}

function handleDrop(e: DragEvent){

    dragging.value = false;

    if(!e.dataTransfer?.files)
        return;

    const info = (casket.value.data?.upload as Uploader)(e.dataTransfer.files);

    if(info !== undefined && codemirror){
        const state = codemirror.state;
        let text = '';

        for(let i = 0;i < info.length;i ++){
            text += `![${ info[i].alt }](${ info[i].url })`;
        }

        const trans = state.update(state.changeByRange( range => {
            return {
                changes: [
                    { from: range.from, to: range.to},
                    { from: range.from, insert: text}
                ],
                range: EditorSelection.range(range.from + text.length, range.from + text.length)
            }
        }));
        
        codemirror.update([trans]);
        codemirror.focus();
    }

    e.preventDefault();
}

onMounted(() => {
    addEventListener('resize', updateScrollSync);
})

onBeforeMount(() => {
    codemirror?.destroy();
});

</script>
