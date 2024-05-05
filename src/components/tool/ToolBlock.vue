<template>
    <m-dialog @close="emits('close')">
        <template #header>
            插入块体
        </template>

        <div class="form">
            <div class="item">
                <div class="label">
                    选择类型
                </div>
                <select v-model="type" class="content select">
                    <option v-for="option in list" :key="option.value" :value="option.value">
                        {{ option.name }}
                    </option>
                </select>
            </div>
            <div class="item">
                <div class="label">
                    内容物
                </div>

                <textarea class="content textarea" v-model="code" />
            </div>

            <div class="submit-area">
                <button class="button cancel"  @click="emits('close')" >取消</button>
                <button class="button confirm" @click="() => {
                    emits('confirm', type, code);
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

const type = ref('info');
const code = ref('');

const list: {
    value: string,
    name: string
}[] = [
    {value:    'info', name: '信息'},
    {value: 'success', name: '成功'},
    {value:   'error', name: '错误'},
    {value: 'warning', name: '警告'},
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