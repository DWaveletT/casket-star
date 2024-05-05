<template>
    <div class="toolbar">
        <div class="left-tools">
            <span class="tool-group" v-for="group in props.toolbarl" >
                <span class="tool" v-for="tool in group.tool" @click="doToolClick(tool)" >
                    <span class="button" :innerHTML="tool.icon" />
                    <span class="tooltip">{{ tool.name }}</span>
                </span>
            </span>
        </div>
        <div class="right-tools">
            <span class="tool-group" v-for="group in props.toolbarr" >
                <span class="tool" v-for="tool in group.tool" @click="doToolClick(tool)" >
                    <span class="button" :innerHTML="tool.icon" />
                    <span class="tooltip">{{ tool.name }}</span>
                </span>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { Component } from 'vue';
import { CasketView } from '~/StarCasket.vue';

const emits = defineEmits<{
    viewer: ["only-view" | "only-edit" | "both"],
    dialog: [Component, Function | undefined]
}>();

export type DialogFunction = (component: Component, confirm?: Function) => void;

interface Tool {
    name: string,
    icon: string,
    func: (codemirror: EditorView, starcasket: CasketView, dialog: DialogFunction) => void
};

interface ToolGroup {
    name: string,
    tool: Tool[]
};

export type Toolbar = ToolGroup[];

const props = defineProps<{
    toolbarl: Toolbar,
    toolbarr: Toolbar,
    getCodemirror: () => EditorView | undefined,
    getStarcasket: () => CasketView | undefined,
}>();

function doCallDialog(component: Component, confirm?: Function){
    emits('dialog', component, confirm);
}

function doToolClick(tool: Tool){
    const codemirror = props.getCodemirror();
    const starcasket = props.getStarcasket();
    if(codemirror && starcasket){
        tool.func(codemirror, starcasket, doCallDialog);
    }
}

</script>

<style scoped lang="scss">
.toolbar {
    display: flex;

    padding: 0.2em 0.5em;

    justify-content: space-between;
}

.tool-group {
    display: inline-flex;
    align-items: center;
    height: auto;

    &:not(:last-child) {
        padding-right: 0.2em;
        border-right: 2px solid var(--casket-sp-color);
        margin-right: 0.2em;
    }
}


.button {
    width: 18px;
    height: 18px;
    color: var(--casket-tl-color);

    display: inline-flex;
    justify-content: center;
    align-items: center;
}

.tool {
    height: 24px;
    width: 24px;
    display: inline-flex;

    justify-content: center;
    align-items: center;

    background-color: transparent;
    border-radius: 4px;

    transition: 0.2s ease-in-out background-color;

    position: relative;

    &:hover {
        background-color: rgb(from var(--casket-tl-color) r g b / 0.3);

        > .tooltip {
            opacity: 1; 
            transform: none;
        }
    }
    

    &:not(:last-child) {
        margin-right: 0.2em; 
    }

    overflow: visible;
}

.tooltip {
    display: block;
    padding: 0.5em;

    z-index: 4;

    opacity: 0;

    pointer-events: none;

    font-size: small; 

    border-radius: 4px;

    background-color: #555;
    color: white;

    transform: translateY(2em);

    transition:
        0.2s ease-in-out opacity, 
        0.2s ease-in-out transform;

    white-space: nowrap;

    width: fit-content;
    position: absolute;
    bottom: -2.5em;
}
</style>