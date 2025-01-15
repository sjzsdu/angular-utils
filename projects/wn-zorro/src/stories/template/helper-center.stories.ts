import { Meta, StoryObj } from '@storybook/angular';
import { HelpCenterComponent } from '../../lib/components/template/helper-center/help-center.component';

const meta: Meta<HelpCenterComponent> = {
  title: 'Components/HelpCenter',
  component: HelpCenterComponent,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: [undefined, 'button', 'text'],
      description: 'Display mode of the help center',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    text: {
      control: 'text',
      description: 'Help text content',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Help' },
      },
    },
    type: {
      control: 'select',
      options: ['primary', 'text', 'link'],
      description: 'Button type style',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
  },
  parameters: {
    controls: { expanded: true },
    docs: {
      description: {
        component: `
The HelpCenter component provides contextual help information in different display modes.

### Features:
- Multiple display modes: button, text, or default
- Customizable icon and tooltip
- Responsive design
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<HelpCenterComponent>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default help center with minimal configuration',
      },
    },
  },
};

export const ButtonMode: Story = {
  args: {
    mode: 'button',
    text: 'Click for help',
    type: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Help center displayed as a clickable button',
      },
    },
  },
};

export const TextMode: Story = {
  args: {
    mode: 'text',
    text: 'Hover for more information',
    type: 'text',
  },
  parameters: {
    docs: {
      description: {
        story: 'Help center displayed as inline text',
      },
    },
  },
};

export const CustomText: Story = {
  args: {
    mode: 'button',
    text: 'Custom help text',
    type: 'primary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Help center with custom text',
      },
    },
  },
};

const Template: Story = {
  render: (args) => ({
    props: args,
    template: `
      <wn-help-center
        [mode]="mode"
        [text]="text"
        [type]="type"
      ></wn-help-center>
    `,
  }),
};

export const Interactive = {
  ...Template,
  args: {
    mode: 'button',
    text: 'Interactive example',
    type: 'primary',
  },
  parameters: {
    controls: { expanded: true },
    docs: {
      description: {
        story: 'Interactive example with all controls',
      },
    },
  },
};
