import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Creature} from '../../../../../shared/models/creatures/creature';
import {CreatureItem} from '../../../../../shared/models/creatures/creature-item';
import {ListObject} from '../../../../../shared/models/list-object';
import {Subscription} from 'rxjs';
import {CreatureItemService} from '../../../../../core/services/creatures/creature-item.service';
import {EventsService} from '../../../../../core/services/events.service';
import {EVENTS} from '../../../../../constants';
import {MagicalItemSpellConfiguration} from '../../../../../shared/models/items/magical-item-spell-configuration';
import {MagicalItem} from '../../../../../shared/models/items/magical-item';
import {ItemType} from '../../../../../shared/models/items/item-type.enum';
import * as _ from 'lodash';
import {SpellListObject} from '../../../../../shared/models/powers/spell-list-object';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CharacterLevelService} from '../../../../../core/services/character-level.service';

@Component({
  selector: 'app-spells',
  templateUrl: './spells.component.html',
  styleUrls: ['./spells.component.scss']
})
export class SpellsComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() creatureItem: CreatureItem;
  @Input() containers: ListObject[];
  @Output() continue = new EventEmitter<null>();
  @Output() cancel = new EventEmitter<null>();

  eventSub: Subscription;
  loading = false;
  magicalItem: MagicalItem;
  spells: MagicalItemSpellConfiguration[] = [];
  configuringItem: MagicalItemSpellConfiguration = null;
  addingSpells = false;
  disabled = false;

  constructor(
    private creatureItemService: CreatureItemService,
    private characterLevelService: CharacterLevelService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initialize();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ItemsUpdated) {
        this.creatureItem = this.getCreatureItem();
        if (this.creatureItem == null || this.creatureItem.quantity === 0) {
          this.cancelClick();
          return;
        }
        this.initialize();
      }
    });
  }

  private initialize(): void {
    if (this.creatureItem.itemType !== ItemType.MAGICAL_ITEM) {
      this.cancelClick();
      return;
    }

    this.magicalItem = this.creatureItem.item as MagicalItem;
    this.spells = this.creatureItem.spells.slice();
  }

  private getCreatureItem(): CreatureItem {
    const flatItems = this.creatureItemService.getFlatItemList(this.creature.items);
    for (let i = 0; i < flatItems.length; i++) {
      const creatureItem = flatItems[i];
      if (creatureItem.id === this.creatureItem.id) {
        return creatureItem;
      }
    }
    return null;
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  continueClick(): void {
    this.updateSpells();
  }

  private getSpells(additional: boolean): MagicalItemSpellConfiguration[] {
    return _.filter(this.spells, (config: MagicalItemSpellConfiguration) => { return config.additional === additional; });
  }

  cancelClick(): void {
    this.cancel.emit();
  }

  clearClick(): void {
    this.spells = this.getSpells(false);
    this.updateSpells();
  }

  private updateSpells(): void {
    this.loading = true;
    this.creatureItemService.updateSpells(this.creature, this.creatureItem, this.getSpells(true)).then(() => {
      this.creatureItem.spells = this.spells;
      this.loading = false;
      this.continue.emit();
    });
  }

  addSpells(): void {
    if (!this.disabled) {
      this.addingSpells = true;
    }
  }

  cancelAddSpells(): void {
    this.addingSpells = false;
    this.updateDisabled();
  }

  continueAddSpells(selectedSpells: SpellListObject[]): void {
    this.addingSpells = false;
    this.updateDisabled();
    selectedSpells.forEach((spell: SpellListObject) => {
      const config = new MagicalItemSpellConfiguration();
      config.additional = true;
      config.spell = spell;
      config.storedLevel = spell.level;
      if (spell.level === 0) {
        config.casterLevel = this.characterLevelService.getLevelsDetailedFromStorage()[0];
      }
      config.charges = 0;
      config.removeOnCasting = this.magicalItem.additionalSpellsRemoveOnCasting;
      this.spells.push(config);
    });
  }

  private updateDisabled(): void {
    this.disabled = this.addingSpells || this.configuringItem != null;
  }

  spellClick(config: MagicalItemSpellConfiguration): void {
    if (!this.disabled) {
      this.configuringItem = config;
      this.updateDisabled();
    }
  }

  updateSpellConfiguration(config: MagicalItemSpellConfiguration): void {
    this.configuringItem = null;
    this.updateDisabled();
  }

  deleteSpell(config: MagicalItemSpellConfiguration): void {
    const index = this.spells.indexOf(config);
    if (index > -1) {
      this.spells.splice(index, 1);
      this.configuringItem = null;
      this.updateDisabled();
    }
  }

  cancelConfiguration(): void {
    this.configuringItem = null;
    this.updateDisabled();
  }

}
