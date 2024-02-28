import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonAction} from '../../../models/button/button-action';
import {ButtonActionGroup} from '../../../models/button/button-action-group';
import {ButtonColor} from '../../../../constants';

@Component({
  selector: 'app-split-button',
  templateUrl: './split-button.component.html',
  styleUrls: ['./split-button.component.scss']
})
export class SplitButtonComponent {
  @Input() color: ButtonColor = 'PRIMARY';
  @Input() primaryAction: ButtonAction;
  @Input() actions: ButtonAction[] = [];
  @Input() groups: ButtonActionGroup[] = [];
  @Output() onPrimaryClick = new EventEmitter<ButtonAction>();
  @Output() onSecondaryClick = new EventEmitter<ButtonAction>();

  constructor(
  ) { }

  primaryClick(): void {
    this.onPrimaryClick.emit(this.primaryAction);
  }

  secondaryClick(action: ButtonAction): void {
    this.onSecondaryClick.emit(action);
  }
}
