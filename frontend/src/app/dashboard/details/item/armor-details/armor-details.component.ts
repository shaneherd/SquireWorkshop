import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {Armor} from '../../../../shared/models/items/armor';
import {CreatureItem} from '../../../../shared/models/creatures/creature-item';
import {TranslateService} from '@ngx-translate/core';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-armor-details',
  templateUrl: './armor-details.component.html',
  styleUrls: ['./armor-details.component.scss']
})
export class ArmorDetailsComponent implements OnInit {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() creatureItem: CreatureItem;
  @Input() armor: Armor;
  @Output() itemClick = new EventEmitter();

  additionalProperties: string[] = [];

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    if (this.armor.stealthDisadvantage) {
      this.additionalProperties.push(this.translate.instant('StealthDisadvantage'));
    }
  }

  onItemClick(creatureItem: CreatureItem): void {
    this.itemClick.emit(creatureItem);
  }
}
