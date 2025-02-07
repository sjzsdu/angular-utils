export interface ActionItem {
  text?: string;
  icon?: string;
  click: (...args: any[]) => void;
}
