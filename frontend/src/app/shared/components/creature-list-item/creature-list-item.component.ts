import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreatureItem} from '../../models/creatures/creature-item';
import {ItemType} from '../../models/items/item-type.enum';
import {MagicalItem} from '../../models/items/magical-item';
import {MagicalItemType} from '../../models/items/magical-item-type.enum';

@Component({
  selector: 'app-creature-list-item',
  templateUrl: './creature-list-item.component.html',
  styleUrls: ['./creature-list-item.component.scss']
})
export class CreatureListItemComponent implements OnInit {
  @Input() creatureItem: CreatureItem;
  @Input() nested = true;
  @Input() alwaysShowQuantity = false;
  @Input() clickDisabled = false;
  @Output() itemClick = new EventEmitter();

  container = false;
  scrollSpellName = '';

  constructor() { }

  ngOnInit() {
    this.container = this.creatureItem.container || this.creatureItem.itemType === ItemType.MOUNT;
    if (this.creatureItem.itemType === ItemType.MAGICAL_ITEM) {
      const magicalItem = this.creatureItem.item as MagicalItem;
      if (magicalItem.magicalItemType === MagicalItemType.SCROLL && this.creatureItem.spells.length > 0) {
        this.scrollSpellName = this.creatureItem.spells[0].spell.name;
      }
    }
  }

  onItemClick(): void {
    if (!this.clickDisabled) {
      this.itemClick.emit(this.creatureItem);
    }
  }
}
