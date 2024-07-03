<template>
    <m-dialog @close="doClose">
        <template #header>
            {{ i18n('link-insert') }}
        </template>

        <div>
            <div class="cs-dialog-item">
                <div class="cs-dialog-item-label">
                    {{ i18n('link-url') }}
                </div>
                <input v-model="url" type="text" class="cs-dialog-item-content" />
            </div>
            <div class="cs-dialog-item">
                <div class="cs-dialog-item-label">
                    {{ i18n('link-alt') }}
                </div>
                <input v-model="alt" type="text" class="cs-dialog-item-content" />
            </div>

            <div class="cs-dialog-submit-area">
                <button
                    class="cs-dialog-button cs-dialog-button-info" @click="() => {
                        props.confirm(url, alt);
                        doClose();
                    }"
                >
                    {{ i18n('confirm') }}
                </button>
                <button class="cs-dialog-button cs-dialog-button-info" @click="doClose">{{ i18n('cancel') }}</button>
            </div>
        </div>
    </m-dialog>
</template>

<script setup lang="ts">

import { ref, render } from 'vue';

import MDialog from '~/components/MDialog.vue';
import { i18n } from '~/utils';

const props = defineProps<{
    confirm: (url: string, alt: string) => void,
    container: HTMLDivElement
}>();

function doClose(){
    render(null, props.container);
}

const url = ref('');
const alt = ref('');

</script>
