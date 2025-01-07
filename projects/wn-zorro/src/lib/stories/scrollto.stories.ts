import { Meta, StoryObj } from '@storybook/angular';
import { ScrollToDirective } from '../directives/scrollto.directive';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'story-scroll-to',
  imports: [ ScrollToDirective],
  template: `
    <div style="height: 100vh; display: flex; flex-direction: column;">
      <button style="margin: 10px;" (click)="scrollTo('target1')" >Scroll to Target 1</button>
      <button style="margin: 10px;" (click)="scrollTo('target2')">Scroll to Target 2</button>
      <button style="margin: 10px;" (click)="scrollTo()">Scroll to Target 2</button>

      <div style="overflow-y: auto; height: 300px; border: 1px solid #ccc; padding: 10px;">
        <div style="height: 500px;">
          <p>Scrollable content area</p>

          <div id="target1" style="background: blue; padding: 20px; margin: 20px 0;">
            Target 1
          </div>

          <div style="height: 300px;" appScrollTo #scrollToDirective="appScrollTo"></div>

          <div id="target2" style="background: green; padding: 20px; margin: 20px 0;">
            Target 2
          </div>
          <div style="height: 800px;"></div>
          <div id="target3" style="background: red; padding: 20px; margin: 20px 0;">
            Target 3
          </div>
        </div>
      </div>
    </div>
  `
})
class ScrollToStoryComponent {
  @ViewChild('scrollToDirective') scrollToDirective!: ScrollToDirective;

  scrollTo(target?: string) {
    this.scrollToDirective.scrollToTarget(target);
  }
}

const meta: Meta<ScrollToStoryComponent> = {
  title: 'Directives/ScrollTo',
  component: ScrollToStoryComponent,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<ScrollToStoryComponent>;

export const Primary: Story = {
  args: {}
};
