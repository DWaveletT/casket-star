<template>
    <m-dialog @close="emits('close')">
        <template #header>
            插入代码
        </template>

        <div class="form">
            <div class="item">
                <div class="label">
                    选择语言
                </div>
                <select v-model="lang" class="content select">
                    <option v-for="option in list" :key="option.value" :value="option.value">
                        {{ option.name }}
                    </option>
                </select>
            </div>
            <div class="item">
                <div class="label">
                    代码
                </div>

                <textarea class="content textarea" v-model="code" />
            </div>

            <div class="submit-area">
                <button class="button cancel"  @click="emits('close')" >取消</button>
                <button class="button confirm" @click="() => {
                    emits('confirm', lang, code);
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

const lang = ref('');
const code = ref('');

const list: {
    value: string,
    name: string
}[] = [
    {value:        'cpp', name:        'C++'},
    {value:     'pascal', name:     'Pascal'},
    {value:          'c', name:          'C'},
    {value: 'javascript', name: 'Javascript'},
    {value:       'java', name:       'Java'},
    {value:   'markdown', name:   'Markdown'},
    {value:      'latex', name:      'LaTeX'}
];

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
.select {
    height: 24px;
}

.textarea {
    resize: none;
    font-family: monospace;

    overflow: auto;

    min-height: 50vh;

    padding: 0.5em;
    border-radius: 5px;
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

    &.confirm {
        border: 1px solid var(--casket-color);
        background-color: var(--casket-color-l2);
        color: var(--casket-color-d2);

        &:hover {
            background-color: var(--casket-color-l1);
        }
    }

    &.cancel {
        border: 1px solid var(--casket-color);
        background-color: var(--casket-color-l2);
        color: var(--casket-color-d2);

        &:hover {
            background-color: var(--casket-color-l1);
        }
    }
}
</style>