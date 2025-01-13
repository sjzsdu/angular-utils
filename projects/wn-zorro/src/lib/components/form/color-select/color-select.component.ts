import { ChangeDetectorRef, Component, OnInit, input } from '@angular/core';
import { BaseAccessorComponent } from '../base-accessor';
import { OptioinItem, OptItem } from '../types';

// Predefined list of colors
const Colors = ['#614161', '#c6b1ff', '#ca3e5d', '#0c24ff', '#b3b3b3', '#48d07e', '#f6a600', '#d9d9d9'];

/**
 * Adds a new color to the color list
 * @param color Color to add (in hexadecimal format)
 */
export function setColor(color: string) {
  color = color.toLowerCase();
  if (!Colors.includes(color) && /#[a-f0-9A-F]{6}/.test(color)) {
    Colors.push(color);
  }
}

/**
 * Gets an unused color from the given color list
 * @param colors List of already used colors
 * @returns An unused color, or a random color if all colors are used
 */
export function getColor(colors: string[]) {
  for (let i = 0; i < Colors.length; i++) {
    const color = Colors[i];
    if (colors.includes(color)) {
      continue;
    }
    return color;
  }
  return Colors[Math.floor(Math.random() * Colors.length)];
}

/**
 * Color Select Component
 * Allows users to select a color from a predefined list of colors
 */
@Component({
  standalone: false,
  selector: 'wn-color-select',
  templateUrl: './color-select.component.html',
  styleUrls: ['./color-select.component.less'],
})
export class ColorSelectComponent extends BaseAccessorComponent<string> implements OnInit {
  /** List of available color options */
  options = input<OptioinItem[]>(Colors);

  /** Whether to display colors as images */
  isImage = input<boolean>(false);

  /** List of already selected colors */
  selected = input<OptioinItem[]>();

  /** Size of the color block (in pixels) */
  size = input<number>(54);

  /** Whether to show the color value */
  showValue = input<boolean>(false);

  /** Internal list of options used for rendering */
  _options: OptItem[] = [];

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.initOptions();
    this.setInitValue();
  }

  /**
   * Initializes the internal options list
   */
  private initOptions() {
    if (this.options().length) {
      this._options = this.options().map((value: OptioinItem) =>
        typeof value === 'string' ? { value, label: value } : value
      );
    } else {
      this._options = Colors.map((value) => ({ value, label: value }));
    }
  }

  /**
   * Initializes the component value based on initValue input
   */
  private setInitValue() {
    if (!this.innerValue) {
      const _options = this.selected()
        ? this._options.filter((opt) => !this.selected()?.includes(opt.value))
        : this._options;
      let val = _options[0].value;
      const opt = _options.find((item) => item.value === val);
      if (opt) {
        this.onClick(opt);
      }
    }
  }

  /**
   * Handles color click event
   * @param color The clicked color option
   */
  onClick(color: OptItem) {
    this.doChange(color.value);
  }

  /**
   * Performs color change operation with a delay
   * @param color The new color value
   */
  doChange(color: string) {
    this.change(color);
    this.cdr.detectChanges();
  }
}
