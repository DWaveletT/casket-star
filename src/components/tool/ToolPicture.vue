<template>
    <m-dialog @close="emits('close')">
        <template #header>
            插入图片
        </template>

        <div>
            <div class="cs-dialog-item">
                <div class="cs-dialog-item-label">
                    图片地址
                </div>
                <input type="text" v-model="url" class="cs-dialog-item-content" />
            </div>
            <div class="cs-dialog-item">
                <div class="cs-dialog-item-label">
                    图片介绍
                </div>
                <input type="text" v-model="alt" class="cs-dialog-item-content" />

            </div>

            <div class="cs-dialog-item">
                <div class="cs-dialog-upload">
                    上传图片
                </div>
            </div>

            <div class="cs-dialog-submit-area">
                <button class="cs-dialog-button cs-dialog-button-info" @click="emits('close')" >取消</button>
                <button class="cs-dialog-button cs-dialog-button-info" @click="() => {
                    emits('confirm', url, alt);
                    emits('close');
                }" >确认</button>
            </div>
        </div>
    </m-dialog>
</template>

<script setup lang="ts">

import { ref } from 'vue';

import MDialog from '../dialog/MDialog.vue';

const emits = defineEmits<{
    confirm: [string, string], close: []
}>();

const url = ref('');
const alt = ref('');

</script>