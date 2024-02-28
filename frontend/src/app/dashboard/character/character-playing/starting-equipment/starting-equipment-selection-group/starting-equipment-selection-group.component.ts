import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  StartingEquipmentSelectionGroup,
  StartingEquipmentSelectionGroupOption,
  StartingEquipmentSelectionGroupOptionItem
} from '../starting-equipment.component';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-starting-equipment-selection-group',
  templateUrl: './starting-equipment-selection-group.component.html',
  styleUrls: ['./starting-equipment-selection-group.component.scss']
})
export class StartingEquipmentSelectionGroupComponent {
  @Input() selectionGroup: StartingEquipmentSelectionGroup;
  @Output() itemClick = new EventEmitter<StartingEquipmentSelectionGroupOptionItem>();
  @Output() selectionChange = new EventEmitter<any>();

  constructor() { }

  optionChange(event: MatCheckboxChange, option: StartingEquipmentSelectionGroupOption): void {
    if (event.checked) {
      this.unselectAll();
    }
    option.selected = event.checked;
    this.selectionChange.emit();
  }

  private unselectAll(): void {
    this.selectionGroup.options.forEach((option: StartingEquipmentSelectionGroupOption) => {
      option.selected = false;
    });
  }

  onItemClick(item: StartingEquipmentSelectionGroupOptionItem): void {
    this.itemClick.emit(item);
  }

  toggleExpanded(): void {
    this.selectionGroup.expanded = !this.selectionGroup.expanded;
  }

}
