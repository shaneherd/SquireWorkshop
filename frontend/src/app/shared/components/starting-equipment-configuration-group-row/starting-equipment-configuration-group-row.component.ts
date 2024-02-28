import {Component, EventEmitter, Input, Output} from '@angular/core';
import {StartingEquipmentConfigurationCollectionGroup} from '../../models/startingEquipment/starting-equipment-configuration-collection-group';

@Component({
  selector: 'app-starting-equipment-configuration-group-row',
  templateUrl: './starting-equipment-configuration-group-row.component.html',
  styleUrls: ['./starting-equipment-configuration-group-row.component.scss']
})
export class StartingEquipmentConfigurationGroupRowComponent {
  @Input() editing = false;
  @Input() loading = false;
  @Input() disabled = false;
  @Input() group: StartingEquipmentConfigurationCollectionGroup;
  @Output() delete = new EventEmitter();
  @Output() configure = new EventEmitter();

  constructor() { }

  deleteGroup(): void {
    if (!this.disabled && !this.group.inherited) {
      this.delete.emit(this.group);
    }
  }

  configureGroup(): void {
    if (!this.disabled && !this.group.inherited) {
      this.configure.emit(this.group);
    }
  }

}
