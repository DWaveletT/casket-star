

import remarkGfm from 'remark-gfm';
import remarkMath from './plugins/remark-math-luogu';

import rehypeKatex from 'rehype-katex';

import remarkDirective from 'remark-directive';
import remarkCallouts from './plugins/remark-callouts';
import remarkNoHtml from './plugins/remark-no-html';

import rehypeHighlight from 'rehype-highlight';


import { CasketView, Plugins } from './StarCasket.vue';
import { DialogFunction, Toolbar } from './components/MToolbar.vue';

export function defaultPlugins(): Plugins {
    return {
        remark: [
            remarkNoHtml, remarkGfm, remarkDirective, remarkCallouts, remarkMath, remarkExtendedTable
        ],
        rehype: [
            rehypeKatex, rehypeHighlight
        ],
        remarkRehypeOptions: {
            handlers: extendedTableHandlers
        }
    }
}

import { EditorView } from '@codemirror/view';
import { ChangeSpec, EditorSelection, EditorState, SelectionRange } from '@codemirror/state';
import { defaultIcons } from './icons';

import ToolCode from './components/tool/ToolCode.vue';
import ToolPicture from './components/tool/ToolPicture.vue';
import ToolTable, { Node } from './components/tool/ToolTable.vue';
import ToolLink from './components/tool/ToolLink.vue';
import ToolBlock from './components/tool/ToolBlock.vue';
import remarkExtendedTable, { extendedTableHandlers } from 'remark-extended-table';

export function defaultToolbarL(): Toolbar {
    return [
        {
            name: '标题',
            tool: [
                {
                    name: '增加一级',
                    icon: defaultIcons['headingup'],
                    func: (codemirror: EditorView) => {
                        const state = codemirror.state;

                        const trans = state.update(state.changeByRange( range => {
                            const line1 = state.doc.lineAt(range.from).number;
                            const line2 = state.doc.lineAt(  range.to).number;

                            const changes: ChangeSpec[] = [];

                            let newl = 0, newr = state.doc.line(line1).from;

                            for(let i = line1;i <= line2;i ++){
                                const line = state.doc.line(i);
                                const text = line.text;

                                console.log(line.text);
                                
                                let count1 = 0, count2 = 0, count3 = 0;
                                const len = text.length;
                                while(count1 < len && text[count1] === ' ')
                                        count1 ++;
                                count2 = count1;
                                while(count2 < len && text[count2] === '#')
                                        count2 ++;
                                count3 = count2;
                                while(count3 < len && text[count3] === ' ')
                                        count3 ++;
                                
                                const levelOld = count2 - count1;
                                const levelNew = Math.min(levelOld + 1, 6);

                                const head = levelNew === 0 ? '' : '#'.repeat(levelNew) + ' ';
                                
                                changes.push({
                                    from: line.from,
                                    to  : line.from + count3,
                                    insert: head
                                });
                                if(i === line1){
                                    newl = line.from;
                                }
                                newr = newr + line.length + head.length - count3 + 1;
                            }
                            newr --;

                            return {
                                changes: changes,
                                range: EditorSelection.range(newl, newr)
                            }
                        }));
                        
                        codemirror.update([trans]);
                        codemirror.focus();
                    }
                },
                {
                    name: '减小一级',
                    icon: defaultIcons['headingdown'],
                    func: (codemirror: EditorView) => {
                        const state = codemirror.state;

                        const trans = state.update(state.changeByRange( range => {
                            const line1 = state.doc.lineAt(range.from).number;
                            const line2 = state.doc.lineAt(  range.to).number;

                            const changes: ChangeSpec[] = [];

                            let newl = 0, newr = state.doc.line(line1).from;

                            for(let i = line1;i <= line2;i ++){
                                const line = state.doc.line(i);
                                const text = line.text;

                                console.log(line.text);
                                
                                let count1 = 0, count2 = 0, count3 = 0;
                                const len = text.length;
                                while(count1 < len && text[count1] === ' ')
                                        count1 ++;
                                count2 = count1;
                                while(count2 < len && text[count2] === '#')
                                        count2 ++;
                                count3 = count2;
                                while(count3 < len && text[count3] === ' ')
                                        count3 ++;
                                
                                const levelOld = count2 - count1;
                                const levelNew = Math.max(levelOld - 1, 0);

                                const head = levelNew === 0 ? '' : '#'.repeat(levelNew) + ' ';
                                
                                changes.push({
                                    from: line.from,
                                    to  : line.from + count3,
                                    insert: head
                                });
                                if(i === line1){
                                    newl = line.from;
                                }
                                newr = newr + line.length + head.length - count3 + 1;
                            }
                            newr --;

                            return {
                                changes: changes,
                                range: EditorSelection.range(newl, newr)
                            }
                        }));
                        
                        codemirror.update([trans]);
                        codemirror.focus();
                    }
                },
                {
                    name: '水平线',
                    icon: defaultIcons['line'],
                    func: (codemirror: EditorView) => {
                        const state = codemirror.state;
                        
                        const trans = state.update(state.changeByRange( range => {

                            const text = `\n\n---\n\n`;
                            return {
                                changes: [
                                    { from: range.from, to: range.to},
                                    { from: range.from, insert: text}
                                ],
                                range: EditorSelection.range(range.from + text.length, range.from + text.length)
                            }
                        }));
                        
                        codemirror.update([trans]);
                        codemirror.focus();
                    }
                },
            ]
        },
        {
            name: '行内',
            tool: [
                {
                    name: '粗体',
                    icon: defaultIcons['bold'],
                    func: (codemirror: EditorView) => {
                        const state = codemirror.state;

                        const trans = state.update(state.changeByRange( range => {
                            return {
                                changes: [
                                    { from: range.from, insert: '**'},
                                    { from:   range.to, insert: '**'},
                                ],
                                range: EditorSelection.range(range.from + 2, range.to + 2)
                            }
                        }));
                        
                        codemirror.update([trans]);
                        codemirror.focus();
                    }
                },
                {
                    name: '斜体',
                    icon: defaultIcons['italic'],
                    func: (codemirror: EditorView) => {
                        const state = codemirror.state;

                        const trans = state.update(state.changeByRange( range => {
                            return {
                                changes: [
                                    { from: range.from, insert: ' _'},
                                    { from:   range.to, insert: '_ '},
                                ],
                                range: EditorSelection.range(range.from + 2, range.to + 2)
                            }
                        }));
                        
                        codemirror.update([trans]);
                        codemirror.focus();
                    }
                },
                {
                    name: '删除线',
                    icon: defaultIcons['strikethrough'],
                    func: (codemirror: EditorView) => {
                        const state = codemirror.state;

                        const trans = state.update(state.changeByRange( range => {
                            return {
                                changes: [
                                    { from: range.from, insert: '~~'},
                                    { from:   range.to, insert: '~~'},
                                ],
                                range: EditorSelection.range(range.from + 2, range.to + 2)
                            }
                        }));
                        
                        codemirror.update([trans]);
                        codemirror.focus();
                    }
                },
            ]
        },
        {
            name: '行间',
            tool: [
                {
                    name: '插入链接',
                    icon: defaultIcons['link'],
                    func: (codemirror: EditorView, starcasket: CasketView, dialog: DialogFunction) => {
                        
                        function insertLink(type: string, url: string, alt: string){
                            const state = codemirror.state;
                            const trans = state.update(state.changeByRange( range => {
                                const text = (() => {
                                    if(type === 'link')
                                        return `[${url}](${alt})`;
                                    else 
                                    if(type === 'bilibili')
                                        return `:bilibili[${alt}]{${url}}`;
                                    else 
                                        return ``;
                                })();
                                return {
                                    changes: [
                                        { from: range.from, to: range.to},
                                        { from: range.from, insert: text},
                                    ],
                                    range: EditorSelection.range(range.from + text.length, range.from + text.length)
                                }
                            }));
                            
                            codemirror.update([trans]);
                            codemirror.focus();
                        }
                        
                        dialog(ToolLink, insertLink);
                    }
                },
                {
                    name: '插入图片',
                    icon: defaultIcons['picture'],
                    func: (codemirror: EditorView, starcasket: CasketView, dialog: DialogFunction) => {
                        
                        function insertPicture(url: string, alt: string){
                            const state = codemirror.state;
                            const trans = state.update(state.changeByRange( range => {
                                const text = `![${url}](${alt})`;
                                return {
                                    changes: [
                                        { from: range.from, to: range.to},
                                        { from: range.from, insert: text},
                                    ],
                                    range: EditorSelection.range(range.from + text.length, range.from + text.length)
                                }
                            }));
                            
                            codemirror.update([trans]);
                            codemirror.focus();
                        }
                        
                        dialog(ToolPicture, insertPicture);
                    }
                },
                {
                    name: '插入代码',
                    icon: defaultIcons['code'],
                    func: (codemirror: EditorView, starcasket: CasketView, dialog: DialogFunction) => {
                        
                        function insertCode(lang: string, code: string){
                            const state = codemirror.state;
                            const trans = state.update(state.changeByRange( range => {
                                const text = `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
                                return {
                                    changes: [
                                        { from: range.from, to: range.to},
                                        { from: range.from, insert: text},
                                    ],
                                    range: EditorSelection.range(range.from + text.length, range.from + text.length)
                                }
                            }));
                            
                            codemirror.update([trans]);
                            codemirror.focus();
                        }
                        
                        dialog(ToolCode, insertCode);
                    }
                },
                {
                    name: '插入表格',
                    icon: defaultIcons['table'],
                    func: (codemirror: EditorView, starcasket: CasketView, dialog: DialogFunction) => {
                        
                        function insertTable(row: number, col: number, table: Node[][]){
                            const state = codemirror.state;
                            const trans = state.update(state.changeByRange( range => {
                                let text = "\n\n";

                                for(let i = 0;i < row;i ++){
                                    for(let j = 0;j < col;j ++){
                                        const node = table[i][j];
                                        if(!node.merged && !(node.row === 1 && node.col === 1)){
                                            const data = node.data;
                                            for(let a = i;a < i + node.row;a ++){
                                                for(let b = j;b < j + node.col;b ++){
                                                    if(a === i && b + 1 === j + node.col){
                                                        table[a][b].data = data;
                                                    } else 
                                                    if(a === i){
                                                        table[a][b].data = '>';
                                                    } else 
                                                        table[a][b].data = '^';
                                                }
                                            }
                                        }
                                    }
                                }

                                for(let i = 0;i < row;i ++){
                                    for(let j = 0;j < col;j ++){
                                        text += '|' + table[i][j].data
                                    }
                                    text += '|\n';

                                    if(i === 0){
                                        for(let j = 0;j < col;j ++)
                                            text += '|:-:';
                                        text += '|\n';
                                    }
                                }

                                text += '\n';

                                return {
                                    changes: [
                                        { from: range.from, to: range.to},
                                        { from: range.from, insert: text},
                                    ],
                                    range: EditorSelection.range(range.from + text.length, range.from + text.length)
                                }
                            }));
                            
                            codemirror.update([trans]);
                            codemirror.focus();
                        }
                        
                        dialog(ToolTable, insertTable);
                    }
                },
                {
                    name: '插入块体',
                    icon: defaultIcons['block'],
                    func: (codemirror: EditorView, starcasket: CasketView, dialog: DialogFunction) => {
                        
                        function insertCode(type: string, code: string){
                            const state = codemirror.state;
                            const trans = state.update(state.changeByRange( range => {
                                const text = `\n:::${type}\n${code}\n:::\n`;
                                return {
                                    changes: [
                                        { from: range.from, to: range.to},
                                        { from: range.from, insert: text},
                                    ],
                                    range: EditorSelection.range(range.from + text.length, range.from + text.length)
                                }
                            }));
                            
                            codemirror.update([trans]);
                            codemirror.focus();
                        }
                        
                        dialog(ToolBlock, insertCode);
                    }
                },
            ]
        },
        {
            name: '块级',
            tool: [
                {
                    name: '引用块',
                    icon: defaultIcons['quote'],
                    func: (codemirror: EditorView) => {
                        const state = codemirror.state;

                        const trans = state.update(state.changeByRange( range => {
                            const line1 = state.doc.lineAt(range.from).number;
                            const line2 = state.doc.lineAt(  range.to).number;

                            const changes: ChangeSpec[] = [];

                            let newl = 0, newr = state.doc.line(line1).from;

                            for(let i = line1;i <= line2;i ++){
                                const line = state.doc.line(i);
                                const head = '> ';
                                
                                changes.push({
                                    from: line.from,
                                    insert: head
                                });
                                if(i === line1){
                                    newl = line.from;
                                }
                                newr = newr + line.length + head.length + 1;
                            }
                            newr --;

                            return {
                                changes: changes,
                                range: EditorSelection.range(newl, newr)
                            }
                        }));
                        
                        codemirror.update([trans]);
                        codemirror.focus();
                    }
                },
                {
                    name: '无序列表',
                    icon: defaultIcons['listul'],
                    func: (codemirror: EditorView) => {
                        const state = codemirror.state;

                        const trans = state.update(state.changeByRange( range => {
                            const line1 = state.doc.lineAt(range.from).number;
                            const line2 = state.doc.lineAt(  range.to).number;

                            const changes: ChangeSpec[] = [];

                            let newl = 0, newr = state.doc.line(line1).from;

                            for(let i = line1;i <= line2;i ++){
                                const line = state.doc.line(i);
                                const head = '- ';
                                
                                changes.push({
                                    from: line.from,
                                    insert: head
                                });
                                if(i === line1){
                                    newl = line.from;
                                }
                                newr = newr + line.length + head.length + 1;
                            }
                            newr --;

                            return {
                                changes: changes,
                                range: EditorSelection.range(newl, newr)
                            }
                        }));
                        
                        codemirror.update([trans]);
                        codemirror.focus();
                    }
                },
                {
                    name: '有序列表',
                    icon: defaultIcons['listol'],
                    func: (codemirror: EditorView) => {
                        const state = codemirror.state;

                        const trans = state.update(state.changeByRange( range => {
                            const line1 = state.doc.lineAt(range.from).number;
                            const line2 = state.doc.lineAt(  range.to).number;

                            const changes: ChangeSpec[] = [];

                            let newl = 0, newr = state.doc.line(line1).from;

                            for(let i = line1;i <= line2;i ++){
                                const line = state.doc.line(i);
                                const head = '1. ';
                                
                                changes.push({
                                    from: line.from,
                                    insert: head
                                });
                                if(i === line1){
                                    newl = line.from;
                                }
                                newr = newr + line.length + head.length + 1;
                            }
                            newr --;

                            return {
                                changes: changes,
                                range: EditorSelection.range(newl, newr)
                            }
                        }));
                        
                        codemirror.update([trans]);
                        codemirror.focus();
                    }
                },
                {
                    name: '任务列表',
                    icon: defaultIcons['listtask'],
                    func: (codemirror: EditorView) => {
                        const state = codemirror.state;

                        const trans = state.update(state.changeByRange( range => {
                            const line1 = state.doc.lineAt(range.from).number;
                            const line2 = state.doc.lineAt(  range.to).number;

                            const changes: ChangeSpec[] = [];

                            let newl = 0, newr = state.doc.line(line1).from;

                            for(let i = line1;i <= line2;i ++){
                                const line = state.doc.line(i);
                                const head = '- [ ] ';
                                
                                changes.push({
                                    from: line.from,
                                    insert: head
                                });
                                if(i === line1){
                                    newl = line.from;
                                }
                                newr = newr + line.length + head.length + 1;
                            }
                            newr --;

                            return {
                                changes: changes,
                                range: EditorSelection.range(newl, newr)
                            }
                        }));
                        
                        codemirror.update([trans]);
                        codemirror.focus();
                    }
                },
            ]
        }
    ]
}

export function defaultToolbarR(): Toolbar {
    return [
        {
            name: '调整',
            tool: [
                {
                    name: '仅编辑',
                    icon: defaultIcons['editor'],
                    func: (codemirror: EditorView, starcasket: CasketView, dialog: DialogFunction) => {
                        if(starcasket.showViewer){
                            starcasket.showEditor = true;
                            starcasket.showViewer = false;
                        } else {
                            starcasket.showViewer = true;
                        }
                    }
                },
                {
                    name: '仅预览',
                    icon: defaultIcons['viewer'],
                    func: (codemirror: EditorView, starcasket: CasketView, dialog: DialogFunction) => {
                        if(starcasket.showEditor){
                            starcasket.showViewer = true;
                            starcasket.showEditor = false;
                        } else {
                            starcasket.showEditor = true;
                        }
                    }
                },
                {
                    name: '全屏',
                    icon: defaultIcons['expand'],
                    func: (codemirror: EditorView, starcasket: CasketView, dialog: DialogFunction) => {
                        starcasket.fullScreen = !starcasket.fullScreen;
                    }
                },
            ]
        },
        {
            name: '关于',
            tool: [
                {
                    name: '帮助',
                    icon: defaultIcons['help'],
                    func: (codemirror: EditorView) => {
                        
                    }
                },
            ]
        },
    ]
}