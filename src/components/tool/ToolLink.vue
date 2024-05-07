<template>
    <m-dialog @close="emits('close')">
        <template #header>
            插入链接
        </template>

        <div class="form">
            <div class="item">
                <div class="label">
                    类型
                </div>
                <div class="buttons">
                    <button class="button info" :class="{ selected: type === 'link'}" @click="type = 'link'">链接</button>
                    <button class="button info" :class="{ selected: type === 'bilibili'}" @click="type = 'bilibili'">视频（bilibili）</button>
                </div>
            </div>
            <template v-if="type === 'link'">
                <div class="item">
                    <div class="label">
                        链接地址
                    </div>
                    <input type="text" v-model="url" class="content input" />
                </div>
                <div class="item">
                    <div class="label">
                        链接介绍
                    </div>
                    <input type="text" v-model="alt" class="content input" />
                </div>
            </template>
            <template v-else="type === 'bilibili'">
                <div class="item">
                    <div class="label">
                        AV 号
                    </div>
                    <input type="text" v-model="av" class="content input" @change="updateAV" />
                </div>
                <div class="item">
                    <div class="label">
                        BV 号
                    </div>
                    <input type="text" v-model="bv" class="content input" @change="updateBV" />
                </div>
                <div class="item">
                    <div class="label">
                        视频标题
                    </div>
                    <input type="text" v-model="alt" class="content input" />
                </div>
            </template>

            <div class="submit-area">
                <button class="button info" @click="emits('close')" >取消</button>
                <button class="button info" @click="() => {
                    emits('confirm', type, url, alt);
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
    confirm: [string, string, string], close: []
}>();

const type = ref('link');
const url = ref('');
const alt = ref('');

const av = ref<string>('');
const bv = ref<string>('');

// https://gitcode.com/Blokura/bv2av/blob/master/index.php

const table = [...'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF'];
const s = [11, 10, 3, 8, 4, 6];
const xor =  177451812;
const add = 8728348608;

const bilibiliA2B = (av: string) => {
    let num = parseInt(av.replace(/[^0-9]/gu, ''));

    if (isNaN(num) || num <= 0) {
        return '不正确的 av 号';
    };

    num = (num ^ xor) + add;
    let result = [...'bv1  4 1 7  '];
    let i = 0;
    while (i < 6) {
        result[s[i]] = table[Math.floor(num / 58 ** i) % 58];
        i += 1;
    };
    return result.join('');
};

const bilibiliB2A = (bv: string) => {
    let str = '';
    if (bv.length === 12) {
        str = bv;
    } else if (bv.length === 10) {
        str = `BV${bv}`;
    } else if (bv.length ===  9) {
        str = `BV1${bv}`;
    } else {
        return '不正确的 bv 号';
    };
    if (!str.match(/[Bb][Vv][fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{10}/gu)) {
        return '不正确的 bv 号';
    };

    let result = 0;
    let i = 0;
    while (i < 6) {
        result += table.indexOf(str[s[i]]) * 58 ** i;
        i += 1;
    };
    return `av${result - add ^ xor}`;
};

function updateAV(){
    bv.value = bilibiliA2B(av.value);
    url.value = '#' + av.value.replace(/[^0-9]/gu, '');
}

function updateBV(){
    av.value = bilibiliB2A(bv.value);
    url.value = '#' + av.value.replace(/[^0-9]/gu, '');
}

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

    &.selected {
        background-color: var(--casket-color-l1);
    }
}
</style>