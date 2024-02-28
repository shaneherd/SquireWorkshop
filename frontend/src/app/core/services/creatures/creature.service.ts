import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Creature} from '../../../shared/models/creatures/creature';
import {ActionType, DEFAULT_FILTER_TAG_VALUE, DEFAULT_FILTER_VALUE, SID} from '../../../constants';
import {ListObject} from '../../../shared/models/list-object';
import {CreatureType} from '../../../shared/models/creatures/creature-type.enum';
import {Filters} from '../../components/filters/filters';
import * as _ from 'lodash';
import {DamageTypeService} from '../attributes/damage-type.service';
import {ConditionService} from '../attributes/condition.service';
import {ListModifier} from '../../../shared/models/list-modifier';
import {AbilityService} from '../attributes/ability.service';
import {ArmorTypeService} from '../attributes/armor-type.service';
import {ItemService} from '../items/item.service';
import {LanguageService} from '../attributes/language.service';
import {SkillService} from '../attributes/skill.service';
import {ToolCategoryService} from '../attributes/tool-category.service';
import {WeaponTypeService} from '../attributes/weapon-type.service';
import {CharacteristicConfigurationCollection} from '../../../shared/models/characteristics/characteristic-configuration-collection';
import {CharacteristicService} from '../characteristics/characteristic.service';
import {ProficienciesService} from '../proficiency.service';
import {ListProficiency} from '../../../shared/models/list-proficiency';
import {ProficiencyCollection} from '../../../shared/models/proficiency-collection';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';
import {CreatureConfigurationCollection} from '../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureProficiencyCollection} from '../../../shared/models/creatures/configs/creature-proficiency-collection';
import {InheritedFrom} from '../../../shared/models/creatures/inherited-from';
import {CreatureListModifier} from '../../../shared/models/creatures/creature-list-modifier';
import {CreatureListProficiency} from '../../../shared/models/creatures/creature-list-proficiency';
import {CreatureListModifierValue} from '../../../shared/models/creatures/creature-list-modifier-value';
import {CreatureDamageModifierCollection} from '../../../shared/models/creatures/configs/creature-damage-modifier-collection';
import {CreatureDamageModifierCollectionItem} from '../../../shared/models/creatures/configs/creature-damage-modifier-collection-item';
import {DamageModifierType} from '../../../shared/models/characteristics/damage-modifier-type.enum';
import {CreatureConditionImmunityCollection} from '../../../shared/models/creatures/configs/creature-condition-immunity-collection';
import {CreatureConditionImmunityCollectionItem} from '../../../shared/models/creatures/configs/creature-condition-immunity-collection-item';
import {CreatureSensesCollection} from '../../../shared/models/creatures/configs/creature-senses-collection';
import {Sense} from '../../../shared/models/sense.enum';
import {CreatureSenseCollectionItem} from '../../../shared/models/creatures/configs/creature-sense-collection-item';
import {SenseConfigurationCollectionItem} from '../../../shared/models/sense-configuration-collection-item';
import {InheritedDamageModifierType} from '../../../shared/models/creatures/configs/inherited-damage-modifier-type';
import {DamageModifierCollectionItem} from '../../../shared/models/damage-modifier-collection-item';
import {ConditionImmunityConfigurationCollectionItem} from '../../../shared/models/condition-immunity-configuration-collection-item';
import {InheritedSense} from '../../../shared/models/creatures/configs/inherited-sense';
import {CreatureChoiceProficiency} from '../../../shared/models/creatures/configs/creature-choice-proficiency';
import {CharacteristicType} from '../../../shared/models/characteristics/characteristic-type.enum';
import {CharacterClassService} from '../characteristics/character-class.service';
import {CharacterClass} from '../../../shared/models/characteristics/character-class';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {Proficiency, ProficiencyListObject, ProficiencyType} from '../../../shared/models/proficiency';
import {ItemProficiency} from '../../../shared/models/items/item-proficiency';
import {ItemType} from '../../../shared/models/items/item-type.enum';
import {Item} from '../../../shared/models/items/item';
import {DamageModifier} from '../../../shared/models/characteristics/damage-modifier';
import {DamageType} from '../../../shared/models/attributes/damage-type';
import {SenseValue} from '../../../shared/models/sense-value';
import {Skill} from '../../../shared/models/attributes/skill';
import {CreatureSkillListProficiency} from '../../../shared/models/creatures/creature-skill-list-proficiency';
import {Ability} from '../../../shared/models/attributes/ability.model';
import {CreatureAbilityProficiency} from '../../../shared/models/creatures/configs/creature-ability-proficiency';
import {CreatureAbilityScore} from '../../../shared/models/creatures/creature-ability-score';
import {RollRequest} from '../../../shared/models/rolls/roll-request';
import {Roll} from '../../../shared/models/rolls/roll';
import {AttackDamageRollRequest} from '../../../shared/models/rolls/attack-damage-roll-request';
import {Condition} from '../../../shared/models/attributes/condition';
import {ActiveCondition} from '../../../shared/models/creatures/active-condition';
import {TranslateService} from '@ngx-translate/core';
import {CharacterNote} from '../../../shared/models/creatures/characters/character-note';
import {FeatureListObject} from '../../../shared/models/powers/feature-list-object';
import {SpellListObject} from '../../../shared/models/powers/spell-list-object';
import {Spellcasting} from '../../../shared/models/spellcasting';
import {AttackType} from '../../../shared/models/attack-type.enum';
import {SpellcastingAbility} from '../../../shared/models/creatures/spellcasting-ability';
import {CreatureSpellSlots} from '../../../shared/models/creatures/creature-spell-slots';
import {FilterType} from '../../components/filters/filter-type.enum';
import {SortType} from '../../components/sorts/sort-type.enum';
import {Sorts} from '../../components/sorts/sorts';
import {FilterSorts} from '../../../shared/models/filter-sorts';
import {CreatureSpell} from '../../../shared/models/creatures/creature-spell';
import {CreatureSpellList} from '../../../shared/models/creatures/creature-spell-list';
import {TagList} from '../../../shared/models/tag-list';
import {PowerTagList} from '../../../shared/models/powers/power-tag-list';
import {MappedSpellConfigurationCollection} from '../../../shared/models/mapped-spell-configuration-collection';
import {SpellConfigurationCollectionItem} from '../../../shared/models/spell-configuration-collection-item';
import {CreatureFeature} from '../../../shared/models/creatures/creature-feature';
import {CreaturePowerList} from '../../../shared/models/creatures/creature-power-list';
import {CreaturePower} from '../../../shared/models/creatures/creature-power';
import {ModifierConfiguration} from '../../../shared/models/modifier-configuration';
import {PowerModifierConfiguration} from '../../../shared/models/power-modifier-configuration';
import {AttributeService} from '../attributes/attribute.service';
import {CreatureCharacteristicConfigurationCollectionItem} from '../../../shared/models/creatures/configs/creature-characteristic-configuration-collection-item';
import {ModifierSubCategory} from '../../../shared/models/modifier-sub-category.enum';
import {CreatureHealth} from '../../../shared/models/creatures/creature-health';
import {CreatureConditions} from '../../../shared/models/creatures/creature-conditions';
import {ProficiencyList} from '../../../shared/models/proficiency-list';
import {ModifierService} from '../modifier.service';
import {PowerModifier} from '../../../shared/models/powers/power-modifier';
import {PowerType} from '../../../shared/models/powers/power-type.enum';
import {CreatureFilter} from '../../../shared/models/creatures/creature-filter';
import {FilterKey} from '../../components/filters/filter-key.enum';
import {CreatureSort} from '../../../shared/models/creatures/creature-sort';
import {CreatureSpellSlot} from '../../../shared/models/creatures/creature-spell-slot';
import {CharacterValidationItem, CharacterValidationResponse} from '../../../shared/models/creatures/characters/character-validation';
import {CreatureWealth} from '../../../shared/models/creatures/creature-wealth';
import {CreatureItem} from '../../../shared/models/creatures/creature-item';
import {CreatureInventory} from '../../../shared/models/creatures/creature-inventory';
import {Armor} from '../../../shared/models/items/armor';
import {CreatureItemState} from '../../../shared/models/creatures/creature-item-state.enum';
import {CreatureWealthAmount} from '../../../shared/models/creatures/creature-wealth-amount';
import {CostUnit} from '../../../shared/models/items/cost-unit';
import {CreatureAction} from '../../../shared/models/creatures/creature-action';
import {CreatureActions} from '../../../shared/models/creatures/creature-actions';
import {EquipmentSlotType} from '../../../shared/models/items/equipment-slot-type.enum';
import {CreatureAC} from '../../../shared/models/creatures/creature-ac';
import {AddItemResponse} from '../../../shared/models/items/add-item-response';
import {Tag} from '../../../shared/models/tag';
import {MagicalItem} from '../../../shared/models/items/magical-item';
import {MagicalItemType} from '../../../shared/models/items/magical-item-type.enum';
import {Power} from '../../../shared/models/powers/power';
import {CharacterLevel} from '../../../shared/models/character-level';
import {DamageConfigurationCollection} from '../../../shared/models/damage-configuration-collection';
import {DamageConfiguration} from '../../../shared/models/damage-configuration';
import {PowerService} from '../powers/power.service';
import {SpellService} from '../powers/spell.service';
import {CharacterLevelService} from '../character-level.service';
import {environment} from '../../../../environments/environment';
import {ListSource} from '../../../shared/models/list-source.enum';
import {PublishDetails} from '../../../shared/models/publish-details';
import {VersionInfo} from '../../../shared/models/version-info';
import {PublishRequest} from '../../../shared/models/publish-request';
import {LabelValue} from '../../../shared/models/label-value';
import {CharacterNoteOrder} from '../../../shared/models/creatures/characters/character-note-order';
import {CharacterNoteCategory} from '../../../shared/models/creatures/characters/character-note-category';
import {Weapon} from '../../../shared/models/items/weapon';
import {Spell} from '../../../shared/models/powers/spell';
import {Feature} from '../../../shared/models/powers/feature';
import {BattleMonster} from '../../../shared/models/creatures/battle-monsters/battle-monster';
import {PlayerCharacter} from '../../../shared/models/creatures/characters/player-character';
import {CreatureSpeedModifierCollectionItem} from '../../../shared/models/creatures/configs/creature-speed-modifier-collection-item';

@Injectable({
  providedIn: 'root'
})
export class CreatureService {
  constructor(
    private translate: TranslateService,
    private http: HttpClient,
    private characteristicService: CharacteristicService,
    private characterClassService: CharacterClassService,
    private proficienciesService: ProficienciesService,
    private damageTypeService: DamageTypeService,
    private conditionService: ConditionService,
    private abilityService: AbilityService,
    private armorTypeService: ArmorTypeService,
    private itemService: ItemService,
    private languageService: LanguageService,
    private skillService: SkillService,
    private toolCategoryService: ToolCategoryService,
    private weaponTypeService: WeaponTypeService,
    private attributeService: AttributeService,
    private modifierService: ModifierService,
    private powerService: PowerService,
    private spellService: SpellService,
    private characterLevelService: CharacterLevelService
  ) {
  }

  createCreature(creature: Creature): Promise<string> {
    const options = {
      responseType: 'text' as 'json'
    };
    return this.http.put<string>(environment.backendUrl + '/creatures', creature, options).toPromise();
  }

  getCreatures(): Promise<ListObject[]> {
    return this.http.get<ListObject[]>(environment.backendUrl + '/creatures').toPromise();
  }

  getCreaturesWithFilters(creatureType: CreatureType, listSource: ListSource, filters: Filters): Promise<ListObject[]> {
    if (filters == null || filters.filterValues.length === 0 || !filters.filtersApplied) {
      return this.getCreaturesByCreatureType(creatureType, listSource);
    }
    return this.http.post<ListObject[]>(`${environment.backendUrl}/creatures/type/${creatureType}?source=${listSource}`, filters).toPromise();
  }

  getCharacters(listSource: ListSource): Promise<ListObject[]> {
    return this.getCreaturesByCreatureType(CreatureType.CHARACTER, listSource);
  }

  getMonsters(listSource: ListSource): Promise<ListObject[]> {
    return this.getCreaturesByCreatureType(CreatureType.MONSTER, listSource);
  }

  getCreaturesByCreatureType(creatureType: CreatureType, listSource: ListSource): Promise<ListObject[]> {
    return this.http.get<ListObject[]>(`${environment.backendUrl}/creatures/type/${creatureType}?source=${listSource}`).toPromise();
  }

  getCreature(id: string): Promise<Creature> {
    return this.http.get<Creature>(environment.backendUrl + '/creatures/' + id).toPromise();
  }

  updateCreature(creature: Creature): Promise<any> {
    return this.http.post<any>(environment.backendUrl + '/creatures/' + creature.id, creature).toPromise();
  }

  deleteCreature(creature: Creature): Promise<any> {
    return this.http.delete<any>(environment.backendUrl + '/creatures/' + creature.id).toPromise();
  }

  duplicateCreature(creature: Creature, name: string): Promise<string> {
    const body = new URLSearchParams();
    body.set('name', name);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      responseType: 'text' as 'json'
    };
    return this.http.post<any>(environment.backendUrl + '/creatures/' + creature.id + '/duplicate', body.toString(), options).toPromise();
  }

  getPublishDetails(creature: Creature): Promise<PublishDetails> {
    return this.http.get<PublishDetails>(`${environment.backendUrl}/creatures/${creature.id}/published`).toPromise();
  }

  getVersionInfo(creatureId: string): Promise<VersionInfo> {
    return this.http.get<VersionInfo>(`${environment.backendUrl}/creatures/${creatureId}/version`).toPromise();
  }

  publishCreature(creature: Creature, publishRequest: PublishRequest): Promise<any> {
    return this.http.put<any>(`${environment.backendUrl}/creatures/${creature.id}`, publishRequest).toPromise();
  }

  addToMyStuff(creature: Creature): Promise<string> {
    const options = {
      responseType: 'text' as 'json'
    };
    return this.http.put<string>(`${environment.backendUrl}/creatures/${creature.id}/myStuff`, creature, options).toPromise();
  }

  updateAttribute(creature: Creature, proficiency: Proficiency): Promise<any> {
    return this.http.post<any>(environment.backendUrl + '/creatures/' + creature.id + '/modifier', proficiency).toPromise();
  }

  updateAttributes(creature: Creature, proficiencies: ProficiencyList): Promise<any> {
    return this.http.post<any>(environment.backendUrl + '/creatures/' + creature.id + '/modifiers', proficiencies).toPromise();
  }

  updateCreatureAbilityScore(creature: Creature, creatureAbilityScore: CreatureAbilityScore): Promise<any> {
    return this.http.post<any>(environment.backendUrl + '/creatures/' + creature.id + '/abilityScore', creatureAbilityScore).toPromise();
  }

  updateDamageModifier(creature: Creature, item: CreatureDamageModifierCollectionItem): Promise<any> {
    return this.http.post<any>(
      environment.backendUrl + '/creatures/' + creature.id + '/damageModifier/' + item.damageType.id + '/' + item.damageModifierType,
      {}).toPromise();
  }

  updateCreatureHealth(creature: Creature, creatureHealth: CreatureHealth): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/creatures/${creature.id}/health`, creatureHealth).toPromise();
  }

  updateCreatureAc(creature: Creature, creatureAC: CreatureAC): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/creatures/${creature.id}/ac`, creatureAC).toPromise();
  }

  /******************************************* Items ******************************************/

  updateCreatureWealth(creature: Creature, creatureWealth: CreatureWealth): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/creatures/${creature.id}/wealth`, creatureWealth).toPromise();
  }

  getCreatureWealthByCostUnit(creature: Creature, costUnit: CostUnit): CreatureWealthAmount {
    for (let i = 0; i < creature.creatureWealth.amounts.length; i++) {
      const amount = creature.creatureWealth.amounts[i];
      if (amount.costUnit.id === costUnit.id) {
        return amount;
      }
    }
    return null;
  }

  /******************************************* Filters ******************************************/

  updateFilters(creature: Creature, filterType: FilterType, filters: Filters): Promise<any> {
    return this.http.post<any>(environment.backendUrl + '/creatures/' + creature.id + '/filters/' + filterType, filters).toPromise().then(() => {
      for (let i = 0; i < creature.filters.length; i++) {
        const filter: CreatureFilter = creature.filters[i];
        if (filter.filterType === filterType) {
          filter.filterValues = filters.filterValues;
          break;
        }
      }
    });
  }

  /******************************************* Sorts ******************************************/

  updateSorts(creature: Creature, sortType: SortType, sorts: Sorts): Promise<any> {
    return this.http.post<any>(environment.backendUrl + '/creatures/' + creature.id + '/sorts/' + sortType, sorts).toPromise().then(() => {
      for (let i = 0; i < creature.sorts.length; i++) {
        const sort: CreatureSort = creature.sorts[i];
        if (sort.sortType === sortType) {
          sort.sortValues = sorts.sortValues;
          break;
        }
      }
    })
  }

  /******************************************* Notes ******************************************/

  addNote(creature: Creature, characterNote: CharacterNote): Promise<CharacterNote> {
    return this.http.put<CharacterNote>(environment.backendUrl + '/creatures/' + creature.id + '/notes', characterNote).toPromise();
  }

  updateNote(creature: Creature, characterNote: CharacterNote): Promise<CharacterNote> {
    return this.http.post<CharacterNote>(environment.backendUrl + '/creatures/' + creature.id + '/notes/' + characterNote.id, characterNote).toPromise();
  }

  deleteNote(creature: Creature, characterNote: CharacterNote): Promise<any> {
    return this.http.delete<any>(environment.backendUrl + '/creatures/' + creature.id + '/notes/' + characterNote.id).toPromise();
  }

  getNotes(creature: Creature, filterSorts: FilterSorts): Promise<CharacterNote[]> {
    return this.http.post<CharacterNote[]>(`${environment.backendUrl}/creatures/${creature.id}/notes`, filterSorts).toPromise();
  }

  updateNoteOrder(creature: Creature, notes: CharacterNote[]): Promise<any> {
    const order = new CharacterNoteOrder();
    order.notes = notes;
    return this.http.post<CharacterNote>(`${environment.backendUrl}/creatures/${creature.id}/notes/order`, order).toPromise();
  }

  updateNoteCategory(creature: Creature, characterNoteCategory: CharacterNoteCategory): Promise<any> {
    return this.http.post<CharacterNote>(`${environment.backendUrl}/creatures/${creature.id}/notes/categories/${characterNoteCategory.id}`, characterNoteCategory).toPromise();
  }

  /******************************************* Roll ******************************************/

  roll(creatureId: string, request: RollRequest): Promise<Roll> {
    return this.http.post<Roll>(`${environment.backendUrl}/creatures/${creatureId}/roll/standard`, request).toPromise();
  }

  rollStandard(creature: Creature, request: RollRequest): Promise<Roll> {
    return this.http.post<Roll>(environment.backendUrl + '/creatures/' + creature.id + '/roll/standard', request).toPromise();
  }

  rollAttackDamage(creature: Creature, attack: RollRequest, damage: RollRequest): Promise<Roll> {
    const request = new AttackDamageRollRequest(attack, damage);
    return this.http.post<Roll>(environment.backendUrl + '/creatures/' + creature.id + '/roll/attack', request).toPromise();
  }

  getRollLog(creature: Creature): Promise<Roll[]> {
    return this.http.get<Roll[]>(environment.backendUrl + '/creatures/' + creature.id + '/rolls').toPromise();
  }

  getRoll(creature: Creature, roll: Roll): Promise<Roll> {
    return this.http.get<Roll>(environment.backendUrl + '/creatures/' + creature.id + '/rolls/' + roll.id).toPromise();
  }

  archive(creature: Creature, roll: Roll): Promise<any> {
    return this.http.post<any>(environment.backendUrl + '/creatures/' + creature.id + '/rolls/' + roll.id + '/archive', {}).toPromise();
  }

  archiveAll(creature: Creature): Promise<any> {
    return this.http.post<any>(environment.backendUrl + '/creatures/' + creature.id + '/rolls/archive', {}).toPromise();
  }

  /******************************************* Conditions ******************************************/

  updateCondition(creatureId: string, condition: ListObject, active: boolean): Promise<ActiveCondition[]> {
    return this.http.post<ActiveCondition[]>(
      environment.backendUrl + '/creatures/' + creatureId + '/activeConditions/' + condition.id + '?active=' + active,
      {}).toPromise();
  }

  updateConditionImmunity(creatureId: string, condition: ListObject, immune: boolean): Promise<ListObject[]> {
    return this.http.post<ListObject[]>(
      environment.backendUrl + '/creatures/' + creatureId + '/conditions/' + condition.id + '?immune=' + immune,
      {}).toPromise();
  }

  updateConditions(creatureId: string, conditions: CreatureConditions): Promise<ActiveCondition[]> {
    return this.http.post<ActiveCondition[]>(
      environment.backendUrl + '/creatures/' + creatureId + '/activeConditions/',
      conditions).toPromise();
  }

  getActiveImmobilizingConditions(creature: Creature): ActiveCondition[] {
    const conditions: number[] = [
      SID.CONDITIONS.GRAPPLED,
      SID.CONDITIONS.PARALYZED,
      SID.CONDITIONS.PETRIFIED,
      SID.CONDITIONS.RESTRAINED,
      SID.CONDITIONS.STUNNED,
      SID.CONDITIONS.UNCONSCIOUS
    ];
    return this.getActiveConditionsBySID(conditions, creature);
  }

  hasModifiedAttackRollDisadvantage(creature: Creature, abilitySID: number, collection: CreatureConfigurationCollection): boolean {
    if (creature.creatureHealth.exhaustionLevel >= 3) {
      return true;
    }
    if ((abilitySID === SID.ABILITIES.STRENGTH || abilitySID === SID.ABILITIES.DEXTERITY) &&
      this.isWearingNonProficientArmor(creature, collection)) {
      return true;
    }
    return this.getActiveAttackRollDisadvantageConditions(creature).length > 0;
  }

  getModifiedAttackRollDisadvantageTooltip(creature: Creature, abilitySID: number, collection: CreatureConfigurationCollection): string {
    const parts = [];

    if (creature.creatureHealth.exhaustionLevel >= 3) {
      parts.push(this.translate.instant('ExhaustionLevel', {level: 3}))
    }

    if ((abilitySID === SID.ABILITIES.STRENGTH || abilitySID === SID.ABILITIES.DEXTERITY) &&
      this.isWearingNonProficientArmor(creature, collection)) {
      parts.push(this.translate.instant('WearingNonProficientArmor'));
    }

    const conditions = this.getActiveAttackRollDisadvantageConditions(creature);
    conditions.forEach((activeCondition: ActiveCondition) => {
      parts.push(activeCondition.condition.name);
    });

    return parts.join('\n');
  }

  /**************************** Armor Items **********************************/

  getArmorItems(creature: Creature): CreatureItem[] {
    const armors: CreatureItem[] = [];
    creature.items.forEach((creatureItem: CreatureItem) => {
      if (creatureItem.itemType === ItemType.ARMOR) {
        armors.push(creatureItem);
      } else if (creatureItem.itemType === ItemType.MAGICAL_ITEM) {
        const magicalItem = creatureItem.item as MagicalItem;
        if (magicalItem.magicalItemType === MagicalItemType.ARMOR) {
          armors.push(creatureItem);
        }
      }
    });
    return armors;
  }

  getHeldItems(creature: Creature): CreatureItem[] {
    const items: CreatureItem[] = [];
    creature.items.forEach((creatureItem: CreatureItem) => {
      if (creatureItem.equipmentSlot != null && creatureItem.equipmentSlot.equipmentSlotType === EquipmentSlotType.HAND) {
        items.push(creatureItem);
      }
    });
    return items;
  }

  wearingBodyArmor(creature: Creature): boolean {
    const armors: CreatureItem[] = this.getEquippedArmorItems(creature);
    for (let i = 0; i < armors.length; i++) {
      const creatureItem: CreatureItem = armors[i];
      if (creatureItem.itemType === ItemType.ARMOR) {
        const armor = creatureItem.item as Armor;
        if (armor.slot === EquipmentSlotType.BODY) {
          return true;
        }
      } else if (creatureItem.itemType === ItemType.MAGICAL_ITEM) {
        const magicalItem = creatureItem.item as MagicalItem;
        if (magicalItem.magicalItemType === MagicalItemType.ARMOR) {
          if (creatureItem.magicalItem != null && creatureItem.magicalItem.itemType === ItemType.ARMOR) {
            const baseArmor = creatureItem.magicalItem as Armor;
            if (baseArmor.slot === EquipmentSlotType.BODY) {
              return true;
            }
          } else if (magicalItem.slot === EquipmentSlotType.BODY) {
            return true;
          }
        }
      }
    }
    return false;
  }

  calculateEquippedArmor(creature: Creature, collection: CreatureConfigurationCollection): number {
    let ac = 0;
    const armors = this.getEquippedArmorItems(creature);
    armors.forEach((armorItem: CreatureItem) => {
      if (armorItem.itemType === ItemType.ARMOR) {
        const armor = armorItem.item as Armor;
        ac += this.getArmorAC(armor, armorItem, collection);
      } else if (armorItem.itemType === ItemType.MAGICAL_ITEM) {
        let baseArmor: Armor = null;
        if (armorItem.magicalItem != null && armorItem.magicalItem.itemType === ItemType.ARMOR) {
          baseArmor = armorItem.magicalItem as Armor;
        }
        ac += this.getArmorAC(baseArmor, armorItem, collection);
      }
    });
    return ac;
  }

  getEquippedArmorTooltip(creature: Creature, collection: CreatureConfigurationCollection): LabelValue[] {
    const parts: LabelValue[] = [];
    const armors = this.getEquippedArmorItems(creature);
    armors.forEach((armorItem: CreatureItem) => {
      let ac = 0;
      let name = '';
      if (armorItem.itemType === ItemType.ARMOR) {
        const armor = armorItem.item as Armor;
        name = armor.name;
        ac = this.getArmorAC(armor, armorItem, collection);
      } else if (armorItem.itemType === ItemType.MAGICAL_ITEM) {
        let baseArmor: Armor = null;
        name = armorItem.item.name;
        if (armorItem.magicalItem != null && armorItem.magicalItem.itemType === ItemType.ARMOR) {
          baseArmor = armorItem.magicalItem as Armor;
          name += ' (' + baseArmor.name + ')';
        }
        ac = this.getArmorAC(baseArmor, armorItem, collection);
      }
      parts.push(new LabelValue(name, ac.toString(10)));
    });
    return parts;
  }

  getEquippedArmorItems(creature: Creature): CreatureItem[] {
    const armors = this.getArmorItems(creature);
    const equippedArmors: CreatureItem[] = [];
    for (let i = 0; i < armors.length; i++) {
      const armor = armors[i];
      if (armor.creatureItemState === CreatureItemState.EQUIPPED && armor.equipmentSlot != null && armor.equipmentSlot.id !== '0') {
        equippedArmors.push(armor);
      }
    }
    this.sortEquippedItems(equippedArmors);
    return equippedArmors;
  }

  private sortEquippedItems(items: CreatureItem[]): void {
    items.sort((left: CreatureItem, right: CreatureItem) => {
      const leftSlot = left.equipmentSlot.equipmentSlotType;
      const rightSlot = right.equipmentSlot.equipmentSlotType;
      if (leftSlot === EquipmentSlotType.BODY && rightSlot !== EquipmentSlotType.BODY) {
        return -1;
      } else if (rightSlot === EquipmentSlotType.BODY && leftSlot !== EquipmentSlotType.BODY) {
        return 1;
      } else {
        return leftSlot.toString().localeCompare(rightSlot.toString());
      }
    });
  }

  isWearingNonProficientArmor(creature: Creature, collection: CreatureConfigurationCollection): boolean {
    const armors = this.getEquippedArmorItems(creature);
    for (let i = 0; i < armors.length; i++) {
      const armor = armors[i];
      if (!this.isItemProficient(armor, collection)) {
        return true;
      }
    }
    return false;
  }

  isWearingArmorWithStealthDisadvantage(creature: Creature): boolean {
    const armors = this.getEquippedArmorItems(creature);
    for (let i = 0; i < armors.length; i++) {
      const creatureItem: CreatureItem = armors[i];
      if (creatureItem.itemType === ItemType.ARMOR) {
        const armor = creatureItem.item as Armor;
        if (armor.stealthDisadvantage) {
          return true;
        }
      } else if (creatureItem.itemType === ItemType.MAGICAL_ITEM) {
        const magicalItem = creatureItem.item as MagicalItem;
        if (magicalItem.magicalItemType === MagicalItemType.ARMOR && creatureItem.magicalItem != null && creatureItem.magicalItem.itemType === ItemType.ARMOR) {
          const baseArmor = creatureItem.magicalItem as Armor;
          if (baseArmor.stealthDisadvantage) {
            return true;
          }
        }
      }
    }
    return false;
  }

  meetsEquippedArmorStrRequirements(creature: Creature, collection: CreatureConfigurationCollection): boolean {
    const armors = this.getEquippedArmorItems(creature);
    for (let i = 0; i < armors.length; i++) {
      const armor = armors[i].item as Armor;
      const ability = this.getAbilityBySid(SID.ABILITIES.STRENGTH, collection);
      const score = this.getAbilityScore(ability, collection);
      if (score < armor.minStrength) {
        return false;
      }
    }
    return true;
  }

  getArmorAC(armor: Armor, creatureItem: CreatureItem, collection: CreatureConfigurationCollection): number {
    let ac = 0;
    if (armor != null) {
      ac = armor.ac;
      if (armor.abilityModifier != null && armor.abilityModifier.id !== '0') {
        const ability = this.getAbility(armor.abilityModifier.id, collection);
        let abilityModifier = this.getAbilityModifier(ability, collection);
        if (armor.maxAbilityModifier < abilityModifier && armor.maxAbilityModifier > 0) {
          abilityModifier = armor.maxAbilityModifier;
        }
        ac += abilityModifier;
      }
    }
    if (creatureItem != null && creatureItem.itemType === ItemType.MAGICAL_ITEM) {
      const magicalItem = creatureItem.item as MagicalItem;
      if (!magicalItem.requiresAttunement || creatureItem.attuned) {
        ac += magicalItem.acMod;
      }
    }
    return ac;
  }

  getArmorACTooltip(armor: Armor, creatureItem: CreatureItem, collection: CreatureConfigurationCollection): string {
    const parts: string[] = [];
    parts.push(this.translate.instant('Labels.Base') + ' ' + armor.ac);
    if (armor.abilityModifier != null && armor.abilityModifier.id !== '0') {
      const ability = this.getAbility(armor.abilityModifier.id, collection);
      const abilityModifier = this.getAbilityModifier(ability, collection);
      if (armor.maxAbilityModifier < abilityModifier && armor.maxAbilityModifier > 0) {
        parts.push(armor.abilityModifier.name + ': ' + this.abilityService.convertScoreToString(abilityModifier) + ' (' + this.translate.instant('Max') + ' ' + armor.maxAbilityModifier + ')');
      } else if (abilityModifier !== 0) {
        parts.push(armor.abilityModifier.name + ': ' + this.abilityService.convertScoreToString(abilityModifier));
      }
    }
    if (creatureItem != null && creatureItem.itemType === ItemType.MAGICAL_ITEM) {
      const magicalItem = creatureItem.item as MagicalItem;
      if (magicalItem.acMod !== 0) {
        parts.push(this.translate.instant('Labels.Misc') + this.abilityService.convertScoreToString(magicalItem.acMod));
      }
    }
    return parts.join('\n');
  }

  updateSpeeds(creature: Creature, speedConfigurations: CreatureSpeedModifierCollectionItem[]): Promise<any> {
    const proficiencies: Proficiency[] = [];
    speedConfigurations.forEach((speedConfiguration: CreatureSpeedModifierCollectionItem) => {
      this.updateProficiencyModifier(speedConfiguration.misc, speedConfiguration.creatureListProficiency, null);
      proficiencies.push(speedConfiguration.creatureListProficiency.proficiency);
    });

    const proficiencyList = new ProficiencyList();
    proficiencyList.proficiencies = proficiencies;
    return this.updateAttributes(creature, proficiencyList);
  }

  hasModifiedAttackRollAdvantage(creature: Creature): boolean {
    return this.getActiveAttackRollAdvantageConditions(creature).length > 0;
  }

  getModifiedAttackRollAdvantageTooltip(creature: Creature): string {
    const parts = [];

    const conditions = this.getActiveAttackRollAdvantageConditions(creature);
    conditions.forEach((activeCondition: ActiveCondition) => {
      parts.push(activeCondition.condition.name);
    });

    return parts.join('\n');
  }

  getActiveAttackRollDisadvantageConditions(creature: Creature): ActiveCondition[] {
    const conditions: number[] = [
      SID.CONDITIONS.BLINDED,
      SID.CONDITIONS.PRONE,
      SID.CONDITIONS.RESTRAINED,
      SID.CONDITIONS.POISONED
    ];
    return this.getActiveConditionsBySID(conditions, creature);
  }

  getActiveAttackRollAdvantageConditions(creature: Creature): ActiveCondition[] {
    const conditions: number[] = [
      SID.CONDITIONS.INVISIBLE
    ];
    return this.getActiveConditionsBySID(conditions, creature);
  }

  hasModifiedAbilityCheckDisadvantage(creature: Creature, abilitySID: number, skillSID: number, collection: CreatureConfigurationCollection): boolean {
    if (creature.creatureHealth.exhaustionLevel >= 1) {
      return true;
    }
    if ((abilitySID === SID.ABILITIES.STRENGTH || abilitySID === SID.ABILITIES.DEXTERITY) &&
      this.isWearingNonProficientArmor(creature, collection)) {
      return true;
    }
    if (skillSID === SID.SKILLS.STEALTH && this.isWearingArmorWithStealthDisadvantage(creature)) {
      return true;
    }
    return this.getActiveAbilityCheckDisadvantageConditions(creature).length > 0;
  }

  getModifiedAbilityCheckDisadvantageTooltip(creature: Creature, abilitySID: number, skillSID: number, collection: CreatureConfigurationCollection): string {
    const parts = [];
    if (creature.creatureHealth.exhaustionLevel >= 1) {
      parts.push(this.translate.instant('ExhaustionLevel', {level: 1}))
    }
    if ((abilitySID === SID.ABILITIES.STRENGTH || abilitySID === SID.ABILITIES.DEXTERITY) &&
      this.isWearingNonProficientArmor(creature, collection)) {
      parts.push(this.translate.instant('WearingNonProficientArmor'));
    }
    if (skillSID === SID.SKILLS.STEALTH && this.isWearingArmorWithStealthDisadvantage(creature)) {
      parts.push(this.translate.instant('Armor'));
    }
    const conditions = this.getActiveAbilityCheckDisadvantageConditions(creature);
    conditions.forEach((activeCondition: ActiveCondition) => {
      parts.push(activeCondition.condition.name);
    });
    return parts.join('\n');
  }

  getActiveAbilityCheckDisadvantageConditions(creature: Creature): ActiveCondition[] {
    const conditions: number[] = [
      SID.CONDITIONS.POISONED,
      SID.CONDITIONS.FRIGHTENED
    ];
    return this.getActiveConditionsBySID(conditions, creature);
  }

  hasModifiedSaveDisadvantage(creature: Creature, abilitySID: number, collection: CreatureConfigurationCollection): boolean {
    if (creature.creatureHealth.exhaustionLevel >= 3) {
      return true;
    }
    if ((abilitySID === SID.ABILITIES.STRENGTH || abilitySID === SID.ABILITIES.DEXTERITY) &&
      this.isWearingNonProficientArmor(creature, collection)) {
      return true;
    }
    return abilitySID === SID.ABILITIES.DEXTERITY &&
      this.getActiveSaveDisadvantageConditions(creature).length > 0;
  }

  getModifiedSaveDisadvantageTooltip(creature: Creature, abilitySID: number, collection: CreatureConfigurationCollection): string {
    const parts = [];
    if (creature.creatureHealth.exhaustionLevel >= 3) {
      parts.push(this.translate.instant('ExhaustionLevel', {level: 3}));
    }
    if ((abilitySID === SID.ABILITIES.STRENGTH || abilitySID === SID.ABILITIES.DEXTERITY) &&
      this.isWearingNonProficientArmor(creature, collection)) {
      parts.push(this.translate.instant('WearingNonProficientArmor'));
    }
    if (abilitySID === SID.ABILITIES.DEXTERITY) {
      const conditions = this.getActiveSaveDisadvantageConditions(creature);
      conditions.forEach((activeCondition: ActiveCondition) => {
        parts.push(activeCondition.condition.name);
      });
    }
    return parts.join('\n');
  }

  getActiveSaveDisadvantageConditions(creature: Creature): ActiveCondition[] {
    const conditions: number[] = [
      SID.CONDITIONS.RESTRAINED
    ];
    return this.getActiveConditionsBySID(conditions, creature);
  }

  hasModifiedSaveAutoFail(creature: Creature, abilitySID: number): boolean {
    return (abilitySID === SID.ABILITIES.STRENGTH || abilitySID === SID.ABILITIES.DEXTERITY) &&
      this.getActiveSaveAutoFailConditions(creature).length > 0;
  }

  getModifiedSaveAutoFailTooltip(creature: Creature, abilitySID: number): string {
    const parts = [];
    if (abilitySID === SID.ABILITIES.STRENGTH || abilitySID === SID.ABILITIES.DEXTERITY) {
      const conditions = this.getActiveSaveAutoFailConditions(creature);
      conditions.forEach((activeCondition: ActiveCondition) => {
        parts.push(activeCondition.condition.name);
      });
    }
    return parts.join('\n');
  }

  getActiveSaveAutoFailConditions(creature: Creature): ActiveCondition[] {
    const conditions: number[] = [
      SID.CONDITIONS.PARALYZED,
      SID.CONDITIONS.PETRIFIED,
      SID.CONDITIONS.STUNNED,
      SID.CONDITIONS.UNCONSCIOUS
    ];
    return this.getActiveConditionsBySID(conditions, creature);
  }

  private getActiveConditionsBySID(conditions: number[], creature: Creature): ActiveCondition[] {
    const activeConditions: ActiveCondition[] = [];
    conditions.forEach((sid: number) => {
      const immune = this.isConditionImmuneBySID(sid, creature);
      const index = this.getActiveConditionIndexBySID(sid, creature);
      if (!immune && index > -1) {
        activeConditions.push(creature.activeConditions[index]);
      }
    });
    return activeConditions;
  }

  isConditionActive(condition: ListObject, creature: Creature): boolean {
    return !this.isConditionImmune(condition, creature) && this.getActiveConditionIndex(condition, creature) > -1;
  }

  isProne(creature: Creature): boolean {
    return this.isConditionActiveBySID(SID.CONDITIONS.PRONE, creature);
  }

  isConditionActiveBySID(sid: number, creature: Creature): boolean {
    return !this.isConditionImmuneBySID(sid, creature) && this.getActiveConditionIndexBySID(sid, creature) > -1;
  }

  isConditionInheritedActive(condition: Condition, creature: Creature): boolean {
    if (this.isConditionImmune(condition, creature)) {
      return false;
    }
    for (let i = 0; i < creature.activeConditions.length; i++) {
      const activeCondition = creature.activeConditions[i];
      if (activeCondition.condition.id === condition.id) {
        if (activeCondition.inherited) {
          return true;
        }
      }
    }
    return false;
  }

  private getActiveCondition(condition: ListObject, creature: Creature): ActiveCondition {
    const index = this.getActiveConditionIndex(condition, creature);
    if (index > -1) {
      return creature.activeConditions[index];
    }
    return null;
  }

  getActiveConditionIndex(condition: ListObject, creature: Creature): number {
    if (condition == null) {
      return -1;
    }
    for (let i = 0; i < creature.activeConditions.length; i++) {
      if (creature.activeConditions[i].condition.id === condition.id) {
        return i;
      }
    }
    return -1;
  }

  getActiveConditionIndexBySID(sid: number, creature: Creature): number {
    for (let i = 0; i < creature.activeConditions.length; i++) {
      if (creature.activeConditions[i].condition.sid === sid) {
        return i;
      }
    }
    return -1;
  }

  isConditionImmune(condition: ListObject, creature: Creature): boolean {
    if (condition == null) {
      return false;
    }
    return this.isConditionImmuneBySID(condition.sid, creature);
  }

  isConditionImmuneBySID(sid: number, creature: Creature): boolean {
    for (let i = 0; i < creature.conditionImmunities.length; i++) {
      if (creature.conditionImmunities[i].sid === sid) {
        return true;
      }
    }
    return false;
  }

  /******************************************* Items ******************************************/

  addItems(creature: Creature, creatureInventory: CreatureInventory): Promise<AddItemResponse[]> {
    return this.http.put<AddItemResponse[]>(`${environment.backendUrl}/creatures/${creature.id}/items`, creatureInventory).toPromise();
  }

  getItems(creature: Creature): Promise<CreatureItem[]> {
    return this.http.get<CreatureItem[]>(`${environment.backendUrl}/creatures/${creature.id}/items`).toPromise();
  }

  getItemWeight(creatureItem: CreatureItem, includeNestedItemWeight: boolean): number {
    let weight = creatureItem.weight * creatureItem.quantity;
    if (weight === 0 && creatureItem.item.itemType === ItemType.MAGICAL_ITEM && creatureItem.magicalItem != null) {
      weight = creatureItem.magicalItem.weight * creatureItem.quantity;
    }
    if (includeNestedItemWeight && !creatureItem.ignoreWeightOfItems) {
      weight += this.getNestedItemWeight(creatureItem) * creatureItem.quantity;
    }
    return Math.round(weight * 1000) / 1000.0;
  }

  getNestedItemWeight(creatureItem: CreatureItem): number {
    let weight = 0;
    if (creatureItem != null && creatureItem.items != null) {
      creatureItem.items.forEach((item: CreatureItem) => {
        weight += this.getItemWeight(item, true);
      });
    }
    return Math.round(weight * 1000) / 1000.0;
  }

  /******************************************* Powers ******************************************/

  getFeatures(creature: Creature, filterSorts: FilterSorts): Promise<CreatureFeature[]> {
    return this.http.post<CreatureFeature[]>(`${environment.backendUrl}/creatures/${creature.id}/features`, filterSorts).toPromise();
  }

  getFeaturesDetailed(creature: Creature): Promise<Feature[]> {
    return this.http.get<Feature[]>(`${environment.backendUrl}/creatures/${creature.id}/features/detailed`).toPromise();
  }

  getMissingFeatures(creature: Creature, filters: Filters): Promise<FeatureListObject[]> {
    return this.http.post<FeatureListObject[]>(environment.backendUrl + '/creatures/' + creature.id + '/features/missing', filters).toPromise();
  }

  getSpells(creature: Creature, filterSorts: FilterSorts): Promise<CreatureSpell[]> {
    return this.http.post<CreatureSpell[]>(`${environment.backendUrl}/creatures/${creature.id}/spells`, filterSorts).toPromise();
  }

  getSpellsDetailed(creature: Creature): Promise<Spell[]> {
    return this.http.get<Spell[]>(`${environment.backendUrl}/creatures/${creature.id}/spells/detailed`).toPromise();
  }

  getMissingSpells(creature: Creature, characteristicId: string, filters: Filters): Promise<SpellListObject[]> {
    return this.http.post<SpellListObject[]>(`${environment.backendUrl}/creatures/${creature.id}/spells/missing?characteristicId=${characteristicId}`, filters).toPromise();
  }

  addPowers(creature: Creature, powers: CreaturePowerList): Promise<CreaturePower[]> {
    return this.http.put<CreaturePower[]>(`${environment.backendUrl}/creatures/${creature.id}/powers`, powers).toPromise();
  }

  removePower(creature: Creature, creaturePower: CreaturePower): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/creatures/${creature.id}/powers/${creaturePower.id}`).toPromise();
  }

  prepareSpell(creature: Creature, creatureSpellList: CreatureSpellList): Promise<any> {
    return this.updateCreatureSpells(creature, creatureSpellList);
  }

  updateCreatureSpells(creature: Creature, creatureSpellList: CreatureSpellList): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/creatures/${creature.id}/spells/update`, creatureSpellList).toPromise()
  }

  loseConcentration(creature: Creature, concentratingSpell: CreatureSpell): Promise<any> {
    const creatureSpellList: CreatureSpellList = new CreatureSpellList();
    const creatureSpell = _.cloneDeep(concentratingSpell);
    creatureSpell.concentrating = false;
    creatureSpell.active = false;
    creatureSpell.activeLevel = 0;
    creatureSpellList.creatureSpells.push(creatureSpell);

    return this.updateCreatureSpells(creature, creatureSpellList).then(() => {
      concentratingSpell.concentrating = false;
      concentratingSpell.active = false;
      concentratingSpell.activeLevel = 0;
    });
  }

  getConcentratingSpell(creature: Creature): CreatureSpell {
    for (let i = 0; i < creature.creatureSpellCasting.spells.length; i++) {
      const creatureSpell = creature.creatureSpellCasting.spells[i];
      if (creatureSpell.concentrating) {
        return creatureSpell;
      }
    }
    for (let i = 0; i < creature.innateSpellCasting.spells.length; i++) {
      const creatureSpell = creature.innateSpellCasting.spells[i];
      if (creatureSpell.concentrating) {
        return creatureSpell;
      }
    }
    return null;
  }

  usePower(creature: Creature, creaturePower: CreaturePower): Promise<any> {
    const creaturePowerList: CreaturePowerList = new CreaturePowerList();
    const power = new CreaturePower();
    power.id = creaturePower.id;
    power.powerId = creaturePower.powerId;
    power.usesRemaining = creaturePower.usesRemaining - 1;
    if (power.usesRemaining < 0) {
      power.usesRemaining = 0;
      return Promise.resolve(null);
    }
    creaturePowerList.creaturePowers.push(power);

    if (creaturePower.powerType === PowerType.MONSTER_ACTION || creaturePower.powerType === PowerType.MONSTER_FEATURE) {
      return this.updateBattleMonsterPowers(creature, creaturePowerList).then((response: any) => {
        creaturePower.usesRemaining = power.usesRemaining;
        return response;
      });
    } else {
      return this.updateCreaturePowers(creature, creaturePowerList).then((response: any) => {
        creaturePower.usesRemaining = power.usesRemaining;
        return response;
      });
    }
  }

  updateCreaturePowers(creature: Creature, creaturePowerList: CreaturePowerList): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/creatures/${creature.id}/powers/update`, creaturePowerList).toPromise()
  }

  updateBattleMonsterPowers(creature: Creature, creaturePowerList: CreaturePowerList): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/creatures/${creature.id}/battleMonsterPowers/update`, creaturePowerList).toPromise()
  }

  getTags(creature: Creature, powerType: PowerType): Promise<Tag[]> {
    return this.http.get<Tag[]>(`${environment.backendUrl}/creatures/${creature.id}/tags?powerType=${powerType}`).toPromise()
  }

  updateTags(creature: Creature, tagList: TagList): Promise<Tag[]> {
    return this.http.post<Tag[]>(`${environment.backendUrl}/creatures/${creature.id}/tags`, tagList).toPromise()
  }

  updatePowerTags(creature: Creature, powerTagList: PowerTagList): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/creatures/${creature.id}/powers/tags`, powerTagList).toPromise()
  }

  updateSpellcastingAbility(creature: Creature, abilityId: string, innate: boolean = false): Promise<any> {
    const spellcastingAbility = new SpellcastingAbility();
    spellcastingAbility.ability = abilityId;

    return this.http.post<any>(`${environment.backendUrl}/creatures/${creature.id}/spellcastingAbility?innate=${innate}`, spellcastingAbility).toPromise().then((response: any) => {
      if (innate) {
        creature.innateSpellCasting.spellcastingAbility = abilityId;
      } else {
        creature.creatureSpellCasting.spellcastingAbility = abilityId;
      }
      return response;
    });
  }

  updateSpellcasting(creature: Creature, spellcasting: Spellcasting, innate: boolean = false): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/creatures/${creature.id}/spellCasting?innate=${innate}`, spellcasting).toPromise().then((response: any) => {
      if (spellcasting.attackType === AttackType.ATTACK) {
        if (innate) {
          creature.innateSpellCasting.spellcastingAttack = spellcasting;
        } else {
          creature.creatureSpellCasting.spellcastingAttack = spellcasting;
        }
      } else if (spellcasting.attackType === AttackType.SAVE) {
        if (innate) {
          creature.innateSpellCasting.spellcastingSave = spellcasting;
        } else {
          creature.creatureSpellCasting.spellcastingSave = spellcasting;
        }
      }
      return response;
    });
  }

  resetInnateSpellUses(spells: CreatureSpell[], creature: Creature): Promise<any> {
    const creaturePowerList: CreaturePowerList = new CreaturePowerList();
    spells.forEach((creatureSpell: CreatureSpell) => {
      const power = new CreaturePower();
      power.id = creatureSpell.id;
      power.powerId = creatureSpell.powerId;
      power.usesRemaining = creatureSpell.innateMaxUses;
      power.active = creatureSpell.active;
      creaturePowerList.creaturePowers.push(power);
    });

    return this.updateCreaturePowers(creature, creaturePowerList).then((response: any) => {
      spells.forEach((creatureSpell: CreatureSpell) => {
        creatureSpell.usesRemaining = creatureSpell.innateMaxUses;
      });

      return response;
    });
  }

  updateCharacteristicSpellcasting(creature: Creature, characteristicId: string, characteristicSpellcasting: Spellcasting): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/creatures/${creature.id}/spellCasting/${characteristicId}`, characteristicSpellcasting).toPromise();
  }

  getSpellcastingAbility(creature: Creature, collection: CreatureConfigurationCollection): CreatureAbilityProficiency {
    if (creature == null || collection == null) {
      return null;
    }

    if (creature.creatureSpellCasting == null) {
      return null;
    }
    const abilityId = creature.creatureSpellCasting.spellcastingAbility;
    return this.getAbility(abilityId, collection);
  }

  getInnateSpellcastingAbility(creature: Creature, collection: CreatureConfigurationCollection): CreatureAbilityProficiency {
    if (creature == null || collection == null) {
      return null;
    }

    if (creature.innateSpellCasting == null) {
      return null;
    }
    const abilityId = creature.innateSpellCasting.spellcastingAbility;
    return this.getAbility(abilityId, collection);
  }

  getPowerDamages(power: Power, creature: Creature, characterLevel: CharacterLevel,
                  collection: CreatureConfigurationCollection, attackModifier: PowerModifier,
                  saveModifier: PowerModifier): DamageConfigurationCollection {
    if (power == null) {
      return null;
    }
    const configuration = this.powerService.initializeDamageConfigurations(power);
    if (creature == null || collection == null) {
      return configuration;
    }

    if (creature.creatureType === CreatureType.CHARACTER && characterLevel == null) {
      return configuration;
    }
    if (creature.creatureType === CreatureType.MONSTER && power.type === 'Spell') {
      const battleMonster = creature as BattleMonster;
      if (battleMonster.monster != null) {
        const casterLevel = battleMonster.monster.spellcasterLevel;
        characterLevel = this.characterLevelService.getLevelByName(casterLevel.name);
      }
    }

    if (power.type === 'Spell') {
      if (configuration.attackType === AttackType.ATTACK) {
        const powerModifier = this.getModifiers(attackModifier.modifiers, collection);
        const modifierTooltips = this.getModifierTooltips(attackModifier.modifiers, collection);
        const spellAttackModifier = this.spellService.getSpellAttackModifier(attackModifier, powerModifier, creature);
        configuration.attackMod += spellAttackModifier;
        configuration.attackModTooltip = this.spellService.getSpellAttackModifierTooltip(attackModifier, modifierTooltips, creature);
      } else if (configuration.attackType === AttackType.SAVE) {
        const powerModifier = this.getModifiers(saveModifier.modifiers, collection);
        const modifierTooltips = this.getModifierTooltips(saveModifier.modifiers, collection);
        const spellSaveModifier = this.spellService.getSpellSaveDC(saveModifier, powerModifier);
        configuration.attackMod += spellSaveModifier;
        configuration.attackModTooltip = this.spellService.getSpellSaveDCTooltip(saveModifier, modifierTooltips);
      }
    } else {
      let resurrectionPenalty = 0;
      const parts: string[] = [];
      const misc = configuration.attackMod;
      if (configuration.attackType === AttackType.ATTACK) {
        resurrectionPenalty = creature.creatureHealth.resurrectionPenalty;
        configuration.attackMod -= resurrectionPenalty;
        if (configuration.attackAbilityMod !== '0') {
          const ability = this.getAbility(configuration.attackAbilityMod, collection);
          const abilityModifier = this.getAbilityModifier(ability, collection);
          configuration.attackMod += abilityModifier;
          configuration.attackAbilityMod = '0';
          parts.push(ability.ability.abbr + ': ' + this.abilityService.convertScoreToString(abilityModifier));
        }
      } else if (configuration.attackType === AttackType.SAVE) {
        if (configuration.saveProficiencyModifier) {
          const proficiencyModifier = this.getProfModifier(collection);
          configuration.attackMod += proficiencyModifier;
          configuration.saveProficiencyModifier = false;
          parts.push(this.translate.instant('Labels.Prof') + ' ' + this.abilityService.convertScoreToString(proficiencyModifier));
        }
        if (configuration.saveAbilityModifier !== '0') {
          const ability = this.getAbility(configuration.saveAbilityModifier, collection);
          const abilityModifier = this.getAbilityModifier(ability, collection);
          configuration.attackMod += abilityModifier;
          configuration.saveAbilityModifier = '0';
          parts.push(ability.ability.abbr + ': ' + this.abilityService.convertScoreToString(abilityModifier));
        }
      }

      if (misc !== 0) {
        parts.push(this.translate.instant('Labels.Misc') + ' ' + this.abilityService.convertScoreToString(misc));
      }
      if (resurrectionPenalty > 0) {
        parts.push(this.translate.instant('Labels.ResurrectionPenalty') + ' -' + resurrectionPenalty);
      }
      configuration.attackModTooltip = parts.join('\n');
    }

    const levels = this.characterLevelService.getLevelsDetailedFromStorage();
    let damages: DamageConfiguration[] = _.cloneDeep(configuration.damageConfigurations);

    if (configuration.advancement) {
      configuration.advancementDamageConfigurations.forEach((damage: DamageConfiguration) => {
        if (this.includeDamage(damage, characterLevel, levels)) {
          if (!damage.adjustment) {
            damages = [];
          }
          damages.push(_.cloneDeep(damage));
        }
      });

      configuration.advancement = false;
      configuration.advancementDamageConfigurations = [];
    }

    damages.forEach((damage: DamageConfiguration) => {
      if (damage.values.abilityModifier.id !== '0') {
        const ability: CreatureAbilityProficiency = this.getAbility(damage.values.abilityModifier.id, collection);
        const modifier: number = this.getAbilityModifier(ability, collection);
        damage.values.miscModifier += modifier;
        damage.values.abilityModifier = new Ability();
      }
      if (damage.spellCastingAbilityModifier) {
        const modifier: number = this.getAbilityModifier(attackModifier.ability, collection);
        damage.values.miscModifier += modifier;
        damage.spellCastingAbilityModifier = false;
      }
    });

    configuration.damageConfigurations = this.powerService.combineDamages(damages);
    return configuration;
  }

  private includeDamage(damage: DamageConfiguration, characterLevel: CharacterLevel, levels: CharacterLevel[]): boolean {
    const level = this.getLevel(damage.level, levels);
    return level != null && level.minExp <= characterLevel.minExp;
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

  getMaxSpellAttackModifier(magicalItem: MagicalItem, creature: Creature, collection: CreatureConfigurationCollection): number {
    return this.getMaxPowerModifierValue(AttackType.ATTACK, collection);
  }

  getMaxSpellSaveDC(magicalItem: MagicalItem, creature: Creature, collection: CreatureConfigurationCollection): number {
    return this.getMaxPowerModifierValue(AttackType.SAVE, collection);
  }

  private getMaxPowerModifierValue(attackType: AttackType, collection: CreatureConfigurationCollection): number {
    const prof = this.getProfModifier(collection);
    if (attackType === AttackType.ATTACK) {
      return prof;
    } else {
      return 8 + prof;
    }
  }

  getAbility(abilityId: string, collection: CreatureConfigurationCollection): CreatureAbilityProficiency {
    if (collection != null) {
      for (let i = 0; i < collection.proficiencyCollection.abilities.length; i++) {
        const ability = collection.proficiencyCollection.abilities[i];
        if (ability.ability.id === abilityId) {
          return ability;
        }
      }
    }
    return null;
  }

  getAbilityScore(ability: CreatureAbilityProficiency, collection: CreatureConfigurationCollection, includeInheritedValues: boolean = true,
                  includeMisc: boolean = true, includeModifiers = true, includeASI = true): number {
    const baseScoreWithModifiers = this.getAbilityScoreValue(ability, collection, includeInheritedValues, includeMisc, includeModifiers, includeASI);
    const increasedScore = this.abilityService.getAbilityScoreIncreaseModifier(ability);
    return baseScoreWithModifiers + increasedScore;
  }

  private getAbilityScoreValue(ability: CreatureAbilityProficiency, collection: CreatureConfigurationCollection = null, includeInheritedValues: boolean = true,
                               includeMisc: boolean = true, includeModifiers = true, includeASI = true): number {
    if (ability == null) {
      return 0;
    }
    let total = 0;
    if (ability.abilityScore != null) {
      total = ability.abilityScore.value;
    }

    if (includeModifiers) {
      total = this.getModifiers(ability.scoreModifiers, collection, total);
    }

    if (includeMisc) {
      total += this.abilityService.getMiscModifier(ability);
    }
    if (includeASI) {
      total += this.abilityService.getASI(ability);
    }
    if (includeInheritedValues) {
      total += this.abilityService.getInheritedAbilityModifier(ability);
    }

    return total;
  }

  getAbilityModifier(ability: CreatureAbilityProficiency, collection: CreatureConfigurationCollection): number {
    if (ability == null) {
      return 0;
    }
    const score = this.getAbilityScore(ability, collection);
    return this.abilityService.getAbilityModifier(score);
  }

  getAbilityBySid(sid: number, collection: CreatureConfigurationCollection): CreatureAbilityProficiency {
    if (collection != null) {
      for (let i = 0; i < collection.proficiencyCollection.abilities.length; i++) {
        const ability = collection.proficiencyCollection.abilities[i];
        if (ability.ability.sid === sid) {
          return ability;
        }
      }
    }
    return null;
  }

  getAbilities(abilities: ListObject[], collection: CreatureConfigurationCollection): CreatureAbilityProficiency[] {
    const list: CreatureAbilityProficiency[] = [];
    collection.proficiencyCollection.abilities.forEach((ability: CreatureAbilityProficiency) => {
      if (_.findIndex(abilities, function(_ability) { return _ability.id === ability.ability.id }) > -1) {
        list.push(ability);
      }
    });
    return list;
  }

  getHighestOfAbilities(abilities: CreatureAbilityProficiency[], collection: CreatureConfigurationCollection): CreatureAbilityProficiency {
    let highest: CreatureAbilityProficiency = null;
    let highestValue = -1;
    for (let i = 0; i < abilities.length; i++) {
      const ability = abilities[i];
      const currentValue = this.getAbilityModifier(ability, collection);
      if (highest == null || currentValue > highestValue) {
        highest = ability;
        highestValue = currentValue;
      }
    }
    return highest;
  }

  isItemProficient(creatureItem: CreatureItem, collection: CreatureConfigurationCollection): boolean {
    if (creatureItem == null || collection == null) {
      return false;
    }
    let itemId = creatureItem.item.id;
    let proficiencies: CreatureListProficiency[] = [];
    switch (creatureItem.itemType) {
      case ItemType.WEAPON:
        proficiencies = collection.proficiencyCollection.weaponProficiencies
        break;
      case ItemType.ARMOR:
        proficiencies = collection.proficiencyCollection.armorProficiencies
        break;
      case ItemType.TOOL:
        proficiencies = collection.proficiencyCollection.toolProficiencies
        break;
      case ItemType.MAGICAL_ITEM:
        const magicalItem = creatureItem.item as MagicalItem;
        if (magicalItem.magicalItemType === MagicalItemType.WEAPON && creatureItem.magicalItem != null && creatureItem.magicalItem.itemType === ItemType.WEAPON) {
          proficiencies = collection.proficiencyCollection.weaponProficiencies;
          itemId = creatureItem.magicalItem.id;
        } else if (magicalItem.magicalItemType === MagicalItemType.ARMOR && creatureItem.magicalItem != null && creatureItem.magicalItem.itemType === ItemType.ARMOR) {
          proficiencies = collection.proficiencyCollection.armorProficiencies;
          itemId = creatureItem.magicalItem.id;
        }
        break;
    }

    let prof = this.getCreatureListProficiency(itemId, proficiencies);
    if (prof == null) {
      switch (creatureItem.itemType) {
        case ItemType.WEAPON:
          const weapon = creatureItem.item as Weapon;
          itemId = weapon.weaponType.id;
          break;
        case ItemType.ARMOR:
          const armor = creatureItem.item as Armor;
          itemId = armor.armorType.id;
          break;
        case ItemType.MAGICAL_ITEM:
          const magicalItem = creatureItem.item as MagicalItem;
          if (magicalItem.magicalItemType === MagicalItemType.WEAPON && creatureItem.magicalItem != null && creatureItem.magicalItem.itemType === ItemType.WEAPON) {
            const magicalWeapon = creatureItem.magicalItem as Weapon;
            itemId = magicalWeapon.weaponType.id;
          } else if (magicalItem.magicalItemType === MagicalItemType.ARMOR && creatureItem.magicalItem != null && creatureItem.magicalItem.itemType === ItemType.ARMOR) {
            const magicalArmor = creatureItem.magicalItem as Armor;
            itemId = magicalArmor.armorType.id;
          }
          break;
      }
      prof = this.getCreatureListProficiency(itemId, proficiencies);
    }
    return this.isCreatureListProficiencyProficient(prof);
  }

  getMiscModifier(sid: number, collection: CreatureConfigurationCollection): CreatureListProficiency {
    for (let i = 0; i < collection.proficiencyCollection.miscProficiencies.length; i++) {
      const item = collection.proficiencyCollection.miscProficiencies[i];
      if (item.item.sid === sid) {
        return item;
      }
    }
    return new CreatureListProficiency(null);
  }

  getMiscModifierValue(miscModifier: CreatureListProficiency): number {
    return miscModifier.proficiency.miscModifier;
    //todo - inherited misc modifiers
    // miscModifier.creatureListProficiency.inheritedValues.forEach((inherited: CreatureListModifierValue) => {
    //   misc += inherited.value;
    // });
  }

  getMiscModifierTooltip(miscModifier: CreatureListProficiency): string[] {
    const parts: string[] = [];
    const misc = this.getMiscModifierValue(miscModifier);
    //todo - list the individual inherited values?
    if (misc !== 0) {
      parts.push(this.translate.instant('Labels.Misc') + ' ' + this.abilityService.convertScoreToString(misc));
    }
    return parts;
  }

  getProfModifier(collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true): number {
    if (collection == null) {
      return 0;
    }
    let profBonus = collection.totalLevel.profBonus;
    if (collection.totalLevel.id === '0') {
      profBonus = collection.profBonus;
    }
    if (includeMisc || includeModifiers) {
      const miscModifier = this.getMiscModifier(SID.MISC_ATTRIBUTES.PROFICIENCY, collection);
      if (miscModifier != null) {
        if (includeMisc) {
          profBonus += this.getMiscModifierValue(miscModifier);
        }
        if (includeModifiers) {
          profBonus += this.getModifiers(miscModifier.modifiers, collection);
        }
      }
    }
    return profBonus;
  }

  getProfModifierTooltip(collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true): string {
    let parts = [];
    const profBonus = collection.totalLevel.profBonus;
    parts.push(this.translate.instant('Labels.Base') + ' ' + profBonus);

    if (includeMisc || includeModifiers) {
      const miscModifier = this.getMiscModifier(SID.MISC_ATTRIBUTES.PROFICIENCY, collection);
      if (miscModifier != null) {
        if (includeModifiers) {
          const modifierTooltips: string[] = this.getModifierTooltips(miscModifier.modifiers, collection);
          parts = parts.concat(modifierTooltips);
        }

        if (includeMisc) {
          parts = parts.concat(this.getMiscModifierTooltip(miscModifier));
        }
      }
    }

    return parts.join('\n');
  }

  resetSpellSlots(creature: Creature, collection: CreatureConfigurationCollection): Promise<any> {
    const creatureSpellSlots = new CreatureSpellSlots();
    const spellSlots = _.cloneDeep(creature.creatureSpellCasting.spellSlots);
    spellSlots.forEach((slot: CreatureSpellSlot) => {
      slot.remaining = this.getMaxSpellSlots(slot, collection);
    });
    creatureSpellSlots.spellSlots = spellSlots;
    return this.updateSpellSlots(creature, creatureSpellSlots).then(() => {
      creature.creatureSpellCasting.spellSlots = spellSlots;
    });
  };

  updateSpellSlots(creature: Creature, creatureSpellSlots: CreatureSpellSlots): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/creatures/${creature.id}/spellSlots`, creatureSpellSlots).toPromise().then((response: any) => {
      creature.creatureSpellCasting.spellSlots = creatureSpellSlots.spellSlots;
      return response;
    });
  }

  getSpellSlotsForLevel(creature: Creature, level: number): number {
    for (let i = 0; i < creature.creatureSpellCasting.spellSlots.length; i++) {
      const slot = creature.creatureSpellCasting.spellSlots[i];
      if (slot.level === level) {
        return slot.remaining;
      }
    }

    return 0;
  }

  validateCreature(creature: Creature): Promise<CharacterValidationItem[]> {
    return this.http.get<CharacterValidationItem[]>(`${environment.backendUrl}/creatures/${creature.id}/validate`).toPromise();
  }

  updateCreatureValidation(creature: Creature, response: CharacterValidationResponse): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/creatures/${creature.id}/validate`, response).toPromise();
  }

  getCreatureActions(creature: Creature, actionType: ActionType): Promise<CreatureAction[]> {
    return this.http.get<CreatureAction[]>(`${environment.backendUrl}/creatures/${creature.id}/actions?type=${actionType}`).toPromise();
  }

  getCreatureFavoriteActions(creature: Creature): Promise<CreatureAction[]> {
    return this.http.get<CreatureAction[]>(`${environment.backendUrl}/creatures/${creature.id}/actions/favorites`).toPromise();
  }

  updateCreatureFavoriteActions(creature: Creature, creatureActions: CreatureActions): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/creatures/${creature.id}/actions/favorites`, creatureActions).toPromise();
  }

  /******************************************* Configurations ******************************************/

  initializeConfigurationCollection(): Promise<CreatureConfigurationCollection> {
    const collection = new CreatureConfigurationCollection();
    const promises = [];
    promises.push(this.initializeProfs().then((proficiencies: CreatureProficiencyCollection) => {
      collection.proficiencyCollection = proficiencies;
    }));
    promises.push(this.initializeDamageModifierConfiguration().then((damageModifierCollection: CreatureDamageModifierCollection) => {
      collection.damageModifierCollection = damageModifierCollection;
    }));
    promises.push(this.initializeConditionImmunitiesConfiguration()
      .then((conditionImmunityConfigurationCollection: CreatureConditionImmunityCollection) => {
        collection.conditionImmunityConfigurationCollection = conditionImmunityConfigurationCollection;
      }));
    promises.push(this.initializeSenseConfigurations().then((senseConfigurationCollection: CreatureSensesCollection) => {
      collection.senseConfigurationCollection = senseConfigurationCollection;
    }));
    return Promise.all(promises).then(function () {
      return collection;
    });
  }

  addCreatureToCollection(creature: Creature, collection: CreatureConfigurationCollection): void {
    this.addCreatureToProficiencies(creature, collection.proficiencyCollection);
    this.addCreatureToDamageModifiers(creature, collection.damageModifierCollection);
    this.addCreatureToConditionImmunities(creature, collection.conditionImmunityConfigurationCollection);
    this.addCreatureToSenses(creature, collection.senseConfigurationCollection);
  }

  addCharacteristicToCollection(collection: CreatureConfigurationCollection, characteristic: Characteristic,
                                primary: boolean = true): Promise<any> {
    if (characteristic == null) {
      return;
    }
    this.removeCharacteristicFromCollection(collection, characteristic, primary);
    return this.characteristicService.initializeConfigurationCollection(characteristic)
      .then((collectionToAdd: CharacteristicConfigurationCollection) => {
        if (characteristic.characteristicType === CharacteristicType.CLASS) {
          this.characterClassService.initializeSecondaryProfs(characteristic as CharacterClass, collectionToAdd.proficiencyCollection);
        }
        const inheritedFrom = new InheritedFrom(characteristic.id, characteristic.name, characteristic.characteristicType, primary);
        let addChoices = true;
        if (characteristic.characteristicType === CharacteristicType.CLASS && characteristic.parent != null) {
          addChoices = false;
        }
        this.addToCollection(collection, collectionToAdd, inheritedFrom, primary, addChoices);
      });
  }

  removeCharacteristicFromCollection(collection: CreatureConfigurationCollection, characteristic: Characteristic,
                                     primary: boolean = true): void {
    if (characteristic == null) {
      return;
    }
    const inheritedFrom = new InheritedFrom(characteristic.id, characteristic.name, characteristic.characteristicType, primary);
    this.removeFromCollection(collection, inheritedFrom);
  }

  addToCollection(collection: CreatureConfigurationCollection, collectionToAdd: CharacteristicConfigurationCollection,
                  inheritedFrom: InheritedFrom, primary: boolean, addChoices: boolean): void {
    this.addToProficiencies(collection, collectionToAdd, inheritedFrom, primary, addChoices);
    this.addToDamageModifiers(collection, collectionToAdd, inheritedFrom);
    this.addToConditionImmunities(collection, collectionToAdd, inheritedFrom);
    this.addToSenses(collection, collectionToAdd, inheritedFrom);
    this.addToSpellConfigurations(collection, collectionToAdd, inheritedFrom);
  }

  removeFromCollection(collection: CreatureConfigurationCollection, inheritedFrom: InheritedFrom): void {
    this.removeFromProficiencies(collection, inheritedFrom);
    this.removeFromDamageModifiers(collection, inheritedFrom);
    this.removeFromConditionImmunities(collection, inheritedFrom);
    this.removeFromSenses(collection, inheritedFrom);
    this.removeFromSpellConfigurations(collection, inheritedFrom);
  }

  setFromCollections(creature: Creature, collection: CreatureConfigurationCollection): void {
    this.setProfsFromCollection(creature, collection.proficiencyCollection);
    this.setDamageModifiersFromCollection(creature, collection.damageModifierCollection);
    this.setConditionImmunitiesFromCollection(creature, collection.conditionImmunityConfigurationCollection);
    this.setSensesFromCollection(creature, collection.senseConfigurationCollection);
  }

  /******************************** Modifier Configurations ***********************************/

  activeSingleCreaturePowerModifier(creaturePower: CreaturePower, modifierConfiguration: ModifierConfiguration, collection: CreatureConfigurationCollection): void {
    switch (modifierConfiguration.attribute.attributeType) {
      case AttributeType.ABILITY:
        this.activateCreatureAbilityProficiencyModifier(creaturePower, modifierConfiguration, collection);
        break;
      case AttributeType.SKILL:
        this.activateCreatureProficiencyModifier(creaturePower, modifierConfiguration, collection);
        break;
      case AttributeType.DAMAGE_TYPE:
        this.activateDamageModifiers(creaturePower, modifierConfiguration, collection);
        break;
      case AttributeType.CONDITION:
        this.activateConditionModifiers(creaturePower, modifierConfiguration, collection);
        break;
      case AttributeType.MISC:
        if (modifierConfiguration.characteristicDependant) {
          this.activateCharacteristicModifiers(creaturePower, modifierConfiguration, collection);
        } else {
          this.activateMiscModifiers(creaturePower, modifierConfiguration, collection);
        }
        break;
    }
  }

  deactivateCreaturePowerModifiers(creaturePower: CreaturePower, collection: CreatureConfigurationCollection): void {
    const powerId = creaturePower.powerId;
    this.deactivateCreatureAbilityProficiencyModifier(powerId, collection);
    this.deactivateCreatureProficiencyModifier(powerId, collection);
    this.deactivateDamageModifiers(powerId, collection);
    this.deactivateConditionModifiers(powerId, collection);
    this.deactivateMiscModifiers(powerId, collection);
    this.deactivateCharacteristicModifiers(powerId, collection);
  }

  activateCreatureAbilityProficiencyModifier(creaturePower: CreaturePower, modifierConfiguration: ModifierConfiguration, collection: CreatureConfigurationCollection): void {
    const attributeId = modifierConfiguration.attribute.id;
    collection.proficiencyCollection.abilities.forEach((creatureAbilityProficiency: CreatureAbilityProficiency) => {
      if (creatureAbilityProficiency.ability.id === attributeId) {
        switch (modifierConfiguration.modifierSubCategory) {
          case ModifierSubCategory.SCORE:
            creatureAbilityProficiency.scoreModifiers.set(creaturePower.powerId, this.getPowerModifierConfiguration(creaturePower, modifierConfiguration));
            break;
          case ModifierSubCategory.OTHER:
            creatureAbilityProficiency.abilityModifiers.set(creaturePower.powerId, this.getPowerModifierConfiguration(creaturePower, modifierConfiguration));
            break;
          case ModifierSubCategory.SAVE:
            creatureAbilityProficiency.saveModifiers.set(creaturePower.powerId, this.getPowerModifierConfiguration(creaturePower, modifierConfiguration));
            break;
        }
      }
    });
  }

  deactivateCreatureAbilityProficiencyModifier(powerId: string, collection: CreatureConfigurationCollection): void {
    collection.proficiencyCollection.abilities.forEach((creatureAbilityProficiency: CreatureAbilityProficiency) => {
      creatureAbilityProficiency.scoreModifiers.delete(powerId);
      creatureAbilityProficiency.abilityModifiers.delete(powerId);
      creatureAbilityProficiency.saveModifiers.delete(powerId);
    });
  }

  activateCreatureProficiencyModifier(creaturePower: CreaturePower, modifierConfiguration: ModifierConfiguration, collection: CreatureConfigurationCollection): void {
    const attributeId = modifierConfiguration.attribute.id;
    const proficiencies = this.getAttributeProficiencies(modifierConfiguration.attribute.attributeType, modifierConfiguration.modifierSubCategory, collection);
    proficiencies.forEach((creatureListProficiency: CreatureListProficiency) => {
      if (creatureListProficiency.item.id === attributeId) {
        if (modifierConfiguration.modifierSubCategory === ModifierSubCategory.PASSIVE) {
          creatureListProficiency.passiveModifiers.set(creaturePower.powerId, this.getPowerModifierConfiguration(creaturePower, modifierConfiguration));
        } else {
          creatureListProficiency.modifiers.set(creaturePower.powerId, this.getPowerModifierConfiguration(creaturePower, modifierConfiguration));
        }
      }
    });
  }

  private getAttributeProficiencies(attributeType: AttributeType, modifierSubCategory: ModifierSubCategory, collection: CreatureConfigurationCollection): CreatureListProficiency[] {
    switch (attributeType) {
      case AttributeType.ABILITY:
        if (modifierSubCategory === ModifierSubCategory.SAVE) {
          return collection.proficiencyCollection.savingThrowProficiencies;
        } else {
          return collection.proficiencyCollection.abilityProficiencies;
        }
      case AttributeType.ARMOR_TYPE:
        return collection.proficiencyCollection.armorProficiencies;
      case AttributeType.SKILL:
        return collection.proficiencyCollection.skillProficiencies;
      case AttributeType.TOOL_CATEGORY:
        return collection.proficiencyCollection.toolProficiencies;
      case AttributeType.WEAPON_TYPE:
        return collection.proficiencyCollection.weaponProficiencies;
      case AttributeType.LANGUAGE:
        return collection.proficiencyCollection.languageProficiencies;
    }
    return [];
  }

  deactivateCreatureProficiencyModifier(powerId: string, collection: CreatureConfigurationCollection): void {
    this.deactivateCreatureProficiencyModifiers(powerId, collection.proficiencyCollection.abilityProficiencies);
    this.deactivateCreatureProficiencyModifiers(powerId, collection.proficiencyCollection.savingThrowProficiencies);
    this.deactivateCreatureProficiencyModifiers(powerId, collection.proficiencyCollection.armorProficiencies);
    this.deactivateCreatureProficiencyModifiers(powerId, collection.proficiencyCollection.skillProficiencies);
    this.deactivateCreatureProficiencyModifiers(powerId, collection.proficiencyCollection.toolProficiencies);
    this.deactivateCreatureProficiencyModifiers(powerId, collection.proficiencyCollection.weaponProficiencies);
    this.deactivateCreatureProficiencyModifiers(powerId, collection.proficiencyCollection.languageProficiencies);
  }

  private deactivateCreatureProficiencyModifiers(powerId: string, proficiencies: CreatureListProficiency[]): void {
    proficiencies.forEach((creatureListProficiency: CreatureListProficiency) => {
      creatureListProficiency.modifiers.delete(powerId);
    });
  }

  activateDamageModifiers(creaturePower: CreaturePower, modifierConfiguration: ModifierConfiguration, collection: CreatureConfigurationCollection): void {
    const attributeId = modifierConfiguration.attribute.id;
    collection.damageModifierCollection.damageModifiers.forEach((damageModifierCollectionItem: CreatureDamageModifierCollectionItem) => {
      if (damageModifierCollectionItem.damageType.id === attributeId) {
        damageModifierCollectionItem.modifiers.set(creaturePower.powerId, this.getPowerModifierConfiguration(creaturePower, modifierConfiguration));
      }
    });
  }

  deactivateDamageModifiers(powerId: string, collection: CreatureConfigurationCollection): void {
    collection.damageModifierCollection.damageModifiers.forEach((creatureDamageModifierCollectionItem: CreatureDamageModifierCollectionItem) => {
      creatureDamageModifierCollectionItem.modifiers.delete(powerId);
    });
  }

  activateConditionModifiers(creaturePower: CreaturePower, modifierConfiguration: ModifierConfiguration, collection: CreatureConfigurationCollection): void {
    const attributeId = modifierConfiguration.attribute.id;
    collection.conditionImmunityConfigurationCollection.conditionImmunities.forEach((creatureConditionImmunityCollectionItem: CreatureConditionImmunityCollectionItem) => {
      if (creatureConditionImmunityCollectionItem.condition.id === attributeId) {
        creatureConditionImmunityCollectionItem.modifiers.set(creaturePower.powerId, this.getPowerModifierConfiguration(creaturePower, modifierConfiguration));
      }
    });
  }

  deactivateConditionModifiers(powerId: string, collection: CreatureConfigurationCollection): void {
    collection.conditionImmunityConfigurationCollection.conditionImmunities.forEach((creatureConditionImmunityCollectionItem: CreatureConditionImmunityCollectionItem) => {
      creatureConditionImmunityCollectionItem.modifiers.delete(powerId);
    });
  }

  activateMiscModifiers(creaturePower: CreaturePower, modifierConfiguration: ModifierConfiguration, collection: CreatureConfigurationCollection): void {
    const attributeId = modifierConfiguration.attribute.id;
    collection.proficiencyCollection.miscProficiencies.forEach((creatureListProficiency: CreatureListProficiency) => {
      if (creatureListProficiency.item.id === attributeId) {
        creatureListProficiency.modifiers.set(creaturePower.powerId, this.getPowerModifierConfiguration(creaturePower, modifierConfiguration));
      }
    });
  }

  deactivateMiscModifiers(powerId: string, collection: CreatureConfigurationCollection): void {
    collection.proficiencyCollection.miscProficiencies.forEach((creatureListProficiency: CreatureListProficiency) => {
      creatureListProficiency.modifiers.delete(powerId);
    });
  }

  activateCharacteristicModifiers(creaturePower: CreaturePower, modifierConfiguration: ModifierConfiguration, collection: CreatureConfigurationCollection): void {
    collection.characteristicConfigurationCollection.items.forEach((config: CreatureCharacteristicConfigurationCollectionItem) => {
      if (this.shouldApplyCreaturePowerModifier(creaturePower, config.characteristicId)) {
        const powerModifierConfiguration = this.getPowerModifierConfiguration(creaturePower, modifierConfiguration);
        switch (modifierConfiguration.attribute.sid) {
          case SID.MISC_ATTRIBUTES.SPELL_ATTACK:
            config.spellAttackModifiers.set(creaturePower.powerId, powerModifierConfiguration);
            break;
          case SID.MISC_ATTRIBUTES.SPELL_SAVE:
            config.spellSaveModifiers.set(creaturePower.powerId, powerModifierConfiguration);
            break;
          case SID.MISC_ATTRIBUTES.MAX_SPELLS_PREPARED:
            config.spellPreparationModifiers.set(creaturePower.powerId, powerModifierConfiguration);
            break;
          case SID.MISC_ATTRIBUTES.HIT_DICE:
            config.hitDiceModifiers.set(creaturePower.powerId, powerModifierConfiguration);
            break;
          case SID.MISC_ATTRIBUTES.MAX_HP:
            config.maxHpModifiers.set(creaturePower.powerId, powerModifierConfiguration);
            break;
        }
      }
    });
  }

  private shouldApplyCreaturePowerModifier(creaturePower: CreaturePower, configCharacteristicId: string): boolean {
    const assignedCharacteristic = creaturePower.assignedCharacteristic;
    return assignedCharacteristic === '0' || configCharacteristicId === assignedCharacteristic;
  }

  deactivateCharacteristicModifiers(powerId: string, collection: CreatureConfigurationCollection): void {
    collection.characteristicConfigurationCollection.items.forEach((config: CreatureCharacteristicConfigurationCollectionItem) => {
      config.spellAttackModifiers.delete(powerId);
      config.spellSaveModifiers.delete(powerId);
      config.spellPreparationModifiers.delete(powerId);
      config.hitDiceModifiers.delete(powerId);
      config.maxHpModifiers.delete(powerId);
    });
  }

  private getPowerModifierConfiguration(creaturePower: CreaturePower, modifierConfiguration: ModifierConfiguration): PowerModifierConfiguration {
    const powerModifierConfiguration = new PowerModifierConfiguration();
    powerModifierConfiguration.powerId = creaturePower.powerId;
    powerModifierConfiguration.powerName = creaturePower.powerName;
    powerModifierConfiguration.modifierConfiguration = modifierConfiguration;
    return powerModifierConfiguration;
  }

  /******************************* Proficiencies *************************************/

  private initializeProfs(): Promise<CreatureProficiencyCollection> {
    const proficiencies = new CreatureProficiencyCollection();
    return this.initializeAbilityProficiencies(proficiencies).then(() => {
      const promises = [];
      promises.push(this.initializeArmorProfs(proficiencies));
      promises.push(this.initializeLanguageProfs(proficiencies));
      promises.push(this.initializeSkillsProfs(proficiencies));
      promises.push(this.initializeToolProfs(proficiencies));
      promises.push(this.initializeWeaponProfs(proficiencies));
      promises.push(this.initializeMiscProfs(proficiencies));

      return Promise.all(promises).then(function () {
        return proficiencies;
      });
    });
  }

  private initializeAbilityProficiencies(proficiencies: CreatureProficiencyCollection): Promise<CreatureProficiencyCollection> {
    proficiencies.savingThrowProficiencies = [];
    proficiencies.abilityProficiencies = [];
    proficiencies.abilities = [];

    return this.abilityService.getAbilitiesDetailed().then((abilities: Ability[]) => {
      abilities.forEach((ability: Ability) => {
        const abilityProf = new CreatureListProficiency(new ListObject(ability.id, ability.name, ability.sid));
        proficiencies.abilityProficiencies.push(abilityProf);

        const savingThrowProf = new CreatureListProficiency(new ListObject(ability.id, ability.name, ability.sid));
        proficiencies.savingThrowProficiencies.push(savingThrowProf);

        const combined = new CreatureAbilityProficiency(ability);
        combined.abilityScore = new CreatureAbilityScore();
        combined.abilityScore.ability = ability;
        combined.abilityProficiency = abilityProf;
        combined.abilityModifier = new CreatureListModifier(ability);
        combined.saveProficiency = savingThrowProf;
        combined.saveModifier = new CreatureListModifier(ability);
        proficiencies.abilities.push(combined);
      });
      return proficiencies;
    });
  }

  private initializeArmorProfs(proficiencies: CreatureProficiencyCollection): Promise<CreatureListProficiency[]> {
    proficiencies.armorProficiencies = [];
    return this.armorTypeService.getArmorTypes().then((armorTypes: ListObject[]) => {
      const promises = [];
      armorTypes.forEach((armorType: ListObject) => {
        const prof = new CreatureListProficiency(armorType);
        prof.item.sid = armorType.sid;
        proficiencies.armorProficiencies.push(prof);
        promises.push(this.itemService.getArmorsByArmorType(armorType).then((armors: ListObject[]) => {
          armors.forEach((armor: ListObject) => {
            const childProf = new CreatureListProficiency(armor);
            childProf.item.sid = armor.sid;
            childProf.parentProficiency = prof;
            prof.childrenProficiencies.push(childProf);
          });
        }));
      });
      return Promise.all(promises).then(() => {
        return proficiencies.armorProficiencies;
      });
    });
  }

  private initializeLanguageProfs(proficiencies: CreatureProficiencyCollection): Promise<CreatureListProficiency[]> {
    proficiencies.languageProficiencies = [];
    return this.languageService.getLanguages().then((languages: ListObject[]) => {
      languages.forEach((language: ListObject) => {
        const prof = new CreatureListProficiency(language);
        prof.item.sid = language.sid;
        proficiencies.languageProficiencies.push(prof);
      });
      return proficiencies.languageProficiencies;
    });
  }

  private initializeSkillsProfs(proficiencies: CreatureProficiencyCollection): Promise<CreatureListProficiency[]> {
    proficiencies.skillProficiencies = [];
    return this.skillService.getSkillsDetailed().then((skills: Skill[]) => {
      skills.forEach((skill: Skill) => {
        const prof = new CreatureSkillListProficiency(skill);
        prof.item.sid = skill.sid;
        prof.skill = skill;
        proficiencies.skillProficiencies.push(prof);
        prof.abilityProficiency = this.getCreatureAbilityProficiency(proficiencies.abilities, skill.ability.id);
        if (prof.abilityProficiency == null) {
          prof.abilityProficiency = new CreatureAbilityProficiency(skill.ability);
        }
      });
      return proficiencies.skillProficiencies;
    });
  }

  private initializeToolProfs(proficiencies: CreatureProficiencyCollection): Promise<CreatureListProficiency[]> {
    proficiencies.toolProficiencies = [];
    return this.toolCategoryService.getToolCategories().then((toolCategories: ListObject[]) => {
      const promises = [];
      toolCategories.forEach((toolCategory: ListObject) => {
        const prof = new CreatureListProficiency(toolCategory);
        prof.item.sid = toolCategory.sid;
        proficiencies.toolProficiencies.push(prof);
        promises.push(this.itemService.getToolsByToolCategory(toolCategory).then((weapons: ListObject[]) => {
          weapons.forEach((tool: ListObject) => {
            const childProf = new CreatureListProficiency(tool);
            childProf.item.sid = tool.sid;
            childProf.parentProficiency = prof;
            prof.childrenProficiencies.push(childProf);
          });
        }));
      });
      return Promise.all(promises).then(() => {
        return proficiencies.toolProficiencies;
      });
    });
  }

  private initializeWeaponProfs(proficiencies: CreatureProficiencyCollection): Promise<CreatureListProficiency[]> {
    proficiencies.weaponProficiencies = [];
    return this.weaponTypeService.getWeaponTypes().then((weaponTypes: ListObject[]) => {
      const promises = [];
      weaponTypes.forEach((weaponType: ListObject) => {
        const prof = new CreatureListProficiency(weaponType);
        prof.item.sid = weaponType.sid;
        proficiencies.weaponProficiencies.push(prof);
        promises.push(this.itemService.getWeaponsByWeaponType(weaponType).then((weapons: ListObject[]) => {
          weapons.forEach((weapon: ListObject) => {
            const childProf = new CreatureListProficiency(weapon);
            childProf.item.sid = weapon.sid;
            childProf.parentProficiency = prof;
            prof.childrenProficiencies.push(childProf);
          });
        }));
      });
      return Promise.all(promises).then(() => {
        return proficiencies.weaponProficiencies;
      });
    });
  }

  private initializeMiscProfs(proficiencies: CreatureProficiencyCollection): Promise<CreatureListProficiency[]> {
    proficiencies.miscProficiencies = [];
    return this.attributeService.getMisc().then((miscAttributes: ListObject[]) => {
      miscAttributes.forEach((misc: ListObject) => {
        const prof = new CreatureListProficiency(misc);
        prof.item.sid = misc.sid;
        proficiencies.miscProficiencies.push(prof);
      });
      return proficiencies.miscProficiencies;
    });
  }

  private addCreatureToProficiencies(creature: Creature, collection: CreatureProficiencyCollection): void {
    this.addProficienciesToProfs(creature.attributeProfs, collection);
    this.addCreatureItemProfsToProfs(creature.itemProfs, collection);
    this.addAbilityScoresToCreature(creature.abilityScores, collection);
  }

  private addAbilityScoresToCreature(abilityScores: CreatureAbilityScore[], collection: CreatureProficiencyCollection) {
    collection.abilities.forEach((abilityProf: CreatureAbilityProficiency) => {
    });


    abilityScores.forEach((abilityScore: CreatureAbilityScore) => {
      const prof = this.getCreatureAbilityProficiencyBySid(collection.abilities, abilityScore.ability.sid);
      if (prof != null) {
        prof.abilityScore = abilityScore;
      }
    });
  }

  private addProficienciesToProfs(proficiencies: Proficiency[], collection: CreatureProficiencyCollection): void {
    proficiencies.forEach((proficiency: Proficiency) => {
      let profs: CreatureListProficiency[] = [];
      switch (proficiency.attribute.proficiencyType) {
        case ProficiencyType.ABILITY:
          profs = collection.savingThrowProficiencies;
          break;
        case ProficiencyType.ARMOR_TYPE:
          profs = collection.armorProficiencies;
          break;
        case ProficiencyType.LANGUAGE:
          profs = collection.languageProficiencies;
          break;
        case ProficiencyType.SKILL:
          profs = collection.skillProficiencies;
          break;
        case ProficiencyType.TOOL_CATEGORY:
          profs = collection.toolProficiencies;
          break;
        case ProficiencyType.WEAPON_TYPE:
          profs = collection.weaponProficiencies;
          break;
        case ProficiencyType.MISC:
          profs = collection.miscProficiencies;
          break;
      }
      let prof = this.getCreatureProf(proficiency.attribute, profs);
      if (prof == null) {
        if (proficiency.attribute.proficiencyType === ProficiencyType.SKILL) {
          prof = new CreatureSkillListProficiency(proficiency.attribute);
          //todo - prof.skill
          //todo - prof.abilityProficiency
        } else {
          prof = new CreatureListProficiency(proficiency.attribute);
        }
        prof.item.sid = proficiency.attribute.sid;
        profs.push(prof);
      }
      prof.proficient = proficiency.proficient;
      prof.proficiency = proficiency;
    });
  }

  private addCreatureItemProfsToProfs(itemProfs: ItemProficiency[], collection: CreatureProficiencyCollection): void {
    itemProfs.forEach((itemProf: ItemProficiency) => {
      if (itemProf.proficient) {
        let profs: CreatureListProficiency[] = [];
        switch (itemProf.item.itemType) {
          case ItemType.ARMOR:
            profs = collection.armorProficiencies;
            break;
          case ItemType.TOOL:
            profs = collection.toolProficiencies;
            break;
          case ItemType.WEAPON:
            profs = collection.weaponProficiencies;
            break;
        }
        let prof: CreatureListProficiency = this.getCreatureProf(itemProf.item, profs);
        if (prof == null) {
          const parent = this.getCategoryProf(itemProf.item.categoryId, profs);
          if (parent != null) {
            prof = new CreatureListProficiency(itemProf.item);
            prof.item.sid = itemProf.item.sid;
            parent.childrenProficiencies.push(prof);
          }
        }

        if (prof != null) {
          prof.proficient = true;
        }
      }
    });
  }

  private getCategoryProf(categoryId: string, profs: CreatureListProficiency[]): CreatureListProficiency {
    if (categoryId != null && categoryId !== '') {
      for (let i = 0; i < profs.length; i++) {
        const current = profs[i];
        if (current.item.id === categoryId) {
          return current;
        }
      }
    }
    return null;
  }

  private addToProficiencies(collection: CreatureConfigurationCollection, collectionToAdd: CharacteristicConfigurationCollection,
                             inheritedFrom: InheritedFrom, primary: boolean, addChoices: boolean): void {
    this.addToAbilities(collection.proficiencyCollection.abilities,
      collectionToAdd.proficiencyCollection.abilityModifiers, null, null,
      collectionToAdd.proficiencyCollection.savingThrowProficiencies,
      inheritedFrom, primary);
    this.addToProfs(collection.proficiencyCollection.armorProficiencies,
      collectionToAdd.proficiencyCollection.armorProficiencies, inheritedFrom, primary);
    this.addToProfs(collection.proficiencyCollection.languageProficiencies,
      collectionToAdd.proficiencyCollection.languageProficiencies, inheritedFrom, primary);
    this.addToProfs(collection.proficiencyCollection.skillProficiencies,
      collectionToAdd.proficiencyCollection.skillProficiencies, inheritedFrom, primary);
    this.addToProfs(collection.proficiencyCollection.toolProficiencies,
      collectionToAdd.proficiencyCollection.toolProficiencies, inheritedFrom, primary);
    this.addToProfs(collection.proficiencyCollection.weaponProficiencies,
      collectionToAdd.proficiencyCollection.weaponProficiencies, inheritedFrom, primary);
    this.addToProfs(collection.proficiencyCollection.miscProficiencies,
      collectionToAdd.proficiencyCollection.miscProficiencies, inheritedFrom, primary);

    if (addChoices) {
      this.addToChoices(collection.proficiencyCollection.skillChoiceProficiencies,
        collectionToAdd.proficiencyCollection.skillChoiceProficiencies, inheritedFrom, primary,
        collectionToAdd.proficiencyCollection.numSkills + collectionToAdd.proficiencyCollection.parentNumSkills,
        collectionToAdd.proficiencyCollection.numSecondarySkills + collectionToAdd.proficiencyCollection.parentNumSecondarySkills);
      this.addToChoices(collection.proficiencyCollection.toolChoiceProficiencies,
        collectionToAdd.proficiencyCollection.toolChoiceProficiencies, inheritedFrom, primary,
        collectionToAdd.proficiencyCollection.numTools + collectionToAdd.proficiencyCollection.parentNumTools,
        collectionToAdd.proficiencyCollection.numSecondaryTools + collectionToAdd.proficiencyCollection.parentNumSecondaryTools);
    }
    this.addNumToChoose(collection.proficiencyCollection, collectionToAdd.proficiencyCollection, inheritedFrom, addChoices);
  }

  private addToAbilities(collection: CreatureAbilityProficiency[],
                         abilityModifiers: ListModifier[], abilityProfs: ListProficiency[],
                         saveModifiers: ListModifier[], saveProfs: ListProficiency[],
                         inheritedFrom: InheritedFrom, primary: boolean): void {
    this.addAbilitiesToModifiers(collection, abilityModifiers, inheritedFrom, false);
    this.addAbilitiesToModifiers(collection, saveModifiers, inheritedFrom, false);

    this.addAbilitiesToProfs(collection, abilityProfs, inheritedFrom, primary, false);
    this.addAbilitiesToProfs(collection, saveProfs, inheritedFrom, primary, true);
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

  private removeAbilitiesFromCollection(collection: CreatureAbilityProficiency[], inheritedFrom: InheritedFrom): void {
    collection.forEach((creatureAbilityProficiency: CreatureAbilityProficiency) => {
      let prof = creatureAbilityProficiency.abilityProficiency;
      if (prof != null) {
        const index = this.getInheritedFromIndex(prof.inheritedFrom, inheritedFrom);
        if (index > -1) {
          prof.inheritedFrom.splice(index, 1);
        }
        if (prof.childrenProficiencies.length > 0) {
          this.removeFromProfs(prof.childrenProficiencies, inheritedFrom);
        }
      }
      if (creatureAbilityProficiency.abilityModifier != null) {
        this.removeCreatureListModifierValue(creatureAbilityProficiency.abilityModifier.inheritedValues, inheritedFrom);
      }

      prof = creatureAbilityProficiency.saveProficiency;
      if (prof != null) {
        const index = this.getInheritedFromIndex(prof.inheritedFrom, inheritedFrom);
        if (index > -1) {
          prof.inheritedFrom.splice(index, 1);
        }
        if (prof.childrenProficiencies.length > 0) {
          this.removeFromProfs(prof.childrenProficiencies, inheritedFrom);
        }
      }
      if (creatureAbilityProficiency.saveModifier != null) {
        this.removeCreatureListModifierValue(creatureAbilityProficiency.saveModifier.inheritedValues, inheritedFrom);
      }
    });

  }

  private addAbilitiesToProfs(collection: CreatureAbilityProficiency[], profs: ListProficiency[],
                              inheritedFrom: InheritedFrom, primary: boolean, save: boolean): void {
    if (profs == null) {
      return;
    }
    profs.forEach((prof: ListProficiency) => {
      if (prof.proficient || prof.inheritedProficient || prof.secondaryProficient
        || prof.inheritedSecondaryProficient || prof.childrenProficiencies.length > 0) {
        const creatureAbilityProf = this.getCreatureAbilityProficiency(collection, prof.item.id);
        if (creatureAbilityProf != null) {
          if (primary && (prof.proficient || prof.inheritedProficient)) {
            if (save) {
              creatureAbilityProf.saveProficiency.inheritedFrom.push(inheritedFrom);
            } else {
              creatureAbilityProf.abilityProficiency.inheritedFrom.push(inheritedFrom);
            }
          }
          if (!primary && (prof.secondaryProficient || prof.inheritedSecondaryProficient)) {
            if (save) {
              creatureAbilityProf.saveProficiency.inheritedFrom.push(inheritedFrom);
            } else {
              creatureAbilityProf.abilityProficiency.inheritedFrom.push(inheritedFrom);
            }
          }
          if (prof.childrenProficiencies.length > 0) {
            this.addToProfs(creatureAbilityProf.abilityProficiency.childrenProficiencies,
              prof.childrenProficiencies, inheritedFrom, primary);
          }
        }
      }
    });
  }

  private addToProfs(profs: CreatureListProficiency[], profsToAdd: ListProficiency[],
                     inheritedFrom: InheritedFrom, primary: boolean, parentProf: CreatureListProficiency = null): void {
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

        if (primary && (prof.proficient || prof.inheritedProficient)) {
          creatureProf.inheritedFrom.push(inheritedFrom);
        }
        if (!primary && (prof.secondaryProficient || prof.inheritedSecondaryProficient)) {
          creatureProf.inheritedFrom.push(inheritedFrom);
        }
        if (prof.childrenProficiencies.length > 0) {
          this.addToProfs(creatureProf.childrenProficiencies, prof.childrenProficiencies, inheritedFrom, primary, creatureProf);
        }
      }
    });
  }

  private addToChoices(choices: CreatureChoiceProficiency[], choicesToAdd: ListProficiency[], inheritedFrom: InheritedFrom,
                       primary: boolean, quantity: number, secondaryQuantity: number): void {
    const items: ListObject[] = [];
    choicesToAdd.forEach((choice: ListProficiency) => {
      if (choice.proficient || choice.inheritedProficient || choice.secondaryProficient
        || choice.inheritedSecondaryProficient || choice.childrenProficiencies.length > 0) {
        if (primary && (choice.proficient || choice.inheritedProficient)) {
          items.push(choice.item);
        }
        if (!primary && (choice.secondaryProficient || choice.inheritedSecondaryProficient)) {
          items.push(choice.item);
        }
      }
    });
    if (items.length > 0) {
      const creatureChoiceProficiency = new CreatureChoiceProficiency();
      creatureChoiceProficiency.inheritedFrom = inheritedFrom;
      creatureChoiceProficiency.items = items;
      creatureChoiceProficiency.quantity = primary ? quantity : secondaryQuantity;
      choices.push(creatureChoiceProficiency);
    }
  }

  private addNumToChoose(collection: CreatureProficiencyCollection, collectionToAdd: ProficiencyCollection,
                         inheritedFrom: InheritedFrom, addParentCounts: boolean): void {
    const numSavingThrows = collectionToAdd.numSavingThrows + (addParentCounts ? collectionToAdd.parentNumSavingThrows : 0);
    if (numSavingThrows > 0) {
      collection.numSavingThrows.push(new CreatureListModifierValue(inheritedFrom, numSavingThrows));
    }
    const numAbilities = collectionToAdd.numAbilities + (addParentCounts ? collectionToAdd.parentNumAbilities : 0);
    if (numAbilities > 0) {
      collection.numAbilities.push(new CreatureListModifierValue(inheritedFrom, numAbilities));
    }
    const numLanguages = collectionToAdd.numLanguages + (addParentCounts ? collectionToAdd.parentNumLanguages : 0);
    if (numLanguages > 0) {
      collection.numLanguages.push(new CreatureListModifierValue(inheritedFrom, numLanguages));
    }
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

  private removeFromProficiencies(collection: CreatureConfigurationCollection, inheritedFrom: InheritedFrom): void {
    this.removeAbilitiesFromCollection(collection.proficiencyCollection.abilities, inheritedFrom);
    this.removeFromProfs(collection.proficiencyCollection.savingThrowProficiencies, inheritedFrom);
    this.removeFromProfs(collection.proficiencyCollection.armorProficiencies, inheritedFrom);
    this.removeFromProfs(collection.proficiencyCollection.languageProficiencies, inheritedFrom);
    this.removeFromProfs(collection.proficiencyCollection.skillProficiencies, inheritedFrom);
    this.removeFromProfs(collection.proficiencyCollection.toolProficiencies, inheritedFrom);
    this.removeFromProfs(collection.proficiencyCollection.weaponProficiencies, inheritedFrom);
    this.removeFromProfs(collection.proficiencyCollection.miscProficiencies, inheritedFrom);
    this.removeFromChoices(collection.proficiencyCollection.skillChoiceProficiencies, inheritedFrom);
    this.removeFromChoices(collection.proficiencyCollection.toolChoiceProficiencies, inheritedFrom);
    this.removeNumToChoose(collection.proficiencyCollection, inheritedFrom);
  }

  private removeFromProfs(profs: CreatureListProficiency[], inheritedFrom: InheritedFrom): void {
    profs.forEach((prof: CreatureListProficiency) => {
      const index = this.getInheritedFromIndex(prof.inheritedFrom, inheritedFrom);
      if (index > -1) {
        prof.inheritedFrom.splice(index, 1);
      }
      if (prof.childrenProficiencies.length > 0) {
        this.removeFromProfs(prof.childrenProficiencies, inheritedFrom);
      }
    });
  }

  private removeFromChoices(choices: CreatureChoiceProficiency[], inheritedFrom: InheritedFrom): void {
    for (let i = 0; i < choices.length; i++) {
      if (choices[i].inheritedFrom.id === inheritedFrom.id && choices[i].inheritedFrom.primary === inheritedFrom.primary) {
        choices.splice(i, 1);
        i--;
      }
    }
  }

  private removeFromModifiers(modifiers: CreatureListModifier[], inheritedFrom: InheritedFrom): void {
    modifiers.forEach((modifier: CreatureListModifier) => {
      this.removeCreatureListModifierValue(modifier.inheritedValues, inheritedFrom);
    });
  }

  private removeNumToChoose(collection: CreatureProficiencyCollection, inheritedFrom: InheritedFrom): void {
    this.removeCreatureListModifierValue(collection.numSavingThrows, inheritedFrom);
    this.removeCreatureListModifierValue(collection.numAbilities, inheritedFrom);
    this.removeCreatureListModifierValue(collection.numLanguages, inheritedFrom);
  }

  private removeCreatureListModifierValue(values: CreatureListModifierValue[], inheritedFrom: InheritedFrom): void {
    const index = this.getCreatureListModifierValueIndex(values, inheritedFrom);
    if (index > -1) {
      values.splice(index, 1);
    }
  }

  private getInheritedFromIndex(values: InheritedFrom[], inheritedFrom: InheritedFrom): number {
    for (let i = 0; i < values.length; i++) {
      const value: InheritedFrom = values[i];
      if (value.id === inheritedFrom.id && value.primary === inheritedFrom.primary) {
        return i;
      }
    }
    return -1;
  }

  private getCreatureListModifierValueIndex(values: CreatureListModifierValue[], inheritedFrom: InheritedFrom): number {
    for (let i = 0; i < values.length; i++) {
      const value: CreatureListModifierValue = values[i];
      if (value.inheritedFrom.id === inheritedFrom.id && value.inheritedFrom.primary === inheritedFrom.primary) {
        return i;
      }
    }
    return -1;
  }

  private setProfsFromCollection(creature: Creature, collection: CreatureProficiencyCollection): void {
    this.setProficienciesFromCollection(creature, collection);
    this.setCreatureItemProfsFromCollection(creature, collection);
  }

  private setProficienciesFromCollection(creature: Creature, collection: CreatureProficiencyCollection): void {
    creature.attributeProfs = [];
    this.setAbilitiesFromCollection(creature, collection.abilities);
    this.setProficienciesFromCollectionList(creature, collection.armorProficiencies);
    this.setProficienciesFromCollectionList(creature, collection.languageProficiencies);
    this.setProficienciesFromCollectionList(creature, collection.skillProficiencies);
    this.setProficienciesFromCollectionList(creature, collection.toolProficiencies);
    this.setProficienciesFromCollectionList(creature, collection.weaponProficiencies);
    this.setProficienciesFromCollectionList(creature, collection.miscProficiencies);
  }

  private setAbilitiesFromCollection(creature: Creature, collection: CreatureAbilityProficiency[]): void {
    creature.abilityScores = [];
    collection.forEach((creatureAbilityProficiency: CreatureAbilityProficiency) => {
      creature.abilityScores.push(creatureAbilityProficiency.abilityScore);

      const saveProf = creatureAbilityProficiency.saveProficiency;
      if (saveProf != null) {
        saveProf.proficiency.proficient = saveProf.proficient;
        saveProf.proficiency.attribute = new ProficiencyListObject();
        saveProf.proficiency.attribute.proficiencyType = ProficiencyType.ABILITY;
        saveProf.proficiency.attribute.id = saveProf.item.id;
        saveProf.proficiency.attribute.name = saveProf.item.name;
        const saveModifier = creatureAbilityProficiency.saveModifier;
        if (saveModifier != null) {
          saveProf.proficiency.miscModifier = saveModifier.value;
        }
        creature.attributeProfs.push(saveProf.proficiency);
      }
    });
  }

  private setProficienciesFromCollectionList(creature: Creature, profs: CreatureListProficiency[]): void {
    profs.forEach((prof: CreatureListProficiency) => {
      prof.proficiency.proficient = prof.proficient;
      if (prof.proficiency.attribute == null) {
        prof.proficiency.attribute = new ProficiencyListObject();
        prof.proficiency.attribute.id = prof.item.id;
        prof.proficiency.attribute.name = prof.item.name;
      }
      creature.attributeProfs.push(prof.proficiency);
    });
  }

  private getItemProficiencyFromCreatureListProficiency(prof: CreatureListProficiency): ItemProficiency {
    const itemProficiency = new ItemProficiency();
    const item = new Item();
    item.id = prof.item.id;
    item.name = prof.item.name;
    item.sid = prof.item.sid;
    itemProficiency.item = item;
    itemProficiency.proficient = true;
    return itemProficiency;
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

  private getCreatureAbilityProficiencyBySid(collection: CreatureAbilityProficiency[], abilityId: number): CreatureAbilityProficiency {
    for (let i = 0; i < collection.length; i++) {
      const ability = collection[i];
      if (ability.ability.sid === abilityId) {
        return ability;
      }
    }
    return null;
  }

  private setCreatureItemProfsFromCollection(creature: Creature, collection: CreatureProficiencyCollection): void {
    creature.itemProfs = [];
    this.setCreatureItemProfsFromCollectionList(creature, collection.armorProficiencies);
    this.setCreatureItemProfsFromCollectionList(creature, collection.toolProficiencies);
    this.setCreatureItemProfsFromCollectionList(creature, collection.weaponProficiencies);
  }

  private setCreatureItemProfsFromCollectionList(creature: Creature, profs: CreatureListProficiency[]): void {
    profs.forEach((prof: CreatureListProficiency) => {
      prof.childrenProficiencies.forEach((childProf: CreatureListProficiency) => {
        if (childProf.proficient) {
          const itemProficiency = this.getItemProficiencyFromCreatureListProficiency(childProf);
          creature.itemProfs.push(itemProficiency);
        }
      });
    });
  }

  /******************************* Damage Modifiers *************************************/

  getDamageModifierType(item: CreatureDamageModifierCollectionItem): DamageModifierType {
    let damageModifierType = item.damageModifierType;
    item.inheritedDamageModifierTypes.forEach((inherited: InheritedDamageModifierType) => {
      if (inherited.damageModifierType !== DamageModifierType.NORMAL) {
        switch (inherited.damageModifierType) {
          case DamageModifierType.IMMUNE:
            damageModifierType = inherited.damageModifierType;
            break;
          case DamageModifierType.RESISTANT:
            if (damageModifierType === DamageModifierType.VULNERABLE) {
              damageModifierType = DamageModifierType.NORMAL;
            } else if (damageModifierType === DamageModifierType.NORMAL) {
              damageModifierType = inherited.damageModifierType;
            }
            break;
          case DamageModifierType.VULNERABLE:
            if (damageModifierType === DamageModifierType.RESISTANT) {
              damageModifierType = DamageModifierType.NORMAL;
            } else if (damageModifierType === DamageModifierType.NORMAL) {
              damageModifierType = inherited.damageModifierType;
            }
            break;
        }
      }
    });
    return damageModifierType;
  }

  getDamageModifierTooltip(item: CreatureDamageModifierCollectionItem, damageModifierType: DamageModifierType): string {
    const parts = [];
    parts.push(this.translate.instant('Tooltips.DamageModifier.' + damageModifierType));
    item.inheritedDamageModifierTypes.forEach((inheritedDamageModifierType: InheritedDamageModifierType) => {
      const inheritedFrom = inheritedDamageModifierType.inheritedFrom;
      const inheritedModifierType = this.translate.instant('DamageModifier.' + inheritedDamageModifierType.damageModifierType);
      switch (inheritedFrom.type) {
        case CharacteristicType.BACKGROUND:
          parts.push(this.translate.instant('Labels.Background') + ' ' + inheritedFrom.name + ' : ' + inheritedModifierType);
          break;
        case CharacteristicType.CLASS:
          parts.push(this.translate.instant('Labels.Class') + ' ' + inheritedFrom.name + ' : ' + inheritedModifierType);
          break;
        case CharacteristicType.RACE:
          parts.push(this.translate.instant('Labels.Race') + ' ' + inheritedFrom.name + ' : ' + inheritedModifierType);
          break;
      }
    });
    return parts.join('\n');
  }

  private initializeDamageModifierConfiguration(): Promise<CreatureDamageModifierCollection> {
    return this.damageTypeService.getDamageTypes().then((damageTypes: ListObject[]) => {
      const collection = new CreatureDamageModifierCollection();
      damageTypes.forEach((damageType: ListObject) => {
        const item = new CreatureDamageModifierCollectionItem();
        item.damageType = damageType;
        item.damageModifierType = DamageModifierType.NORMAL;
        collection.damageModifiers.push(item);
      });
      return collection;
    });
  }

  private addCreatureToDamageModifiers(creature: Creature, collection: CreatureDamageModifierCollection): void {
    creature.damageModifiers.forEach((modifier: DamageModifier) => {
      if (modifier.damageModifierType !== DamageModifierType.NORMAL) {
        const item = this.getCreatureDamageModifier(collection.damageModifiers, modifier.damageType);
        if (item != null) {
          item.damageModifierType = modifier.damageModifierType;
        }
      }
    });
  }

  private addToDamageModifiers(collection: CreatureConfigurationCollection, collectionToAdd: CharacteristicConfigurationCollection,
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

  private removeFromDamageModifiers(collection: CreatureConfigurationCollection, inheritedFrom: InheritedFrom): void {
    collection.damageModifierCollection.damageModifiers.forEach((item: CreatureDamageModifierCollectionItem) => {
      const index = this.getInheritedDamageModifierIndex(item.inheritedDamageModifierTypes, inheritedFrom);
      if (index > -1) {
        item.inheritedDamageModifierTypes.splice(index, 1);
      }
    });
  }

  private getInheritedDamageModifierIndex(inheritedDamageModifiers: InheritedDamageModifierType[], inheritedFrom: InheritedFrom): number {
    for (let i = 0; i < inheritedDamageModifiers.length; i++) {
      if (inheritedDamageModifiers[i].inheritedFrom.id === inheritedFrom.id) {
        return i;
      }
    }
    return -1;
  }

  private setDamageModifiersFromCollection(creature: Creature, collection: CreatureDamageModifierCollection): void {
    creature.damageModifiers = [];
    collection.damageModifiers.forEach((modifier: CreatureDamageModifierCollectionItem) => {
      if (modifier.damageModifierType !== DamageModifierType.NORMAL) {
        const damageModifier = new DamageModifier();
        damageModifier.damageType = new DamageType();
        damageModifier.damageType.id = modifier.damageType.id;
        damageModifier.damageType.name = modifier.damageType.name;
        damageModifier.damageType.sid = modifier.damageType.sid;
        damageModifier.damageModifierType = modifier.damageModifierType;
        creature.damageModifiers.push(damageModifier);
      }
    });
  }

  /******************************* Condition Immunities *************************************/

  private initializeConditionImmunitiesConfiguration(): Promise<CreatureConditionImmunityCollection> {
    return this.conditionService.getConditions().then((conditions: ListObject[]) => {
      const collection = new CreatureConditionImmunityCollection();
      conditions.forEach((condition: ListObject) => {
        const item = new CreatureConditionImmunityCollectionItem();
        item.condition = condition;
        collection.conditionImmunities.push(item);
      });
      return collection;
    });
  }

  private addCreatureToConditionImmunities(creature: Creature, collection: CreatureConditionImmunityCollection): void {
    creature.conditionImmunities.forEach((condition: ListObject) => {
      const item = this.getCreatureConditionImmunity(collection.conditionImmunities, condition);
      if (item != null) {
        item.immune = true;
      }
    });
  }

  private addToConditionImmunities(collection: CreatureConfigurationCollection, collectionToAdd: CharacteristicConfigurationCollection,
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

  private removeFromConditionImmunities(collection: CreatureConfigurationCollection, inheritedFrom: InheritedFrom): void {
    collection.conditionImmunityConfigurationCollection.conditionImmunities.forEach((item: CreatureConditionImmunityCollectionItem) => {
      const index = this.getInheritedFromIndex(item.inheritedFrom, inheritedFrom);
      if (index > -1) {
        item.inheritedFrom.splice(index, 1);
      }
    });
  }

  private setConditionImmunitiesFromCollection(creature: Creature, collection: CreatureConditionImmunityCollection): void {
    creature.conditionImmunities = [];
    collection.conditionImmunities.forEach((item: CreatureConditionImmunityCollectionItem) => {
      if (item.immune) {
        creature.conditionImmunities.push(item.condition);
      }
    });
  }

  /******************************* Senses *************************************/

  private initializeSenseConfigurations(): Promise<CreatureSensesCollection> {
    const collection = new CreatureSensesCollection();
    const senses: Sense[] = this.getSenses();
    senses.forEach((sense: Sense) => {
      const item = new CreatureSenseCollectionItem();
      item.sense = sense;
      collection.senses.push(item);
    });
    return Promise.resolve(collection);
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

  private addCreatureToSenses(creature: Creature, collection: CreatureSensesCollection): void {
    creature.senses.forEach((senseValue: SenseValue) => {
      if (senseValue.range !== 0) {
        const item = this.getCreatureSense(collection.senses, senseValue.sense);
        if (item != null) {
          item.range = senseValue.range;
        }
      }
    });
  }

  private addToSenses(collection: CreatureConfigurationCollection, collectionToAdd: CharacteristicConfigurationCollection,
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

  private removeFromSenses(collection: CreatureConfigurationCollection, inheritedFrom: InheritedFrom): void {
    collection.senseConfigurationCollection.senses.forEach((item: CreatureSenseCollectionItem) => {
      const index = this.getInheritedSenseIndex(item.inheritedSenses, inheritedFrom);
      if (index > -1) {
        item.inheritedSenses.splice(index, 1);
      }
    });
  }

  private getInheritedSenseIndex(inheritedSenses: InheritedSense[], inheritedFrom: InheritedFrom): number {
    for (let i = 0; i < inheritedSenses.length; i++) {
      if (inheritedSenses[i].inheritedFrom.id === inheritedFrom.id) {
        return i;
      }
    }
    return -1;
  }

  private setSensesFromCollection(creature: Creature, collection: CreatureSensesCollection): void {
    creature.senses = [];
    collection.senses.forEach((item: CreatureSenseCollectionItem) => {
      if (item.range !== 0) {
        const senseValue = new SenseValue();
        senseValue.sense = item.sense;
        senseValue.range = item.range;
        creature.senses.push(senseValue);
      }
    });
  }

  /******************************* Spell Configurations *************************************/

  private addToSpellConfigurations(collection: CreatureConfigurationCollection, collectionToAdd: CharacteristicConfigurationCollection,
                                   inheritedFrom: InheritedFrom): void {
    const spellCollection = new MappedSpellConfigurationCollection();
    collectionToAdd.spellConfigurationCollection.spellConfigurations.forEach((configuration: SpellConfigurationCollectionItem) => {
      spellCollection.configurations.set(configuration.spell.id, configuration);
    });
    collection.characteristicSpellConfigurations.set(inheritedFrom.id, spellCollection);
  }

  private removeFromSpellConfigurations(collection: CreatureConfigurationCollection, inheritedFrom: InheritedFrom): void {
    collection.characteristicSpellConfigurations.delete(inheritedFrom.id);
  }

  /******************************* Modifiers *************************************/

  getSetModification(modifiers: Map<string, PowerModifierConfiguration>): PowerModifierConfiguration {
    let setModification: PowerModifierConfiguration = null;
    modifiers.forEach((powerModifierConfiguration: PowerModifierConfiguration) => {
      const modifier = powerModifierConfiguration.modifierConfiguration;
      if (!modifier.adjustment) {
        if (setModification == null || modifier.value > setModification.modifierConfiguration.value) {
          setModification = powerModifierConfiguration;
        }
      }
    });
    return setModification;
  }

  getModifiers(modifiers: Map<string, PowerModifierConfiguration>, collection: CreatureConfigurationCollection, total = 0, includeSetAmounts = true): number {
    if (includeSetAmounts) {
      const setAmount = this.getSetModification(modifiers);
      if (setAmount != null) {
        total = this.getModifierValue(setAmount, collection);
      }
    }
    modifiers.forEach((powerModifierConfiguration: PowerModifierConfiguration) => {
      if (powerModifierConfiguration.modifierConfiguration.adjustment) {
        total += this.getModifierValue(powerModifierConfiguration, collection);
      }
    });
    return total;
  }

  getModifierValue(powerModifierConfiguration: PowerModifierConfiguration, collection: CreatureConfigurationCollection): number {
    const modifier = powerModifierConfiguration.modifierConfiguration;
    let total = modifier.value;
    if (modifier.abilityModifier != null && modifier.abilityModifier.id !== '0') {
      const abilityModifier = this.getAbility(modifier.abilityModifier.id, collection);
      total += this.getAbilityModifier(abilityModifier, collection);
    }
    if (modifier.proficient || modifier.halfProficient) {
      const profModifierValue = this.getProfModifier(collection);
      let profValueToUse = profModifierValue;
      if (modifier.halfProficient) {
        profValueToUse = modifier.roundUp ? Math.ceil(profModifierValue / 2) : Math.floor(profModifierValue / 2);
      }
      total += profValueToUse;
    }
    if (modifier.useLevel || modifier.useHalfLevel) {
      if (collection != null) {
        const level = parseInt(collection.totalLevel.name, 10);
        let levelValueToUse = level;
        if (modifier.useHalfLevel) {
          levelValueToUse = Math.floor(level / 2);
        }
        total += levelValueToUse;
      }
    }
    return total;
  }

  getModifierTooltips(modifiers: Map<string, PowerModifierConfiguration>, collection: CreatureConfigurationCollection, includeSetAmounts = true): string[] {
    const tooltips: string[] = [];
    if (includeSetAmounts) {
      const setAmount = this.getSetModification(modifiers);
      if (setAmount != null) {
        tooltips.push(this.getModifierValueTooltip(setAmount, collection));
      }
    }
    modifiers.forEach((modifier: PowerModifierConfiguration) => {
      if (modifier.modifierConfiguration.adjustment) {
        tooltips.push(this.getModifierValueTooltip(modifier, collection));
      }
    });
    return tooltips;
  }

  private getModifierValueTooltip(powerModifierConfiguration: PowerModifierConfiguration, collection: CreatureConfigurationCollection): string {
    let value;
    const modifierValue = this.getModifierValue(powerModifierConfiguration, collection)
    if (powerModifierConfiguration.modifierConfiguration.adjustment) {
      value = this.convertScoreToString(modifierValue);
    } else {
      value = '(=)' + modifierValue.toString();
    }
    return powerModifierConfiguration.powerName + ': ' + value;
  }

  private convertScoreToString(score: number): string {
    if (score >= 0) {
      return '+' + score;
    } else {
      return '-' + (score * -1);
    }
  }

  getModifierLabels(modifiers: Map<string, PowerModifierConfiguration>, collection: CreatureConfigurationCollection, includeSetAmounts = true): LabelValue[] {
    const tooltips: LabelValue[] = [];
    if (includeSetAmounts) {
      const setAmount = this.getSetModification(modifiers);
      if (setAmount != null) {
        tooltips.push(this.getModifierLabelValue(setAmount, collection));
      }
    }
    modifiers.forEach((modifier: PowerModifierConfiguration) => {
      if (modifier.modifierConfiguration.adjustment) {
        tooltips.push(this.getModifierLabelValue(modifier, collection));
      }
    });
    return tooltips;
  }

  private getModifierLabelValue(powerModifierConfiguration: PowerModifierConfiguration, collection: CreatureConfigurationCollection): LabelValue {
    const modifierValue = this.getModifierValue(powerModifierConfiguration, collection)
    return new LabelValue(powerModifierConfiguration.powerName, this.convertScoreToString(modifierValue));
  }

  /******************************* Score Utilities *************************************/

  getAbilitySaveModifier(ability: CreatureAbilityProficiency, creature: Creature, collection: CreatureConfigurationCollection): number {
    const modifier = this.getAbilityModifier(ability, collection);
    const inheritedModifier = this.abilityService.getSaveInheritedModifier(ability);
    const miscModifier = this.abilityService.getSaveMiscModifier(ability);
    const profValue = this.getProfModifier(collection);
    const prof = this.getProfValue(ability, profValue);
    const modifiers = this.getModifiers(ability.saveModifiers, collection);
    return modifier + inheritedModifier + miscModifier + prof + modifiers - creature.creatureHealth.resurrectionPenalty;
  }

  getModifierValueFromProficiency(proficiency: Proficiency): number {
    if (proficiency != null && proficiency.miscModifier != null) {
      return proficiency.miscModifier;
    }
    return 0;
  }

  updateProficiencyModifier(value: number, prof: CreatureListProficiency, proficiency: Proficiency): void {
    if (prof.proficiency != null) {
      prof.proficiency = new Proficiency();
      if (prof.inheritedFrom.length === 0) {
        prof.proficient = proficiency != null && proficiency.proficient;
        prof.proficiency.proficient = proficiency != null && proficiency.proficient;
      } else {
        prof.proficiency.proficient = prof.proficient;
      }
      const proficient = prof.proficient || prof.inheritedFrom.length > 0;
      prof.proficiency.attribute = new ProficiencyListObject();
      prof.proficiency.attribute.id = prof.item.id;
      prof.proficiency.doubleProf = proficient && proficiency != null && proficiency.doubleProf;
      prof.proficiency.halfProf = !proficient && proficiency != null && proficiency.halfProf;
      prof.proficiency.roundUp = !proficient && proficiency != null && proficiency.halfProf && proficiency.roundUp;
      prof.proficiency.advantage = proficiency != null && proficiency.advantage;
      prof.proficiency.disadvantage = proficiency != null && proficiency.disadvantage;
      prof.proficiency.miscModifier = value;
    }
  }

  getCreatureListProficiencyBySid(sid: number, profs: CreatureListProficiency[]): CreatureListProficiency {
    if (profs == null) {
      return null;
    }
    for (let i = 0; i < profs.length; i++) {
      const prof: CreatureListProficiency = profs[i];
      if (prof.item.sid === sid) {
        return prof;
      }
      const childProf = this.getCreatureListProficiencyBySid(sid, prof.childrenProficiencies);
      if (childProf != null) {
        return childProf;
      }
    }
    return null;
  }

  private getCreatureListProficiency(itemId: string, proficiencies: CreatureListProficiency[]): CreatureListProficiency {
    if (proficiencies == null) {
      return null;
    }
    for (let i = 0; i < proficiencies.length; i++) {
      const prof = proficiencies[i];
      if (prof.item.id === itemId) {
        return prof;
      }
      const childProf = this.getCreatureListProficiency(itemId, prof.childrenProficiencies);
      if (childProf != null) {
        return childProf;
      }
    }
    return null;
  }

  private isCreatureListProficiencyProficient(prof: CreatureListProficiency): boolean {
    if (prof == null) {
      return false;
    }
    if (prof.proficient || prof.inheritedFrom.length > 0) {
      return true;
    }
    return this.isCreatureListProficiencyProficient(prof.parentProficiency);
  }

  getProfValue(ability: CreatureAbilityProficiency, profValue: number): number {
    const proficient = ability.saveProficiency != null &&
      (ability.saveProficiency.proficient || ability.saveProficiency.inheritedFrom.length > 0);
    return this.getProfModifierValue(profValue, proficient, ability.saveProficiency == null ? null : ability.saveProficiency.proficiency);
  }

  getProfModifierValue(profModifierValue: number, proficient: boolean, proficiency: Proficiency): number {
    if (proficient && proficiency != null && proficiency.doubleProf) {
      return profModifierValue * 2;
    } else if (proficient) {
      return profModifierValue;
    } else if (proficiency != null && proficiency.halfProf) {
      return proficiency.roundUp ? Math.ceil(profModifierValue / 2) : Math.floor(profModifierValue / 2);
    }
    return 0;
  }

  getSkillProfModifier(skill: CreatureSkillListProficiency, collection: CreatureConfigurationCollection): number {
    const proficient = skill.proficient || skill.inheritedFrom.length > 0;
    const profMod = this.getProfModifier(collection);
    return this.getProfModifierValue(profMod, proficient, skill.proficiency);
  }

  getSkill(id: string, collection: CreatureConfigurationCollection): CreatureSkillListProficiency {
    return _.find(collection.proficiencyCollection.skillProficiencies, (skill: CreatureSkillListProficiency) => {
      return skill.skill.id === id;
    });
  }

  getSkillAbilityModifier(skill: CreatureSkillListProficiency, creature: Creature, collection: CreatureConfigurationCollection, includeMisc = true, includeProf = true, includeModifiers = true, includeResurrectionPenalty = true): number {
    let modifier = this.getAbilityModifier(skill.abilityProficiency, collection);
    if (includeMisc) {
      modifier += this.getModifierValueFromProficiency(skill.proficiency);
    }
    if (includeProf) {
      modifier += this.getSkillProfModifier(skill, collection);
    }
    if (includeModifiers) {
      modifier = this.getModifiers(skill.modifiers, collection, modifier);
    }
    if (includeResurrectionPenalty) {
      modifier -= creature.creatureHealth.resurrectionPenalty;
    }
    return modifier;
  }

  getSkillPassiveAbilityModifier(skill: CreatureSkillListProficiency, creature: Creature, collection: CreatureConfigurationCollection, advantage: boolean, disadvantage: boolean, includeModifiers = true, includeMisc = true): number {
    let modifier = this.getSkillAbilityModifier(skill, creature, collection) + 10;
    if (advantage) {
      modifier += 5;
    }
    if (disadvantage) {
      modifier -= 5;
    }
    if (includeModifiers) {
      modifier = this.getModifiers(skill.passiveModifiers, collection, modifier);
    }
    if (includeMisc) {
      //todo
    }
    return modifier;
  }

  getMiscProfModifierValue(miscModifier: CreatureListProficiency, collection: CreatureConfigurationCollection): number {
    const profMod = this.getProfModifier(collection);
    return this.getProfModifierValue(profMod, miscModifier.proficient, miscModifier.proficiency);
  }

  getInitiativeModifier(collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true, includeProf = true): number {
    let modifier = 0;
    const dex = this.getAbilityBySid(SID.ABILITIES.DEXTERITY, collection);
    if (dex != null) {
      modifier = this.getAbilityModifier(dex, collection);
    }
    if (includeMisc || includeModifiers) {
      const miscModifier = this.getMiscModifier(SID.MISC_ATTRIBUTES.INITIATIVE, collection);
      if (includeMisc) {
        modifier += this.getMiscModifierValue(miscModifier);
      }
      if (includeModifiers) {
        modifier += this.getModifiers(miscModifier.modifiers, collection);
      }
      if (includeProf) {
        modifier += this.getMiscProfModifierValue(miscModifier, collection);
      }
    }
    return modifier;
  }

  getInitiativeModifierTooltip(collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true, includeProf = true): string {
    let parts = [];
    const dex = this.getAbilityBySid(SID.ABILITIES.DEXTERITY, collection);
    if (dex != null) {
      const dexModifier = this.getAbilityModifier(dex, collection);
      parts.push(this.translate.instant('Labels.Dex') + ' ' + dexModifier);
    }
    if (includeMisc || includeModifiers) {
      const miscModifier = this.getMiscModifier(SID.MISC_ATTRIBUTES.INITIATIVE, collection);
      if (includeModifiers) {
        const modifierTooltips: string[] = this.getModifierTooltips(miscModifier.modifiers, collection);
        parts = parts.concat(modifierTooltips);
      }
      if (includeProf) {
        parts = parts.concat(this.getMiscProfTooltip(miscModifier, collection));
      }
      if (includeMisc) {
        parts = parts.concat(this.getMiscModifierTooltip(miscModifier));
      }
    }
    return parts.join('\n');
  }

  getAbilityScoreTooltip(ability: CreatureAbilityProficiency, collection: CreatureConfigurationCollection, includeBase = true): string {
    let parts = [];
    if (includeBase) {
      const baseScore = this.getAbilityScore(ability, collection, false, false, false, false);
      parts.push(this.translate.instant('Labels.Base') + ' ' + baseScore);
    }

    const increasedScore = this.abilityService.getAbilityScoreIncreaseModifier(ability);
    if (increasedScore > 0) {
      parts.push(this.translate.instant('Labels.ChosenAbility') + ' +1');
    }

    if (ability.abilityModifier != null) {
      ability.abilityModifier.inheritedValues.forEach((inheritedValue: CreatureListModifierValue) => {
        if (inheritedValue.value !== 0) {
          let prefix = '';
          switch (inheritedValue.inheritedFrom.type) {
            case CharacteristicType.BACKGROUND:
              prefix = this.translate.instant('Labels.Background') + ' ';
              break;
            case CharacteristicType.CLASS:
              prefix = this.translate.instant('Labels.Class') + ' ';
              break;
            case CharacteristicType.RACE:
              prefix = this.translate.instant('Labels.Race') + ' ';
              break;
          }
          if (prefix !== '') {
            parts.push(prefix + inheritedValue.inheritedFrom.name + ': ' + this.abilityService.convertScoreToString(inheritedValue.value));
          }
        }
      });
    }

    const modifiers: string[] = this.getModifierTooltips(ability.scoreModifiers, collection);
    parts = parts.concat(modifiers);

    const asiModifier = this.abilityService.getASI(ability);
    if (asiModifier !== 0) {
      parts.push(this.translate.instant('Labels.ASI') + ' ' + this.abilityService.convertScoreToString(asiModifier));
    }

    const miscModifier = this.abilityService.getMiscModifier(ability);
    if (miscModifier !== 0) {
      parts.push(this.translate.instant('Labels.Misc') + ' ' + this.abilityService.convertScoreToString(miscModifier));
    }

    return parts.join('\n');
  }

  getAbilitySaveTooltip(ability: CreatureAbilityProficiency, creature: Creature, collection: CreatureConfigurationCollection): string {
    let parts = [];
    const abilityScore = this.abilityService.getScoreAndModifier(this.getAbilityScore(ability, collection));
    parts.push(this.translate.instant('Labels.Ability') + ' ' + abilityScore);

    if (ability.saveModifier != null) {
      ability.saveModifier.inheritedValues.forEach((inheritedValue: CreatureListModifierValue) => {
        if (inheritedValue.value !== 0) {
          let prefix = '';
          switch (inheritedValue.inheritedFrom.type) {
            case CharacteristicType.BACKGROUND:
              prefix = this.translate.instant('Labels.Background') + ' ';
              break;
            case CharacteristicType.CLASS:
              prefix = this.translate.instant('Labels.Class') + ' ';
              break;
            case CharacteristicType.RACE:
              prefix = this.translate.instant('Labels.Race') + ' ';
              break;
          }
          if (prefix !== '') {
            parts.push(prefix + inheritedValue.inheritedFrom.name + ': ' + this.abilityService.convertScoreToString(inheritedValue.value));
          }
        }
      });
    }

    const profValue = this.getProfModifier(collection);
    const prof = this.getProfValue(ability, profValue);
    if (prof !== 0) {
      parts.push(this.translate.instant('Labels.Prof') + ' ' + this.abilityService.convertScoreToString(prof));
    }

    const modifiers: string[] = this.getModifierTooltips(ability.saveModifiers, collection);
    parts = parts.concat(modifiers);

    const miscModifier = this.abilityService.getSaveMiscModifier(ability);
    if (miscModifier !== 0) {
      parts.push(this.translate.instant('Labels.Misc') + ' ' + this.abilityService.convertScoreToString(miscModifier));
    }
    if (creature.creatureHealth.resurrectionPenalty > 0) {
      parts.push(this.translate.instant('Labels.ResurrectionPenalty') + ' -' + creature.creatureHealth.resurrectionPenalty);
    }
    return parts.join('\n');
  }

  getModifierTooltip(abilityScore: number, creature: Creature, includeResurrectionPenalty = false): string {
    const parts = [];
    const modifier = this.abilityService.getAbilityModifier(abilityScore);
    parts.push(this.translate.instant('Labels.Ability') + ' ' + modifier);

    if (includeResurrectionPenalty && creature.creatureHealth.resurrectionPenalty > 0) {
      parts.push(this.translate.instant('Labels.ResurrectionPenalty') + ' -' + creature.creatureHealth.resurrectionPenalty);
    }

    return parts.join('\n');
  }

  getSkillTooltip(skill: CreatureSkillListProficiency, creature: Creature, collection: CreatureConfigurationCollection): string {
    let parts = [];
    const abilityModifier = this.getSkillAbilityModifier(skill, creature, collection, false, false, false, false);
    parts.push(skill.skill.ability.name + ': ' + this.abilityService.convertScoreToString(abilityModifier));

    const proficient = skill.proficient || skill.inheritedFrom.length > 0;
    const profMod = this.getProfModifier(collection);
    const profModifier = this.getProfModifierValue(profMod, proficient, skill.proficiency);
    if (profModifier !== 0) {
      parts.push(this.translate.instant('Labels.Prof') + ' ' + this.abilityService.convertScoreToString(profModifier))
    }

    const modifiers: string[] = this.getModifierTooltips(skill.modifiers, collection);
    parts = parts.concat(modifiers);

    const miscModifier = this.getModifierValueFromProficiency(skill.proficiency);
    if (miscModifier !== 0) {
      parts.push(this.translate.instant('Labels.Misc') + ' ' + this.abilityService.convertScoreToString(miscModifier));
    }
    if (creature.creatureHealth.resurrectionPenalty > 0) {
      parts.push(this.translate.instant('Labels.ResurrectionPenalty') + ' -' + creature.creatureHealth.resurrectionPenalty);
    }
    return parts.join('\n');
  }

  getSkillPassiveTooltip(skill: CreatureSkillListProficiency, creature: Creature, collection: CreatureConfigurationCollection, advantage: boolean, disadvantage: boolean, includeModifiers = true, includeMisc = true): string {
    let parts = [];
    parts.push(this.translate.instant('Labels.Base') + ' 10');
    const modifier = this.getSkillAbilityModifier(skill, creature, collection);
    parts.push(this.translate.instant('Labels.Skill') + ' +' + modifier);

    if (advantage && !disadvantage) {
      parts.push(this.translate.instant('Labels.Advantage') + ' +5');
    }
    if (disadvantage && !advantage) {
      parts.push(this.translate.instant('Labels.Disadvantage') + ' -5');
    }
    if (includeModifiers) {
      const modifiers: string[] = this.getModifierTooltips(skill.passiveModifiers, collection);
      parts = parts.concat(modifiers);
    }
    if (includeMisc) {
      //todo
    }
    return parts.join('\n');
  }

  getMiscProfTooltip(miscModifier: CreatureListProficiency, collection: CreatureConfigurationCollection): string[] {
    const parts: string[] = [];
    const prof = this.getMiscProfModifierValue(miscModifier, collection);
    if (prof !== 0) {
      let prefix = this.translate.instant('Prof');
      if (miscModifier.proficiency.halfProf) {
        prefix = this.translate.instant('HalfProf');
        if (miscModifier.proficiency.roundUp) {
          prefix += ', ' + this.translate.instant('RoundUp');
        }
      } else if (miscModifier.proficiency.doubleProf) {
        prefix = this.translate.instant('DoubleProf');
      }
      parts.push(prefix + ': ' + this.abilityService.convertScoreToString(prof));
    }
    return parts;
  }

  getCurrentHP(creature: Creature, collection: CreatureConfigurationCollection, includeTemp = true): number {
    let current = creature.creatureHealth.currentHp;
    if (includeTemp) {
      current += creature.creatureHealth.tempHp;
    }
    return current;
  }

  getCurrentHPTooltip(creature: Creature, includeTemp = true): string {
    const parts = [];
    parts.push(this.translate.instant('Labels.Current') + ' ' + creature.creatureHealth.currentHp);
    if (includeTemp && creature.creatureHealth.tempHp > 0) {
      parts.push(this.translate.instant('Labels.Temp') + ' ' + creature.creatureHealth.tempHp);
    }
    return parts.join('\n');
  }

  /******************************************* Concentration ******************************************/

  getConcentrationModifier(creature: Creature, collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true): number {
    const con = this.getAbilityBySid(SID.ABILITIES.CONSTITUTION, collection);
    let concentration = this.getAbilitySaveModifier(con, creature, collection);

    if (includeMisc || includeModifiers) {
      const concentrationModifier = this.getMiscModifier(SID.MISC_ATTRIBUTES.CONCENTRATION, collection);
      if (concentrationModifier != null) {
        if (includeMisc) {
          concentration += this.getMiscModifierValue(concentrationModifier);
        }
        if (includeModifiers) {
          concentration += this.getModifiers(concentrationModifier.modifiers, collection);
        }
      }
    }
    return concentration;
  }

  getConcentrationProficiency(collection: CreatureConfigurationCollection, includeConstitution = true): CreatureListProficiency {
    const concentrationProficiency = this.getMiscModifier(SID.MISC_ATTRIBUTES.CONCENTRATION, collection);
    if (includeConstitution) {
      const constitution = this.getAbilityBySid(SID.ABILITIES.CONSTITUTION, collection);
      concentrationProficiency.proficiency.advantage = (concentrationProficiency.proficiency.advantage || constitution.saveProficiency.proficiency.advantage) && !(concentrationProficiency.proficiency.disadvantage || constitution.saveProficiency.proficiency.disadvantage);
      concentrationProficiency.proficiency.disadvantage = !(concentrationProficiency.proficiency.advantage || constitution.saveProficiency.proficiency.advantage) && (concentrationProficiency.proficiency.disadvantage || constitution.saveProficiency.proficiency.disadvantage);
    }
    return concentrationProficiency;
  }

  /******************************************* Spell Casting ******************************************/

  getSpellModifier(spellCastingAbility: CreatureAbilityProficiency,
                   collection: CreatureConfigurationCollection, spellcasting: Spellcasting,
                   attackType: AttackType, characteristicId: string): PowerModifier {
    let abilityModifier: number;
    let profModifier = this.getProfModifier(collection);
    const proficiency = this.getSpellcastingProficiency(spellcasting);
    profModifier = proficiency == null ? 0 : this.getProfModifierValue(profModifier, proficiency.proficient, proficiency);

    if (spellCastingAbility == null) {
      abilityModifier = 0;
    } else {
      abilityModifier = this.getAbilityModifier(spellCastingAbility, collection);
    }

    const powerModifier = new PowerModifier();
    powerModifier.proficiency = proficiency;
    powerModifier.ability = spellCastingAbility;
    powerModifier.abilityModifier = abilityModifier;
    powerModifier.profModifier = profModifier;
    powerModifier.attackType = attackType;

    if (characteristicId != null) {
      const config = this.getCharacteristicPowerModifier(characteristicId, collection);
      if (config != null) {
        switch (attackType) {
          case AttackType.ATTACK:
            powerModifier.modifiers = config.spellAttackModifiers;
            break;
          case AttackType.SAVE:
            powerModifier.modifiers = config.spellSaveModifiers;
            break;
        }
      }
    }

    return powerModifier;
  }

  private getSpellcastingProficiency(spellcasting: Spellcasting): Proficiency {
    const prof = new Proficiency();
    if (spellcasting != null) {
      prof.proficient = spellcasting.proficiency.proficient;
      prof.doubleProf = spellcasting.proficiency.doubleProf;
      prof.halfProf = spellcasting.proficiency.halfProf;
      prof.roundUp = spellcasting.proficiency.roundUp;
      prof.miscModifier = spellcasting.proficiency.miscModifier;
      prof.advantage = spellcasting.proficiency.advantage;
      prof.disadvantage = spellcasting.proficiency.disadvantage;
    }
    return prof;
  }

  getCharacteristicPowerModifier(characteristicId: string, collection: CreatureConfigurationCollection): CreatureCharacteristicConfigurationCollectionItem {
    for (let i = 0; i < collection.characteristicConfigurationCollection.items.length; i++) {
      const item = collection.characteristicConfigurationCollection.items[i];
      if (item.characteristicId === characteristicId) {
        return item;
      }
    }
    return null;
  }

  addSpells(creature: Creature, characteristicId: string, spells: CreatureSpell[]): Promise<any> {
    const creatureSpellList = this.getCreatureSpellPowerList(spells, characteristicId);
    return this.http.put<CreaturePower[]>(`${environment.backendUrl}/creatures/${creature.id}/spells`, creatureSpellList).toPromise().then((response: any) => {
      if (characteristicId === 'innate') {
        creature.innateSpellCasting.spells = creature.innateSpellCasting.spells.concat(spells);
      } else {
        creature.creatureSpellCasting.spells = creature.creatureSpellCasting.spells.concat(spells);
      }
      return response;
    });
  }

  private getCreatureSpellPowerList(spells: CreatureSpell[], characteristicId: string): CreatureSpellList {
    const creatureSpellList = new CreatureSpellList();
    creatureSpellList.creatureSpells = spells;
    spells.forEach((creatureSpell: CreatureSpell) => {
      creatureSpell.assignedCharacteristic = characteristicId;
    });
    return creatureSpellList;
  }

  removeSpell(creature: Creature, creatureSpell: CreatureSpell): Promise<any> {
    return this.removePower(creature, creatureSpell).then((response: any) => {
      if (creatureSpell.innate) {
        const spells: CreatureSpell[] = creature.innateSpellCasting.spells;
        const index = _.indexOf(spells, creatureSpell);
        if (index > -1) {
          spells.splice(index, 1);
        }
      } else {
        const spells: CreatureSpell[] = creature.creatureSpellCasting.spells;
        const index = _.indexOf(spells, creatureSpell);
        if (index > -1) {
          spells.splice(index, 1);
        }
      }
      return response;
    });
  }

  getSpellSlotTooltip(creatureSpellSlot: CreatureSpellSlot, collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true): string {
    let parts = [];
    parts.push(this.translate.instant('Labels.Base') + ' ' + creatureSpellSlot.calculatedMax);

    if (includeModifiers) {
      const slotConfiguration: CreatureListProficiency = this.getSpellSlotModifiers(creatureSpellSlot.level, collection);
      if (slotConfiguration != null) {
        const modifierTooltips: string[] = this.getModifierTooltips(slotConfiguration.modifiers, collection);
        parts = parts.concat(modifierTooltips);
      }
    }

    if (includeMisc && creatureSpellSlot.maxModifier !== 0) {
      parts.push(this.translate.instant('Labels.Misc') + ' ' + creatureSpellSlot.maxModifier);
    }

    return parts.join('\n');
  }

  getMaxSpellSlots(creatureSpellSlot: CreatureSpellSlot, collection: CreatureConfigurationCollection, includeMisc = true, includeModifiers = true): number {
    let max = creatureSpellSlot.calculatedMax;
    if (includeMisc) {
      max += creatureSpellSlot.maxModifier;
    }
    if (includeModifiers) {
      const spellSlotModifiers: CreatureListProficiency = this.getSpellSlotModifiers(creatureSpellSlot.level, collection);
      if (spellSlotModifiers != null) {
        max += this.getModifiers(spellSlotModifiers.modifiers, collection);
      }
    }
    return max;
  }

  getMaxSpellLevel(creature: Creature, collection: CreatureConfigurationCollection): number {
    if (creature == null || collection == null) {
      return 0;
    }
    let maxLevel = 0;
    creature.creatureSpellCasting.spellSlots.forEach((slot: CreatureSpellSlot) => {
      const max = this.getMaxSpellSlots(slot, collection, true);
      if (max > 0 && slot.level > maxLevel) {
        maxLevel = slot.level;
      }
    });
    return maxLevel;
  }

  getSpellSlotModifiers(level: number, collection: CreatureConfigurationCollection): CreatureListProficiency {
    const sid = this.getSlotSid(level);
    return this.getMiscModifier(sid, collection);
  }

  getSlotSid(level: number): number {
    switch (level) {
      case 1:
        return SID.MISC_ATTRIBUTES.SLOT_1;
      case 2:
        return SID.MISC_ATTRIBUTES.SLOT_2;
      case 3:
        return SID.MISC_ATTRIBUTES.SLOT_3;
      case 4:
        return SID.MISC_ATTRIBUTES.SLOT_4;
      case 5:
        return SID.MISC_ATTRIBUTES.SLOT_5;
      case 6:
        return SID.MISC_ATTRIBUTES.SLOT_6;
      case 7:
        return SID.MISC_ATTRIBUTES.SLOT_7;
      case 8:
        return SID.MISC_ATTRIBUTES.SLOT_8;
      case 9:
        return SID.MISC_ATTRIBUTES.SLOT_9;
      default:
        return -1;
    }
  }

  /**************************** Filters *******************************/

  getFilters(creature: Creature, filterType: FilterType): Filters {
    const filters = new Filters();
    for (let i = 0; i < creature.filters.length; i++) {
      const filter: CreatureFilter = creature.filters[i];
      if (filter.filterType === filterType) {
        filters.filterValues = filter.filterValues;
        break;
      }
    }

    for (let i = 0; i < filters.filterValues.length; i++) {
      const filterValue = filters.filterValues[i];
      if ((filterValue.key === FilterKey.TAGS && filterValue.value !== DEFAULT_FILTER_TAG_VALUE)
        || (filterValue.key !== FilterKey.TAGS && filterValue.value !== DEFAULT_FILTER_VALUE)) {
        filters.filtersApplied = true;
        break;
      }
    }

    return filters;
  }

  /**************************** Sorts *******************************/

  getSorts(creature: Creature, sortType: SortType): Sorts {
    const sorts = new Sorts();
    for (let i = 0; i < creature.sorts.length; i++) {
      const sort: CreatureSort = creature.sorts[i];
      if (sort.sortType === sortType) {
        sorts.sortValues = sort.sortValues;
        break;
      }
    }

    return sorts;
  }
}
