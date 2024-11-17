<template>
    <div class="cs-toolbar">
        <div v-if="props.toolbarL">
            <span v-for="group, i in props.toolbarL" :key="i" class="cs-toolbar-group">
                <span v-for="tool in group" :key="tool.name" class="cs-toolbar-tool" :class="{ 'active': checkToolActive(tool) }" @click="doToolClick(tool)">
                    <font-awesome-icon :icon="tool.icon" class="cs-icon" />
                    <span class="cs-tooltip">{{ i18n(tool.name) }}</span>
                </span>
            </span>
        </div>
        <div v-if="props.toolbarR">
            <span v-for="group, i in props.toolbarR" :key="i" class="cs-toolbar-group">
                <span v-for="tool in group" :key="tool.name" class="cs-toolbar-tool" :class="{ 'active': checkToolActive(tool) }" @click="doToolClick(tool)">
                    <font-awesome-icon :icon="tool.icon" class="cs-icon" />
                    <span class="cs-tooltip">{{ i18n(tool.name) }}</span>
                </span>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">

import { EditorView } from '@codemirror/view';
import { CasketView } from '~/CasketStar.vue';
import { FontAwesomeIcon } from '~/icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import { i18n } from '~/utils';

export interface Tool {
    name: string,
    icon: IconDefinition,
    active?: (codemirror: EditorView, casketstar: CasketView, container: HTMLDivElement) => boolean,
    func: (codemirror: EditorView, casketstar: CasketView, container: HTMLDivElement) => void
}

export type ToolGroup = Tool[];
export type Toolbar = ToolGroup[];

const props = defineProps<{
    toolbarL?: Toolbar,
    toolbarR?: Toolbar,
    getCodemirror: () => EditorView | undefined,
    getCasketstar: () => CasketView | undefined,
    dialog: HTMLDivElement | null,
    disabled?: boolean
}>();

function doToolClick(tool: Tool){

    if(props.disabled)
        return;

    const codemirror = props.getCodemirror();
    const casketstar = props.getCasketstar();
    if(codemirror && casketstar){
        tool.func(codemirror, casketstar, props.dialog as HTMLDivElement);
    }
}

const checkToolActive = (tool: Tool) => {

    if(tool.active){
        const codemirror = props.getCodemirror();
        const casketstar = props.getCasketstar();
        if(codemirror && casketstar){
            return tool.active(codemirror, casketstar, props.dialog as HTMLDivElement);
        }
    }

    return false;
};

</script>
