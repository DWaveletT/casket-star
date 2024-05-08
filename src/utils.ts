

import remarkGfm from 'remark-gfm';

import { CasketView, Plugins } from './CasketStar.vue';
import { Toolbar } from './components/MToolbar.vue';

export function getDefaultPlugins(): Plugins {

    return {
        remark: [
            remarkGfm
        ],
        // rehype: [

        // ],
        // remarkRehypeOptions: {
            
        // },
        // codemirror: {
            
        // }
    }
}

import { EditorView } from '@codemirror/view';
import { ChangeSpec, EditorSelection } from '@codemirror/state';
import { defaultIcons } from './icons';

import DCode from './components/tool/ToolCode.vue';
import DPicture from './components/tool/ToolPicture.vue';
import DTable, { Node } from './components/tool/ToolTable.vue';
import DLink from './components/tool/ToolLink.vue';
import DBlock from './components/tool/ToolBlock.vue';
import DHelp from './components/tool/ToolHelp.vue';

import { Tool, ToolGroup } from './components/MToolbar.vue';
import { createVNode, render } from 'vue';

export const ToolIncrease: Tool = {
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
}

export const ToolDecrease: Tool = {
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
};

export const ToolHorizontal: Tool = {
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
};
export const ToolBold = {
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
};

export const ToolItalic = {
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
};

export const ToolStrikethrough = {
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
};

export const ToolLinkOrVideo: Tool = {
    name: '插入链接',
    icon: defaultIcons['link'],
    func: (codemirror: EditorView, casketstar: CasketView, container: HTMLDivElement) => {
        function insertLink(url: string, alt: string){
            const state = codemirror.state;
            const trans = state.update(state.changeByRange( range => {
                const text = `[${alt}](${url})`;
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

        const dialog = createVNode(
            DLink, {
                confirm: insertLink,
                container: container
            }
        );

        render(dialog, container);
    }
};

export const ToolPicture: Tool = {
    name: '插入图片',
    icon: defaultIcons['picture'],
    func: (codemirror: EditorView, casketstar: CasketView, container: HTMLDivElement) => {
        
        function insertPicture(url: string, alt: string){
            const state = codemirror.state;
            const trans = state.update(state.changeByRange( range => {
                const text = `![${alt}](${url})`;
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
        
        const dialog = createVNode(
            DPicture, {
                confirm: insertPicture,
                container: container
            }
        );

        render(dialog, container);
    }
};

export const ToolCode = {
    name: '插入代码',
    icon: defaultIcons['code'],
    func: (codemirror: EditorView, casketstar: CasketView, container: HTMLDivElement) => {
        
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
        
        const dialog = createVNode(
            DCode, {
                confirm: insertCode,
                container: container
            }
        );

        render(dialog, container);
    }
};

export const ToolTable: Tool = {
    name: '插入表格',
    icon: defaultIcons['table'],
    func: (codemirror: EditorView, casketstar: CasketView, container: HTMLDivElement) => {
        
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
        
        const dialog = createVNode(
            DTable, {
                confirm: insertTable,
                container: container
            }
        );

        render(dialog, container);
    }
};

export const ToolBlock: Tool = {
    name: '插入块体',
    icon: defaultIcons['block'],
    func: (codemirror: EditorView, casketstar: CasketView, container: HTMLDivElement) => {
        
        function insertBlock(type: string, title: string, code: string){
            const state = codemirror.state;
            const trans = state.update(state.changeByRange( range => {
                const text = `\n:::${type}${ title.trim().length >= 1 ? `[${title}]` : ''}\n${code}\n:::\n`;
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
        
        const dialog = createVNode(
            DBlock, {
                confirm: insertBlock,
                container: container
            }
        );

        render(dialog, container);
    }
};

export const ToolQuote: Tool = {
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
};

export const ToolUList: Tool = {
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
};

export const ToolOList: Tool = {
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
};

export const ToolTaskList = {
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
};

export const ToolOnlyEdit: Tool = {
    name: '仅编辑',
    icon: defaultIcons['editor'],
    func: (codemirror: EditorView, casketstar: CasketView, container: HTMLDivElement) => {
        if(casketstar.showViewer){
            casketstar.showEditor = true;
            casketstar.showViewer = false;
        } else {
            casketstar.showViewer = true;
        }
    }
};

export const ToolOnlyView: Tool = {
    name: '仅预览',
    icon: defaultIcons['viewer'],
    func: (codemirror: EditorView, casketstar: CasketView, container: HTMLDivElement) => {
        if(casketstar.showEditor){
            casketstar.showViewer = true;
            casketstar.showEditor = false;
        } else {
            casketstar.showEditor = true;
        }
    }
};

export const ToolFullScreen: Tool = {
    name: '全屏',
    icon: defaultIcons['expand'],
    func: (codemirror: EditorView, casketstar: CasketView, container: HTMLDivElement) => {
        casketstar.fullScreen = !casketstar.fullScreen;
    }
};

export const ToolHelp = {
    name: '帮助',
    icon: defaultIcons['help'],
    func: (codemirror: EditorView, casketstar: CasketView, container: HTMLDivElement) => {
        
        const dialog = createVNode(
            DHelp, {
                container: container
            }
        );

        render(dialog, container);
    }
};

export const ToolGroupTitle: ToolGroup = {
    name: '标题',
    tool: [ ToolIncrease, ToolDecrease, ToolHorizontal ]
};

export const ToolGroupInline: ToolGroup = {
    name: '行内',
    tool: [ ToolBold, ToolItalic, ToolStrikethrough ]
};

export const ToolGroupInterline: ToolGroup = {
    name: '行间',
    tool: [ ToolLinkOrVideo, ToolPicture, ToolCode, ToolTable, ToolBlock ]
};

export const ToolGroupBlock: ToolGroup = {
    name: '修饰',
    tool: [ ToolQuote, ToolUList, ToolOList, ToolTaskList ]
};

export const ToolGroupCasket: ToolGroup = {
    name: '块体',
    tool: [ ToolOnlyEdit, ToolOnlyView, ToolFullScreen ]
};

export const ToolGroupHelp: ToolGroup = {
    name: '帮助',
    tool: [ ToolHelp ]
};


export function defaultToolbarL(): Toolbar {
    return [
        ToolGroupTitle, ToolGroupInline, ToolGroupInterline, ToolGroupBlock
    ]
};

export function defaultToolbarR(): Toolbar {
    return [
        ToolGroupCasket, ToolGroupHelp
    ]
};