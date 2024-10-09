<template>
    <m-dialog extra @close="doClose">
        <template #header>
            {{ i18n('auto-save') }}
        </template>

        <div>
            <div class="cs-dialog-timeline">
                <div v-for="item in history" :key="item.time" class="cs-dialog-timeline-item" @click="selected = item">
                    {{ new Date(item.time).toLocaleString() }}
                </div>
            </div>

            <div class="cs-dialog-submit-area">
                <button
                    class="cs-dialog-button cs-dialog-button-selected" @click="() => {
                        if(selected)
                            props.confirm(selected.content);
                        doClose();
                    }"
                >
                    {{ i18n('auto-save-load') }}
                </button>
                <button class="cs-dialog-button cs-dialog-button-info" @click="doClose">{{ i18n('cancel') }}</button>
            </div>
        </div>
        
        <template #view>
            <template v-if="selected">
                <h3>{{ i18n('auto-save-time') }} {{ new Date(selected.time).toLocaleString() }}</h3>
                <code><pre>{{ selected.content }}</pre></code>
            </template>
            <template v-else>
                未选择任何记录
            </template>
        </template>
    </m-dialog>
</template>

<script setup lang="ts">

import { ref, render } from 'vue';

import MDialog from '~/components/MDialog.vue';
import { AutoSaveItem, i18n, loadStorage } from '~/utils';

const selected = ref<AutoSaveItem | null>(null);

const props = defineProps<{
    confirm: (content: string) => void,
    container: HTMLDivElement
}>();

const history = loadStorage();

function doClose(){
    render(null, props.container);
}


</script>