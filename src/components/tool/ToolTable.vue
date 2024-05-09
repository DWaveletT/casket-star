<template>
    <m-dialog-extra @close="doClose">
        <template #header>
            插入表格
        </template>

        <div class="cs-dialog-item">
            <div class="cs-dialog-item-label">
                行数
            </div>
            <input type="number" v-model="row" class="cs-dialog-item-content" min="1" max="100" />
        </div>
        <div class="cs-dialog-item">
            <div class="cs-dialog-item-label">
                列数
            </div>
            <input type="number" v-model="col" class="cs-dialog-item-content" min="1" max="100" />
        </div>
        
        <div class="cs-dialog-item">
            <button class="cs-dialog-button cs-dialog-button-info" @click="doEdit">修改</button>
        </div>

        <div class="cs-dialog-area">

            <h3>编辑区</h3>

            <textarea v-model="text" />
        </div>

        <div class="submit-area">
            <button class="cs-dialog-button cs-dialog-button-info" @click="doClose" >取消</button>
            <button class="cs-dialog-button cs-dialog-button-info" @click="() => {
                confirm(row, col, table);
                doClose();
            }" >确认</button>
        </div>

        <template #view>
            <table class="cs-dialog-table-editor">
                <tbody>
                    <tr v-for="[x, line] of Object.entries(table)">
                        <template
                            v-for="[y, value] of Object.entries(line)"
                        >
                            <td
                                :data-x="x"
                                :data-y="y"
                                :class="{ selected: selected(Number.parseInt(x), Number.parseInt(y)) } "
                                @mousedown = "handleMouseDown"
                                @mouseenter="handleMouseEnter"
                                @mouseup   =   "handleMouseUp"
                            >
                                {{ value }}&nbsp;
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </template>
    </m-dialog-extra>
</template>

<script setup lang="ts">

import { ref, watch, render } from 'vue';

import MDialogExtra from '~/components/dialog/MDialogExtra.vue';

const props = defineProps<{
    confirm: (row: number, col: number, table: string[][]) => void,
    container: HTMLDivElement
}>();

function doClose(){
    render(null, props.container);
}

const row = ref(1);
const col = ref(1);

const select1 = ref<[number, number]>([NaN, NaN]);
const select2 = ref<[number, number]>([NaN, NaN]);

const text = ref('');

const locked = ref(false);

const table = ref<string[][]>([['']]);

function resizeTable(){

    row.value = Math.max(1, row.value);
    col.value = Math.max(1, col.value);
    row.value = Math.min(100, row.value);
    col.value = Math.min(100, col.value);

    while(table.value.length < row.value) table.value.push([]);
    while(table.value.length > row.value) table.value.pop();

    for(let i of table.value){
        while(i.length < col.value) i.push(''); 
        while(i.length > col.value) i.pop(); 
    }
}

function selected(x: number, y: number): boolean {
    return select1.value[0] <= x && x <= select2.value[0] && select1.value[1] <= y && y <= select2.value[1];
}

function handleMouseDown(e: MouseEvent){
    if(e.target){
        locked.value = false;
        
        const x = Number.parseInt((e.target as HTMLDivElement).dataset.x || '-1');
        const y = Number.parseInt((e.target as HTMLDivElement).dataset.y || '-1');
        
        select1.value = select2.value = [x, y];
    }
}

function handleMouseEnter(e: MouseEvent){
    if(!locked.value && !Number.isNaN(select1.value[0]) && e.target){
        const x = Number.parseInt((e.target as HTMLDivElement).dataset.x || '-1');
        const y = Number.parseInt((e.target as HTMLDivElement).dataset.y || '-1');
        
        select2.value = [x, y];
    }
}

function handleMouseUp(e: MouseEvent){
    locked.value = true;
}

function doEdit(){

    let [x1, y1] = select1.value, [x2, y2] = select2.value;

    if(!(0 <= x1 && x1 < row.value && 0 <= x2 && x2 < row.value))
        return;
    if(!(0 <= y1 && y1 < col.value && 0 <= y2 && y2 < col.value))
        return;

    for(let i = x1;i <= x2;i ++){
        for(let j = y1;j <= y2;j ++){
            table.value[i][j] = text.value;
        }
    }
    
}

watch(row, resizeTable);
watch(col, resizeTable);

</script>