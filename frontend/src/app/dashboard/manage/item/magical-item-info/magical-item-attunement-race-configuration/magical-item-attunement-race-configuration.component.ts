import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ListObject} from '../../../../../shared/models/list-object';

@Component({
  selector: 'app-magical-item-attunement-race-configuration',
  templateUrl: './magical-item-attunement-race-configuration.component.html',
  styleUrls: ['./magical-item-attunement-race-configuration.component.scss']
})
export class MagicalItemAttunementRaceConfigurationComponent {
  @Input() race: ListObject;
  @Input() editing: boolean;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter<ListObject>();

  constructor() { }

  continueClick(): void {
    this.continue.emit(this.race);
  }

  cancelClick(): void {
    this.close.emit();
  }
}
