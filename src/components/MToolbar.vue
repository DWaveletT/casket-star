<template>
    <div class="cs-toolbar">
        <div>
            <span v-if="props.toolbarL" class="cs-toolbar-group" v-for="group in props.toolbarL" >
                <span class="cs-toolbar-tool" v-for="tool in group" @click="doToolClick(tool)" >
                    <span class="cs-toolbar-tool-button">
                        <font-awesome-icon :icon="tool.icon" class="cs-icon" />
                    </span>
                    <span class="cs-tooltip">{{ i18n(tool.name) }}</span>
                </span>
            </span>
        </div>
        <div>
            <span v-if="props.toolbarR" class="cs-toolbar-group" v-for="group in props.toolbarR" >
                <span class="cs-toolbar-tool" v-for="tool in group" @click="doToolClick(tool)" >
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

import { i18n } from '~/lang';

export interface Tool {
    name: string,
    icon: IconDefinition,
    func: (codemirror: EditorView, casketstar: CasketView, container: HTMLDivElement) => void
};

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
