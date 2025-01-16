import { Meta, StoryObj, applicationConfig, moduleMetadata } from '@storybook/angular';
import { FormGroupComponent } from '../../lib/components/form/form-group/form-group.component';
import { NzFormModule, NzLabelAlignType } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormItem } from '../../lib/components/edit/';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

const meta: Meta<FormGroupComponent> = {
  title: 'Form/FormGroup',
  component: FormGroupComponent,
  tags: ['autodocs'],
  argTypes: {
    nzLayout: {
      control: 'select',
      options: ['horizontal', 'vertical', 'inline'],
      description: 'Form layout mode',
    },
    nzLabelAlign: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Label text align',
    },
    nzNoColon: {
      control: 'boolean',
      description: 'Whether to show colon after label',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, FormsModule, NzFormModule, NzInputModule, NzRadioModule, NzSwitchModule],
    }),
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule)],
    }),
  ],
};

export default meta;

type Story = StoryObj<FormGroupComponent>;

const defaultItems: FormItem[] = [
  {
    name: 'username',
    type: 'input',
    params: {
      nzAddOnBefore: '',
      nzAddOnAfter: '',
    },
    label: {
      label: 'Username',
      tooltip: 'Your login name',
      help: 'Must be unique',
    },
    placeholder: 'Enter your username',
    required: true,
    validates: ['required', 'minLength'],
    validatesArgs: {
      minLength: [8],
    },
    control: {
      hasFeedback: true,
      errorTip: 'Username is required',
      successTip: 'Looks good!',
    },
    itemSpan: 24,
    span: 12,
  },
  {
    name: 'email',
    type: 'input',
    params: {
      nzAddOnBefore: '',
      nzAddOnAfter: '',
    },
    label: {
      label: 'Email',
      tooltip: 'Your email address',
      help: 'We will send verification email',
    },
    placeholder: 'Enter your email',
    required: true,
    validates: ['regexp'],
    validatesArgs: {
      regexp: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/],
    },
    control: {
      hasFeedback: true,
      errorTip: 'Invalid email format',
      successTip: 'Valid email',
    },
    itemSpan: 24,
    span: 12,
  },
];

export const Interactive: Story = {
  args: {
    items: defaultItems,
    nzLayout: 'horizontal',
    nzLabelAlign: 'right',
    nzNoColon: false,
    nzLabelWrap: false,
  },
  render: (args) => ({
    props: {
      ...args,
      onLayoutChange: (layout: 'horizontal' | 'vertical' | 'inline') => (args.nzLayout = layout),
      onAlignChange: (align: NzLabelAlignType) => (args.nzLabelAlign = align),
    },
    template: `
      <div style="margin-bottom: 24px;">
        <label>Layout: </label>
        <nz-radio-group [(ngModel)]="nzLayout">
          <label nz-radio nzValue="horizontal">Horizontal</label>
          <label nz-radio nzValue="vertical">Vertical</label>
          <label nz-radio nzValue="inline">Inline</label>
        </nz-radio-group>

        <label style="margin-left: 24px;">Label Align: </label>
        <nz-radio-group [(ngModel)]="nzLabelAlign">
          <label nz-radio nzValue="left">Left</label>
          <label nz-radio nzValue="right">Right</label>
        </nz-radio-group>

        <label style="margin-left: 24px;">No Colon: </label>
        <nz-switch [(ngModel)]="nzNoColon"></nz-switch>

        <label style="margin-left: 24px;">Label Wrap: </label>
        <nz-switch [(ngModel)]="nzLabelWrap"></nz-switch>
      </div>

      <wn-form-group
        [items]="items"
        [nzLayout]="nzLayout"
        [nzLabelAlign]="nzLabelAlign"
        [nzNoColon]="nzNoColon"
        [nzLabelWrap]="nzLabelWrap"
      ></wn-form-group>
    `,
  }),
};
