<template>
    <div class="casket cs-main" :class="{ 'cs-full-screen': casket.fullScreen }">
        <div class="cs-header" v-if="!props.hideHeader">
            <m-toolbar
                :toolbarL="props.plugins.toolbarL"
                :toolbarR="props.plugins.toolbarR"
                :get-codemirror="getCodemirror"
                :get-casketstar="getCasketStar"
                :dialog="dialog"
                :disabled="props.disabled"
            />
        </div>
        <div class="cs-content" :style="{ height: props.height }">
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
                    v-model="value" :plugins="plugins" @ready="handleEditorReady" :disabled="props.disabled"
                />

                <div v-if="props.upload" class="cs-upload" :class="{ dragging }">
                    {{ i18n('release-to-update') }}
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
        <div class="cs-footer" v-if="!props.hideFooter">
            <div class="cs-footer-left">
                {{ i18n('character-count') }}{{
                    getCodemirror()?.state.doc.length || 0
                }}{{ i18n('character') }}
            </div>

            <div class="cs-footer-right">
                <span class="cs-footer-button" @click="handleSync">{{
                    scrollSync ? i18n('sync-disable') : i18n('sync-enable')
                }}</span>
                <span class="cs-footer-button" @click="handleBack">{{ i18n('back-to-top') }}</span>
            </div>
        </div>
        
        <teleport to="body">
            <div class="casket" ref="dialog" />
        </teleport>
    </div>

</template>

<script setup lang="ts">
import { ref, onBeforeMount, onMounted, watch } from 'vue';

import MEditor from './components/MEditor.vue';
import MViewer from './components/MViewer.vue';

import MToolbar, { Toolbar } from './components/MToolbar.vue';

import { EditorSelection, Extension } from '@codemirror/state';

import { getDefaultPlugins } from './utils';
import { EditorView } from '@codemirror/view';
import { Options } from 'remark-rehype';
import { Root } from 'hast';

import { debounce } from 'lodash-es';
import { CasketI18nData, initI18n, i18n } from './lang';

import { type Plugin } from 'unified';

let codemirror: EditorView | undefined = undefined;

export interface Plugins {
    // Viewer
    remark?: Plugin,
    rehype?: Plugin,
    remarkRehypeOptions?: Options,

    // Editor
    codemirror?: Extension,
    
    // Toolbar
    toolbarL?: Toolbar,
    toolbarR?: Toolbar,
}

export type Uploader = ((data: FileList) => {
    url: string,
    alt: string
}[]) | undefined

const props = withDefaults(defineProps<{
    plugins?: Plugins,
    
    hideHeader?: boolean,
    hideFooter?: boolean,

    i18n?: CasketI18nData[] | CasketI18nData,

    upload?: Uploader,

    height?: string,

    disabled?: boolean,

}>(), {
    plugins: getDefaultPlugins,

    i18n: () => [] as CasketI18nData[],

    upload: undefined,

    height: '400px',

    hideHeader: false,
    hideFooter: false,
    disabled: false,
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

initI18n(props.i18n);

const dragging = ref(false);

function handleEditorReady(payload: {
    view: EditorView
}){
    codemirror = payload.view;
    editor.value = codemirror.scrollDOM as HTMLDivElement;
    editor.value.onscroll = () => handleEditorScroll();

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

function handleEditorScroll(force?: boolean){
    if(!codemirror || !editor.value)
        return;

    if(force !== true && (currentOver !== "editor" || !scrollSync.value))
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
        InitSyncScroll();
        handleEditorScroll(true);
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

    if(!props.upload)
        return;

    dragging.value = false;

    if(!e.dataTransfer?.files)
        return;

    const info = props.upload(e.dataTransfer.files);

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
