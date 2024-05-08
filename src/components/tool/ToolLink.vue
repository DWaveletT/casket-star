<template>
    <m-dialog @close="emits('close')">
        <template #header>
            插入链接
        </template>

        <div>
            <div class="cs-dialog-item">
                <div class="cs-dialog-item-label">
                    类型
                </div>
                <div>
                    <button class="cs-dialog-button cs-dialog-button-info" :class="{ 'cs-dialog-button-selected': type === 'link'}" @click="type = 'link'">链接</button>
                    <button class="cs-dialog-button cs-dialog-button-info" :class="{ 'cs-dialog-button-selected': type === 'bilibili'}" @click="type = 'bilibili'">视频（bilibili）</button>
                </div>
            </div>
            <template v-if="type === 'link'">
                <div class="cs-dialog-item">
                    <div class="cs-dialog-item-label">
                        链接地址
                    </div>
                    <input type="text" v-model="url" class="cs-dialog-content" />
                </div>
                <div class="cs-dialog-item">
                    <div class="cs-dialog-item-label">
                        链接介绍
                    </div>
                    <input type="text" v-model="alt" class="cs-dialog-content" />
                </div>
            </template>
            <template v-else="type === 'bilibili'">
                <div class="cs-dialog-item">
                    <div class="cs-dialog-item-label">
                        AV 号
                    </div>
                    <input type="text" v-model="av" class="cs-dialog-content" @change="updateAV" />
                </div>
                <div class="cs-dialog-item">
                    <div class="cs-dialog-item-label">
                        BV 号
                    </div>
                    <input type="text" v-model="bv" class="cs-dialog-content" @change="updateBV" />
                </div>
                <div class="cs-dialog-item">
                    <div class="cs-dialog-item-label">
                        视频标题
                    </div>
                    <input type="text" v-model="alt" class="cs-dialog-content" />
                </div>
            </template>

            <div class="submit-area">
                <button class="cs-dialog-button cs-dialog-button-info" @click="emits('close')" >取消</button>
                <button class="cs-dialog-button cs-dialog-button-info" @click="() => {
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
