export class ButtonAction {
  label: string;
  event: string;
  disabled = false;
  icon = '';
  selected = false;
  actionClick: () => void;
  validate: () => boolean;
  confirmationTitle = '';
  confirmationMessage = '';

  constructor(event: string, label: string, actionClick: () => void = null, disabled = false, confirmationTitle = '', confirmationMessage = '', validate: () => boolean = null, icon = '', selected = false) {
    this.event = event;
    this.label = label;
    this.disabled = disabled;
    this.icon = icon;
    this.actionClick = actionClick;
    this.confirmationTitle = confirmationTitle;
    this.confirmationMessage = confirmationMessage;
    this.validate = validate;
    this.selected = selected;
  }
}
