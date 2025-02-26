import { Meta, StoryObj } from '@storybook/angular';
import { ClickOutsideDirective } from '../../lib/directives/click-outside.directive';
import { Component } from '@angular/core';

@Component({
  selector: 'story-click-outside',
  template: `
    <div style="padding: 20px;">
      <div wnClickOutside (clickOutside)="onClickOutside($event)" style="border: 1px solid #ccc; padding: 20px;">
        <p>Click inside this box - nothing happens</p>
        <button class="excluded">Excluded Button</button>
      </div>
      <p style="margin-top: 20px;">Clicked outside element: {{ clickedElement?.tagName }}</p>
    </div>
  `,
})
class ClickOutsideStoryComponent {
  clickedElement: HTMLElement | null = null;

  onClickOutside(element: HTMLElement) {
    this.clickedElement = element;
  }
}

const meta: Meta<ClickOutsideStoryComponent> = {
  title: 'Directives/ClickOutside',
  component: ClickOutsideStoryComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ClickOutsideStoryComponent>;

export const Primary: Story = {
  args: {},
};
