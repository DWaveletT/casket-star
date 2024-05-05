import {visit} from 'unist-util-visit';

import type { Nodes, Root } from 'mdast';
import type { Directives } from 'mdast-util-directive';

export default function remarkVideo(){

    return (tree: Root) => {
        visit(tree, (node: Nodes | Directives) => {
            if (
                node.type === 'leafDirective'
            ) {
                if(!['bilibili', 'youtube'].includes(node?.name))
                    return;

                const data = node.data || (node.data = {});
                const attributes = node.attributes || {};
                
                const av = attributes.id;
                const pg = attributes.p || '1';
                
                if(node.name === 'bilibili'){
                    data.hName = 'iframe';
                    data.hProperties = {
                        class: 'video',
                        src: `https://player.bilibili.com/player.html?aid=${av}&p=${pg}`,
                        scrolling: 'no',
                        border: 0,
                        frameborder: 'no',
                        framespacing: 0,
                        allowfullscreen: true
                    }
                }
            }
        })
    }
}

/*
<iframe src="//player.bilibili.com/player.html?aid=1053803882&bvid=BV1hH4y1P7NT&cid=1525203275&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

【中国地图随机旅行，用飞镖决定目的地，描边大师终于准了一次！】 【精准空降到 00:04】 https://www.bilibili.com/video/BV1hH4y1P7NT/?share_source=copy_web&vd_source=e3a28ece2cd868eba7745f6d2cc2a645&t=4

<iframe src="//player.bilibili.com/player.html?aid=1053803882&bvid=BV1hH4y1P7NT&cid=1525203275&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
*/