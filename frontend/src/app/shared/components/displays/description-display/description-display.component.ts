import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../../../models/items/item';
import {CreatureItem} from '../../../models/creatures/creature-item';

@Component({
  selector: 'app-description-display',
  templateUrl: './description-display.component.html',
  styleUrls: ['./description-display.component.scss']
})
export class DescriptionDisplayComponent implements OnInit {
  @Input() item: Item;
  @Input() creatureItem: CreatureItem;
  @Input() class = '';

  description = '';

  constructor() { }

  ngOnInit(): void {
    this.description = this.item.description;

    if (this.creatureItem != null && this.creatureItem.magicalItem != null && this.creatureItem.magicalItem.description.length > 0) {
      if (this.description === '') {
        this.description = this.creatureItem.magicalItem.description;
      } else {
        this.description += '\n\n' + this.creatureItem.magicalItem.description;
      }
    }
  }

}
