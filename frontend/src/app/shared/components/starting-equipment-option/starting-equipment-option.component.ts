import {Component, EventEmitter, Input, Output} from '@angular/core';
import {StartingEquipmentItemGroupOption} from '../../models/startingEquipment/starting-equipment-item-group-option';
import {StartingEquipmentItemGroupOptionItem} from '../../models/startingEquipment/starting-equipment-item-group-option-item';

@Component({
  selector: 'app-starting-equipment-option',
  templateUrl: './starting-equipment-option.component.html',
  styleUrls: ['./starting-equipment-option.component.scss']
})
export class StartingEquipmentOptionComponent {
  @Input() editing = false;
  @Input() loading = false;
  @Input() disabled = false;
  @Input() option: StartingEquipmentItemGroupOption;

  @Output() deleteOption = new EventEmitter<StartingEquipmentItemGroupOption>();
  @Output() configureItem = new EventEmitter<StartingEquipmentItemGroupOptionItem>();
  @Output() addItem = new EventEmitter<StartingEquipmentItemGroupOption>();

  constructor() { }

  removeOption(): void {
    if (!this.disabled && this.option.inheritedFrom == null) {
      this.deleteOption.emit(this.option);
    }
  }

  onAddItem(): void {
    if (!this.disabled) {
      this.addItem.emit(this.option);
    }
  }

  editItem(item: StartingEquipmentItemGroupOptionItem): void {
    this.configureItem.emit(item);
  }

  removeItem(item: StartingEquipmentItemGroupOptionItem): void {
    const index = this.option.items.indexOf(item);
    if (index > -1) {
      this.option.items.splice(index, 1);
    }
  }
}
