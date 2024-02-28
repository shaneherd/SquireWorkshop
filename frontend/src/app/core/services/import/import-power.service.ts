import {Injectable} from '@angular/core';
import {Power} from '../../../shared/models/powers/power';
import {
  ImportCastingTimeUnit,
  ImportFeature,
  ImportItem,
  ImportItemConfiguration,
  ImportListObject,
  ImportSpell
} from '../../../shared/imports/import-item';
import {ListObject} from '../../../shared/models/list-object';
import {ImportSharedService} from './import-shared.service';
import {PowerService} from '../powers/power.service';
import {ImportCacheService} from './import-cache.service';
import {Feature} from '../../../shared/models/powers/feature';
import {CharacteristicType} from '../../../shared/models/characteristics/characteristic-type.enum';
import * as _ from 'lodash';
import {PowerAreaOfEffect} from '../../../shared/models/powers/power-area-of-effect';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {RangeType} from '../../../shared/models/powers/range-type.enum';
import {Spell} from '../../../shared/models/powers/spell';
import {PowerType} from '../../../shared/models/powers/power-type.enum';
import {ImportAttributeService} from './import-attribute.service';
import {CastingTimeUnit} from '../../../shared/models/casting-time-unit.enum';
import {RangeUnit} from '../../../shared/models/powers/range-unit.enum';
import {FeatureListObject} from '../../../shared/models/powers/feature-list-object';
import {SpellListObject} from '../../../shared/models/powers/spell-list-object';

@Injectable({
  providedIn: 'root'
})
export class ImportPowerService {

  constructor(
    private powerService: PowerService,
    private importSharedService: ImportSharedService,
    private importCacheService: ImportCacheService,
    private importAttributeService: ImportAttributeService
  ) { }

  private processPower(power: Power, importItem: ImportItem): Promise<any> {
    switch (importItem.selectedAction) {
      case 'REPLACE_EXISTING':
        power.id = importItem.selectedDuplicate.id;
        return this.powerService.updatePower(power).then(() => {
          this.importSharedService.completeItem(importItem, power.id);
        }, () => {
          this.importSharedService.finishImportingItem(importItem, false);
        });
      case 'INSERT_AS_NEW':
        return this.powerService.createPower(power).then((id: string) => {
          const cache = this.importCacheService.getPowers(power.powerType);
          if (cache != null) {
            const listObject = new ListObject(id, power.name);
            cache.push(listObject);
          }
          power.id = id;
          this.importSharedService.completeItem(importItem, id);
        }, () => {
          this.importSharedService.finishImportingItem(importItem, false);
        });
      default:
        return Promise.resolve();
    }
  }

  /****************** Feature *********************/

  async getPossibleDuplicatesForFeature(importItem: ImportItem): Promise<ListObject[]> {
    const featureImport = importItem as ImportFeature;
    const featureListObject = await this.getFeatureListObject(featureImport);
    const source: FeatureListObject[] = await this.importCacheService.getFeaturesByType(featureListObject.characteristicType);

    const possibleDuplicates: ListObject[] = [];
    if (source != null) {
      const name = importItem.name.toLowerCase();
      source.forEach((feature: FeatureListObject) => {
        if (feature.name.toLowerCase() === name) {
          if (feature.characteristicType === featureListObject.characteristicType || (feature.characteristicType == null && featureListObject.characteristicType === CharacteristicType.FEAT)) {
            if (featureListObject.characteristicType === CharacteristicType.FEAT) {
              possibleDuplicates.push(feature);
            } else if (feature.characteristic != null && featureListObject.characteristic.name.toLowerCase() === feature.characteristic.name.toLowerCase()) {
              possibleDuplicates.push(feature);
            }
          }
        }
      });
    }
    return possibleDuplicates;
  }

  getPrioritizedConfigItemsForFeature(config: ImportItemConfiguration): ImportItemConfiguration[] {
    if (config.importItem.type !== 'Feature') {
      return [];
    }
    const configs: ImportItemConfiguration[] = [];
    configs.push(config);
    return configs;
  }

  async getFeatureListObject(importItem: ImportFeature): Promise<FeatureListObject> {
    let characteristicType: CharacteristicType = CharacteristicType.FEAT;
    let characteristic: ListObject = null;
    if (importItem.category === 'CLASS' && importItem.characterClass != null && importItem.characterClass.id !== 0) {
      characteristicType = CharacteristicType.CLASS;
      await this.importCacheService.getCharacteristicsByType(characteristicType);
      const classCache = this.importCacheService.getCharacteristics(characteristicType);

      if (classCache != null) {
        if (importItem.subclass != null && importItem.subclass.id !== 0 && importItem.subclass.name.toLowerCase() !== 'none') {
          characteristic = _.find(classCache, function(_item) { return _item.name.toLowerCase() === importItem.subclass.name.toLowerCase() });
        } else {
          characteristic = _.find(classCache, function(_item) { return _item.name.toLowerCase() === importItem.characterClass.name.toLowerCase() });
        }
      }
    } else if (importItem.category === 'RACE' && importItem.race != null && importItem.race.id !== 0) {
      characteristicType = CharacteristicType.RACE;

      await this.importCacheService.getCharacteristicsByType(characteristicType);
      const raceCache = this.importCacheService.getCharacteristics(characteristicType);
      if (raceCache != null) {
        characteristic = _.find(raceCache, function(_item) { return _item.name.toLowerCase() === importItem.race.name.toLowerCase() });
      }
    } else if (importItem.category === 'BACKGROUND' && importItem.background != null && importItem.background.id !== 0) {
      characteristicType = CharacteristicType.BACKGROUND;
      await this.importCacheService.getCharacteristicsByType(characteristicType);
      const backgroundCache = this.importCacheService.getCharacteristics(characteristicType);
      if (backgroundCache != null) {
        characteristic = _.find(backgroundCache, function(_item) { return _item.name.toLowerCase() === importItem.background.name.toLowerCase() });
      }
    }

    const featureListObject = new FeatureListObject();
    if (characteristic != null) {
      featureListObject.characteristic = characteristic;
      featureListObject.characteristicType = characteristicType;
    } else {
      featureListObject.characteristicType = CharacteristicType.FEAT;
    }
    return featureListObject;
  }

  async getFeature(importItem: ImportFeature): Promise<Feature> {
    if (importItem == null) {
      return Promise.reject(null);
    }

    const feature = new Feature();
    feature.id = importItem.finalId != null ? importItem.finalId : '0';
    feature.name = importItem.name;
    feature.description = importItem.description;

    const featureListObject = await this.getFeatureListObject(importItem);
    feature.characteristic = featureListObject.characteristic;
    feature.characteristicType = featureListObject.characteristicType;

    if (importItem.hasAreaOfEffect) {
      const powerAreaOfEffect = new PowerAreaOfEffect();
      await this.importCacheService.getAttributesByType(AttributeType.AREA_OF_EFFECT);
      powerAreaOfEffect.areaOfEffect = this.importAttributeService.getCachedAreaOfEffect(importItem.areaOfEffect);
      feature.powerAreaOfEffect = powerAreaOfEffect;
    } else {
      feature.powerAreaOfEffect = new PowerAreaOfEffect();
    }

    const level = this.importSharedService.getLevelByNumber(importItem.minimumLevel);
    feature.characterLevel = level == null ? null : new ListObject(level.id, level.name);

    if (importItem.ranged) {
      this.parseRange(importItem.range, feature);
    } else {
      feature.rangeType = RangeType.SELF;
    }

    return Promise.resolve(feature);
  }

  private parseRange(value: string, power: Power): void {
    value = value.toLowerCase();
    let rangeType: RangeType;
    let rangeAmount = 0;
    let rangeUnit: RangeUnit = RangeUnit.FEET;

    if (value.indexOf('self') === 0) {
      rangeType = RangeType.SELF;
    } else if (value.indexOf('touch') === 0) {
      rangeType = RangeType.TOUCH;
    } else if (value.indexOf('sight') === 0) {
      rangeType = RangeType.SIGHT;
    } else if (value.indexOf('unlimited') === 0) {
      rangeType = RangeType.UNLIMITED;
    } else {
      rangeType = RangeType.OTHER;
      rangeAmount = parseInt(value, 10);
      const amountString = rangeAmount.toString();
      const unit = value.substr(amountString.length).trim();
      rangeUnit = unit === 'feet' || unit === 'ft' ? RangeUnit.FEET : RangeUnit.MILE;
    }

    power.rangeType = rangeType;
    power.range = rangeAmount;
    power.rangeUnit = rangeUnit;
  }

  async processFeature(config: ImportItemConfiguration): Promise<any> {
    const featureImportItem = config.importItem as ImportFeature;
    return this.getFeature(config.importItem as ImportFeature).then(async (feature: Feature) => {
      const areaOfEffect = await this.importAttributeService.processAreaOfEffectDependency(featureImportItem.areaOfEffect);
      feature.powerAreaOfEffect = new PowerAreaOfEffect();
      feature.powerAreaOfEffect.areaOfEffect = areaOfEffect;
      return this.processPower(feature, featureImportItem);
    });
  }

  featureAddMissingChildren(importItem: ImportFeature): void {
    this.importSharedService.initializeImportItem(importItem.areaOfEffect);
  }

  validateFeature(importItem: ImportFeature): boolean {
    return importItem.name != null
      && importItem.name !== ''
      && (
        (importItem.category === 'BACKGROUND' && importItem.background != null)
        || (importItem.category === 'CLASS' && importItem.characterClass != null)
        || (importItem.category === 'RACE' && importItem.race != null)
        || importItem.category === 'FEAT'
      )
      && (!importItem.hasAreaOfEffect || importItem.areaOfEffect != null)
      && importItem.description.length > 0;
  }

  /****************** Spell *********************/

  getPossibleDuplicatesForSpell(importItem: ImportItem): ListObject[] {
    const source: ListObject[] = this.importCacheService.getPowers(PowerType.SPELL);
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  getPrioritizedConfigItemsForSpell(config: ImportItemConfiguration): ImportItemConfiguration[] {
    if (config.importItem.type !== 'Spell') {
      return [];
    }
    const configs: ImportItemConfiguration[] = [];
    configs.push(config);
    return configs;
  }

  private getCastingTimeUnit(castingTimeUnit: ImportCastingTimeUnit): CastingTimeUnit {
    switch (castingTimeUnit) {
      case 'action':
        return CastingTimeUnit.ACTION;
      case 'bonus action':
        return CastingTimeUnit.BONUS_ACTION;
      case 'reaction':
        return CastingTimeUnit.REACTION;
      case 'second':
      case 'seconds':
        return CastingTimeUnit.SECOND;
      case 'minute':
      case 'minutes':
        return CastingTimeUnit.MINUTE;
      case 'hour':
      case 'hours':
        return CastingTimeUnit.HOUR;
    }
  }

  getSpellListObject(importItem: ImportSpell): SpellListObject {
    if (importItem == null) {
      return null;
    }
    const spell = new SpellListObject();
    spell.id = importItem.finalId != null ? importItem.finalId : '0';
    spell.name = importItem.name;
    spell.level = importItem.level;

    return spell;
  }

  async getSpell(importItem: ImportSpell): Promise<Spell> {
    if (importItem == null) {
      return Promise.reject(null);
    }

    const spell = new Spell();
    spell.id = importItem.finalId != null ? importItem.finalId : '0';
    spell.name = importItem.name;
    spell.description = importItem.description;
    spell.higherLevels = importItem.higherLevels;

    await this.importCacheService.getAttributesByType(AttributeType.SPELL_SCHOOL);
    spell.spellSchool = this.importAttributeService.getCachedSpellSchool(importItem.school);

    spell.level = importItem.level;
    spell.verbal = importItem.v;
    spell.somatic = importItem.s;
    spell.material = importItem.m;
    spell.components = importItem.components;
    spell.instantaneous = importItem.instantaneous;
    spell.concentration = importItem.concentration;
    spell.ritual = importItem.ritual;
    spell.duration = importItem.duration;
    spell.castingTimeUnit = this.getCastingTimeUnit(importItem.castingTimeUnits);
    spell.castingTime = importItem.castingTime;

    if (importItem.hasAreaOfEffect) {
      const powerAreaOfEffect = new PowerAreaOfEffect();
      await this.importCacheService.getAttributesByType(AttributeType.AREA_OF_EFFECT);
      powerAreaOfEffect.areaOfEffect = this.importAttributeService.getCachedAreaOfEffect(importItem.areaOfEffect);
      spell.powerAreaOfEffect = powerAreaOfEffect;
    } else {
      spell.powerAreaOfEffect = new PowerAreaOfEffect();
    }
    spell.rangeType = RangeType.OTHER;
    this.parseRange(importItem.range, spell);

    return Promise.resolve(spell);
  }

  private async getClassSpellList(classes: ImportListObject[]): Promise<ListObject[]> {
    let list: ListObject[] = [];
    const cache: ListObject[] = await this.importCacheService.getCharacteristicsByType(CharacteristicType.CLASS);
    classes.forEach((importListObject: ImportListObject) => {
      const cachedClasses = _.filter(cache, function(_class) { return _class.name.toLowerCase() === importListObject.name.toLowerCase() });
      list = list.concat(cachedClasses);
    });
    return _.uniqBy(list, x => x.id);
  }

  getCachedSpells(name: string): ListObject[] {
    const cachedSpells = this.importCacheService.getPowers(PowerType.SPELL);
    return _.filter(cachedSpells, function(spell) { return spell.name.toLowerCase() === name.toLowerCase() });
  }

  async getCachedSpell(importItem: ImportSpell): Promise<Spell> {
    if (!this.validateSpell(importItem)) {
      return null;
    }
    const finalSpell = await this.getSpell(importItem);
    finalSpell.id = '0';
    const cache: ListObject[] = await this.importCacheService.getPowersByType(PowerType.SPELL);
    const cachedSpell: ListObject = _.find(cache, function(spell) { return spell.name.toLowerCase() === importItem.name.toLowerCase() });
    if (cachedSpell != null) {
      finalSpell.id = cachedSpell.id;
    }
    return finalSpell;
  }

  async processSpellDependency(importItem: ImportSpell): Promise<Spell> {
    await this.importCacheService.getPowersByType(PowerType.SPELL);
    const cached = await this.getCachedSpell(importItem);
    if (cached != null && cached.id === '0') {
      importItem.selectedAction = 'INSERT_AS_NEW';
      await this.processPower(cached, importItem).then(() => {
        cached.id = importItem.finalId;
      });
    }
    return cached;
  }

  async processSpell(config: ImportItemConfiguration): Promise<any> {
    const spellImportItem = config.importItem as ImportSpell;
    return this.getSpell(config.importItem as ImportSpell).then(async (spell: Spell) => {
      spell.spellSchool = await this.importAttributeService.processSpellSchoolDependency(spellImportItem.school);
      const areaOfEffect = await this.importAttributeService.processAreaOfEffectDependency(spellImportItem.areaOfEffect);
      spell.powerAreaOfEffect = new PowerAreaOfEffect();
      spell.powerAreaOfEffect.areaOfEffect = areaOfEffect;
      await this.processPower(spell, spellImportItem);

      try {
        //create the spell and then assign it to the classes
        const classes = await this.getClassSpellList(spellImportItem.classes);
        if (spellImportItem.selectedAction === 'REPLACE_EXISTING') {
          await this.powerService.removeClasses(spellImportItem.finalId);
        }
        await this.powerService.addClasses(spellImportItem.finalId, classes);
      } catch (e) {
        if (config.importItem.selectedAction === 'INSERT_AS_NEW') {
          //if error on any of this, delete spell
          await this.powerService.deletePower(spell);
          await this.importCacheService.deletePower(PowerType.SPELL, spell.id);
          throw e;
        }
      }
    });
  }

  spellAddMissingChildren(importItem: ImportSpell): void {
    this.importSharedService.initializeImportItem(importItem.areaOfEffect);
    this.importSharedService.initializeImportItem(importItem.school);
  }

  validateSpell(importItem: ImportSpell): boolean {
    return importItem.name != null
      && importItem.name !== ''
      && importItem.description.length > 0
      && importItem.level != null
      && importItem.school != null
      && importItem.castingTime >= 1
      && importItem.castingTimeUnits != null
      && (!importItem.hasAreaOfEffect || importItem.areaOfEffect != null);
  }
}
