<template>
    <m-dialog @close="doClose">
        <template #header>
            {{ i18n('image-insert') }}
        </template>

        <div>
            <div class="cs-dialog-item">
                <div class="cs-dialog-item-label">
                    {{ i18n('image-url') }}
                </div>
                <input type="text" v-model="url" class="cs-dialog-item-content" />
            </div>
            <div class="cs-dialog-item">
                <div class="cs-dialog-item-label">
                    {{ i18n('image-alt') }}
                </div>
                <input type="text" v-model="alt" class="cs-dialog-item-content" />

            </div>

            <div class="cs-dialog-item">
                <div class="cs-dialog-upload"
                    @click="selectImage"
                    @dragenter = "handleDragEnter"
                    @dragleave = "handleDragLeave"
                    @dragover = "handleDragOver"
                    @drop = "handleDrop"
                >
                    {{ i18n('image-upload') }}
                </div>

                
                <input type="file" ref="inputImage" style="display: none" @change="uploadImage" />
            </div>

            <div class="cs-dialog-submit-area">
                <button class="cs-dialog-button cs-dialog-button-info" @click="doClose" >{{ i18n('cancel') }}</button>
                <button class="cs-dialog-button cs-dialog-button-info" @click="() => {
                    props.confirm(url, alt);
                    doClose();
                }" >{{ i18n('confirm') }}</button>
            </div>
        </div>
    </m-dialog>
</template>

<script setup lang="ts">

import { ref, render } from 'vue';
import { Uploader } from '~/CasketStar.vue';

import MDialog from '~/components/dialog/MDialog.vue';
import { i18n } from '~/lang';

const props = defineProps<{
    confirm: (url: string, alt: string) => void,
    upload: Uploader,
    container: HTMLDivElement
}>();

function doClose(){
    render(null, props.container);
}

const url = ref('');
const alt = ref('');

const inputImage = ref<HTMLInputElement | null>(null);

const dragging = ref(false);

function handleDragEnter(e: DragEvent){
    if(!e.dataTransfer?.items)
        return;

    for(let i = 0;i < e.dataTransfer.items.length;i ++){
        if(e.dataTransfer.items[i].kind === 'file'){
            dragging.value = true;
            return;
        }
    }
}
function handleDragLeave(e: DragEvent){
    dragging.value = false;
}

function handleDragOver(e: DragEvent){
    e.preventDefault();
}

function handleDrop(e: DragEvent){

    dragging.value = false;

    if(!e.dataTransfer)
        return;

    const result = props.upload(e.dataTransfer.files);

    if(result){
        alt.value = result[0].alt;
        url.value = result[0].url;
    }


    e.preventDefault();
}

function selectImage(){
    inputImage.value?.click();
}

function uploadImage(){
    if(inputImage.value?.files){
        const result = props.upload(inputImage.value.files);

        if(result){
            alt.value = result[0].alt;
            url.value = result[0].url;
        }
    }
}

</script>