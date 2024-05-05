import {h} from 'hastscript';
import {visit} from 'unist-util-visit';

import type { Nodes, ParagraphData, Root } from 'mdast';
import type { Directives } from 'mdast-util-directive';

export default function remarkCallouts(){

    return (tree: Root) => {
        visit(tree, (node: Nodes | Directives) => {
            if (
                node.type === 'containerDirective'
            ) {
                if(!['info', 'warning', 'error', 'success'].includes(node?.name))
                    return;

                let hClass = '.callout';
                if((node?.children[0]?.data as undefined | ParagraphData)?.directiveLabel){
                    hClass += '.has-headline';
                }

                hClass += '.' + node.name;

                const data = node.data || (node.data = {});

                data.hName = 'div';
                data.hProperties = h('div' + hClass, node.attributes || {}).properties;
            }
        })
    }
}