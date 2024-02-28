import {Injectable} from '@angular/core';
import {LOCAL_STORAGE} from '../../../constants';
import * as _ from 'lodash';
import {
  ImportAbility,
  ImportAction,
  ImportActionEvent,
  ImportArmorType,
  ImportBackground,
  ImportCasterType,
  ImportCharacterClass,
  ImportCondition,
  ImportEquipment,
  ImportFeature,
  ImportItem,
  ImportItemConfiguration,
  ImportItemType,
  ImportLanguage,
  ImportMonster,
  ImportPlayerCharacter,
  ImportRace,
  ImportSkill,
  ImportSpell,
  ImportSubClass,
  ImportWeaponProperty
} from '../../../shared/imports/import-item';
import {ListObject} from '../../../shared/models/list-object';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {Ability} from '../../../shared/models/attributes/ability.model';
import {PowerType} from '../../../shared/models/powers/power-type.enum';
import {CharacteristicType} from '../../../shared/models/characteristics/characteristic-type.enum';
import {CreatureType} from '../../../shared/models/creatures/creature-type.enum';
import {ItemType} from '../../../shared/models/items/item-type.enum';
import {ImportCacheService} from './import-cache.service';
import {ImportSharedService} from './import-shared.service';
import {ImportAttributeService} from './import-attribute.service';
import {ImportCharacteristicService} from './import-characteristic.service';
import {ImportPowerService} from './import-power.service';
import {ImportItemService} from './import-item.service';
import {ImportCreatureService} from './import-creature.service';
import {TranslateService} from '@ngx-translate/core';
import {ImportMonsterService} from './import-monster.service';

export const IMPORT_ERROR = {
  BadFormat: 'BadFormat',
  MultipleCharacters: 'MultipleCharacters',
  Empty: 'Empty',
  MixedCharacters: 'MixedCharacters',
  MaxItemsExceeded: 'MaxItemsExceeded'
}

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  private MAX_ITEMS = 1500;

  constructor(
    private importCacheService: ImportCacheService,
    private importSharedService: ImportSharedService,
    private importAttributeService: ImportAttributeService,
    private importCharacteristicService: ImportCharacteristicService,
    private importPowerService: ImportPowerService,
    private importItemService: ImportItemService,
    private importCreatureService: ImportCreatureService,
    private importMonsterService: ImportMonsterService,
    private translate: TranslateService
  ) { }

  processFileContent(content: string): Promise<any> {
    this.clearImports();
    const index = content.indexOf('#key=');
    if (index === -1) {
      return Promise.reject();
    }

    const data = content.substr(0, index);
    let obj;
    try {
      obj = JSON.parse(data);
    } catch (_exception) {
      return Promise.reject(IMPORT_ERROR.BadFormat);
    }

    let characterCount = 0;
    let rootItems: ImportItem[] = [];
    obj.objects.forEach((importItem: ImportItem) => {
      if (importItem.type === 'MagicalItem' || importItem.type === 'MagicalItemCategory') {
        this.importItemService.fixMagicalItem(importItem);
      }
      if (importItem.name != null && importItem.name !== '') {
        if (this.importSharedService.isEquipmentObject(importItem)) {
          importItem = this.importItemService.getEquipmentObject(importItem);
        }
        this.importSharedService.initializeImportItem(importItem);
        const rootItem: ImportItem = this.importSharedService.getRootItem(importItem, null);
        rootItems.push(rootItem);
        if (rootItem.type === 'Character') {
          characterCount++;
        }
      }
    });

    if (characterCount > 1) {
      return Promise.reject(this.translate.instant('Imports.UploadFileError.' + IMPORT_ERROR.MultipleCharacters));
    }
    if (characterCount > 0 && rootItems.length > 1) {
      return Promise.reject(this.translate.instant('Imports.UploadFileError.' + IMPORT_ERROR.MixedCharacters));
    }
    if (characterCount === 0 && rootItems.length > this.MAX_ITEMS) {
      return Promise.reject(this.translate.instant('Imports.UploadFileError.' + IMPORT_ERROR.MaxItemsExceeded, {count: rootItems.length, max: this.MAX_ITEMS}));
    }

    rootItems = this.importSharedService.mergeChildrenList(rootItems);

    const flatList: ImportItem[] = this.importSharedService.getFlatList(rootItems);
    flatList.forEach((importItem: ImportItem) => {
      this.addRemainingChildren(importItem);
    });

    return this.updateDuplicates(rootItems, false).then(() => {
      this.updateAncestorCount(rootItems, 0);
      this.setImportItemLinks(rootItems);
      this.importSharedService.sortImports(rootItems);
      this.updateImportItems(rootItems);
    }, () => {
      return Promise.reject(this.translate.instant('Error.Unknown'));
    });
  }

  private setImportItemLinks(importItems: ImportItem[]): void {
    const flatList: ImportItem[] = this.importSharedService.getFlatList(importItems);
    flatList.forEach((importItem: ImportItem) => {
      if (importItem.links.length === 0) {
        const matches = this.findAllMatches(importItem, flatList);
        const matchIds: string[] = this.getLinkIds(matches);
        if (matches.length > 1) {
          matches.forEach((match: ImportItem) => {
            match.linked = true;
            match.links = _.filter(matchIds, (id: string) => { return id !== match.importId });
          });
        }
      }
    });
  }

  private findAllMatches(importItem: ImportItem, list: ImportItem[]): ImportItem[] {
    if (this.importSharedService.isEquipmentObject(importItem)) {
      return this.importItemService.findAllMatches(importItem, list);
    } else {
      return this.importSharedService.findAllMatches(importItem, list);
    }
  }

  private getLinkIds(links: ImportItem[]): string[] {
    const ids: string[] = [];
    links.forEach((link: ImportItem) => {
      ids.push(link.importId);
    });
    return ids;
  }

  updateDuplicates(rootList: ImportItem[], updateLocalStorage: boolean): Promise<any> {
    const flatList = this.importSharedService.getFlatList(rootList);
    return this.initializeCachedSources(flatList).then(async () => {
      for (const importItem of flatList) {
        if (importItem.status !== 'NOT_SUPPORTED' && importItem.status !== 'COMPLETE') {
          if (!this.validateImportItem(importItem)) {
            importItem.status = 'MISSING_PROPERTIES';
          } else {
            const possibleDuplicates: ListObject[] = await this.getPossibleDuplicates(importItem);
            this.processDuplicates(importItem, possibleDuplicates);

            if (importItem.selectedAction !== 'SKIP_ENTRY' && importItem.status === 'READY') {
              if (importItem.duplicates != null && importItem.duplicates.length > 0 && importItem.type !== 'Character') {
                importItem.selectedAction = 'USE_EXISTING';
              } else {
                importItem.selectedAction = 'INSERT_AS_NEW';
              }
            }
          }
        }
      }

      if (updateLocalStorage) {
        this.updateImportItems(rootList);
      }
    });
  }

  private initializeCachedSources(flatList: ImportItem[]): Promise<any> {
    this.importCacheService.clearCache();
    const promises: Promise<any>[] = [];

    // Attributes
    const attributesMap = new Map<ImportItemType, AttributeType>();
    attributesMap.set('ArmorType', AttributeType.ARMOR_TYPE);
    attributesMap.set('CasterType', AttributeType.CASTER_TYPE);
    attributesMap.set('Condition', AttributeType.CONDITION);
    attributesMap.set('Language', AttributeType.LANGUAGE);
    attributesMap.set('Skill', AttributeType.SKILL);
    attributesMap.set('WeaponProperty', AttributeType.WEAPON_PROPERTY);

    attributesMap.forEach((attributeType: AttributeType, type: ImportItemType) => {
      if (this.hasType(type, flatList)) {
        promises.push(this.importCacheService.getAttributesByType(attributeType));
      }
    });

    // Characteristics
    const characteristicsMap = new Map<ImportItemType, CharacteristicType>();
    characteristicsMap.set('Background', CharacteristicType.BACKGROUND);
    characteristicsMap.set('CharacterClass', CharacteristicType.CLASS);
    characteristicsMap.set('Subclass', CharacteristicType.CLASS);
    characteristicsMap.set('Race', CharacteristicType.RACE);

    characteristicsMap.forEach((characteristicType: CharacteristicType, type: ImportItemType) => {
      if (this.hasType(type, flatList)) {
        promises.push(this.importCacheService.getCharacteristicsByType(characteristicType));
      }
    });

    // Powers
    const powersMap = new Map<ImportItemType, PowerType>();
    powersMap.set('Feature', PowerType.FEATURE);
    powersMap.set('Spell', PowerType.SPELL);

    powersMap.forEach((powerType: PowerType, type: ImportItemType) => {
      if (this.hasType(type, flatList)) {
        promises.push(this.importCacheService.getPowersByType(powerType));
      }
    });

    // Items
    const itemsMap = new Map<ImportItemType, ItemType>();
    itemsMap.set('AmmoCategory', ItemType.AMMO);
    itemsMap.set('Ammo', ItemType.AMMO);
    itemsMap.set('BasicAmmo', ItemType.AMMO);
    itemsMap.set('ArmorCategory', ItemType.ARMOR);
    itemsMap.set('Armor', ItemType.ARMOR);
    itemsMap.set('BasicArmor', ItemType.ARMOR);
    itemsMap.set('GearCategory', ItemType.GEAR);
    itemsMap.set('Gear', ItemType.GEAR);
    itemsMap.set('MountCategory', ItemType.MOUNT);
    itemsMap.set('Mount', ItemType.MOUNT);
    itemsMap.set('BasicMount', ItemType.MOUNT);
    itemsMap.set('Tool', ItemType.TOOL);
    itemsMap.set('ToolCategory', ItemType.TOOL);
    itemsMap.set('WeaponCategory', ItemType.WEAPON);
    itemsMap.set('Weapon', ItemType.WEAPON);
    itemsMap.set('BasicWeapon', ItemType.WEAPON);
    itemsMap.set('MagicalItem', ItemType.MAGICAL_ITEM);
    itemsMap.set('MagicalItemCategory', ItemType.MAGICAL_ITEM);
    itemsMap.set('Treasure', ItemType.TREASURE);
    itemsMap.set('TreasureCategory', ItemType.TREASURE);
    itemsMap.set('Pack', ItemType.PACK);
    itemsMap.set('PackCategory', ItemType.PACK);

    itemsMap.forEach((itemType: ItemType, type: ImportItemType) => {
      if (this.hasType(type, flatList)) {
        promises.push(this.importCacheService.getItemsByType(itemType));
        if (itemType === ItemType.TOOL) {
          promises.push(this.importCacheService.getItemsByType(ItemType.VEHICLE));
        }
      }
    });

    // Creatures
    const creaturesMap = new Map<ImportItemType, CreatureType>();
    creaturesMap.set('Character', CreatureType.CHARACTER);

    creaturesMap.forEach((creatureType: CreatureType, type: ImportItemType) => {
      if (this.hasType(type, flatList)) {
        promises.push(this.importCacheService.getCreaturesByType(creatureType));
      }
    });

    // Monsters
    if (this.hasType('Monster', flatList)) {
      promises.push(this.importCacheService.getMonsters());
    }

    return Promise.all(promises);
  }

  private hasType(type: ImportItemType, flatList: ImportItem[]): boolean {
    for (let i = 0; i < flatList.length; i++) {
      const importItem: ImportItem = flatList[i];
      if (importItem.type === type && (importItem.status === 'READY' || importItem.status === 'ERROR' || importItem.status === 'DEPENDENCIES_NOT_COMPLETE')) {
        return true;
      }
    }
    return false;
  }

  private addRemainingChildren(importItem: ImportItem): void {
    switch (importItem.type) {
      case 'ArmorType':
      case 'CasterType':
      case 'Condition':
      case 'Language':
      case 'Skill':
      case 'WeaponProperty':
        // no children applicable
        break;

      case 'Background':
        this.importCharacteristicService.backgroundAddMissingChildren(importItem as ImportBackground);
        break;
      case 'CharacterClass':
      // case 'Subclass':
        this.importCharacteristicService.characterClassAddMissingChildren(importItem as ImportCharacterClass);
        break;
      case 'Race':
        this.importCharacteristicService.raceAddMissingChildren(importItem as ImportRace);
        break;

      case 'Feature':
        this.importPowerService.featureAddMissingChildren(importItem as ImportFeature);
        break;
      case 'Spell':
        this.importPowerService.spellAddMissingChildren(importItem as ImportSpell);
        break;

      case 'AmmoCategory':
      case 'Ammo':
      case 'BasicAmmo':
      case 'ArmorCategory':
      case 'Armor':
      case 'BasicArmor':
      case 'GearCategory':
      case 'Gear':
      case 'MountCategory':
      case 'Mount':
      case 'BasicMount':
      case 'Tool':
      case 'ToolCategory':
      case 'WeaponCategory':
      case 'Weapon':
      case 'BasicWeapon':
      case 'MagicalItem':
      case 'MagicalItemCategory':
      case 'Treasure':
      case 'TreasureCategory':
      case 'Pack':
      case 'PackCategory':
        this.importItemService.equipmentAddMissingChildren(importItem as ImportEquipment);
        break;

      case 'Character':
        this.importCreatureService.playerCharacterAddMissingChildren(importItem as ImportPlayerCharacter);
        break;
      case 'Monster':
        this.importMonsterService.monsterAddMissingChildren(importItem as ImportMonster);
        break;
    }
  }

  private updateAncestorCount(importItems: ImportItem[], ancestorCount: number): void {
    importItems.forEach((importItem: ImportItem) => {
      importItem.ancestorCount = ancestorCount;
      if (importItem.children.length > 0) {
        if (importItem.type === 'Character') {
          this.updateAncestorCount(importItem.children, ancestorCount);
        } else {
          this.updateAncestorCount(importItem.children, ancestorCount + 1);
        }
      }
    });
  }

  private validateImportItem(importItem: ImportItem): boolean {
    if (importItem.children == null) {
      importItem.children = [];
    }
    switch (importItem.type) {
      case 'ArmorType':
        return this.importAttributeService.validateArmorType(importItem as ImportArmorType);
      case 'CasterType':
        return this.importAttributeService.validateCasterType(importItem as ImportCasterType);
      case 'Condition':
        return this.importAttributeService.validateCondition(importItem as ImportCondition);
      case 'Language':
        return this.importAttributeService.validateLanguage(importItem as ImportLanguage);
      case 'Skill':
        return this.importAttributeService.validateSkill(importItem as ImportSkill);
      case 'WeaponProperty':
        return this.importAttributeService.validateWeaponProperty(importItem as ImportWeaponProperty);

      case 'Background':
        return this.importCharacteristicService.validateBackground(importItem as ImportBackground);
      case 'CharacterClass':
        return this.importCharacteristicService.validateCharacterClass(importItem as ImportCharacterClass);
      case 'Subclass':
        return this.importCharacteristicService.validateSubclass(importItem as ImportSubClass);
      case 'Race':
        return this.importCharacteristicService.validateRace(importItem as ImportRace);

      case 'Feature':
        return this.importPowerService.validateFeature(importItem as ImportFeature);
      case 'Spell':
        return this.importPowerService.validateSpell(importItem as ImportSpell);

      case 'AmmoCategory':
      case 'Ammo':
      case 'BasicAmmo':
      case 'ArmorCategory':
      case 'Armor':
      case 'BasicArmor':
      case 'ContainerCategory':
      case 'GearCategory':
      case 'Gear':
      case 'MountCategory':
      case 'Mount':
      case 'BasicMount':
      case 'Tool':
      case 'ToolCategory':
      case 'WeaponCategory':
      case 'Weapon':
      case 'BasicWeapon':
      case 'MagicalItem':
      case 'MagicalItemCategory':
      case 'Treasure':
      case 'TreasureCategory':
      case 'Pack':
      case 'PackCategory':
      case 'EmptySlotItem':
        return this.importItemService.validateEquipment(importItem as ImportEquipment);

      case 'Character':
        return this.importCreatureService.validatePlayerCharacter(importItem as ImportPlayerCharacter);
      case 'Monster':
        return this.importMonsterService.validateMonster(importItem as ImportMonster);
    }

    return false;
  }

  private async getPossibleDuplicates(importItem: ImportItem): Promise<ListObject[]> {
    switch (importItem.type) {
      case 'ArmorType':
        return this.importAttributeService.getPossibleDuplicatesForArmorType(importItem);
      case 'CasterType':
        return this.importAttributeService.getPossibleDuplicatesForCasterType(importItem);
      case 'Condition':
        return this.importAttributeService.getPossibleDuplicatesForCondition(importItem);
      case 'Language':
        return this.importAttributeService.getPossibleDuplicatesForLanguage(importItem);
      case 'Skill':
        return this.importAttributeService.getPossibleDuplicatesForSkill(importItem);
      case 'WeaponProperty':
        return this.importAttributeService.getPossibleDuplicatesForWeaponProperty(importItem);

      case 'Background':
        return this.importCharacteristicService.getPossibleDuplicatesForBackground(importItem);
      case 'CharacterClass':
      case 'Subclass':
        return this.importCharacteristicService.getPossibleDuplicatesForClass(importItem);
      case 'Race':
        return this.importCharacteristicService.getPossibleDuplicatesForRace(importItem);

      case 'Feature':
        return await this.importPowerService.getPossibleDuplicatesForFeature(importItem);
      case 'Spell':
        return this.importPowerService.getPossibleDuplicatesForSpell(importItem);

      case 'AmmoCategory':
      case 'Ammo':
      case 'BasicAmmo':
        return this.importItemService.getPossibleDuplicatesForAmmo(importItem);
      case 'ArmorCategory':
      case 'Armor':
      case 'BasicArmor':
        return this.importItemService.getPossibleDuplicatesForArmor(importItem);
      // case 'ContainerCategory':
      //   break;
      case 'GearCategory':
      case 'Gear':
        return this.importItemService.getPossibleDuplicatesForGear(importItem);
      case 'MountCategory':
      case 'Mount':
      case 'BasicMount':
        return this.importItemService.getPossibleDuplicatesForMount(importItem);
      case 'Tool':
      case 'ToolCategory':
        return this.importItemService.getPossibleDuplicatesForTool(importItem);
      case 'WeaponCategory':
      case 'Weapon':
      case 'BasicWeapon':
        return this.importItemService.getPossibleDuplicatesForWeapon(importItem);
      case 'MagicalItem':
      case 'MagicalItemCategory':
        return this.importItemService.getPossibleDuplicatesForMagicalItem(importItem);
      case 'Treasure':
      case 'TreasureCategory':
        return this.importItemService.getPossibleDuplicatesForTreasure(importItem);
      case 'Pack':
      case 'PackCategory':
        return this.importItemService.getPossibleDuplicatesForPack(importItem);
      // case 'EmptySlotItem':
      //   break;

      case 'Character':
        return this.importCreatureService.getPossibleDuplicatesForCharacter(importItem);
      case 'Monster':
        return this.importMonsterService.getPossibleDuplicatesForMonster(importItem);
    }
    return [];
  }

  private processDuplicates(importItem: ImportItem, possibleDuplicates: ListObject[]): void {
    let count = 0;
    importItem.duplicates = [];
    if (possibleDuplicates != null && possibleDuplicates.length > 0) {
      possibleDuplicates.forEach((sourceObject: ListObject) => {
        count++;
        const duplicate = _.cloneDeep(sourceObject);
        duplicate.name = count + ' - ' + duplicate.name;
        importItem.duplicates.push(duplicate);
      });
    }

    if (importItem.duplicates != null && importItem.duplicates.length > 0 && importItem.selectedDuplicate == null) {
      importItem.selectedDuplicate = importItem.duplicates[0];
      importItem.duplicateConfirmed = importItem.duplicates.length === 1;
    }
  }

  clearImports(): void {
    localStorage.removeItem(LOCAL_STORAGE.IMPORTS_ROOT_ITEMS);
  }

  completeItem(obj: ImportItem, finalId: string): void {
    this.importSharedService.completeItem(obj, finalId);
  }

  updateSelectedDuplicate(config: ImportItemConfiguration, selectedDuplicate: ListObject, processLinks: boolean = true): void {
    if (selectedDuplicate == null || config.importItem.duplicates.length === 0) {
      return;
    }
    config.importItem.selectedDuplicate = selectedDuplicate;
    config.importItem.duplicateConfirmed = true;

    if (processLinks && config.importItem.linked) {
      config.links.forEach((link: ImportItemConfiguration) => {
        this.updateSelectedDuplicate(link, selectedDuplicate, false);
      });
    }
  }

  updateSelectedAction(config: ImportItemConfiguration, selectedAction: ImportActionEvent, processLinks: boolean = true): void {
    const importItem = config.importItem;
    if (selectedAction === 'VIEW' || importItem.status === 'NOT_SUPPORTED' || importItem.status === 'COMPLETE') {
      return;
    }

    switch (selectedAction) {
      case 'USE_EXISTING':
        if (config.useExistingDisabled || importItem.selectedDuplicate == null) {
          return;
        }
        break;
      case 'REPLACE_EXISTING':
        if (config.useExistingDisabled || importItem.selectedDuplicate == null || !importItem.selectedDuplicate.author) {
          return;
        }
        break;
      case 'INSERT_AS_NEW':
        if (config.insertAsNewDisabled) {
          return;
        }
        break;
      case 'SKIP_ENTRY':
        if (config.skipDisabled) {
          return;
        }
        break;
    }

    importItem.selectedAction = selectedAction;

    config.children.forEach((child: ImportItemConfiguration) => {
      this.updateDisabledMenuActions(child, config);
    });

    if (processLinks && config.importItem.linked) {
      config.links.forEach((link: ImportItemConfiguration) => {
        link.menuActions = this.getActions(link);
        this.updateDisabledMenuActions(link, link.parent);
        this.updateSelectedAction(link, selectedAction, false);
      });
    }

    if ((selectedAction === 'SKIP_ENTRY' || selectedAction === 'INSERT_AS_NEW') && config.cascadeParentAction) {
      config.children.forEach((child: ImportItemConfiguration) => {
        this.updateSelectedAction(child, selectedAction);
      });
    }
  }

  getImportItemsFromConfigs(configs: ImportItemConfiguration[]): ImportItem[] {
    const importItems: ImportItem[] = [];
    configs.forEach((config: ImportItemConfiguration) => {
      importItems.push(config.importItem);
    });
    return importItems;
  }

  updateImportItems(importItems: ImportItem[]): void {
    localStorage.setItem(LOCAL_STORAGE.IMPORTS_ROOT_ITEMS, JSON.stringify(importItems));
  }

  getImportItem(id: string): ImportItem {
    const items = this.getImportItems();
    const flatList = this.importSharedService.getFlatList(items);
    let importItem: ImportItem = null;
    if (items != null) {
      if (id.indexOf('imports-') === 0) {
        id = id.substr(8);
      }
      importItem = _.find(flatList, function(_item) { return _item.importId === id });
    }
    return importItem;
  }

  getActions(config: ImportItemConfiguration): ImportAction[] {
    const actions: ImportAction[] = [];
    const importItem = config.importItem;

    if (importItem.status === 'READY' || importItem.status === 'ERROR' || importItem.status === 'DEPENDENCIES_NOT_COMPLETE') {
      if (importItem.duplicates != null && importItem.duplicates.length > 0) {
        actions.push(new ImportAction('USE_EXISTING', 'far fa-dot-circle'));
        actions.push(new ImportAction('REPLACE_EXISTING', 'fas fa-sync-alt'));
      }

      actions.push(new ImportAction('INSERT_AS_NEW', 'fas fa-plus-circle'));
      actions.push(new ImportAction('SKIP_ENTRY', 'fas fa-minus-circle'));
    }

    return actions;
  }

  getImportItems(): ImportItem[] {
    const list: ImportItem[] = [];
    const values = localStorage.getItem(LOCAL_STORAGE.IMPORTS_ROOT_ITEMS);
    if (values != null) {
      const imports = JSON.parse(values);
      imports.forEach((value) => {
        if (value != null) {
          list.push(value);
        }
      });
    }
    return list;
  }

  getImportItemConfiguration(importItem: ImportItem, parent: ImportItemConfiguration = null): ImportItemConfiguration {
    const config = new ImportItemConfiguration();
    config.importItem = importItem;
    config.parent = parent;
    config.cascadeParentAction = this.importSharedService.isCharacteristic(importItem);
    config.menuActions = this.getActions(config);
    this.updateDisabledMenuActions(config, parent);
    config.children = [];
    return config;
  }

  updateDisabledMenuActions(config: ImportItemConfiguration, parent: ImportItemConfiguration): void {
    config.skipDisabled = config.importItem.type === 'Character';
    config.useExistingDisabled = config.importItem.type === 'Character';

    if (parent != null) {
      const forceNew = parent.cascadeParentAction && parent.importItem.selectedAction === 'INSERT_AS_NEW';
      const forceSkip = parent.cascadeParentAction && parent.importItem.selectedAction === 'SKIP_ENTRY';

      config.skipDisabled = (
          parent.importItem.type === 'Character'
          && (config.importItem.type === 'CharacterClass' || config.importItem.type === 'Race')
        );

      config.useExistingDisabled = forceNew || forceSkip;
      config.insertAsNewDisabled = forceSkip;
    }

    config.menuActions.forEach((menuAction: ImportAction) => {
      switch (menuAction.event) {
        case 'USE_EXISTING':
          menuAction.disabled = config.useExistingDisabled || config.importItem.selectedAction == null;
          break;
        case 'REPLACE_EXISTING':
          let replaceExistingDisabled = config.useExistingDisabled;
          const duplicate = config.importItem.selectedDuplicate;
          if (duplicate == null || !duplicate.author) {
            replaceExistingDisabled = true;
          }
          menuAction.disabled = replaceExistingDisabled;
          break;
        case 'INSERT_AS_NEW':
          menuAction.disabled = config.insertAsNewDisabled;
          break;
        case 'SKIP_ENTRY':
          menuAction.disabled = config.skipDisabled;
          break;
      }
    });
  }

  getImportItemConfigurations(importItems: ImportItem[], parent: ImportItemConfiguration): ImportItemConfiguration[] {
    const configs: ImportItemConfiguration[] = [];
    importItems.forEach((importItem: ImportItem) => {
      const config = this.getImportItemConfiguration(importItem, parent);
      configs.push(config);

      if (importItem.children.length > 0) {
        config.children = this.getImportItemConfigurations(importItem.children, config);
      }

      config.descendentCount = this.getDescendentCount(config);

      if (importItem.type === 'Pack' || importItem.type === 'PackCategory' || importItem.type === 'Character') {
        config.dependencies = config.children;
      } else if (parent != null && parent.importItem.type !== 'Character' && parent.importItem.type !== 'Pack' && parent.importItem.type !== 'PackCategory') {
        config.dependencies = [parent];
      }
    });
    return configs;
  }

  private getDescendentCount(config: ImportItemConfiguration): number {
    let count = 0;
    config.children.forEach((child: ImportItemConfiguration) => {
      count++;
      count += this.getDescendentCount(child);
    });
    return count;
  }

  getPrioritizedConfigItems(configs: ImportItemConfiguration[]): ImportItemConfiguration[] {
    let prioritizedConfigs: ImportItemConfiguration[] = [];
    configs.forEach((config: ImportItemConfiguration) => {
      switch (config.importItem.type) {
        case 'ArmorType':
          prioritizedConfigs = prioritizedConfigs.concat(this.importAttributeService.getPrioritizedConfigItemsForArmorType(config));
          break;
        case 'CasterType':
          prioritizedConfigs = prioritizedConfigs.concat(this.importAttributeService.getPrioritizedConfigItemsForCasterType(config));
          break;
        case 'Condition':
          prioritizedConfigs = prioritizedConfigs.concat(this.importAttributeService.getPrioritizedConfigItemsForCondition(config));
          break;
        case 'Language':
          prioritizedConfigs = prioritizedConfigs.concat(this.importAttributeService.getPrioritizedConfigItemsForLanguage(config));
          break;
        case 'Skill':
          prioritizedConfigs = prioritizedConfigs.concat(this.importAttributeService.getPrioritizedConfigItemsForSkill(config));
          break;
        case 'WeaponProperty':
          prioritizedConfigs = prioritizedConfigs.concat(this.importAttributeService.getPrioritizedConfigItemsForWeaponProperty(config));
          break;

        case 'Background':
          prioritizedConfigs = prioritizedConfigs.concat(this.importCharacteristicService.getPrioritizedConfigItemsForBackground(config));
          break;
        case 'CharacterClass':
          prioritizedConfigs = prioritizedConfigs.concat(this.importCharacteristicService.getPrioritizedConfigItemsForCharacterClass(config));
          break;
        case 'Race':
          prioritizedConfigs = prioritizedConfigs.concat(this.importCharacteristicService.getPrioritizedConfigItemsForRace(config));
          break;

        case 'Feature':
          prioritizedConfigs = prioritizedConfigs.concat(this.importPowerService.getPrioritizedConfigItemsForFeature(config));
          break;
        case 'Spell':
          prioritizedConfigs = prioritizedConfigs.concat(this.importPowerService.getPrioritizedConfigItemsForSpell(config));
          break;

        case 'Character':
          prioritizedConfigs = prioritizedConfigs.concat(this.importCreatureService.getPrioritizedConfigItemsForPlayerCharacter(config));
          break;
        case 'Monster':
          prioritizedConfigs = prioritizedConfigs.concat(this.importMonsterService.getPrioritizedConfigItemsForMonster(config));
          break;

        case 'AmmoCategory':
        case 'Ammo':
        case 'BasicAmmo':
        case 'ArmorCategory':
        case 'Armor':
        case 'BasicArmor':
        case 'ContainerCategory':
        case 'GearCategory':
        case 'Gear':
        case 'MountCategory':
        case 'Mount':
        case 'BasicMount':
        case 'Tool':
        case 'ToolCategory':
        case 'WeaponCategory':
        case 'Weapon':
        case 'BasicWeapon':
        case 'MagicalItem':
        case 'MagicalItemCategory':
        case 'Treasure':
        case 'TreasureCategory':
        case 'Pack':
        case 'PackCategory':
        case 'EmptySlotItem':
          prioritizedConfigs = prioritizedConfigs.concat(this.importItemService.getPrioritizedConfigItemsForEquipment(config));
          break;
      }
    });
    return prioritizedConfigs;
  }

  processImportItem(config: ImportItemConfiguration): Promise<any> {
    return this.processImportItemFull(config).catch((error) => {
      this.importSharedService.finishImportingItem(config.importItem, false);
      throw error;
    });
  }

  private processImportItemFull(config: ImportItemConfiguration): Promise<any> {
    if (config.importItem.status !== 'READY' && config.importItem.status !== 'ERROR' && config.importItem.status !== 'DEPENDENCIES_NOT_COMPLETE') {
      return Promise.resolve();
    } else if (config.importItem.selectedAction === 'USE_EXISTING') {
      this.completeItem(config.importItem, config.importItem.selectedDuplicate.id);
      return Promise.resolve();
    } else if (config.importItem.selectedAction === 'SKIP_ENTRY') {
      this.completeItem(config.importItem, null);
      return Promise.resolve();
    } else if (!this.allDependenciesComplete(config)) {
      config.importItem.status = 'DEPENDENCIES_NOT_COMPLETE';
      return Promise.resolve();
    }

    const linkedItem: ImportItemConfiguration = this.getLinkedConfig(config);
    if (linkedItem != null) {
      this.copyLinkedState(config, linkedItem);
      if (linkedItem.importItem.status === 'COMPLETE') {
        return Promise.resolve();
      } else {
        return Promise.reject();
      }
    }

    switch (config.importItem.type) {
      case 'ArmorType':
        return this.importAttributeService.processArmorType(config);
      case 'CasterType':
        return this.importAttributeService.processCasterType(config);
      case 'Condition':
        return this.importAttributeService.processCondition(config);
      case 'Language':
        return this.importAttributeService.processLanguage(config);
      case 'Skill':
        return this.importAttributeService.processSkill(config);
      case 'WeaponProperty':
        return this.importAttributeService.processWeaponProperty(config);

      case 'Background':
        return this.importCharacteristicService.processBackground(config);
      case 'CharacterClass':
        return this.importCharacteristicService.processCharacterClass(config);
      case 'Subclass':
        return this.importCharacteristicService.processSubclass(config);
      case 'Race':
        return this.importCharacteristicService.processRace(config);

      case 'Feature':
        return this.importPowerService.processFeature(config);
      case 'Spell':
        return this.importPowerService.processSpell(config);

      case 'AmmoCategory':
      case 'Ammo':
      case 'BasicAmmo':
      case 'ArmorCategory':
      case 'Armor':
      case 'BasicArmor':
      case 'GearCategory':
      case 'Gear':
      case 'MountCategory':
      case 'Mount':
      case 'BasicMount':
      case 'Tool':
      case 'ToolCategory':
      case 'WeaponCategory':
      case 'Weapon':
      case 'BasicWeapon':
      case 'MagicalItem':
      case 'MagicalItemCategory':
      case 'Treasure':
      case 'TreasureCategory':
      case 'Pack':
      case 'PackCategory':
        return this.importItemService.processEquipment(config);

      case 'Character':
        return this.importCreatureService.processPlayerCharacter(config);
      case 'Monster':
        return this.importMonsterService.processMonster(config);
    }
  }

  private allDependenciesComplete(config: ImportItemConfiguration): boolean {
    for (let i = 0; i < config.dependencies.length; i++) {
      const dependency = config.dependencies[i];
      if (dependency.importItem.selectedAction !== 'SKIP_ENTRY') {
        if (dependency.importItem.status !== 'COMPLETE' && dependency.importItem.status !== 'NOT_SUPPORTED') {
          return false;
        }
      }
    }
    return true;
  }

  private getLinkedConfig(config: ImportItemConfiguration): ImportItemConfiguration {
    if (config.importItem.linked) {
      return _.find(config.links, function(link) { return link.importItem.linked && link.importItem.status !== 'READY' && link.importItem.status !== 'ERROR'; });
    }
    return null;
  }

  private copyLinkedState(config: ImportItemConfiguration, linkedConfig: ImportItemConfiguration): void {
    if (linkedConfig != null) {
      config.importItem.selectedAction = linkedConfig.importItem.selectedAction;
      config.importItem.selectedDuplicate = linkedConfig.importItem.selectedDuplicate;
      config.importItem.status = linkedConfig.importItem.status;
      config.importItem.finalId = linkedConfig.importItem.finalId;
    }
  }

  toggleLinked(config: ImportItemConfiguration): void {
    const linked = !config.importItem.linked;
    config.links.forEach((link: ImportItemConfiguration) => {
      link.importItem.linked = linked;
      if (linked) {
        this.copyLinkedState(link, config);
      }
    });
    config.importItem.linked = linked;
  }

  getAbility(importItem: ImportAbility): Ability {
    const ability = new Ability();
    if (importItem != null) {
      ability.name = importItem.name;
      ability.abbr = importItem.abbr;
    }
    return ability;
  }
}
