import {Injectable} from '@angular/core';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {ListObject} from '../../../shared/models/list-object';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CreatureService} from './creature.service';
import {Filters} from '../../components/filters/filters';
import {ListSource} from '../../../shared/models/list-source.enum';
import {InUseService} from '../../../dashboard/view-edit/view-edit.component';
import {InUse} from '../../../shared/models/inUse/in-use';
import {environment} from '../../../../environments/environment';
import * as _ from 'lodash';
import {ProficiencyCollection} from '../../../shared/models/proficiency-collection';
import {ProficienciesService} from '../proficiency.service';
import {DamageModifierCollection} from '../../../shared/models/damage-modifier-collection';
import {ConditionImmunityConfigurationCollection} from '../../../shared/models/condition-immunity-configuration-collection';
import {ConditionImmunityConfigurationCollectionItem} from '../../../shared/models/condition-immunity-configuration-collection-item';
import {DamageModifierCollectionItem} from '../../../shared/models/damage-modifier-collection-item';
import {DamageTypeService} from '../attributes/damage-type.service';
import {
  CreatureConfigurationCollection,
  MonsterConfigurationCollection
} from '../../../shared/models/creatures/configs/creature-configuration-collection';
import {ConditionService} from '../attributes/condition.service';
import {ListProficiency} from '../../../shared/models/list-proficiency';
import {WeaponTypeService} from '../attributes/weapon-type.service';
import {Proficiency, ProficiencyListObject} from '../../../shared/models/proficiency';
import {ItemService} from '../items/item.service';
import {
  InnateSpellConfiguration,
  Monster,
  MonsterAbilityScore,
  MonsterAction,
  MonsterActionList,
  MonsterFeature,
  MonsterFeatureList,
  MonsterPower
} from '../../../shared/models/creatures/monsters/monster';
import {AbilityService} from '../attributes/ability.service';
import {DamageModifierType} from '../../../shared/models/characteristics/damage-modifier-type.enum';
import {DamageModifier} from '../../../shared/models/characteristics/damage-modifier';
import {SkillService} from '../attributes/skill.service';
import {LanguageService} from '../attributes/language.service';
import {ItemProficiency} from '../../../shared/models/items/item-proficiency';
import {ArmorTypeService} from '../attributes/armor-type.service';
import {ToolCategoryService} from '../attributes/tool-category.service';
import {SenseConfigurationCollection} from '../../../shared/models/sense-configuration-collection';
import {Sense} from '../../../shared/models/sense.enum';
import {SenseConfigurationCollectionItem} from '../../../shared/models/sense-configuration-collection-item';
import {SenseValue} from '../../../shared/models/sense-value';
import {Item} from '../../../shared/models/items/item';
import {DamageType} from '../../../shared/models/attributes/damage-type';
import {DamageConfigurationCollection} from '../../../shared/models/damage-configuration-collection';
import {Ability} from '../../../shared/models/attributes/ability.model';
import {DamageConfiguration} from '../../../shared/models/damage-configuration';
import {SpellConfigurationCollection} from '../../../shared/models/spell-configuration-collection';
import {SpellConfiguration} from '../../../shared/models/characteristics/spell-configuration';
import {
  InnateSpellConfigurationCollectionItem,
  SpellConfigurationCollectionItem
} from '../../../shared/models/spell-configuration-collection-item';
import {CharacterLevelService} from '../character-level.service';
import {ChallengeRating} from '../../../shared/models/creatures/monsters/challenge-rating.enum';
import {PowerList} from '../../../shared/models/powers/power-list';
import {PublishDetails} from '../../../shared/models/publish-details';
import {VersionInfo} from '../../../shared/models/version-info';
import {PublishRequest} from '../../../shared/models/publish-request';
import {SpellConfigurationList} from '../../../shared/models/powers/spell-configuration-list';
import {LimitedUse} from '../../../shared/models/powers/limited-use';
import {ItemQuantity, ItemQuantityList} from '../../../shared/models/items/item-quantity';
import {TranslateService} from '@ngx-translate/core';
import {DiceService} from '../dice.service';
import {MonsterSummary} from '../../../shared/models/creatures/monsters/monster-summary';
import {ManageService} from '../../../shared/components/manage-list/manage-list.component';
import {SID} from '../../../constants';
import {RollRequest} from '../../../shared/models/rolls/roll-request';
import {Roll} from '../../../shared/models/rolls/roll';
import {RollType} from '../../../shared/models/rolls/roll-type.enum';
import {DiceSize} from '../../../shared/models/dice-size.enum';
import {MonsterListObject} from '../../../dashboard/manage/monster/add-monsters/add-monsters.component';
import {InheritedFrom} from '../../../shared/models/creatures/inherited-from';
import {CreatureAbilityProficiency} from '../../../shared/models/creatures/configs/creature-ability-proficiency';
import {ListModifier} from '../../../shared/models/list-modifier';
import {CreatureListModifierValue} from '../../../shared/models/creatures/creature-list-modifier-value';
import {CreatureListProficiency} from '../../../shared/models/creatures/creature-list-proficiency';
import {CreatureDamageModifierCollectionItem} from '../../../shared/models/creatures/configs/creature-damage-modifier-collection-item';
import {InheritedDamageModifierType} from '../../../shared/models/creatures/configs/inherited-damage-modifier-type';
import {CreatureConditionImmunityCollectionItem} from '../../../shared/models/creatures/configs/creature-condition-immunity-collection-item';
import {InheritedSense} from '../../../shared/models/creatures/configs/inherited-sense';
import {CreatureSenseCollectionItem} from '../../../shared/models/creatures/configs/creature-sense-collection-item';
import {MappedSpellConfigurationCollection} from '../../../shared/models/mapped-spell-configuration-collection';
import {SpeedType} from '../../../shared/models/speed-type.enum';
import {Power} from '../../../shared/models/powers/power';
import {PowerModifier} from '../../../shared/models/powers/power-modifier';
import {BattleMonster} from '../../../shared/models/creatures/battle-monsters/battle-monster';
import {CreaturePower} from '../../../shared/models/creatures/creature-power';
import {CreaturePowerList} from '../../../shared/models/creatures/creature-power-list';
import {CreatureSpeedModifierCollectionItem} from '../../../shared/models/creatures/configs/creature-speed-modifier-collection-item';
import {
  BattleMonsterSettings,
  CharacterSettings,
  CharacterSpeedSettings
} from '../../../shared/models/creatures/characters/character-settings';
import {ActiveCondition} from '../../../shared/models/creatures/active-condition';
import {ModifierService} from '../modifier.service';
import {CampaignSettings} from '../../../shared/models/campaigns/campaign-settings';
import {PlayerCharacter} from '../../../shared/models/creatures/characters/player-character';
import {LabelValue} from '../../../shared/models/label-value';

@Injectable({
  providedIn: 'root'
})
export class MonsterService implements MenuService, InUseService, ManageService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private monsters: MonsterListObject[] = [];
  private publicMonsters: MonsterListObject[] = [];
  private privateMonsters: MonsterListObject[] = [];
  private monsterSpellConfigurations = new Map<string, SpellConfiguration[]>();
  private monstersMap = new Map<string, Monster>();

  constructor(
    private http: HttpClient,
    private creatureService: CreatureService,
    private proficienciesService: ProficienciesService,
    private damageTypeService: DamageTypeService,
    private conditionService: ConditionService,
    private weaponTypeService: WeaponTypeService,
    private itemService: ItemService,
    private abilityService: AbilityService,
    private skillService: SkillService,
    private languageService: LanguageService,
    private armorTypeService: ArmorTypeService,
    private toolCategoryService: ToolCategoryService,
    private characterLevelService: CharacterLevelService,
    private translate: TranslateService,
    private diceService: DiceService,
    private modifierService: ModifierService
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.monsters = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicMonsters = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateMonsters = [];
        break;
    }
  }

  private getCached(listSource: ListSource): MonsterListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.monsters;
      case ListSource.PUBLIC_CONTENT:
        return this.publicMonsters;
      case ListSource.PRIVATE_CONTENT:
        return this.privateMonsters;
    }
  }

  private updateCache(list: MonsterListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.monsters = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicMonsters = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateMonsters = list;
        break;
    }
  }

  inUse(id: string): Promise<InUse[]> {
    return this.http.get<InUse[]>(`${environment.backendUrl}/monsters/${id}/in-use`).toPromise();
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.updateMenuItemsWithFilters(id, listSource, filters);
  }

  updateMenuItemsWithFilters(id: string, listSource: ListSource, filters: Filters): void {
    if (filters == null) {
      this.resetCache(listSource);
    }
    this.getMonstersWithFilters(listSource, filters).then((monsters: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      monsters.forEach((monster: ListObject) => {
        menuItems.push(new MenuItem(monster.id, monster.name, '', '', false));
      });
      this.items = menuItems;
      if (id != null) {
        for (let i = 0; i < this.items.length; i++) {
          const menuItem = this.items[i];
          menuItem.selected = menuItem.id === id;
        }
      }
      this.menuItems.next(this.items);
    });
  }

  createMonster(monster: Monster): Promise<string> {
    const options = {
      responseType: 'text' as 'json'
    };
    return this.http.put<string>(`${environment.backendUrl}/monsters`, monster, options).toPromise().then((id: string) => {
      this.monstersMap.set(id, monster);
      return id;
    });
  }

  getMonsters(listSource: ListSource = ListSource.MY_STUFF): Promise<MonsterListObject[]> {
    const cache = this.getCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    } else {
      return this.http.get<MonsterListObject[]>(`${environment.backendUrl}/monsters?source=${listSource}`).toPromise().then((monsters: MonsterListObject[]) => {
        this.updateCache(monsters, listSource);
        return monsters;
      });
    }
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getMonsters(listSource);
  }

  getMonstersWithFilters(listSource: ListSource, filters: Filters): Promise<MonsterListObject[]> {
    if (filters == null || filters.filterValues.length === 0 || !filters.filtersApplied) {
      return this.getMonsters(listSource);
    }

    return this.http.post<MonsterListObject[]>(`${environment.backendUrl}/monsters?source=${listSource}`, filters).toPromise();
  }

  getMonster(id: string): Promise<Monster> {
    const monster = this.monstersMap.get(id);
    if (monster != null) {
      return Promise.resolve(monster);
    }
    return this.http.get<Monster>(`${environment.backendUrl}/monsters/${id}`).toPromise().then((_monster: Monster) => {
      this.monstersMap.set(id, _monster);
      return _monster;
    });
  }

  getMonsterSummary(id: string): Promise<MonsterSummary> {
    //todo - cache this value
    return this.http.get<MonsterSummary>(`${environment.backendUrl}/monsters/${id}/summary`).toPromise();
  }

  updateMonster(monster: Monster): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/monsters/${monster.id}`, monster).toPromise().then((response: any) => {
      this.monstersMap.set(monster.id, monster);
      return response;
    });
  }

  delete(id: string): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/monsters/${id}`).toPromise().then((response: any) => {
      this.monstersMap.delete(id);
      return response;
    });
  }

  deleteMonster(monster: Monster): Promise<any> {
    return this.delete(monster.id);
  }

  duplicateMonster(monster: Monster, name: string): Promise<string> {
    const body = new URLSearchParams();
    body.set('name', name);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      responseType: 'text' as 'json'
    };
    return this.http.post<any>(`${environment.backendUrl}/monsters/${monster.id}/duplicate`, body.toString(), options).toPromise().then((id: string) => {
      this.monstersMap.set(id, monster);
      return id;
    });
  }

  getPublishDetails(monster: Monster): Promise<PublishDetails> {
    return this.http.get<PublishDetails>(`${environment.backendUrl}/monsters/${monster.id}/published`).toPromise();
  }

  getVersionInfo(monsterId: string): Promise<VersionInfo> {
    return this.http.get<VersionInfo>(`${environment.backendUrl}/monsters/${monsterId}/version`).toPromise();
  }

  publishCreature(monster: Monster, publishRequest: PublishRequest): Promise<any> {
    return this.publish(monster.id, publishRequest);
  }

  publish(id: string, publishRequest: PublishRequest): Promise<any> {
    return this.http.put<any>(`${environment.backendUrl}/monsters/${id}`, publishRequest).toPromise();
  }

  addToMyStuff(monster: Monster): Promise<string> {
    const options = {
      responseType: 'text' as 'json'
    };
    return this.http.put<string>(`${environment.backendUrl}/monsters/${monster.id}/myStuff`, monster, options).toPromise();
  }

  /*********************** Monster Powers **************************/

  getFeatures(monsterId: string): Promise<MonsterFeature[]> {
    return this.http.get<MonsterFeature[]>(`${environment.backendUrl}/monsters/${monsterId}/powers/type/FEATURE`).toPromise().then((features: MonsterFeature[]) => {
      features.forEach((feature: MonsterFeature) => {
        feature.type = 'Feature';
      });
      return features;
    });
  }

  getFeature(powerId: string): Promise<MonsterFeature> {
    return this.http.get<MonsterFeature>(`${environment.backendUrl}/monsters/powers/${powerId}`).toPromise().then((feature: MonsterFeature) => {
      feature.type = 'Feature';
      return feature;
    });
  }

  getActions(monsterId: string): Promise<MonsterAction[]> {
    return this.http.get<MonsterAction[]>(`${environment.backendUrl}/monsters/${monsterId}/powers/type/ACTION`).toPromise().then((actions: MonsterAction[]) => {
      actions.forEach((action: MonsterAction) => {
        action.type = 'Action';
      });
      return actions;
    });
  }

  getAction(powerId: string): Promise<MonsterAction> {
    return this.http.get<MonsterAction>(`${environment.backendUrl}/monsters/powers/${powerId}`).toPromise().then((action: MonsterAction) => {
      action.type = 'Action';
      return action;
    });
  }

  deletePowers(monsterId: string): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/monsters/${monsterId}/powers`).toPromise();
  }

  deletePower(monsterId: string, monsterPower: MonsterPower): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/monsters/${monsterId}/powers/${monsterPower.id}`).toPromise();
  }

  addActions(monsterId: string, actions: MonsterAction[]): Promise<any> {
    const list = new MonsterActionList();
    list.actions = actions;
    return this.http.put<any>(`${environment.backendUrl}/monsters/${monsterId}/powers/actions`, list).toPromise();
  }

  addFeatures(monsterId: string, features: MonsterFeature[]): Promise<any> {
    const list = new MonsterFeatureList();
    list.features = features;
    return this.http.put<string>(`${environment.backendUrl}/monsters/${monsterId}/powers/features`, list).toPromise();
  }

  createPower(monsterId: string, monsterPower: MonsterPower): Promise<string> {
    const options = {
      responseType: 'text' as 'json'
    };
    return this.http.put<string>(`${environment.backendUrl}/monsters/${monsterId}/powers`, monsterPower, options).toPromise();
  }

  updatePower(monsterId: string, monsterPower: MonsterPower): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/monsters/${monsterId}/powers/${monsterPower.id}`, monsterPower).toPromise();
  }

  duplicatePower(monsterId: string, monsterPower: MonsterPower, name: string): Promise<any> {
    const body = new URLSearchParams();
    body.set('name', name);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      responseType: 'text' as 'json'
    };
    return this.http.post<any>(`${environment.backendUrl}/monsters/${monsterId}/powers/${monsterPower.id}/duplicate`, body.toString(), options).toPromise();
  }

  getPowerDamages(power: Power, battleMonster: BattleMonster,
                  collection: CreatureConfigurationCollection, attackModifier: PowerModifier,
                  saveModifier: PowerModifier): DamageConfigurationCollection {
    return this.creatureService.getPowerDamages(power, battleMonster, null, collection, attackModifier, saveModifier)
  }

  resetPowerLimitedUses(creaturePowers: CreaturePower[], battleMonster: BattleMonster): Promise<any> {
    const creaturePowerList: CreaturePowerList = new CreaturePowerList();
    const powers: CreaturePower[] = [];
    creaturePowers.forEach((creaturePower: CreaturePower) => {
      powers.push(creaturePower);
    });

    const usesRemaining = new Map<string, number>();

    powers.forEach((creaturePower: CreaturePower) => {
      usesRemaining.set(creaturePower.powerId, creaturePower.calculatedMax);

      const power = new CreaturePower();
      power.id = creaturePower.id;
      power.powerId = creaturePower.powerId;
      power.usesRemaining = creaturePower.calculatedMax;
      power.active = creaturePower.active;
      creaturePowerList.creaturePowers.push(power);
    });

    return this.creatureService.updateBattleMonsterPowers(battleMonster, creaturePowerList).then((response: any) => {
      powers.forEach((creaturePower: CreaturePower) => {
        const remaining = usesRemaining.get(creaturePower.powerId);
        if (remaining != null && remaining !== -1) {
          creaturePower.usesRemaining = remaining;
        }
      });

      return response;
    });
  }

  updateBattleMonsterSettings(battleMonsterId: string, settings: BattleMonsterSettings): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/creatures/${battleMonsterId}/settings/battleMonster`, settings).toPromise();
  }

  /*************************** Spellcasting ****************************/

  getSpells(id: string): Promise<SpellConfiguration[]> {
    return this.http.get<SpellConfiguration[]>(`${environment.backendUrl}/monsters/${id}/spells`).toPromise();
  }

  getInnateSpells(id: string): Promise<InnateSpellConfiguration[]> {
    return this.http.get<InnateSpellConfiguration[]>(`${environment.backendUrl}/monsters/${id}/spells/innate`).toPromise();
  }

  addSpells(monster: Monster, spells: ListObject[]): Promise<SpellConfiguration[]> {
    const powerList = new PowerList();
    powerList.powers = spells;
    return this.http.put<SpellConfiguration[]>(`${environment.backendUrl}/monsters/${monster.id}/spells`, powerList).toPromise();
  }

  addInnateSpells(monster: Monster, spells: ListObject[]): Promise<SpellConfiguration[]> {
    const powerList = new PowerList();
    powerList.powers = spells;
    return this.http.put<SpellConfiguration[]>(`${environment.backendUrl}/monsters/${monster.id}/spells/innate`, powerList).toPromise();
  }

  addSpellConfigurations(monster: Monster, spellConfigurations: SpellConfiguration[]): Promise<any> {
    const spellConfigurationList = new SpellConfigurationList();
    spellConfigurationList.configurations = spellConfigurations;
    return this.http.put<any>(`${environment.backendUrl}/monsters/${monster.id}/spells/configurations`, spellConfigurationList).toPromise().then(() => {
      this.monsterSpellConfigurations.delete(monster.id);
    });
  }

  addInnateSpellConfigurations(monster: Monster, spellConfigurations: InnateSpellConfiguration[]): Promise<any> {
    const spellConfigurationList = new SpellConfigurationList();
    spellConfigurationList.innateConfigurations = spellConfigurations;
    return this.http.put<any>(`${environment.backendUrl}/monsters/${monster.id}/spells/innate/configurations`, spellConfigurationList).toPromise().then(() => {
      this.monsterSpellConfigurations.delete(monster.id);
    });
  }

  updateSpellConfiguration(monster: Monster, spellConfiguration: SpellConfiguration): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/monsters/${monster.id}/spells`, spellConfiguration).toPromise().then(() => {
      this.monsterSpellConfigurations.delete(monster.id);
    });
  }

  updateInnateSpellConfiguration(monster: Monster, spellConfiguration: InnateSpellConfiguration): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/monsters/${monster.id}/spells/innate`, spellConfiguration).toPromise().then(() => {
      this.monsterSpellConfigurations.delete(monster.id);
    });
  }

  deleteSpell(monster: Monster, spellId: string): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/monsters/${monster.id}/spells/${spellId}`).toPromise().then(() => {
      this.monsterSpellConfigurations.delete(monster.id);
    });
  }

  deleteInnateSpell(monster: Monster, spellId: string): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/monsters/${monster.id}/spells/innate/${spellId}`).toPromise().then(() => {
      this.monsterSpellConfigurations.delete(monster.id);
    });
  }

  deleteSpells(monster: Monster): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/monsters/${monster.id}/spells`).toPromise().then(() => {
      this.monsterSpellConfigurations.delete(monster.id);
    });
  }

  deleteInnateSpells(monster: Monster): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/monsters/${monster.id}/spells/innate`).toPromise().then(() => {
      this.monsterSpellConfigurations.delete(monster.id);
    });
  }

  /*************************** Items ****************************/

  updateItems(monsterId: string, items: ItemQuantity[]): Promise<ItemQuantity[]> {
    const itemList = new ItemQuantityList();
    itemList.items = items;
    return this.http.post<ItemQuantity[]>(`${environment.backendUrl}/monsters/${monsterId}/items`, itemList).toPromise();
  }

  updateItemQuantity(monsterId: string, itemId: string, itemQuantity: ItemQuantity): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/monsters/${monsterId}/items/${itemId}`, itemQuantity).toPromise();
  }

  deleteItems(monsterId: string): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/monsters/${monsterId}/items`).toPromise();
  }

  deleteItem(monsterId: string, itemId: string, itemQuantity: ItemQuantity): Promise<any> {
    if (itemQuantity.item.subItem == null) {
      return this.http.delete<any>(`${environment.backendUrl}/monsters/${monsterId}/items/${itemId}`).toPromise();
    } else {
      return this.http.delete<any>(`${environment.backendUrl}/monsters/${monsterId}/items/${itemId}/${itemQuantity.item.subItem.id}`).toPromise();
    }
  }

  /*************************** Helpers ****************************/

  getProfBonus(challengeRating: ChallengeRating): number {
    switch (challengeRating) {
      case ChallengeRating.ZERO:
      case ChallengeRating.EIGHTH:
      case ChallengeRating.QUARTER:
      case ChallengeRating.HALF:
      case ChallengeRating.ONE:
      case ChallengeRating.TWO:
      case ChallengeRating.THREE:
      case ChallengeRating.FOUR:
        return 2;
      case ChallengeRating.FIVE:
      case ChallengeRating.SIX:
      case ChallengeRating.SEVEN:
      case ChallengeRating.EIGHT:
        return 3;
      case ChallengeRating.NINE:
      case ChallengeRating.TEN:
      case ChallengeRating.ELEVEN:
      case ChallengeRating.TWELVE:
        return 4;
      case ChallengeRating.THIRTEEN:
      case ChallengeRating.FOURTEEN:
      case ChallengeRating.FIFTEEN:
      case ChallengeRating.SIXTEEN:
        return 5;
      case ChallengeRating.SEVENTEEN:
      case ChallengeRating.EIGHTEEN:
      case ChallengeRating.NINETEEN:
      case ChallengeRating.TWENTY:
        return 6;
      case ChallengeRating.TWENTY_ONE:
      case ChallengeRating.TWENTY_TWO:
      case ChallengeRating.TWENTY_THREE:
      case ChallengeRating.TWENTY_FOUR:
        return 7;
      case ChallengeRating.TWENTY_FIVE:
      case ChallengeRating.TWENTY_SIX:
      case ChallengeRating.TWENTY_SEVEN:
      case ChallengeRating.TWENTY_EIGHT:
        return 8;
      case ChallengeRating.TWENTY_NINE:
      case ChallengeRating.THIRTY:
        return 9;
    }
  }

  convertChallengeRatingToNumber(challengeRating: ChallengeRating): number {
    switch (challengeRating) {
      case ChallengeRating.ZERO:
        return 0;
      case ChallengeRating.EIGHTH:
        return 0.125;
      case ChallengeRating.QUARTER:
        return 0.25;
      case ChallengeRating.HALF:
        return 0.5;
      case ChallengeRating.ONE:
        return 1;
      case ChallengeRating.TWO:
        return 2;
      case ChallengeRating.THREE:
        return 3;
      case ChallengeRating.FOUR:
        return 4;
      case ChallengeRating.FIVE:
        return 5;
      case ChallengeRating.SIX:
        return 6;
      case ChallengeRating.SEVEN:
        return 7;
      case ChallengeRating.EIGHT:
        return 8;
      case ChallengeRating.NINE:
        return 9;
      case ChallengeRating.TEN:
        return 10;
      case ChallengeRating.ELEVEN:
        return 11;
      case ChallengeRating.TWELVE:
        return 12;
      case ChallengeRating.THIRTEEN:
        return 13;
      case ChallengeRating.FOURTEEN:
        return 14;
      case ChallengeRating.FIFTEEN:
        return 15;
      case ChallengeRating.SIXTEEN:
        return 16;
      case ChallengeRating.SEVENTEEN:
        return 17;
      case ChallengeRating.EIGHTEEN:
        return 18;
      case ChallengeRating.NINETEEN:
        return 19;
      case ChallengeRating.TWENTY:
        return 20;
      case ChallengeRating.TWENTY_ONE:
        return 21;
      case ChallengeRating.TWENTY_TWO:
        return 22;
      case ChallengeRating.TWENTY_THREE:
        return 23;
      case ChallengeRating.TWENTY_FOUR:
        return 24;
      case ChallengeRating.TWENTY_FIVE:
        return 25;
      case ChallengeRating.TWENTY_SIX:
        return 26;
      case ChallengeRating.TWENTY_SEVEN:
        return 27;
      case ChallengeRating.TWENTY_EIGHT:
        return 28;
      case ChallengeRating.TWENTY_NINE:
        return 29;
      case ChallengeRating.THIRTY:
        return 30;
    }
  }

  /*************************** Ability Score ****************************/

  getAbility(abilityId: string, monsterSummary: MonsterSummary): MonsterAbilityScore {
    if (monsterSummary != null) {
      for (let i = 0; i < monsterSummary.abilityScores.length; i++) {
        const ability = monsterSummary.abilityScores[i];
        if (ability.ability.id === abilityId) {
          return ability;
        }
      }
    }
    return null;
  }

  getAbilityBySid(abilityId: number, monsterSummary: MonsterSummary): MonsterAbilityScore {
    if (monsterSummary != null) {
      for (let i = 0; i < monsterSummary.abilityScores.length; i++) {
        const ability = monsterSummary.abilityScores[i];
        if (ability.ability.sid === abilityId) {
          return ability;
        }
      }
    }
    return null;
  }

  getAbilityScore(ability: MonsterAbilityScore): number {
    if (ability == null) {
      return 0;
    }
    return ability.value;
  }

  /*************************** Rolls ****************************/

  rollStandard(monsterId: string, request: RollRequest): Promise<Roll> {
    return this.http.post<Roll>(`${environment.backendUrl}/monsters/${monsterId}/roll/standard`, request).toPromise();
  }

  private getRollRequestMonsterName(monster: MonsterSummary, monsterNumber: number = 0): string {
    let name = monster.name;
    if (monsterNumber > 0) {
      name += ' ' + monsterNumber;
    }
    name += ' hp';
    return name;
  }

  getStealthModifier(monsterSummary: MonsterSummary): number {
    const dex = this.getAbilityBySid(SID.ABILITIES.DEXTERITY, monsterSummary);
    const score = this.getAbilityScore(dex);
    let stealthModifier = this.abilityService.getAbilityModifier(score);
    if (monsterSummary.stealthProficient) {
      stealthModifier += this.getProfBonus(monsterSummary.challengeRating);
    }
    return stealthModifier;
  }

  /*************************** Initiative ****************************/

  getInitiativeModifier(monsterSummary: MonsterSummary): number {
    const dex = this.getAbilityBySid(SID.ABILITIES.DEXTERITY, monsterSummary);
    const score = this.getAbilityScore(dex);
    return this.abilityService.getAbilityModifier(score);
  }

  rollInitiative(monster: MonsterSummary, monsterNumber: number, local: boolean = false): Promise<number> {
    if (local) {
      const roll = this.diceService.roll(this.getInitiativeRollRequest(monster, monsterNumber));
      return Promise.resolve(roll.totalResult);
    } else {
      return this.rollStandard(monster.id, this.getInitiativeRollRequest(monster, monsterNumber)).then((roll: Roll) => {
        return roll.totalResult;
      });
    }
  }

  private getInitiativeRollRequest(monster: MonsterSummary, monsterNumber: number): RollRequest {
    return this.diceService.getRollRequest(
      RollType.STANDARD,
      this.getRollRequestMonsterName(monster, monsterNumber),
      DiceSize.TWENTY,
      this.getInitiativeModifier(monster),
      false,
      false,
      false
    );
  }

  /*************************** Health ****************************/

  getHpDisplay(monster: MonsterSummary): string {
    let display = '';
    const diceSizeValue = this.diceService.getDiceSizeValue(monster.hitDice.diceSize);
    const multiplier = Math.floor(diceSizeValue / 2) + 0.5;
    let modifier = monster.hitDice.miscModifier;
    let abilityModifier = 0;
    if (monster.hitDice.abilityModifier != null && monster.hitDice.abilityModifier.id !== '0') {
      const ability = this.getAbility(monster.hitDice.abilityModifier.id, monster);
      const abilityScore = this.getAbilityScore(ability);
      abilityModifier = this.abilityService.getAbilityModifier(abilityScore);
      if (abilityModifier !== 0) {
        modifier += abilityModifier * monster.hitDice.numDice;
      }
    }
    const value = Math.floor(monster.hitDice.numDice * multiplier) + modifier;

    if (monster.hitDice.numDice > 0) {
      display = monster.hitDice.numDice + 'd' + this.translate.instant('DiceSize.' + monster.hitDice.diceSize);
    }
    if (modifier !== 0) {
      display += ' + ' + modifier;
    }
    return `${value} (${display})`;
  }

  getAverageHp(monster: MonsterSummary): number {
    const diceSizeValue = this.diceService.getDiceSizeValue(monster.hitDice.diceSize);
    const multiplier = Math.floor(diceSizeValue / 2) + 0.5;
    let modifier = monster.hitDice.miscModifier;
    let abilityModifier = 0;
    if (monster.hitDice.abilityModifier != null && monster.hitDice.abilityModifier.id !== '0') {
      const ability = this.getAbility(monster.hitDice.abilityModifier.id, monster);
      const abilityScore = this.getAbilityScore(ability);
      abilityModifier = this.abilityService.getAbilityModifier(abilityScore);
      if (abilityModifier !== 0) {
        modifier += abilityModifier * monster.hitDice.numDice;
      }
    }
    return Math.floor(monster.hitDice.numDice * multiplier) + modifier;
  }

  getMaxHp(monster: MonsterSummary): number {
    const diceSizeValue = this.diceService.getDiceSizeValue(monster.hitDice.diceSize);
    let modifier = monster.hitDice.miscModifier;
    let abilityModifier = 0;
    if (monster.hitDice.abilityModifier != null && monster.hitDice.abilityModifier.id !== '0') {
      const ability = this.getAbility(monster.hitDice.abilityModifier.id, monster);
      const abilityScore = this.getAbilityScore(ability);
      abilityModifier = this.abilityService.getAbilityModifier(abilityScore);
      if (abilityModifier !== 0) {
        modifier += abilityModifier * monster.hitDice.numDice;
      }
    }
    return (monster.hitDice.numDice * diceSizeValue) + modifier;
  }

  rollHp(monster: MonsterSummary, monsterNumber: number, local: boolean = false): Promise<number> {
    if (local) {
      const roll = this.diceService.roll(this.getHpRollRequest(monster, monsterNumber));
      return Promise.resolve(roll.totalResult);
    } else {
      return this.rollStandard(monster.id, this.getHpRollRequest(monster, monsterNumber)).then((roll: Roll) => {
        return roll.totalResult;
      });
    }
  }

  private getHpRollRequest(monster: MonsterSummary, monsterNumber: number): RollRequest {
    const hitDice = _.cloneDeep(monster.hitDice);
    if (hitDice.abilityModifier != null && hitDice.abilityModifier.id !== '0') {
      const ability = this.getAbility(hitDice.abilityModifier.id, monster);
      const abilityScore = this.getAbilityScore(ability);
      const abilityModifier = this.abilityService.getAbilityModifier(abilityScore);
      let modifier = hitDice.miscModifier;
      if (abilityModifier !== 0) {
        modifier += abilityModifier * hitDice.numDice;
      }
      hitDice.miscModifier = modifier;
    }

    return this.diceService.getDiceRollRequest(
      hitDice,
      this.getRollRequestMonsterName(monster, monsterNumber)
    );
  }

  getPassivePerception(monster: MonsterSummary): number {
    const wis = this.getAbilityBySid(SID.ABILITIES.WISDOM, monster);
    const score = this.getAbilityScore(wis);
    const modifier = this.abilityService.getAbilityModifier(score);
    let passivePerception = 10 + modifier;
    if (monster.perceptionProficient) {
      passivePerception += this.getProfBonus(monster.challengeRating);
    }
    return passivePerception;
  }

  rollStealth(monster: MonsterSummary, monsterNumber: number, local: boolean = false): Promise<Roll> {
    if (local) {
      const roll = this.diceService.roll(this.getStealthRollRequest(monster, monsterNumber));
      return Promise.resolve(roll);
    } else {
      return this.rollStandard(monster.id, this.getStealthRollRequest(monster, monsterNumber));
    }
  }

  private getStealthRollRequest(monster: MonsterSummary, monsterNumber: number): RollRequest {
    return this.diceService.getRollRequest(
      RollType.STANDARD,
      this.getRollRequestMonsterName(monster, monsterNumber),
      DiceSize.TWENTY,
      this.getStealthModifier(monster),
      false,
      false,
      false
    );
  }

  /*************************** Damage Configuration Collection ****************************/

  initializeDamageConfigurations(action: MonsterAction): DamageConfigurationCollection {
    const collection = new DamageConfigurationCollection();
    collection.attackType = action.attackType;
    collection.temporaryHP = action.temporaryHP;
    collection.attackMod = action.attackMod;
    collection.attackAbilityMod = action.attackAbilityModifier;
    collection.saveProficiencyModifier = action.saveProficiencyModifier;
    collection.saveAbilityModifier = action.saveAbilityModifier;
    collection.saveType = new ListObject('0', '');
    collection.halfOnSave = action.halfOnSave;
    if (action.saveType != null) {
      collection.saveType.id = action.saveType.id;
      collection.saveType.name = action.saveType.name;
    }
    collection.damageConfigurations = this.getCollectionDamageConfigurations(action.damageConfigurations.slice(0));
    return _.cloneDeep(collection);
  }

  private getCollectionDamageConfigurations(configs: DamageConfiguration[]): DamageConfiguration[] {
    const list = configs.slice(0);
    list.forEach((config: DamageConfiguration) => {
      if (config.values.abilityModifier == null) {
        config.values.abilityModifier = new Ability();
      }
    });
    return list;
  }

  setDamageConfigurations(action: MonsterAction, collection: DamageConfigurationCollection): void {
    action.attackType = collection.attackType;
    action.temporaryHP = collection.temporaryHP;
    action.attackMod = collection.attackMod;
    action.attackAbilityModifier = collection.attackAbilityMod;
    action.saveProficiencyModifier = collection.saveProficiencyModifier;
    action.saveAbilityModifier = collection.saveAbilityModifier;
    if (collection.saveType.id === '0') {
      action.saveType = null;
    } else {
      action.saveType = new ListObject();
      action.saveType.id = collection.saveType.id;
      action.saveType.name = collection.saveType.name;
    }
    action.halfOnSave = collection.halfOnSave;
    action.damageConfigurations = this.getFinialDamageConfigurations(collection.damageConfigurations);
  }

  private getFinialDamageConfigurations(configs: DamageConfiguration[]): DamageConfiguration[] {
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

  createCopyOfDamageConfigurationCollection(collection: DamageConfigurationCollection): DamageConfigurationCollection {
    return _.cloneDeep(collection);
  }

  createCopyOfDamageConfiguration(config: DamageConfiguration): DamageConfiguration {
    return _.cloneDeep(config);
  }

  /*************************** Configuration Collection ****************************/

  initializeConfigurationCollection(monster: Monster, listSource: ListSource = ListSource.MY_STUFF): Promise<MonsterConfigurationCollection> {
    const collection = new MonsterConfigurationCollection();
    const promises = [];
    promises.push(this.initializeProfs(monster, collection, listSource));
    this.initializeSpells(monster, collection);
    promises.push(this.initializeDamageModifiers(monster, collection));
    promises.push(this.initializeConditionImmunities(monster, collection));
    // promises.push(this.initializeMiscModifiers(monster, collection));

    // this.initializeStartingEquipment(monster, collection);
    this.initializeSenses(monster, collection);

    return Promise.all(promises).then(() => {
      return collection;
    });
  }

  setFromCollections(monster: Monster, collection: MonsterConfigurationCollection): void {
    this.setProfsFromCollection(monster, collection.proficiencyCollection);
    this.setDamageModifiersFromCollection(monster, collection.damageModifierCollection);
    this.setConditionImmunitiesFromCollection(monster, collection.conditionImmunityConfigurationCollection);
    this.setSensesFromCollection(monster, collection.senseConfigurationCollection);
    this.setSpellConfigurations(collection. spellConfigurationCollection, monster);
  }

  private setProfsFromCollection(monster: Monster, proficiencyCollection: ProficiencyCollection): void {
    //abilities
    monster.attributeProfs = [];
    proficiencyCollection.savingThrowProficiencies.forEach((prof: ListProficiency) => {
      if (prof.proficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        monster.attributeProfs.push(proficiency);
      }
    });

    //ability modifiers
    // proficiencyCollection.abilityModifiers.forEach((modifier: ListModifier) => {
    //   if (modifier.value !== 0) {
    //     const mod = new Modifier();
    //     mod.attribute = new Attribute();
    //     mod.attribute.id = modifier.item.id;
    //     mod.attribute.name = modifier.item.name;
    //     mod.value = modifier.value;
    //     monster.attributeProfs.push(proficiency);
    //   }
    // });

    //armors
    proficiencyCollection.armorProficiencies.forEach((prof: ListProficiency) => {
      if (prof.proficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        monster.attributeProfs.push(proficiency);
      }

      prof.childrenProficiencies.forEach((childProf: ListProficiency) => {
        if (childProf.proficient) {
          const proficiency = new ItemProficiency();
          proficiency.proficient = true;
          proficiency.item = new Item();
          proficiency.item.id = childProf.item.id;
          proficiency.item.name = childProf.item.name;
          monster.itemProfs.push(proficiency);
        }
      });
    });

    //languages
    proficiencyCollection.languageProficiencies.forEach((prof: ListProficiency) => {
      if (prof.proficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        monster.attributeProfs.push(proficiency);
      }
    });

    //skills
    proficiencyCollection.skillProficiencies.forEach((prof: ListProficiency) => {
      if (prof.proficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        monster.attributeProfs.push(proficiency);
      }
    });

    //tools
    proficiencyCollection.toolProficiencies.forEach((prof: ListProficiency) => {
      if (prof.proficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        monster.attributeProfs.push(proficiency);
      }

      prof.childrenProficiencies.forEach((childProf: ListProficiency) => {
        if (childProf.proficient) {
          const proficiency = new ItemProficiency();
          proficiency.proficient = true;
          proficiency.item = new Item();
          proficiency.item.id = childProf.item.id;
          proficiency.item.name = childProf.item.name;
          monster.itemProfs.push(proficiency);
        }
      });
    });

    //weapons
    proficiencyCollection.weaponProficiencies.forEach((prof: ListProficiency) => {
      if (prof.proficient) {
        const proficiency = new Proficiency();
        proficiency.proficient = true;
        proficiency.attribute = new ProficiencyListObject();
        proficiency.attribute.id = prof.item.id;
        proficiency.attribute.name = prof.item.name;
        monster.attributeProfs.push(proficiency);
      }

      prof.childrenProficiencies.forEach((childProf: ListProficiency) => {
        if (childProf.proficient) {
          const proficiency = new ItemProficiency();
          proficiency.proficient = true;
          proficiency.item = new Item();
          proficiency.item.id = childProf.item.id;
          proficiency.item.name = childProf.item.name;
          monster.itemProfs.push(proficiency);
        }
      });
    });
  }

  private initializeProfs(monster: Monster, collection: MonsterConfigurationCollection, listSource: ListSource): Promise<ProficiencyCollection> {
    const proficiencies = new ProficiencyCollection();
    const promises = [];
    promises.push(this.initializeAbilityModifiers(proficiencies, monster, listSource));
    promises.push(this.initializeSavingThrowProfs(proficiencies, monster, listSource));
    promises.push(this.initializeArmorProfs(proficiencies, monster, listSource));
    promises.push(this.initializeLanguageProfs(proficiencies, monster, listSource));
    promises.push(this.initializeSkillsProfs(proficiencies, monster, listSource));
    promises.push(this.initializeToolProfs(proficiencies, monster, listSource));
    promises.push(this.initializeWeaponProfs(proficiencies, monster, listSource));
    this.initializeSenses(monster, collection);

    return Promise.all(promises).then(() => {
      collection.proficiencyCollection = proficiencies;
      return proficiencies;
    });
  }

  initializeAbilityModifiers(proficiencies: ProficiencyCollection, monster: Monster, listSource: ListSource):
    Promise<ListModifier[]> {
    proficiencies.abilityModifiers = [];
    return this.abilityService.getAbilities(listSource).then((abilities: ListObject[]) => {
      abilities.forEach((ability: ListObject) => {
        const mod = new ListModifier(new ListObject(ability.id, ability.name));
        mod.value = this.getAbilityScoreValue(ability, monster.abilityScores);
        proficiencies.abilityModifiers.push(mod);
      });
      return proficiencies.abilityModifiers;
    });
  }

  private initializeSavingThrowProfs(proficiencies: ProficiencyCollection, monster: Monster, listSource: ListSource):
    Promise<ListProficiency[]> {
    proficiencies.savingThrowProficiencies = [];
    return this.abilityService.getAbilities(listSource).then((abilities: ListObject[]) => {
      abilities.forEach((ability: ListObject) => {
        const prof = new ListProficiency(new ListObject(ability.id, ability.name));
        prof.proficient = this.isProficient(ability, monster.attributeProfs);
        proficiencies.savingThrowProficiencies.push(prof);
      });
      return proficiencies.savingThrowProficiencies;
    });
  }

  private initializeArmorProfs(proficiencies: ProficiencyCollection, monster: Monster, listSource: ListSource):
    Promise<ListProficiency[]> {
    proficiencies.armorProficiencies = [];
    return this.armorTypeService.getArmorTypes(listSource).then((armorTypes: ListObject[]) => {
      const promises = [];
      armorTypes.forEach((armorType: ListObject) => {
        const prof = new ListProficiency(armorType);
        prof.proficient = this.isProficient(armorType, monster.attributeProfs);
        proficiencies.armorProficiencies.push(prof);

        promises.push(this.itemService.getArmorsByArmorType(armorType, listSource).then((armors: ListObject[]) => {
          armors.forEach((armor: ListObject) => {
            const childProf = new ListProficiency(armor);
            childProf.parentProficiency = prof;
            childProf.proficient = this.isItemProficient(armor, monster.itemProfs);
            prof.childrenProficiencies.push(childProf);
          });
        }));
      });

      return Promise.all(promises).then(() => {
        return proficiencies.armorProficiencies;
      });
    });
  }

  private initializeLanguageProfs(proficiencies: ProficiencyCollection, monster: Monster, listSource: ListSource):
    Promise<ListProficiency[]> {
    proficiencies.languageProficiencies = [];
    return this.languageService.getLanguages(listSource).then((languages: ListObject[]) => {
      languages.forEach((language: ListObject) => {
        const prof = new ListProficiency(language);
        prof.proficient = this.isProficient(language, monster.attributeProfs);
        proficiencies.languageProficiencies.push(prof);
      });
      return proficiencies.languageProficiencies;
    });
  }

  private initializeSkillsProfs(proficiencies: ProficiencyCollection, monster: Monster, listSource: ListSource):
    Promise<ListProficiency[]> {
    proficiencies.skillProficiencies = [];
    return this.skillService.getSkills(listSource).then((skills: ListObject[]) => {
      skills.forEach((skill: ListObject) => {
        const prof = new ListProficiency(skill);
        prof.proficient = this.isProficient(skill, monster.attributeProfs);
        proficiencies.skillProficiencies.push(prof);
      });
      return proficiencies.skillProficiencies;
    });
  }

  private initializeToolProfs(proficiencies: ProficiencyCollection, monster: Monster, listSource: ListSource):
    Promise<ListProficiency[]> {
    proficiencies.toolProficiencies = [];
    return this.toolCategoryService.getToolCategories(listSource).then((toolCategories: ListObject[]) => {
      const promises = [];
      toolCategories.forEach((toolCategory: ListObject) => {
        const prof = new ListProficiency(toolCategory);
        prof.proficient = this.isProficient(toolCategory, monster.attributeProfs);
        proficiencies.toolProficiencies.push(prof);

        promises.push(this.itemService.getToolsByToolCategory(toolCategory, listSource).then((weapons: ListObject[]) => {
          weapons.forEach((weapon: ListObject) => {
            const childProf = new ListProficiency(weapon);
            childProf.parentProficiency = prof;
            childProf.proficient = this.isItemProficient(weapon, monster.itemProfs);
            prof.childrenProficiencies.push(childProf);
          });
        }));
      });

      return Promise.all(promises).then(() => {
        return proficiencies.toolProficiencies;
      });
    });
  }

  private initializeWeaponProfs(proficiencies: ProficiencyCollection, monster: Monster, listSource: ListSource):
    Promise<ListProficiency[]> {
    proficiencies.weaponProficiencies = [];
    return this.weaponTypeService.getWeaponTypes(listSource).then((weaponTypes: ListObject[]) => {
      const promises = [];
      weaponTypes.forEach((weaponType: ListObject) => {
        const prof = new ListProficiency(weaponType);
        prof.proficient = this.isProficient(weaponType, monster.attributeProfs);
        proficiencies.weaponProficiencies.push(prof);

        promises.push(this.itemService.getWeaponsByWeaponType(weaponType, listSource).then((weapons: ListObject[]) => {
          weapons.forEach((weapon: ListObject) => {
            const childProf = new ListProficiency(weapon);
            childProf.parentProficiency = prof;
            childProf.proficient = this.isItemProficient(weapon, monster.itemProfs);
            prof.childrenProficiencies.push(childProf);
          });
        }));
      });

      return Promise.all(promises).then(() => {
        return proficiencies.weaponProficiencies;
      });
    });
  }

  private isProficient(attribute: ListObject, proficiencies: Proficiency[]): boolean {
    for (let i = 0; i < proficiencies.length; i++) {
      const prof: Proficiency = proficiencies[i];
      if (prof.attribute.id === attribute.id && prof.proficient) {
        return true;
      }
    }
    return false;
  }

  private isItemProficient(item: ListObject, proficiencies: ItemProficiency[]): boolean {
    for (let i = 0; i < proficiencies.length; i++) {
      const prof: ItemProficiency = proficiencies[i];
      if (prof.item.id === item.id) {
        return true;
      }
    }
    return false;
  }

  private getAbilityScoreValue(attribute: ListObject, abilityScores: MonsterAbilityScore[]): number {
    for (let i = 0; i < abilityScores.length; i++) {
      const abilityScore: MonsterAbilityScore = abilityScores[i];
      if (abilityScore.ability.id === attribute.id) {
        return abilityScore.value;
      }
    }
    return 0;
  }

  private setDamageModifiersFromCollection(monster: Monster, collection: DamageModifierCollection): void {
    monster.damageModifiers = [];
    collection.damageModifiers.forEach((modifier: DamageModifierCollectionItem) => {
      if (modifier.damageModifierType !== DamageModifierType.NORMAL) {
        const damageModifier = new DamageModifier();
        damageModifier.damageType = new DamageType();
        damageModifier.damageType.id = modifier.damageType.id;
        damageModifier.damageType.name = modifier.damageType.name;
        damageModifier.damageType.sid = modifier.damageType.sid;
        damageModifier.damageModifierType = modifier.damageModifierType;
        monster.damageModifiers.push(damageModifier);
      }
    });
  }

  private initializeSpells(monster: Monster, collection: MonsterConfigurationCollection): SpellConfigurationCollection {
    const spellConfigurationCollection = this.initializeSpellConfigurations(monster);
    collection.spellConfigurationCollection = spellConfigurationCollection;
    return spellConfigurationCollection;
  }

  private initializeSpellConfigurations(monster: Monster): SpellConfigurationCollection {
    const spellConfigurationCollection = new SpellConfigurationCollection();
    spellConfigurationCollection.spellcastingAbility = monster.spellcastingAbility;
    spellConfigurationCollection.innateSpellcastingAbility = monster.innateSpellcastingAbility;
    if (spellConfigurationCollection.spellcastingAbility == null) {
      spellConfigurationCollection.spellcastingAbility = '0';
    }

    spellConfigurationCollection.casterType = monster.casterType == null ? '0' : monster.casterType.id;

    monster.spells.forEach((spellConfiguration: SpellConfiguration) => {
      spellConfigurationCollection.spellConfigurations.push(this.getSpellConfigurationItem(spellConfiguration))
    });

    monster.innateSpells.forEach((spellConfiguration: InnateSpellConfiguration) => {
      spellConfigurationCollection.innateSpellConfigurations.push(this.getInnateSpellConfigurationItem(spellConfiguration))
    });

    let levels = this.characterLevelService.getLevelsDetailedFromStorageAsListObject();
    const noLevel = new ListObject('0', '');
    levels = levels.slice(0);
    levels.unshift(noLevel);
    spellConfigurationCollection.levels = levels;
    return spellConfigurationCollection;
  }

  private getSpellConfigurationItem(spellConfiguration: SpellConfiguration): SpellConfigurationCollectionItem {
    const config = new SpellConfigurationCollectionItem();
    config.spell = spellConfiguration.spell;
    config.levelGained = new ListObject('0', '');
    config.alwaysPrepared = false;
    config.countTowardsPrepared = true;
    config.notes = spellConfiguration.notes;
    config.author = spellConfiguration.author;
    return config;
  }

  private getInnateSpellConfigurationItem(spellConfiguration: InnateSpellConfiguration): InnateSpellConfigurationCollectionItem {
    const config = new InnateSpellConfigurationCollectionItem();
    config.spell = spellConfiguration.spell;
    config.limitedUse = spellConfiguration.limitedUse;
    if (config.limitedUse == null) {
      config.limitedUse = new LimitedUse();
    }
    config.slot = spellConfiguration.slot;
    config.author = spellConfiguration.author;
    return config;
  }

  private setSpellConfigurations(spellConfigurationCollection: SpellConfigurationCollection, monster: Monster): void {
    monster.spellcastingAbility = spellConfigurationCollection.spellcastingAbility;
    monster.innateSpellcastingAbility = spellConfigurationCollection.innateSpellcastingAbility;
    const spellConfigurations: SpellConfiguration[] = [];
    spellConfigurationCollection.spellConfigurations.forEach((spellConfigurationCollectionItem: SpellConfigurationCollectionItem) => {
      if (spellConfigurationCollectionItem.parent == null) {
        const config = new SpellConfiguration();
        config.spell = spellConfigurationCollectionItem.spell;
        config.notes = spellConfigurationCollectionItem.notes;
        config.author = spellConfigurationCollectionItem.author;
        spellConfigurations.push(config);
      }
    });
    monster.spells = spellConfigurations;

    const innateSpellConfigurations: InnateSpellConfiguration[] = [];
    spellConfigurationCollection.innateSpellConfigurations.forEach((spellConfigurationCollectionItem: InnateSpellConfigurationCollectionItem) => {
      if (spellConfigurationCollectionItem.parent == null) {
        const config = new InnateSpellConfiguration();
        config.spell = spellConfigurationCollectionItem.spell;
        config.limitedUse = spellConfigurationCollectionItem.limitedUse;
        config.slot = spellConfigurationCollectionItem.slot;
        config.author = spellConfigurationCollectionItem.author;
        innateSpellConfigurations.push(config);
      }
    });
    monster.innateSpells = innateSpellConfigurations;
  }

  private initializeDamageModifiers(monster: Monster, collection: MonsterConfigurationCollection):
    Promise<DamageModifierCollection> {
    return this.initializeDamageModifierConfigurations(monster)
      .then((damageModifierCollection: DamageModifierCollection) => {
        collection.damageModifierCollection = damageModifierCollection;
        return damageModifierCollection;
      });
  }

  private initializeDamageModifierConfigurations(monster: Monster): Promise<DamageModifierCollection> {
    const damageModifierCollection = new DamageModifierCollection();
    return this.damageTypeService.getDamageTypes().then((damageTypes: ListObject[]) => {
      damageTypes.forEach((damageType: ListObject) => {
        const item = new DamageModifierCollectionItem();
        item.damageType = damageType;
        item.damageModifierType = this.getDamageModifierType(damageType, monster);
        damageModifierCollection.damageModifiers.push(item);
      });
      return damageModifierCollection;
    });
  }

  private getDamageModifierType(damageType: ListObject, monster: Monster): DamageModifierType {
    if (monster == null) {
      return DamageModifierType.NORMAL;
    }
    const damageModifiers: DamageModifier[] = monster.damageModifiers;
    for (let i = 0; i < damageModifiers.length; i++) {
      const damageModifier: DamageModifier = damageModifiers[i];
      if (damageModifier.damageType.id === damageType.id) {
        return damageModifier.damageModifierType;
      }
    }
    return DamageModifierType.NORMAL;
  }

  private setConditionImmunitiesFromCollection(monster: Monster, collection: ConditionImmunityConfigurationCollection): void {
    monster.conditionImmunities = [];
    collection.conditionImmunities.forEach((item: ConditionImmunityConfigurationCollectionItem) => {
      if (item.immune) {
        monster.conditionImmunities.push(item.condition);
      }
    });
  }

  private initializeConditionImmunities(monster: Monster, collection: MonsterConfigurationCollection):
    Promise<ConditionImmunityConfigurationCollection> {
    return this.initializeConditionImmunitiesConfigurations(monster)
      .then((conditionImmunityConfigurationCollection: ConditionImmunityConfigurationCollection) => {
        collection.conditionImmunityConfigurationCollection = conditionImmunityConfigurationCollection;
        return conditionImmunityConfigurationCollection;
      });
  }

  private initializeConditionImmunitiesConfigurations(monster: Monster):
    Promise<ConditionImmunityConfigurationCollection> {
    const collection = new ConditionImmunityConfigurationCollection();
    return this.conditionService.getConditions().then((conditions: ListObject[]) => {
      conditions.forEach((condition: ListObject) => {
        const item: ConditionImmunityConfigurationCollectionItem = new ConditionImmunityConfigurationCollectionItem();
        item.condition = condition;
        item.immune = this.isImmune(condition, monster.conditionImmunities);
        collection.conditionImmunities.push(item);
      });
      return collection;
    });
  }

  private isImmune(condition: ListObject, immunities: ListObject[]): boolean {
    if (immunities == null) {
      return false;
    }

    for (let i = 0; i < immunities.length; i++) {
      const immunity: ListObject = immunities[i];
      if (immunity.id === condition.id) {
        return true;
      }
    }
    return false;
  }

  private setSensesFromCollection(monster: Monster, collection: SenseConfigurationCollection): void {
    monster.senses = [];
    collection.senses.forEach((item: SenseConfigurationCollectionItem) => {
      if (item.range !== 0) {
        const senseValue = new SenseValue();
        senseValue.sense = item.sense;
        senseValue.range = item.range;
        monster.senses.push(senseValue);
      }
    });
  }

  private initializeSenses(monster: Monster, collection: MonsterConfigurationCollection): SenseConfigurationCollection {
    const configurations = this.initializeSensesConfigurations(monster);
    collection.senseConfigurationCollection = configurations;
    return configurations;
  }

  private initializeSensesConfigurations(monster: Monster): SenseConfigurationCollection {
    const collection = new SenseConfigurationCollection();
    const senses: Sense[] = this.getSenses();
    senses.forEach((sense: Sense) => {
      const item = new SenseConfigurationCollectionItem();
      item.sense = sense;
      item.range = this.getRange(sense, monster.senses);
      collection.senses.push(item);
    });
    return collection;
  }

  private getSenses(): Sense[] {
    const senses: Sense[] = [];
    senses.push(Sense.DARKVISION);
    senses.push(Sense.BLINDSIGHT);
    senses.push(Sense.TELEPATHY);
    senses.push(Sense.TREMORSENSE);
    senses.push(Sense.TRUESIGHT);
    return senses;
  }

  private getRange(sense: Sense, senses: SenseValue[]): number {
    if (senses == null) {
      return 0;
    }

    for (let i = 0; i < senses.length; i++) {
      const senseValue: SenseValue = senses[i];
      if (senseValue.sense === sense) {
        return senseValue.range;
      }
    }
    return 0;
  }

  createCopyOfCollection(collection: MonsterConfigurationCollection): MonsterConfigurationCollection {
    return _.cloneDeep(collection);
  }

  /********************* Monster Config *************************/

  addMonsterToCollection(collectionToAdd: MonsterConfigurationCollection, collection: CreatureConfigurationCollection, inheritedFrom: InheritedFrom, monster: Monster): void {
    this.addToProficiencies(collection, collectionToAdd, inheritedFrom);
    this.addToDamageModifiers(collection, collectionToAdd, inheritedFrom);
    this.addToConditionImmunities(collection, collectionToAdd, inheritedFrom);
    this.addToSenses(collection, collectionToAdd, inheritedFrom);
    this.addToSpellConfigurations(collection, collectionToAdd, inheritedFrom);
    collection.profBonus = this.getProfBonus(monster.challengeRating);
  }

  private addToProficiencies(collection: CreatureConfigurationCollection, collectionToAdd: MonsterConfigurationCollection, inheritedFrom: InheritedFrom): void {
    this.addToAbilities(collection.proficiencyCollection.abilities,
      collectionToAdd.proficiencyCollection.abilityModifiers, null, null,
      collectionToAdd.proficiencyCollection.savingThrowProficiencies,
      inheritedFrom);
    this.addToProfs(collection.proficiencyCollection.armorProficiencies,
      collectionToAdd.proficiencyCollection.armorProficiencies, inheritedFrom);
    this.addToProfs(collection.proficiencyCollection.languageProficiencies,
      collectionToAdd.proficiencyCollection.languageProficiencies, inheritedFrom);
    this.addToProfs(collection.proficiencyCollection.skillProficiencies,
      collectionToAdd.proficiencyCollection.skillProficiencies, inheritedFrom);
    this.addToProfs(collection.proficiencyCollection.toolProficiencies,
      collectionToAdd.proficiencyCollection.toolProficiencies, inheritedFrom);
    this.addToProfs(collection.proficiencyCollection.weaponProficiencies,
      collectionToAdd.proficiencyCollection.weaponProficiencies, inheritedFrom);
    this.addToProfs(collection.proficiencyCollection.miscProficiencies,
      collectionToAdd.proficiencyCollection.miscProficiencies, inheritedFrom);
  }

  private addToAbilities(collection: CreatureAbilityProficiency[],
                         abilityModifiers: ListModifier[], abilityProfs: ListProficiency[],
                         saveModifiers: ListModifier[], saveProfs: ListProficiency[],
                         inheritedFrom: InheritedFrom): void {
    this.addAbilitiesToModifiers(collection, abilityModifiers, inheritedFrom, false);
    this.addAbilitiesToModifiers(collection, saveModifiers, inheritedFrom, false);

    this.addAbilitiesToProfs(collection, abilityProfs, inheritedFrom, false);
    this.addAbilitiesToProfs(collection, saveProfs, inheritedFrom, true);
  }

  private addAbilitiesToModifiers(collection: CreatureAbilityProficiency[], modifiers: ListModifier[],
                                  inheritedFrom: InheritedFrom, save: boolean): void {
    if (modifiers == null) {
      return;
    }
    modifiers.forEach((modifier: ListModifier) => {
      if (modifier.value > 0 || modifier.parentValue > 0) {
        const creatureAbilityProf = this.getCreatureAbilityProficiency(collection, modifier.item.id);
        if (creatureAbilityProf != null) {
          const value = new CreatureListModifierValue(inheritedFrom, modifier.value + modifier.parentValue);
          if (save) {
            creatureAbilityProf.saveModifier.inheritedValues.push(value);
          } else {
            creatureAbilityProf.abilityModifier.inheritedValues.push(value);
          }
        }
      }
    });
  }

  private addAbilitiesToProfs(collection: CreatureAbilityProficiency[], profs: ListProficiency[],
                              inheritedFrom: InheritedFrom, save: boolean): void {
    if (profs == null) {
      return;
    }
    profs.forEach((prof: ListProficiency) => {
      if (prof.proficient || prof.inheritedProficient || prof.secondaryProficient
        || prof.inheritedSecondaryProficient || prof.childrenProficiencies.length > 0) {
        const creatureAbilityProf = this.getCreatureAbilityProficiency(collection, prof.item.id);
        if (creatureAbilityProf != null) {
          if (prof.proficient || prof.inheritedProficient) {
            if (save) {
              creatureAbilityProf.saveProficiency.inheritedFrom.push(inheritedFrom);
            } else {
              creatureAbilityProf.abilityProficiency.inheritedFrom.push(inheritedFrom);
            }
          }
          if (prof.childrenProficiencies.length > 0) {
            this.addToProfs(creatureAbilityProf.abilityProficiency.childrenProficiencies,
              prof.childrenProficiencies, inheritedFrom);
          }
        }
      }
    });
  }

  private addToProfs(profs: CreatureListProficiency[], profsToAdd: ListProficiency[],
                     inheritedFrom: InheritedFrom, parentProf: CreatureListProficiency = null): void {
    profsToAdd.forEach((prof: ListProficiency) => {
      if (prof.proficient || prof.inheritedProficient || prof.secondaryProficient
        || prof.inheritedSecondaryProficient || prof.childrenProficiencies.length > 0) {
        let creatureProf = this.getCreatureProf(prof.item, profs);
        if (creatureProf == null) {
          creatureProf = new CreatureListProficiency(prof.item);
          creatureProf.item.sid = prof.item.sid;
          creatureProf.parentProficiency = parentProf;
          parentProf.childrenProficiencies.push(creatureProf);
        }

        if (prof.proficient || prof.inheritedProficient) {
          creatureProf.inheritedFrom.push(inheritedFrom);
        }
        if (prof.childrenProficiencies.length > 0) {
          this.addToProfs(creatureProf.childrenProficiencies, prof.childrenProficiencies, inheritedFrom, creatureProf);
        }
      }
    });
  }

  private getCreatureAbilityProficiency(collection: CreatureAbilityProficiency[], abilityId: string): CreatureAbilityProficiency {
    for (let i = 0; i < collection.length; i++) {
      const ability = collection[i];
      if (ability.ability.id === abilityId) {
        return ability;
      }
    }
    return null;
  }

  getCreatureProf(item: ListObject, profs: CreatureListProficiency[]): CreatureListProficiency {
    for (let i = 0; i < profs.length; i++) {
      let prof = profs[i];
      if (prof.item.id === item.id) {
        return prof;
      }
      if (prof.childrenProficiencies.length > 0) {
        prof = this.getCreatureProf(item, prof.childrenProficiencies);
        if (prof != null) {
          return prof;
        }
      }
    }
    return null;
  }

  private addToDamageModifiers(collection: CreatureConfigurationCollection, collectionToAdd: MonsterConfigurationCollection,
                               inheritedFrom: InheritedFrom): void {
    collectionToAdd.damageModifierCollection.damageModifiers.forEach((item: DamageModifierCollectionItem) => {
      if (item.damageModifierType !== DamageModifierType.NORMAL) {
        const creatureItem: CreatureDamageModifierCollectionItem =
          this.getCreatureDamageModifier(collection.damageModifierCollection.damageModifiers, item.damageType);
        if (creatureItem != null) {
          const inheritedItem = new InheritedDamageModifierType();
          inheritedItem.damageModifierType = item.damageModifierType;
          inheritedItem.inheritedFrom = inheritedFrom;
          creatureItem.inheritedDamageModifierTypes.push(inheritedItem);
        }
      }
    });
  }

  private getCreatureDamageModifier(items: CreatureDamageModifierCollectionItem[], damageType: ListObject):
    CreatureDamageModifierCollectionItem {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.damageType.id === damageType.id) {
        return item;
      }
    }
    return null;
  }

  private addToConditionImmunities(collection: CreatureConfigurationCollection, collectionToAdd: MonsterConfigurationCollection,
                                   inheritedFrom: InheritedFrom): void {
    collectionToAdd.conditionImmunityConfigurationCollection.conditionImmunities
      .forEach((item: ConditionImmunityConfigurationCollectionItem) => {
        if (item.immune) {
          const creatureItem =
            this.getCreatureConditionImmunity(collection.conditionImmunityConfigurationCollection.conditionImmunities, item.condition);
          if (creatureItem != null) {
            creatureItem.inheritedFrom.push(inheritedFrom);
          }
        }
      });
  }

  private getCreatureConditionImmunity(items: CreatureConditionImmunityCollectionItem[], condition: ListObject):
    CreatureConditionImmunityCollectionItem {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.condition.id === condition.id) {
        return item;
      }
    }
    return null;
  }

  private addToSenses(collection: CreatureConfigurationCollection, collectionToAdd: MonsterConfigurationCollection,
                      inheritedFrom: InheritedFrom): void {
    collectionToAdd.senseConfigurationCollection.senses.forEach((item: SenseConfigurationCollectionItem) => {
      if (item.range + item.inheritedRange > 0) {
        const creatureItem = this.getCreatureSense(collection.senseConfigurationCollection.senses, item.sense);
        if (creatureItem != null) {
          const inheritedSense = new InheritedSense();
          inheritedSense.range = item.range + item.inheritedRange;
          inheritedSense.inheritedFrom = inheritedFrom;
          creatureItem.inheritedSenses.push(inheritedSense);
        }
      }
    })
  }

  private getCreatureSense(items: CreatureSenseCollectionItem[], sense: Sense): CreatureSenseCollectionItem {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.sense === sense) {
        return item;
      }
    }
    return null;
  }

  private addToSpellConfigurations(collection: CreatureConfigurationCollection, collectionToAdd: MonsterConfigurationCollection,
                                   inheritedFrom: InheritedFrom): void {
    const spellCollection = new MappedSpellConfigurationCollection();
    collectionToAdd.spellConfigurationCollection.spellConfigurations.forEach((configuration: SpellConfigurationCollectionItem) => {
      spellCollection.configurations.set(configuration.spell.id, configuration);
    });
    collection.characteristicSpellConfigurations.set(inheritedFrom.id, spellCollection);
  }

  /************************************** Battle Monster *********************************/

  resetLegendaryPoints(battleMonster: BattleMonster): Promise<any> {
    const maxPoints = battleMonster.maxLegendaryPoints;
    if (maxPoints === 0) {
      return Promise.resolve();
    }
    return this.updateLegendaryPoints(battleMonster, maxPoints).then(() => {
      battleMonster.legendaryPoints = maxPoints;
    });
  }

  updateLegendaryPoints(battleMonster: BattleMonster, legendaryPoints: number): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/creatures/${battleMonster.id}/legendaryPoints`, legendaryPoints).toPromise()
  }

  getAC(battleMonster: BattleMonster, collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true, includeAbilities = true): number {
    let ac = this.calculateAC(battleMonster, collection);

    if (includeAbilities) {
      const abilities = this.creatureService.getAbilities(battleMonster.acAbilities, collection);
      abilities.forEach((ability: CreatureAbilityProficiency) => {
        ac += this.creatureService.getAbilityModifier(ability, collection);
      });
    }

    if (includeMisc || includeModifiers) {
      const miscModifier = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.AC, collection);
      if (includeModifiers) {
        ac += this.creatureService.getModifiers(miscModifier.modifiers, collection);
      }
      if (includeMisc) {
        ac += this.creatureService.getMiscModifierValue(miscModifier);
      }
    }

    return ac;
  }

  getACTooltip(battleMonster: BattleMonster, collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true): string {
    let parts = [];

    parts.push(this.translate.instant('Monster') + ': ' + battleMonster.monster.ac);
    // const useBase = !this.wearingBodyArmor(battleMonster);
    // if (useBase) {
    //   parts.push(this.translate.instant('Base') + ': 10')
    const abilities = this.creatureService.getAbilities(battleMonster.acAbilities, collection);
    abilities.forEach((ability: CreatureAbilityProficiency) => {
      const abilityModifier = this.creatureService.getAbilityModifier(ability, collection);
      parts.push(ability.ability.abbr + ': ' + abilityModifier.toString(10));
    });
    // }

    // const itemsDisplay = this.getEquippedArmorTooltip(battleMonster, collection);
    // itemsDisplay.forEach((labelValue: LabelValue) => {
    //   parts.push(labelValue.label + ': ' + labelValue.value);
    // });

    if (includeMisc || includeModifiers) {
      const miscModifier = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.AC, collection);
      if (includeModifiers) {
        const modifierTooltips: string[] = this.creatureService.getModifierTooltips(miscModifier.modifiers, collection);
        parts = parts.concat(modifierTooltips);
      }
      if (includeMisc) {
        parts = parts.concat(this.creatureService.getMiscModifierTooltip(miscModifier));
      }
    }

    return parts.join('\n');
  }

  private calculateAC(battleMonster: BattleMonster, collection: CreatureConfigurationCollection): number {
    return battleMonster.monster.ac;
    // let ac = 0;
    // if (!this.wearingBodyArmor(battleMonster)) {
    //   const abilities = this.creatureService.getAbilities(battleMonster.acAbilities, collection);
    //   ac = 10;
    //   abilities.forEach((ability: CreatureAbilityProficiency) => {
    //     ac += this.creatureService.getAbilityModifier(ability, collection);
    //   });
    // }
    // return ac + this.calculateEquippedArmor(battleMonster, collection);
  }

  // wearingBodyArmor(battleMonster: BattleMonster): boolean {
  //   return this.creatureService.wearingBodyArmor(battleMonster);
  // }

  // calculateEquippedArmor(battleMonster: BattleMonster, collection: CreatureConfigurationCollection): number {
  //   return this.creatureService.calculateEquippedArmor(battleMonster, collection);
  // }

  private getSpeedTypeSID(speedType: SpeedType): number {
    switch (speedType) {
      case SpeedType.WALK:
        return SID.MISC_ATTRIBUTES.WALKING;
      case SpeedType.CRAWL:
        return SID.MISC_ATTRIBUTES.CRAWLING;
      case SpeedType.CLIMB:
        return SID.MISC_ATTRIBUTES.CLIMBING;
      case SpeedType.SWIM:
        return SID.MISC_ATTRIBUTES.SWIMMING;
      case SpeedType.FLY:
        return SID.MISC_ATTRIBUTES.FLYING;
      case SpeedType.BURROW:
        return SID.MISC_ATTRIBUTES.BURROW;
    }
    return -1;
  }

  getSpeedConfiguration(battleMonster: BattleMonster, collection: CreatureConfigurationCollection, speedType: SpeedType, settings: CharacterSpeedSettings): CreatureSpeedModifierCollectionItem {
    const speed = new CreatureSpeedModifierCollectionItem();
    speed.speedType = speedType;

    const sid = this.getSpeedTypeSID(speedType);
    const miscModifier = this.creatureService.getMiscModifier(sid, collection);
    if (miscModifier != null) {
      speed.creatureListProficiency = miscModifier;
      speed.modifiers = this.creatureService.getModifiers(miscModifier.modifiers, collection, 0, false);
      speed.modifiersDisplay = this.creatureService.getModifierLabels(miscModifier.modifiers, collection, false);
      speed.misc = this.creatureService.getMiscModifierValue(miscModifier);
      speed.miscDisplays = this.creatureService.getMiscModifierTooltip(miscModifier);
    }

    const setModification = this.modifierService.getSetModification(miscModifier.modifiers);
    const hasSet = setModification != null;
    speed.useHalfApplicable = !hasSet && (speedType === SpeedType.CLIMB || speedType === SpeedType.CRAWL || speedType === SpeedType.SWIM);
    const baseSpeed = this.getBaseMonsterSpeed(battleMonster, speedType);
    speed.applyGeneric = hasSet || baseSpeed > 0;
    if (hasSet) {
      speed.base = setModification.modifierConfiguration.value;
      speed.baseTooltip = setModification.powerName + ': ' + setModification.modifierConfiguration.value;
      speed.useHalfApplicable = false;
    } else if (baseSpeed > 0 || !speed.useHalfApplicable) {
      speed.base = baseSpeed;
      speed.baseTooltip = battleMonster.monster.name + ': ' + baseSpeed;
      speed.useHalfApplicable = false;
    } else if (speed.useHalfApplicable) {
      const walkingConfig = this.getSpeedConfiguration(battleMonster, collection, SpeedType.WALK, settings);
      const walkingSpeed = this.getSpeed(walkingConfig);

      speed.useHalf = this.getSpeedUseHalf(speedType, settings);
      speed.roundUp = this.getSpeedRoundUp(speedType, settings);

      speed.base = walkingSpeed;
      speed.baseTooltip = this.getBaseSpeedTooltip(speed, battleMonster, collection, settings);
    }

    if (speed.applyGeneric) {
      const genericSpeedModifier = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.SPEED, collection);
      if (genericSpeedModifier != null) {
        speed.modifiers += this.creatureService.getModifiers(genericSpeedModifier.modifiers, collection, 0, false);
        speed.modifiersDisplay = speed.modifiersDisplay.concat(this.creatureService.getModifierLabels(genericSpeedModifier.modifiers, collection, false));
      }

      // if (this.isHeavilyEncumbered(battleMonster, collection)) {
      //   speed.penalties += 20;
      //   speed.penaltyDisplays.push(this.translate.instant('Labels.HeavilyEncumbered') + ' -20');
      // } else if (this.isEncumbered(battleMonster, collection)) {
      //   speed.penalties += 10;
      //   speed.penaltyDisplays.push(this.translate.instant('Labels.Encumbered') + ' -10');
      // }

      // if (!this.creatureService.meetsEquippedArmorStrRequirements(battleMonster, collection)) {
      //   speed.penalties += 10;
      //   speed.penaltyDisplays.push(this.translate.instant('Labels.Armor') + ' -10');
      // }
    }

    const immobilizingConditions = this.creatureService.getActiveImmobilizingConditions(battleMonster);
    if (immobilizingConditions.length > 0) {
      speed.immobilized = true;
      immobilizingConditions.forEach((activeCondition: ActiveCondition) => {
        speed.penaltyDisplays.push(this.translate.instant('Immobilized') + ' (' + activeCondition.condition.name + ')');
      });
    }
    if (battleMonster.creatureHealth.exhaustionLevel >= 5) {
      speed.immobilized = true;
      speed.penaltyDisplays.push(this.translate.instant('ExhaustionCondition', {
        condition: this.translate.instant('Immobilized'),
        level: 5
      }));
    } else if (battleMonster.creatureHealth.exhaustionLevel >= 2) {
      speed.halved = true;
      speed.penaltyDisplays.push(this.translate.instant('ExhaustionCondition', {
        condition: this.translate.instant('Halved'),
        level: 2
      }));
    }

    return speed;
  }

  private getSpeedUseHalf(speedType: SpeedType, settings: CharacterSpeedSettings): boolean {
    switch (speedType) {
      case SpeedType.CRAWL:
        return settings.crawling.useHalf;
      case SpeedType.CLIMB:
        return settings.climbing.useHalf;
      case SpeedType.SWIM:
        return settings.swimming.useHalf;
    }
    return false;
  }

  private getSpeedRoundUp(speedType: SpeedType, settings: CharacterSpeedSettings): boolean {
    switch (speedType) {
      case SpeedType.CRAWL:
        return settings.crawling.useHalf && settings.crawling.roundUp;
      case SpeedType.CLIMB:
        return settings.climbing.useHalf && settings.climbing.roundUp;
      case SpeedType.SWIM:
        return settings.swimming.useHalf && settings.swimming.roundUp;
    }
    return false;
  }

  getBaseSpeedTooltip(speedConfiguration: CreatureSpeedModifierCollectionItem, battleMonster: BattleMonster, collection: CreatureConfigurationCollection, settings: CharacterSpeedSettings): string {
    let tooltip = '';
    if (speedConfiguration.useHalfApplicable && speedConfiguration.useHalf) {
      const walkingConfig = this.getSpeedConfiguration(battleMonster, collection, SpeedType.WALK, settings);
      const walkingSpeed = this.getSpeed(walkingConfig);

      tooltip = this.translate.instant('Tooltips.HalfWalkingValue', {walkingSpeed: walkingSpeed});

      if (speedConfiguration.roundUp) {
        tooltip += ', ' + this.translate.instant('RoundUp');
      }
    } else {
      tooltip = speedConfiguration.baseTooltip;
    }
    return tooltip;
  }

  getBaseMonsterSpeed(battleMonster: BattleMonster, speedType: SpeedType): number {
    const monster = battleMonster.monster;
    if (monster == null) {
      return 0;
    }

    let speed = 0;
    for (let i = 0; i < monster.speeds.length; i++) {
      const monsterSpeed = monster.speeds[i];
      if (monsterSpeed.speedType === speedType) {
        speed = monsterSpeed.value;
      }
    }

    // if (speed === 0 && (speedType === SpeedType.CLIMB || speedType === SpeedType.CRAWL || speedType === SpeedType.SWIM)) {
    //   const walkSpeed = this.getBaseMonsterSpeed(battleMonster, SpeedType.WALK);
    //   speed = Math.floor(walkSpeed / 2);
    // }

    return speed;
  }

  getBaseSpeed(speedConfiguration: CreatureSpeedModifierCollectionItem): number {
    let speed = speedConfiguration.base;
    if (speedConfiguration.useHalfApplicable && speedConfiguration.useHalf) {
      speed = speedConfiguration.roundUp ? Math.ceil(speed / 2) : Math.floor(speed / 2);
    }
    return speed;
  }

  getSpeed(speedConfiguration: CreatureSpeedModifierCollectionItem, includeMisc = true, includeModifiers = true, includePenalties = true): number {
    let speed = this.getBaseSpeed(speedConfiguration);

    if (includeModifiers) {
      speed += speedConfiguration.modifiers;
    }
    if (includeMisc) {
      speed += speedConfiguration.misc;
    }
    if (includePenalties) {
      speed -= speedConfiguration.penalties;
      if (speedConfiguration.immobilized) {
        speed = 0;
      }

      if (speedConfiguration.halved) {
        speed = Math.floor(speed / 2);
      }
    }

    if (speed < 0) {
      speed = 0;
    }
    return speed;
  }

  getSpeedTooltip(speedConfiguration: CreatureSpeedModifierCollectionItem, includeMisc = true, includeModifiers = true, includePenalties = true): string {
    let parts = [];
    parts.push(speedConfiguration.baseTooltip);

    if (includeModifiers) {
      speedConfiguration.modifiersDisplay.forEach((modifier: LabelValue) => {
        parts.push(modifier.label + ': ' + modifier.value);
      });
    }
    if (includeMisc) {
      parts = parts.concat(speedConfiguration.miscDisplays);
    }
    if (includePenalties) {
      parts = parts.concat(speedConfiguration.penaltyDisplays);
    }
    return parts.join('\n');
  }

  getMaxHP(battleMonster: BattleMonster, collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true, includePenalties = true): number {
    let max = battleMonster.maxHp;

    if (includeMisc || includeModifiers) {
      const miscModifier = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.MAX_HP, collection);
      if (includeModifiers) {
        max += this.creatureService.getModifiers(miscModifier.modifiers, collection);
      }
      if (includeMisc) {
        max += battleMonster.creatureHealth.maxHpMod;
      }
    }

    if (includePenalties) {
      if (battleMonster.creatureHealth.exhaustionLevel >= 4) {
        max = Math.floor(max / 2);
      }
    }

    if (max <= 0) {
      max = 1;
    }

    return max;
  }

  getMaxHPTooltip(battleMonster: BattleMonster, collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true, includePenalties = true): string {
    let parts = [];
    parts.push(this.translate.instant('Labels.Max') + ' ' + battleMonster.maxHp);

    if (includeMisc || includeModifiers) {
      const miscModifier = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.MAX_HP, collection);
      if (includeModifiers) {
        const modifierTooltips: string[] = this.creatureService.getModifierTooltips(miscModifier.modifiers, collection);
        parts = parts.concat(modifierTooltips);
      }
      if (includeMisc && battleMonster.creatureHealth.maxHpMod !== 0) {
        parts.push(this.translate.instant('Labels.Misc') + ' ' + this.abilityService.convertScoreToString(battleMonster.creatureHealth.maxHpMod));
      }
    }

    if (includePenalties) {
      if (battleMonster.creatureHealth.exhaustionLevel >= 4) {
        parts.push(this.translate.instant('ExhaustionCondition', {
          condition: this.translate.instant('Halved'),
          level: 4
        }));
      }
    }
    return parts.join('\n');
  }
}
