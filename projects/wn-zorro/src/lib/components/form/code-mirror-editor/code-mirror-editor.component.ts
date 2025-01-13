/* eslint-disable no-use-before-define */
import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { python } from '@codemirror/lang-python';
import { MirrorBaseComponent } from '../mirror-base';

@Component({
  selector: 'wn-code-mirror-editor',
  templateUrl: './code-mirror-editor.component.html',
  styleUrl: './code-mirror-editor.component.less',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodeMirrorEditorComponent),
      multi: true,
    },
  ],
})
export class CodeMirrorEditorComponent extends MirrorBaseComponent {
  @Input() override initCode = `# Write your python code here`;

  protected getLanguageExtension() {
    return python();
  }
}
