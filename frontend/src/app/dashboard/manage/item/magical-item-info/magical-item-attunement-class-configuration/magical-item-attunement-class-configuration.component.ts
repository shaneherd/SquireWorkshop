import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ListObject} from '../../../../../shared/models/list-object';

@Component({
  selector: 'app-magical-item-attunement-class-configuration',
  templateUrl: './magical-item-attunement-class-configuration.component.html',
  styleUrls: ['./magical-item-attunement-class-configuration.component.scss']
})
export class MagicalItemAttunementClassConfigurationComponent {
  @Input() characterClass: ListObject;
  @Input() editing: boolean;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter<ListObject>();

  constructor() { }

  continueClick(): void {
    this.continue.emit(this.characterClass);
  }

  cancelClick(): void {
    this.close.emit();
  }

}
