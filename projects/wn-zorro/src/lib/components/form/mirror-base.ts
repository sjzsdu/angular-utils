/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  Output,
  ViewChild,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { EditorState } from '@codemirror/state';
import { KeyBinding, keymap } from '@codemirror/view';
import { basicSetup, EditorView } from 'codemirror';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { BaseAccessorComponent } from './base-accessor';

@Component({
  template: '',
})
export abstract class MirrorBaseComponent
  extends BaseAccessorComponent<string>
  implements AfterViewInit, OnDestroy, OnInit
{
  @ViewChild('editor') editorElement!: ElementRef<HTMLDivElement>;
  editorView!: EditorView;
  @Output() execute = new EventEmitter<EditorView>();
  @Output() mode = new EventEmitter<EditorView>();
  @Input() minHeight = '0px';
  @Input() initCode = '';
  data: any;

  ctrlEnterBinding: KeyBinding;
  shiftEnterBinding: KeyBinding;
  escMBinding: KeyBinding;
  cmdEnterBinding: KeyBinding;

  constructor(injector: Injector) {
    super();
    this.data = injector.get(NZ_MODAL_DATA, null);
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
    if (this.data?.initCode) {
      this.initCode = this.data?.initCode;
    }
    if (!this.innerValue) {
      this.innerValue = this.initCode;
    }
  }

  override writeValue(value: string): void {
    this.innerValue = value || this.initCode;
  }

  ngAfterViewInit(): void {
    const state = EditorState.create({
      doc: this.innerValue,
      extensions: [
        basicSetup,
        this.getLanguageExtension(),
        keymap.of([this.ctrlEnterBinding, this.shiftEnterBinding, this.cmdEnterBinding, this.escMBinding]),
        EditorView.updateListener.of((update: any) => {
          if (update.docChanged) {
            this.innerValue = update.state.doc.toString();
            this.doChange();
          }
        }),
        EditorView.theme({
          '&': { 'min-height': this.minHeight, width: '100%', border: '1px solid lightgray' },
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
    this.change(this.innerValue!);
  }
}
