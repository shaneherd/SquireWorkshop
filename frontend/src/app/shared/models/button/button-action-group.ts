import {ButtonAction} from './button-action';

export class ButtonActionGroup {
  label: string;
  disabled = false;
  icon = '';
  actions: ButtonAction[] = [];

  constructor(label: string, disabled = false, icon = '', actions: ButtonAction[] = []) {
    this.label = label;
    this.disabled = disabled;
    this.icon = icon;
    this.actions = actions;
  }
}
