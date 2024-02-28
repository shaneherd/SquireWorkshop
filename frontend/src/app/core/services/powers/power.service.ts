import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Power} from '../../../shared/models/powers/power';
import {ListObject} from '../../../shared/models/list-object';
import {PowerType} from '../../../shared/models/powers/power-type.enum';
import {DamageConfiguration} from '../../../shared/models/damage-configuration';
import {Ability} from '../../../shared/models/attributes/ability.model';
import {DamageConfigurationCollection} from '../../../shared/models/damage-configuration-collection';
import * as _ from 'lodash';
import {ModifierConfigurationCollection} from '../../../shared/models/modifier-configuration-collection';
import {ModifierConfiguration} from '../../../shared/models/modifier-configuration';
import {Filters} from '../../components/filters/filters';
import {CharacterLevel} from '../../../shared/models/character-level';
import {LimitedUse} from '../../../shared/models/powers/limited-use';
import {LimitedUseType} from '../../../shared/models/limited-use-type.enum';
import {CreaturePower} from '../../../shared/models/creatures/creature-power';
import {CharacterLevelService} from '../character-level.service';
import {InUseService} from '../../../dashboard/view-edit/view-edit.component';
import {InUse} from '../../../shared/models/inUse/in-use';
import {PowerList} from '../../../shared/models/powers/power-list';
import {CharacteristicList} from '../../../shared/models/characteristics/characteristic-list';
import {FeatureListObject} from '../../../shared/models/powers/feature-list-object';
import {SpellListObject} from '../../../shared/models/powers/spell-list-object';
import {environment} from '../../../../environments/environment';
import {CharacteristicType} from '../../../shared/models/characteristics/characteristic-type.enum';
import {ListSource} from '../../../shared/models/list-source.enum';
import {PublishRequest} from '../../../shared/models/publish-request';
import {PublishDetails} from '../../../shared/models/publish-details';
import {VersionInfo} from '../../../shared/models/version-info';
import {ManageService} from '../../../shared/components/manage-list/manage-list.component';

@Injectable({
  providedIn: 'root'
})
export class PowerService implements InUseService, ManageService {
  private powersMap = new Map<string, Power>();

  constructor(
    private http: HttpClient,
    private characterLevelService: CharacterLevelService
  ) { }

  createPower(power: Power): Promise<string> {
    const options = {
      responseType: 'text' as 'json'
    };
    return this.http.put<string>(environment.backendUrl + '/powers', power, options).toPromise();
  }

  getPublishDetails(power: Power): Promise<PublishDetails> {
    return this.http.get<PublishDetails>(`${environment.backendUrl}/powers/${power.id}/published`).toPromise();
  }

  getVersionInfo(powerId: string): Promise<VersionInfo> {
    return this.http.get<VersionInfo>(`${environment.backendUrl}/powers/${powerId}/version`).toPromise();
  }

  publishPower(power: Power, publishRequest: PublishRequest): Promise<any> {
    return this.publish(power.id, publishRequest);
  }

  publish(id: string, publishRequest: PublishRequest): Promise<any> {
    return this.http.put<any>(`${environment.backendUrl}/powers/${id}`, publishRequest).toPromise();
  }

  addToMyStuff(power: Power): Promise<string> {
    this.powersMap.delete(power.id);
    const options = {
      responseType: 'text' as 'json'
    };
    return this.http.put<string>(`${environment.backendUrl}/powers/${power.id}/myStuff`, power, options).toPromise();
  }

  getPowersWithFilters(powerType: PowerType, filters: Filters, listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    return this.http.post<ListObject[]>(`${environment.backendUrl}/powers/type/${powerType}?source=${listSource}`, filters).toPromise();
  }

  getSpells(listSource: ListSource): Promise<SpellListObject[]> {
    return this.http.get<SpellListObject[]>(`${environment.backendUrl}/powers/type/${PowerType.SPELL}?source=${listSource}`).toPromise();
  }

  getFeatures(listSource: ListSource): Promise<ListObject[]> {
    return this.http.get<ListObject[]>(`${environment.backendUrl}/powers/type/${PowerType.FEATURE}?source=${listSource}`).toPromise();
  }

  getFeaturesByCharacteristicType(characteristicType: CharacteristicType): Promise<FeatureListObject[]> {
    return this.http.get<FeatureListObject[]>(`${environment.backendUrl}/powers/type/FEATURE/${characteristicType}`).toPromise();
  }

  getFeaturePowerList(powerList: PowerList): Promise<FeatureListObject[]> {
    return this.http.post<FeatureListObject[]>(`${environment.backendUrl}/powers/type/FEATURE/details`, powerList).toPromise();
  }

  getPowersByPowerType(powerType: PowerType, listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    return this.http.get<ListObject[]>(`${environment.backendUrl}/powers/type/${powerType}?source=${listSource}`).toPromise();
  }

  getPower(id: string): Promise<Power> {
    const power = this.powersMap.get(id);
    if (power == null) {
      return this.http.get<Power>(environment.backendUrl + '/powers/' + id).toPromise().then((_power: Power) => {
        this.powersMap.set(id, _power);
        return _power;
      });
    } else {
      return Promise.resolve(power);
    }
  }

  updatePower(power: Power): Promise<any> {
    this.powersMap.set(power.id, power);
    return this.http.post<any>(environment.backendUrl + '/powers/' + power.id, power).toPromise();
  }

  inUse(id: string): Promise<InUse[]> {
    return this.http.get<InUse[]>(`${environment.backendUrl}/powers/${id}/in-use`).toPromise();
  }

  delete(id: string): Promise<any> {
    this.powersMap.delete(id);
    return this.http.delete<any>(`${environment.backendUrl}/powers/${id}`).toPromise();
  }

  deletePower(power: Power): Promise<any> {
    return this.delete(power.id);
  }

  duplicatePower(power: Power, name: string): Promise<string> {
    const body = new URLSearchParams();
    body.set('name', name);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      responseType: 'text' as 'json'
    };
    return this.http.post<any>(environment.backendUrl + '/powers/' + power.id + '/duplicate', body.toString(), options).toPromise();
  }

  getClasses(powerId: string): Promise<ListObject[]> {
    return this.http.get<ListObject[]>(`${environment.backendUrl}/powers/${powerId}/classes`).toPromise();
  }

  addClasses(powerId: string, classes: ListObject[]): Promise<any> {
    const characteristicList = new CharacteristicList();
    characteristicList.characteristics = classes;
    return this.http.put<any>(`${environment.backendUrl}/powers/${powerId}/classes`, characteristicList).toPromise();
  }

  removeClasses(powerId: string): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/powers/${powerId}/classes`).toPromise();
  }

  /****************************** Damage Configurations *****************************/

  combineModifiers(modifiers: ModifierConfiguration[]): ModifierConfiguration[] {
    const finalModifiers: ModifierConfiguration[] = [];
    if (modifiers != null) {
      //todo - sort modifiers by level
      modifiers.forEach((modifier: ModifierConfiguration) => {
        const index = this.getCombinedModifierIndex(modifier, finalModifiers);
        if (index === -1) {
          finalModifiers.push(modifier);
        } else {
          const existing = finalModifiers[index];
          if (modifier.adjustment) {
            existing.value += modifier.value;
          } else {
            existing.value = modifier.value;
          }
          existing.proficient = existing.proficient || modifier.proficient;
          existing.halfProficient = existing.halfProficient || modifier.halfProficient;
          existing.roundUp = existing.roundUp || modifier.roundUp;
          existing.advantage = existing.advantage || modifier.advantage;
          existing.disadvantage = existing.disadvantage || modifier.disadvantage;

//          extra = false;
//          characterAdvancement = false;
        }
      });
    }
    return finalModifiers;
  }

  private getCombinedModifierIndex(modifier: ModifierConfiguration, modifiers: ModifierConfiguration[]): number {
    for (let i = 0; i < modifiers.length; i++) {
      const current = modifiers[i];
      if (modifier.modifierCategory === current.modifierCategory && modifier.modifierSubCategory === current.modifierSubCategory && modifier.attribute.id === current.attribute.id) {
        return i;
      }
    }
    return -1;
  }

  combineDamages(damages: DamageConfiguration[]): DamageConfiguration[] {
    const finalDamages: DamageConfiguration[] = [];
    if (damages != null) {
      damages.forEach((damage: DamageConfiguration) => {
        const index = this.getCombinedIndex(damage, finalDamages);
        if (index === -1) {
          finalDamages.push(_.cloneDeep(damage));
        } else {
          finalDamages[index].values.numDice += damage.values.numDice;
          finalDamages[index].values.miscModifier += damage.values.miscModifier;
        }
      });
    }
    return finalDamages;
  }

  private getCombinedIndex(damage: DamageConfiguration, damages: DamageConfiguration[]): number {
    if (damages.length > 0 && damage.damageType == null && damage.values.numDice === 0) {
      return 0;
    }
    for (let i = 0; i < damages.length; i++) {
      const current = damages[i];
      if ((damage.damageType == null || current.damageType == null || current.damageType.id === damage.damageType.id) &&
        (current.values.diceSize === damage.values.diceSize)) {
        return i;
      }
    }
    return -1;
  }

  createCopyOfDamageConfigurationCollection(collection: DamageConfigurationCollection): DamageConfigurationCollection {
    return _.cloneDeep(collection);
  }

  createCopyOfDamageConfiguration(config: DamageConfiguration): DamageConfiguration {
    return _.cloneDeep(config);
  }

  initializeDamageConfigurations(power: Power): DamageConfigurationCollection {
    const collection = new DamageConfigurationCollection();
    collection.attackType = power.attackType;
    collection.temporaryHP = power.temporaryHP;
    collection.attackMod = power.attackMod;
    collection.attackAbilityMod = power.attackAbilityModifier;
    collection.saveProficiencyModifier = power.saveProficiencyModifier;
    collection.saveAbilityModifier = power.saveAbilityModifier;
    collection.saveType = new ListObject('0', '');
    collection.halfOnSave = power.halfOnSave;
    if (power.saveType != null) {
      collection.saveType.id = power.saveType.id;
      collection.saveType.name = power.saveType.name;
    }
    collection.damageConfigurations = this.getCollectionDamageConfigurations(power.damageConfigurations.slice(0));
    collection.extraDamage = power.extraDamage;
    collection.numLevelsAboveBase = power.numLevelsAboveBase;
    collection.extraDamageConfigurations = this.getCollectionDamageConfigurations(power.extraDamageConfigurations.slice(0));
    collection.advancement = power.advancement;
    collection.advancementDamageConfigurations = this.getCollectionDamageConfigurations(power.advancementDamageConfigurations.slice(0));
    return _.cloneDeep(collection);
  }

  getCollectionDamageConfigurations(configs: DamageConfiguration[]): DamageConfiguration[] {
    const list = configs.slice(0);
    list.forEach((config: DamageConfiguration) => {
      if (config.values.abilityModifier == null) {
        config.values.abilityModifier = new Ability();
      }
    });
    return list;
  }

  setDamageConfigurations(power: Power, collection: DamageConfigurationCollection): void {
    power.attackType = collection.attackType;
    power.temporaryHP = collection.temporaryHP;
    power.attackMod = collection.attackMod;
    power.attackAbilityModifier = collection.attackAbilityMod;
    power.saveProficiencyModifier = collection.saveProficiencyModifier;
    power.saveAbilityModifier = collection.saveAbilityModifier;
    if (collection.saveType.id === '0') {
      power.saveType = null;
    } else {
      power.saveType = new Ability();
      power.saveType.id = collection.saveType.id;
      power.saveType.name = collection.saveType.name;
    }
    power.halfOnSave = collection.halfOnSave;
    power.damageConfigurations = this.getFinialDamageConfigurations(collection.damageConfigurations);
    power.extraDamage = collection.extraDamage;
    power.numLevelsAboveBase = collection.numLevelsAboveBase;
    power.extraDamageConfigurations = this.getFinialDamageConfigurations(collection.extraDamageConfigurations);
    power.advancement = collection.advancement;
    power.advancementDamageConfigurations = this.getFinialDamageConfigurations(collection.advancementDamageConfigurations);
  }

  getFinialDamageConfigurations(configs: DamageConfiguration[]): DamageConfiguration[] {
    const list: DamageConfiguration[] = [];
    configs.forEach((config: DamageConfiguration) => {
      const damageConfig: DamageConfiguration = this.createCopyOfDamageConfiguration(config);
      if (damageConfig.values.abilityModifier.id === '0') {
        damageConfig.values.abilityModifier = null;
      }
      list.push(damageConfig);
    });
    return list;
  }

  /****************************** Modifier Configurations *****************************/

  createCopyOfModifierConfigurationCollection(collection: ModifierConfigurationCollection): ModifierConfigurationCollection {
    return _.cloneDeep(collection);
  }

  createCopyOfModifierConfiguration(config: ModifierConfiguration): ModifierConfiguration {
    return _.cloneDeep(config);
  }

  initializeModifierConfigurations(power: Power): ModifierConfigurationCollection {
    const collection = new ModifierConfigurationCollection();
    collection.modifierConfigurations = this.getCollectionModifierConfigurations(power.modifierConfigurations.slice(0));
    collection.extraModifiers = power.extraModifiers;
    collection.numLevelsAboveBase = power.modifiersNumLevelsAboveBase;
    collection.extraModifierConfigurations = this.getCollectionModifierConfigurations(power.extraModifierConfigurations.slice(0));
    collection.advancementModifiers = power.advancementModifiers;
    collection.advancementModifierConfigurations =
      this.getCollectionModifierConfigurations(power.advancementModifierConfigurations.slice(0));
    return _.cloneDeep(collection);
  }

  initializeModifierConfigurationsCreaturePower(power: CreaturePower): ModifierConfigurationCollection {
    const collection = new ModifierConfigurationCollection();
    if (power.modifierConfigurations == null) {
      power.modifierConfigurations = [];
    }
    if (power.extraModifierConfigurations == null) {
      power.extraModifierConfigurations = [];
    }
    if (power.advancementModifierConfigurations == null) {
      power.advancementModifierConfigurations = [];
    }

    collection.modifierConfigurations = this.getCollectionModifierConfigurations(power.modifierConfigurations.slice(0));
    collection.extraModifiers = power.extraModifiers;
    collection.numLevelsAboveBase = power.modifiersNumLevelsAboveBase;
    collection.extraModifierConfigurations = this.getCollectionModifierConfigurations(power.extraModifierConfigurations.slice(0));
    collection.advancementModifiers = power.advancementModifiers;
    collection.advancementModifierConfigurations =
      this.getCollectionModifierConfigurations(power.advancementModifierConfigurations.slice(0));
    return _.cloneDeep(collection);
  }

  initializeCreaturePowerModifierConfigurations(creaturePower: CreaturePower): ModifierConfigurationCollection {
    const collection = new ModifierConfigurationCollection();
    if (creaturePower.modifierConfigurations == null) {
      creaturePower.modifierConfigurations = [];
    }
    if (creaturePower.extraModifierConfigurations == null) {
      creaturePower.extraModifierConfigurations = [];
    }
    if (creaturePower.advancementModifierConfigurations == null) {
      creaturePower.advancementModifierConfigurations = [];
    }

    collection.modifierConfigurations = this.getCollectionModifierConfigurations(creaturePower.modifierConfigurations.slice(0));
    collection.extraModifiers = creaturePower.extraModifiers;
    collection.numLevelsAboveBase = creaturePower.modifiersNumLevelsAboveBase;
    collection.extraModifierConfigurations = this.getCollectionModifierConfigurations(creaturePower.extraModifierConfigurations.slice(0));
    collection.advancementModifiers = creaturePower.advancementModifiers;
    collection.advancementModifierConfigurations = this.getCollectionModifierConfigurations(creaturePower.advancementModifierConfigurations.slice(0));
    return _.cloneDeep(collection);
  }

  getCollectionModifierConfigurations(configs: ModifierConfiguration[]): ModifierConfiguration[] {
    return configs.slice(0);
  }

  setModifierConfigurations(power: Power, collection: ModifierConfigurationCollection): void {
    power.modifierConfigurations = this.getFinialModifierConfigurations(collection.modifierConfigurations);
    power.extraModifiers = collection.extraModifiers;
    power.modifiersNumLevelsAboveBase = collection.numLevelsAboveBase;
    power.extraModifierConfigurations = this.getFinialModifierConfigurations(collection.extraModifierConfigurations);
    power.advancementModifiers = collection.advancementModifiers;
    power.advancementModifierConfigurations = this.getFinialModifierConfigurations(collection.advancementModifierConfigurations);
  }

  getFinialModifierConfigurations(configs: ModifierConfiguration[]): ModifierConfiguration[] {
    const list: ModifierConfiguration[] = [];
    configs.forEach((config: ModifierConfiguration) => {
      list.push(this.createCopyOfModifierConfiguration(config));
    });
    return list;
  }

  getCreaturePowerLimitedUse(creaturePower: CreaturePower, characterLevel: CharacterLevel): LimitedUse {
    return this.getLimitedUse(creaturePower.limitedUses, characterLevel);
  }

  getPowerLimitedUse(power: Power, characterLevel: CharacterLevel, levels: CharacterLevel[]): LimitedUse {
    return this.getLimitedUse(power.limitedUses, characterLevel);
  }

  private getLimitedUse(limitedUses: LimitedUse[], characterLevel: CharacterLevel): LimitedUse {
    const levels = this.characterLevelService.getLevelsDetailedFromStorage();
    let limitedUse: LimitedUse = null;
    for (let i = 0; i < limitedUses.length; i++) {
      const level = this.getLevel(limitedUses[i].characterLevel, levels);
      if (level != null && characterLevel != null && level.minExp <= characterLevel.minExp) {
        limitedUse = limitedUses[i];
        //todo - handle out of order (sort by minExp ascending)
      }
    }

    if (limitedUse != null) {
      limitedUse = _.cloneDeep(limitedUse);
      limitedUse.characterLevel = new ListObject(
        characterLevel.id,
        characterLevel.name,
        characterLevel.sid
      );
    }

    return limitedUse;
  }

  private getLevel(level: ListObject, levels: CharacterLevel[]): CharacterLevel {
    for (let i = 0; i < levels.length; i++) {
      const l: CharacterLevel = levels[i];
      if (l.id === level.id) {
        return l;
      }
    }
    return null;
  }

  getMaxUses(limitedUse: LimitedUse, abilityModifier: number): number {
    let maxUses = 0;
    if (limitedUse != null) {
      let quantity = limitedUse.quantity;
      if (limitedUse.abilityModifier !== '') {
        quantity += abilityModifier;
      }
      if (limitedUse.limitedUseType === LimitedUseType.LEVEL) {
        quantity *= parseInt(limitedUse.characterLevel.name, 10);
      }
      maxUses = quantity;
    }
    return maxUses;
  }
}
