<template>
    <div class="cs-toolbar">
        <div v-if="props.toolbarL">
            <span v-for="group, i in props.toolbarL" :key="i" class="cs-toolbar-group">
                <span v-for="tool in group" :key="tool.name" class="cs-toolbar-tool" @click="doToolClick(tool)">
                    <span class="cs-toolbar-tool-button">
                        <font-awesome-icon :icon="tool.icon" class="cs-icon" />
                    </span>
                    <span class="cs-tooltip">{{ i18n(tool.name) }}</span>
                </span>
            </span>
        </div>
        <div v-if="props.toolbarR">
            <span v-for="group, i in props.toolbarR" :key="i" class="cs-toolbar-group">
                <span v-for="tool in group" :key="tool.name" class="cs-toolbar-tool" @click="doToolClick(tool)">
                    <span class="cs-toolbar-tool-button">
                        <font-awesome-icon :icon="tool.icon" class="cs-icon" />
                    </span>
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

</script>
