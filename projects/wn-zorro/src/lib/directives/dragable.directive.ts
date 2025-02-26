import { Directive, ElementRef, HostListener, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[wnDraggableModal]',
})
export class DraggableModalDirective {
  @Input('container') container?: string | HTMLElement;
  private dialogElement?: HTMLElement;
  private containerElement?: HTMLElement;
  private isDragging: boolean = false;
  private offsetX: number = 0;
  private offsetY: number = 0;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (typeof this.container === 'string') {
      this.containerElement = document.querySelector(this.container) as HTMLElement;
    } else if (this.container instanceof HTMLElement) {
      this.containerElement = this.container;
    } else {
      this.containerElement = document.documentElement; // 默认使用 document 作为限制区域
    }
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent): void {
    if (event.button !== 0) return;

    this.dialogElement = this.elementRef.nativeElement.closest('.ant-modal');
    const rect = this.dialogElement!.getBoundingClientRect();

    this.offsetX = event.clientX - rect.left;
    this.offsetY = event.clientY - rect.top;

    this.isDragging = true;

    this.renderer.setStyle(this.dialogElement, 'position', 'fixed');
    this.renderer.setStyle(this.dialogElement, 'top', `${rect.top}px`);
    this.renderer.setStyle(this.dialogElement, 'left', `${rect.left}px`);
    this.renderer.setStyle(this.dialogElement, 'margin', '0');
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMousemove(event: MouseEvent): void {
    if (!this.isDragging) return;

    const containerRect = this.containerElement!.getBoundingClientRect();
    const dialogRect = this.dialogElement!.getBoundingClientRect();

    let newLeft = event.clientX - this.offsetX;
    let newTop = event.clientY - this.offsetY;

    if (newLeft < containerRect.left) {
      newLeft = containerRect.left;
    } else if (newLeft + dialogRect.width > containerRect.right) {
      newLeft = containerRect.right - dialogRect.width;
    }

    if (newTop < containerRect.top) {
      newTop = containerRect.top;
    } else if (newTop + dialogRect.height > containerRect.bottom) {
      newTop = containerRect.bottom - dialogRect.height;
    }

    this.renderer.setStyle(this.dialogElement, 'left', `${newLeft}px`);
    this.renderer.setStyle(this.dialogElement, 'top', `${newTop}px`);
  }

  @HostListener('document:mouseup')
  onMouseup(): void {
    this.isDragging = false;
  }
}
