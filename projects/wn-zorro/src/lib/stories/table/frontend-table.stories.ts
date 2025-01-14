import { Meta, StoryObj } from '@storybook/angular';
import { FrontendTableComponent } from '../../components/table/frontend-table/frontend-table.component';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzTableModule } from 'ng-zorro-antd/table';
import { PipesModule } from '../../pipes';

interface TableData {
  key: string;
  name: string;
  age: number;
  address: string;
}

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

const sampleData: TableData[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
];

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
