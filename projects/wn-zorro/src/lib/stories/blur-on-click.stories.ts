import { Meta, StoryObj } from '@storybook/angular';
import { BlurOnClickDirective } from '../directives/blur-on-click.directive';
import { Component } from '@angular/core';

@Component({
  selector: 'story-blur-on-click',
  template: `
    <div style="padding: 20px;">
      <button appBlurOnClick style="padding: 10px 20px;">Click to Blur</button>
    </div>
  `,
})
class BlurOnClickStoryComponent {}

const meta: Meta<BlurOnClickStoryComponent> = {
  title: 'Directives/BlurOnClick',
  component: BlurOnClickStoryComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<BlurOnClickStoryComponent>;

export const Primary: Story = {
  args: {},
};
