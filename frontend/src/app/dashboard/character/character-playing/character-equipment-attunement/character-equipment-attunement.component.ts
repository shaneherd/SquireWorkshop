import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureItem} from '../../../../shared/models/creatures/creature-item';
import {CreatureItemService} from '../../../../core/services/creatures/creature-item.service';
import * as _ from 'lodash';
import {Subscription} from 'rxjs';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {ItemType} from '../../../../shared/models/items/item-type.enum';
import {MagicalItem} from '../../../../shared/models/items/magical-item';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {CharacterService} from '../../../../core/services/creatures/character.service';

@Component({
  selector: 'app-character-equipment-attunement',
  templateUrl: './character-equipment-attunement.component.html',
  styleUrls: ['./character-equipment-attunement.component.scss']
})
export class CharacterEquipmentAttunementComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() reset = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = false;
  creatureItems: CreatureItem[] = [];
  eventSub: Subscription;

  max = 3;
  enforceMax = true;
  total = 0;

  constructor(
    private creatureItemService: CreatureItemService,
    private characterService: CharacterService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeItems();
    this.max = this.playerCharacter.characterSettings.equipment.maxAttunedItems;
    this.enforceMax = this.playerCharacter.characterSettings.equipment.enforceAttunedLimit;

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ItemsUpdated) {
        this.initializeItems();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeItems(): void {
    const items: CreatureItem[] = [];
    const flatList = this.creatureItemService.getFlatItemList(this.playerCharacter.items);
    flatList.forEach((creatureItem: CreatureItem) => {
      if (this.characterService.canAttune(this.playerCharacter, creatureItem)) {
        items.push(_.cloneDeep(creatureItem));
      }
    });
    this.creatureItems = items;
    this.updateTotal();
  }

  onSave(): void {
    this.creatureItemService.updateItems(this.creatureItems, this.playerCharacter).then(() => {
      this.loading = false;
      this.save.emit();
    });
  }

  onReset(): void {
    this.creatureItemService.resetAttunement(this.creatureItems, this.playerCharacter).then(() => {
      this.loading = false;
      this.reset.emit();
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  attunementChange(event: MatCheckboxChange, creatureItem: CreatureItem): void {
    creatureItem.attuned = event.checked;
    this.updateTotal();
  }

  private updateTotal(): void {
    let total = 0;
    this.creatureItems.forEach((creatureItem: CreatureItem) => {
      if (creatureItem.attuned) {
        total++;
      }
    });
    this.total = total;
  }
}
