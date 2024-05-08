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
            <button class="cs-dialog-button cs-dialog-button-info" @click="doMerge" >合并</button>
            <button class="cs-dialog-button cs-dialog-button-info" @click="doSplit" >拆分</button>
            <button class="cs-dialog-button cs-dialog-button-info" @click="doEdit"  >修改</button>
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
                                v-if="!value.merged"
                                :data-x="x"
                                :data-y="y"
                                :colspan="value.col"
                                :rowspan="value.row"
                                :class="{ selected: selected(Number.parseInt(x), Number.parseInt(y)) } "
                                @mousedown = "handleMouseDown"
                                @mouseenter="handleMouseEnter"
                                @mouseup   =   "handleMouseUp"
                            >
                                {{ value.data }}&nbsp;
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

import MDialogExtra from '../dialog/MDialogExtra.vue';

const props = defineProps<{
    confirm: (row: number, col: number, table: Node[][]) => void,
    container: HTMLDivElement
}>();

function doClose(){
    render(null, props.container);
}

const row = ref(1);
const col = ref(1);

const select1 = ref<[number, number]>([NaN, NaN]);
const select2 = ref<[number, number]>([NaN, NaN]);

const selecta = ref<[number, number]>([NaN, NaN]);
const selectb = ref<[number, number]>([NaN, NaN]);

const text = ref('');

const locked = ref(false);

export interface Node {
    row: number,
    col: number,
    data: string,
    merged: boolean
}

const table = ref<Node[][]>([[{ row: 1, col: 1, data: '', merged: false }]]);

function resizeTable(){

    row.value = Math.max(1, row.value);
    col.value = Math.max(1, col.value);
    row.value = Math.min(100, row.value);
    col.value = Math.min(100, col.value);

    while(table.value.length < row.value) table.value.push([]);
    while(table.value.length > row.value) table.value.pop();

    for(let i of table.value){
        while(i.length < col.value) i.push({ row: 1, col: 1, data: '', merged: false}); 
        while(i.length > col.value) i.pop(); 
    }
}

function selected(x: number, y: number): boolean {
    return selecta.value[0] <= x && x <= selectb.value[0] && selecta.value[1] <= y && y <= selectb.value[1];
}

function updateArea(){
    const node1 = table.value[select1.value[0]][select1.value[1]];
    const node2 = table.value[select2.value[0]][select2.value[1]];

    let [nx1, nx2] = [select1.value[0], select2.value[0]];
    let [ny1, ny2] = [select1.value[1], select2.value[1]];

    selecta.value[0] = Math.min(nx1, nx2);
    selecta.value[1] = Math.min(ny1, ny2);

    selectb.value[0] = Math.max(nx1 + node1.row - 1, nx2 + node2.row - 1);
    selectb.value[1] = Math.max(ny1 + node1.col - 1, ny2 + node2.col - 1);
}

function handleMouseDown(e: MouseEvent){
    if(e.target){
        locked.value = false;
        
        const x = Number.parseInt((e.target as HTMLDivElement).dataset.x || '-1');
        const y = Number.parseInt((e.target as HTMLDivElement).dataset.y || '-1');
        
        select1.value = select2.value = [x, y];

        updateArea();
    }
}

function handleMouseEnter(e: MouseEvent){
    if(!locked.value && !Number.isNaN(select1.value[0]) && e.target){
        const x = Number.parseInt((e.target as HTMLDivElement).dataset.x || '-1');
        const y = Number.parseInt((e.target as HTMLDivElement).dataset.y || '-1');
        
        select2.value = [x, y];

        updateArea();
    }
}

function handleMouseUp(e: MouseEvent){
    locked.value = true;
}

function checkValid(){
    let [x1, y1] = selecta.value, [x2, y2] = selectb.value;
    
    for(let i = x1;i <= x2;i ++){
        for(let j = y1;j <= y2;j ++){
            const node = table.value[i][j];
            if(node.merged){
                if(node.row < x1 || node.col < y1)
                    return false;
            } else {
                if(node.row + i - 1 > x2 || node.col + j - 1 > y2)
                    return false;
            }
        }
    }
    return true;
}

function doMerge(){

    if(!checkValid()){
        return;
    }

    let [x1, y1] = selecta.value, [x2, y2] = selectb.value;

    if(!(0 <= x1 && x1 < row.value && 0 <= x2 && x2 < row.value))
        return;
    if(!(0 <= y1 && y1 < col.value && 0 <= y2 && y2 < col.value))
        return;

    const data = table.value[x1][y1].data;

    for(let i = x1;i <= x2;i ++){
        for(let j = y1;j <= y2;j ++){
            table.value[i][j] = {
                row: x1, col: y1, merged: true, data: ''
            };
        }
    }

    table.value[x1][y1] = {
        row: x2 - x1 + 1, col: y2 - y1 + 1, data: data, merged: false
    };
}

function doSplit(){

    if(!checkValid()){
        return;
    }

    let [x1, y1] = selecta.value, [x2, y2] = selectb.value;

    if(!(0 <= x1 && x1 < row.value && 0 <= x2 && x2 < row.value))
        return;
    if(!(0 <= y1 && y1 < col.value && 0 <= y2 && y2 < col.value))
        return;

    for(let i = x1;i <= x2;i ++){
        for(let j = y1;j <= y2;j ++){
            for(let a = 0;a < table.value[i][j].row;++ a){
                for(let b = 0;b < table.value[i][j].col;++ b) if(a !== 0 || b !== 0){
                    table.value[i + a][j + b] = {
                        row: 1,
                        col: 1,
                        data: table.value[i][j].data,
                        merged: false
                    }
                }
            }
            table.value[i][j].col = 1;
            table.value[i][j].row = 1;
        }
    }
}

function doEdit(){

    if(!checkValid()){
        return;
    }

    let [x1, y1] = selecta.value, [x2, y2] = selectb.value;

    if(!(0 <= x1 && x1 < row.value && 0 <= x2 && x2 < row.value))
        return;
    if(!(0 <= y1 && y1 < col.value && 0 <= y2 && y2 < col.value))
        return;

    for(let i = x1;i <= x2;i ++){
        for(let j = y1;j <= y2;j ++) if(!table.value[i][j].merged){
            table.value[i][j].data = text.value;
        }
    }
    
}

watch(row, resizeTable);
watch(col, resizeTable);

</script>