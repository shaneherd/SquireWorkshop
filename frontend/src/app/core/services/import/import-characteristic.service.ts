import {Injectable} from '@angular/core';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';
import {
  ImportBackground,
  ImportBackgroundDetail,
  ImportBackgroundDetailType,
  ImportCharacterClass,
  ImportItem,
  ImportItemConfiguration,
  ImportListObject,
  ImportRace,
  ImportSkill,
  ImportSpellConfiguration,
  ImportSubClass
} from '../../../shared/imports/import-item';
import {ListObject} from '../../../shared/models/list-object';
import {ImportSharedService} from './import-shared.service';
import {CharacteristicService} from '../characteristics/characteristic.service';
import {ImportCacheService} from './import-cache.service';
import {Background} from '../../../shared/models/characteristics/background';
import * as _ from 'lodash';
import {ItemType} from '../../../shared/models/items/item-type.enum';
import {ProficiencyType} from '../../../shared/models/proficiency';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {BackgroundTrait} from '../../../shared/models/characteristics/background-trait';
import {BackgroundTraitType} from '../../../shared/models/characteristics/background-trait-type.enum';
import {CharacterClass} from '../../../shared/models/characteristics/character-class';
import {PowerType} from '../../../shared/models/powers/power-type.enum';
import {SpellConfiguration} from '../../../shared/models/characteristics/spell-configuration';
import {Race} from '../../../shared/models/characteristics/race';
import {Speed} from '../../../shared/models/speed';
import {SpeedType} from '../../../shared/models/speed-type.enum';
import {SID} from '../../../constants';
import {Modifier} from '../../../shared/models/modifier';
import {ImportAttributeService} from './import-attribute.service';
import {AbilityService} from '../attributes/ability.service';
import {ImportPowerService} from './import-power.service';
import {CharacteristicType} from '../../../shared/models/characteristics/characteristic-type.enum';

@Injectable({
  providedIn: 'root'
})
export class ImportCharacteristicService {

  constructor(
    private characteristicService: CharacteristicService,
    private abilityService: AbilityService,
    private importSharedService: ImportSharedService,
    private importCacheService: ImportCacheService,
    private importAttributeService: ImportAttributeService,
    private importPowerService: ImportPowerService
  ) { }

  private processCharacteristic(characteristic: Characteristic, importItem: ImportItem): Promise<any> {
    switch (importItem.selectedAction) {
      case 'REPLACE_EXISTING':
        characteristic.id = importItem.selectedDuplicate.id;
        return this.characteristicService.updateCharacteristic(characteristic).then(() => {
          this.importSharedService.completeItem(importItem, characteristic.id);
        }, () => {
          this.importSharedService.finishImportingItem(importItem, false);
        });
      case 'INSERT_AS_NEW':
        return this.characteristicService.createCharacteristic(characteristic).then((id: string) => {
          const cache = this.importCacheService.getCharacteristics(characteristic.characteristicType);
          if (cache != null) {
            const listObject = new ListObject(id, characteristic.name);
            cache.push(listObject);
          }
          characteristic.id = id;
          this.importSharedService.completeItem(importItem, id);
        }, () => {
          this.importSharedService.finishImportingItem(importItem, false);
        });
      default:
        return Promise.resolve();
    }
  }

  /****************** Background *********************/

  getPossibleDuplicatesForBackground(importItem: ImportItem): ListObject[] {
    const source: ListObject[] = this.importCacheService.getCharacteristics(CharacteristicType.BACKGROUND);
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  getPrioritizedConfigItemsForBackground(config: ImportItemConfiguration): ImportItemConfiguration[] {
    if (config.importItem.type !== 'Background') {
      return [];
    }
    let configs: ImportItemConfiguration[] = [];
    configs.push(config);
    config.children.forEach((child: ImportItemConfiguration) => {
      if (child.importItem.type === 'Background') {
        configs = configs.concat(this.getPrioritizedConfigItemsForBackground(child));
      }
    });
    return configs;
  }

  async getBackground(config: ImportItemConfiguration): Promise<Background> {
    const importItem = config.importItem as ImportBackground;
    if (importItem == null) {
      return Promise.reject(null);
    }

    const background = new Background();
    background.id = importItem.finalId != null ? importItem.finalId : '0';
    background.name = importItem.name;
    background.description = importItem.description;

    background.variations = [];
    _.uniqBy(importItem.variations, (trait: ImportBackgroundDetail) => { return trait.description })
      .forEach((variation: ImportBackgroundDetail) => {
        background.variations.push(this.getBackgroundTrait(variation));
      });

    background.personalities = [];
    _.uniqBy(importItem.personalities, (trait: ImportBackgroundDetail) => { return trait.description })
      .forEach((variation: ImportBackgroundDetail) => {
        background.personalities.push(this.getBackgroundTrait(variation));
      });

    background.ideals = [];
    _.uniqBy(importItem.ideals, (trait: ImportBackgroundDetail) => { return trait.description })
      .forEach((variation: ImportBackgroundDetail) => {
        background.ideals.push(this.getBackgroundTrait(variation));
      });

    background.bonds = [];
    _.uniqBy(importItem.bonds, (trait: ImportBackgroundDetail) => { return trait.description })
      .forEach((variation: ImportBackgroundDetail) => {
        background.bonds.push(this.getBackgroundTrait(variation));
      });

    background.flaws = [];
    _.uniqBy(importItem.flaws, (trait: ImportBackgroundDetail) => { return trait.description })
      .forEach((variation: ImportBackgroundDetail) => {
        background.flaws.push(this.getBackgroundTrait(variation));
      });

    if (config.parent != null && config.parent.importItem.type === 'Background') {
      background.parent = await this.getBackground(config.parent);
      if (config.parent.importItem.finalId != null) {
        background.parent.id = config.parent.importItem.finalId;
      } else if ((config.parent.importItem.selectedAction === 'USE_EXISTING'
        || config.parent.importItem.selectedAction === 'REPLACE_EXISTING')
        && config.parent.importItem.selectedDuplicate != null) {
        background.parent.id = config.parent.importItem.selectedDuplicate.id;
      } else {
        background.parent = null;
      }
    }

    const armors = await this.importCacheService.getItemsByType(ItemType.ARMOR);
    background.armorProfs = this.importSharedService.getProficiencyList(importItem.armorProfs, armors, ProficiencyType.ARMOR);
    const armorTypes = await this.importCacheService.getAttributesByType(AttributeType.ARMOR_TYPE);
    background.armorTypeProfs = this.importSharedService.getProficiencyList(importItem.armorTypeProfs, armorTypes, ProficiencyType.ARMOR_TYPE);
    const languages = await this.importCacheService.getAttributesByType(AttributeType.LANGUAGE);
    background.languageProfs = this.importSharedService.getProficiencyList(importItem.languageProfs, languages, ProficiencyType.LANGUAGE);
    background.numLanguages = importItem.numLanguages;
    const abilities = await this.importCacheService.getAttributesByType(AttributeType.ABILITY);
    background.savingThrowProfs = this.importSharedService.getProficiencyList(importItem.savingThrowProfs, abilities, ProficiencyType.ABILITY);
    const skills = await this.importCacheService.getAttributesByType(AttributeType.SKILL);
    background.skillProfs = this.importSharedService.getProficiencyList(importItem.skillProfs, skills, ProficiencyType.SKILL);
    background.skillChoiceProfs = [];
    background.toolCategoryProfs = [];
    const toolCategories = await this.importCacheService.getAttributesByType(AttributeType.TOOL_CATEGORY);
    background.toolCategoryChoiceProfs = this.importSharedService.getProficiencyList(importItem.toolCategoriesToChooseFrom, toolCategories, ProficiencyType.TOOL_CATEGORY);
    background.numTools = importItem.numTools;
    const tools = await this.importCacheService.getItemsByType(ItemType.TOOL);
    background.toolProfs = this.importSharedService.getProficiencyList(importItem.toolProfs, tools, ProficiencyType.TOOL);
    const weapons = await this.importCacheService.getItemsByType(ItemType.WEAPON);
    background.weaponProfs = this.importSharedService.getProficiencyList(importItem.weaponProfs, weapons, ProficiencyType.WEAPON);
    const weaponTypes = await this.importCacheService.getAttributesByType(AttributeType.WEAPON_TYPE);
    background.weaponTypeProfs = this.importSharedService.getProficiencyList(importItem.weaponTypeProfs, weaponTypes, ProficiencyType.WEAPON_TYPE);

    return Promise.resolve(background);
  }

  getBackgroundTrait(importItem: ImportBackgroundDetail): BackgroundTrait {
    const trait = new BackgroundTrait(this.getBackgroundTraitType(importItem.backgroundDetailType));
    trait.description = importItem.description;
    return trait;
  }

  private getBackgroundTraitType(type: ImportBackgroundDetailType): BackgroundTraitType {
    switch (type) {
      case 'VARIATION':
        return BackgroundTraitType.VARIATION;
      case 'PERSONALITY':
        return BackgroundTraitType.PERSONALITY;
      case 'IDEAL':
        return BackgroundTraitType.IDEAL;
      case 'BOND':
        return BackgroundTraitType.BOND;
      case 'FLAW':
        return BackgroundTraitType.FLAW;
    }
    return null;
  }

  async processBackground(config: ImportItemConfiguration): Promise<any> {
    const backgroundImportItem = config.importItem as ImportBackground;

    //if replace existing, deleting the current trait might cause an issue if the trait was already in use

    return this.getBackground(config).then(async (background: Background) => {
      background.skillProfs = await this.importAttributeService.processSkillProfs(background.skillProfs, backgroundImportItem.skills);

      background.armorTypeProfs = this.importSharedService.processProfs(background.armorTypeProfs, this.importCacheService.getAttributes(AttributeType.ARMOR_TYPE));
      await this.importAttributeService.processLanguageDependencies(backgroundImportItem.languageProfs);
      background.languageProfs = this.importSharedService.processProfs(background.languageProfs, this.importCacheService.getAttributes(AttributeType.LANGUAGE));
      background.savingThrowProfs = this.importSharedService.processProfs(background.savingThrowProfs, this.importCacheService.getAttributes(AttributeType.ABILITY));
      background.toolCategoryChoiceProfs = this.importSharedService.processProfs(background.toolCategoryChoiceProfs, this.importCacheService.getAttributes(AttributeType.TOOL_CATEGORY));
      background.weaponTypeProfs = this.importSharedService.processProfs(background.weaponTypeProfs, this.importCacheService.getAttributes(AttributeType.WEAPON_TYPE));

      background.armorProfs = this.importSharedService.processProfs(background.armorProfs, this.importCacheService.getItems(ItemType.ARMOR));
      background.toolProfs = this.importSharedService.processProfs(background.toolProfs, this.importCacheService.getItems(ItemType.TOOL));
      background.weaponProfs = this.importSharedService.processProfs(background.weaponProfs, this.importCacheService.getItems(ItemType.WEAPON));
      return this.processCharacteristic(background, config.importItem);
    });
  }

  backgroundAddMissingChildren(importItem: ImportBackground): void {
    if (importItem.skills != null) {
      importItem.skills.forEach((skill: ImportSkill) => {
        this.importSharedService.initializeImportItem(skill);
      });
    }
  }

  validateBackground(importItem: ImportBackground): boolean {
    return importItem.name != null
      && importItem.name !== '';
  }

  /****************** Character Class *********************/

  getPossibleDuplicatesForClass(importItem: ImportItem): ListObject[] {
    const source: ListObject[] = this.importCacheService.getCharacteristics(CharacteristicType.CLASS);
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  getPrioritizedConfigItemsForCharacterClass(config: ImportItemConfiguration): ImportItemConfiguration[] {
    if (config.importItem.type !== 'CharacterClass') {
      return [];
    }
    const configs: ImportItemConfiguration[] = [];
    configs.push(config);
    config.children.forEach((child: ImportItemConfiguration) => {
      if (child.importItem.type === 'Subclass') {
        configs.push(child);
      }
    });
    return configs;
  }

  async getCharacterClass(config: ImportItemConfiguration): Promise<CharacterClass> {
    const importItem = config.importItem as ImportCharacterClass;
    if (importItem == null) {
      return Promise.reject(null);
    }

    const characterClass = new CharacterClass();
    characterClass.id = importItem.finalId != null ? importItem.finalId : '0';
    characterClass.name = importItem.name;

    if (config.parent != null && config.parent.importItem.type === 'CharacterClass') {
      characterClass.parent = await this.getCharacterClass(config.parent);
      if (config.parent.importItem.finalId != null) {
        characterClass.parent.id = config.parent.importItem.finalId;
      } else if ((config.parent.importItem.selectedAction === 'USE_EXISTING'
        || config.parent.importItem.selectedAction === 'REPLACE_EXISTING')
        && config.parent.importItem.selectedDuplicate != null) {
        characterClass.parent.id = config.parent.importItem.selectedDuplicate.id;
      } else {
        characterClass.parent = null;
      }
    }

    const armors = await this.importCacheService.getItemsByType(ItemType.ARMOR);
    characterClass.armorProfs = this.importSharedService.getProficiencyList(importItem.armorProfs, armors, ProficiencyType.ARMOR);
    characterClass.armorSecondaryProfs = this.importSharedService.getProficiencyList(importItem.armorSecondaryProfs, armors, ProficiencyType.ARMOR);
    const armorTypes = await this.importCacheService.getAttributesByType(AttributeType.ARMOR_TYPE);
    characterClass.armorTypeProfs = this.importSharedService.getProficiencyList(importItem.armorTypeProfs, armorTypes, ProficiencyType.ARMOR_TYPE);
    characterClass.armorTypeSecondaryProfs = this.importSharedService.getProficiencyList(importItem.armorTypeSecondaryProfs, armorTypes, ProficiencyType.ARMOR_TYPE);
    const languages = await this.importCacheService.getAttributesByType(AttributeType.LANGUAGE);
    characterClass.languageProfs = this.importSharedService.getProficiencyList(importItem.languageProfs, languages, ProficiencyType.LANGUAGE);
    characterClass.languageSecondaryProfs = this.importSharedService.getProficiencyList(importItem.languageSecondaryProfs, languages, ProficiencyType.LANGUAGE);
    const abilities = await this.importCacheService.getAttributesByType(AttributeType.ABILITY);
    characterClass.savingThrowProfs = this.importSharedService.getProficiencyList(importItem.savingThrowProfs, abilities, ProficiencyType.ABILITY);
    characterClass.savingThrowSecondaryProfs = this.importSharedService.getProficiencyList(importItem.savingThrowSecondaryProfs, abilities, ProficiencyType.ABILITY);
    const skills = await this.importCacheService.getAttributesByType(AttributeType.SKILL);
    characterClass.skillProfs = this.importSharedService.getProficiencyList(importItem.skillProfs, skills, ProficiencyType.SKILL);
    characterClass.skillSecondaryProfs = this.importSharedService.getProficiencyList(importItem.skillSecondaryProfs, skills, ProficiencyType.SKILL);
    characterClass.skillChoiceProfs = this.importSharedService.getProficiencyList(importItem.classSkills, skills, ProficiencyType.SKILL);
    characterClass.numSkills = importItem.numSkills;
    const toolCategories = await this.importCacheService.getAttributesByType(AttributeType.TOOL_CATEGORY);
    characterClass.toolCategoryChoiceProfs = this.importSharedService.getProficiencyList(importItem.toolCategoriesToChooseFrom, toolCategories, ProficiencyType.TOOL_CATEGORY);
    characterClass.numTools = importItem.numTools;
    const tools = await this.importCacheService.getItemsByType(ItemType.TOOL);
    characterClass.toolProfs = this.importSharedService.getProficiencyList(importItem.toolProfs, tools, ProficiencyType.TOOL);
    characterClass.toolSecondaryProfs = this.importSharedService.getProficiencyList(importItem.toolSecondaryProfs, tools, ProficiencyType.TOOL);
    const weapons = await this.importCacheService.getItemsByType(ItemType.WEAPON);
    characterClass.weaponProfs = this.importSharedService.getProficiencyList(importItem.weaponProfs, weapons, ProficiencyType.WEAPON);
    characterClass.weaponSecondaryProfs = this.importSharedService.getProficiencyList(importItem.weaponSecondaryProfs, weapons, ProficiencyType.WEAPON);
    const weaponTypes = await this.importCacheService.getAttributesByType(AttributeType.WEAPON_TYPE);
    characterClass.weaponTypeProfs = this.importSharedService.getProficiencyList(importItem.weaponTypeProfs, weaponTypes, ProficiencyType.WEAPON_TYPE);
    characterClass.weaponTypeSecondaryProfs = this.importSharedService.getProficiencyList(importItem.weaponTypeSecondaryProfs, weaponTypes, ProficiencyType.WEAPON_TYPE);

    // starting gold
    characterClass.startingGold.numDice = importItem.numGoldDice;
    characterClass.startingGold.diceSize = this.importSharedService.getDiceSize(importItem.goldDiceSize);
    characterClass.startingGold.miscModifier = importItem.numGoldMod;

    // hp at first
    characterClass.hpAtFirst.numDice = importItem.hpAtFirst;
    characterClass.hpAtFirst.abilityModifier = this.importSharedService.getAbilityById(importItem.hpAtFirstModifierId);

    // hit dice
    characterClass.hitDice.numDice = importItem.hitDice;
    characterClass.hitDice.diceSize = this.importSharedService.getDiceSize(importItem.hitDiceSize);

    // hp gain
    characterClass.hpGain.numDice = importItem.hpGainDice;
    characterClass.hpGain.diceSize = this.importSharedService.getDiceSize(importItem.hpGainDiceSize);
    characterClass.hpGain.abilityModifier = this.importSharedService.getAbilityById(importItem.hpGainModifierId);

    // ability score increases
    characterClass.abilityScoreIncreases = [];
    if (importItem.abilityScoreIncreases != null) {
      importItem.abilityScoreIncreases.forEach((levelNumber: number) => {
        const level = this.importSharedService.getLevelByNumber(levelNumber);
        if (level != null) {
          characterClass.abilityScoreIncreases.push(level.id);
        }
      });
    }

    // spellcasting
    const spellcastingAbility = this.importSharedService.getAbilityById(importItem.spellCastingAbilityId);
    characterClass.spellCastingAbility = spellcastingAbility == null ? null : spellcastingAbility.id;
    characterClass.classSpellPreparation.requirePreparation = importItem.requiresSpellPreparation;
    characterClass.classSpellPreparation.numToPrepareAbilityModifier = this.importSharedService.getAbilityById(importItem.prepareAbilityId);
    characterClass.classSpellPreparation.numToPrepareIncludeLevel = importItem.prepareClassLevel;
    characterClass.classSpellPreparation.numToPrepareMiscModifier = importItem.prepareMod;
    characterClass.casterType = this.importAttributeService.getCasterType(importItem.casterType);
    await this.importCacheService.getPowersByType(PowerType.SPELL);
    characterClass.spellConfigurations = this.getSpellList(importItem.classSpells);

    // if (importItem.subclasses != null) {
    //   importItem.subclasses.forEach((importSubClass: ImportSubClass) => {
    //     const subclass = this.getSubclass(importSubClass);
    //     if (subclass != null) {
    //       characterClass.subclasses.push(subclass);
    //     }
    //   });
    // }

    return Promise.resolve(characterClass);
  }

  async getSubclass(config: ImportItemConfiguration): Promise<CharacterClass> {
    const importItem = config.importItem as ImportSubClass;
    if (importItem == null) {
      return Promise.reject(null);
    }

    const characterClass = new CharacterClass();
    characterClass.id = importItem.finalId != null ? importItem.finalId : '0';
    characterClass.name = importItem.name;
    characterClass.description = importItem.description;
    characterClass.casterType = this.importAttributeService.getCasterType(importItem.casterType);
    await this.importCacheService.getPowersByType(PowerType.SPELL);
    characterClass.spellConfigurations = this.getSpellConfigurations(importItem.configurations);

    if (config.parent != null) {
      characterClass.parent = await this.getCharacterClass(config.parent);
      if (config.parent.importItem.finalId != null) {
        characterClass.parent.id = config.parent.importItem.finalId;
      } else if ((config.parent.importItem.selectedAction === 'USE_EXISTING'
        || config.parent.importItem.selectedAction === 'REPLACE_EXISTING')
        && config.parent.importItem.selectedDuplicate != null) {
        characterClass.parent.id = config.parent.importItem.selectedDuplicate.id;
      } else {
        characterClass.parent = null;
      }
    }

    return Promise.resolve(characterClass);
  }

  private getSpellList(spells: ImportListObject[]): SpellConfiguration[] {
    const configs: SpellConfiguration[] = [];
    spells.forEach((spell: ImportListObject) => {
      const cachedSpells: ListObject[] = this.importPowerService.getCachedSpells(spell.name);
      cachedSpells.forEach((cachedSpell: ListObject) => {
        const config = new SpellConfiguration();
        config.spell = new ListObject(cachedSpell.id, cachedSpell.name);
        config.levelGained = new ListObject(null, '');
        configs.push(config);
      });
    });
    return _.uniqBy(configs, (config: SpellConfiguration) => { return config.spell.id });
  }

  private getSpellConfigurations(spellConfigurations: ImportSpellConfiguration[]): SpellConfiguration[] {
    const configs: SpellConfiguration[] = [];
    if (spellConfigurations != null) {
      spellConfigurations.forEach((spellConfiguration: ImportSpellConfiguration) => {
        const cachedSpells: ListObject[] = this.importPowerService.getCachedSpells(spellConfiguration.spell.name);
        cachedSpells.forEach((cachedSpell: ListObject) => {
          const config = new SpellConfiguration();
          config.spell = new ListObject(cachedSpell.id, cachedSpell.name);
          const level = this.importSharedService.getLevelByNumber(spellConfiguration.levelGained);
          const levelId = level == null ? null : level.id;
          config.levelGained = new ListObject(levelId, '');
          config.alwaysPrepared = spellConfiguration.alwaysPrepared;
          config.countTowardsPrepared = spellConfiguration.countTowardsPrepared;
          configs.push(config);
        });
      });
    }
    return configs;
  }

  processCharacterClass(config: ImportItemConfiguration): Promise<any> {
    const classImportItem = config.importItem as ImportCharacterClass;
    return this.getCharacterClass(config).then(async (characterClass: CharacterClass) => {
      characterClass.skillProfs = await this.importAttributeService.processSkillProfs(characterClass.skillProfs, classImportItem.skills);
      characterClass.skillSecondaryProfs = await this.importAttributeService.processSkillProfs(characterClass.skillSecondaryProfs, classImportItem.secondarySkills);
      characterClass.skillChoiceProfs = await this.importAttributeService.processSkillProfs(characterClass.skillChoiceProfs, classImportItem.classSkills);
      characterClass.casterType = await this.importAttributeService.processCasterTypeDependency(classImportItem.casterType);

      characterClass.armorTypeProfs = this.importSharedService.processProfs(characterClass.armorProfs, this.importCacheService.getAttributes(AttributeType.ARMOR_TYPE));
      characterClass.armorTypeSecondaryProfs = this.importSharedService.processProfs(characterClass.armorTypeSecondaryProfs, this.importCacheService.getAttributes(AttributeType.ARMOR_TYPE));
      await this.importAttributeService.processLanguageDependencies(classImportItem.languageProfs);
      await this.importAttributeService.processLanguageDependencies(classImportItem.languageSecondaryProfs);
      characterClass.languageProfs = this.importSharedService.processProfs(characterClass.languageProfs, this.importCacheService.getAttributes(AttributeType.LANGUAGE));
      characterClass.languageSecondaryProfs = this.importSharedService.processProfs(characterClass.languageSecondaryProfs, this.importCacheService.getAttributes(AttributeType.LANGUAGE));
      characterClass.savingThrowProfs = this.importSharedService.processProfs(characterClass.savingThrowProfs, this.importCacheService.getAttributes(AttributeType.ABILITY));
      characterClass.savingThrowSecondaryProfs = this.importSharedService.processProfs(characterClass.savingThrowSecondaryProfs, this.importCacheService.getAttributes(AttributeType.ABILITY));
      characterClass.toolCategoryChoiceProfs = this.importSharedService.processProfs(characterClass.toolCategoryChoiceProfs, this.importCacheService.getAttributes(AttributeType.TOOL_CATEGORY));
      characterClass.weaponTypeProfs = this.importSharedService.processProfs(characterClass.weaponTypeProfs, this.importCacheService.getAttributes(AttributeType.WEAPON_TYPE));
      characterClass.weaponTypeSecondaryProfs = this.importSharedService.processProfs(characterClass.weaponTypeSecondaryProfs, this.importCacheService.getAttributes(AttributeType.WEAPON_TYPE));

      characterClass.armorProfs = this.importSharedService.processProfs(characterClass.armorProfs, this.importCacheService.getItems(ItemType.ARMOR));
      characterClass.armorSecondaryProfs = this.importSharedService.processProfs(characterClass.armorSecondaryProfs, this.importCacheService.getItems(ItemType.ARMOR));
      characterClass.toolProfs = this.importSharedService.processProfs(characterClass.armorProfs, this.importCacheService.getItems(ItemType.TOOL));
      characterClass.toolSecondaryProfs = this.importSharedService.processProfs(characterClass.toolSecondaryProfs, this.importCacheService.getItems(ItemType.TOOL));
      characterClass.weaponProfs = this.importSharedService.processProfs(characterClass.armorProfs, this.importCacheService.getItems(ItemType.WEAPON));
      characterClass.weaponSecondaryProfs = this.importSharedService.processProfs(characterClass.weaponSecondaryProfs, this.importCacheService.getItems(ItemType.WEAPON));

      await this.processCharacteristic(characterClass, config.importItem);

      try {
        await this.processClassSpells(characterClass);
      } catch (e) {
        if (config.importItem.selectedAction === 'INSERT_AS_NEW') {
          //if error on any of this, delete spell
          await this.characteristicService.deleteCharacteristic(characterClass);
          await this.importCacheService.deleteCharacteristic(CharacteristicType.CLASS, characterClass.id);
          throw e;
        }
      }
    });
  }

  private processClassSpells(characterClass: CharacterClass): Promise<any> {
    return this.characteristicService.addSpellConfigurations(characterClass, characterClass.spellConfigurations);
  }

  processSubclass(config: ImportItemConfiguration): Promise<any> {
    const subClassImportItem = config.importItem as ImportSubClass;
    return this.getSubclass(config).then(async (subclass: CharacterClass) => {
      subclass.casterType = await this.importAttributeService.processCasterTypeDependency(subClassImportItem.casterType);
      await this.processCharacteristic(subclass, config.importItem);
      try {
        await this.processClassSpells(subclass);
      } catch (e) {
        if (config.importItem.selectedAction === 'INSERT_AS_NEW') {
          //if error on any of this, delete spell
          await this.characteristicService.deleteCharacteristic(subclass);
          await this.importCacheService.deleteCharacteristic(CharacteristicType.CLASS, subclass.id);
          throw e;
        }
      }
    });
  }

  validateCharacterClass(importItem: ImportCharacterClass): boolean {
    return importItem.name != null
      && importItem.name !== ''
      && importItem.hpAtFirst > 0
      && importItem.hitDice > 0
      && importItem.hitDiceSize != null
      && importItem.hpGainDice > 0
      && importItem.hpGainDiceSize != null;
  }

  validateSubclass(importItem: ImportSubClass): boolean {
    return importItem.name != null
      && importItem.name !== '';
  }

  characterClassAddMissingChildren(importItem: ImportCharacterClass): void {
    if (importItem.skills != null) {
      importItem.skills.forEach((skill: ImportSkill) => {
        this.importSharedService.initializeImportItem(skill);
      });
    }
    if (importItem.secondarySkills != null) {
      importItem.secondarySkills.forEach((skill: ImportSkill) => {
        this.importSharedService.initializeImportItem(skill);
      });
    }
    if (importItem.classSkills != null) {
      importItem.classSkills.forEach((skill: ImportSkill) => {
        this.importSharedService.initializeImportItem(skill);
      });
    }
    if (importItem.casterType != null) {
      this.importSharedService.initializeImportItem(importItem.casterType);
    }
    if (importItem.subclasses != null && importItem.subclasses.length > 0) {
      importItem.subclasses.forEach((subclass: ImportSubClass) => {
        this.importSharedService.initializeImportItem(subclass);
        this.subClassAddMissingChildren(subclass);
        importItem.children.push(subclass);
      });
      importItem.children = this.importSharedService.mergeChildrenList(importItem.children);
    }
  }

  subClassAddMissingChildren(importItem: ImportSubClass): void {
    if (importItem.casterType != null) {
      this.importSharedService.initializeImportItem(importItem.casterType);
    }
  }

  /****************** Race *********************/

  getPossibleDuplicatesForRace(importItem: ImportItem): ListObject[] {
    const source: ListObject[] = this.importCacheService.getCharacteristics(CharacteristicType.RACE);
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  getPrioritizedConfigItemsForRace(config: ImportItemConfiguration): ImportItemConfiguration[] {
    if (config.importItem.type !== 'Race') {
      return [];
    }
    let configs: ImportItemConfiguration[] = [];
    configs.push(config);
    config.children.forEach((child: ImportItemConfiguration) => {
      if (child.importItem.type === 'Race') {
        configs = configs.concat(this.getPrioritizedConfigItemsForRace(child));
      }
    });
    return configs;
  }

  async getRace(config: ImportItemConfiguration): Promise<Race> {
    const importItem = config.importItem as ImportRace;
    if (importItem == null) {
      return Promise.reject(null);
    }

    const race = new Race();
    race.id = importItem.finalId != null ? importItem.finalId : '0';
    race.name = importItem.name;

    if (config.parent != null && config.parent.importItem.type === 'Race') {
      race.parent = await this.getRace(config.parent);
      if (config.parent.importItem.finalId != null) {
        race.parent.id = config.parent.importItem.finalId;
      } else if ((config.parent.importItem.selectedAction === 'USE_EXISTING'
        || config.parent.importItem.selectedAction === 'REPLACE_EXISTING')
        && config.parent.importItem.selectedDuplicate != null) {
        race.parent.id = config.parent.importItem.selectedDuplicate.id;
      } else {
        race.parent = null;
      }
    }

    const armors = await this.importCacheService.getItemsByType(ItemType.ARMOR);
    race.armorProfs = this.importSharedService.getProficiencyList(importItem.armorProfs, armors, ProficiencyType.ARMOR);
    const armorTypes = await this.importCacheService.getAttributesByType(AttributeType.ARMOR_TYPE);
    race.armorTypeProfs = this.importSharedService.getProficiencyList(importItem.armorTypeProfs, armorTypes, ProficiencyType.ARMOR_TYPE);
    const languages = await this.importCacheService.getAttributesByType(AttributeType.LANGUAGE);
    race.languageProfs = this.importSharedService.getProficiencyList(importItem.languageProfs, languages, ProficiencyType.LANGUAGE);
    race.numLanguages = importItem.numLanguages;
    const abilities = await this.importCacheService.getAttributesByType(AttributeType.ABILITY);
    race.savingThrowProfs = this.importSharedService.getProficiencyList(importItem.savingThrowProfs, abilities, ProficiencyType.ABILITY);
    race.numAbilities = importItem.numAbilities;
    const skills = await this.importCacheService.getAttributesByType(AttributeType.SKILL);
    race.skillProfs = this.importSharedService.getProficiencyList(importItem.skillProfs, skills, ProficiencyType.SKILL);
    const tools = await this.importCacheService.getItemsByType(ItemType.TOOL);
    race.toolProfs = this.importSharedService.getProficiencyList(importItem.toolProfs, tools, ProficiencyType.TOOL);
    const weapons = await this.importCacheService.getItemsByType(ItemType.WEAPON);
    race.weaponProfs = this.importSharedService.getProficiencyList(importItem.weaponProfs, weapons, ProficiencyType.WEAPON);
    const weaponTypes = await this.importCacheService.getAttributesByType(AttributeType.WEAPON_TYPE);
    race.weaponTypeProfs = this.importSharedService.getProficiencyList(importItem.weaponTypeProfs, weaponTypes, ProficiencyType.WEAPON_TYPE);

    race.speeds = [];
    race.speeds.push(new Speed(SpeedType.WALK, importItem.speed));
    race.speeds.push(new Speed(SpeedType.CRAWL, importItem.crawlingSpeed));
    race.speeds.push(new Speed(SpeedType.CLIMB, importItem.climbingSpeed));
    race.speeds.push(new Speed(SpeedType.SWIM, importItem.swimmingSpeed));
    race.speeds.push(new Speed(SpeedType.FLY, importItem.flyingSpeed));
    race.speeds.push(new Speed(SpeedType.BURROW, importItem.burrowSpeed));

    race.size = this.importSharedService.getSize(importItem.size);
    race.abilityModifiers = [];
    const strMod = this.getAbilityModifier(importItem.strMod, SID.ABILITIES.STRENGTH);
    if (strMod != null) {
      race.abilityModifiers.push(strMod);
    }
    const dexMod = this.getAbilityModifier(importItem.dexMod, SID.ABILITIES.DEXTERITY);
    if (dexMod != null) {
      race.abilityModifiers.push(dexMod);
    }
    const conMod = this.getAbilityModifier(importItem.conMod, SID.ABILITIES.CONSTITUTION);
    if (conMod != null) {
      race.abilityModifiers.push(conMod);
    }
    const intMod = this.getAbilityModifier(importItem.intMod, SID.ABILITIES.INTELLIGENCE);
    if (intMod != null) {
      race.abilityModifiers.push(intMod);
    }
    const chaMod = this.getAbilityModifier(importItem.chaMod, SID.ABILITIES.CHARISMA);
    if (chaMod != null) {
      race.abilityModifiers.push(chaMod);
    }
    const wisMod = this.getAbilityModifier(importItem.wisMod, SID.ABILITIES.WISDOM);
    if (wisMod != null) {
      race.abilityModifiers.push(wisMod);
    }

    if (importItem.strMod !== 0) {
      const mod = new Modifier();
      mod.attribute = this.abilityService.getAbilityBySid(SID.ABILITIES.STRENGTH);
      mod.value = importItem.strMod;
    }

    return Promise.resolve(race);
  }

  private getAbilityModifier(modValue: number, sid: number): Modifier {
    let mod: Modifier = null;
    if (modValue !== 0) {
      mod = new Modifier();
      mod.attribute = this.abilityService.getAbilityBySid(sid);
      mod.value = modValue;
    }
    return mod;
  }

  async processRace(config: ImportItemConfiguration): Promise<any> {
    const raceImportItem = config.importItem as ImportRace;
    return this.getRace(config).then(async (race: Race) => {
      race.skillProfs = await this.importAttributeService.processSkillProfs(race.skillProfs, raceImportItem.skills);

      race.armorTypeProfs = this.importSharedService.processProfs(race.armorTypeProfs, this.importCacheService.getAttributes(AttributeType.ARMOR_TYPE));
      await this.importAttributeService.processLanguageDependencies(raceImportItem.languageProfs);
      race.languageProfs = this.importSharedService.processProfs(race.languageProfs, this.importCacheService.getAttributes(AttributeType.LANGUAGE));
      race.savingThrowProfs = this.importSharedService.processProfs(race.savingThrowProfs, this.importCacheService.getAttributes(AttributeType.ABILITY));
      race.weaponTypeProfs = this.importSharedService.processProfs(race.weaponTypeProfs, this.importCacheService.getAttributes(AttributeType.WEAPON_TYPE));

      race.armorProfs = this.importSharedService.processProfs(race.armorProfs, this.importCacheService.getItems(ItemType.ARMOR));
      race.toolProfs = this.importSharedService.processProfs(race.toolProfs, this.importCacheService.getItems(ItemType.TOOL));
      race.weaponProfs = this.importSharedService.processProfs(race.weaponProfs, this.importCacheService.getItems(ItemType.WEAPON));
      return this.processCharacteristic(race, config.importItem);
    });
  }

  validateRace(importItem: ImportRace): boolean {
    return importItem.name != null
      && importItem.name !== ''
      && importItem.size != null;
  }

  raceAddMissingChildren(importItem: ImportRace): void {
    if (importItem.skills != null) {
      importItem.skills.forEach((skill: ImportSkill) => {
        this.importSharedService.initializeImportItem(skill);
      });
    }
  }
}
