import {Component, Input, OnInit} from '@angular/core';
import {MagicalItem} from '../../../../shared/models/items/magical-item';
import {Rarity} from '../../../../shared/models/items/rarity.enum';
import {MagicalItemType} from '../../../../shared/models/items/magical-item-type.enum';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {DiceSize} from '../../../../shared/models/dice-size.enum';
import {ListObject} from '../../../../shared/models/list-object';
import {DamageConfiguration} from '../../../../shared/models/damage-configuration';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {TranslateService} from '@ngx-translate/core';
import {MagicalItemSpellConfiguration} from '../../../../shared/models/items/magical-item-spell-configuration';
import {MagicalItemApplicability, MagicalItemApplicabilityDisplay} from '../../../../shared/models/items/magical-item-applicability';
import {MagicalItemApplicabilityType} from '../../../../shared/models/items/magical-item-applicability-type.enum';
import {ItemFilterService} from '../../../../core/services/item-filter.service';
import {AttackType} from '../../../../shared/models/attack-type.enum';
import {Filters} from '../../../../core/components/filters/filters';
import {FilterValue} from '../../../../core/components/filters/filter-value';
import {FilterKey} from '../../../../core/components/filters/filter-key.enum';
import {ItemType} from '../../../../shared/models/items/item-type.enum';
import {MagicalItemAttunementType} from '../../../../shared/models/items/magical-item-attunement-type.enum';
import * as _ from 'lodash';
import {MagicalItemTable, MagicalItemTableRow} from '../../../../shared/models/items/magical-item-table';
import {ListSource} from '../../../../shared/models/list-source.enum';

@Component({
  selector: 'app-magical-item-info',
  templateUrl: './magical-item-info.component.html',
  styleUrls: ['./magical-item-info.component.scss']
})
export class MagicalItemInfoComponent implements OnInit {
  @Input() magicalItem: MagicalItem;
  @Input() editing: boolean;
  @Input() listSource: ListSource = ListSource.MY_STUFF;

  disabled = false;
  rarities: Rarity[];
  types: MagicalItemType[];
  diceSizes: DiceSize[] = [];

  isArmor = false;
  isPotion = false;
  isRing = false;
  isRod = false;
  isScroll = false;
  isStaff = false;
  isWand = false;
  isWeapon = false;
  isAmmo = false;
  isWondrous = false;

  isAttunementClass = false;
  isAttunementAlignment = false;
  isAttunementRace = false;
  attunementTypes: MagicalItemAttunementType[] = [];

  abilities: ListObject[] = [];
  configuringDamage: DamageConfiguration;
  addingDamage = false;
  none = '';

  configuringItem: MagicalItemSpellConfiguration = null;
  applicableItem: MagicalItemApplicabilityDisplay = null;
  editingApplicableItem = false;

  applicableTypes: MagicalItemApplicabilityDisplay[] = [];
  addingAttunementClasses = false;
  viewingAttunementClass: ListObject = null;
  addingAttunementAlignment = false;
  viewingAttunementAlignment: ListObject = null;
  addingAttunementRace = false;
  viewingAttunementRace: ListObject = null;

  viewingTable: MagicalItemTable = null;

  constructor(
    private abilityService: AbilityService,
    private translate: TranslateService,
    private itemFilterService: ItemFilterService
  ) { }

  ngOnInit() {
    this.none = this.translate.instant('None');
    this.itemFilterService.initializeFilterOptions(this.listSource).then(() => {
      this.initializeApplicableTypes();
    });
    this.initializeRarities();
    this.initializeMagicalItemTypes();
    this.updateMagicItemTypeFlags();
    this.initializeAttunementTypes();
    this.updateAttunementTypeFlags();
    this.initializeDiceSizes();
    this.initializeAbilities();
    this.updateAttackType();
  }

  private initializeRarities(): void {
    this.rarities = [];
    this.rarities.push(Rarity.COMMON);
    this.rarities.push(Rarity.UNCOMMON);
    this.rarities.push(Rarity.RARE);
    this.rarities.push(Rarity.VERY_RARE);
    this.rarities.push(Rarity.LEGENDARY);
  }

  rarityChange(rarity: Rarity): void {
    this.magicalItem.rarity = rarity;
  }

  private initializeMagicalItemTypes(): void {
    this.types = [];
    this.types.push(MagicalItemType.WONDROUS);
    this.types.push(MagicalItemType.WEAPON);
    this.types.push(MagicalItemType.AMMO);
    this.types.push(MagicalItemType.ARMOR);
    this.types.push(MagicalItemType.ROD);
    this.types.push(MagicalItemType.STAFF);
    this.types.push(MagicalItemType.WAND);
    this.types.push(MagicalItemType.POTION);
    this.types.push(MagicalItemType.SCROLL);
    this.types.push(MagicalItemType.RING);
  }

  magicalItemTypeChange(type: MagicalItemType): void {
    this.magicalItem.magicalItemType = type;
    this.updateMagicItemTypeFlags();
    this.initializeApplicableTypes();
    this.updateAttackType();
    this.updateSpells();
  }

  private updateMagicItemTypeFlags(): void {
    this.isArmor = this.magicalItem.magicalItemType === MagicalItemType.ARMOR;
    this.isPotion = this.magicalItem.magicalItemType === MagicalItemType.POTION;
    this.isRing = this.magicalItem.magicalItemType === MagicalItemType.RING;
    this.isRod = this.magicalItem.magicalItemType === MagicalItemType.ROD;
    this.isScroll = this.magicalItem.magicalItemType === MagicalItemType.SCROLL;
    this.isStaff = this.magicalItem.magicalItemType === MagicalItemType.STAFF;
    this.isWand = this.magicalItem.magicalItemType === MagicalItemType.WAND;
    this.isWeapon = this.magicalItem.magicalItemType === MagicalItemType.WEAPON;
    this.isAmmo = this.magicalItem.magicalItemType === MagicalItemType.AMMO;
    this.isWondrous = this.magicalItem.magicalItemType === MagicalItemType.WONDROUS;
  }

  private initializeAttunementTypes(): void {
    this.attunementTypes = [];
    this.attunementTypes.push(MagicalItemAttunementType.ANY);
    this.attunementTypes.push(MagicalItemAttunementType.CASTER);
    this.attunementTypes.push(MagicalItemAttunementType.CLASS);
    this.attunementTypes.push(MagicalItemAttunementType.RACE);
    this.attunementTypes.push(MagicalItemAttunementType.ALIGNMENT);
  }

  private updateAttunementTypeFlags(): void {
    this.isAttunementClass = this.magicalItem.attunementType === MagicalItemAttunementType.CLASS;
    this.isAttunementAlignment = this.magicalItem.attunementType === MagicalItemAttunementType.ALIGNMENT;
    this.isAttunementRace = this.magicalItem.attunementType === MagicalItemAttunementType.RACE;
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

  initializeAbilities(): void {
    this.abilities = [];
    let abilities = this.abilityService.getAbilitiesDetailedFromStorageAsListObject();
    abilities = abilities.slice(0);
    const noAbility = new ListObject('0', '');
    abilities.unshift(noAbility);
    this.abilities = abilities;
  }

  attunementChange(event: MatCheckboxChange): void {
    this.magicalItem.requiresAttunement = event.checked;
  }

  attunementTypeChange(type: MagicalItemAttunementType): void {
    this.magicalItem.attunementType = type;
    this.updateAttunementTypeFlags();
  }

  addAttunementClass(): void {
    this.addingAttunementClasses = true;
    this.updateDisabled();
  }

  continueAddAttunementClasses(classes: ListObject[]): void {
    this.magicalItem.attunementClasses = this.magicalItem.attunementClasses.concat(classes);
    this.addingAttunementClasses = false;
    this.updateDisabled();
  }

  cancelAddAttunementClasses(): void {
    this.addingAttunementClasses = false;
    this.updateDisabled();
  }

  attunementClassClick(attunementClass: ListObject): void {
    this.viewingAttunementClass = attunementClass;
    this.updateDisabled();
  }

  removeClass(characterClass: ListObject): void {
    const index = _.findIndex(this.magicalItem.attunementClasses, (_class: ListObject) => {
      return _class.id === characterClass.id;
    });
    if (index > -1) {
      this.magicalItem.attunementClasses.splice(index, 1);
    }
    this.viewingAttunementClass = null;
    this.updateDisabled();
  }

  cancelViewingClass(): void {
    this.viewingAttunementClass = null;
    this.updateDisabled();
  }

  addAttunementAlignment(): void {
    this.addingAttunementAlignment = true;
    this.updateDisabled();
  }

  continueAddAttunementAlignments(alignments: ListObject[]): void {
    this.magicalItem.attunementAlignments = this.magicalItem.attunementAlignments.concat(alignments);
    this.addingAttunementAlignment = false;
    this.updateDisabled();
  }

  cancelAddAttunementAlignments(): void {
    this.addingAttunementAlignment = false;
    this.updateDisabled();
  }

  attunementAlignmentClick(alignment: ListObject): void {
    this.viewingAttunementAlignment = alignment;
    this.updateDisabled();
  }

  removeAlignment(alignment: ListObject): void {
    const index = _.findIndex(this.magicalItem.attunementAlignments, (_alignment: ListObject) => {
      return _alignment.id === alignment.id;
    });
    if (index > -1) {
      this.magicalItem.attunementAlignments.splice(index, 1);
    }
    this.viewingAttunementAlignment = null;
    this.updateDisabled();
  }

  cancelViewingAlignment(): void {
    this.viewingAttunementAlignment = null;
    this.updateDisabled();
  }

  addAttunementRace(): void {
    this.addingAttunementRace = true;
    this.updateDisabled();
  }

  continueAddAttunementRaces(races: ListObject[]): void {
    this.magicalItem.attunementRaces = this.magicalItem.attunementRaces.concat(races);
    this.addingAttunementRace = false;
    this.updateDisabled();
  }

  cancelAddAttunementRaces(): void {
    this.addingAttunementRace = false;
    this.updateDisabled();
  }

  attunementRaceClick(race: ListObject): void {
    this.viewingAttunementRace = race;
    this.updateDisabled();
  }

  removeRace(race: ListObject): void {
    const index = _.findIndex(this.magicalItem.attunementRaces, (_race: ListObject) => {
      return _race.id === race.id;
    });
    if (index > -1) {
      this.magicalItem.attunementRaces.splice(index, 1);
    }
    this.viewingAttunementRace = null;
    this.updateDisabled();
  }

  cancelViewingRace(): void {
    this.viewingAttunementRace = null;
    this.updateDisabled();
  }

  cursedChange(event: MatCheckboxChange): void {
    this.magicalItem.cursed = event.checked;
  }

  hasChargesChange(event: MatCheckboxChange): void {
    this.magicalItem.hasCharges = event.checked;
  }

  maxChargesChange(input): void {
    this.magicalItem.maxCharges = input.value;
  }

  rechargeableChange(event: MatCheckboxChange): void {
    this.magicalItem.rechargeable = event.checked;
  }

  rechargeOnLongRestChange(event: MatCheckboxChange): void {
    this.magicalItem.rechargeOnLongRest = event.checked;
  }

  chanceOfDestructionChange(event: MatCheckboxChange): void {
    this.magicalItem.chanceOfDestruction = event.checked;
  }

  attackModChange(input): void {
    this.magicalItem.attackMod = input.value;
  }

  acModChange(input): void {
    this.magicalItem.acMod = input.value;
  }

  private updateDisabled(): void {
    this.disabled = this.configuringItem != null || this.configuringDamage != null || this.addingDamage
      || this.applicableItem != null || this.addingAttunementClasses || this.viewingAttunementClass != null
      || this.viewingTable != null || this.addingAttunementAlignment || this.viewingAttunementAlignment != null
      || this.addingAttunementRace || this.viewingAttunementRace != null;
  }

  private initializeApplicableTypes(): void {
    this.applicableTypes = [];

    if (this.magicalItem.magicalItemType === MagicalItemType.WEAPON && this.magicalItem.applicableWeapons.length === 0) {
      const weaponConfig = new MagicalItemApplicability();
      weaponConfig.magicalItemApplicabilityType = MagicalItemApplicabilityType.FILTER;
      weaponConfig.filters = new Filters();

      const filterValue = new FilterValue();
      filterValue.key = FilterKey.ITEM_TYPE;
      filterValue.value = ItemType.WEAPON;
      weaponConfig.filters.filterValues.push(filterValue);

      this.magicalItem.applicableWeapons.push(weaponConfig);
    } else if (this.magicalItem.magicalItemType === MagicalItemType.ARMOR && this.magicalItem.applicableArmors.length === 0) {
      const armorConfig = new MagicalItemApplicability();
      armorConfig.magicalItemApplicabilityType = MagicalItemApplicabilityType.FILTER;
      armorConfig.filters = new Filters();

      const filterValue = new FilterValue();
      filterValue.key = FilterKey.ITEM_TYPE;
      filterValue.value = ItemType.ARMOR;
      armorConfig.filters.filterValues.push(filterValue);

      this.magicalItem.applicableArmors.push(armorConfig);
    } else if (this.magicalItem.magicalItemType === MagicalItemType.AMMO && this.magicalItem.applicableAmmos.length === 0) {
      const ammoConfig = new MagicalItemApplicability();
      ammoConfig.magicalItemApplicabilityType = MagicalItemApplicabilityType.FILTER;
      ammoConfig.filters = new Filters();

      const filterValue = new FilterValue();
      filterValue.key = FilterKey.ITEM_TYPE;
      filterValue.value = ItemType.AMMO;
      ammoConfig.filters.filterValues.push(filterValue);

      this.magicalItem.applicableAmmos.push(ammoConfig);
    }

    const applicableItems = this.getApplicableItems();
    applicableItems.forEach((config: MagicalItemApplicability) => {
      const item = new MagicalItemApplicabilityDisplay();
      item.magicalItemApplicability = config;
      item.display = this.getApplicableItemName(config);
      this.applicableTypes.push(item);
    });
  }

  private updateAttackType(): void {
    if (this.magicalItem.id === '0') {
      if (this.isWeapon || this.isAmmo) {
        this.magicalItem.attackType = AttackType.ATTACK;
      } else {
        this.magicalItem.attackType = AttackType.NONE;
      }
    }
  }

  private updateSpells(): void {
    if (this.magicalItem.magicalItemType === MagicalItemType.POTION && this.magicalItem.spells.length > 1) {
      this.magicalItem.spells = this.magicalItem.spells.slice(0, 1);
    }
  }

  addType(): void {
    this.editingApplicableItem = false;
    const config = new MagicalItemApplicabilityDisplay();
    config.magicalItemApplicability = new MagicalItemApplicability();
    config.magicalItemApplicability.magicalItemApplicabilityType = MagicalItemApplicabilityType.ITEM;
    this.applicableItem = config;
    this.updateDisabled();
  }

  typeClick(config: MagicalItemApplicabilityDisplay): void {
    if (!this.disabled) {
      this.editingApplicableItem = true;
      this.applicableItem = config;
      this.updateDisabled();
    }
  }

  updateType(config: MagicalItemApplicability): void {
    this.applicableItem.display = this.getApplicableItemName(config);

    if (!this.editingApplicableItem) {
      this.applicableTypes.push(this.applicableItem);
      if (this.magicalItem.magicalItemType === MagicalItemType.ARMOR) {
        this.magicalItem.applicableArmors.push(config);
      } else if (this.magicalItem.magicalItemType === MagicalItemType.WEAPON) {
        this.magicalItem.applicableWeapons.push(config);
      } else if (this.magicalItem.magicalItemType === MagicalItemType.AMMO) {
        this.magicalItem.applicableAmmos.push(config);
      }
    }
    this.applicableItem = null;
    this.updateDisabled();
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

  deleteType(config: MagicalItemApplicability): void {
    const applicableItems = this.getApplicableItems();
    let index = applicableItems.indexOf(config);
    if (index > -1) {
      applicableItems.splice(index, 1);
    }
    index = this.applicableTypes.indexOf(this.applicableItem);
    if (index > -1) {
      this.applicableTypes.splice(index, 1);
    }
    this.applicableItem = null;
    this.updateDisabled();
  }

  cancelType(): void {
    this.applicableItem = null;
    this.updateDisabled();
  }

  private getApplicableItemName(config: MagicalItemApplicability): string {
    if (config.magicalItemApplicabilityType === MagicalItemApplicabilityType.ITEM) {
      return config.item.name;
    } else {
      return this.translate.instant('Labels.Filter') + this.itemFilterService.getFilterDisplay(config.filters);
    }
  }

  addTable(): void {
    this.viewingTable = new MagicalItemTable();

    this.viewingTable.columns = this.getDefaultColumns(2);

    this.viewingTable.rows = [];
    this.viewingTable.rows.push(this.getDefaultTableRow(2));
    this.viewingTable.rows.push(this.getDefaultTableRow(2));
  }

  private getDefaultColumns(columnCount: number): string[] {
    const columns: string[] = [];
    for (let i = 0; i < columnCount; i++) {
      columns.push(this.translate.instant('ClickToEdit'));
    }
    return columns;
  }

  private getDefaultTableRow(columnCount: number): MagicalItemTableRow {
    const row = new MagicalItemTableRow();
    for (let i = 0; i < columnCount; i++) {
      row.values.push(this.translate.instant('ClickToEdit'));
    }
    return row;
  }

  editTable(): void {
    this.viewingTable = this.magicalItem.tables[0];
  }

  saveTable(magicalItemTable: MagicalItemTable): void {
    this.magicalItem.tables = [];
    this.magicalItem.tables.push(magicalItemTable);
    this.viewingTable = null;
  }

  cancelEditTable(): void {
    this.viewingTable = null;
  }

  removeTable(): void {
    this.magicalItem.tables = [];
    this.viewingTable = null;
  }
}
