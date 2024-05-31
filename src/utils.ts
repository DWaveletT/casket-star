

import remarkGfm from 'remark-gfm';

import { CasketView, Plugins, Uploader } from './CasketStar.vue';
import { Toolbar } from './components/MToolbar.vue';

import type { Processor } from "unified";

export function remarkNoHtml(this: Processor) {
    
    const self = this
    const data = self.data()
  
    // @ts-ignore
    const micromarkExtensions = data.micromarkExtensions || (data.micromarkExtensions = [])

    micromarkExtensions.push({ disable: { null: ['htmlText', 'htmlFlow']}});
}

export function getDefaultPlugins(): Plugins {

    return {
        remark: [
            remarkGfm,
            remarkNoHtml
        ],
        rehype: [
            
        ],
        remarkRehypeOptions: {
            
        },
        codemirror: [
            markdown({
                base: markdownLanguage,
                extensions: [
                    { remove: ['HTMLBlock', 'HTMLTag'] }
                ],
                completeHTMLTags: false
            })
        ]
    }
}

import { EditorView } from '@codemirror/view';
import { ChangeSpec, EditorSelection } from '@codemirror/state';
import { defaultIcons } from './icons';

import DCode from './components/tool/ToolCode.vue';
import DPicture from './components/tool/ToolPicture.vue';
import DTable from './components/tool/ToolTable.vue';
import DLink from './components/tool/ToolLink.vue';
import DHelp from './components/tool/ToolHelp.vue';

import { Tool, ToolGroup } from './components/MToolbar.vue';
import { createVNode, render } from 'vue';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';

export { markdown, markdownLanguage, commonmarkLanguage } from '@codemirror/lang-markdown';

export const ToolIncrease: Tool = {
    name: 'increase-level',
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
    name: 'decrease-level',
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
    name: 'horizontal',
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

export const ToolBold: Tool = {
    name: 'bold',
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

export const ToolItalic: Tool = {
    name: 'italic',
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

export const ToolStrikethrough: Tool = {
    name: 'strikethrough',
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

export const ToolLink: Tool = {
    name: 'link',
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
    name: 'picture',
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
                upload: casketstar.data.upload as Uploader,
                container: container
            }
        );

        render(dialog, container);
    }
};

export const ToolCode: Tool = {
    name: 'code',
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
    name: 'table',
    icon: defaultIcons['table'],
    func: (codemirror: EditorView, casketstar: CasketView, container: HTMLDivElement) => {
        
        function insertTable(row: number, col: number, table: string[][]){
            const state = codemirror.state;
            const trans = state.update(state.changeByRange( range => {
                let text = "\n\n";

                for(let i = 0;i < row;i ++){
                    for(let j = 0;j < col;j ++){
                        text += '|' + table[i][j]
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

export const ToolQuote: Tool = {
    name: 'quote',
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
    name: 'unordered-list',
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
    name: 'ordered-list',
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

export const ToolTaskList: Tool = {
    name: 'task-list',
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
    name: 'only-editor',
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
    name: 'only-viewer',
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
    name: 'full-screen',
    icon: defaultIcons['expand'],
    func: (codemirror: EditorView, casketstar: CasketView, container: HTMLDivElement) => {
        casketstar.fullScreen = !casketstar.fullScreen;
    }
};

export const ToolHelp: Tool = {
    name: 'help',
    icon: defaultIcons['help'],
    func: (codemirror: EditorView, casketstar: CasketView, container: HTMLDivElement) => {
        
        const dialog = createVNode(
            DHelp, {
                container: container,
                confirm: () => {}
            }
        );

        render(dialog, container);
    }
};

export const ToolGroupTitle: ToolGroup = [ ToolIncrease, ToolDecrease, ToolHorizontal ];

export const ToolGroupInline: ToolGroup = [ ToolBold, ToolItalic, ToolStrikethrough ];

export const ToolGroupInterline: ToolGroup = [ ToolLink, ToolPicture, ToolCode, ToolTable ];

export const ToolGroupBlock: ToolGroup = [ ToolQuote, ToolUList, ToolOList, ToolTaskList ];

export const ToolGroupCasket: ToolGroup = [ ToolOnlyEdit, ToolOnlyView, ToolFullScreen ];

export const ToolGroupHelp: ToolGroup = [ ToolHelp ];


export function getDefaultToolbarL(): Toolbar {
    return [
        ToolGroupTitle, ToolGroupInline, ToolGroupInterline, ToolGroupBlock
    ]
};

export function getDefaultToolbarR(): Toolbar {
    return [
        ToolGroupCasket, ToolGroupHelp
    ]
};