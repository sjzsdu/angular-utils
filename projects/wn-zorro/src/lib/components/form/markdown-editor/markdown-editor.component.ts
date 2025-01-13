import { Component, computed, effect, inject, input, model, OnInit, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from 'codemirror';
import { MirrorBaseComponent } from '../mirror-base';
import { MarkdownService } from './markdown.service';

@Component({
  selector: 'wn-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MarkdownEditorComponent,
      multi: true,
    },
  ],
  standalone: true,
})
export class MarkdownEditorComponent extends MirrorBaseComponent implements OnInit {
  initCode = input(`# Write your markdown here`);
  inEdit = model(true);

  private markdownService = inject(MarkdownService);

  markdownContent = signal('');
  innerValue = signal('');

  constructor() {
    super(inject(Injector));

    effect(() => {
      if (this.data() && typeof this.data().inEdit !== 'undefined') {
        this.inEdit.set(this.data().inEdit);
      }
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    if (!this.inEdit()) {
      this.setViewData();
    }
  }

  protected override getLanguageExtension() {
    return markdown();
  }

  override triggerCustomEvent(view: EditorView) {
    this.execute.emit(view);
    this.inEdit.update((value) => !value);
    this.setViewData();
  }

  async setViewData() {
    this.markdownContent.set(this.markdownService.convert(this.innerValue() ?? ''));
  }

  previewClick() {
    this.inEdit.update((value) => !value);
  }

  // 实现 ControlValueAccessor 接口
  writeValue(value: string): void {
    this.innerValue.set(value || '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // 实现禁用状态的逻辑
  }
}
