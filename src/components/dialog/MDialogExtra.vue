<template>
    <div class="cs-dialog-container">
        <div class="cs-dialog cs-dialog-big" ref="dialog">
            <div class="cs-dialog-sidebar">
                <div class="cs-dialog-header">
                    <slot name="header" />

                    <div class="cs-close-container" @click="emits('close')">
                        <font-awesome-icon :icon="defaultIcons['xmark']" class="cs-icon" />
                    </div>
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
import { defaultIcons, FontAwesomeIcon } from '~/icons';

const emits = defineEmits(['close']);

const dialog = ref<HTMLDivElement | undefined>(undefined);

function handleCloseOutside(e: Event){
    if(dialog.value && !dialog.value.contains(e.target as Node | null)){
        emits('close');
    }
}

</script>
