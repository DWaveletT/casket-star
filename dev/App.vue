<template>
    <casket-star
        :key="lastUpdate"
        v-model="value"
        :i18n="lang === 'zh_CN' ? zhCN : enUS"
        :upload="upload"
        height="300px"
    />

    <select v-model="lang">
        <option value="zh_CN">简体中文</option>
        <option value="en_US">English</option>
    </select>

    {{ lang }}
</template>

<script setup lang="ts">

import CasketStar, { Uploader } from '~/CasketStar.vue';

import '~/themes/markdown/light.scss';
import '~/themes/casket/light.scss';

import { zhCN, enUS } from '~/utils';

import { ref, watch } from 'vue';

const value = ref('');
const lang = ref('zh_CN');

const lastUpdate = ref(0);

watch(lang, () => {
    lastUpdate.value = new Date().getMilliseconds();
});

const upload: Uploader = (data: FileList) => {

    const info: {
        alt: string,
        url: string
    }[] = [];
    
    for(let i = 0;i < data.length;i ++){
        console.log(`upload [${data[i].name}]`);
        
        info.push({
            alt: data[i].name,
            url: `upload://${data[i].name}`
        });
    }

    return info;
}

</script>

<style scoped lang="scss">

</style>