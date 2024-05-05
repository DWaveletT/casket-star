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
            >
                <m-editor v-model="value" :plugins="plugins" @ready="handleEditorReady" />
            </div>
            <div
                v-if="casket.showViewer"
                class="casket-viewer"
                :class="{
                    'zone-half':  casket.showEditor, 'zone-full': !casket.showEditor
                }"
            >
                <m-viewer v-model="value" :plugins="plugins" />
            </div>
        </div>
        <!-- <div class="footer">
            <m-toolbar v-model="value" />
        </div> -->
        
        <component v-if="dialog" :is="dialog"
            @close="dialog = undefined" @confirm="dialogConfirm"
        />
    </div>

</template>

<script setup lang="ts">
import { type Component, ref, shallowRef, onBeforeMount, provide } from 'vue';

import MEditor from './components/MEditor.vue';
import MViewer from './components/MViewer.vue';

import MToolbar, { Toolbar } from './components/MToolbar.vue';

import { EditorState, Extension } from '@codemirror/state';
import { type MarkdownExtension } from '@lezer/markdown';

import { defaultPlugins, defaultToolbarL, defaultToolbarR } from './utils';
import { EditorView } from '@codemirror/view';
import { Options } from 'remark-rehype';

const value = ref<string>('codes');

let codemirror: EditorView | undefined = undefined;

type Plugin = () => void;

export interface Plugins {
    remark?: Plugin[],
    rehype?: Plugin[],
    remarkRehypeOptions?: Options,
    codemirror?: {
        editor?: [Extension],
        markdown?: [MarkdownExtension]
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

onBeforeMount(() => {
    codemirror?.dispatch();
});

</script>

<style scoped lang="scss">

$casket-color: #FFE300;

.casket {
    display: block;

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

    .content {
        display: flex;

        height: 300px;
    }


    &.full-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        .content {
            height: 100%;
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

    overflow-y: auto;

    box-sizing: border-box;

    font-size: large; 
}

.casket-viewer {
    padding: 0 0.5em;

    overflow-y: auto;

    box-sizing: border-box;
}

.casket-sidebar {
    display: block;
    flex: 5em;

    padding: 1em;

    box-sizing: border-box;
}
</style>
