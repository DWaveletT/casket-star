
import remarkGfm from 'remark-gfm';

import { CasketView, Plugins, Uploader } from './CasketStar.vue';
import { Toolbar } from './components/MToolbar.vue';

import type { Processor } from "unified";

import enUS from '~/lang/en_US.json';
import zhCN from '~/lang/zh_CN.json';
export { enUS, zhCN };

export type CasketI18nData = Record<string, string | undefined>;
export type CasketI18n = (key: string) => string;

export let i18n: CasketI18n = () => '';

export function initI18n(data: CasketI18nData[] | CasketI18nData){

    const mergedData = (() => {
        if(!Array.isArray(data))
            return Object.assign({}, enUS, data);
        else 
            return Object.assign({}, enUS, ...data);
    })();

    i18n = (key: string) => mergedData[key] || key;
}

export function remarkNoHtml(this: Processor) {

    const data = this.data();
  
    const micromarkExtensions = data.micromarkExtensions || (data.micromarkExtensions = []);

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
        ],

        toolbarL: getDefaultToolbarL(),
        toolbarR: getDefaultToolbarR(),
    };
}

export interface AutoSaveItem {
    time: number,
    content: string
}

export function loadStorage(){
    console.log('Load Storage');
    return JSON.parse(localStorage.getItem('casket-auto-save') || '[]') as AutoSaveItem[];
}

export function saveStorage(item: AutoSaveItem, maxlen: number){
    console.log('Save Storage');
    const items = loadStorage();
    if(items.length === maxlen){
        items.shift();
    }
    if(items.length > 0 && items[items.length - 1].content !== item.content){
        items.push(item);
        localStorage.setItem('casket-auto-save', JSON.stringify(items));
    }
}

import { EditorView } from '@codemirror/view';
import { ChangeSpec, EditorSelection } from '@codemirror/state';
import { defaultIcons } from './icons';

import DCode from './components/tool/ToolCode.vue';
import DImage from './components/tool/ToolImage.vue';
import DSave from './components/tool/AutoSave.vue';
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

            for(let i = line1; i <= line2; i ++){
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
                
                const levels = [0, 6, 5, 4, 3, 2, 1];
                const levelOld = count2 - count1;
                const nowLevel = levels.indexOf(levelOld) === -1 ? 0 : levels.indexOf(levelOld);
                const levelNew = levels[nowLevel + 1 > 6 ? 6 : nowLevel + 1];

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
            };
        }));
        
        codemirror.update([trans]);
        codemirror.focus();
    }
};

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

            for(let i = line1; i <= line2; i ++){
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
                
                const levels = [0, 6, 5, 4, 3, 2, 1];
                const levelOld = count2 - count1;
                const nowLevel = levels.indexOf(levelOld) === -1 ? 0 : levels.indexOf(levelOld);
                const levelNew = levels[nowLevel - 1 < 0 ? 0 : nowLevel - 1];

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
            };
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
            };
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
            };
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
            };
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
            };
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
                };
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

export const ToolImage: Tool = {
    name: 'image',
    icon: defaultIcons['image'],
    func: (codemirror: EditorView, casketstar: CasketView, container: HTMLDivElement) => {
        
        function insertImage(url: string, alt: string){
            const state = codemirror.state;
            const trans = state.update(state.changeByRange( range => {
                const text = `![${alt}](${url})`;
                return {
                    changes: [
                        { from: range.from, to: range.to},
                        { from: range.from, insert: text},
                    ],
                    range: EditorSelection.range(range.from + text.length, range.from + text.length)
                };
            }));
            
            codemirror.update([trans]);
            codemirror.focus();
        }
        
        const dialog = createVNode(
            DImage, {
                confirm: insertImage,
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
                };
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

                for(let i = 0; i < row; i ++){
                    for(let j = 0; j < col; j ++){
                        text += '|' + table[i][j];
                    }
                    text += '|\n';

                    if(i === 0){
                        for(let j = 0; j < col; j ++)
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
                };
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

            for(let i = line1; i <= line2; i ++){
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
            };
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

            for(let i = line1; i <= line2; i ++){
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
            };
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

            for(let i = line1; i <= line2; i ++){
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
            };
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

            for(let i = line1; i <= line2; i ++){
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
            };
        }));
        
        codemirror.update([trans]);
        codemirror.focus();
    }
};

export const ToolOnlyEdit: Tool = {
    name: 'only-editor',
    icon: defaultIcons['editor'],
    active: (codemirror: EditorView, casketstar: CasketView) => !casketstar.showViewer,
    func: (codemirror: EditorView, casketstar: CasketView) => {
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
    active: (codemirror: EditorView, casketstar: CasketView) => !casketstar.showEditor,
    func: (codemirror: EditorView, casketstar: CasketView) => {
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
    active: (codemirror: EditorView, casketstar: CasketView) => casketstar.fullScreen,
    func: (codemirror: EditorView, casketstar: CasketView) => {
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

export const ToolMath: Tool = {
    name: 'math',
    icon: defaultIcons['math'],
    func: (codemirror: EditorView) => {
        const state = codemirror.state;

        const trans = state.update(state.changeByRange( range => {
            return {
                changes: [
                    { from: range.from, insert: ' $'},
                    { from:   range.to, insert: '$ '},
                ],
                range: EditorSelection.range(range.from + 2, range.to + 2)
            };
        }));
        
        codemirror.update([trans]);
        codemirror.focus();
    }
};

export const AutoSave: Tool = {
    name: 'auto-save',
    icon: defaultIcons['autosave'],
    func: (codemirror: EditorView, casketstar: CasketView, container: HTMLDivElement) => {
        
        function loadHistory(content: string){
            const state = codemirror.state;
            const trans = state.update({ changes: [{ from: 0, to: state.doc.length, insert: content }] });
            codemirror.update([trans]);
            codemirror.focus();
        }
        
        const dialog = createVNode(
            DSave, {
                confirm: loadHistory,
                container: container
            }
        );

        render(dialog, container);
    }
};

export const ToolGroupTitle: ToolGroup = [ ToolIncrease, ToolDecrease, ToolHorizontal ];

export const ToolGroupInline: ToolGroup = [ ToolBold, ToolItalic, ToolStrikethrough, ToolMath ];

export const ToolGroupInterline: ToolGroup = [ ToolLink, ToolImage, ToolCode, ToolTable ];

export const ToolGroupBlock: ToolGroup = [ ToolQuote, ToolUList, ToolOList, ToolTaskList ];

export const ToolGroupCasket: ToolGroup = [ ToolOnlyEdit, ToolOnlyView, ToolFullScreen ];

export const ToolGroupHelp: ToolGroup = [ ToolHelp, AutoSave ];

export function getDefaultToolbarL(): Toolbar {
    return [
        ToolGroupTitle, ToolGroupInline, ToolGroupInterline, ToolGroupBlock
    ];
}

export function getDefaultToolbarR(): Toolbar {
    return [
        ToolGroupCasket, ToolGroupHelp
    ];
}