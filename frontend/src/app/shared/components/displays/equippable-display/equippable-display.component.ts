import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../../../models/items/item';
import {EquipmentSlotType} from '../../../models/items/equipment-slot-type.enum';

@Component({
  selector: 'app-equippable-display',
  templateUrl: './equippable-display.component.html',
  styleUrls: ['./equippable-display.component.scss']
})
export class EquippableDisplayComponent implements OnInit {
  @Input() item: Item;
  @Input() slot: EquipmentSlotType = null;

  constructor() { }

  ngOnInit(): void {
    if (this.slot == null) {
      this.slot = this.item.slot
    }
  }

}
