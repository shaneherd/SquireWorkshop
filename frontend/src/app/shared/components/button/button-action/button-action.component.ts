import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonAction} from '../../../models/button/button-action';
import {ButtonService} from '../../../../core/services/button.service';

@Component({
  selector: 'app-button-action',
  templateUrl: './button-action.component.html',
  styleUrls: ['./button-action.component.scss']
})
export class ButtonActionComponent {
  @Input() action: ButtonAction;
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<ButtonAction>();

  constructor(
    private buttonService: ButtonService
  ) { }

  buttonClick(): void {
    this.buttonService.handleClick(this.action, this.onClick);
  }
}
