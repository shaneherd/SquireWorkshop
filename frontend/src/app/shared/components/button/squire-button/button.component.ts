import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ButtonAction} from '../../../models/button/button-action';
import {ButtonActionGroup} from '../../../models/button/button-action-group';
import {ButtonColor} from '../../../../constants';
import {DetailsValidator} from '../../../../dashboard/details/details/details-validator';
import {ButtonService} from '../../../../core/services/button.service';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit, OnChanges {
  @Input() color: ButtonColor = 'PRIMARY';
  @Input() label = '';
  @Input() icon = '';
  @Input() disabled = false;
  @Input() closeOnClick = true;
  @Input() confirmationTitle = '';
  @Input() confirmationMessage = '';
  @Input() actions: ButtonAction[] = [];
  @Input() groups: ButtonActionGroup[] = [];
  @Input() validator: DetailsValidator;
  @Output() onPrimaryClick = new EventEmitter<ButtonAction>();
  @Output() onSecondaryClick = new EventEmitter<ButtonAction>();

  primaryAction: ButtonAction;
  clicking = false;
  debounceInterval = 500;

  constructor(
    private buttonService: ButtonService
  ) { }

  ngOnInit() {
    this.initialize();
  }

  private initialize(): void {
    if (this.label !== '' || this.icon !== '') {
      this.primaryAction = new ButtonAction(
        '',
        this.label,
        null,
        this.disabled,
        this.confirmationTitle,
        this.confirmationMessage,
        this.validator == null ? null : this.validator.validate,
        this.icon);
    } else {
      this.primaryAction = this.getFirstEnabledButton();
    }
  }

  private getFirstEnabledButton(): ButtonAction {
    let buttonAction: ButtonAction = null;
    if (this.actions.length > 0) {
      buttonAction = this.getFirstAction(this.actions, false);
      if (buttonAction == null) {
        buttonAction = this.actions[0];
      }
    } else if (this.groups.length > 0) {
      for (let i = 0; i < this.groups.length; i++) {
        const group = this.groups[i];
        const action = this.getFirstAction(group.actions, false);
        if (action != null) {
          buttonAction = action;
          break;
        }
      }

      if (buttonAction == null) {
        //default to the first disabled action
        for (let i = 0; i < this.groups.length; i++) {
          const group = this.groups[i];
          if (group.actions.length > 0) {
            buttonAction = group.actions[0];
            break;
          }
        }
      }
    }

    return buttonAction;
  }

  private getFirstAction(actions: ButtonAction[], requireEnabled: boolean): ButtonAction {
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      if (!requireEnabled || !action.disabled) {
        return action;
      }
    }
    return null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.primaryAction == null) {
      return;
    }
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        if (propName === 'label') {
          this.primaryAction.label = changes[propName].currentValue as string;
        } else if (propName === 'disabled') {
          this.primaryAction.disabled = changes[propName].currentValue as boolean;
        } else if (propName === 'actions' || propName === 'groups') {
          this.initialize();
        }
      }
    }
  }

  primaryClick(): void {
    if (!this.clicking) {
      this.clicking = true;
      this.primaryAction.confirmationMessage = this.confirmationMessage;
      this.buttonService.handleClick(this.primaryAction, this.onPrimaryClick);

      setTimeout(() => {
        this.clicking = false;
      }, this.debounceInterval);
    }
  }

  secondaryClick(action: ButtonAction): void {
    if (!this.clicking) {
      this.clicking = true;
      this.onSecondaryClick.emit(action);

      setTimeout(() => {
        this.clicking = false;
      }, this.debounceInterval);
    }
  }
}
