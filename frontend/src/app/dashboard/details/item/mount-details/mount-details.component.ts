import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {Mount} from '../../../../shared/models/items/mount';
import {CreatureItem} from '../../../../shared/models/creatures/creature-item';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-mount-details',
  templateUrl: './mount-details.component.html',
  styleUrls: ['./mount-details.component.scss']
})
export class MountDetailsComponent {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() creatureItem: CreatureItem;
  @Input() mount: Mount;
  @Output() itemClick = new EventEmitter();

  constructor() { }

  onItemClick(creatureItem: CreatureItem): void {
    this.itemClick.emit(creatureItem);
  }

}
