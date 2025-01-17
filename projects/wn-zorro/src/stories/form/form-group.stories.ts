import { Meta, StoryObj, applicationConfig, moduleMetadata } from '@storybook/angular';
import { FormGroupComponent } from '../../lib/components/form/form-group/form-group.component';
import { NzFormModule, NzLabelAlignType } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormController, FormItem } from '../../lib/components/edit/';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

const meta: Meta<FormGroupComponent> = {
  title: 'Form/FormGroup',
  component: FormGroupComponent,
  tags: ['autodocs'],
  argTypes: {
    layout: {
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
      nzAddOnBefore: 'User',
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
      minLength: [4],
    },
    control: {
      hasFeedback: true,
      errorTip: 'Username is required and must be at least 4 characters',
      successTip: 'Username is valid',
    },
  },
  {
    name: 'gender',
    type: 'radio',
    required: true,
    params: {
      options: ['male', 'female'],
    },
  },
  {
    name: 'male_item',
    type: 'input',
  },
  {
    name: 'female_item',
    type: 'input',
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
  },
  {
    name: 'age',
    type: 'number',
    params: {
      nzAddOnAfter: 'years',
    },
    label: {
      label: 'Age',
      tooltip: 'Your actual age',
    },
    placeholder: 'Enter your age',
    required: true,
    validates: ['required', 'min', 'max'],
    validatesArgs: {
      min: [0],
      max: [120],
    },
    control: {
      hasFeedback: true,
      errorTip: 'Age must be between 0 and 120',
    },
  },
];

export const Interactive: Story = {
  args: {
    items: defaultItems,
    layout: 'horizontal',
    nzLabelAlign: 'right',
    nzNoColon: false,
    nzLabelWrap: false,
  },
  render: (args) => ({
    props: {
      ...args,
      onLayoutChange: (layout: 'horizontal' | 'vertical' | 'inline') => (args.layout = layout),
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

const controlHide: FormController = {
  hides: [
    {
      field: 'gender',
      rules: [
        { value: 'male', columns: ['male_item'] },
        { value: 'female', columns: ['female_item'] },
      ],
    },
  ],
};

export const WithHide: Story = {
  args: {
    items: defaultItems,
    control: controlHide,
  },
  render: (args) => ({
    props: {
      ...args,
    },
    template: `
      <wn-form-group
        [items]="items"
        [control]="control"
      ></wn-form-group>
    `,
  }),
};

const controlDisabled: FormController = {
  disableds: [
    {
      field: 'gender',
      rules: [
        { value: 'male', columns: ['female_item'] },
        { value: 'female', columns: ['male_item'] },
      ],
    },
  ],
};

export const WithDisabled: Story = {
  args: {
    items: defaultItems,
    control: controlDisabled,
  },
  render: (args) => ({
    props: {
      ...args,
    },
    template: `
      <wn-form-group
        [items]="items"
        [control]="control"
      ></wn-form-group>
    `,
  }),
};

const controlReset: FormController = {
  resets: [
    {
      field: 'username',
      columns: ['email'],
    },
  ],
};

export const WithReset: Story = {
  args: {
    items: defaultItems,
    control: controlReset,
  },
  render: (args) => ({
    props: {
      ...args,
    },
    template: `
      <wn-form-group
        [items]="items"
        [control]="control"
      ></wn-form-group>
    `,
  }),
};
