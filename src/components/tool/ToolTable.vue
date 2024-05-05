<template>
    <m-dialog-extra @close="emits('close')">
        <template #header>
            插入表格
        </template>

        <div class="form">
            <div class="item">
                <div class="label">
                    行数
                </div>
                <input type="number" v-model="row" class="content input" min="1" max="100" />
            </div>
            <div class="item">
                <div class="label">
                    列数
                </div>
                <input type="number" v-model="col" class="content input" min="1" max="100" />
            </div>
            
            <div class="operate-area">
                <button class="button confirm" @click="doMerge" >合并</button>
                <button class="button confirm" @click="doSplit" >拆分</button>
                <button class="button confirm" @click="doEdit"  >修改</button>
            </div>

            <div class="editor">

                <h3>编辑区</h3>

                <textarea class="content textarea" v-model="text" />
            </div>

            <div class="submit-area">
                <button class="button cancel"  @click="emits('close')" >取消</button>
                <button class="button confirm" @click="() => {
                    emits('confirm', row, col, table);
                    emits('close');
                }" >确认</button>
            </div>
        </div>

        <template #view>
            <table class="table">
                <tbody>
                    <tr class="row" v-for="[x, line] of Object.entries(table)">
                        <template
                            v-for="[y, value] of Object.entries(line)"
                        >
                            <td
                                v-if="!value.merged"
                                :data-x="x"
                                :data-y="y"
                                :colspan="value.col"
                                :rowspan="value.row"
                                class="data" 
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

import { ref, watch } from 'vue';

import MDialogExtra from '../dialog/MDialogExtra.vue';

const emits = defineEmits<{
    confirm: [number, number, Node[][]], close: []
}>();

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
            for(let a = 0;a < table.value[i][j].row;++ a){
                for(let b = 0;b < table.value[i][j].col;++ b){
                    table.value[i + a][j + b] = {
                        row: 1, col: 1, merged: false, data: table.value[i][j].data
                    }
                }
            }
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

<style scoped lang="scss">

.table {
    height: 100%;
    width: 100%;

    border: 2px solid black;

    border-collapse: collapse;

    flex-direction: column;

    table-layout: fixed;

    > tbody {
        > .row {

            overflow: hidden;

            > .data {

                border: 2px solid black;

                overflow: hidden;
                text-overflow: ellipsis;

                user-select: none;

                &:hover {
                    background-color: rgb(from var(--casket-color) r g b / 0.4);
                }

                &.selected {
                    background-color: rgb(from var(--casket-color) r g b / 0.2);
                }
            }
        }
    }
}

.form {
    display: flex;
    height: 100%;

    flex-direction: column;
}

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

.editor {
    flex-grow: 1;
    display: flex;

    flex-direction: column;

    margin-bottom: 1em;
}

.operate-area {
    margin-bottom: 1em;
}

.submit-area {
    display: flex;
    justify-content: flex-end;

    margin-bottom: 1em;
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

.textarea {
    flex-grow: 1;

    resize: none;
    font-family: monospace;

    overflow: auto;

    padding: 0.5em;
    border-radius: 5px;
}
</style>