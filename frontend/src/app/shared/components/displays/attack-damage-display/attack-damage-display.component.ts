import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Item} from '../../../models/items/item';
import {DamageConfigurationCollection} from '../../../models/damage-configuration-collection';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureConfigurationCollection} from '../../../models/creatures/configs/creature-configuration-collection';
import {CreatureItem} from '../../../models/creatures/creature-item';
import {Creature} from '../../../models/creatures/creature';
import {ItemType} from '../../../models/items/item-type.enum';
import {Weapon} from '../../../models/items/weapon';
import {EVENTS, SID} from '../../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../../core/services/events.service';
import {CreatureItemService} from '../../../../core/services/creatures/creature-item.service';
import {ItemService} from '../../../../core/services/items/item.service';
import {MagicalItem} from '../../../models/items/magical-item';
import {MagicalItemType} from '../../../models/items/magical-item-type.enum';

@Component({
  selector: 'app-attack-damage-display',
  templateUrl: './attack-damage-display.component.html',
  styleUrls: ['./attack-damage-display.component.scss']
})
export class AttackDamageDisplayComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() item: Item;
  @Input() creatureItem: CreatureItem = null;
  @Input() class = '';

  eventSub: Subscription;
  damageConfigurationCollection: DamageConfigurationCollection = null;
  versatileDamageConfigurationCollection: DamageConfigurationCollection = null;

  constructor(
    private characterService: CharacterService,
    private itemService: ItemService,
    private creatureItemService: CreatureItemService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeDamages();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ItemsUpdated
        || event === EVENTS.AbilityScoreChange
        || event === EVENTS.ModifiersUpdated
        || event === EVENTS.ProficiencyUpdated
        || event === EVENTS.HpUpdated
        || event === EVENTS.ConditionUpdated
        || event === EVENTS.CarryingUpdated
        || event === EVENTS.ExhaustionLevelChanged) {
        this.initializeDamages();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeDamages(): void {
    this.damageConfigurationCollection = this.creatureItemService.getItemDamages(this.item, this.creatureItem, this.creature, this.collection, false);
    if (this.item.itemType === ItemType.WEAPON) {
      const weapon = this.item as Weapon;
      if (this.itemService.hasWeaponProperty(weapon, SID.WEAPON_PROPERTIES.VERSATILE)) {
        this.versatileDamageConfigurationCollection = this.creatureItemService.getItemDamages(this.item, this.creatureItem, this.creature, this.collection, true);
      }
    } else if (this.item.itemType === ItemType.MAGICAL_ITEM) {
      const magicalItem = this.item as MagicalItem;
      if (magicalItem.magicalItemType === MagicalItemType.WEAPON && this.creatureItem.magicalItem != null && this.creatureItem.magicalItem.itemType === ItemType.WEAPON) {
        const baseWeapon = this.creatureItem.magicalItem as Weapon;
        if (this.itemService.hasWeaponProperty(baseWeapon, SID.WEAPON_PROPERTIES.VERSATILE)) {
          this.versatileDamageConfigurationCollection = this.creatureItemService.getItemDamages(baseWeapon, this.creatureItem, this.creature, this.collection, true);
        }
      }
    }
  }
}
