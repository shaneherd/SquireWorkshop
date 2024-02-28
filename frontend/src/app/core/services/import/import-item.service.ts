import {Injectable} from '@angular/core';
import {Item} from '../../../shared/models/items/item';
import {
  ImportAbility,
  ImportAmmo,
  ImportAmmoCategory,
  ImportArmor,
  ImportArmorCategory,
  ImportAttackDamage,
  ImportBasicAmmo,
  ImportBasicArmor,
  ImportBasicMount,
  ImportBasicWeapon,
  ImportDamageTypeItem,
  ImportDiceSize,
  ImportEquipment,
  ImportEquipmentObject,
  ImportEquipmentSlot,
  ImportEquipmentSlotType,
  ImportGear,
  ImportGearCategory,
  ImportItem,
  ImportItemConfiguration,
  ImportItemType,
  ImportListObject,
  ImportMagicalItem,
  ImportMagicalItemCategory,
  ImportMagicalItemType,
  ImportMount,
  ImportMountCategory,
  ImportPack,
  ImportPackCategory,
  ImportRarity,
  ImportSpell,
  ImportStoredSpell,
  ImportTool,
  ImportToolCategory,
  ImportTreasure,
  ImportTreasureCategory,
  ImportWeapon,
  ImportWeaponCategory,
  ImportWeaponProperty
} from '../../../shared/imports/import-item';
import {ListObject} from '../../../shared/models/list-object';
import {ImportSharedService} from './import-shared.service';
import {ItemService} from '../items/item.service';
import {ImportCacheService} from './import-cache.service';
import {ItemType} from '../../../shared/models/items/item-type.enum';
import * as _ from 'lodash';
import {Ammo} from '../../../shared/models/items/ammo';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {Armor} from '../../../shared/models/items/armor';
import {SID} from '../../../constants';
import {Gear} from '../../../shared/models/items/gear';
import {Mount} from '../../../shared/models/items/mount';
import {EquipmentSlotType} from '../../../shared/models/items/equipment-slot-type.enum';
import {Tool} from '../../../shared/models/items/tool';
import {Weapon} from '../../../shared/models/items/weapon';
import {WeaponRangeType} from '../../../shared/models/items/weapon-range-type.enum';
import {WeaponProperty} from '../../../shared/models/attributes/weapon-property';
import {DamageConfiguration} from '../../../shared/models/damage-configuration';
import {Treasure} from '../../../shared/models/items/treasure';
import {Pack} from '../../../shared/models/items/pack';
import {ItemQuantity} from '../../../shared/models/items/item-quantity';
import {ItemListObject} from '../../../shared/models/items/item-list-object';
import {ImportAttributeService} from './import-attribute.service';
import {AbilityService} from '../attributes/ability.service';
import {EquipmentSlot} from '../../../shared/models/items/equipment-slot';
import {EquipmentSlotService} from '../items/equipment-slot.service';
import {MagicalItem} from '../../../shared/models/items/magical-item';
import {MagicalItemAttunementType} from '../../../shared/models/items/magical-item-attunement-type.enum';
import {DiceCollection} from '../../../shared/models/characteristics/dice-collection';
import {MagicalItemType} from '../../../shared/models/items/magical-item-type.enum';
import {Rarity} from '../../../shared/models/items/rarity.enum';
import {MagicalItemTable, MagicalItemTableRow} from '../../../shared/models/items/magical-item-table';
import {MagicalItemApplicability} from '../../../shared/models/items/magical-item-applicability';
import {FilterValue} from '../../components/filters/filter-value';
import {FilterKey} from '../../components/filters/filter-key.enum';
import {Filters} from '../../components/filters/filters';
import {MagicalItemSpellAttackCalculationType} from '../../../shared/models/items/magical-item-spell-attack-calculation-type.enum';
import {MagicalItemApplicabilityType} from '../../../shared/models/items/magical-item-applicability-type.enum';
import {ImportPowerService} from './import-power.service';
import {MagicalItemSpellConfiguration} from '../../../shared/models/items/magical-item-spell-configuration';
import {SpellListObject} from '../../../shared/models/powers/spell-list-object';
import {Spell} from '../../../shared/models/powers/spell';
import {AttackType} from '../../../shared/models/attack-type.enum';
import {CreatureItem} from '../../../shared/models/creatures/creature-item';
import {Vehicle} from '../../../shared/models/items/vehicle';

@Injectable({
  providedIn: 'root'
})
export class ImportItemService {

  constructor(
    private itemService: ItemService,
    private abilityService: AbilityService,
    private equipmentSlotService: EquipmentSlotService,
    private importSharedService: ImportSharedService,
    private importCacheService: ImportCacheService,
    private importAttributeService: ImportAttributeService,
    private importPowerService: ImportPowerService
  ) { }

  private processItem(item: Item, importItem: ImportItem): Promise<any> {
    switch (importItem.selectedAction) {
      case 'REPLACE_EXISTING':
        item.id = importItem.selectedDuplicate.id;
        return this.itemService.updateItem(item).then(() => {
          this.importSharedService.completeItem(importItem, item.id);
        }, () => {
          this.importSharedService.finishImportingItem(importItem, false);
        });
      case 'INSERT_AS_NEW':
        return this.itemService.createItem(item).then((id: string) => {
          const cache = this.importCacheService.getItems(item.itemType);
          if (cache != null) {
            const listObject = new ListObject(id, item.name);
            cache.push(listObject);
          }
          item.id = id;
          this.importSharedService.completeItem(importItem, id);
        }, () => {
          this.importSharedService.finishImportingItem(importItem, false);
        });
      default:
        return Promise.resolve();
    }
  }

  private getEquipmentSlotType(equipmentSlotType: ImportEquipmentSlotType): EquipmentSlotType {
    switch (equipmentSlotType.name) {
      case 'None':
        return null;
      case 'Hand':
        return EquipmentSlotType.HAND;
      case 'Body':
        return EquipmentSlotType.BODY;
      case 'Back':
        return EquipmentSlotType.BACK;
      case 'Neck':
        return EquipmentSlotType.NECK;
      case 'Gloves':
        return EquipmentSlotType.GLOVES;
      case 'Finger':
        return EquipmentSlotType.FINGER;
      case 'Head':
        return EquipmentSlotType.HEAD;
      case 'Waist':
        return EquipmentSlotType.WAIST;
      case 'Feet':
        return EquipmentSlotType.FEET;
      case 'Mount':
        return EquipmentSlotType.MOUNT;
    }
  }

  getEquipmentSlot(equipmentSlot: ImportEquipmentSlot): EquipmentSlot {
    if (equipmentSlot == null || equipmentSlot.id === 0) {
      return null;
    }
    const equipmentSlotType = this.getEquipmentSlotType(equipmentSlot.equipmentSlotType);
    const slots = this.equipmentSlotService.getEquipmentSlotsByType(equipmentSlotType);
    let slot = _.find(slots, (_slot: EquipmentSlot) => { return _slot.name === equipmentSlot.name; });
    if (slot == null && slots.length > 0) {
      slot = slots[0];
    }
    return slot;
  }

  getEquipmentObject(item: ImportEquipment): ImportEquipmentObject {
    switch (item.type) {
      case 'AmmoCategory':
        return new ImportBasicAmmo(item.name, item as ImportAmmoCategory);
      case 'ArmorCategory':
        return new ImportBasicArmor(item.name, item as ImportArmorCategory);
      case 'GearCategory':
        return new ImportGear(item.name, item as ImportGearCategory);
      case 'MountCategory':
        return new ImportBasicMount(item.name, item as ImportMountCategory);
      case 'ToolCategory':
        return new ImportTool(item.name, item as ImportToolCategory);
      case 'WeaponCategory':
        return new ImportBasicWeapon(item.name, item as ImportWeaponCategory);
      case 'MagicalItemCategory':
        return new ImportMagicalItem(item.name, item as ImportMagicalItemCategory);
      case 'TreasureCategory':
        return new ImportTreasure(item.name, item as ImportTreasureCategory);
      case 'PackCategory':
        return new ImportPack(item.name, item as ImportPackCategory);
    }
    return item as ImportEquipmentObject;
  }

  findAllMatches(importItem: ImportItem, list: ImportItem[]): ImportItem[] {
    switch (importItem.type) {
      case 'AmmoCategory':
      case 'Ammo':
      case 'BasicAmmo':
        return this.findAllAmmoMatches(importItem, list);
      case 'ArmorCategory':
      case 'Armor':
      case 'BasicArmor':
        return this.findAllArmorMatches(importItem, list);
      case 'GearCategory':
      case 'Gear':
        return this.findAllGearMatches(importItem, list);
      case 'MountCategory':
      case 'Mount':
      case 'BasicMount':
        return this.findAllMountMatches(importItem, list);
      case 'Tool':
      case 'ToolCategory':
        return this.findAllToolMatches(importItem, list);
      case 'WeaponCategory':
      case 'Weapon':
      case 'BasicWeapon':
        return this.findAllWeaponMatches(importItem, list);
      case 'MagicalItem':
      case 'MagicalItemCategory':
        return this.findAllMagicalItemMatches(importItem, list);
      case 'Treasure':
      case 'TreasureCategory':
        return this.findAllTreasureMatches(importItem, list);
      case 'Pack':
      case 'PackCategory':
        return this.findAllPackMatches(importItem, list);
    }

    return [];
  }

  /****************** Equipment *********************/

  getPrioritizedConfigItemsForEquipment(config: ImportItemConfiguration): ImportItemConfiguration[] {
    switch (config.importItem.type) {
      case 'Pack':
      case 'PackCategory':
        return this.getPrioritizedConfigItemsForPack(config);
    }
    const configs: ImportItemConfiguration[] = [];
    configs.push(config);
    return configs;
  }

  getItemType(importItem: ImportItem): ItemType {
    switch (importItem.type) {
      case 'AmmoCategory':
      case 'Ammo':
      case 'BasicAmmo':
        return ItemType.AMMO;
      case 'ArmorCategory':
      case 'Armor':
      case 'BasicArmor':
        return ItemType.ARMOR;
      case 'GearCategory':
      case 'Gear':
        return ItemType.GEAR;
      case 'MountCategory':
      case 'Mount':
      case 'BasicMount':
        return ItemType.MOUNT;
      case 'Tool':
      case 'ToolCategory':
        return ItemType.TOOL;
      case 'WeaponCategory':
      case 'Weapon':
      case 'BasicWeapon':
        return ItemType.WEAPON;
      case 'MagicalItem':
      case 'MagicalItemCategory':
        return ItemType.MAGICAL_ITEM;
      case 'Treasure':
      case 'TreasureCategory':
        return ItemType.TREASURE;
      case 'Pack':
      case 'PackCategory':
        return ItemType.PACK;
    }
  }

  async getCreatureItem(importItem: ImportItem): Promise<CreatureItem> {
    const item: Item = await this.getEquipment(importItem);
    const creatureItem = new CreatureItem();
    creatureItem.item = item;

    if (importItem.type === 'MagicalItem' && item.itemType === ItemType.MAGICAL_ITEM) {
      const importMagicalItem = importItem as ImportMagicalItem;
      const magicalItem = item as MagicalItem;
      let subItem: Item = null;

      if (magicalItem.magicalItemType === MagicalItemType.WEAPON && importMagicalItem.chosenWeapon != null) {
        subItem = await this.getEquipment(importMagicalItem.chosenWeapon);
      } else if (magicalItem.magicalItemType === MagicalItemType.AMMO && importMagicalItem.chosenAmmo != null) {
        subItem = await this.getEquipment(importMagicalItem.chosenAmmo);
      } else if (magicalItem.magicalItemType === MagicalItemType.ARMOR && importMagicalItem.chosenArmor != null) {
        subItem = await this.getEquipment(importMagicalItem.chosenArmor);
      }

      creatureItem.magicalItem = subItem;
    }
    return creatureItem;
  }

  getEquipment(importItem: ImportItem): Promise<Item> {
    switch (importItem.type) {
      case 'AmmoCategory':
      case 'Ammo':
      case 'BasicAmmo':
        return this.getAmmo(importItem);
      case 'ArmorCategory':
      case 'Armor':
      case 'BasicArmor':
        return this.getArmor(importItem);
      case 'GearCategory':
      case 'Gear':
        return this.getGear(importItem);
      case 'MountCategory':
      case 'Mount':
      case 'BasicMount':
        return this.getMount(importItem);
      case 'Tool':
      case 'ToolCategory':
        return this.getTool(importItem);
      case 'WeaponCategory':
      case 'Weapon':
      case 'BasicWeapon':
        return this.getWeapon(importItem);
      case 'MagicalItem':
      case 'MagicalItemCategory':
        return this.getMagicalItem(importItem);
      case 'Treasure':
      case 'TreasureCategory':
        return this.getTreasure(importItem);
      case 'Pack':
      case 'PackCategory':
        return this.getPack(importItem);
    }
    return Promise.resolve(null);
  }

  processEquipment(config: ImportItemConfiguration): Promise<any> {
    const equipmentImportItem = config.importItem as ImportEquipment;
    return this.getEquipment(config.importItem).then(async (item: Item) => {
      switch (equipmentImportItem.type) {
        case 'AmmoCategory':
        case 'Ammo':
        case 'BasicAmmo':
          return this.processAmmo(config, item);
        case 'ArmorCategory':
        case 'Armor':
        case 'BasicArmor':
          return this.processArmor(config, item);
        case 'GearCategory':
        case 'Gear':
          return this.processGear(config, item);
        case 'MountCategory':
        case 'Mount':
        case 'BasicMount':
          return this.processMount(config, item);
        case 'Tool':
        case 'ToolCategory':
          return this.processTool(config, item);
        case 'WeaponCategory':
        case 'Weapon':
        case 'BasicWeapon':
          return this.processWeapon(config, item);
        case 'MagicalItem':
        case 'MagicalItemCategory':
          return this.processMagicalItem(config, item);
        case 'Treasure':
        case 'TreasureCategory':
          return this.processTreasure(config, item);
        case 'Pack':
        case 'PackCategory':
          return this.processPack(config, item);
      }
      return Promise.reject();
    });
  }

  private async getCachedEquipmentObject(importItem: ImportEquipment, itemType: ItemType): Promise<Item> {
    const finalItem = await this.getEquipment(importItem);
    finalItem.id = '0';
    const cachedItem = this.getCachedItemByName(itemType, importItem.name);
    if (cachedItem != null) {
      finalItem.id = cachedItem.id;
    }
    return finalItem;
  }

  getCachedItemByName(itemType: ItemType, name: string): ListObject {
    const cache = this.importCacheService.getItems(itemType);
    return _.find(cache, function(_item) { return _item.name.toLowerCase() === name.toLowerCase() });
  }

  private getItemTypeByImportItemType(type: ImportItemType): ItemType {
    switch (type) {
      case 'AmmoCategory':
      case 'Ammo':
      case 'BasicAmmo':
        return ItemType.AMMO;
      case 'ArmorCategory':
      case 'Armor':
      case 'BasicArmor':
        return ItemType.ARMOR;
      case 'GearCategory':
      case 'Gear':
        return ItemType.GEAR;
      case 'MountCategory':
      case 'Mount':
      case 'BasicMount':
        return ItemType.MOUNT;
      case 'Tool':
      case 'ToolCategory':
        return ItemType.TOOL;
      case 'WeaponCategory':
      case 'Weapon':
      case 'BasicWeapon':
        return ItemType.WEAPON;
      case 'MagicalItem':
      case 'MagicalItemCategory':
        return ItemType.MAGICAL_ITEM;
      case 'Treasure':
      case 'TreasureCategory':
        return ItemType.TREASURE;
      case 'Pack':
      case 'PackCategory':
        return ItemType.PACK;
    }
    return null;
  }

  equipmentAddMissingChildren(importItem: ImportEquipment): void {
    switch (importItem.type) {
      case 'AmmoCategory':
      case 'Ammo':
      case 'BasicAmmo':
        this.ammoAddMissingChildren(importItem);
        break;
      case 'ArmorCategory':
      case 'Armor':
      case 'BasicArmor':
        this.armorAddMissingChildren(importItem);
        break;
      case 'GearCategory':
      case 'Gear':
        this.gearAddMissingChildren(importItem);
        break;
      case 'MountCategory':
      case 'Mount':
      case 'BasicMount':
        this.mountAddMissingChildren(importItem);
        break;
      case 'Tool':
      case 'ToolCategory':
        this.toolAddMissingChildren(importItem);
        break;
      case 'WeaponCategory':
      case 'Weapon':
      case 'BasicWeapon':
        this.weaponAddMissingChildren(importItem);
        break;
      case 'MagicalItem':
      case 'MagicalItemCategory':
        this.magicalItemAddMissingChildren(importItem);
        break;
      case 'Treasure':
      case 'TreasureCategory':
        this.treasureAddMissingChildren(importItem);
        break;
      case 'Pack':
      case 'PackCategory':
        this.packAddMissingChildren(importItem);
        break;
    }
  }

  validateEquipment(importItem: ImportEquipment): boolean {
    switch (importItem.type) {
      case 'AmmoCategory':
      case 'Ammo':
      case 'BasicAmmo':
        return this.validateAmmo(importItem);
      case 'ArmorCategory':
      case 'Armor':
      case 'BasicArmor':
        return this.validateArmor(importItem);
      case 'GearCategory':
      case 'Gear':
        return this.validateGear(importItem);
      case 'MountCategory':
      case 'Mount':
      case 'BasicMount':
        return this.validateMount(importItem);
      case 'Tool':
      case 'ToolCategory':
        return this.validateTool(importItem);
      case 'WeaponCategory':
      case 'Weapon':
      case 'BasicWeapon':
        return this.validateWeapon(importItem);
      case 'MagicalItem':
      case 'MagicalItemCategory':
        return this.validateMagicalItem(importItem);
      case 'Treasure':
      case 'TreasureCategory':
        return this.validateTreasure(importItem);
      case 'Pack':
      case 'PackCategory':
        return this.validatePack(importItem);
    }

    return false;
  }

  /****************** Ammo *********************/

  getPossibleDuplicatesForAmmo(importItem: ImportItem): ListObject[] {
    const source: ListObject[] = this.importCacheService.getItems(ItemType.AMMO);
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  private async getCachedAmmo(importItem: ImportAmmoCategory): Promise<Ammo> {
    const finalAmmo = await this.getAmmo(importItem);
    if (finalAmmo != null) {
      finalAmmo.id = '0';
      const cache = this.importCacheService.getItems(ItemType.AMMO);
      const cachedAmmo = _.find(cache, function(ammo) { return ammo.name.toLowerCase() === importItem.name.toLowerCase() });
      if (cachedAmmo != null) {
        finalAmmo.id = cachedAmmo.id;
      }
    }
    return finalAmmo;
  }

  private getCachedAmmoListObject(importItem: ImportAmmoCategory): Promise<ListObject> {
    if (importItem.name === '') {
      return Promise.resolve(null);
    }
    return this.getCachedAmmo(importItem).then((ammo: Ammo) => {
      if (ammo == null) {
        return null;
      }
      return new ListObject(ammo.id, ammo.name);
    });
  }

  async getAmmo(importItem: ImportEquipment): Promise<Ammo> {
    if (importItem == null) {
      return null;
    }
    let category: ImportAmmoCategory = null;
    switch (importItem.type) {
      case 'AmmoCategory':
        category = importItem as ImportAmmoCategory;
        break;
      case 'Ammo':
        const ammoImport = importItem as ImportAmmo;
        category = ammoImport.category;
        break;
      case 'BasicAmmo':
        const basicAmmo = importItem as ImportBasicAmmo;
        category = basicAmmo.category;
        break;
    }

    const ammo = new Ammo();
    if (category != null) {
      ammo.name = importItem.name;
      ammo.cost = category.cost;
      ammo.costUnit = this.importSharedService.getCostUnit(category.costUnits);
      ammo.weight = category.weight;
      ammo.description = category.notes;
      ammo.damages = [];

      if (importItem.type === 'Ammo') {
        const ammoImport = importItem as ImportAmmo;
        ammo.cost = ammoImport.cost;
        ammo.costUnit = this.importSharedService.getCostUnit(ammoImport.costUnits);
        ammo.weight = ammoImport.weight;
        ammo.description = ammoImport.notes;
        ammo.attackModifier = ammoImport.attackMod;

        if (ammoImport.damageMod !== 0) {
          await this.importCacheService.getAttributesByType(AttributeType.DAMAGE_TYPE);
          ammo.damages.push(this.getDamageConfiguration(0, 0, ammoImport.damageTypeImportItem));
          ammo.damages[0].values.miscModifier = ammoImport.damageMod;
        }
      }
    }
    return ammo;
  }

  private async processAmmo(config: ImportItemConfiguration, item: Item): Promise<any> {
    if (item.itemType !== ItemType.AMMO) {
      return Promise.reject();
    }
    const ammo = item as Ammo;
    if (config.importItem.type === 'Ammo') {
      const ammoImport = config.importItem as ImportAmmo;
      if (ammoImport.damageTypeImportItem != null && ammo.damages.length > 0) {
        ammo.damages[0].damageType = await this.importAttributeService.processDamageTypeDependency(ammoImport.damageTypeImportItem);
      }
    }
    return this.processItem(ammo, config.importItem);
  }

  async processItemDependency(importItem: ImportEquipment): Promise<Item> {
    const type = this.getItemTypeByImportItemType(importItem.type);
    const cached = await this.getCachedEquipmentObject(importItem, type);
    if (cached != null && cached.id === '0') {
      importItem.selectedAction = 'INSERT_AS_NEW';
      await this.processItem(cached, importItem).then(() => {
        cached.id = importItem.finalId;
      });
    }
    return cached;
  }

  async processAmmoDependency(importItem: ImportAmmoCategory): Promise<Ammo> {
    await this.importCacheService.getItemsByType(ItemType.AMMO);
    const cached = await this.getCachedAmmo(importItem);
    if (cached != null && cached.id === '0') {
      importItem.selectedAction = 'INSERT_AS_NEW';
      await this.processItem(cached, importItem).then(() => {
        cached.id = importItem.finalId;
      });
    }
    return cached;
  }

  private ammoAddMissingChildren(importItem: ImportEquipment): void {
    if (importItem.type === 'Ammo') {
      const ammoImport = importItem as ImportAmmo;
      const damageTypeImportItem = this.importAttributeService.getDamageTypeImportItem(ammoImport.damageType);
      this.importSharedService.initializeImportItem(damageTypeImportItem);
      ammoImport.damageTypeImportItem = damageTypeImportItem;
    }
  }

  private validateAmmo(importItem: ImportEquipment): boolean {
    return importItem.name != null
      && importItem.name !== '';
  }

  private findAllAmmoMatches(importItem: ImportItem, list: ImportItem[]): ImportItem[] {
    return _.filter(list, (_importItem: ImportItem) => {
      const left = _importItem.type === 'BasicAmmo' ? (_importItem as ImportBasicAmmo).category : _importItem;
      const right = importItem.type === 'BasicAmmo' ? (importItem as ImportBasicAmmo).category : importItem;
      return this.importSharedService.deepEqual(left, right);
    });
  }

  /****************** Armor *********************/

  getPossibleDuplicatesForArmor(importItem: ImportItem): ListObject[] {
    const source: ListObject[] = this.importCacheService.getItems(ItemType.ARMOR);
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  private async getCachedArmor(importItem: ImportArmorCategory): Promise<Armor> {
    const finalArmor = await this.getArmor(importItem);
    finalArmor.id = '0';
    const cache = this.importCacheService.getItems(ItemType.ARMOR);
    const cachedArmor = _.find(cache, function(armor) { return armor.name.toLowerCase() === importItem.name.toLowerCase() });
    if (cachedArmor != null) {
      finalArmor.id = cachedArmor.id;
    }
    return finalArmor;
  }

  async processArmorDependency(importItem: ImportArmorCategory): Promise<Armor> {
    await this.importCacheService.getItemsByType(ItemType.ARMOR);
    const cached = await this.getCachedArmor(importItem);
    if (cached.id === '0') {
      importItem.selectedAction = 'INSERT_AS_NEW';
      await this.processItem(cached, importItem).then(() => {
        cached.id = importItem.finalId;
      });
    }
    return cached;
  }

  async getArmor(importItem: ImportEquipment): Promise<Armor> {
    let category: ImportArmorCategory = null;
    switch (importItem.type) {
      case 'ArmorCategory':
        category = importItem as ImportArmorCategory;
        break;
      case 'Armor':
        const armorImport = importItem as ImportArmor;
        category = armorImport.category;
        break;
      case 'BasicArmor':
        const basicArmor = importItem as ImportBasicArmor;
        category = basicArmor.category;
        break;
    }

    const armor = new Armor();
    if (category != null) {
      armor.name = importItem.name;
      armor.cost = category.cost;
      armor.costUnit = this.importSharedService.getCostUnit(category.costUnits);
      armor.weight = category.weight;
      armor.description = category.notes;

      armor.ac = category.ac;
      await this.importCacheService.getAttributesByType(AttributeType.ARMOR_TYPE);
      armor.armorType = this.importAttributeService.getCachedArmorType(category.armorType);
      armor.equippable = true;
      armor.slot = this.getEquipmentSlotType(category.equipmentSlotType);
      armor.abilityModifier = this.abilityService.getAbilityBySid(SID.ABILITIES.DEXTERITY);
      armor.maxAbilityModifier = category.maxDexMod;
      armor.minStrength = category.minStr;
      armor.ignoreWeight = category.ignoreWeightOfContents;
      armor.stealthDisadvantage = category.stealthDisadvantage;
      armor.container = category.container;

      if (importItem.type === 'Armor') {
        const armorImport = importItem as ImportArmor;
        armor.cost = armorImport.cost;
        armor.costUnit = this.importSharedService.getCostUnit(armorImport.costUnits);
        armor.weight = armorImport.weight;
        armor.description = armorImport.notes;
        armor.ac = category.ac + armorImport.acMod;
      }
    }
    return armor;
  }

  private async processArmor(config: ImportItemConfiguration, item: Item): Promise<any> {
    if (item.itemType !== ItemType.ARMOR) {
      return Promise.reject();
    }
    const armor = item as Armor;
    let category: ImportArmorCategory = null;
    switch (config.importItem.type) {
      case 'ArmorCategory':
        category = config.importItem as ImportArmorCategory;
        break;
      case 'Armor':
        const armorImport = config.importItem as ImportArmor;
        category = armorImport.category;
        break;
      case 'BasicArmor':
        const basicArmor = config.importItem as ImportBasicArmor;
        category = basicArmor.category;
        break;
    }

    if (category != null) {
      armor.armorType = await this.importAttributeService.processArmorTypeDependency(category.armorType);
    }
    return this.processItem(armor, config.importItem);
  }

  private armorAddMissingChildren(importItem: ImportEquipment): void {
    let category: ImportArmorCategory = null;
    switch (importItem.type) {
      case 'ArmorCategory':
        category = importItem as ImportArmorCategory;
        break;
      case 'Armor':
        const armorImport = importItem as ImportArmor;
        category = armorImport.category;
        break;
      case 'BasicArmor':
        const basicArmor = importItem as ImportBasicArmor;
        category = basicArmor.category;
        break;
    }

    if (category != null) {
      this.importSharedService.initializeImportItem(category.armorType);
    }
  }

  private validateArmor(importItem: ImportEquipment): boolean {
    let category: ImportArmorCategory = null;
    switch (importItem.type) {
      case 'ArmorCategory':
        category = importItem as ImportArmorCategory;
        break;
      case 'Armor':
        const armorImport = importItem as ImportArmor;
        category = armorImport.category;
        break;
      case 'BasicArmor':
        const basicArmor = importItem as ImportBasicArmor;
        category = basicArmor.category;
        break;
    }

    return category != null
      && importItem.name != null
      && importItem.name !== ''
      && category.armorType != null
      && category.equipmentSlotType != null;
  }

  private findAllArmorMatches(importItem: ImportItem, list: ImportItem[]): ImportItem[] {
    return _.filter(list, (_importItem: ImportItem) => {
      const left = _importItem.type === 'BasicArmor' ? (_importItem as ImportBasicArmor).category : _importItem;
      const right = importItem.type === 'BasicArmor' ? (importItem as ImportBasicArmor).category : importItem;
      return this.importSharedService.deepEqual(left, right);
    });
  }

  /****************** Gear *********************/

  getPossibleDuplicatesForGear(importItem: ImportItem): ListObject[] {
    const source: ListObject[] = this.importCacheService.getItems(ItemType.GEAR);
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  async getGear(importItem: ImportEquipment): Promise<Gear> {
    let category: ImportGearCategory = null;
    switch (importItem.type) {
      case 'GearCategory':
        category = importItem as ImportGearCategory;
        break;
      case 'Gear':
        const gearImport = importItem as ImportGear;
        category = gearImport.category;
        break;
    }

    const gear = new Gear();
    if (category != null) {
      gear.name = importItem.name;
      gear.cost = category.cost;
      gear.costUnit = this.importSharedService.getCostUnit(category.costUnits);
      gear.weight = category.weight;
      gear.description = category.notes;
      gear.equippable = category.equippable;
      gear.slot = this.getEquipmentSlotType(category.equipmentSlotType);
      gear.container = category.container;
      gear.ignoreWeight = category.ignoreWeightOfContents;
      gear.expendable = category.useable;

      // if (importItem.type === 'Gear') {
      //   const gearImport = importItem as ImportGear;
      // }
    }
    return gear;
  }

  private processGear(config: ImportItemConfiguration, item: Item): Promise<any> {
    if (item.itemType !== ItemType.GEAR) {
      return Promise.reject();
    }
    return this.processItem(item, config.importItem);
  }

  private gearAddMissingChildren(importItem: ImportEquipment): void {
    //no children
  }

  private validateGear(importItem: ImportEquipment): boolean {
    let category: ImportGearCategory = null;
    switch (importItem.type) {
      case 'GearCategory':
        category = importItem as ImportGearCategory;
        break;
      case 'Gear':
        const gearImport = importItem as ImportGear;
        category = gearImport.category;
        break;
    }

    return category != null
      && importItem.name != null
      && importItem.name !== ''
      && (!category.equippable || category.equipmentSlotType != null);
  }

  private findAllGearMatches(importItem: ImportItem, list: ImportItem[]): ImportItem[] {
    return _.filter(list, (_importItem: ImportItem) => {
      const left = _importItem.type === 'Gear' ? (_importItem as ImportGear).category : _importItem;
      const right = importItem.type === 'Gear' ? (importItem as ImportGear).category : importItem;
      return this.importSharedService.deepEqual(left, right);
    });
  }

  /****************** Mount *********************/

  getPossibleDuplicatesForMount(importItem: ImportItem): ListObject[] {
    const source: ListObject[] = this.importCacheService.getItems(ItemType.MOUNT);
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  async getMount(importItem: ImportEquipment): Promise<Mount> {
    let category: ImportMountCategory = null;
    switch (importItem.type) {
      case 'MountCategory':
        category = importItem as ImportMountCategory;
        break;
      case 'Mount':
        const mountImport = importItem as ImportMount;
        category = mountImport.category;
        break;
      case 'BasicMount':
        const basicMount = importItem as ImportBasicMount;
        category = basicMount.category;
        break;
    }

    const mount = new Mount();
    if (category != null) {
      mount.name = importItem.name;
      mount.cost = category.cost;
      mount.costUnit = this.importSharedService.getCostUnit(category.costUnits);
      mount.description = category.notes;
      mount.speed = category.speed;
      mount.carryingCapacity = category.carryingCapacity;
      mount.slot = EquipmentSlotType.MOUNT;

      if (importItem.type === 'Mount') {
        const mountImport = importItem as ImportMount;
        mount.cost = mountImport.cost;
        mount.costUnit = this.importSharedService.getCostUnit(mountImport.costUnits);
        mount.description = mountImport.notes;
        mount.speed = category.speed + mountImport.speedMod;
        mount.carryingCapacity = category.carryingCapacity + mountImport.carryingCapacityMod;
      }
    }
    return mount;
  }

  private processMount(config: ImportItemConfiguration, item: Item): Promise<any> {
    if (item.itemType !== ItemType.MOUNT) {
      return Promise.reject();
    }
    return this.processItem(item, config.importItem);
  }

  private mountAddMissingChildren(importItem: ImportEquipment): void {
    // no children
  }

  private validateMount(importItem: ImportEquipment): boolean {
    let category: ImportMountCategory = null;
    switch (importItem.type) {
      case 'MountCategory':
        category = importItem as ImportMountCategory;
        break;
      case 'Mount':
        const mountImport = importItem as ImportMount;
        category = mountImport.category;
        break;
      case 'BasicMount':
        const basicMount = importItem as ImportBasicMount;
        category = basicMount.category;
        break;
    }

    return category != null
      && importItem.name != null
      && importItem.name !== '';
  }

  private findAllMountMatches(importItem: ImportItem, list: ImportItem[]): ImportItem[] {
    return _.filter(list, (_importItem: ImportItem) => {
      const left = _importItem.type === 'BasicMount' ? (_importItem as ImportBasicMount).category : _importItem;
      const right = importItem.type === 'BasicMount' ? (importItem as ImportBasicMount).category : importItem;
      return this.importSharedService.deepEqual(left, right);
    });
  }

  /****************** Tool *********************/

  getPossibleDuplicatesForTool(importItem: ImportItem): ListObject[] {
    let category: ImportToolCategory = null;
    switch (importItem.type) {
      case 'ToolCategory':
        category = importItem as ImportToolCategory;
        break;
      case 'Tool':
        const toolImport = importItem as ImportTool;
        category = toolImport.category;
        break;
    }
    const itemType = category != null && category.categoryType.name === 'Vehicles' ? ItemType.VEHICLE : ItemType.TOOL;
    const source: ListObject[] = this.importCacheService.getItems(itemType);
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  async getTool(importItem: ImportEquipment): Promise<Tool|Vehicle> {
    let category: ImportToolCategory = null;
    switch (importItem.type) {
      case 'ToolCategory':
        category = importItem as ImportToolCategory;
        break;
      case 'Tool':
        const toolImport = importItem as ImportTool;
        category = toolImport.category;
        break;
    }

    const tool = new Tool();
    if (category != null) {
      if (category.categoryType.name === 'Vehicles') {
        const vehicle = new Vehicle();
        vehicle.name = importItem.name;
        vehicle.cost = category.cost;
        vehicle.costUnit = this.importSharedService.getCostUnit(category.costUnits);
        vehicle.weight = category.weight;
        vehicle.description = category.notes;
        vehicle.equippable = false;
        vehicle.container = true;
        vehicle.ignoreWeight = false;
        vehicle.expendable = false;
        return vehicle;
      }
      tool.name = importItem.name;
      tool.cost = category.cost;
      tool.costUnit = this.importSharedService.getCostUnit(category.costUnits);
      tool.weight = category.weight;
      tool.description = category.notes;
      tool.equippable = category.equippable;
      tool.slot = this.getEquipmentSlotType(category.equipmentSlotType);
      tool.container = category.container;
      tool.ignoreWeight = category.ignoreWeightOfContents;
      tool.expendable = category.useable;
      await this.importCacheService.getAttributesByType(AttributeType.TOOL_CATEGORY);
      tool.category = this.importAttributeService.getCachedToolCategoryType(category.categoryType);
    }
    return tool;
  }

  private async processTool(config: ImportItemConfiguration, item: Item): Promise<any> {
    if (item.itemType !== ItemType.TOOL && item.itemType !== ItemType.VEHICLE) {
      return Promise.reject();
    }
    if (item.itemType === ItemType.TOOL) {
      const tool = item as Tool;
      let category: ImportToolCategory = null;
      switch (config.importItem.type) {
        case 'ToolCategory':
          category = config.importItem as ImportToolCategory;
          break;
        case 'Tool':
          const toolImport = config.importItem as ImportTool;
          category = toolImport.category;
          break;
      }
      if (category != null) {
        tool.category = await this.importAttributeService.processToolCategoryDependency(category.categoryType);
      }
      return this.processItem(tool, config.importItem);
    } else if (item.itemType === ItemType.VEHICLE) {
      const vehicle = item as Vehicle;
      return this.processItem(vehicle, config.importItem);
    }
  }

  private toolAddMissingChildren(importItem: ImportEquipment): void {
    let category: ImportToolCategory = null;
    switch (importItem.type) {
      case 'ToolCategory':
        category = importItem as ImportToolCategory;
        break;
      case 'Tool':
        const toolImport = importItem as ImportTool;
        category = toolImport.category;
        break;
    }
    if (category != null) {
      this.importSharedService.initializeImportItem(category.categoryType);
    }
  }

  private validateTool(importItem: ImportEquipment): boolean {
    let category: ImportToolCategory = null;
    switch (importItem.type) {
      case 'ToolCategory':
        category = importItem as ImportToolCategory;
        break;
      case 'Tool':
        const toolImport = importItem as ImportTool;
        category = toolImport.category;
        break;
    }

    return category != null
      && importItem.name != null
      && importItem.name !== ''
      && (!category.equippable || category.equipmentSlotType != null);
  }

  private findAllToolMatches(importItem: ImportItem, list: ImportItem[]): ImportItem[] {
    return _.filter(list, (_importItem: ImportItem) => {
      const left = _importItem.type === 'Tool' ? (_importItem as ImportTool).category : _importItem;
      const right = importItem.type === 'Tool' ? (importItem as ImportTool).category : importItem;
      return this.importSharedService.deepEqual(left, right);
    });
  }

  /****************** Weapon *********************/

  getPossibleDuplicatesForWeapon(importItem: ImportItem): ListObject[] {
    const source: ListObject[] = this.importCacheService.getItems(ItemType.WEAPON);
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  async getWeapon(importItem: ImportEquipment): Promise<Weapon> {
    let category: ImportWeaponCategory = null;
    switch (importItem.type) {
      case 'WeaponCategory':
        category = importItem as ImportWeaponCategory;
        break;
      case 'Weapon':
        const weaponImport = importItem as ImportWeapon;
        category = weaponImport.category;
        break;
      case 'BasicWeapon':
        const basicWeapon = importItem as ImportBasicWeapon;
        category = basicWeapon.category;
        break;
    }

    const weapon = new Weapon();
    if (category != null) {
      weapon.name = importItem.name;
      weapon.cost = category.cost;
      weapon.costUnit = this.importSharedService.getCostUnit(category.costUnits);
      weapon.description = category.notes;
      weapon.weight = category.weight;
      weapon.slot = this.getEquipmentSlotType(category.equipmentSlotType);
      weapon.rangeType = category.melee ? WeaponRangeType.MELEE : WeaponRangeType.RANGED;
      weapon.normalRange = category.rangeNormal;
      weapon.longRange = category.rangeLong;

      await this.importCacheService.getAttributesByType(AttributeType.WEAPON_TYPE);
      weapon.weaponType = this.importAttributeService.getCachedWeaponType(category.weaponType);

      await this.importCacheService.getItemsByType(ItemType.AMMO);
      weapon.ammoType = await this.getCachedAmmoListObject(category.ammo);

      await this.importCacheService.getAttributesByType(AttributeType.DAMAGE_TYPE);
      weapon.damages = [];
      if (category.damageDice > 0) {
        weapon.damages.push(this.getDamageConfiguration(category.damageDice, category.damageDiceSize, category.damageTypeImportItem));
      }
      weapon.versatileDamages = [];
      if (category.versatileDamageDice > 0) {
        weapon.versatileDamages.push(this.getDamageConfiguration(category.versatileDamageDice, category.versatileDamageDiceSize, category.damageTypeImportItem));
      }

      await this.importCacheService.getAttributesByType(AttributeType.WEAPON_PROPERTY);
      weapon.properties = this.getWeaponPropertiesForWeapon(category.propertyItems);

      if (importItem.type === 'Weapon') {
        const weaponImport = importItem as ImportWeapon;
        weapon.cost = weaponImport.cost;
        weapon.costUnit = this.importSharedService.getCostUnit(weaponImport.costUnits);
        weapon.description = weaponImport.notes;
        weapon.weight = weaponImport.weight;

        weapon.normalRange = weaponImport.rangeNormal;
        weapon.longRange = weaponImport.rangeLong;
        weapon.ammoType = await this.getCachedAmmoListObject(weaponImport.ammo);

        if (weapon.damages.length === 0) {
          weapon.damages.push(this.getDamageConfiguration(0, 0, null));
        }
        weapon.damages[0].values.miscModifier = weaponImport.damageModifier;

        if (weaponImport.versatileDamageDice > 0) {
          weapon.versatileDamages = [];
          weapon.versatileDamages.push(this.getDamageConfiguration(weaponImport.versatileDamageDice, weaponImport.versatileDamageDiceSize, category.damageTypeImportItem));
        }

        weapon.attackMod = weaponImport.attackModifier;
        weapon.properties = weapon.properties.concat(this.getWeaponPropertiesForWeapon(weaponImport.propertyItems));
      }
    }
    return weapon;
  }

  private getWeaponPropertiesForWeapon(properties: ImportWeaponProperty[]): WeaponProperty[] {
    const list: WeaponProperty[] = [];
    if (properties != null) {
      properties.forEach((property: ImportWeaponProperty) => {
        list.push(this.importAttributeService.getCachedWeaponProperty(property));
      });
    }
    return list;
  }

  getDamageConfiguration(numDice: number, diceSize: ImportDiceSize, damageType: ImportDamageTypeItem, miscModifier = 0, damageAbility: ImportAbility = null): DamageConfiguration {
    const config = new DamageConfiguration();
    config.values.numDice = numDice;
    config.values.diceSize = this.importSharedService.getDiceSize(diceSize);
    config.values.miscModifier = miscModifier;
    if (damageAbility != null) {
      config.values.abilityModifier = this.importSharedService.getAbilityById(damageAbility.id);
    }
    config.damageType = this.importAttributeService.getCachedDamageType(damageType);
    return config;
  }

  private async getCachedWeapon(importItem: ImportWeaponCategory): Promise<Weapon> {
    const finalWeapon = await this.getWeapon(importItem);
    finalWeapon.id = '0';
    const cache = this.importCacheService.getItems(ItemType.WEAPON);
    const cachedWeapon = _.find(cache, function(weapon) { return weapon.name.toLowerCase() === importItem.name.toLowerCase() });
    if (cachedWeapon != null) {
      finalWeapon.id = cachedWeapon.id;
    }
    return finalWeapon;
  }

  async processWeaponDependency(importItem: ImportWeaponCategory): Promise<Weapon> {
    await this.importCacheService.getItemsByType(ItemType.WEAPON);
    const cached = await this.getCachedWeapon(importItem);
    if (cached.id === '0') {
      importItem.selectedAction = 'INSERT_AS_NEW';
      await this.processItem(cached, importItem).then(() => {
        cached.id = importItem.finalId;
      });
    }
    return cached;
  }

  private async processWeapon(config: ImportItemConfiguration, item: Item): Promise<any> {
    if (item.itemType !== ItemType.WEAPON) {
      return Promise.reject();
    }
    const weapon = item as Weapon;
    let category: ImportWeaponCategory = null;
    switch (config.importItem.type) {
      case 'WeaponCategory':
        category = config.importItem as ImportWeaponCategory;
        break;
      case 'Weapon':
        const weaponImport = config.importItem as ImportWeapon;
        category = weaponImport.category;
        break;
      case 'BasicWeapon':
        const basicWeapon = config.importItem as ImportBasicWeapon;
        category = basicWeapon.category;
        break;
    }

    if (category != null) {
      if (category.ammo != null && category.ammo.name != null && category.ammo.name !== '') {
        const ammo = await this.processAmmoDependency(category.ammo);
        weapon.ammoType = new ListObject(ammo.id, ammo.name);
      }

      if (category.damageTypeImportItem.name != null && category.damageTypeImportItem.name !== '') {
        const damageType = await this.importAttributeService.processDamageTypeDependency(category.damageTypeImportItem);
        weapon.damages.forEach((damageConfiguration: DamageConfiguration) => {
          damageConfiguration.damageType = damageType;
        });
        weapon.versatileDamages.forEach((damageConfiguration: DamageConfiguration) => {
          damageConfiguration.damageType = damageType;
        });
      }

      let properties = category.propertyItems.slice();

      if (config.importItem.type === 'Weapon') {
        const weaponImport = config.importItem as ImportWeapon;
        if (weapon.ammoType == null) {
          if (weaponImport.ammo != null && weaponImport.ammo.name != null && weaponImport.ammo.name !== '') {
            const ammo2 = await this.processAmmoDependency(weaponImport.ammo);
            weapon.ammoType = new ListObject(ammo2.id, ammo2.name);
          }
        }
        properties = properties.concat(weaponImport.propertyItems);
      }

      properties = _.uniqBy(properties, (property: ImportWeaponProperty) => { return property.name });
      weapon.properties = await this.processWeaponPropertiesForWeapon(properties);
    }
    return this.processItem(weapon, config.importItem);
  }

  private async processWeaponPropertiesForWeapon(properties: ImportWeaponProperty[]): Promise<WeaponProperty[]> {
    const list: WeaponProperty[] = [];
    for (const property of properties) {
      const weaponProperty = await this.importAttributeService.processWeaponPropertyDependency(property);
      list.push(weaponProperty);
    }
    return list;
  }

  private weaponAddMissingChildren(importItem: ImportEquipment): void {
    let category: ImportWeaponCategory = null;
    switch (importItem.type) {
      case 'WeaponCategory':
        category = importItem as ImportWeaponCategory;
        break;
      case 'Weapon':
        const weaponImport = importItem as ImportWeapon;
        category = weaponImport.category;
        break;
      case 'BasicWeapon':
        const basicWeapon = importItem as ImportBasicWeapon;
        category = basicWeapon.category;
        break;
    }
    if (category != null) {
      this.importSharedService.initializeImportItem(category.ammo);

      const damageTypeImportItem = this.importAttributeService.getDamageTypeImportItem(category.damageType);
      this.importSharedService.initializeImportItem(damageTypeImportItem);
      category.damageTypeImportItem = damageTypeImportItem;

      category.propertyItems = this.initializeWeaponPropertiesForWeapon(category.properties);

      if (importItem.type === 'Weapon') {
        const weaponImport = importItem as ImportWeapon;
        this.importSharedService.initializeImportItem(weaponImport.ammo);
        weaponImport.propertyItems = this.initializeWeaponPropertiesForWeapon(weaponImport.properties);
      }
    }
  }

  private initializeWeaponPropertiesForWeapon(properties: ImportListObject[]): ImportWeaponProperty[] {
    const list: ImportWeaponProperty[] = [];
    properties.forEach((property: ImportListObject) => {
      const importItem = new ImportWeaponProperty();
      importItem.type = 'WeaponProperty';
      importItem.name = property.name;
      this.importSharedService.initializeImportItem(importItem);
      list.push(importItem);
    });
    return list;
  }

  private validateWeapon(importItem: ImportEquipment): boolean {
    let category: ImportWeaponCategory = null;
    switch (importItem.type) {
      case 'WeaponCategory':
        category = importItem as ImportWeaponCategory;
        break;
      case 'Weapon':
        const weaponImport = importItem as ImportWeapon;
        category = weaponImport.category;
        break;
      case 'BasicWeapon':
        const basicWeapon = importItem as ImportBasicWeapon;
        category = basicWeapon.category;
        break;
    }

    return category != null
      && importItem.name != null
      && importItem.name !== ''
      && category.weaponType != null
      && (category.rangeLong >= category.rangeNormal);
  }

  private findAllWeaponMatches(importItem: ImportItem, list: ImportItem[]): ImportItem[] {
    return _.filter(list, (_importItem: ImportItem) => {
      const left = _importItem.type === 'BasicWeapon' ? (_importItem as ImportBasicWeapon).category : _importItem;
      const right = importItem.type === 'BasicWeapon' ? (importItem as ImportBasicWeapon).category : importItem;
      return this.importSharedService.deepEqual(left, right);
    });
  }

  /****************** Treasure *********************/

  getPossibleDuplicatesForTreasure(importItem: ImportItem): ListObject[] {
    const source: ListObject[] = this.importCacheService.getItems(ItemType.TREASURE);
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  async getTreasure(importItem: ImportEquipment): Promise<Treasure> {
    let category: ImportTreasureCategory = null;
    switch (importItem.type) {
      case 'TreasureCategory':
        category = importItem as ImportTreasureCategory;
        break;
      case 'Treasure':
        const treasureImport = importItem as ImportTreasure;
        category = treasureImport.category;
        break;
    }

    const treasure = new Treasure();
    if (category != null) {
      treasure.name = importItem.name;
      treasure.cost = category.cost;
      treasure.costUnit = this.importSharedService.getCostUnit(category.costUnits);
      treasure.weight = category.weight;
      treasure.description = category.notes;

      // if (importItem.type === 'Treasure') {
      //   const treasureImport = importItem as ImportTreasure;
      // }
    }
    return treasure;
  }

  private processTreasure(config: ImportItemConfiguration, item: Item): Promise<any> {
    if (item.itemType !== ItemType.TREASURE) {
      return Promise.reject();
    }
    return this.processItem(item, config.importItem);
  }

  private treasureAddMissingChildren(importItem: ImportEquipment): void {
    //no children
  }

  private validateTreasure(importItem: ImportEquipment): boolean {
    let category: ImportTreasureCategory = null;
    switch (importItem.type) {
      case 'TreasureCategory':
        category = importItem as ImportTreasureCategory;
        break;
      case 'Treasure':
        const treasureImport = importItem as ImportTreasure;
        category = treasureImport.category;
        break;
    }

    return category != null
      && importItem.name != null
      && importItem.name !== '';
  }

  private findAllTreasureMatches(importItem: ImportItem, list: ImportItem[]): ImportItem[] {
    return _.filter(list, (_importItem: ImportItem) => {
      const left = _importItem.type === 'Treasure' ? (_importItem as ImportTreasure).category : _importItem;
      const right = importItem.type === 'Treasure' ? (importItem as ImportTreasure).category : importItem;
      return this.importSharedService.deepEqual(left, right);
    });
  }

  /****************** Pack *********************/

  getPossibleDuplicatesForPack(importItem: ImportItem): ListObject[] {
    const source: ListObject[] = this.importCacheService.getItems(ItemType.PACK);
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  private getPrioritizedConfigItemsForPack(config: ImportItemConfiguration): ImportItemConfiguration[] {
    let configs: ImportItemConfiguration[] = [];
    config.children.forEach((child: ImportItemConfiguration) => {
      configs = configs.concat(this.getPrioritizedConfigItemsForEquipment(child));
    });
    configs.push(config);
    return configs;
  }

  async getPack(importItem: ImportEquipment): Promise<Pack> {
    let category: ImportPackCategory = null;
    switch (importItem.type) {
      case 'PackCategory':
        category = importItem as ImportPackCategory;
        break;
      case 'Pack':
        const packImport = importItem as ImportPack;
        category = packImport.category;
        break;
    }

    const pack = new Pack();
    if (category != null) {
      pack.name = importItem.name;

      for (const packItem of category.items) {
        if (packItem.status !== 'NOT_SUPPORTED' && packItem.selectedAction !== 'SKIP_ENTRY') {
          const item = await this.getEquipment(packItem);
          if (item != null) {
            const itemQuantity = new ItemQuantity();
            itemQuantity.item = new ItemListObject(item.id, item.name);
            itemQuantity.quantity = packItem.quantity;
            pack.items.push(itemQuantity);
          }
        }
      }

      // if (importItem.type === 'Pack') {
      //   const packImport = importItem as ImportPack;
      // }
    }
    return pack;
  }

  private async processPack(config: ImportItemConfiguration, item: Item): Promise<any> {
    if (item.itemType !== ItemType.PACK) {
      return Promise.reject();
    }
    const pack = item as Pack;

    let category: ImportPackCategory = null;
    switch (config.importItem.type) {
      case 'PackCategory':
        category = config.importItem as ImportPackCategory;
        break;
      case 'Pack':
        const packImport = config.importItem as ImportPack;
        category = packImport.category;
        break;
    }

    if (category != null) {
      pack.items = [];
      for (const packItemConfig of config.children) {
        const packImportItem = packItemConfig.importItem as ImportEquipmentObject;
        if (packImportItem.status !== 'NOT_SUPPORTED' && packImportItem.selectedAction !== 'SKIP_ENTRY' && packImportItem.finalId != null) {
          const itemQuantity = new ItemQuantity();
          itemQuantity.item = new ItemListObject(packImportItem.finalId, packImportItem.name);
          itemQuantity.quantity = packImportItem.quantity;

          if (packImportItem.type === 'MagicalItem') {
            const magicalItemImport = packImportItem as ImportMagicalItem;
            const magicalItem = await this.getMagicalItem(magicalItemImport.category);

            const subItem: Item = await this.processMagicalItemSubItem(packItemConfig, magicalItem);
            if (subItem != null) {
              itemQuantity.item.subItem = new ItemListObject(subItem.id, subItem.name);
            }
          }
          pack.items.push(itemQuantity);
        }
      }
    }
    return this.processItem(pack, config.importItem);
  }

  private packAddMissingChildren(importItem: ImportEquipment): void {
    let category: ImportPackCategory = null;
    switch (importItem.type) {
      case 'PackCategory':
        category = importItem as ImportPackCategory;
        break;
      case 'Pack':
        const packImport = importItem as ImportPack;
        category = packImport.category;
        break;
    }

    if (category != null) {
      category.items.forEach((item: ImportEquipmentObject) => {
        if (item.type === 'MagicalItem' || item.type === 'MagicalItemCategory') {
          this.fixMagicalItem(item);
        }
        if (item.name != null && item.name !== '') {
          this.importSharedService.initializeImportItem(item);
          this.equipmentAddMissingChildren(item);
          importItem.children.push(item);
        }
      });
    }
  }

  private validatePack(importItem: ImportEquipment): boolean {
    let category: ImportPackCategory = null;
    switch (importItem.type) {
      case 'PackCategory':
        category = importItem as ImportPackCategory;
        break;
      case 'Pack':
        const packImport = importItem as ImportPack;
        category = packImport.category;
        break;
    }

    return category != null
      && importItem.name != null
      && importItem.name !== ''
      && category.items.length > 0;
  }

  private findAllPackMatches(importItem: ImportItem, list: ImportItem[]): ImportItem[] {
    return _.filter(list, (_importItem: ImportItem) => {
      const left = _importItem.type === 'Pack' ? (_importItem as ImportPack).category : _importItem;
      const right = importItem.type === 'Pack' ? (importItem as ImportPack).category : importItem;
      return this.importSharedService.deepEqual(left, right);
    });
  }

  /****************** MagicalItem *********************/

  fixMagicalItem(importItem: ImportItem): void {
    if (importItem.type === 'MagicalItem') {
      const magicalItemImport = importItem as ImportMagicalItem;
      const category = magicalItemImport.category;
      if (category.type !== 'MagicalItemCategory') {
        const magicalItemType = category.type as ImportMagicalItemType;
        category.type = 'MagicalItemCategory';
        category.magicalItemType = magicalItemType;
      }
      importItem.name = category.name;

      if (magicalItemImport.chosenWeapon != null) {
        importItem.subName = magicalItemImport.chosenWeapon.name;
      } else if (magicalItemImport.chosenAmmo != null) {
        importItem.subName = magicalItemImport.chosenAmmo.name;
      } else if (magicalItemImport.chosenArmor != null) {
        importItem.subName = magicalItemImport.chosenArmor.name;
      }
    }
  }

  getPossibleDuplicatesForMagicalItem(importItem: ImportItem): ListObject[] {
    const source: ListObject[] = this.importCacheService.getItems(ItemType.MAGICAL_ITEM);
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  private getMagicalItemType(type: ImportMagicalItemType): MagicalItemType {
    switch (type) {
      case 'ARMOR':
        return MagicalItemType.ARMOR;
      case 'POTION':
        return MagicalItemType.POTION;
      case 'RING':
        return MagicalItemType.RING;
      case 'ROD':
        return MagicalItemType.ROD;
      case 'SCROLL':
        return MagicalItemType.SCROLL;
      case 'STAFF':
        return MagicalItemType.STAFF;
      case 'WAND':
        return MagicalItemType.WAND;
      case 'WEAPON':
        return MagicalItemType.WEAPON;
      case 'WONDROUS':
        return MagicalItemType.WONDROUS;
    }
  }

  private getRarity(rarity: ImportRarity): Rarity {
    switch (rarity) {
      case 'COMMON':
        return Rarity.COMMON;
      case 'UNCOMMON':
        return Rarity.UNCOMMON;
      case 'RARE':
        return Rarity.RARE;
      case 'VERY_RARE':
        return Rarity.VERY_RARE;
      case 'LEGENDARY':
        return Rarity.LEGENDARY;
    }
  }

  private async getApplicableArmors(armorCategories: ImportListObject[], armors: ImportListObject[]): Promise<MagicalItemApplicability[]> {
    const armorTypesCache = await this.importCacheService.getAttributesByType(AttributeType.ARMOR_TYPE);
    const armorsCache = await this.importCacheService.getItemsByType(ItemType.ARMOR)

    const applicableArmors: MagicalItemApplicability[] = [];

    armorCategories.forEach((category: ImportListObject) => {
      const armorType = _.find(armorTypesCache, (type: ListObject) => {
        return type.name.toLowerCase() === category.name.toLowerCase();
      });
      if (armorType != null) {
        const magicalItemApplicability = new MagicalItemApplicability();
        magicalItemApplicability.magicalItemApplicabilityType = MagicalItemApplicabilityType.FILTER;
        magicalItemApplicability.filters = new Filters();

        const filterValue = new FilterValue();
        filterValue.key = FilterKey.ITEM_TYPE;
        filterValue.value = ItemType.ARMOR;
        magicalItemApplicability.filters.filterValues.push(filterValue);

        const armorTypeFilterValue = new FilterValue();
        armorTypeFilterValue.key = FilterKey.ARMOR_CATEGORY;
        armorTypeFilterValue.value = armorType.id;
        magicalItemApplicability.filters.filterValues.push(armorTypeFilterValue);

        applicableArmors.push(magicalItemApplicability);
      }
    });

    armors.forEach((armorImport: ImportListObject) => {
      const armor = _.find(armorsCache, (_armor: ListObject) => {
        return _armor.name.toLowerCase() === armorImport.name.toLowerCase();
      });
      if (armor != null) {
        const magicalItemApplicability = new MagicalItemApplicability();
        magicalItemApplicability.magicalItemApplicabilityType = MagicalItemApplicabilityType.ITEM;
        magicalItemApplicability.filters = new Filters();
        magicalItemApplicability.item = new ItemListObject(armor.id, armor.name);
        applicableArmors.push(magicalItemApplicability);
      }
    });

    return applicableArmors;
  }

  private async getApplicableWeapons(weaponCategories: ImportListObject[], weapons: ImportListObject[]): Promise<MagicalItemApplicability[]> {
    const weaponTypesCache = await this.importCacheService.getAttributesByType(AttributeType.WEAPON_TYPE);
    const weaponsCache = await this.importCacheService.getItemsByType(ItemType.WEAPON)

    const applicableWeapons: MagicalItemApplicability[] = [];

    weaponCategories.forEach((category: ImportListObject) => {
      if (category.name.toLowerCase() === 'simple' || category.name.toLowerCase() === 'martial') {
        const weaponType = _.find(weaponTypesCache, (type: ListObject) => {
          return type.name.toLowerCase() === category.name.toLowerCase();
        });
        if (weaponType != null) {
          const magicalItemApplicability = new MagicalItemApplicability();
          magicalItemApplicability.magicalItemApplicabilityType = MagicalItemApplicabilityType.FILTER;
          magicalItemApplicability.filters = new Filters();

          const filterValue = new FilterValue();
          filterValue.key = FilterKey.ITEM_TYPE;
          filterValue.value = ItemType.WEAPON;
          magicalItemApplicability.filters.filterValues.push(filterValue);

          const weaponTypeFilterValue = new FilterValue();
          weaponTypeFilterValue.key = FilterKey.WEAPON_DIFFICULTY;
          weaponTypeFilterValue.value = weaponType.id;
          magicalItemApplicability.filters.filterValues.push(weaponTypeFilterValue);

          applicableWeapons.push(magicalItemApplicability);
        }
      }
    });

    weapons.forEach((weaponImport: ImportListObject) => {
      const weapon = _.find(weaponsCache, (_weapon: ListObject) => {
        return _weapon.name.toLowerCase() === weaponImport.name.toLowerCase();
      });
      if (weapon != null) {
        const magicalItemApplicability = new MagicalItemApplicability();
        magicalItemApplicability.magicalItemApplicabilityType = MagicalItemApplicabilityType.ITEM;
        magicalItemApplicability.filters = new Filters();
        magicalItemApplicability.item = new ItemListObject(weapon.id, weapon.name);
        applicableWeapons.push(magicalItemApplicability);
      }
    });

    return applicableWeapons;
  }

  private async getApplicableAmmos(ammoCategories: ImportListObject[], ammos: ImportListObject[]): Promise<MagicalItemApplicability[]> {
    const ammosCache = await this.importCacheService.getItemsByType(ItemType.AMMO)
    const applicableAmmos: MagicalItemApplicability[] = [];

    ammoCategories.forEach((category: ImportListObject) => {
      if (category.name.toLowerCase() === 'ammo') {
        const magicalItemApplicability = new MagicalItemApplicability();
        magicalItemApplicability.magicalItemApplicabilityType = MagicalItemApplicabilityType.FILTER;
        magicalItemApplicability.filters = new Filters();

        const filterValue = new FilterValue();
        filterValue.key = FilterKey.ITEM_TYPE;
        filterValue.value = ItemType.AMMO;
        magicalItemApplicability.filters.filterValues.push(filterValue);
      }
    });

    ammos.forEach((ammoImport: ImportListObject) => {
      const ammo = _.find(ammosCache, (_ammo: ListObject) => {
        return _ammo.name.toLowerCase() === ammoImport.name.toLowerCase();
      });
      if (ammo != null) {
        const magicalItemApplicability = new MagicalItemApplicability();
        magicalItemApplicability.magicalItemApplicabilityType = MagicalItemApplicabilityType.ITEM;
        magicalItemApplicability.filters = new Filters();
        magicalItemApplicability.item = new ItemListObject(ammo.id, ammo.name);
        applicableAmmos.push(magicalItemApplicability);
      }
    });
    return applicableAmmos;
  }

  private getDefaultFilter(magicalItemType: MagicalItemType): MagicalItemApplicability {
    const filterValue = new FilterValue();
    filterValue.key = FilterKey.ITEM_TYPE;
    switch (magicalItemType) {
      case MagicalItemType.ARMOR:
        filterValue.value = ItemType.ARMOR;
        break;
      case MagicalItemType.AMMO:
        filterValue.value = ItemType.AMMO;
        break;
      case MagicalItemType.WEAPON:
        filterValue.value = ItemType.WEAPON;
        break;
    }

    const magicalItemApplicability = new MagicalItemApplicability();
    magicalItemApplicability.magicalItemApplicabilityType = MagicalItemApplicabilityType.FILTER;
    magicalItemApplicability.filters = new Filters();
    magicalItemApplicability.filters.filterValues.push(filterValue);
    return magicalItemApplicability;
  }

  async getMagicalItem(importItem: ImportEquipment): Promise<MagicalItem> {
    let category: ImportMagicalItemCategory = null;
    switch (importItem.type) {
      case 'MagicalItemCategory':
        category = importItem as ImportMagicalItemCategory;
        break;
      case 'MagicalItem':
        const magicalItemImport = importItem as ImportMagicalItem;
        category = magicalItemImport.category;
        break;
    }

    const magicalItem = new MagicalItem();
    if (category != null) {
      magicalItem.name = importItem.name;
      magicalItem.magicalItemType = this.getMagicalItemType(category.magicalItemType);
      magicalItem.rarity = this.getRarity(category.rarity);
      magicalItem.description = category.notes;

      if (magicalItem.magicalItemType === MagicalItemType.ARMOR) {
        magicalItem.acMod = category.acMod;
        magicalItem.applicableArmors = await this.getApplicableArmors(category.armorCategories, category.armorTypes);
        if (magicalItem.applicableArmors.length === 0) {
          magicalItem.applicableArmors.push(this.getDefaultFilter(MagicalItemType.ARMOR));
        }
        magicalItem.equippable = true;
        magicalItem.slot = EquipmentSlotType.BODY;
        magicalItem.expendable = category.useable;
      } else if (magicalItem.magicalItemType === MagicalItemType.WEAPON) {
        magicalItem.attackMod = category.attackMod;
        magicalItem.attackType = AttackType.ATTACK;

        // damages
        await this.importCacheService.getAttributesByType(AttributeType.DAMAGE_TYPE);
        magicalItem.damages = [];
        category.attackDamages.forEach((attackDamage: ImportAttackDamage) => {
          const damageConfiguration = this.getDamageConfiguration(attackDamage.numDice, this.importSharedService.getImportDiceSize(attackDamage.diceSize), attackDamage.damageTypeImportItem, attackDamage.damageMod, attackDamage.damageAbility);
          magicalItem.damages.push(damageConfiguration);
        });

        magicalItem.applicableWeapons = await this.getApplicableWeapons(category.weaponCategories, category.weaponTypes);
        if (magicalItem.applicableWeapons.length === 0) {
          magicalItem.applicableAmmos = await this.getApplicableAmmos(category.weaponCategories, category.weaponTypes);
        }

        if (magicalItem.applicableWeapons.length === 0 && magicalItem.applicableAmmos.length !== 0) {
          magicalItem.magicalItemType = MagicalItemType.AMMO;
        } else if (magicalItem.applicableWeapons.length === 0) {
          magicalItem.applicableWeapons.push(this.getDefaultFilter(MagicalItemType.WEAPON));
        }

        magicalItem.equippable = true;
        magicalItem.slot = EquipmentSlotType.HAND;
      } else if (magicalItem.magicalItemType === MagicalItemType.WONDROUS) {
        magicalItem.equippable = category.equippable;
        magicalItem.slot = magicalItem.equippable ? this.getEquipmentSlotType(category.equipmentSlotType) : EquipmentSlotType.NONE;
      } else if (magicalItem.magicalItemType === MagicalItemType.RING) {
        magicalItem.equippable = true;
        magicalItem.slot = EquipmentSlotType.FINGER;
      } else if (magicalItem.magicalItemType === MagicalItemType.ROD
        || magicalItem.magicalItemType === MagicalItemType.STAFF
        || magicalItem.magicalItemType === MagicalItemType.WAND) {
        magicalItem.equippable = true;
        magicalItem.slot = EquipmentSlotType.HAND;
      } else if (magicalItem.magicalItemType === MagicalItemType.POTION
        || magicalItem.magicalItemType === MagicalItemType.SCROLL) {
        magicalItem.expendable = true;
      }

      //attunement
      magicalItem.requiresAttunement = category.attunement;
      magicalItem.attunementType = MagicalItemAttunementType.ANY;

      magicalItem.cost = category.cost;
      magicalItem.costUnit = this.importSharedService.getCostUnit(category.costUnits);
      magicalItem.weight = category.weight;

      //cursed
      magicalItem.cursed = category.cursed;
      magicalItem.curseEffect = magicalItem.cursed ? category.curseEffect : '';

      //charges
      magicalItem.hasCharges = category.hasCharges;
      magicalItem.rechargeRate = new DiceCollection();
      if (magicalItem.hasCharges) {
        magicalItem.maxCharges = category.maxCharges;
        magicalItem.rechargeable = category.rechargeable;
        if (magicalItem.rechargeable) {
          magicalItem.rechargeRate.numDice = category.rechargeRateNumDice;
          magicalItem.rechargeRate.diceSize = this.importSharedService.getDiceSize(category.rechargeRateDiceSize);
          magicalItem.rechargeRate.miscModifier = category.rechargeRateMod;
          magicalItem.chanceOfDestruction = category.chanceOfDestruction;
        }
      }

      //container
      magicalItem.container = category.container;
      if (magicalItem.container) {
        magicalItem.ignoreWeight = category.ignoreWeightOfContents;
      }

      //spells
      for (const importSpell of category.spells) {
        const spell = await this.importPowerService.getSpell(importSpell);
        if (spell != null) {
          const spellConfig = new MagicalItemSpellConfiguration();
          spellConfig.spell = new SpellListObject();
          spellConfig.spell.id = spell.id;
          spellConfig.spell.name = spell.name;
          spellConfig.storedLevel = spell.level;
          spellConfig.additional = false;

          magicalItem.spells.push(spellConfig);
        }
      }
      magicalItem.spellAttackCalculationType = MagicalItemSpellAttackCalculationType.NONE;
      magicalItem.additionalSpells = category.additionalSpells;

      //table
      magicalItem.tables = [];
      const table = this.getTable(category.tableContent);
      if (table != null) {
        magicalItem.tables.push(table);
      }
    }
    return magicalItem;
  }

  private getTable(tableContent: string): MagicalItemTable {
    if (tableContent == null || tableContent === '') {
      return null;
    }
    const table = new MagicalItemTable();
    const rows = tableContent.split('<ROW_BREAK>');
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const values = row.split('<COLUMN_BREAK>');
      if (i === 0) {
        table.columns = values;
      } else {
        const tableRow = new MagicalItemTableRow();
        tableRow.values = values;
        table.rows.push(tableRow);
      }
    }
    return table;
  }

  async processMagicalItemSubItem(config: ImportItemConfiguration, item: Item): Promise<Item> {
    if (item.itemType !== ItemType.MAGICAL_ITEM || config.importItem.type !== 'MagicalItem') {
      return Promise.resolve(null);
    }
    const magicalItem = item as MagicalItem;
    const magicalItemImport = config.importItem as ImportMagicalItem;

    let subItem: Item = null;
    if (magicalItemImport.chosenWeapon != null && magicalItem.magicalItemType === MagicalItemType.WEAPON) {
      subItem = await this.processWeaponDependency(magicalItemImport.chosenWeapon.category);
    } else if (magicalItemImport.chosenAmmo != null && magicalItem.magicalItemType === MagicalItemType.AMMO) {
      subItem = await this.processAmmoDependency(magicalItemImport.chosenAmmo.category);
    } else if (magicalItemImport.chosenArmor != null && magicalItem.magicalItemType === MagicalItemType.ARMOR) {
      subItem = await this.processArmorDependency(magicalItemImport.chosenArmor.category);
    }

    return Promise.resolve(subItem);
  }

  async processMagicalItemAdditionalSpells(importItem: ImportEquipmentObject): Promise<MagicalItemSpellConfiguration[]> {
    if (importItem.type !== 'MagicalItem') {
      return Promise.resolve([]);
    }

    const magicalItemImport = importItem as ImportMagicalItem;
    const additionalSpells: MagicalItemSpellConfiguration[] = [];
    for (const importStoredSpell of magicalItemImport.spells) {
      const spell = await this.importPowerService.processSpellDependency(importStoredSpell.spell);
      if (spell != null) {
        additionalSpells.push(this.getMagicalItemSpellConfiguration(spell, true));
      }
    }

    return additionalSpells;
  }

  private getMagicalItemSpellConfiguration(spell: Spell, additional: boolean): MagicalItemSpellConfiguration {
    const spellConfig = new MagicalItemSpellConfiguration();
    spellConfig.spell = new SpellListObject();
    spellConfig.spell.id = spell.id;
    spellConfig.spell.name = spell.name;
    spellConfig.storedLevel = spell.level;
    spellConfig.additional = additional;
    return spellConfig;
  }

  private async processMagicalItem(config: ImportItemConfiguration, item: Item): Promise<any> {
    if (item.itemType !== ItemType.MAGICAL_ITEM) {
      return Promise.reject();
    }
    const magicalItem = item as MagicalItem;

    let category: ImportMagicalItemCategory = null;
    switch (config.importItem.type) {
      case 'MagicalItemCategory':
        category = config.importItem as ImportMagicalItemCategory;
        break;
      case 'MagicalItem':
        const magicalItemImport = config.importItem as ImportMagicalItem;
        category = magicalItemImport.category;
        break;
    }

    if (category != null) {
      magicalItem.spells = [];
      for (const importSpell of category.spells) {
        const spell = await this.importPowerService.processSpellDependency(importSpell);
        if (spell != null) {
          magicalItem.spells.push(this.getMagicalItemSpellConfiguration(spell, false));
        }
      }

      await this.importCacheService.getAttributesByType(AttributeType.DAMAGE_TYPE);
      magicalItem.damages = [];
      for (const attackDamage of category.attackDamages) {
        const damageConfiguration = this.getDamageConfiguration(attackDamage.numDice, this.importSharedService.getImportDiceSize(attackDamage.diceSize), attackDamage.damageTypeImportItem, attackDamage.damageMod, attackDamage.damageAbility);
        if (attackDamage.damageTypeImportItem.name != null && attackDamage.damageTypeImportItem.name !== '') {
          damageConfiguration.damageType = await this.importAttributeService.processDamageTypeDependency(attackDamage.damageTypeImportItem);
        }
        magicalItem.damages.push(damageConfiguration);
      }
    }
    return this.processItem(magicalItem, config.importItem);
  }

  private magicalItemAddMissingChildren(importItem: ImportEquipment): void {
    let category: ImportMagicalItemCategory = null;
    switch (importItem.type) {
      case 'MagicalItemCategory':
        category = importItem as ImportMagicalItemCategory;
        break;
      case 'MagicalItem':
        const magicalItemImport = importItem as ImportMagicalItem;
        category = magicalItemImport.category;
        break;
    }

    if (category != null) {
      category.spells.forEach((importSpell: ImportSpell) => {
        this.importSharedService.initializeImportItem(importSpell);
      });

      category.attackDamages.forEach((attackDamage: ImportAttackDamage) => {
        const damageTypeImportItem = this.importAttributeService.getDamageTypeImportItem(attackDamage.damageType);
        this.importSharedService.initializeImportItem(damageTypeImportItem);
        attackDamage.damageTypeImportItem = damageTypeImportItem;
      });

      if (importItem.type === 'MagicalItem') {
        const magicalItemImport = importItem as ImportMagicalItem;
        magicalItemImport.spells.forEach((importStoredSpell: ImportStoredSpell) => {
          this.importSharedService.initializeImportItem(importStoredSpell.spell);
        });
        if (magicalItemImport.chosenWeapon != null) {
          this.importSharedService.initializeImportItem(magicalItemImport.chosenWeapon);
        }
        if (magicalItemImport.chosenAmmo != null) {
          this.importSharedService.initializeImportItem(magicalItemImport.chosenAmmo);
        }
        if (magicalItemImport.chosenArmor != null) {
          this.importSharedService.initializeImportItem(magicalItemImport.chosenArmor);
        }
      }
    }
  }

  private validateMagicalItem(importItem: ImportEquipment): boolean {
    let category: ImportMagicalItemCategory = null;
    switch (importItem.type) {
      case 'MagicalItemCategory':
        category = importItem as ImportMagicalItemCategory;
        break;
      case 'MagicalItem':
        const magicalItemImport = importItem as ImportMagicalItem;
        category = magicalItemImport.category;
        break;
    }

    return category != null
      && importItem.name != null
      && importItem.name !== '';
  }

  private findAllMagicalItemMatches(importItem: ImportItem, list: ImportItem[]): ImportItem[] {
    return _.filter(list, (_importItem: ImportItem) => {
      const left = _importItem.type === 'MagicalItem' ? (_importItem as ImportMagicalItem).category : _importItem;
      const right = importItem.type === 'MagicalItem' ? (importItem as ImportMagicalItem).category : importItem;
      return this.importSharedService.deepEqual(left, right);
    });
  }
}
