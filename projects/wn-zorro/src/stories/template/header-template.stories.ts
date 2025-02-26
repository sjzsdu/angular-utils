import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { importProvidersFrom, TemplateRef } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderTemplateComponent } from '../../lib/components/template/header-template/header-template.component';
import { TemplateService } from '../../lib/components/template/template.service';
import { ModalHeader, TemplateCategory } from '../../types/template';

const meta: Meta<HeaderTemplateComponent> = {
  title: 'Components/HeaderTemplate',
  component: HeaderTemplateComponent,
  decorators: [
    moduleMetadata({
      imports: [],
      providers: [TemplateService],
      declarations: [HeaderTemplateComponent],
    }),
    applicationConfig({
      providers: [importProvidersFrom(BrowserAnimationsModule), TemplateService],
    }),
  ],
};

export default meta;
type Story = StoryObj<HeaderTemplateComponent>;

export const Primary: Story = {
  args: {},
  argTypes: {},
  render: (args) => {
    const templateService = new TemplateService();

    return {
      props: {
        headerTemplate: null as TemplateRef<any> | string | null,
        addHeader: async function () {
          const newHeader = {
            templateKey: 'New Header',
            pathKey: 'new/path',
            noTemp: false,
            key: 'new-header',
          };
          this['headerTemplate'] = await templateService.templatePromise({
            category: TemplateCategory.HEADER,
            data: newHeader as ModalHeader,
          });
        },
      },
      template: `
        <wn-templates-index></wn-templates-index>
        <div style="margin-top: 20px">
          <button nz-button (click)="addHeader()">Add Header</button>
        </div>
        <div>Below is a header template</div>
        @if (headerTemplate) {
          @if (typeof headerTemplate === 'string') {
            <div>{{ headerTemplate }}</div>
          } @else {
            <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
          }
        }
      `,
    };
  },
};
