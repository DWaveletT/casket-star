import { BlockParser, InlineParser, MarkdownConfig } from "@lezer/markdown";

import { Line } from "@lezer/markdown";

import {tags as t} from "@lezer/highlight";

function getMathDisplayL(line: Line) {
    if (line.next != 36 /* $ */ || line.text.charCodeAt(line.pos + 1) != 36) return -1;

    let pos = line.pos + 1;
    while (pos < line.text.length && line.text.charCodeAt(pos) == 36) pos++;
    let size = pos - line.pos, curSize = 0;

    for (; pos < line.text.length; pos ++) {
        if (line.text.charCodeAt(pos) == 36) {
            curSize ++;
            if (curSize == size && line.text.charCodeAt(pos + 1) != 36){
                return -1;
            }
        } else {
            curSize = 0;
        }
    }

    return size;
}

function getMathDisplayR(line: Line, size: number) {
    let pos = line.pos, curSize = 0;

    for (; pos < line.text.length; pos ++) {
        if (line.text.charCodeAt(pos) === 36) {
            curSize ++;
            if (curSize === size && line.text.charCodeAt(pos + 1) !== 36){
                return pos;
            }
        } else {
            curSize = 0;
        }
    }

    return -1;
}

export const LuoguMath: MarkdownConfig = {
    defineNodes: [
        {
            name: "MathInline",
            style: {"MathInline/...": t.lineComment}
        },
        {
            name: "MathInlineMark",
            style: t.lineComment
        },
        {
            name: "MathDisplay",
            style: {"MathDisplay/...": t.blockComment}
        },
        {
            name: "MathDisplayMark",
            style: t.blockComment
        },
    ],
    parseInline: [
        {
            name: "MathInline",
            parse(cx, next, start) {
                if (next != 36 /* $ */ || start && cx.char(start - 1) == 36) return -1;
                let pos = start + 1;
                while (pos < cx.end && cx.char(pos) == 36) pos++;
                let size = pos - start, curSize = 0;
                for (; pos < cx.end; pos++) {
                    if (cx.char(pos) == 36) {
                        curSize++
                        if (curSize == size && cx.char(pos + 1) != 36){
                            return cx.addElement(
                                cx.elt("MathInline", start, pos + 1, [
                                    cx.elt("MathInlineMark", start, start + size),
                                    cx.elt("MathInlineMark", pos + 1 - size, pos + 1)
                                ])
                            )
                        }
                    } else {
                        curSize = 0;
                    }
                }
                return -1;
            },
            before: "Emphasis"
        }
    ],
    parseBlock: [
        {
            name: "MathDisplay",
            parse(cx, line) {
                let size = getMathDisplayL(line);

                if(size === -1)
                    return false;
                
                let from = cx.lineStart + line.pos;
            
                for (let first = true; cx.nextLine() ; first = false) {

                    const end = getMathDisplayR(line, size);

                    if(end !== -1){
                        const to = cx.lineStart + end + 1;

                        cx.nextLine();

                        cx.addElement(cx.elt("MathDisplay", from, to, [
                            cx.elt("MathDisplayMark", from, from + size),
                            cx.elt("MathDisplayMark",   to - size,   to),
                        ]));
                        return true;
                    }
                }

                const to = cx.lineStart;
                
                cx.addElement(cx.elt("MathDisplay", from, to, [
                    cx.elt("MathDisplayMark", from, from + size),
                ]));
                return true;
            },
            before: "LinkReference"
        }
    ]
}
