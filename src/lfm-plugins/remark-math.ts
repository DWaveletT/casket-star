import { mathFromMarkdown, mathToMarkdown, ToOptions } from 'mdast-util-math';
import { math } from '@lfe/micromark-extension-math';
import { Processor } from 'unified';

const emptyOptions: Readonly<ToOptions> = {};

export default function remarkMath(this: Processor, options?: null | ToOptions) {
    const settings = options || emptyOptions;
    const data = this.data() as Record<string, unknown[]>;

    const micromarkExtensions = data.micromarkExtensions || (data.micromarkExtensions = []);
    const fromMarkdownExtensions = data.fromMarkdownExtensions || (data.fromMarkdownExtensions = []);
    const toMarkdownExtensions = data.toMarkdownExtensions || (data.toMarkdownExtensions = []);

    micromarkExtensions.push(math(settings));
    fromMarkdownExtensions.push(mathFromMarkdown());
    toMarkdownExtensions.push(mathToMarkdown(settings));
}
