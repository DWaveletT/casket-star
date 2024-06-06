<template>
    <div class="cs-toolbar">
        <div>
            <span class="cs-toolbar-group" v-for="group in props.toolbarl" >
                <span class="cs-toolbar-tool" v-for="tool in group" @click="doToolClick(tool)" >
                    <span class="cs-toolbar-tool-button">
                        <font-awesome-icon :icon="tool.icon" class="cs-icon" />
                    </span>
                    <span class="cs-tooltip">{{ i18n(tool.name) }}</span>
                </span>
            </span>
        </div>
        <div>
            <span class="cs-toolbar-group" v-for="group in props.toolbarr" >
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
import { CasketI18n } from '~/lang';

import { EditorView } from '@codemirror/view';
import { CasketView } from '~/CasketStar.vue';
import { FontAwesomeIcon } from '~/icons';
import { inject } from 'vue';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

const i18n = inject('i18n') as CasketI18n;

export interface Tool {
    name: string,
    icon: IconDefinition,
    func: (codemirror: EditorView, casketstar: CasketView, container: HTMLDivElement) => void
};

export type ToolGroup = Tool[];
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
