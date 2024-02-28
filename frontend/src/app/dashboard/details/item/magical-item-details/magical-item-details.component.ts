import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {MagicalItem} from '../../../../shared/models/items/magical-item';
import {CreatureItem} from '../../../../shared/models/creatures/creature-item';
import {Creature} from '../../../../shared/models/creatures/creature';
import {DiceSize} from '../../../../shared/models/dice-size.enum';
import {MagicalItemApplicability, MagicalItemApplicabilityDisplay} from '../../../../shared/models/items/magical-item-applicability';
import {MagicalItemType} from '../../../../shared/models/items/magical-item-type.enum';
import {MagicalItemApplicabilityType} from '../../../../shared/models/items/magical-item-applicability-type.enum';
import {TranslateService} from '@ngx-translate/core';
import {ItemFilterService} from '../../../../core/services/item-filter.service';
import {DamageConfigurationCollection} from '../../../../shared/models/damage-configuration-collection';
import {CreatureItemService} from '../../../../core/services/creatures/creature-item.service';
import {MagicalItemSpellConfiguration} from '../../../../shared/models/items/magical-item-spell-configuration';
import {ModifierConfigurationCollection} from '../../../../shared/models/modifier-configuration-collection';
import {SpellFilterService} from '../../../../core/services/spell-filter.service';
import {EventsService} from '../../../../core/services/events.service';
import {EVENTS, SID} from '../../../../constants';
import {Weapon} from '../../../../shared/models/items/weapon';
import {Armor} from '../../../../shared/models/items/armor';
import {Ammo} from '../../../../shared/models/items/ammo';
import {ItemType} from '../../../../shared/models/items/item-type.enum';
import {WeaponRangeType} from '../../../../shared/models/items/weapon-range-type.enum';
import {MagicalItemAttunementType} from '../../../../shared/models/items/magical-item-attunement-type.enum';
import * as _ from 'lodash';
import {Subscription} from 'rxjs';
import {EquipmentSlotType} from '../../../../shared/models/items/equipment-slot-type.enum';
import {ItemService} from '../../../../core/services/items/item.service';

@Component({
  selector: 'app-magical-item-details',
  templateUrl: './magical-item-details.component.html',
  styleUrls: ['./magical-item-details.component.scss']
})
export class MagicalItemDetailsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() creatureItem: CreatureItem;
  @Input() magicalItem: MagicalItem;
  @Input() castable = true;
  @Output() itemClick = new EventEmitter();

  eventSub: Subscription;
  isScroll = false;
  diceSizes: DiceSize[] = [];
  applicableTypes: MagicalItemApplicabilityDisplay[] = [];
  applicableSpells: MagicalItemApplicabilityDisplay[] = [];
  damageConfigurationCollection: DamageConfigurationCollection = null;
  baseItemDamageConfigurationCollection: DamageConfigurationCollection = null;
  versatileDamageConfigurationCollection: DamageConfigurationCollection = null;
  modifierConfigurationCollection: ModifierConfigurationCollection = null;
  spells: MagicalItemSpellConfiguration[] = [];
  viewingSpell: MagicalItemSpellConfiguration = null;
  disabled = false;
  isWeapon = false;
  isArmor = false;
  isAmmo = false;

  baseWeapon: Weapon = null;
  ranged = false;
  baseArmor: Armor = null;
  additionalArmorProperties: string[] = [];
  baseAmmo: Ammo = null;

  attunementAny = false;
  attunementSpellcaster = false;
  attunementClasses = false;
  attunementAlignments = false;
  attunementRaces = false;

  slot: EquipmentSlotType = null;

  constructor(
    private creatureItemService: CreatureItemService,
    private translate: TranslateService,
    private itemFilterService: ItemFilterService,
    private spellFilterService: SpellFilterService,
    private itemService: ItemService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeItem();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (this.creatureItem != null && event === (EVENTS.ItemUpdated + this.creatureItem.id)) {
        this.initializeItem();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        if (propName === 'creatureItem') {
          this.initializeItem();
        }
      }
    }
  }

  private async initializeItem(): Promise<any> {
    this.slot = this.creatureItemService.getCreatureItemEquipmentSlotType(this.creatureItem);
    if (this.slot == null) {
      this.slot = this.magicalItem.slot;
    }
    this.isScroll = this.magicalItem.magicalItemType === MagicalItemType.SCROLL;
    this.isWeapon = this.magicalItem.magicalItemType === MagicalItemType.WEAPON;
    this.isAmmo = this.magicalItem.magicalItemType === MagicalItemType.AMMO;
    this.isArmor = this.magicalItem.magicalItemType === MagicalItemType.ARMOR;

    if (this.creatureItem != null && this.creatureItem.magicalItem != null) {
      if (this.isWeapon && this.creatureItem.magicalItem.itemType === ItemType.WEAPON) {
        this.baseWeapon = this.creatureItem.magicalItem as Weapon;
        this.ranged = this.baseWeapon.rangeType === WeaponRangeType.RANGED;
      } else if (this.isAmmo && this.creatureItem.magicalItem.itemType === ItemType.AMMO) {
        this.baseAmmo = this.creatureItem.magicalItem as Ammo;
      } else if (this.isArmor && this.creatureItem.magicalItem.itemType === ItemType.ARMOR) {
        this.baseArmor = this.creatureItem.magicalItem as Armor;
        if (this.baseArmor.stealthDisadvantage) {
          this.additionalArmorProperties = [];
          this.additionalArmorProperties.push(this.translate.instant('StealthDisadvantage'));
        }
      }
    }

    if (this.magicalItem.requiresAttunement) {
      this.attunementAny = this.magicalItem.attunementType === MagicalItemAttunementType.ANY;
      this.attunementSpellcaster = this.magicalItem.attunementType === MagicalItemAttunementType.CASTER;
      this.attunementClasses = this.magicalItem.attunementType === MagicalItemAttunementType.CLASS;
      this.attunementAlignments = this.magicalItem.attunementType === MagicalItemAttunementType.ALIGNMENT;
      this.attunementRaces = this.magicalItem.attunementType === MagicalItemAttunementType.RACE;
    }

    await this.itemFilterService.initializeFilterOptions();
    await this.spellFilterService.initializeFilterOptions();
    this.initializeDiceSizes();
    this.initializeApplicableTypes();
    this.initializeApplicableSpells();
    this.initializeDamages();
    this.initializeModifiers();
    this.initializeSpells();
  }

  onItemClick(creatureItem: CreatureItem): void {
    this.itemClick.emit(creatureItem);
  }

  private initializeDiceSizes(): void {
    this.diceSizes = [];
    this.diceSizes.push(DiceSize.ONE);
    this.diceSizes.push(DiceSize.TWO);
    this.diceSizes.push(DiceSize.THREE);
    this.diceSizes.push(DiceSize.FOUR);
    this.diceSizes.push(DiceSize.SIX);
    this.diceSizes.push(DiceSize.EIGHT);
    this.diceSizes.push(DiceSize.TEN);
    this.diceSizes.push(DiceSize.TWELVE);
    this.diceSizes.push(DiceSize.TWENTY);
    this.diceSizes.push(DiceSize.HUNDRED);
  }

  private initializeApplicableTypes(): void {
    this.applicableTypes = [];
    const applicableItems = this.getApplicableItems();
    applicableItems.forEach((config: MagicalItemApplicability) => {
      const item = new MagicalItemApplicabilityDisplay();
      item.magicalItemApplicability = config;
      item.display = this.getApplicableItemName(config);
      this.applicableTypes.push(item);
    });
  }

  private initializeApplicableSpells(): void {
    this.applicableSpells = [];
    if (this.magicalItem.magicalItemType === MagicalItemType.SCROLL || this.magicalItem.additionalSpells) {
      this.magicalItem.applicableSpells.forEach((config: MagicalItemApplicability) => {
        const item = new MagicalItemApplicabilityDisplay();
        item.magicalItemApplicability = config;
        item.display = this.getApplicableSpellName(config);
        this.applicableSpells.push(item);
      });
    }
  }

  private getApplicableItems(): MagicalItemApplicability[] {
    switch (this.magicalItem.magicalItemType) {
      case MagicalItemType.AMMO:
        return this.magicalItem.applicableAmmos;
      case MagicalItemType.ARMOR:
        return this.magicalItem.applicableArmors;
      case MagicalItemType.WEAPON:
        return this.magicalItem.applicableWeapons;
    }
    return [];
  }

  private getApplicableSpellName(config: MagicalItemApplicability): string {
    if (config.magicalItemApplicabilityType === MagicalItemApplicabilityType.SPELL) {
      return config.spell.name;
    } else {
      return this.translate.instant('Labels.Filter') + this.spellFilterService.getFilterDisplay(config.filters);
    }
  }

  private getApplicableItemName(config: MagicalItemApplicability): string {
    if (config.magicalItemApplicabilityType === MagicalItemApplicabilityType.ITEM) {
      return config.item.name;
    } else {
      return this.translate.instant('Labels.Filter') + this.itemFilterService.getFilterDisplay(config.filters);
    }
  }

  private initializeDamages(): void {
    this.baseItemDamageConfigurationCollection = null;
    this.versatileDamageConfigurationCollection = null;

    this.damageConfigurationCollection = this.creatureItemService.getMagicalItemDamages(this.magicalItem, this.creatureItem, this.creature, this.collection);

    if (this.magicalItem.magicalItemType === MagicalItemType.WEAPON || this.magicalItem.magicalItemType === MagicalItemType.AMMO) {
      if (this.creatureItem != null) {
        this.baseItemDamageConfigurationCollection = this.creatureItemService.getItemDamages(this.magicalItem, this.creatureItem, this.creature, this.collection, false);
      }

      if (this.baseItemDamageConfigurationCollection == null) {
        this.baseItemDamageConfigurationCollection = this.damageConfigurationCollection;
      }
    }

    if (this.magicalItem.magicalItemType === MagicalItemType.WEAPON
      && this.creatureItem != null
      && this.creatureItem.magicalItem != null
      && this.creatureItem.magicalItem.itemType === ItemType.WEAPON) {
      const baseWeapon = this.creatureItem.magicalItem as Weapon;
      if (this.itemService.hasWeaponProperty(baseWeapon, SID.WEAPON_PROPERTIES.VERSATILE)) {
        this.versatileDamageConfigurationCollection = this.creatureItemService.getItemDamages(this.magicalItem, this.creatureItem, this.creature, this.collection, true);
      }
    }
  }

  private initializeModifiers(): void {
    //todo
    // this.modifierConfigurationCollection = this.creatureItemService.getMagicalItemModifiers(this.magicalItem, this.creatureItem, this.creature, this.collection);
  }

  private initializeSpells(): void {
    const spells = this.creatureItem == null ? this.magicalItem.spells : this.creatureItem.spells;
    this.spells = _.filter(spells, (spell: MagicalItemSpellConfiguration) => {
      return this.isScroll || this.magicalItem.additionalSpells || !spell.additional;
    });

    if (this.magicalItem.magicalItemType === MagicalItemType.POTION && this.spells.length > 1) {
      this.spells = this.spells.slice(0, 1);
    }
  }

  spellClick(config: MagicalItemSpellConfiguration): void {
    if (!this.disabled && config.spell != null && config.spell.id !== '0') {
      this.viewingSpell = config;
      this.updateDisabled();
    }
  }

  castSpell(itemRemoved: boolean): void {
    if (this.viewingSpell.removeOnCasting) {
      const index = this.spells.indexOf(this.viewingSpell);
      if (index > -1) {
        this.spells.splice(index, 1);
      }
    }
    this.viewingSpell = null;
    this.updateDisabled();

    if (itemRemoved) {
      this.eventsService.dispatchEvent(EVENTS.FetchItemsList);
    }
  }

  closeSpell(): void {
    this.viewingSpell = null;
    this.updateDisabled();
  }

  private updateDisabled(): void {
    this.disabled = this.viewingSpell != null;
  }

}
