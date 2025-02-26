import { Directive, ElementRef, input, effect, computed } from '@angular/core';

@Directive({
  selector: '[wnFlexJustify]',
  standalone: true,
  exportAs: 'wnFlexJustify',
})
export class FlexJustifyDirective {
  fcLeft = input<number | undefined>(undefined);
  fcRight = input<number | undefined>(undefined);

  private leftCount = computed(() => {
    return this.fcLeft() ?? 0;
  });

  private rightCount = computed(() => {
    return this.fcRight() ?? 0;
  });

  constructor(private el: ElementRef) {
    effect(() => {
      this.applyStyles();
    });
  }

  private applyStyles() {
    const element = this.el.nativeElement;
    const children = Array.from(element.children) as HTMLElement[];
    const totalCount = children.length;
    const originalHeight = element.offsetHeight;

    element.querySelectorAll('.fc-flex-justify-spacer').forEach((spacer: Element) => spacer.remove());

    element.style.display = 'flex';
    element.style.alignItems = 'center';
    element.style.width = '100%';
    element.style.height = originalHeight + 'px';

    let leftCount = this.leftCount();
    let rightCount = this.rightCount();

    if (leftCount === 0 && rightCount === 0) {
      leftCount = totalCount;
    } else if (leftCount === 0) {
      leftCount = totalCount - rightCount;
    } else if (rightCount === 0) {
      rightCount = totalCount - leftCount;
    }

    const middleCount = totalCount - leftCount - rightCount;

    const groups = [];
    if (leftCount > 0) {
      groups.push(leftCount);
    }
    if (middleCount > 0) {
      groups.push(middleCount);
    }
    if (rightCount > 0) {
      groups.push(rightCount);
    }

    let currentIndex = 0;
    groups.forEach((groupSize, groupIndex) => {
      if (groupIndex > 0) {
        const spacer = document.createElement('div');
        spacer.className = 'fc-flex-justify-spacer';
        spacer.style.flex = '1';
        element.insertBefore(spacer, children[currentIndex]);
      }

      currentIndex += groupSize;
    });
  }
}
