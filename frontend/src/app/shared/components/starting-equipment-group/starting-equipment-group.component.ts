import {Component, EventEmitter, Input, Output} from '@angular/core';
import {StartingEquipmentItemGroup} from '../../models/startingEquipment/starting-equipment-item-group';
import {StartingEquipmentItemGroupOption} from '../../models/startingEquipment/starting-equipment-item-group-option';
import {StartingEquipmentItemGroupOptionItem} from '../../models/startingEquipment/starting-equipment-item-group-option-item';

@Component({
  selector: 'app-starting-equipment-group',
  templateUrl: './starting-equipment-group.component.html',
  styleUrls: ['./starting-equipment-group.component.scss']
})
export class StartingEquipmentGroupComponent {
  @Input() editing = false;
  @Input() loading = false;
  @Input() disabled = false;
  @Input() group: StartingEquipmentItemGroup;

  @Output() deleteGroup = new EventEmitter<StartingEquipmentItemGroup>();
  @Output() configureItem = new EventEmitter<StartingEquipmentItemGroupOptionItem>();
  @Output() addItem = new EventEmitter<StartingEquipmentItemGroupOption>();

  constructor() { }

  addOption(): void {
    const option = new StartingEquipmentItemGroupOption();
    option.optionNumber = this.getMaxOptionNumber() + 1;
    option.label = this.getOptionLabel(option);
    this.group.options.push(option);
  }

  private getOptionLabel(option: StartingEquipmentItemGroupOption): string {
    return String.fromCharCode(96 + option.optionNumber).toUpperCase();
  }

  private getMaxOptionNumber(): number {
    let max = 0;
    this.group.options.forEach((option: StartingEquipmentItemGroupOption) => {
      if (option.optionNumber > max) {
        max = option.optionNumber;
      }
    });
    return max;
  }

  removeGroup(): void {
    if (!this.disabled && this.group.inheritedFrom == null) {
      this.deleteGroup.emit(this.group);
    }
  }

  removeOption(option: StartingEquipmentItemGroupOption): void {
    const index = this.group.options.indexOf(option);
    if (index > -1) {
      this.group.options.splice(index, 1);
      this.updateOptionNumbers();
    }
  }

  private updateOptionNumbers(): void {
    for (let i = 0; i < this.group.options.length; i++) {
      const option = this.group.options[i];
      option.optionNumber = i + 1;
      option.label = this.getOptionLabel(option);
    }
  }

  editItem(item: StartingEquipmentItemGroupOptionItem): void {
    this.configureItem.emit(item);
  }

  onAddItem(option: StartingEquipmentItemGroupOption): void {
    if (!this.disabled) {
      this.addItem.emit(option);
    }
  }

}
