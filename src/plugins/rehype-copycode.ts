import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'

import type { Element, Root } from 'hast';

import { h } from 'hastscript';

export type Build = () => Element;

interface Options {
    content?: string | Build
}

const emptyOptions: Options = {};

/**
 * Process headlines for my blog.
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function rehypeCopycode(options?: Options | undefined | null) {
    const settings = options || emptyOptions;

  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
    return function (tree: Root): undefined {
        const codeList: Element[] = [];

        visit(tree, 'element', function (node: Element, _, parent: Element | null | Root) {
            if ( node.tagName !== 'code' || parent?.type !== 'element' || parent?.tagName !== 'pre' )
                return;

            codeList.push(parent);
        });

        for(const code of codeList){
            const node = structuredClone(code);
            const data = toString(node);

            let count = 0;
            
            for(let i = 0; i < data.length;i ++)
                count += data[i] === '\n' ? 1 : 0;

            const line_number = h('div.line-number', Array.from({ length: count}, (_, i) => h('span.number', (i + 1).toString())));

            const container = h('div.code-container', [
                line_number,
                node,
                h(
                    'button.copy-button',
                    { onclick: 'dispatchEvent(new Event("codecopy", { bubbles: true, cancelable: true }))', data: data },
                    typeof settings.content === 'function' ? settings.content() : settings.content
                )
            ]);
            
            Object.assign(code, container);
        }
  }
}
