import { Meta, StoryObj, applicationConfig, moduleMetadata } from '@storybook/angular';
import { FormGroupComponent } from '../../lib/components/form/form-group/form-group.component';
import { NzFormModule, NzLabelAlignType } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormController, FormItem } from '../../types/form';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { pickItems } from '../../helper';
import { userFormItems } from './const';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

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
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NzFormModule,
        NzInputModule,
        NzRadioModule,
        NzSwitchModule,
        NzLayoutModule,
      ],
    }),
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule)],
    }),
  ],
};

export default meta;

type Story = StoryObj<FormGroupComponent>;

export const Interactive: Story = {
  args: {
    items: pickItems<FormItem>(userFormItems, []),
    layout: 'vertical',
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
        <nz-radio-group [(ngModel)]="layout">
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
        [layout]="layout"
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

export const HideControl: Story = {
  args: {
    items: pickItems<FormItem>(userFormItems, ['gender', 'male_item', 'female_item']),
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

export const DisabledControl: Story = {
  args: {
    items: pickItems<FormItem>(userFormItems, ['gender', 'male_item', 'female_item']),
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
      field: 'gender',
      columns: ['email'],
    },
  ],
};

export const ResetControl: Story = {
  args: {
    items: pickItems<FormItem>(userFormItems, ['gender', 'email']),
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
