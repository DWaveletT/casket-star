<template>
    <div class="cs-dialog-container">
        <div class="cs-dialog cs-dialog-big" ref="dialog">
            <div class="cs-dialog-sidebar">
                <div class="cs-dialog-header">
                    <slot name="header" />

                    <div class="cs-close-container" @click="emits('close')" v-html="defaultIcons['xmark']" />
                </div>

                <slot />
            </div>
            
            <div class="cs-dialog-view">
                <slot name="view" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { defaultIcons } from '~/icons.js';

const emits = defineEmits(['close']);

const dialog = ref<HTMLDivElement | undefined>(undefined);

function handleCloseOutside(e: Event){
    if(dialog.value && !dialog.value.contains(e.target as Node | null)){
        emits('close');
    }
}

</script>
