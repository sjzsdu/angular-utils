import { Meta, StoryObj, applicationConfig, moduleMetadata } from '@storybook/angular';
import { ModalFormComponent } from '../../lib/components/form/modal-form/modal-form.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormItem } from '../../types/form';
import { Component, importProvidersFrom, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { pickItems } from '../../helper';
import { userFormItems } from './const';

@Component({
  selector: 'storybook-modal-button',
  standalone: true,
  imports: [NzButtonModule],
  template: `<button nz-button nzType="primary" (click)="openModal()">Open Modal Form</button>`,
})
class ModalButtonComponent {
  @Input() items: FormItem[] = [];
  @Input() layout: 'horizontal' | 'vertical' | 'inline' = 'vertical';
  @Input() nzLabelAlign: 'left' | 'right' = 'right';
  @Input() nzNoColon = false;
  @Input() nzLabelWrap = false;

  constructor(private modalService: NzModalService) {}

  openModal() {
    this.modalService.create({
      nzTitle: 'Modal Form',
      nzContent: ModalFormComponent,
      nzData: {
        items: this.items,
        layout: this.layout,
        nzLabelAlign: this.nzLabelAlign,
        nzNoColon: this.nzNoColon,
        nzLabelWrap: this.nzLabelWrap,
        showSubmit: true,
      },
    });
  }
}

const meta: Meta<ModalFormComponent> = {
  title: 'Form/ModalForm',
  component: ModalFormComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, FormsModule, NzModalModule, NzButtonModule, ModalButtonComponent],
      providers: [NzModalService],
    }),
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule)],
    }),
  ],
};

export default meta;

type Story = StoryObj<ModalFormComponent>;

export const Interactive: Story = {
  args: {
    items: pickItems<FormItem>(userFormItems, []),
    layout: 'vertical',
    nzLabelAlign: 'right',
    nzNoColon: false,
    nzLabelWrap: false,
  },
  render: (args) => ({
    props: args,
    template:
      '<storybook-modal-button [items]="items" [layout]="layout" [nzLabelAlign]="nzLabelAlign" [nzNoColon]="nzNoColon" [nzLabelWrap]="nzLabelWrap"></storybook-modal-button>',
  }),
};
