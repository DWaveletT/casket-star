<template>
    <div class="main-container">
        <div class="main">
            <h1>Star Casket / 星之器</h1>

            <p>version: 0.0.2</p>

            <p>注意：数学公式是用的 micromark-math-extension 进行渲染，与洛谷公式有差别；但因为洛谷魔改版 micromark-math-extension 未公开，于是此 Playground 没有使用魔改版 micromark-math-extension。</p>

            <p>支持使用 KaTeX 的 \gdef。</p>

            <p>单个编辑器：</p>

            <star-casket v-model="value1" />

            <p>另一个编辑器：</p>

            <star-casket v-model="value2" />
        </div>
    </div>
</template>

<script setup lang="ts">

import StarCasket from './StarCasket.vue';

import { ref } from 'vue';

const value1 = ref('');
const value2 = ref('');

</script>

<style scoped lang="scss">

.main-container {
    display: flex;
    justify-content: center;
}

.main {
    width: min(90%, 1080px);
}
</style>