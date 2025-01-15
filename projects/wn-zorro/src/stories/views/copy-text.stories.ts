import { Meta, StoryObj } from '@storybook/angular';
import { CopyTextComponent } from '../../lib/components/view/copy-text/copy-text.component';

const meta: Meta<CopyTextComponent> = {
  title: 'Components/CopyText',
  component: CopyTextComponent,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Text to be copied',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    copyTip: {
      control: 'text',
      description: 'Tooltip text for copy button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Copy' },
      },
    },
    copiedTip: {
      control: 'text',
      description: 'Tooltip text after successful copy',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Copied!' },
      },
    },
  },
  parameters: {
    controls: { expanded: true },
    docs: {
      description: {
        component: `
The CopyText component provides an easy way to copy text to the clipboard.

### Features:
- Displays text with a copy button
- Customizable tooltip messages
- Responsive design
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<CopyTextComponent>;

export const Default: Story = {
  args: {
    value: 'Sample text to copy',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default CopyText component with sample text',
      },
    },
  },
};

export const LongText: Story = {
  args: {
    value:
      "This is a much longer text that demonstrates how the CopyTextComponent handles larger amounts of content. It might wrap or truncate depending on the component's implementation.",
  },
  parameters: {
    docs: {
      description: {
        story: 'CopyText component with a long text to demonstrate text wrapping or truncation',
      },
    },
  },
};

export const EmptyText: Story = {
  args: {
    value: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'CopyText component with no text to copy',
      },
    },
  },
};

export const CustomTooltips: Story = {
  args: {
    value: 'Text with custom tooltips',
    copyTip: 'Click to copy',
    copiedTip: 'Text copied to clipboard!',
  },
  parameters: {
    docs: {
      description: {
        story: 'CopyText component with custom tooltip messages',
      },
    },
  },
};

const Template: Story = {
  render: (args) => ({
    props: args,
    template: `
      <wn-copy-text
        [value]="value"
        [copyTip]="copyTip"
        [copiedTip]="copiedTip"
      ></wn-copy-text>
    `,
  }),
};

export const Interactive = {
  ...Template,
  args: {
    value: 'Interactive example',
    copyTip: 'Copy text',
    copiedTip: 'Copied!',
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
