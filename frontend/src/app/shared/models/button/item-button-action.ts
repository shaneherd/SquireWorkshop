import {ButtonAction} from './button-action';
import {CreatureItemAction} from '../creatures/creature-item-action.enum';

export class ItemButtonAction extends ButtonAction {
  action: CreatureItemAction;

  constructor(action: CreatureItemAction, label: string, actionClick: () => void = null, disabled = false, confirmationTitle = '', confirmationMessage = '', validate: () => boolean = null, icon = '') {
    super('', label, actionClick, disabled, confirmationTitle, confirmationMessage, validate, icon);
    this.action = action;
  }
}
