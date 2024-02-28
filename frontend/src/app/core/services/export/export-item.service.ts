import {Injectable} from '@angular/core';
import {Item} from '../../../shared/models/items/item';
import {ItemType} from '../../../shared/models/items/item-type.enum';
import {Armor} from '../../../shared/models/items/armor';
import {Gear} from '../../../shared/models/items/gear';
import {Tool} from '../../../shared/models/items/tool';
import {Ammo} from '../../../shared/models/items/ammo';
import {Mount} from '../../../shared/models/items/mount';
import {Treasure} from '../../../shared/models/items/treasure';
import {Pack} from '../../../shared/models/items/pack';
import {MagicalItem} from '../../../shared/models/items/magical-item';
import {Weapon} from '../../../shared/models/items/weapon';
import {ExportSharedService} from './export-shared.service';
import {ExportAttributeService} from './export-attribute.service';
import {SID} from '../../../constants';
import {WeaponProperty} from '../../../shared/models/attributes/weapon-property';
import {ListObject} from '../../../shared/models/list-object';
import {WeaponRangeType} from '../../../shared/models/items/weapon-range-type.enum';
import {ItemService} from '../items/item.service';
import {ItemQuantity} from '../../../shared/models/items/item-quantity';
import {ExportDetailsService} from './export.service';
import {MagicalItemApplicabilityType} from '../../../shared/models/items/magical-item-applicability-type.enum';
import {MagicalItemType} from '../../../shared/models/items/magical-item-type.enum';
import {FilterKey} from '../../components/filters/filter-key.enum';
import {ExportPowerService} from './export-power.service';
import {Spell} from '../../../shared/models/powers/spell';
import {MagicalItemTableRow} from '../../../shared/models/items/magical-item-table';
import {DamageConfiguration} from '../../../shared/models/damage-configuration';
import {DiceSize} from '../../../shared/models/dice-size.enum';
import {Filters} from '../../components/filters/filters';
import {ItemListObject} from '../../../shared/models/items/item-list-object';
import {ExportCacheService} from './export-cache.service';

@Injectable({
  providedIn: 'root'
})
export class ExportItemService implements ExportDetailsService {

  constructor(
    private exportCacheService: ExportCacheService,
    private exportSharedService: ExportSharedService,
    private exportAttributeService: ExportAttributeService,
    private exportPowerService: ExportPowerService,
    private itemService: ItemService
  ) { }

  export(id: string, proExport: boolean): Promise<object> {
    return this.exportCacheService.getItem(id).then((item: Item) => {
      return this.processItem(item, proExport);
    });
  }

  processObject(object: Object, proExport: boolean): Promise<object> {
    return this.processItem(object as Item, proExport);
  }

  async processItem(item: Item, proExport: boolean): Promise<object> {
    switch (item.itemType) {
      case ItemType.WEAPON:
        const weapon = item as Weapon;
        return await this.processWeapon(weapon);
      case ItemType.ARMOR:
        const armor = item as Armor;
        return this.processArmor(armor);
      case ItemType.GEAR:
        const gear = item as Gear;
        return this.processGear(gear);
      case ItemType.TOOL:
        const tool = item as Tool;
        return this.processTool(tool);
      case ItemType.AMMO:
        const ammo = item as Ammo;
        return this.processAmmo(ammo);
      case ItemType.MOUNT:
        const mount = item as Mount;
        return this.processMount(mount);
      case ItemType.TREASURE:
        if (!proExport) {
          return null;
        }
        const treasure = item as Treasure;
        return this.processTreasure(treasure);
      case ItemType.PACK:
        if (!proExport) {
          return null;
        }
        const pack = item as Pack;
        return await this.processPack(pack);
      case ItemType.MAGICAL_ITEM:
        if (!proExport) {
          return null;
        }
        const magicalItem = item as MagicalItem;
        return await this.processMagicalItem(magicalItem);
    }
    return null;
  }

  async processWeapon(weapon: Weapon): Promise<object> {
    const damage = weapon.damages.length > 0 ? weapon.damages[0] : null;
    const versatile = weapon.versatileDamages.length > 0 ? weapon.versatileDamages[0] : null;
    return {
      'type': 'WeaponCategory',
      'ammo': await this.processWeaponAmmo(weapon.ammoType),
      'cost': weapon.cost,
      'costUnits': this.exportSharedService.getCostUnit(weapon.costUnit),
      'damageDice': damage == null ? 0 : damage.values.numDice,
      'damageDiceSize': damage == null ? 0 : this.exportSharedService.getDiceSize(damage.values.diceSize),
      'damageType': damage == null || damage.damageType == null ? '' : this.exportSharedService.getDamageType(damage.damageType.sid),
      'equipmentSlotType': {
        'type': 'EquipSlotType',
        'name': 'Hand'
      },
      'id': 0,
      'melee': weapon.rangeType === WeaponRangeType.MELEE,
      'name': weapon.name,
      'notes': weapon.description,
      'properties': this.processWeaponProperties(weapon),
      'rangeLong': weapon.longRange,
      'rangeNormal': weapon.normalRange,
      'versatileDamageDice': versatile == null ? 0 : versatile.values.numDice,
      'versatileDamageDiceSize': versatile == null ? 0 : this.exportSharedService.getDiceSize(versatile.values.diceSize),
      'weaponType': {
        'type': 'WeaponType',
        'name': weapon.weaponType.sid === SID.WEAPON_TYPES.MARTIAL ? 'Martial' : 'Simple'
      },
      'weight': weapon.weight
    };
  }

  async processWeaponAmmo(ammo: ListObject): Promise<object> {
    if (ammo == null) {
      return {
        'type': 'AmmoCategory',
        'cost': 0,
        'costUnits': 'GP',
        'id': 0,
        'name': '',
        'notes': '',
        'weight': 0.0
      };
    } else {
      const item: Item = await this.exportCacheService.getItem(ammo.id);
      const ammoItem = item as Ammo;
      return {
        'type': 'AmmoCategory',
        'cost': ammoItem.cost,
        'costUnits': this.exportSharedService.getCostUnit(ammoItem.costUnit),
        'id': 0,
        'name': ammo.name,
        'notes': ammo.description,
        'weight': ammoItem.weight
      }
    }
  }

  private processWeaponProperties(weapon: Weapon): object[] {
    const properties = [];
    weapon.properties.forEach((property: WeaponProperty) => {
      const object = {
        'description': property.description,
        'id': 0,
        'name': property.name
      }
      properties.push(object);
    });
    return properties;
  }

  processArmor(armor: Armor): object {
    return {
      'type': 'ArmorCategory',
      'ac': armor.ac,
      'armorType': this.exportAttributeService.processArmorType(armor.armorType),
      'cost': armor.cost,
      'costUnits': this.exportSharedService.getCostUnit(armor.costUnit),
      'equipmentSlotType': {
        'type': 'EquipSlotType',
        'name': this.exportSharedService.getEquipmentSlotType(armor.slot)
      },
      'id': 0,
      'ignoreWeightOfContents': armor.ignoreWeight,
      'maxDexMod': armor.maxAbilityModifier,
      'minStr': armor.minStrength,
      'name': armor.name,
      'notes': armor.description,
      'savingThrowMod': 0,
      'stealthDisadvantage': armor.stealthDisadvantage,
      'weight': armor.weight,
      'container': armor.container
    };
  }

  processGear(gear: Gear): object {
    return {
      'type': 'GearCategory',
      'cost': gear.cost,
      'costUnits': this.exportSharedService.getCostUnit(gear.costUnit),
      'equipmentSlotType': {
        'type': 'EquipSlotType',
        'name': this.exportSharedService.getEquipmentSlotType(gear.slot)
      },
      'equippable': gear.equippable,
      'id': 0,
      'ignoreWeightOfContents': gear.ignoreWeight,
      'name': gear.name,
      'notes': gear.description,
      'useable': gear.expendable,
      'weight': gear.weight,
      'container': gear.container
    };
  }

  processTool(tool: Tool): object {
    return {
      'type': 'ToolCategory',
      'categoryType': this.exportAttributeService.processToolCategory(tool.category),
      'cost': tool.cost,
      'costUnits': this.exportSharedService.getCostUnit(tool.costUnit),
      'equipmentSlotType': {
        'type': 'EquipSlotType',
        'name': this.exportSharedService.getEquipmentSlotType(tool.slot)
      },
      'equippable': tool.equippable,
      'id': 0,
      'ignoreWeightOfContents': tool.ignoreWeight,
      'name': tool.name,
      'notes': tool.description,
      'useable': tool.expendable,
      'weight': tool.weight,
      'container': tool.container
    };
  }

  processAmmo(ammo: Ammo): object {
    return {
      'type': 'AmmoCategory',
      'cost': ammo.cost,
      'costUnits': this.exportSharedService.getCostUnit(ammo.costUnit),
      'id': 0,
      'name': ammo.name,
      'notes': ammo.description,
      'weight': ammo.weight
    };
  }

  processMount(mount: Mount): object {
    return {
      'type': 'MountCategory',
      'carryingCapacity': mount.carryingCapacity,
      'cost': mount.cost,
      'costUnits': this.exportSharedService.getCostUnit(mount.costUnit),
      'equipmentSlotType': {
        'type': 'EquipSlotType',
        'name': 'Mount'
      },
      'id': 0,
      'name': mount.name,
      'notes': '',
      'speed': mount.speed
    };
  }

  processTreasure(treasure: Treasure): object {
    return {
      'type': 'TreasureCategory',
      'cost': treasure.cost,
      'costUnits': this.exportSharedService.getCostUnit(treasure.costUnit),
      'id': 0,
      'name': treasure.name,
      'notes': '',
      'weight': treasure.weight
    };
  }

  async processMagicalItem(magicalItem: MagicalItem): Promise<object> {
    return {
      'type': 'MagicalItem',
      'attuned': false,
      'characterItemId': 0,
      'charges': 0,
      'containerId': 0,
      'cursed': false,
      'dropped': false,
      'poisoned': false,
      'quantity': 0,
      'silvered': false,
      'category': await this.processMagicalItemCategory(magicalItem),
      'spells': [],
      'cost': magicalItem.cost,
      'costUnits': this.exportSharedService.getCostUnit(magicalItem.costUnit),
      'id': 0,
      'notes': magicalItem.description,
      'savingThrowMod': 0
    };
  }

  async processMagicalItemCategory(magicalItem: MagicalItem): Promise<object> {
    return {
      'JSON_TYPE': 'MagicalItemCategory', // 'JSON_TYPE' will be replaced with 'type' during the write process
      'acMod': magicalItem.acMod,
      'additionalSpells': magicalItem.additionalSpells || magicalItem.applicableSpells.length > 0,
      'armorCategories': await this.getMagicalItemArmorCategories(magicalItem),
      'armorTypes': await this.getMagicalItemArmors(magicalItem),
      'attackDamages': this.getMagicalItemDamages(magicalItem),
      'attackMod': magicalItem.attackMod,
      'attunement': magicalItem.requiresAttunement,
      'chanceOfDestruction': magicalItem.chanceOfDestruction,
      'cost': magicalItem.cost,
      'costUnits': this.exportSharedService.getCostUnit(magicalItem.costUnit),
      'curseEffect': magicalItem.curseEffect,
      'cursed': magicalItem.cursed,
      'equipmentSlotType': {
        'type': 'EquipSlotType',
        'name': this.exportSharedService.getEquipmentSlotType(magicalItem.slot)
      },
      'equippable': magicalItem.equippable,
      'hasCharges': magicalItem.hasCharges,
      'id': 0,
      'ignoreWeightOfContents': magicalItem.ignoreWeight,
      'maxCharges': magicalItem.maxCharges,
      'name': magicalItem.name,
      'notes': magicalItem.description,
      'rarity': this.exportSharedService.getRarity(magicalItem.rarity),
      'rechargeRateDiceSize': this.exportSharedService.getDiceSize(magicalItem.rechargeRate.diceSize),
      'rechargeRateMod': magicalItem.rechargeRate.miscModifier,
      'rechargeRateNumDice': magicalItem.rechargeRate.numDice,
      'rechargeable': magicalItem.rechargeable,
      'spells': await this.getMagicalItemSpells(magicalItem),
      'tableContent': this.getTableContent(magicalItem),
      'type': this.exportSharedService.getMagicalItemType(magicalItem.magicalItemType),
      'useable': magicalItem.expendable,
      'weaponCategories': await this.getMagicalItemWeaponCategories(magicalItem),
      'weaponTypes': await this.getMagicalItemWeapons(magicalItem),
      'weight': magicalItem.weight,
      'container': magicalItem.container,
      'vehicle': false
    };
  }

  private getMagicalItemDamages(magicalItem: MagicalItem): object[] {
    const damages = [];
    if (magicalItem.magicalItemType === MagicalItemType.WEAPON) {
      magicalItem.damages.forEach((damageConfiguration: DamageConfiguration) => {
        damages.push(this.getDamageConfigurationValue(damageConfiguration, 1));
        damages.push(this.getDamageConfigurationValue(damageConfiguration, 2));
        damages.push(this.getDamageConfigurationValue(damageConfiguration, 3));
      });
    }

    return damages;
  }

  private getDamageConfigurationValue(damageConfiguration: DamageConfiguration, attackType: number): object {
    return {
      'type': 'AttackDamage',
      'attackType': attackType,
      'damageAbility': this.getDamageAbilityModifier(damageConfiguration),
      'damageMod': damageConfiguration.values.miscModifier,
      'damageType': damageConfiguration.damageType == null ? '' : this.exportSharedService.getDamageType(damageConfiguration.damageType.sid),
      'diceSize': this.getDiceSize(damageConfiguration.values.diceSize),
      'numDice': damageConfiguration.values.numDice,
      'quickAttackId': 0
    }
  }

  private getDamageAbilityModifier(damageConfiguration: DamageConfiguration): object {
    if (damageConfiguration.values.abilityModifier == null || damageConfiguration.values.abilityModifier.id === '0') {
      return {
        'type': 'Ability',
        'abbr': 'None',
        'id': 0,
        'miscModifier': 0,
        'name': 'None',
        'raceModifier': 0,
        'roll': 0
      };
    }

    return {
      'type': 'Ability',
      'abbr': damageConfiguration.values.abilityModifier.abbr,
      'id': this.exportSharedService.getAbilityId(damageConfiguration.values.abilityModifier.sid),
      'miscModifier': 0,
      'name': damageConfiguration.values.abilityModifier.name,
      'raceModifier': 0,
      'roll': 0
    };
  }

  private getDiceSize(diceSize: DiceSize): string {
    switch (diceSize) {
      case DiceSize.ONE:
        return 'ONE';
      case DiceSize.TWO:
        return 'TWO';
      case DiceSize.THREE:
        return 'THREE';
      case DiceSize.FOUR:
        return 'FOUR';
      case DiceSize.SIX:
        return 'SIX';
      case DiceSize.EIGHT:
        return 'EIGHT';
      case DiceSize.TEN:
        return 'TEN';
      case DiceSize.TWELVE:
        return 'TWELVE';
      case DiceSize.TWENTY:
        return 'TWENTY';
      case DiceSize.HUNDRED:
        return 'ONE_HUNDRED';
    }
    return 'TWENTY';
  }

  private getTableContent(magicalItem: MagicalItem): string {
    if (magicalItem.tables.length === 0) {
      return '';
    }
    const table = magicalItem.tables[0];
    const rows = [];
    rows.push(table.columns.join('<COLUMN_BREAK>'));
    table.rows.forEach((row: MagicalItemTableRow) => {
      rows.push(row.values.join('<COLUMN_BREAK>'));
    });
    return rows.join('<ROW_BREAK>');
  }

  private getMagicalItemApplicableItem(name: string, id: number): object {
    return {
      'attuned': false,
      'cursed': false,
      'description': '',
      'id': id,
      'name': name,
      'poisoned': false,
      'silvered': false
    };
  }

  private async getMagicalItemArmorCategories(magicalItem: MagicalItem): Promise<object[]> {
    if (magicalItem.magicalItemType !== MagicalItemType.ARMOR) {
      return [];
    }
    const categories = [];
    for (const magicalItemApplicability of magicalItem.applicableArmors) {
      if (magicalItemApplicability.magicalItemApplicabilityType === MagicalItemApplicabilityType.FILTER) {
        if (!this.hasNonArmorCategoryFilter(magicalItemApplicability.filters)) {
          for (const filterValue of magicalItemApplicability.filters.filterValues) {
            if (filterValue.key !== FilterKey.ITEM_TYPE) {
              const attribute = await this.exportCacheService.getAttribute(filterValue.value);
              if (attribute != null) {
                const id = this.exportSharedService.getArmorTypeId(attribute.sid);
                categories.push(this.getMagicalItemApplicableItem(attribute.name, id));
              }
            }
          }
        }
      }
    }
    return categories;
  }

  private hasNonArmorCategoryFilter(filters: Filters): boolean {
    for (const filterValue of filters.filterValues) {
      if (filterValue.key !== FilterKey.ARMOR_CATEGORY && filterValue.key !== FilterKey.ITEM_TYPE) {
        return true;
      }
    }
    return false;
  }

  private async getMagicalItemArmors(magicalItem: MagicalItem): Promise<object[]> {
    if (magicalItem.magicalItemType !== MagicalItemType.ARMOR) {
      return [];
    }
    const categories = [];
    for (const magicalItemApplicability of magicalItem.applicableArmors) {
      if (magicalItemApplicability.magicalItemApplicabilityType === MagicalItemApplicabilityType.ITEM) {
        const item = magicalItemApplicability.item;
        const id = this.exportSharedService.getArmorId(item.sid);
        categories.push(this.getMagicalItemApplicableItem(item.name, id));
      } else if (magicalItemApplicability.magicalItemApplicabilityType === MagicalItemApplicabilityType.FILTER) {
        if (this.hasNonArmorCategoryFilter(magicalItemApplicability.filters)) {
          const response = await this.itemService.getItemsWithFilters(magicalItemApplicability.filters, 0);
          response.items.forEach((listObject: ItemListObject) => {
            const id = this.exportSharedService.getArmorId(listObject.sid);
            categories.push(this.getMagicalItemApplicableItem(listObject.name, id));
          });
        }
      }
    }
    return categories;
  }

  private async getMagicalItemWeaponCategories(magicalItem: MagicalItem): Promise<object[]> {
    if (magicalItem.magicalItemType === MagicalItemType.AMMO) {
      return this.getMagicalItemAmmoCategories(magicalItem);
    }
    if (magicalItem.magicalItemType !== MagicalItemType.WEAPON) {
      return [];
    }
    const categories = [];
    for (const magicalItemApplicability of magicalItem.applicableWeapons) {
      if (magicalItemApplicability.magicalItemApplicabilityType === MagicalItemApplicabilityType.FILTER) {
        if (!this.hasNonWeaponCategoryFilter(magicalItemApplicability.filters)) {
          for (const filterValue of magicalItemApplicability.filters.filterValues) {
            if (filterValue.key !== FilterKey.ITEM_TYPE) {
              const attribute = await this.exportCacheService.getAttribute(filterValue.value);
              if (attribute != null) {
                const id = this.exportSharedService.getWeaponTypeId(attribute.sid);
                categories.push(this.getMagicalItemApplicableItem(attribute.name, id));
              }
            }
          }
        }
      }
    }
    return categories;
  }

  private hasNonWeaponCategoryFilter(filters: Filters): boolean {
    for (const filterValue of filters.filterValues) {
      if (filterValue.key !== FilterKey.WEAPON_DIFFICULTY && filterValue.key !== FilterKey.ITEM_TYPE) {
        return true;
      }
    }
    return false;
  }

  private getMagicalItemAmmoCategories(magicalItem: MagicalItem): object[] {
    const categories = [];
    for (const magicalItemApplicability of magicalItem.applicableAmmos) {
      if (magicalItemApplicability.magicalItemApplicabilityType === MagicalItemApplicabilityType.FILTER) {
        if (!this.hasNonAmmoCategoryFilter(magicalItemApplicability.filters)) {
          categories.push(this.getMagicalItemApplicableItem('Ammo', 8));
        }
      }
    }
    return categories;
  }

  private hasNonAmmoCategoryFilter(filters: Filters): boolean {
    for (const filterValue of filters.filterValues) {
      if (filterValue.key !== FilterKey.ITEM_TYPE) {
        return true;
      }
    }
    return false;
  }

  private async getMagicalItemWeapons(magicalItem: MagicalItem): Promise<object[]> {
    if (magicalItem.magicalItemType === MagicalItemType.AMMO) {
      return this.getMagicalIemAmmos(magicalItem);
    }
    if (magicalItem.magicalItemType !== MagicalItemType.WEAPON) {
      return [];
    }
    const categories = [];
    for (const magicalItemApplicability of magicalItem.applicableWeapons) {
      if (magicalItemApplicability.magicalItemApplicabilityType === MagicalItemApplicabilityType.ITEM) {
        const item = magicalItemApplicability.item;
        const id = this.exportSharedService.getWeaponId(item.sid);
        categories.push(this.getMagicalItemApplicableItem(item.name, id));
      } else if (magicalItemApplicability.magicalItemApplicabilityType === MagicalItemApplicabilityType.FILTER) {
        if (this.hasNonWeaponCategoryFilter(magicalItemApplicability.filters)) {
          const response = await this.itemService.getItemsWithFilters(magicalItemApplicability.filters, 0);
          response.items.forEach((listObject: ItemListObject) => {
            const id = this.exportSharedService.getWeaponId(listObject.sid);
            categories.push(this.getMagicalItemApplicableItem(listObject.name, id));
          });
        }
      }
    }
    return categories;
  }

  private getMagicalIemAmmos(magicalItem: MagicalItem): object[] {
    const categories = [];
    for (const magicalItemApplicability of magicalItem.applicableAmmos) {
      if (magicalItemApplicability.magicalItemApplicabilityType === MagicalItemApplicabilityType.ITEM) {
        const item = magicalItemApplicability.item;
        const id = this.exportSharedService.getAmmoId(item.sid);
        categories.push(this.getMagicalItemApplicableItem(item.name, id));
      }
    }
    return categories;
  }

  private async getMagicalItemSpells(magicalItem: MagicalItem): Promise<object[]> {
    const spells = [];
    for (const spellConfiguration of magicalItem.spells) {
      const spell = await this.exportCacheService.getPower(spellConfiguration.spell.id);
      spells.push(await this.exportPowerService.processSpell(spell as Spell));
    }
    return spells;
  }

  async processPack(pack: Pack): Promise<object> {
    const json = {
      'type': 'PackCategory',
      'id': 0,
      'items': [],
      'name': pack.name
    };
    for (const itemQuantity of pack.items) {
      const packItem = await this.processPackItem(itemQuantity);
      if (packItem != null) {
        json['items'].push(packItem);
      }
    }
    return json;
  }

  private async processPackItem(itemQuantity: ItemQuantity): Promise<object> {
    const item = await this.exportCacheService.getItem(itemQuantity.item.id);
    switch (item.itemType) {
      case ItemType.WEAPON:
        const weapon = item as Weapon;
        return await this.processPackWeapon(weapon, itemQuantity);
      case ItemType.ARMOR:
        const armor = item as Armor;
        return this.processPackArmor(armor, itemQuantity);
      case ItemType.GEAR:
        const gear = item as Gear;
        return this.processPackGear(gear, itemQuantity);
      case ItemType.TOOL:
        const tool = item as Tool;
        return this.processPackTool(tool, itemQuantity);
      case ItemType.AMMO:
        const ammo = item as Ammo;
        return this.processPackAmmo(ammo, itemQuantity);
      case ItemType.MOUNT:
        const mount = item as Mount;
        return this.processPackMount(mount, itemQuantity);
      case ItemType.TREASURE:
        const treasure = item as Treasure;
        return this.processPackTreasure(treasure, itemQuantity);
      case ItemType.MAGICAL_ITEM:
        const magicalItem = item as MagicalItem;
        return await this.processPackMagicalItem(magicalItem, itemQuantity);
      // case ItemType.VEHICLE:
      //   const vehicle = item as Vehicle;
      //   return this.processPackVehicle(vehicle, itemQuantity);
    }
    return null;
  }

  processPackArmor(armor: Armor, itemQuantity: ItemQuantity): object {
    return {
      'type': 'BasicArmor',
      'attuned': false,
      'characterItemId': 0,
      'charges': 0,
      'containerId': 0,
      'cursed': false,
      'dropped': false,
      'quantity': itemQuantity.quantity,
      'category': this.processArmor(armor),
      'cost': armor.cost,
      'costUnits': this.exportSharedService.getCostUnit(armor.costUnit),
      'id': 0,
      'name': armor.name,
      'notes': armor.description,
      'savingThrowMod': 0,
      'weight': armor.weight
    };
  }

  processPackAmmo(ammo: Ammo, itemQuantity: ItemQuantity): object {
    return {
      'type': 'BasicAmmo',
      'attuned': false,
      'characterItemId': 0,
      'charges': 0,
      'containerId': 0,
      'cursed': false,
      'dropped': false,
      'poisoned': false,
      'quantity': itemQuantity.quantity,
      'silvered': false,
      'category': this.processAmmo(ammo),
      'attackMod': 0,
      'cost': ammo.cost,
      'costUnits': this.exportSharedService.getCostUnit(ammo.costUnit),
      'damageMod': 0,
      'id': 0,
      'name': ammo.name,
      'notes': ammo.description,
      'weight': ammo.weight,
      'savingThrowMod': 0
    };
  }

  async processPackWeapon(weapon: Weapon, itemQuantity: ItemQuantity): Promise<object> {
    const versatile = weapon.versatileDamages.length > 0 ? weapon.versatileDamages[0] : null;

    return {
      'type': 'BasicWeapon',
      'attuned': false,
      'characterItemId': 0,
      'charges': 0,
      'containerId': 0,
      'cursed': false,
      'dropped': false,
      'poisoned': false,
      'quantity': itemQuantity.quantity,
      'silvered': false,
      'category': await this.processWeapon(weapon),
      'ammo': await this.processWeaponAmmo(weapon.ammoType),
      'attackModifier': 0,
      'cost': weapon.cost,
      'costUnits': this.exportSharedService.getCostUnit(weapon.costUnit),
      'damageModifier': 0,
      'id': 0,
      'name': weapon.name,
      'notes': weapon.description,
      'rangeLong': weapon.longRange,
      'rangeNormal': weapon.normalRange,
      'versatileDamageDice': versatile == null ? 0 : versatile.values.numDice,
      'versatileDamageDiceSize': versatile == null ? 0 : this.exportSharedService.getDiceSize(versatile.values.diceSize),
      'weight': weapon.weight,
      'melee': weapon.rangeType === WeaponRangeType.MELEE,
      'savingThrowMod': 0
    };
  }

  processPackGear(gear: Gear, itemQuantity: ItemQuantity): object {
    return {
      'type': 'Gear',
      'attuned': false,
      'characterItemId': 0,
      'charges': 0,
      'containerId': 0,
      'cursed': false,
      'dropped': false,
      'quantity': itemQuantity.quantity,
      'category': this.processGear(gear),
      'cost': gear.cost,
      'costUnits': this.exportSharedService.getCostUnit(gear.costUnit),
      'id': 0,
      'name': gear.name,
      'notes': gear.description,
      'weight': gear.weight,
      'savingThrowMod': 0
    };
  }

  processPackTool(tool: Tool, itemQuantity: ItemQuantity): object {
    return {
      'type': 'Tool',
      'attuned': false,
      'characterItemId': 0,
      'charges': 0,
      'containerId': 0,
      'cursed': false,
      'dropped': false,
      'quantity': itemQuantity.quantity,
      'category': this.processTool(tool),
      'cost': tool.cost,
      'costUnits': this.exportSharedService.getCostUnit(tool.costUnit),
      'id': 0,
      'name': tool.name,
      'notes': tool.description,
      'weight': tool.weight,
      'savingThrowMod': 0
    };
  }

  async processPackMagicalItem(magicalItem: MagicalItem, itemQuantity: ItemQuantity): Promise<object> {
    return {
      'type': 'MagicalItem',
      'attuned': false,
      'characterItemId': 0,
      'charges': 0,
      'containerId': 0,
      'cursed': false,
      'dropped': false,
      'poisoned': false,
      'quantity': itemQuantity.quantity,
      'silvered': false,
      'category': await this.processMagicalItemCategory(magicalItem),
      'chosenArmor': await this.getChosenArmor(magicalItem, itemQuantity),
      'chosenWeapon': await this.getChosenWeapon(magicalItem, itemQuantity),
      'spells': [],
      'cost': magicalItem.cost,
      'costUnits': this.exportSharedService.getCostUnit(magicalItem.costUnit),
      'id': 0,
      'notes': magicalItem.description,
      'savingThrowMod': 0
    };
  }

  private async getChosenArmor(magicalItem: MagicalItem, itemQuantity: ItemQuantity): Promise<object> {
    if (magicalItem.magicalItemType !== MagicalItemType.ARMOR) {
      return null;
    }
    const item: ItemListObject = itemQuantity.item == null ? null : itemQuantity.item.subItem;
    let armor: Armor = null;
    if (item != null) {
      const subItem = await this.exportCacheService.getItem(item.id);
      armor = subItem as Armor;
    }
    if (armor == null) {
      return null;
    }
    return {
      'type': 'BasicArmor',
      'attuned': false,
      'characterItemId': 0,
      'charges': 0,
      'containerId': 0,
      'cursed': false,
      'dropped': false,
      'quantity': 0,
      'category': this.processArmor(armor),
      'cost': armor.cost,
      'costUnits': this.exportSharedService.getCostUnit(armor.costUnit),
      'id': 0,
      'name': armor.name,
      'notes': armor.description,
      'savingThrowMod': 0,
      'weight': armor.weight
    };
  }

  private async getChosenWeapon(magicalItem: MagicalItem, itemQuantity: ItemQuantity): Promise<object> {
    if (magicalItem.magicalItemType !== MagicalItemType.WEAPON) {
      return null;
    }
    const item: ItemListObject = itemQuantity.item == null ? null : itemQuantity.item.subItem;
    let weapon: Weapon = null;
    if (item != null) {
      const subItem = await this.exportCacheService.getItem(item.id);
      weapon = subItem as Weapon;
    }
    if (weapon == null) {
      return null;
    }
    const versatile = weapon.versatileDamages.length > 0 ? weapon.versatileDamages[0] : null;
    return {
      'type': 'BasicWeapon',
      'attuned': false,
      'characterItemId': 0,
      'charges': 0,
      'containerId': 0,
      'cursed': false,
      'dropped': false,
      'poisoned': false,
      'quantity': 0,
      'silvered': false,
      'category': await this.processWeapon(weapon),
      'ammo': await this.processWeaponAmmo(weapon.ammoType),
      'attackModifier': 0,
      'cost': weapon.cost,
      'costUnits': this.exportSharedService.getCostUnit(weapon.costUnit),
      'damageModifier': 0,
      'id': 0,
      'name': weapon.name,
      'notes': weapon.description,
      'rangeLong': weapon.longRange,
      'rangeNormal': weapon.normalRange,
      'versatileDamageDice': versatile == null ? 0 : versatile.values.numDice,
      'versatileDamageDiceSize': versatile == null ? 0 : this.exportSharedService.getDiceSize(versatile.values.diceSize),
      'weight': weapon.weight,
      'melee': weapon.rangeType === WeaponRangeType.MELEE,
      'savingThrowMod': 0
    };
  }

  processPackTreasure(treasure: Treasure, itemQuantity: ItemQuantity): object {
    return {
      'type': 'Treasure',
      'attuned': false,
      'characterItemId': 0,
      'charges': 0,
      'containerId': 0,
      'cursed': false,
      'dropped': false,
      'quantity': itemQuantity.quantity,
      'category': this.processTreasure(treasure),
      'cost': treasure.cost,
      'costUnits': this.exportSharedService.getCostUnit(treasure.costUnit),
      'id': 0,
      'name': treasure.name,
      'notes': treasure.description,
      'weight': treasure.weight,
      'savingThrowMod': 0
    };
  }

  processPackMount(mount: Mount, itemQuantity: ItemQuantity): object {
    return {
      'type': 'BasicMount',
      'attuned': false,
      'characterItemId': 0,
      'charges': 0,
      'containerId': 0,
      'cursed': false,
      'dropped': false,
      'quantity': itemQuantity.quantity,
      'category': this.processMount(mount),
      'cost': mount.cost,
      'costUnits': this.exportSharedService.getCostUnit(mount.costUnit),
      'id': 0,
      'name': mount.name,
      'notes': mount.description,
      'savingThrowMod': 0
    };
  }
}
