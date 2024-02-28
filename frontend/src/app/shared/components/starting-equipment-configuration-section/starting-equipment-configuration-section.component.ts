import {Component, Input} from '@angular/core';
import {StartingEquipmentConfigurationCollection} from '../../models/startingEquipment/starting-equipment-configuration-collection';
import {StartingEquipmentItemGroup} from '../../models/startingEquipment/starting-equipment-item-group';
import {StartingEquipmentItemGroupOption} from '../../models/startingEquipment/starting-equipment-item-group-option';
import {StartingEquipmentItemGroupOptionItem} from '../../models/startingEquipment/starting-equipment-item-group-option-item';

@Component({
  selector: 'app-starting-equipment-configuration-section',
  templateUrl: './starting-equipment-configuration-section.component.html',
  styleUrls: ['./starting-equipment-configuration-section.component.scss']
})
export class StartingEquipmentConfigurationSectionComponent {
  @Input() editing = false;
  @Input() loading = false;
  @Input() collection: StartingEquipmentConfigurationCollection = new StartingEquipmentConfigurationCollection();

  disabled = false;
  addingItem = false;
  optionToAddTo: StartingEquipmentItemGroupOption = null;

  configuringItem: StartingEquipmentItemGroupOptionItem = null;

  constructor() { }

  addGroup(): void {
    const group = new StartingEquipmentItemGroup();
    group.groupNumber = this.getMaxGroupNumber() + 1;
    this.addDefaultOption(group);
    this.collection.groups.push(group);
  }

  private getMaxGroupNumber(): number {
    let max = 0;
    this.collection.groups.forEach((group: StartingEquipmentItemGroup) => {
      if (group.groupNumber > max) {
        max = group.groupNumber;
      }
    });
    return max;
  }

  private addDefaultOption(group: StartingEquipmentItemGroup): void {
    const option = new StartingEquipmentItemGroupOption();
    option.optionNumber = 1;
    option.label = 'A';
    group.options.push(option);
  }

  configureItem(config: StartingEquipmentItemGroupOptionItem): void {
    if (this.disabled || this.configuringItem != null) {
      return;
    }
    this.addingItem = false;
    this.configuringItem = config;
  }

  itemConfigurationClose(): void {
    this.configuringItem = null;
    this.addingItem = false;
  }

  itemConfigurationContinue(item: StartingEquipmentItemGroupOptionItem): void {
    if (this.optionToAddTo != null) {
      this.optionToAddTo.items.push(item);
    }
    this.configuringItem = null;
    this.addingItem = false;
    this.optionToAddTo = null;
  }

  addItem(option: StartingEquipmentItemGroupOption): void {
    if (this.disabled || this.configuringItem != null || this.collection.groups.length === 0) {
      return;
    }
    this.addingItem = true;
    this.optionToAddTo = option;
    this.configuringItem = new StartingEquipmentItemGroupOptionItem(null);
  }

  deleteGroup(group: StartingEquipmentItemGroup): void {
    this.removeGroup(group);
    this.updateGroupNumbers(this.collection.groups);
  }

  private removeGroup(group: StartingEquipmentItemGroup): void {
    const index = this.collection.groups.indexOf(group);
    if (index > -1) {
      this.collection.groups.splice(index, 1);
    }
  }

  private updateGroupNumbers(groups: StartingEquipmentItemGroup[]): void {
    let startingNumber = 1;
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      group.groupNumber = startingNumber;
      startingNumber++;
    }
  }
}
