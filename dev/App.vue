<template>
    <casket-star v-model="value" lang="zh_CN" :upload="upload" />
</template>

<script setup lang="ts">

import CasketStar, { Uploader } from '~/CasketStar.vue';

import '~/themes/markdown/light.scss';
import '~/themes/casket/light.scss';

import { ref } from 'vue';

const value = ref('');

const upload: Uploader = (data: DataTransfer) => {

    const info: {
        alt: string,
        url: string
    }[] = [];
    
    for (var i = 0; i < data.files.length; i++) {
        console.log(
            "... file[" + i + "].name = " + data.files[i].name,
        );

        info.push({
            alt: data.files[i].name,
            url: 'fakeURL'
        });
    }
    for (var i = 0; i < data.items.length; i++) {
        console.log('kind = ' + data.items[i].kind);
        console.log('type = ' + data.items[i].type);
        data.items[i].getAsString((r: string) => console.log('item[ ' + i + '] = ' + r));
    }

    return info;
}
</script>

<style scoped lang="scss">

</style>