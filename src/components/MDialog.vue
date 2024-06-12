<template>
    <div class="cs-dialog-container" @click="handleCloseOutside">
        <div
            ref="dialog"
            :class="[
                'cs-dialog',
                { 'cs-dialog-big': props.extra }
            ]"
        >
            <div :class="`${props.extra ? 'cs-dialog-sidebar' : ''}`">
                <div class="cs-dialog-header">
                    <slot name="header" />

                    <div class="cs-close-container" @click="emits('close')">
                        <font-awesome-icon :icon="defaultIcons['xmark']" class="cs-icon" />
                    </div>
                </div>

                <slot />
            </div>

            <div v-if="props.extra" class="cs-dialog-view">
                <slot name="view" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { defaultIcons, FontAwesomeIcon } from '~/icons';

const emits = defineEmits(['close']);

const props = withDefaults(defineProps<{
    extra?: boolean
}>(),{
    extra: false
});

const dialog = ref<HTMLDivElement | undefined>(undefined);

function handleCloseOutside(e: Event){
    if (props.extra) return;
    if(dialog.value && !dialog.value.contains(e.target as Node | null)){
        emits('close');
    }
}

</script>
