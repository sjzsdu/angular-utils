/* eslint-disable no-use-before-define */
import { Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from 'codemirror';
import { MirrorBaseComponent } from '../mirror-base';
import { MarkdownService } from './markdown.service';

@Component({
  standalone: false,
  selector: 'wn-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MarkdownEditorComponent),
      multi: true,
    },
  ],
})
export class MarkdownEditorComponent extends MirrorBaseComponent implements OnInit {
  @Input() override initCode = `# Write your markdown here`;
  @Input() inEdit = true;
  markdownContent = '';

  constructor(
    injector: Injector,
    private markdownService: MarkdownService
  ) {
    super(injector);
  }
  override ngOnInit(): void {
    if (typeof this.data?.inEdit !== 'undefined') {
      this.inEdit = this.data?.inEdit;
    }
    super.ngOnInit();
    if (!this.inEdit) {
      this.setViewData();
    }
  }

  protected getLanguageExtension() {
    return markdown();
  }

  override triggerCustomEvent(view: EditorView) {
    this.execute.emit(view);
    this.inEdit = !this.inEdit;
    this.setViewData();
  }

  async setViewData() {
    this.markdownContent = this.markdownService.convert(this.innerValue ?? '');
  }

  previewClick() {
    this.inEdit = !this.inEdit;
  }
}
