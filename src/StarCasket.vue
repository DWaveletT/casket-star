<template ref="casket">
    <div class="casket" :class="{ 'full-screen': casket.fullScreen }">
        <div class="header">
            <m-toolbar
                :toolbarl="toolbarl"
                :toolbarr="toolbarr"
                :get-codemirror="getCodemirror"
                :get-starcasket="getStarCasket"
                @dialog="handleDialog"
            />
        </div>
        <div class="content">
            <div
                v-if="casket.showEditor"
                class="casket-editor"
                :class="{
                    'midline': casket.showViewer,
                    'zone-half': casket.showViewer, 'zone-full': !casket.showViewer
                }"
                @mouseover="currentOver = 'editor'"
            >
                <m-editor v-model="value" :plugins="plugins" @ready="handleEditorReady" />
            </div>
            <div
                v-if="casket.showViewer"
                class="casket-viewer"
                :class="{
                    'zone-half':  casket.showEditor, 'zone-full': !casket.showEditor
                }"
                ref="viewer"
                @scroll="handleViewerScroll"
                @mouseover="currentOver = 'viewer'"
            >
                <m-viewer v-model="value" :plugins="plugins" @update="handleViewerUpdate" />
            </div>
        </div>
        <div class="footer">
            <div class="left">
                字数统计：{{ getCodemirror()?.state.doc.length || 0 }} 字符
            </div>

            <div class="right">
                <span class="button" @click="handleSync">{{ scrollSync ? '禁用滚动' : '启用滚动' }}</span>
                <span class="button" @click="handleBack">回到顶部</span>
            </div>
        </div>
        
        <component v-if="dialog" :is="dialog"
            @close="dialog = undefined" @confirm="dialogConfirm"
        />
    </div>

</template>

<script setup lang="ts">
import { type Component, ref, shallowRef, onBeforeMount, onMounted, watch } from 'vue';

import MEditor from './components/MEditor.vue';
import MViewer from './components/MViewer.vue';

import MToolbar, { Toolbar } from './components/MToolbar.vue';

import { EditorState, Extension } from '@codemirror/state';
import { type MarkdownExtension } from '@lezer/markdown';

import { defaultPlugins, defaultToolbarL, defaultToolbarR } from './utils';
import { EditorView } from '@codemirror/view';
import { Options } from 'remark-rehype';
import { Root } from 'hast';
import { visit } from 'unist-util-visit';

const value = ref<string>('');

let codemirror: EditorView | undefined = undefined;

type Plugin = () => void;

export interface Plugins {
    remark?: Plugin[],
    rehype?: Plugin[],
    remarkRehypeOptions?: Options,
    codemirror?: {
        editor?: Extension[],
        markdown?: MarkdownExtension[]
    }
}

export interface CasketView {
    showEditor: boolean,
    showViewer: boolean,
    fullScreen: boolean,
}

const dialog = shallowRef<Component | undefined>();
const casket = ref<CasketView>({
    showEditor: true,
    showViewer: true,
    fullScreen: false
});

watch(casket.value, () => { setTimeout(InitSyncScroll, 100) });

let dialogConfirm: Function | undefined = undefined;

const props = defineProps<{
    plugins?: Plugins,
    toolbarl?: Toolbar,
    toolbarr?: Toolbar,
}>();

const plugins = props.plugins || defaultPlugins();

const toolbarl = props.toolbarl || defaultToolbarL();
const toolbarr = props.toolbarr || defaultToolbarR();

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

    for(const [key, node] of Object.entries(real.children)){
        const { top, bottom} = node.getBoundingClientRect();
        top2.push(top + delta);
        maxBottom = bottom + delta;
    }
    
    top1.push(codemirror.state.doc.length);
    top2.push(maxBottom);

}

function handleViewerUpdate(t: Root, r: HTMLDivElement){
    tree = t;
    real = r;
    InitSyncScroll();
}

function handleDialog(component: Component, confirm?: Function){
    dialog.value = component;
    dialogConfirm = confirm;
}

function getCodemirror(){
    return codemirror;
}

function getStarCasket(){
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

            const height = topl + margin;
            const line = codemirror.lineBlockAtHeight(height);
            const delta = line.top - topl;

            codemirror.dispatch(
                codemirror.state.update(
                    {
                        effects: EditorView.scrollIntoView(line.from, { y: 'start', yMargin: -margin + delta })
                    }
                )
            );
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
    addEventListener('resize', InitSyncScroll);
})

onBeforeMount(() => {
    codemirror?.dispatch();
});

</script>

<style scoped lang="scss">

$casket-color: #FFE300;

.casket {
    display: flex;
    flex-direction: column; 

    background-color: white;

    box-sizing: border-box;

    --casket-color: #{$casket-color};
    --casket-color-l1: #{lighten($casket-color, 20%)};
    --casket-color-l2: #{lighten($casket-color, 40%)};
    --casket-color-d1: #{darken($casket-color, 10%)};
    --casket-color-d2: #{darken($casket-color, 20%)};

    --casket-tl-color: #333333;
    --casket-bd-color: #9E9E9E;
    --casket-sp-color: var(--casket-color-d1);
    --casket-bg-color: var(--casket-color-l2);

    border: 2px solid var(--casket-color-d1);
    border-radius: 4px;

    .header {
        border-bottom: 1px solid var(--casket-sp-color);

        background-color: var(--casket-bg-color);

        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }

    .footer {
        border-top: 1px solid var(--casket-sp-color);

        color: var(--casket-color-d2);
        background-color: var(--casket-bg-color);

        border-top-left-radius: 4px;
        border-top-right-radius: 4px;

        display: flex;

        padding: 0.2em 0.5em;

        justify-content: space-between;

        font-size: small;

        .button {
            display: inline-block;
            cursor: pointer;

            padding: 0 0.2em;
            margin:  0 0.2em;

            border-radius: 4px;
            
            transition: 0.2s ease-in-out background-color;

            &:hover {
                background-color: var(--casket-color-l1);
            }
        }
    }

    .content {
        display: flex;
        height: 400px;
    }

    &.full-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        z-index: 100;

        .content {
            flex-grow: 1;
        }
    }
}
.midline {
    border-right: 1px solid var(--casket-sp-color);
}

.zone-half {
    width: 50%;
}
.zone-full {
    width: 100%;
}

.casket-editor {
    padding: 0 0;

    box-sizing: border-box;

    font-size: large; 
}

.casket-viewer {
    position: relative;
    padding: 0 0.5em;

    overflow-y: auto;

    box-sizing: border-box;
}
</style>
