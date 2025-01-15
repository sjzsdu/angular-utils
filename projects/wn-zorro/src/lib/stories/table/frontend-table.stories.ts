import { Meta, StoryObj } from '@storybook/angular';
import { FrontendTableComponent } from '../../components/table/frontend-table/frontend-table.component';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzTableModule } from 'ng-zorro-antd/table';
import { PipesModule } from '../../pipes';
import { faker } from '@faker-js/faker';
import { IRow } from '../../components/table/type';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';

interface IData extends IRow {
  id: number;
  name: string;
  age: number;
  address: string;
  expandContent?: string;
}

const generateSampleData = (count: number): IData[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: faker.person.fullName(),
    age: faker.number.int({ min: 18, max: 80 }),
    address: faker.location.streetAddress(),
    expandContent: `Details for ${faker.person.fullName()}:
- Phone: ${faker.phone.number()}
- Email: ${faker.internet.email()}
- Company: ${faker.company.name()}
- Job: ${faker.person.jobTitle()}`,
  }));
};

const meta: Meta<FrontendTableComponent<IData>> = {
  title: 'Components/FrontendTable',
  component: FrontendTableComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [NzTableModule, PipesModule, NzRadioModule, FormsModule],
    }),
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule)],
    }),
  ],
  parameters: {
    docs: {
      autodocs: true,
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

export const BasicFeatures: Story = {
  args: {
    nzData: sampleData,
    columns: columns,
    nzTitle: 'Table Header',
    nzFooter: 'Table Footer',
    nzBordered: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <wn-frontend-table
        [nzData]="nzData"
        [columns]="columns"
        [nzTitle]="nzTitle"
        [nzFooter]="nzFooter"
        [nzBordered]="nzBordered"
      ></wn-frontend-table>
    `,
  }),
};

interface WithSizeProps {
  nzData: IData[];
  columns: Array<{
    name: string;
    title: string;
    type: 'text';
    params: Record<string, any>;
    sortFilter?: {
      sortOrder: 'ascend' | 'descend' | null;
      sortFn: (a: any, b: any) => number;
      sortDirections: Array<'ascend' | 'descend' | null>;
      filterFn: (list: any[], item: any) => boolean;
      listOfFilter: Array<{ text: string; value: any }>;
      filterMultiple: boolean;
    };
  }>;
  sizeOptions: Array<{ label: string; value: 'small' | 'middle' | 'default' }>;
  currentSize: 'small' | 'middle' | 'default';
  toggleSize: () => void;
  onSizeChange: (size: 'small' | 'middle' | 'default') => void;
}

export const WithSize: Story = {
  args: {
    nzData: sampleData,
    columns: columns,
  },
  render: (args) => ({
    props: {
      ...args,
      currentSize: 'small',
      sizeOptions: [
        { label: 'Small', value: 'small' },
        { label: 'Middle', value: 'middle' },
        { label: 'Default', value: 'default' },
      ],
      onSizeChange: function (size: 'small' | 'middle' | 'default') {
        console.log('onSizeChange', size);
        this['currentSize'] = size;
      },
    },
    template: `
      <div>
        <nz-radio-group
          [(ngModel)]="currentSize"
          (ngModelChange)="onSizeChange($event)"
          style="margin-bottom: 16px"
        >
          <label nz-radio *ngFor="let option of sizeOptions" [nzValue]="option.value">
            {{option.label}}
          </label>
        </nz-radio-group>
        <wn-frontend-table
          [nzData]="nzData"
          [columns]="columns"
          [nzSize]="currentSize"
          [nzBordered]="true"
        ></wn-frontend-table>
      </div>
    `,
  }),
};

export const Expandable: Story = {
  args: {
    nzData: sampleData,
    columns: columns,
    nzExpandable: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <wn-frontend-table
        [expandKey]="'expandContent'"
        [nzData]="nzData"
        [columns]="columns"
        [nzExpandable]="nzExpandable"
      ></wn-frontend-table>
    `,
  }),
};
