import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ComponentType } from '@angular/cdk/overlay';
import { DomPortal, TemplatePortal, ComponentPortal, Portal } from '@angular/cdk/portal';
import { newInjector } from '../../../helper';

export type ContentType<T> = ComponentType<T> | TemplateRef<T> | string;
@Component({
  standalone: false,
  selector: 'wn-list-wraper',
  templateUrl: './list-wraper.component.html',
  styleUrls: ['./list-wraper.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListWraperComponent implements AfterViewInit {
  reorderEnabled = false;
  @Input() rows: any[] = [];
  @Input() title = 'Add Item';
  @Input() content?: ContentType<any>;
  @Output() changed = new EventEmitter<any[]>();

  @ViewChild('templatePortalContent') templatePortalContent?: TemplateRef<unknown>;
  templatePortal?: TemplatePortal<any>;

  constructor(
    private cdr: ChangeDetectorRef,
    private injector: Injector,
    private vcr: ViewContainerRef
  ) {}

  ngAfterViewInit() {
    if (this.templatePortalContent) {
      this.templatePortal = new TemplatePortal(this.templatePortalContent, this.vcr);
    }
  }

  change() {
    this.changed.emit(this.rows);
  }

  isTemplateRef(content: any): content is TemplateRef<any> {
    return content.createEmbeddedView !== undefined;
  }

  isComponentType(content: any): content is ComponentType<any> {
    return content.prototype && content.prototype.constructor.name !== 'Object';
  }

  cached = new WeakMap();
  getPortal(row: any): Portal<any> {
    if (!this.content) {
      return this.templatePortal!;
    }
    let exist = this.cached.get(row);
    if (!exist) {
      exist = this._getPort(row);
      this.cached.set(row, exist);
    }
    return exist;
  }

  _getPort(row: any): Portal<any> {
    console.log(
      'getPortal',
      this.isTemplateRef(this.content),
      this.isComponentType(this.content),
      typeof this.content === 'string'
    );
    if (this.isTemplateRef(this.content)) {
      return new TemplatePortal(this.content, this.vcr, { $implicit: row });
    } else if (this.isComponentType(this.content)) {
      const injector = newInjector(this.injector);
      return new ComponentPortal(this.content, this.vcr, injector);
    } else if (typeof this.content === 'string') {
      const element = document.createElement('div');
      element.innerHTML = this.content;
      return new DomPortal(element);
    }
    return this.templatePortal!;
  }

  onDrop(event: CdkDragDrop<any[]>) {
    if (!this.rows) {
      return;
    }
    moveItemInArray(this.rows, event.previousIndex, event.currentIndex);
    this.change();
    this.cdr.markForCheck();
  }

  onAdd() {
    const newRow = {};
    this.rows.push(newRow);
    this.change();
    this.cdr.markForCheck();
  }

  onDel(item: any) {
    this.rows = this.rows.filter((sitem) => sitem !== item);
    this.change();
    this.cdr.markForCheck();
  }
}
