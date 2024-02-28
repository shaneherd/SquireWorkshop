import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ListObject} from '../../../../../shared/models/list-object';

@Component({
  selector: 'app-magical-item-attunement-alignment-configuration',
  templateUrl: './magical-item-attunement-alignment-configuration.component.html',
  styleUrls: ['./magical-item-attunement-alignment-configuration.component.scss']
})
export class MagicalItemAttunementAlignmentConfigurationComponent {
  @Input() alignment: ListObject;
  @Input() editing: boolean;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter<ListObject>();

  constructor() { }

  continueClick(): void {
    this.continue.emit(this.alignment);
  }

  cancelClick(): void {
    this.close.emit();
  }
}
