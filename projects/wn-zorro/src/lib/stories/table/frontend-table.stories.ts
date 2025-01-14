import { Meta, StoryObj } from '@storybook/angular';
import { FrontendTableComponent } from '../../components/table/frontend-table/frontend-table.component';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzTableModule } from 'ng-zorro-antd/table';
import { PipesModule } from '../../pipes';
import { faker } from '@faker-js/faker';

interface TableData {
  id: number;
  name: string;
  age: number;
  address: string;
}

const generateSampleData = (count: number): TableData[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: faker.person.fullName(),
    age: faker.number.int({ min: 18, max: 80 }),
    address: faker.location.streetAddress(),
  }));
};

const meta: Meta<FrontendTableComponent> = {
  title: 'Components/FrontendTable',
  component: FrontendTableComponent,
  decorators: [
    moduleMetadata({
      imports: [NzTableModule, PipesModule],
    }),
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule)],
    }),
  ],
};

export default meta;
type Story = StoryObj<FrontendTableComponent>;

const sampleData: TableData[] = generateSampleData(100);

const columns = [
  {
    name: 'name',
    title: 'Name',
    type: 'text' as const,
    params: {},
  },
  {
    name: 'age',
    title: 'Age',
    type: 'text' as const,
    params: {},
  },
  {
    name: 'address',
    title: 'Address',
    type: 'text' as const,
    params: {},
  },
];

export const Primary: Story = {
  args: {
    nzData: sampleData,
    columns: columns,
  },
  render: (args) => ({
    props: args,
    template: `
      <wn-frontend-table
        [nzData]="nzData"
        [columns]="columns"
      ></wn-frontend-table>
    `,
  }),
};

export const Checkable: Story = {
  args: {
    nzData: sampleData,
    columns: columns,
    showChecked: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <wn-frontend-table
        [nzData]="nzData"
        [columns]="columns"
        [showChecked]="showChecked"
      ></wn-frontend-table>
    `,
  }),
};

export const Pagination: Story = {
  args: {
    nzData: sampleData,
    columns: columns,
    nzShowPagination: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <wn-frontend-table
        [nzData]="nzData"
        [columns]="columns"
        [nzShowPagination]="nzShowPagination"
      ></wn-frontend-table>
    `,
  }),
};

export const SizeChanger: Story = {
  args: {
    nzData: sampleData,
    columns: columns,
    nzShowSizeChanger: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <wn-frontend-table
        [nzData]="nzData"
        [columns]="columns"
        [nzShowSizeChanger]="nzShowSizeChanger"
      ></wn-frontend-table>
    `,
  }),
};

export const AllFeatures: Story = {
  args: {
    nzData: sampleData,
    columns: columns,
    showChecked: true,
    nzShowPagination: true,
    nzShowSizeChanger: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <wn-frontend-table
        [nzData]="nzData"
        [columns]="columns"
        [showChecked]="showChecked"
        [nzShowPagination]="nzShowPagination"
        [nzShowSizeChanger]="nzShowSizeChanger"
      ></wn-frontend-table>
    `,
  }),
};
