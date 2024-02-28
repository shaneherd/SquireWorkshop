import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../../models/items/item';
import {EquipmentSlotType} from '../../models/items/equipment-slot-type.enum';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-is-equippable-configuration',
  templateUrl: './is-equippable-configuration.component.html',
  styleUrls: ['./is-equippable-configuration.component.scss']
})
export class IsEquippableConfigurationComponent implements OnInit {
  @Input() item: Item;
  @Input() editing = false;

  slots: EquipmentSlotType[] = [];

  constructor() { }

  ngOnInit() {
    this.initializeSlots();
  }

  initializeSlots(): void {
    this.slots = [];
    this.slots.push(EquipmentSlotType.HAND);
    this.slots.push(EquipmentSlotType.BODY);
    this.slots.push(EquipmentSlotType.BACK);
    this.slots.push(EquipmentSlotType.NECK);
    this.slots.push(EquipmentSlotType.GLOVES);
    this.slots.push(EquipmentSlotType.FINGER);
    this.slots.push(EquipmentSlotType.HEAD);
    this.slots.push(EquipmentSlotType.WAIST);
    this.slots.push(EquipmentSlotType.FEET);
    this.slots.push(EquipmentSlotType.MOUNT);
    this.initializeSelectedSlot();
  }

  initializeSelectedSlot(): void {
    if (this.item.slot == null) {
      this.item.slot = this.slots[0];
    }
  }

  equippableChange(event: MatCheckboxChange): void {
    this.item.equippable = event.checked;
  }

  slotChange(slot: EquipmentSlotType): void {
    this.item.slot = slot;
  }
}
