import {Injectable} from '@angular/core';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {
  ImportAreaOfEffect,
  ImportArmorType,
  ImportCasterType,
  ImportCondition,
  ImportDamageType,
  ImportDamageTypeItem,
  ImportDeity,
  ImportItem,
  ImportItemConfiguration,
  ImportLanguage,
  ImportListObject,
  ImportSkill,
  ImportSpellSchool,
  ImportSpellSlots,
  ImportTimeUnit,
  ImportToolCategoryType,
  ImportWeaponProperty,
  ImportWeaponType
} from '../../../shared/imports/import-item';
import {ListObject} from '../../../shared/models/list-object';
import {AttributeService} from '../attributes/attribute.service';
import {ImportSharedService} from './import-shared.service';
import {ImportCacheService} from './import-cache.service';
import {ArmorType} from '../../../shared/models/attributes/armor-type';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import * as _ from 'lodash';
import {CasterType} from '../../../shared/models/attributes/caster-type';
import {SpellSlots} from '../../../shared/models/spell-slots';
import {Condition} from '../../../shared/models/attributes/condition';
import {Language} from '../../../shared/models/attributes/language';
import {Skill} from '../../../shared/models/attributes/skill';
import {WeaponProperty} from '../../../shared/models/attributes/weapon-property';
import {ToolCategory} from '../../../shared/models/attributes/tool-category';
import {WeaponType} from '../../../shared/models/items/weapon-type';
import {DamageType} from '../../../shared/models/attributes/damage-type';
import {CharacterLevelService} from '../character-level.service';
import {AbilityService} from '../attributes/ability.service';
import {Proficiency} from '../../../shared/models/proficiency';
import {AreaOfEffect} from '../../../shared/models/attributes/area-of-effect';
import {SpellSchool} from '../../../shared/models/attributes/spell-school';
import {Deity} from '../../../shared/models/attributes/deity';
import {Alignment} from '../../../shared/models/attributes/alignment';
import {SID} from '../../../constants';

@Injectable({
  providedIn: 'root'
})
export class ImportAttributeService {

  constructor(
    private attributeService: AttributeService,
    private characterLevelService: CharacterLevelService,
    private abilityService: AbilityService,
    private importSharedService: ImportSharedService,
    private importCacheService: ImportCacheService
  ) { }

  private processAttribute(attribute: Attribute, importItem: ImportItem): Promise<any> {
    switch (importItem.selectedAction) {
      case 'REPLACE_EXISTING':
        attribute.id = importItem.selectedDuplicate.id;
        return this.attributeService.updateAttribute(attribute).then(() => {
          this.importSharedService.completeItem(importItem, attribute.id);
        }, () => {
          this.importSharedService.finishImportingItem(importItem, false);
        });
      case 'INSERT_AS_NEW':
        return this.attributeService.createAttribute(attribute).then((id: string) => {
          const cache = this.importCacheService.getAttributes(attribute.attributeType);
          if (cache != null) {
            const listObject = new ListObject(id, attribute.name);
            cache.push(listObject);
          }
          attribute.id = id;
          this.importSharedService.completeItem(importItem, id);
        }, () => {
          this.importSharedService.finishImportingItem(importItem, false);
        });
      default:
        return Promise.resolve();
    }
  }

  /******************* Armor Type ***************************/

  getPossibleDuplicatesForArmorType(importItem: ImportItem): ListObject[] {
    const source: ListObject[] = this.importCacheService.getAttributes(AttributeType.ARMOR_TYPE);
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  getPrioritizedConfigItemsForArmorType(config: ImportItemConfiguration): ImportItemConfiguration[] {
    if (config.importItem.type !== 'ArmorType') {
      return [];
    }
    const configs: ImportItemConfiguration[] = [];
    configs.push(config);
    return configs;
  }

  getCachedArmorType(armorType: ImportArmorType): ArmorType {
    const finalArmorType = this.getArmorType(armorType);
    finalArmorType.id = '0';
    const cache = this.importCacheService.getAttributes(AttributeType.ARMOR_TYPE);
    const cachedCasterType = _.find(cache, function(_armorType) { return _armorType.name.toLowerCase() === armorType.name.toLowerCase() });
    if (cachedCasterType != null) {
      finalArmorType.id = cachedCasterType.id;
    }
    return finalArmorType;
  }

  async processArmorTypeDependency(importItem: ImportArmorType): Promise<ArmorType> {
    await this.importCacheService.getAttributesByType(AttributeType.ARMOR_TYPE);
    const armorType = this.getCachedArmorType(importItem);
    if (armorType.id === '0') {
      await this.processAttribute(armorType, importItem);
    }
    return armorType;
  }

  getArmorType(importItem: ImportArmorType): ArmorType {
    const armorType = new ArmorType();
    if (importItem != null) {
      armorType.id = importItem.finalId != null ? importItem.finalId : '0';
      armorType.name = importItem.name;
      armorType.don = importItem.don == null ? 0 : importItem.don;
      armorType.donTimeUnit = this.getTimeUnit(importItem.donTimeUnit);
      armorType.doff = importItem.doff == null ? 0 : importItem.doff;
      armorType.doffTimeUnit = this.getTimeUnit(importItem.doffTimeUnit);
    }
    return armorType;
  }

  private getTimeUnit(importTime: ImportTimeUnit): string {
    switch (importTime) {
      case 'standard action(s)':
        return 'STANDARD';
      case 'move action(s)':
        return 'MOVE';
      case 'free action(s)':
        return 'FREE';
      case 'second(s)':
        return 'SECOND';
      case 'minute(s)':
        return 'MINUTE';
      case 'hour(s)':
        return 'HOUR';
      default:
        return '';
    }
  }

  processArmorType(config: ImportItemConfiguration): Promise<any> {
    const attribute = this.getArmorType(config.importItem as ImportArmorType);
    return this.processAttribute(attribute, config.importItem);
  }

  validateArmorType(importItem: ImportArmorType): boolean {
    return importItem.name != null
      && importItem.name !== ''
      && importItem.donTimeUnit != null
      && importItem.donTimeUnit !== ''
      && importItem.doffTimeUnit != null
      && importItem.doffTimeUnit !== '';
  }

  /*********************** Caster Type *********************************/

  getPossibleDuplicatesForCasterType(importItem: ImportItem): ListObject[] {
    const source: ListObject[] = this.importCacheService.getAttributes(AttributeType.CASTER_TYPE);
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  getPrioritizedConfigItemsForCasterType(config: ImportItemConfiguration): ImportItemConfiguration[] {
    if (config.importItem.type !== 'CasterType') {
      return [];
    }
    const configs: ImportItemConfiguration[] = [];
    configs.push(config);
    return configs;
  }

  getCachedCasterType(casterType: ImportCasterType): CasterType {
    const finalCasterType = this.getCasterType(casterType);
    finalCasterType.id = '0';
    const cachedCasterTypes = this.importCacheService.getAttributes(AttributeType.CASTER_TYPE);
    const cachedCasterType = _.find(cachedCasterTypes, function(_skill) { return _skill.name.toLowerCase() === casterType.name.toLowerCase() });
    if (cachedCasterType != null) {
      finalCasterType.id = cachedCasterType.id;
    }
    return finalCasterType;
  }

  getCasterType(importItem: ImportCasterType): CasterType {
    const casterType = new CasterType(null);
    if (importItem != null) {
      casterType.id = importItem.finalId != null ? importItem.finalId : '0';
      casterType.name = importItem.name;
      casterType.multiClassWeight = importItem.multiClassWeight == null ? 0 : importItem.multiClassWeight;
      casterType.roundUp = importItem.roundUp == null ? false : importItem.roundUp;

      const levels = this.characterLevelService.getLevelsDetailedFromStorage();
      importItem.spellSlots.forEach((spellSlot: ImportSpellSlots) => {
        const level = this.importSharedService.getLevel(spellSlot.level.level, levels);
        const spellSlots = this.getSpellSlots(spellSlot, level);
        casterType.spellSlots.push(spellSlots);
      });
    }
    return casterType;
  }

  private getSpellSlots(importItem: ImportSpellSlots, level: ListObject): SpellSlots {
    const spellSlots = new SpellSlots(level);
    spellSlots.slot1 = importItem.slot1;
    spellSlots.slot2 = importItem.slot2;
    spellSlots.slot3 = importItem.slot3;
    spellSlots.slot4 = importItem.slot4;
    spellSlots.slot5 = importItem.slot5;
    spellSlots.slot6 = importItem.slot6;
    spellSlots.slot7 = importItem.slot7;
    spellSlots.slot8 = importItem.slot8;
    spellSlots.slot9 = importItem.slot9;
    return spellSlots;
  }

  processCasterType(config: ImportItemConfiguration): Promise<any> {
    const attribute = this.getCasterType(config.importItem as ImportCasterType);
    return this.processAttribute(attribute, config.importItem);
  }

  async processCasterTypeDependency(importItem: ImportCasterType): Promise<CasterType> {
    await this.importCacheService.getAttributesByType(AttributeType.CASTER_TYPE);
    const casterType = this.getCachedCasterType(importItem);
    if (casterType.id === '0') {
      await this.processAttribute(casterType, importItem);
    }
    return casterType;
  }

  validateCasterType(importItem: ImportCasterType): boolean {
    let valid = importItem.name != null
      && importItem.name !== ''
      && importItem.spellSlots != null
      && importItem.spellSlots.length === 20;

    if (valid && importItem.spellSlots != null) {
      importItem.spellSlots.forEach((slot: ImportSpellSlots) => {
        valid = valid && slot.level != null && slot.level.level != null;
      });
    }

    return valid;
  }

  /****************** Condition **********************/

  getPossibleDuplicatesForCondition(importItem: ImportItem): ListObject[] {
    const source: ListObject[] = this.importCacheService.getAttributes(AttributeType.CONDITION);
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  getPrioritizedConfigItemsForCondition(config: ImportItemConfiguration): ImportItemConfiguration[] {
    if (config.importItem.type !== 'Condition') {
      return [];
    }
    const configs: ImportItemConfiguration[] = [];
    configs.push(config);
    return configs;
  }

  getCondition(importItem: ImportCondition): Condition {
    const condition = new Condition();
    if (importItem != null) {
      condition.id = importItem.finalId != null ? importItem.finalId : '0';
      condition.name = importItem.name;
      condition.description = importItem.description == null ? '' : importItem.description;
    }
    return condition;
  }

  processCondition(config: ImportItemConfiguration): Promise<any> {
    const attribute = this.getCondition(config.importItem as ImportCondition);
    return this.processAttribute(attribute, config.importItem);
  }

  validateCondition(importItem: ImportCondition): boolean {
    return importItem.name != null
      && importItem.name !== '';
  }

  async processConditionDependencies(conditions: ImportCondition[]): Promise<any> {
    if (conditions != null) {
      const cachedConditions = await this.importCacheService.getAttributesByType(AttributeType.CONDITION);
      for (const condition of conditions) {
        const cachedCondition = _.find(cachedConditions, (_condition: ListObject) => { return _condition.name.toLowerCase() === condition.name.toLowerCase(); });
        if (cachedCondition == null) {
          condition.selectedAction = 'INSERT_AS_NEW';
          const attribute = this.getCondition(condition);
          await this.processAttribute(attribute, condition);
        }
      }
    }
  }

  /****************** Language ***********************/

  getPossibleDuplicatesForLanguage(importItem: ImportItem): ListObject[] {
    const source: ListObject[] = this.importCacheService.getAttributes(AttributeType.LANGUAGE);
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  getPrioritizedConfigItemsForLanguage(config: ImportItemConfiguration): ImportItemConfiguration[] {
    if (config.importItem.type !== 'Language') {
      return [];
    }
    const configs: ImportItemConfiguration[] = [];
    configs.push(config);
    return configs;
  }

  getLanguage(importItem: ImportLanguage): Language {
    const language = new Language();
    if (importItem != null) {
      language.id = importItem.finalId != null ? importItem.finalId : '0';
      language.name = importItem.name;
      language.script = importItem.script == null ? '' : importItem.script;
    }
    return language;
  }

  processLanguage(config: ImportItemConfiguration): Promise<any> {
    const attribute = this.getLanguage(config.importItem as ImportLanguage);
    return this.processAttribute(attribute, config.importItem);
  }

  validateLanguage(importItem: ImportLanguage): boolean {
    return importItem.name != null
      && importItem.name !== '';
  }

  async processLanguageDependencies(languages: ImportListObject[]): Promise<any> {
    const cachedLanguages = await this.importCacheService.getAttributesByType(AttributeType.LANGUAGE);
    for (const language of languages) {
      const cachedLanguage = _.find(cachedLanguages, (_language: ListObject) => { return _language.name.toLowerCase() === language.name.toLowerCase(); });
      if (cachedLanguage == null) {
        const languageImport = new ImportLanguage();
        languageImport.name = language.name;
        languageImport.selectedAction = 'INSERT_AS_NEW';
        const attribute = this.getLanguage(languageImport);
        await this.processAttribute(attribute, languageImport);
      }
    }
  }

  /******************** Skill **************************/

  getPossibleDuplicatesForSkill(importItem: ImportItem): ListObject[] {
    const source: ListObject[] = this.importCacheService.getAttributes(AttributeType.SKILL);
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  getPrioritizedConfigItemsForSkill(config: ImportItemConfiguration): ImportItemConfiguration[] {
    if (config.importItem.type !== 'Skill') {
      return [];
    }
    const configs: ImportItemConfiguration[] = [];
    configs.push(config);
    return configs;
  }

  getSkill(importItem: ImportSkill): Skill {
    const skill = new Skill();
    if (importItem != null) {
      skill.id = importItem.finalId != null ? importItem.finalId : '0';
      skill.name = importItem.name;
      skill.ability = importItem.abilityModifier == null ? null : this.abilityService.getAbilityByName(importItem.abilityModifier.name);
      skill.description = importItem.description == null ? '' : importItem.description;
    }
    return skill;
  }

  getSkillProf(name: string, skills: ImportSkill[]): Skill {
    const skill = _.find(skills, function(_skill) { return _skill.name.toLowerCase() === name.toLowerCase() });
    if (skill != null) {
      const finalSkill = this.getSkill(skill);
      finalSkill.id = '0';
      const cachedSkills = this.importCacheService.getAttributes(AttributeType.SKILL);
      const cachedSkill = _.find(cachedSkills, function(_skill) { return _skill.name.toLowerCase() === name.toLowerCase() });
      if (cachedSkill != null) {
        finalSkill.id = cachedSkill.id;
      }
      return finalSkill;
    }
    return null;
  }

  async processSkillProfs(profs: Proficiency[], skills: ImportSkill[]): Promise<Proficiency[]> {
    const finalProfs: Proficiency[] = [];
    for (const prof of profs) {
      if (prof.attribute.id !== '0') {
        finalProfs.push(prof);
      } else {
        await this.importCacheService.getAttributesByType(AttributeType.SKILL);
        const skill = this.getSkillProf(prof.attribute.name, skills);
        if (skill != null) {
          if (skill.id !== '0') {
            prof.attribute.id = skill.id;
            finalProfs.push(prof);
          } else {
            const skillImportItem = _.find(skills, function(_skill) { return _skill.name.toLowerCase() === skill.name.toLowerCase() });
            skillImportItem.selectedAction = 'INSERT_AS_NEW';
            await this.processAttribute(skill, skillImportItem).then(() => {
              prof.attribute.id = skillImportItem.finalId;
              finalProfs.push(prof);
            });
          }
        }
      }
    }
    return finalProfs;
  }

  processSkill(config: ImportItemConfiguration): Promise<any> {
    const attribute = this.getSkill(config.importItem as ImportSkill);
    return this.processAttribute(attribute, config.importItem);
  }

  validateSkill(importItem: ImportSkill): boolean {
    return importItem.name != null
      && importItem.name !== '';
  }

  /****************** Deity *********************/

  async processDeityDependency(name: string): Promise<Deity> {
    if (name === '') {
      return Promise.resolve(null);
    }
    await this.importCacheService.getAttributesByType(AttributeType.ALIGNMENT);
    await this.importCacheService.getAttributesByType(AttributeType.DEITY);
    await this.importCacheService.getAttributesByType(AttributeType.DEITY_CATEGORY);
    const deity: Deity = this.getCachedDeity(name);
    if (deity.id === '0') {
      const importItem = new ImportDeity();
      importItem.selectedAction = 'INSERT_AS_NEW';
      await this.processAttribute(deity, importItem);
    }
    return deity;
  }

  getCachedDeity(deity: string): Deity {
    const finalDeity = this.getDeity(deity);
    finalDeity.id = '0';
    const cache = this.importCacheService.getAttributes(AttributeType.DEITY);
    const cachedDeity = _.find(cache, function(_property) { return _property.name.toLowerCase() === deity.toLowerCase() });
    if (cachedDeity != null) {
      finalDeity.id = cachedDeity.id;
    }
    return finalDeity;
  }

  getDeity(name: string): Deity {
    const deity = new Deity();
    deity.name = name;
    deity.alignment = new Alignment();
    deity.alignment = null;
    deity.deityCategory = null;
    return deity;
  }

  /****************** Weapon Property *********************/

  getPossibleDuplicatesForWeaponProperty(importItem: ImportItem): ListObject[] {
    const source: ListObject[] = this.importCacheService.getAttributes(AttributeType.WEAPON_PROPERTY);
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  getCachedWeaponProperty(importItem: ImportWeaponProperty): WeaponProperty {
    const finalWeaponProperty = this.getWeaponProperty(importItem);
    finalWeaponProperty.id = '0';
    const cache: ListObject[] = this.importCacheService.getAttributes(AttributeType.WEAPON_PROPERTY);
    const cachedWeaponProperty = _.find(cache, function(_property) { return _property.name.toLowerCase() === importItem.name.toLowerCase() });
    if (cachedWeaponProperty != null) {
      finalWeaponProperty.id = cachedWeaponProperty.id;
      if (cachedWeaponProperty.name === 'Ammunition') {
        finalWeaponProperty.sid = SID.WEAPON_PROPERTIES.AMMUNITION;
      } else if (cachedWeaponProperty.name === 'Versatile') {
        finalWeaponProperty.sid = SID.WEAPON_PROPERTIES.VERSATILE;
      }
    }
    return finalWeaponProperty;
  }

  getPrioritizedConfigItemsForWeaponProperty(config: ImportItemConfiguration): ImportItemConfiguration[] {
    if (config.importItem.type !== 'WeaponProperty') {
      return [];
    }
    const configs: ImportItemConfiguration[] = [];
    configs.push(config);
    return configs;
  }

  getWeaponProperty(importItem: ImportWeaponProperty): WeaponProperty {
    const weaponProperty = new WeaponProperty();
    if (importItem != null) {
      weaponProperty.id = importItem.finalId != null ? importItem.finalId : '0';
      weaponProperty.name = importItem.name;
      weaponProperty.description = importItem.description == null ? '' : importItem.description;
    }
    return weaponProperty;
  }

  processWeaponProperty(config: ImportItemConfiguration): Promise<any> {
    const attribute = this.getWeaponProperty(config.importItem as ImportWeaponProperty);
    return this.processAttribute(attribute, config.importItem);
  }

  async processWeaponPropertyDependency(importItem: ImportWeaponProperty): Promise<WeaponProperty> {
    await this.importCacheService.getAttributesByType(AttributeType.WEAPON_PROPERTY);
    const weaponProperty = this.getCachedWeaponProperty(importItem);
    if (weaponProperty.id === '0') {
      await this.processAttribute(weaponProperty, importItem);
    }
    return weaponProperty;
  }

  validateWeaponProperty(importItem: ImportWeaponProperty): boolean {
    return importItem.name != null
      && importItem.name !== '';
  }

  /****************** Tool Category *********************/

  getCachedToolCategoryType(categoryType: ImportToolCategoryType): ToolCategory {
    const finalToolCategory = this.getToolCategory(categoryType);
    finalToolCategory.id = '0';
    const cache = this.importCacheService.getAttributes(AttributeType.TOOL_CATEGORY);
    const cachedToolCategory = _.find(cache, function(toolCategory) { return toolCategory.name.toLowerCase() === categoryType.name.toLowerCase() });
    if (cachedToolCategory != null) {
      finalToolCategory.id = cachedToolCategory.id;
    }
    return finalToolCategory;
  }

  getToolCategory(importItem: ImportToolCategoryType): ToolCategory {
    const toolCategory = new ToolCategory();
    if (importItem != null) {
      toolCategory.id = importItem.finalId != null ? importItem.finalId : '0';
      toolCategory.name = importItem.name;
      toolCategory.description = importItem.description == null ? '' : importItem.description;
    }
    return toolCategory;
  }

  async processToolCategoryDependency(importItem: ImportToolCategoryType): Promise<ToolCategory> {
    await this.importCacheService.getAttributesByType(AttributeType.TOOL_CATEGORY);
    const toolCategory = this.getCachedToolCategoryType(importItem);
    if (toolCategory.id === '0') {
      await this.processAttribute(toolCategory, importItem);
    }
    return toolCategory;
  }

  /****************** Weapon Type *********************/

  getCachedWeaponType(importItem: ImportWeaponType): WeaponType {
    const finalWeaponType = this.getWeaponType(importItem);
    finalWeaponType.id = '0';
    const cache = this.importCacheService.getAttributes(AttributeType.WEAPON_TYPE);
    const cachedWeaponType = _.find(cache, function(weaponType) { return weaponType.name.toLowerCase() === importItem.name.toLowerCase() });
    if (cachedWeaponType != null) {
      finalWeaponType.id = cachedWeaponType.id;
    }
    return finalWeaponType;
  }

  getWeaponType(importItem: ImportWeaponType): WeaponType {
    const weaponType = new WeaponType();
    if (importItem != null) {
      weaponType.id = importItem.finalId != null ? importItem.finalId : '0';
      weaponType.name = importItem.name;
    }
    return weaponType;
  }

  /****************** Damage Type *********************/

  getDamageTypeImportItem(damageType: ImportDamageType): ImportDamageTypeItem {
    const importItem = new ImportDamageTypeItem();
    importItem.name = damageType;
    importItem.type = 'DamageType';
    return importItem;
  }

  getCachedDamageType(importItem: ImportDamageTypeItem): DamageType {
    const finalDamageType = this.getDamageType(importItem);
    finalDamageType.id = '0';
    if (importItem != null) {
      const cache = this.importCacheService.getAttributes(AttributeType.DAMAGE_TYPE);
      const cachedDamageType = _.find(cache, function(_damageType) { return _damageType.name.toLowerCase() === importItem.name.toLowerCase() });
      if (cachedDamageType != null) {
        finalDamageType.id = cachedDamageType.id;
        finalDamageType.name = cachedDamageType.name;
      }
    }
    return finalDamageType;
  }

  getDamageType(importItem: ImportDamageTypeItem): DamageType {
    const damageType = new DamageType();
    if (importItem != null) {
      damageType.id = importItem.finalId != null ? importItem.finalId : '0';
      damageType.name = importItem.name;
    }
    return damageType;
  }

  async processDamageTypeDependency(importItem: ImportDamageTypeItem): Promise<DamageType> {
    await this.importCacheService.getAttributesByType(AttributeType.DAMAGE_TYPE);
    const cached = this.getCachedDamageType(importItem);
    if (cached.id === '0') {
      importItem.selectedAction = 'INSERT_AS_NEW';
      await this.processAttribute(cached, importItem);
    }
    return cached;
  }

  /****************** Area of Effect *********************/

  getAreaOfEffect(importItem: ImportAreaOfEffect): AreaOfEffect {
    const areaOfEffect = new AreaOfEffect();
    if (importItem != null) {
      areaOfEffect.id = importItem.finalId != null ? importItem.finalId : '0';
      areaOfEffect.name = importItem.name;
      areaOfEffect.description = importItem.description;
    }
    return areaOfEffect;
  }

  getCachedAreaOfEffect(areaOfEffect: ImportAreaOfEffect): AreaOfEffect {
    const finalAreaOfEffect = this.getAreaOfEffect(areaOfEffect);
    finalAreaOfEffect.id = '0';
    const cache = this.importCacheService.getAttributes(AttributeType.AREA_OF_EFFECT);
    const cachedCasterType = _.find(cache, function(aoe) { return aoe.name.toLowerCase() === areaOfEffect.name.toLowerCase() });
    if (cachedCasterType != null) {
      finalAreaOfEffect.id = cachedCasterType.id;
    }
    return finalAreaOfEffect;
  }

  async processAreaOfEffectDependency(importItem: ImportAreaOfEffect): Promise<AreaOfEffect> {
    if (importItem.name === '') {
      return null;
    }
    await this.importCacheService.getAttributesByType(AttributeType.AREA_OF_EFFECT);
    const cached = this.getCachedAreaOfEffect(importItem);
    if (cached.id === '0') {
      importItem.selectedAction = 'INSERT_AS_NEW';
      await this.processAttribute(cached, importItem);
    }
    return cached;
  }

  /****************** Spell School *********************/

  getSpellSchool(importItem: ImportSpellSchool): SpellSchool {
    const spellSchool = new SpellSchool();
    if (importItem != null) {
      spellSchool.id = importItem.finalId != null ? importItem.finalId : '0';
      spellSchool.name = importItem.name;
      spellSchool.description = importItem.description;
    }
    return spellSchool;
  }

  getCachedSpellSchool(spellSchool: ImportSpellSchool): SpellSchool {
    const finalSpellSchool = this.getSpellSchool(spellSchool);
    finalSpellSchool.id = '0';
    const cache = this.importCacheService.getAttributes(AttributeType.SPELL_SCHOOL);
    const cachedSpellSchool = _.find(cache, function(school) { return school.name.toLowerCase() === spellSchool.name.toLowerCase() });
    if (cachedSpellSchool != null) {
      finalSpellSchool.id = cachedSpellSchool.id;
    }
    return finalSpellSchool;
  }

  async processSpellSchoolDependency(importItem: ImportSpellSchool): Promise<SpellSchool> {
    await this.importCacheService.getAttributesByType(AttributeType.SPELL_SCHOOL);
    const cached = this.getCachedSpellSchool(importItem);
    if (cached.id === '0') {
      importItem.selectedAction = 'INSERT_AS_NEW';
      await this.processAttribute(cached, importItem);
    }
    return cached;
  }
}
