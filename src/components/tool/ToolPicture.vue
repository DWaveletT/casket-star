<template>
    <m-dialog @close="emits('close')">
        <template #header>
            插入图片
        </template>

        <div class="form">
            <div class="item">
                <div class="label">
                    图片地址
                </div>
                <input type="text" v-model="url" class="content input" />
            </div>
            <div class="item">
                <div class="label">
                    图片介绍
                </div>
                <input type="text" v-model="alt" class="content input" />

            </div>

            <div class="item">
                <div class="upload">
                    上传图片
                </div>
            </div>

            <div class="submit-area">
                <button class="button info" @click="emits('close')" >取消</button>
                <button class="button info" @click="() => {
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

<style scoped lang="scss">

.item {
    width: 100%;

    display: flex;

    > .label {
        display: inline-block;
        
        width: 5em;
        margin-right: 0.5em;
    }

    > .content {
        flex-grow: 1;
    }

    &:not(:last-child){
        margin-bottom: 1em;
    }
}
.input {
    height: 24px;
    padding: 0;
}

.upload {
    width: 100%;
    height: 30vh;

    border: 2px dashed var(--casket-color-d1);
    border-radius: 10px;
    background-color: rgb(from var(--casket-color-l2) r g b / 0.2);

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: x-large;
    color: var(--casket-color-d1);

    transition: 0.2s ease-in-out background-color;

    &:hover {
        background-color: rgb(from var(--casket-color-l2) r g b / 0.4);
    }
}

.submit-area {
    display: flex;
    justify-content: flex-end;
}

.button {
    cursor: pointer;

    border-radius: 4px;

    padding: 0.4em 1em;

    background-color: #fafafa;

    transition: 0.2s ease-in-out background-color;

    &:not(:last-child){
        margin-right: 1em;
    }

    &.info {
        border: 1px solid var(--casket-color);
        background-color: var(--casket-color-l2);
        color: var(--casket-color-d2);

        &:hover {
            background-color: var(--casket-color-l1);
        }
    }
}
</style>