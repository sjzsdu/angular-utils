import { Meta, StoryObj, applicationConfig, moduleMetadata } from '@storybook/angular';
import { NzFormModule, NzLabelAlignType } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { pickItems } from '../../helper';
import { userFormItems } from './const';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { FormItem, PipesModule, SearchFormComponent } from '../../public-api';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

const meta: Meta<SearchFormComponent> = {
  title: 'Form/SearchForm',
  component: SearchFormComponent,
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
        PipesModule,
        NzCascaderModule,
        NzDatePickerModule,
      ],
    }),
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule)],
    }),
  ],
};

export default meta;

type Story = StoryObj<SearchFormComponent>;

export const Interactive: Story = {
  args: {
    items: pickItems<FormItem>(userFormItems, ['searchday', 'country', 'email', 'age', 'is_vip']),
  },
  render: (args) => ({
    props: {
      ...args,
    },
    template: `
      <wn-search-form
        [itemSpan]="6"
        [labelSpan]="8"
        [items]="items"
        [showSubmit]="true"
      ></wn-search-form>
    `,
  }),
};
