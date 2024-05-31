<template>
    <casket-star v-model="value" lang="zh_CN" :upload="upload" />
</template>

<script setup lang="ts">

import CasketStar, { Uploader } from '~/CasketStar.vue';

import '~/themes/markdown/light.scss';
import '~/themes/casket/light.scss';

import { ref } from 'vue';

const value = ref('');

const upload: Uploader = (data: FileList) => {

    const info: {
        alt: string,
        url: string
    }[] = [];
    
    for(let i = 0;i < data.length;i ++){
        console.log(`upload [${data[i].name}]`);

        info.push({
            alt: data[i].name,
            url: 'fakeURL'
        });
    }

    return info;
}
</script>

<style scoped lang="scss">

</style>