import {Component, Input, OnInit} from '@angular/core';
import {CreatureItem} from '../../../models/creatures/creature-item';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {Item} from '../../../models/items/item';
import {CreatureConfigurationCollection} from '../../../models/creatures/configs/creature-configuration-collection';

@Component({
  selector: 'app-properties-display',
  templateUrl: './properties-display.component.html',
  styleUrls: ['./properties-display.component.scss']
})
export class PropertiesDisplayComponent implements OnInit {
  @Input() collection: CreatureConfigurationCollection;
  @Input() item: Item;
  @Input() creatureItem: CreatureItem;
  @Input() additionalProperties: string[] = [];
  @Input() class = '';

  proficient = false;

  constructor(
    private creatureService: CreatureService
  ) { }

  ngOnInit() {
    this.initializeProficiency();
  }

  private initializeProficiency(): void {
    this.proficient = this.creatureService.isItemProficient(this.creatureItem, this.collection);
  }

}
