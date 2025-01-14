import { Meta, StoryObj } from '@storybook/angular';
import { FrontendTableComponent } from '../../components/table/frontend-table/frontend-table.component';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzTableModule } from 'ng-zorro-antd/table';
import { PipesModule } from '../../pipes';
import { faker } from '@faker-js/faker';
import { IRow } from '../../components/table/type';

interface IData extends IRow {
  id: number;
  name: string;
  age: number;
  address: string;
}

const generateSampleData = (count: number): IData[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: faker.person.fullName(),
    age: faker.number.int({ min: 18, max: 80 }),
    address: faker.location.streetAddress(),
  }));
};

const meta: Meta<FrontendTableComponent<IData>> = {
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
  parameters: {
    docs: {
      description: {
        component: `
### FrontendTable Component Documentation

#### Basic Usage
\`\`\`html
<wn-frontend-table
  [nzData]="nzData"
  [columns]="columns"
></wn-frontend-table>
\`\`\`

#### Columns Configuration
\`\`\`typescript
interface IColumn {
  name: string; // Field name
  title: string; // Column header text
  type: 'text' | 'number' | 'date' | 'custom'; // Data type
  params?: Record<string, any>; // Type parameters
  sortFilter?: { // Sorting and filtering configuration
    sortOrder: SortOrder | null;
    sortFn: (a: any, b: any) => number;
    sortDirections: SortOrder[];
    filterFn: (list: any[], item: any) => boolean;
    listOfFilter: { text: string; value: any }[];
    filterMultiple: boolean;
  };
}
\`\`\`

#### Supported Features
- Pagination (\`nzShowPagination\`)
- Page size changer (\`nzShowSizeChanger\`)
- Row selection (\`showChecked\`)
- Sorting (\`sortFilter\`)
- Filtering (\`sortFilter\`)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<FrontendTableComponent<IData>>;

const sampleData: IData[] = generateSampleData(100);

// Keep source columns unchanged
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

// add column to the end of the columns array
const getUniqueValues = (data: IData[], key: keyof IData, count = 5) => {
  const values = [
    ...new Set(
      data.map((item) => {
        if (key === 'age') {
          return Math.floor(item[key] / 10) * 10;
        }
        return item[key].toString().split(' ')[0];
      })
    ),
  ];
  return values.slice(0, count).map((value) => ({ text: value, value }));
};

const columnsWithSortFilter = [
  {
    ...columns[0],
    sortFilter: {
      sortOrder: null,
      sortFn: (a: IData, b: IData) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend', null],
      filterFn: (list: string[], item: IData) => list.some((name) => item.name.includes(name)),
      listOfFilter: getUniqueValues(sampleData, 'name'),
      filterMultiple: true,
    },
  },
  {
    ...columns[1],
    sortFilter: {
      sortOrder: null,
      sortFn: (a: IData, b: IData) => a.age - b.age,
      sortDirections: ['ascend', 'descend', null],
      filterFn: (list: number[], item: IData) => list.some((age) => item.age >= age && item.age < age + 10),
      listOfFilter: getUniqueValues(sampleData, 'age'),
      filterMultiple: true,
    },
  },
  {
    ...columns[2],
    sortFilter: {
      sortOrder: null,
      sortFn: (a: IData, b: IData) => a.address.localeCompare(b.address),
      sortDirections: ['ascend', 'descend', null],
      filterFn: (list: string[], item: IData) => list.some((address) => item.address.includes(address)),
      listOfFilter: getUniqueValues(sampleData, 'address'),
      filterMultiple: true,
    },
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

export const Sorting: Story = {
  args: {
    nzData: sampleData,
    columns: columnsWithSortFilter,
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

export const Filtering: Story = {
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
