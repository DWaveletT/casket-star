<template>
    <m-dialog @close="doClose">
        <template #header>
            插入块体
        </template>

        <div>
            <div class="cs-dialog-item">
                <div class="cs-dialog-item-label">
                    选择类型
                </div>
                <select v-model="type" class="cs-dialog-item-content">
                    <option v-for="option in list" :key="option.value" :value="option.value">
                        {{ option.name }}
                    </option>
                </select>
            </div>
            
            <div class="cs-dialog-item">
                <div class="cs-dialog-item-label">
                    标题
                </div>
                <input type="text" v-model="title" class="cs-dialog-item-content" />

            </div>
            <div class="cs-dialog-item">
                <div class="cs-dialog-item-label">
                    内容
                </div>

                <textarea class="cs-dialog-item-content" v-model="code" />
            </div>

            <div class="cs-dialog-submit-area">
                <button class="cs-dialog-button cs-dialog-button-info" @click="doClose" >取消</button>
                <button class="cs-dialog-button cs-dialog-button-info" @click="() => {
                    props.confirm(type, title, code);
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
    confirm: (type: string, title: string, code: string) => void,
    container: HTMLDivElement
}>();

function doClose(){
    render(null, props.container);
}

const type = ref('info');
const title = ref('');
const code  = ref('');

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