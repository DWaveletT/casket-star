<template>
    <div class="cs-toolbar">
        <div>
            <span class="cs-toolbar-group" v-for="group in props.toolbarl" >
                <span class="cs-toolbar-tool" v-for="tool in group.tool" @click="doToolClick(tool)" >
                    <span class="cs-toolbar-tool-button" :innerHTML="tool.icon" />
                    <span class="cs-tooltip">{{ tool.name }}</span>
                </span>
            </span>
        </div>
        <div>
            <span class="cs-toolbar-group" v-for="group in props.toolbarr" >
                <span class="cs-toolbar-tool" v-for="tool in group.tool" @click="doToolClick(tool)" >
                    <span class="cs-toolbar-tool-button" :innerHTML="tool.icon" />
                    <span class="cs-tooltip">{{ tool.name }}</span>
                </span>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { EditorView } from '@codemirror/view';

import { Component } from 'vue';
import { CasketView } from '../CasketStar.vue';

const emits = defineEmits<{
    viewer: ["only-view" | "only-edit" | "both"]
}>();

export interface Tool {
    name: string,
    icon: string,
    func: (codemirror: EditorView, casketstar: CasketView, container: HTMLDivElement) => void
};

export interface ToolGroup {
    name: string,
    tool: Tool[]
};

export type Toolbar = ToolGroup[];

const props = defineProps<{
    toolbarl: Toolbar,
    toolbarr: Toolbar,
    getCodemirror: () => EditorView | undefined,
    getCasketstar: () => CasketView | undefined,
    dialog: HTMLDivElement | null
}>();

function doToolClick(tool: Tool){
    const codemirror = props.getCodemirror();
    const casketstar = props.getCasketstar();
    if(codemirror && casketstar){
        tool.func(codemirror, casketstar, props.dialog as HTMLDivElement);
    }
}

</script>
