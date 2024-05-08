<template>
    <m-dialog @close="doClose">
        <template #header>
            插入链接
        </template>

        <div>
            <div class="cs-dialog-item">
                <div class="cs-dialog-item-label">
                    链接地址
                </div>
                <input type="text" v-model="url" class="cs-dialog-item-content" />
            </div>
            <div class="cs-dialog-item">
                <div class="cs-dialog-item-label">
                    链接介绍
                </div>
                <input type="text" v-model="alt" class="cs-dialog-item-content" />
            </div>

            <div class="submit-area">
                <button class="cs-dialog-button cs-dialog-button-info" @click="doClose" >取消</button>
                <button class="cs-dialog-button cs-dialog-button-info" @click="() => {
                    props.confirm(url, alt);
                    doClose();
                }" >确认</button>
            </div>
        </div>
    </m-dialog>
</template>

<script setup lang="ts">

import { ref, render } from 'vue';

import MDialog from '~/components/dialog/MDialog.vue';

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
