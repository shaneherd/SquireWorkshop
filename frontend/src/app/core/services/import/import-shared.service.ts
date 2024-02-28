import {Injectable} from '@angular/core';
import {
  ImportBackground,
  ImportCostUnit,
  ImportCreatureSkill,
  ImportDiceSize,
  ImportDiceSizeEnum,
  ImportItem,
  ImportItemConfiguration,
  ImportItemType,
  ImportListObject,
  ImportRace,
  ImportSize
} from '../../../shared/imports/import-item';
import {CharacterLevel} from '../../../shared/models/character-level';
import {ListObject} from '../../../shared/models/list-object';
import * as _ from 'lodash';
import {Proficiency, ProficiencyListObject, ProficiencyType} from '../../../shared/models/proficiency';
import {Size} from '../../../shared/models/size.enum';
import {SID} from '../../../constants';
import {CharacterLevelService} from '../character-level.service';
import {Ability} from '../../../shared/models/attributes/ability.model';
import {AbilityService} from '../attributes/ability.service';
import {DiceSize} from '../../../shared/models/dice-size.enum';
import {CostUnit} from '../../../shared/models/items/cost-unit';
import {CostUnitService} from '../items/cost-unit.service';
import {ItemProficiency} from '../../../shared/models/items/item-proficiency';

@Injectable({
  providedIn: 'root'
})
export class ImportSharedService {

  private supportedTypes: ImportItemType[] = [
    'Spell', //this must be first so that spells get processed before classes
    'Background', //characteristics must be before features
    'CharacterClass',
    'Subclass',
    'Race',
    'ArmorType',
    'CasterType',
    'DamageType',
    'Condition',
    'Feature',
    'AmmoCategory',
    'Ammo',
    'BasicAmmo',
    'ArmorCategory',
    'Armor',
    'BasicArmor',
    // 'ContainerCategory',
    'GearCategory',
    'Gear',
    'MountCategory',
    'Mount',
    'BasicMount',
    'Tool',
    'ToolCategory',
    'ToolCategoryType',
    'WeaponCategory',
    'Weapon',
    'BasicWeapon',
    'MagicalItem',
    'MagicalItemCategory',
    'Treasure',
    'TreasureCategory',
    'Pack',
    'PackCategory',
    // 'EmptySlotItem',
    'Language',
    'Skill',
    'WeaponProperty',
    'Character',
    'Monster',
    'MonsterAction',
    'MonsterFeature'
  ];

  private comparePropertiesToIgnore: string[] = [
    'importId',
    'children',
    'duplicates',
    'linked',
    'links',
    'expanded',
    'selectedDuplicate',
    'duplicateConfirmed',
    'selectedAction',
    'status',
    'finalId',
    'ancestorCount',
    'disabled',
    'parentBackground',
    'parentRace',
    'id',
    'subName',

    // EquipmentObject properties
    'quantity',
    'characterItemId',
    'containerId',
    'dropped',
    'poisoned',
    'silvered',
    'attuned',
    'cursed',
    'charges',
    'equippedSlot',
    'damageTypeImportItem',
    'propertyItems',

    'classes',
    'spellTags',
    'preparedClassId'
  ];

  private characteristicTypes: ImportItemType[] = [
    'CharacterClass',
    'Race',
    'Background'
  ];

  private equipmentTypes: ImportItemType[] = [
    'AmmoCategory',
    'Ammo',
    'BasicAmmo',
    'ArmorCategory',
    'Armor',
    'BasicArmor',
    'ContainerCategory',
    'GearCategory',
    'Gear',
    'MountCategory',
    'Mount',
    'BasicMount',
    'Tool',
    'ToolCategory',
    'ToolCategoryType',
    'WeaponCategory',
    'Weapon',
    'BasicWeapon',
    'MagicalItem',
    'MagicalItemCategory',
    'Treasure',
    'TreasureCategory',
    'Pack',
    'PackCategory',
    'EmptySlotItem'
  ];

  constructor(
    private abilityService: AbilityService,
    private characterLevelService: CharacterLevelService,
    private costUnitService: CostUnitService
  ) { }

  initializeImportItem(importItem: ImportItem): void {
    importItem.importId = _.uniqueId();
    importItem.children = [];
    importItem.links = [];
    importItem.expanded = true;
    importItem.linked = false;
    importItem.duplicates = [];
    if (this.itemSupported(importItem)) {
      importItem.status = 'READY';
    } else {
      importItem.status = 'NOT_SUPPORTED';
    }
  }

  getRootItem(importItem: ImportItem, child: ImportItem): ImportItem {
    if (child != null) {
      importItem.children.unshift(child); //insert child at the beginning of the list
    }

    let parent: ImportItem = null;
    switch (importItem.type) {
      case 'Background':
        const background = importItem as ImportBackground;
        parent = background.parentBackground;
        background.parentBackground = null; //remove parent to avoid circular dependency
        break;
      case 'Race':
        const race = importItem as ImportRace;
        parent = race.parentRace;
        race.parentRace = null; //remove parent to avoid circular dependency
        break;
    }

    if (parent != null) {
      this.initializeImportItem(parent);
      return this.getRootItem(parent, importItem);
    } else {
      return importItem;
    }
  }

  getFlatList(rootList: ImportItem[]): ImportItem[] {
    let flatList: ImportItem[] = [];
    rootList.forEach((importItem: ImportItem) => {
      flatList.push(importItem);
      if (importItem.children.length > 0) {
        flatList = flatList.concat(this.getFlatList(importItem.children));
      }
    });
    return flatList;
  }

  getFlatConfigList(rootList: ImportItemConfiguration[]): ImportItemConfiguration[] {
    let flatList: ImportItemConfiguration[] = [];
    rootList.forEach((importItem: ImportItemConfiguration) => {
      flatList.push(importItem);
      if (importItem.children.length > 0) {
        flatList = flatList.concat(this.getFlatConfigList(importItem.children));
      }
    });
    return flatList;
  }

  private itemSupported(importItem: ImportItem): boolean {
    return this.supportedTypes.indexOf(importItem.type) > -1;
  }

  initializeChildItem(child: ImportItem, parent: ImportItem): void {
    if (child.name != null && child.name !== '') {
      this.initializeImportItem(child);
      const rootChild = this.getRootItem(child, null);
      parent.children.push(rootChild);
    }
  }

  mergeChildren(left: ImportItem, right: ImportItem): void {
    right.children.forEach((rightChild: ImportItem) => {
      const match = this.findMatch(rightChild, left.children);
      if (match == null) {
        left.children.push(rightChild);
      } else {
        this.mergeChildren(match, rightChild);
      }
    });
  }

  mergeChildrenList(list: ImportItem[]): ImportItem[] {
    const left = new ImportItem();
    const right = new ImportItem();
    right.children = list;
    this.mergeChildren(left, right);
    return left.children;
  }

  findConfigMatch(importItem: ImportItem, list: ImportItemConfiguration[]): ImportItemConfiguration {
    return _.find(list, (_config: ImportItemConfiguration) => {
      return this.deepEqual(_config.importItem, importItem);
    });
  }

  findMatch(importItem: ImportItem, list: ImportItem[]): ImportItem {
    return _.find(list, (_importItem: ImportItem) => {
      return this.deepEqual(_importItem, importItem);
    });
  }

  findAllMatches(importItem: ImportItem, list: ImportItem[]): ImportItem[] {
    return _.filter(list, (_importItem: ImportItem) => {
      return this.deepEqual(_importItem, importItem);
    });
  }

  private isObject(object: Object): boolean {
    return object != null && typeof object === 'object';
  }

  private getKeys(obj: Object): string[] {
    const keys = Object.keys(obj);
    return _.filter(keys, (key: string) => {
      return this.comparePropertiesToIgnore.indexOf(key) === -1;
    });
  }

  deepEqual(object1: Object, object2: Object): boolean {
    const keys1 = this.getKeys(object1);
    const keys2 = this.getKeys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = this.isObject(val1) && this.isObject(val2);
      if ((areObjects && !this.deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
        return false;
      }
    }

    return true;
  }

  completeItem(obj: ImportItem, finalId: string): void {
    obj.status = 'COMPLETE';
    obj.finalId = finalId;
  }

  finishImportingItem(importItem: ImportItem, success: boolean): void {
    importItem.status = success ? 'COMPLETE' : 'ERROR';
    if (!success) {
      throw new Error('error importing');
    }
  }

  getLevel(level: number, levels: CharacterLevel[]): ListObject {
    const characterLevel = _.find(levels, function(_level) { return _level.name === level.toString(10) });
    let finalLevel: ListObject = null;
    if (characterLevel != null) {
      finalLevel = new ListObject(characterLevel.id, characterLevel.name);
    }
    return finalLevel;
  }

  getLevelByNumber(level: number): CharacterLevel {
    const sid = SID.LEVELS[level.toString()];
    return this.characterLevelService.getLevelBySid(sid);
  }

  getAbilityIdBySid(sid: number): number {
    switch (sid) {
      case SID.ABILITIES.STRENGTH:
        return 1;
      case SID.ABILITIES.DEXTERITY:
        return 2;
      case SID.ABILITIES.CONSTITUTION:
        return 3;
      case SID.ABILITIES.INTELLIGENCE:
        return 4;
      case SID.ABILITIES.WISDOM:
        return 5;
      case SID.ABILITIES.CHARISMA:
        return 6;
    }
    return -1;
  }

  getAbilityById(id: number): Ability {
    let sid = null;
    switch (id) {
      case 1:
        sid = SID.ABILITIES.STRENGTH;
        break;
      case 2:
        sid = SID.ABILITIES.DEXTERITY;
        break;
      case 3:
        sid = SID.ABILITIES.CONSTITUTION;
        break;
      case 4:
        sid = SID.ABILITIES.INTELLIGENCE;
        break;
      case 5:
        sid = SID.ABILITIES.WISDOM;
        break;
      case 6:
        sid = SID.ABILITIES.CHARISMA;
        break;
    }
    return this.abilityService.getAbilityBySid(sid);
  }

  getImportDiceSize(diceSize: ImportDiceSizeEnum): ImportDiceSize {
    switch (diceSize) {
      case 'ONE':
        return 1;
      case 'TWO':
        return 2;
      case 'THREE':
        return 3;
      case 'FOUR':
        return 4;
      case 'SIX':
        return 6;
      case 'EIGHT':
        return 8;
      case 'TEN':
        return 10;
      case 'TWELVE':
        return 12;
      case 'TWENTY':
        return 20;
      case 'ONE_HUNDRED':
        return 100;
    }
  }

  getDiceSizeFromImportDiceSizeEnum(size: ImportDiceSizeEnum): DiceSize {
    const diceSize = this.getImportDiceSize(size);
    return this.getDiceSize(diceSize);
  }

  getDiceSize(diceSize: ImportDiceSize): DiceSize {
    switch (diceSize) {
      case 0:
      case 1:
        return DiceSize.ONE;
      case 2:
        return DiceSize.TWO;
      case 3:
        return DiceSize.THREE;
      case 4:
        return DiceSize.FOUR;
      case 6:
        return DiceSize.SIX;
      case 8:
        return DiceSize.EIGHT;
      case 10:
        return DiceSize.TEN;
      case 12:
        return DiceSize.TWELVE;
      case 20:
        return DiceSize.TWENTY;
      case 100:
        return DiceSize.HUNDRED;
    }
  }

  getAbilityProficiencies(importListObjects: number[], listObjects: ListObject[], type: ProficiencyType): Proficiency[] {
    const list: Proficiency[] = [];
    if (importListObjects != null) {
      importListObjects.forEach((abilityId: number) => {
        const ability = this.getAbilityById(abilityId);
        const prof = new Proficiency();
        prof.proficient = true;
        prof.attribute = this.getProficiencyListObject(ability.name, listObjects, type);
        list.push(prof);
      });
    }
    return list;
  }

  getProficiencyList(importListObjects: ImportListObject[], listObjects: ListObject[], type: ProficiencyType): Proficiency[] {
    const list: Proficiency[] = [];
    if (importListObjects != null) {
      importListObjects.forEach((importListObject: ImportListObject) => {
        const prof = new Proficiency();
        prof.proficient = true;
        prof.attribute = this.getProficiencyListObject(importListObject.name, listObjects, type);
        list.push(prof);
      });
    }
    return list;
  }

  getCreatureSkillProficiencyList(creatureSkills: ImportCreatureSkill[], listObjects: ListObject[], type: ProficiencyType): Proficiency[] {
    const list: Proficiency[] = [];
    creatureSkills.forEach((creatureSkill: ImportCreatureSkill) => {
      const prof = new Proficiency();
      prof.proficient = creatureSkill.prof;
      prof.doubleProf = creatureSkill.doubleProf;
      prof.halfProf = creatureSkill.halveProf;
      prof.roundUp = creatureSkill.roundUp;
      prof.miscModifier = creatureSkill.miscModifier;
      prof.advantage = creatureSkill.advantage.advantage;
      prof.disadvantage = creatureSkill.advantage.disadvantage;
      prof.attribute = this.getProficiencyListObject(creatureSkill.name, listObjects, type);
      list.push(prof);
    });
    return list;
  }

  private getProficiencyListObject(name: string, listObjects: ListObject[], type: ProficiencyType): ProficiencyListObject {
    const listObject = _.find(listObjects, function(_listObject) { return _listObject.name.toLowerCase() === name.toLowerCase() });
    const prof = new ProficiencyListObject();
    prof.proficiencyType = type;
    prof.id = listObject == null ? '0' : listObject.id;
    prof.name = name;
    return prof;
  }

  processProfs(profs: Proficiency[], cache: ListObject[]): Proficiency[] {
    const finalProfs: Proficiency[] = [];
    profs.forEach((prof: Proficiency) => {
      if (prof.attribute.id !== '0') {
        finalProfs.push(prof);
      } else {
        const cachedItem = _.find(cache, function(item) { return item.name.toLowerCase() === prof.attribute.name.toLowerCase() });
        if (cachedItem != null) {
          prof.attribute.id = cachedItem.id;
          finalProfs.push(prof);
        }
      }
    });
    return finalProfs;
  }

  processItemProfs(profs: ItemProficiency[], cache: ListObject[]): ItemProficiency[] {
    const finalProfs: ItemProficiency[] = [];
    profs.forEach((prof: ItemProficiency) => {
      if (prof.item.id !== '0') {
        finalProfs.push(prof);
      } else {
        const cachedItem = _.find(cache, function(item) { return item.name.toLowerCase() === prof.item.name.toLowerCase() });
        if (cachedItem != null) {
          prof.item.id = cachedItem.id;
          finalProfs.push(prof);
        }
      }
    });
    return finalProfs;
  }

  getSize(size: ImportSize): Size {
    switch (size) {
      case 'Tiny':
        return Size.TINY;
      case 'Small':
        return Size.SMALL;
      case 'Medium':
        return Size.MEDIUM;
      case 'Large':
        return Size.LARGE;
      case 'Huge':
        return Size.HUGE;
      case 'Gargantuan':
        return Size.GARGUANTUAN;
      default:
        return Size.MEDIUM;
    }
  }

  getCostUnit(costUnit: ImportCostUnit): CostUnit {
    const costUnits: CostUnit[] = this.costUnitService.getCostUnitsDetailedFromStorage();
    return _.find(costUnits, function(_costUnit) { return _costUnit.abbreviation.toLowerCase() === costUnit.toLowerCase() });
  }

  findConfigItem(importItem: ImportItem, configs: ImportItemConfiguration[]): ImportItemConfiguration {
    return _.find(configs, (config: ImportItemConfiguration) => {
      return this.deepEqual(config.importItem, importItem);
    });
  }

  isEquipmentObject(importItem: ImportItem): boolean {
    return this.equipmentTypes.indexOf(importItem.type) > -1;
  }

  isCharacteristic(importItem: ImportItem): boolean {
    return this.characteristicTypes.indexOf(importItem.type) > -1;
  }

  sortImports(importItems: ImportItem[]): void {
    importItems.sort((left: ImportItem, right: ImportItem) => {
      let sort = 0;
      if (!this.isEquipmentObject(left) || !this.isEquipmentObject(right)) {
        sort = this.supportedTypes.indexOf(left.type) - this.supportedTypes.indexOf(right.type);
      }
      if (sort === 0) {
        if (left.name < right.name) {
          return -1;
        } else if (left.name > right.name) {
          return 1;
        } else {
          return 0;
        }
      } else {
        return sort;
      }
    });

    importItems.forEach((importItem: ImportItem) => {
      if (importItem.children.length > 0) {
        this.sortImports(importItem.children);
      }
    });
  }

  getPossibleDuplicates(importItem: ImportItem, source: ListObject[]): ListObject[] {
    const possibleDuplicates: ListObject[] = [];
    const name = importItem.name.toLowerCase();
    if (source != null) {
      source.forEach((sourceObject: ListObject) => {
        if (sourceObject.name.toLowerCase() === name) {
          possibleDuplicates.push(sourceObject);
        }
      });
    }
    return possibleDuplicates;
  }
}
