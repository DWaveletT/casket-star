<template>
    <div class="dialog-container">
        <div class="dialog" ref="dialog">
            <div class="config">
                <div class="header">
                    <slot name="header" />

                    <div class="close-container" @click="emits('close')" v-html="defaultIcons['xmark']" />
                </div>

                <div class="content">
                    <slot />
                </div>
            </div>
            
            <div class="view">
                <slot name="view" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { defaultIcons } from '../../icons';

const emits = defineEmits(['close']);

const dialog = ref<HTMLDivElement | undefined>(undefined);

function handleCloseOutside(e: Event){
    if(dialog.value && !dialog.value.contains(e.target as Node | null)){
        emits('close');
    }
}

</script>

<style scoped lang="scss">
.dialog-container {
    position: fixed;

    display: flex;
    justify-content: center;
    align-items: center;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    background-color: rgb(0 0 0 / 0.2);
}

@keyframes slideIn {
    from {
        transform: translateY(-2em);
    }
    to {
        transform: none;
    }
}

.dialog {
    width: min(1080px, 80%);
    height: 80%;

    background-color: white;
    border-radius: 5px;

    padding: 1em;

    animation: slideIn 0.2s;

    display: flex;

    > .config {
        width: 320px;
        padding-right: 1em;
        margin-right: 1em;
        border-right: 1px dashed rgb(0 0 0 / 0.3);

        display: flex;
        flex-direction: column;
    }

    > .view {
        width: 760px;
        overflow: auto;

    }
}

.header {
    height: 1.6em;
    border-bottom: 1px solid rgb(0 0 0 / 0.3);
    padding-bottom: 0.2em;
    margin-bottom: 1.5em;

    font-size: large;

    > .close-container {
        width: 24px;
        height: 24px;
        float: right;

        display: flex;
        justify-content: center;
        align-items: center;

        cursor: pointer;

        > .close {
            color: #666666;

            transition:
                0.2s ease-in-out color,
                0.2s ease-in-out transform;
        }


        &:hover > .close {
            transform: scale(1.3);
        }
    }
}

.content {
    flex-grow: 1;
}
</style>