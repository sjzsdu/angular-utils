import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { EditorState } from '@codemirror/state';
import { KeyBinding, keymap } from '@codemirror/view';
import { basicSetup, EditorView } from 'codemirror';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { BaseAccessorComponent } from './base-accessor';

@Component({
  standalone: true,
  template: '',
})
export abstract class MirrorBaseComponent
  extends BaseAccessorComponent<string>
  implements AfterViewInit, OnDestroy, OnInit
{
  @ViewChild('editor') editorElement!: ElementRef<HTMLDivElement>;
  editorView!: EditorView;

  execute = output<EditorView>();
  mode = output<EditorView>();

  minHeight = input('0px');
  initCode = input('');

  data = inject(NZ_MODAL_DATA, { optional: true });

  ctrlEnterBinding: KeyBinding;
  shiftEnterBinding: KeyBinding;
  escMBinding: KeyBinding;
  cmdEnterBinding: KeyBinding;

  constructor() {
    super();

    this.shiftEnterBinding = {
      key: 'Shift-Enter',
      run: (view: EditorView) => {
        this.triggerCustomEvent(view);
        return true;
      },
    };
    this.ctrlEnterBinding = {
      key: 'Ctrl-Enter',
      run: (view: EditorView) => {
        this.triggerCustomEvent(view);
        return true;
      },
    };
    this.escMBinding = {
      key: 'Ctrl-w',
      run: (view: EditorView) => {
        this.changeMode(view);
        return true;
      },
    };
    this.cmdEnterBinding = {
      key: 'Mod-Enter',
      run: (view: EditorView) => {
        this.triggerCustomEvent(view);
        return true;
      },
    };
  }

  ngOnInit(): void {
    if (!this.innerValue()) {
      this.innerValue.set(this.initCode());
    }
  }

  override writeValue(value: string): void {
    this.innerValue.set(value || this.initCode());
  }

  ngAfterViewInit(): void {
    const state = EditorState.create({
      doc: this.innerValue(),
      extensions: [
        basicSetup,
        this.getLanguageExtension(),
        keymap.of([this.ctrlEnterBinding, this.shiftEnterBinding, this.cmdEnterBinding, this.escMBinding]),
        EditorView.updateListener.of((update: any) => {
          if (update.docChanged) {
            this.innerValue.set(update.state.doc.toString());
            this.doChange();
          }
        }),
        EditorView.theme({
          '&': { 'min-height': this.minHeight(), width: '100%', border: '1px solid lightgray' },
          '.cm-editor': { height: 'auto' },
        }),
      ],
    });

    this.editorView = new EditorView({
      state,
      parent: this.editorElement.nativeElement,
    });
    const shiftEnterBinding = state.facet(keymap)[1][37];
    if (shiftEnterBinding) {
      shiftEnterBinding.shift = (view: EditorView) => {
        return false;
      };
    }
  }

  ngOnDestroy(): void {
    this.editorView.destroy();
  }

  protected abstract getLanguageExtension(): any;

  triggerCustomEvent(view: EditorView) {
    this.execute.emit(view);
  }

  protected changeMode(view: EditorView) {
    this.mode.emit(view);
  }

  protected doChange() {
    this.change(this.innerValue()!);
  }
}
