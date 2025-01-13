// markdown.service.ts
import { Injectable } from '@angular/core';
import MarkdownIt from 'markdown-it';
import markdownItHighlightjs from 'markdown-it-highlightjs';

@Injectable({
    providedIn: 'root',
})
export class MarkdownService {
    private md: MarkdownIt;

    constructor() {
        this.md = new MarkdownIt().use(markdownItHighlightjs);
    }

    convert(markdown: string): string {
        return this.md.render(markdown);
    }
}
