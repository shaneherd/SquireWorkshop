import {Injectable} from '@angular/core';
import {
  ImportAbilityModifier,
  ImportAlignment,
  ImportAttackDamage,
  ImportAttackTypeEnum,
  ImportChallengeRating,
  ImportConditionId,
  ImportCreatureSense,
  ImportCreatureSenseType,
  ImportCreatureSkill,
  ImportDamageModifier,
  ImportDamageModifierType,
  ImportEquipmentObject,
  ImportItem,
  ImportItemConfiguration,
  ImportLimitedUseType,
  ImportMonster,
  ImportMonsterAction,
  ImportMonsterActionType,
  ImportMonsterFeature,
  ImportMonsterType,
  ImportSpell
} from '../../../shared/imports/import-item';
import {ListObject} from '../../../shared/models/list-object';
import {
  InnateSpellConfiguration,
  Monster,
  MonsterAbilityScore,
  MonsterAction,
  MonsterFeature
} from '../../../shared/models/creatures/monsters/monster';
import {MonsterService} from '../creatures/monster.service';
import {ImportSharedService} from './import-shared.service';
import {ImportCacheService} from './import-cache.service';
import {SID} from '../../../constants';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {Proficiency, ProficiencyListObject, ProficiencyType} from '../../../shared/models/proficiency';
import {AbilityService} from '../attributes/ability.service';
import * as _ from 'lodash';
import {DamageModifierType} from '../../../shared/models/characteristics/damage-modifier-type.enum';
import {DamageModifier} from '../../../shared/models/characteristics/damage-modifier';
import {ImportAttributeService} from './import-attribute.service';
import {Speed} from '../../../shared/models/speed';
import {SpeedType} from '../../../shared/models/speed-type.enum';
import {ChallengeRating} from '../../../shared/models/creatures/monsters/challenge-rating.enum';
import {DiceCollection} from '../../../shared/models/characteristics/dice-collection';
import {MonsterType} from '../../../shared/models/creatures/monsters/monster-type.enum';
import {Sense} from '../../../shared/models/sense.enum';
import {SenseValue} from '../../../shared/models/sense-value';
import {SpellSlots} from '../../../shared/models/spell-slots';
import {CharacterLevelService} from '../character-level.service';
import {ImportPowerService} from './import-power.service';
import {SpellConfiguration} from '../../../shared/models/characteristics/spell-configuration';
import {LimitedUse} from '../../../shared/models/powers/limited-use';
import {LimitedUseType} from '../../../shared/models/limited-use-type.enum';
import {AttackType} from '../../../shared/models/attack-type.enum';
import {ImportItemService} from './import-item.service';
import {Action} from '../../../shared/models/action.enum';
import {WeaponRangeType} from '../../../shared/models/items/weapon-range-type.enum';
import {DamageConfiguration} from '../../../shared/models/damage-configuration';
import {ItemListObject} from '../../../shared/models/items/item-list-object';
import {ItemQuantity} from '../../../shared/models/items/item-quantity';

@Injectable({
  providedIn: 'root'
})
export class ImportMonsterService {

  constructor(
    private importSharedService: ImportSharedService,
    private importCacheService: ImportCacheService,
    private importAttributeService: ImportAttributeService,
    private importPowerService: ImportPowerService,
    private importItemService: ImportItemService,
    private monsterService: MonsterService,
    private abilityService: AbilityService,
    private characterLevelService: CharacterLevelService
  ) { }

  private process(monster: Monster, importItem: ImportItem): Promise<any> {
    switch (importItem.selectedAction) {
      case 'REPLACE_EXISTING':
        monster.id = importItem.selectedDuplicate.id;
        return this.monsterService.updateMonster(monster).then(() => {
          this.importSharedService.completeItem(importItem, monster.id);
        }, () => {
          this.importSharedService.finishImportingItem(importItem, false);
        });
      case 'INSERT_AS_NEW':
        return this.monsterService.createMonster(monster).then((id: string) => {
          const cache = this.importCacheService.getCachedMonsters();
          if (cache != null) {
            const listObject = new ListObject(id, monster.name);
            cache.push(listObject);
          }
          monster.id = id;
          this.importSharedService.completeItem(importItem, id);
        }, () => {
          this.importSharedService.finishImportingItem(importItem, false);
        });
      default:
        return Promise.resolve();
    }
  }

  getPossibleDuplicatesForMonster(importItem: ImportItem): ListObject[] {
    const source: ListObject[] = this.importCacheService.getCachedMonsters();
    return this.importSharedService.getPossibleDuplicates(importItem, source);
  }

  getPrioritizedConfigItemsForMonster(config: ImportItemConfiguration): ImportItemConfiguration[] {
    if (config.importItem.type !== 'Monster') {
      return [];
    }
    const configs: ImportItemConfiguration[] = [];
    //spells, equipment, monster
    configs.push(config);
    return configs;
  }

  private getAbilityScore(importAbility: ImportAbilityModifier, abilitySID: number): MonsterAbilityScore {
    const abilityScore = new MonsterAbilityScore();
    abilityScore.ability = this.abilityService.getAbilityBySid(abilitySID);
    abilityScore.value = importAbility.roll;
    return abilityScore;
  }

  private getConditionName(conditionId: ImportConditionId): string {
    switch (conditionId) {
      case 1:
        return 'Blinded';
      case 2:
        return 'Charmed';
      case 3:
        return 'Deafened';
      case 4:
        return 'Frightened';
      case 5:
        return 'Grappled';
      case 6:
        return 'Incapacitated';
      case 7:
        return 'Invisible';
      case 8:
        return 'Paralyzed';
      case 9:
        return 'Petrified';
      case 10:
        return 'Poisoned';
      case 11:
        return 'Prone';
      case 12:
        return 'Restrained';
      case 13:
        return 'Stunned';
      case 14:
        return 'Unconscious';
      case 15:
        return 'Exhaustion';
    }
    return null;
  }

  private async getConditionImmunities(immunities: ImportConditionId[]): Promise<ListObject[]> {
    const list: ListObject[] = [];
    const cachedConditions: ListObject[] = await this.importCacheService.getAttributesByType(AttributeType.CONDITION);
    if (cachedConditions != null && immunities != null) {
      for (const conditionId of immunities) {
        const conditionName = this.getConditionName(conditionId);
        if (conditionName != null) {
          const condition = _.find(cachedConditions, function(_condition) { return _condition.name.toLowerCase() === conditionName.toLowerCase() });
          if (condition != null) {
            list.push(condition);
          }
        }
      }
    }
    return list;
  }

  private getDamageModifierType(type: ImportDamageModifierType): DamageModifierType {
    switch (type) {
      case 'NORMAL':
        return DamageModifierType.NORMAL;
      case 'RESISTANT':
        return DamageModifierType.RESISTANT;
      case 'IMMUNE':
        return DamageModifierType.IMMUNE;
      case 'VULNERABLE':
        return DamageModifierType.VULNERABLE;
    }
  }

  private async getDamageModifiers(damageModifiers: ImportDamageModifier[]): Promise<DamageModifier[]> {
    const list: DamageModifier[] = [];
    if (damageModifiers != null) {
      await this.importCacheService.getAttributesByType(AttributeType.DAMAGE_TYPE);
      for (const damageModifier of damageModifiers) {
        const modifier = new DamageModifier();
        const damageTypeImportItem = this.importAttributeService.getDamageTypeImportItem(damageModifier.damageType);
        modifier.damageType = this.importAttributeService.getCachedDamageType(damageTypeImportItem);
        modifier.damageModifierType = this.getDamageModifierType(damageModifier.damageModifierType);
        modifier.condition = damageModifier.condition;

        if (modifier.damageModifierType !== DamageModifierType.NORMAL) {
          list.push(modifier);
        }
      }
    }
    return list;
  }

  private async getAlignment(alignment: ImportAlignment): Promise<ListObject> {
    const cache: ListObject[] = await this.importCacheService.getAttributesByType(AttributeType.ALIGNMENT);
    if (cache != null) {
      return _.find(cache, function(_alignment) { return _alignment.name.toLowerCase() === alignment.toLowerCase() });
    }
    return null;
  }

  private getMonsterType(monsterType: ImportMonsterType): MonsterType {
    switch (monsterType.name) {
      case 'Aberration':
        return MonsterType.ABERRATION;
      case 'Beast':
        return MonsterType.BEAST;
      case 'Celestial':
        return MonsterType.CELESTIAL;
      case 'Construct':
        return MonsterType.CONSTRUCT;
      case 'Dragon':
        return MonsterType.DRAGON;
      case 'Elemental':
        return MonsterType.ELEMENTAL;
      case 'Fey':
        return MonsterType.FEY;
      case 'Fiend':
        return MonsterType.FIEND;
      case 'Giant':
        return MonsterType.GIANT;
      case 'Humanoid':
        return MonsterType.HUMANOID;
      case 'Monstrosity':
        return MonsterType.MONSTROSITY;
      case 'Ooze':
        return MonsterType.OOZE;
      case 'Plant':
        return MonsterType.PLANT;
      case 'Undead':
        return MonsterType.UNDEAD;
    }
    return null;
  }

  private getChallengeRating(challengeRating: ImportChallengeRating): ChallengeRating {
    switch (challengeRating) {
      case 'ZERO':
        return ChallengeRating.ZERO;
      case 'EIGHTH':
        return ChallengeRating.EIGHTH;
      case 'QUARTER':
        return ChallengeRating.QUARTER;
      case 'HALF':
        return ChallengeRating.HALF;
      case 'ONE':
        return ChallengeRating.ONE;
      case 'TWO':
        return ChallengeRating.TWO;
      case 'THREE':
        return ChallengeRating.THREE;
      case 'FOUR':
        return ChallengeRating.FOUR;
      case 'FIVE':
        return ChallengeRating.FIVE;
      case 'SIX':
        return ChallengeRating.SIX;
      case 'SEVEN':
        return ChallengeRating.SEVEN;
      case 'EIGHT':
        return ChallengeRating.EIGHT;
      case 'NINE':
        return ChallengeRating.NINE;
      case 'TEN':
        return ChallengeRating.TEN;
      case 'ELEVEN':
        return ChallengeRating.ELEVEN;
      case 'TWELVE':
        return ChallengeRating.TWELVE;
      case 'THIRTEEN':
        return ChallengeRating.THIRTEEN;
      case 'FOURTEEN':
        return ChallengeRating.FOURTEEN;
      case 'FIFTEEN':
        return ChallengeRating.FIFTEEN;
      case 'SIXTEEN':
        return ChallengeRating.SIXTEEN;
      case 'SEVENTEEN':
        return ChallengeRating.SEVENTEEN;
      case 'EIGHTEEN':
        return ChallengeRating.EIGHTEEN;
      case 'NINETEEN':
        return ChallengeRating.NINETEEN;
      case 'TWENTY':
        return ChallengeRating.TWENTY;
      case 'TWENTY_ONE':
        return ChallengeRating.TWENTY_ONE;
      case 'TWENTY_TWO':
        return ChallengeRating.TWENTY_TWO;
      case 'TWENTY_THREE':
        return ChallengeRating.TWENTY_THREE;
      case 'TWENTY_FOUR':
        return ChallengeRating.TWENTY_FOUR;
      case 'TWENTY_FIVE':
        return ChallengeRating.TWENTY_FIVE;
      case 'TWENTY_SIX':
        return ChallengeRating.TWENTY_SIX;
      case 'TWENTY_SEVEN':
        return ChallengeRating.TWENTY_SEVEN;
      case 'TWENTY_EIGHT':
        return ChallengeRating.TWENTY_EIGHT;
      case 'TWENTY_NINE':
        return ChallengeRating.TWENTY_NINE;
      case 'THIRTY':
        return ChallengeRating.THIRTY;
      default:
        return ChallengeRating.ZERO;
    }
  }

  private getSense(type: ImportCreatureSenseType): Sense {
    switch (type) {
      case 'Blindsight':
        return Sense.BLINDSIGHT;
      case 'Darkvision':
        return Sense.DARKVISION;
      case 'Telepathy':
        return Sense.TELEPATHY;
      case 'Tremorsense':
        return Sense.TREMORSENSE;
      case 'Truesight':
        return Sense.TRUESIGHT;
    }
  }

  async getMonster(config: ImportItemConfiguration): Promise<Monster> {
    const importItem = config.importItem as ImportMonster;
    const monster = new Monster();
    if (importItem != null) {
      monster.name = importItem.name;
      monster.monsterType = this.getMonsterType(importItem.monsterType);
      monster.typeVariation = importItem.typeVariation;
      monster.size = this.importSharedService.getSize(importItem.size);
      monster.challengeRating = this.getChallengeRating(importItem.challengeRating);
      monster.experience = importItem.exp;
      monster.alignment = await this.getAlignment(importItem.alignment);
      monster.ac = importItem.ac;
      monster.legendaryPoints = importItem.legendaryPoints;

      monster.abilityScores = [];
      monster.abilityScores.push(this.getAbilityScore(importItem.str, SID.ABILITIES.STRENGTH));
      monster.abilityScores.push(this.getAbilityScore(importItem.dex, SID.ABILITIES.DEXTERITY));
      monster.abilityScores.push(this.getAbilityScore(importItem.con, SID.ABILITIES.CONSTITUTION));
      monster.abilityScores.push(this.getAbilityScore(importItem.intelligence, SID.ABILITIES.INTELLIGENCE));
      monster.abilityScores.push(this.getAbilityScore(importItem.wis, SID.ABILITIES.WISDOM));
      monster.abilityScores.push(this.getAbilityScore(importItem.cha, SID.ABILITIES.CHARISMA));

      monster.conditionImmunities = await this.getConditionImmunities(importItem.conditionImmunities);
      monster.damageModifiers = await this.getDamageModifiers(importItem.damageModifiers);

      const languages = await this.importCacheService.getAttributesByType(AttributeType.LANGUAGE);
      const languageProfs = this.importSharedService.getProficiencyList(importItem.languageProfs, languages, ProficiencyType.LANGUAGE);
      const skills = await this.importCacheService.getAttributesByType(AttributeType.SKILL);
      const skillProfs = this.importSharedService.getCreatureSkillProficiencyList(importItem.skillProfs, skills, ProficiencyType.SKILL);
      const abilities = await this.importCacheService.getAttributesByType(AttributeType.ABILITY);
      const abilityProfs = this.importSharedService.getAbilityProficiencies(importItem.savingThrowProfs, abilities, ProficiencyType.ABILITY);
      monster.attributeProfs = languageProfs.concat(skillProfs).concat(abilityProfs);

      monster.speeds = [];
      monster.speeds.push(new Speed(SpeedType.WALK, importItem.speed));
      monster.speeds.push(new Speed(SpeedType.CRAWL, importItem.crawling));
      monster.speeds.push(new Speed(SpeedType.CLIMB, importItem.climbing));
      monster.speeds.push(new Speed(SpeedType.SWIM, importItem.swimming));
      monster.speeds.push(new Speed(SpeedType.FLY, importItem.flying));
      monster.speeds.push(new Speed(SpeedType.BURROW, importItem.burrow));
      monster.hover = importItem.hover;

      monster.hitDice = new DiceCollection();
      monster.hitDice.numDice = importItem.hpNumDice;
      monster.hitDice.diceSize = this.importSharedService.getDiceSizeFromImportDiceSizeEnum(importItem.hpDiceSize);
      monster.hitDice.miscModifier = importItem.hpMod;
      monster.hitDice.abilityModifier = this.abilityService.getAbilityBySid(SID.ABILITIES.CONSTITUTION);

      monster.senses = [];
      importItem.senses.forEach((importSense: ImportCreatureSense) => {
        const senseValue: SenseValue = new SenseValue();
        senseValue.sense = this.getSense(importSense.type)
        senseValue.range = importSense.range;
        monster.senses.push(senseValue);
      });

      monster.spellcaster = importItem.spellcaster;
      if (monster.spellcaster) {
        const level = this.characterLevelService.getLevelByExp(0);
        monster.spellcasterLevel = new ListObject(level.id, level.name);

        const innateLevelName = this.getInnateCasterLevelId(monster.challengeRating);
        const innateLevel = this.characterLevelService.getLevelByName(innateLevelName);
        monster.innateSpellcasterLevel = new ListObject(innateLevel.id, innateLevel.name);

        monster.spellAttackModifier = importItem.spellAttackMod;
        monster.spellSaveModifier = importItem.spellSaveDCMod;
        const spellcastingAbility = this.importSharedService.getAbilityById(importItem.spellcastingAbilityId);
        if (spellcastingAbility != null) {
          monster.spellcastingAbility = spellcastingAbility.id;
        } else {
          monster.spellcastingAbility = '0';
        }

        const innateSpellcastingAbility = this.importSharedService.getAbilityById(importItem.innateSpellcastingAbilityId);
        if (innateSpellcastingAbility != null) {
          monster.innateSpellcastingAbility = innateSpellcastingAbility.id;
        } else {
          monster.innateSpellcastingAbility = '0';
        }

        monster.innateSpellAttackModifier = importItem.innateSpellAttackMod;
        monster.innateSpellSaveModifier = importItem.innateSpellSaveDCMod;

        monster.casterType = null;
        monster.spellSlots = new SpellSlots();
        monster.spellSlots.slot1 = importItem.spellSlots.slot1;
        monster.spellSlots.slot2 = importItem.spellSlots.slot2;
        monster.spellSlots.slot3 = importItem.spellSlots.slot3;
        monster.spellSlots.slot4 = importItem.spellSlots.slot4;
        monster.spellSlots.slot5 = importItem.spellSlots.slot5;
        monster.spellSlots.slot6 = importItem.spellSlots.slot6;
        monster.spellSlots.slot7 = importItem.spellSlots.slot7;
        monster.spellSlots.slot8 = importItem.spellSlots.slot8;
        monster.spellSlots.slot9 = importItem.spellSlots.slot9;

        monster.spells = [];
        importItem.spells.forEach((importSpell: ImportSpell) => {
          const spellConfiguration = new SpellConfiguration();
          const spell = this.importPowerService.getSpellListObject(importSpell);
          spellConfiguration.spell = new ListObject(spell.id, spell.name);
          monster.spells.push(spellConfiguration);
        });

        monster.innateSpells = [];
        importItem.innateSpells.forEach((importSpell: ImportSpell) => {
          const spell = this.importPowerService.getSpellListObject(importSpell);
          const innateConfig = new InnateSpellConfiguration();
          innateConfig.spell = new ListObject(spell.id, spell.name);
          innateConfig.limitedUse = this.getInnateSpellLimitedUse(spell, importItem);
          innateConfig.slot = importSpell.level;
          monster.innateSpells.push(innateConfig);
        });

        monster.innateSpellcaster = monster.innateSpells.length > 0 || monster.innateSpellcastingAbility !== '0';
      }

      monster.items = [];
      for (const importEquipmentObject of importItem.items) {
        const itemQuantity = new ItemQuantity();
        itemQuantity.item = new ItemListObject(importEquipmentObject.finalId, importEquipmentObject.name);
        itemQuantity.quantity = importEquipmentObject.quantity;
        monster.items.push(itemQuantity);
      }
    }
    return monster;
  }

  private getInnateCasterLevelId(challengeRating: ChallengeRating): string {
    switch (challengeRating) {
      case ChallengeRating.ZERO:
      case ChallengeRating.EIGHTH:
      case ChallengeRating.QUARTER:
      case ChallengeRating.HALF:
      case ChallengeRating.ONE:
        return '1';
      case ChallengeRating.TWO:
        return '2';
      case ChallengeRating.THREE:
        return '3';
      case ChallengeRating.FOUR:
        return '4';
      case ChallengeRating.FIVE:
        return '5';
      case ChallengeRating.SIX:
        return '6';
      case ChallengeRating.SEVEN:
        return '7';
      case ChallengeRating.EIGHT:
        return '8';
      case ChallengeRating.NINE:
        return '9';
      case ChallengeRating.TEN:
        return '10';
      case ChallengeRating.ELEVEN:
        return '11';
      case ChallengeRating.TWELVE:
        return '12';
      case ChallengeRating.THIRTEEN:
        return '13';
      case ChallengeRating.FOURTEEN:
        return '14';
      case ChallengeRating.FIFTEEN:
        return '15';
      case ChallengeRating.SIXTEEN:
        return '16';
      case ChallengeRating.SEVENTEEN:
        return '17';
      case ChallengeRating.EIGHTEEN:
        return '18';
      case ChallengeRating.NINETEEN:
        return '19';
      case ChallengeRating.TWENTY:
      case ChallengeRating.TWENTY_ONE:
      case ChallengeRating.TWENTY_TWO:
      case ChallengeRating.TWENTY_THREE:
      case ChallengeRating.TWENTY_FOUR:
      case ChallengeRating.TWENTY_FIVE:
      case ChallengeRating.TWENTY_SIX:
      case ChallengeRating.TWENTY_SEVEN:
      case ChallengeRating.TWENTY_EIGHT:
      case ChallengeRating.TWENTY_NINE:
      case ChallengeRating.THIRTY:
        return '20';
    }
    return '1';
  }

  private getLimitedUseType(limitedUseType: ImportLimitedUseType): LimitedUseType {
    switch (limitedUseType) {
      case 'NUM_PER_DAY':
        return LimitedUseType.QUANTITY;
      case 'RECHARGE_RANGE':
        return LimitedUseType.RECHARGE;
    }
  }

  getMonsterFeatures(config: ImportItemConfiguration): MonsterFeature[] {
    const importItem = config.importItem as ImportMonster;
    const features: MonsterFeature[] = [];
    importItem.features.forEach((feature: ImportMonsterFeature) => {
      features.push(this.getMonsterFeature(feature));
    });
    return features;
  }

  private getMonsterFeature(importItem: ImportMonsterFeature): MonsterFeature {
    const feature = new MonsterFeature();
    if (importItem != null) {
      feature.name = importItem.name;
      feature.description = importItem.notes;

      if (importItem.limitedUse) {
        feature.limitedUse = new LimitedUse()
        feature.limitedUse.limitedUseType = this.getLimitedUseType(importItem.limitedUseType);
        if (feature.limitedUse.limitedUseType === LimitedUseType.QUANTITY) {
          feature.limitedUse.quantity = importItem.numPerDay;
        } else {
          feature.limitedUse.quantity = 1;
          feature.rechargeMin = importItem.rechargeMin;
          feature.rechargeMax = importItem.rechargeMax;
        }
      }
    }
    return feature;
  }

  private getAttackType(attackType: ImportAttackTypeEnum): AttackType {
    switch (attackType) {
      case 'ATTACK':
      case 'RANGED':
      case 'THROWN':
        return AttackType.ATTACK;
      case 'SAVE':
        return AttackType.SAVE;
      case 'HEAL':
        return AttackType.HEAL;
    }
  }

  private getActionType(monsterActionType: ImportMonsterActionType): Action {
    switch (monsterActionType) {
      case 'NORMAL':
        return Action.STANDARD;
      case 'LEGENDARY':
        return Action.LEGENDARY;
      case 'LAIR':
        return Action.LAIR;
      case 'REACTION':
        return Action.REACTION;
      default:
        return Action.STANDARD;
    }
  }

  private getDamageConfigurations(importDamages: ImportAttackDamage[]): DamageConfiguration[] {
    const damages: DamageConfiguration[] = [];
    importDamages.forEach((attackDamage: ImportAttackDamage) => {
      const config = this.importItemService.getDamageConfiguration(attackDamage.numDice, this.importSharedService.getImportDiceSize(attackDamage.diceSize), attackDamage.damageTypeImportItem, attackDamage.damageMod, attackDamage.damageAbility);
      damages.push(config);
    });
    return damages;
  }

  async getMonsterActions(config: ImportItemConfiguration): Promise<MonsterAction[]> {
    const importItem = config.importItem as ImportMonster;
    const actions: MonsterAction[] = [];
    for (const action of importItem.actions) {
      const monsterAction = await this.getMonsterAction(action);
      if (monsterAction != null) {
        actions.push(monsterAction);
      }
    }
    return actions;
  }

  private getRangeValues(range: string): number[] {
    const ranges = [];

    const regExp = /(\d+)/g;
    const matches = range.match(regExp)

    if (matches != null) {
      matches.forEach((matchValue: string) => {
        ranges.push(parseInt(matchValue, 10));
      });
    }

    return ranges;
  }

  async getMonsterAction(importItem: ImportMonsterAction): Promise<MonsterAction> {
    const action = new MonsterAction();
    if (importItem != null && importItem.monsterActionAttackType !== 'SPELL' && !importItem.nonAttackSpell) {
      action.name = importItem.name;
      action.description = importItem.notes;
      action.actionType = this.getActionType(importItem.monsterActionType);
      if (action.actionType === Action.LEGENDARY) {
        action.legendaryCost = importItem.legendaryCost;
      }

      if (importItem.attack) {
        if (importItem.monsterActionAttackType === 'WEAPON_MELEE' || importItem.monsterActionAttackType === 'OTHER') {
          action.rangeType = WeaponRangeType.MELEE;
          action.reach = 5;
        } else if (importItem.monsterActionAttackType === 'WEAPON_RANGED') {
          action.rangeType = WeaponRangeType.RANGED;
          const ranges = this.getRangeValues(importItem.range);
          action.normalRange = ranges.length > 0 ? ranges[0] : 0;
          action.longRange = ranges.length > 1 ? ranges[1] : 0;
          if (importItem.ammo != null) {
            const ammo = await this.importItemService.getAmmo(importItem.ammo);
            if (ammo != null) {
              action.ammoType = new ListObject(ammo.id, ammo.name);
            }
          }
        }

        const attackType = this.getAttackType(importItem.attackType);
        switch (attackType) {
          case AttackType.ATTACK:
            action.attackType = AttackType.ATTACK;
            action.attackMod = importItem.attackMod;
            action.halfOnSave = importItem.halfOnMissSave;
            action.damageConfigurations = this.getDamageConfigurations(importItem.attackDamages);
            break;
          case AttackType.SAVE:
            action.attackType = AttackType.SAVE;
            action.attackMod = importItem.saveMod;
            action.halfOnSave = importItem.halfOnMissSave;
            const saveType = this.importSharedService.getAbilityById(importItem.saveType.id);
            if (saveType != null) {
              action.saveType = new ListObject(saveType.id, saveType.name);
            }
            action.damageConfigurations = this.getDamageConfigurations(importItem.attackDamages);
            break;
          case AttackType.HEAL:
            action.attackType = AttackType.HEAL;
            action.damageConfigurations = this.getDamageConfigurations(importItem.attackDamages);
            break;
        }
      } else {
        action.attackType = AttackType.NONE;
      }

      if (importItem.limitedUse) {
        action.limitedUse = this.getLimitedUse(importItem);
        if (action.limitedUse.limitedUseType === LimitedUseType.RECHARGE) {
          action.rechargeMin = importItem.rechargeMin;
          action.rechargeMax = importItem.rechargeMax;
        }
      }
    } else {
      return null;
    }

    // extraDamages: ImportAttackDamage[] - not supported
    // baseLevelSlot: number - not supported
    // numLevelsAbove: number - not supported

    return action;
  }

  private getLimitedUse(importItem: ImportMonsterAction): LimitedUse {
    if (importItem.limitedUse) {
      const limitedUse = new LimitedUse()
      limitedUse.limitedUseType = this.getLimitedUseType(importItem.limitedUseType);
      if (limitedUse.limitedUseType === LimitedUseType.QUANTITY) {
        limitedUse.quantity = importItem.numPerDay;
      } else {
        limitedUse.quantity = 1;
      }
      return limitedUse;
    } else {
      return null;
    }
  }

  private getSavingThrowProf(savingThrowProfs: number[], sid: number): Proficiency {
    const prof = new Proficiency();
    const ability = this.abilityService.getAbilityBySid(sid);
    prof.attribute = new ProficiencyListObject();
    prof.attribute.id = ability.id;
    prof.attribute.name = ability.name;
    prof.attribute.proficiencyType = ProficiencyType.ABILITY;
    prof.proficient = this.isSavingThrowProficient(savingThrowProfs, sid);
    prof.advantage = false;
    prof.disadvantage = false;
    prof.miscModifier = 0;
    return prof;
  }

  private isSavingThrowProficient(savingThrowProfs: number[], sid: number): boolean {
    const abilityId = this.importSharedService.getAbilityIdBySid(sid);
    const prof = _.find(savingThrowProfs, (_prof: number) => { return _prof === abilityId; })
    return prof != null;
  }

  private async updateAttributeProfs(monster: Monster, importItem: ImportMonster): Promise<any> {
    const savingThrowProfs: Proficiency[] = [];
    savingThrowProfs.push(this.getSavingThrowProf(importItem.savingThrowProfs, SID.ABILITIES.STRENGTH));
    savingThrowProfs.push(this.getSavingThrowProf(importItem.savingThrowProfs, SID.ABILITIES.DEXTERITY));
    savingThrowProfs.push(this.getSavingThrowProf(importItem.savingThrowProfs, SID.ABILITIES.CONSTITUTION));
    savingThrowProfs.push(this.getSavingThrowProf(importItem.savingThrowProfs, SID.ABILITIES.INTELLIGENCE));
    savingThrowProfs.push(this.getSavingThrowProf(importItem.savingThrowProfs, SID.ABILITIES.WISDOM));
    savingThrowProfs.push(this.getSavingThrowProf(importItem.savingThrowProfs, SID.ABILITIES.CHARISMA));

    // attribute profs
    const languages = await this.importCacheService.getAttributesByType(AttributeType.LANGUAGE);
    const skills = await this.importCacheService.getAttributesByType(AttributeType.SKILL);
    const languageProfs = this.importSharedService.getProficiencyList(importItem.languageProfs, languages, ProficiencyType.LANGUAGE);
    const skillProfs = this.importSharedService.getCreatureSkillProficiencyList(importItem.skillProfs, skills, ProficiencyType.SKILL);

    monster.attributeProfs = languageProfs.concat(savingThrowProfs).concat(skillProfs);
  }

  processMonster(config: ImportItemConfiguration): Promise<any> {
    return this.getMonster(config).then(async (monster: Monster) => {
      const monsterImport = config.importItem as ImportMonster;
      const skills = await this.importCacheService.getAttributesByType(AttributeType.SKILL);
      const skillProfs = this.importSharedService.getCreatureSkillProficiencyList(monsterImport.skillProfs, skills, ProficiencyType.SKILL);
      await this.importAttributeService.processSkillProfs(skillProfs, monsterImport.skillProfs);
      await this.importAttributeService.processLanguageDependencies(monsterImport.languageProfs);

      await this.updateAttributeProfs(monster, monsterImport);
      monster.attributeProfs = this.importSharedService.processProfs(monster.attributeProfs, this.importCacheService.getAllAttributes());

      return this.process(monster, config.importItem).then(async () => {
        try {
          if (config.importItem.selectedAction === 'REPLACE_EXISTING') {
            await this.monsterService.deleteSpells(monster);
            await this.monsterService.deleteInnateSpells(monster);
            await this.monsterService.deletePowers(monster.id);
            await this.monsterService.deleteItems(monster.id);
          }
          await this.processSpells(config, monster);
          await this.processInnateSpells(config, monster);
          await this.processActions(config, monster);
          await this.processFeatures(config, monster);
          await this.processItems(config, monster);
        } catch (e) {
          if (config.importItem.selectedAction === 'INSERT_AS_NEW') {
            //if error on any of this, delete monster
            await this.monsterService.deleteMonster(monster);
            await this.importCacheService.deleteMonster(monster.id);
          }
          throw e;
        }
      });
    });
  }

  private async processActions(config: ImportItemConfiguration, monster: Monster): Promise<any> {
    const importItem = config.importItem as ImportMonster;
    const actions: MonsterAction[] = [];
    for (const importAction of importItem.actions) {
      if (importAction.monsterActionAttackType !== 'SPELL' && !importAction.nonAttackSpell) {
        const action = await this.getMonsterAction(importAction);
        if (importAction.ammo != null) {
          const ammo = await this.importItemService.processAmmoDependency(importAction.ammo.category);
          if (ammo != null) {
            action.ammoType = new ListObject(ammo.id, ammo.name);
          }
        }

        action.damageConfigurations = [];
        if (action.attackType === AttackType.ATTACK || action.attackType === AttackType.SAVE || action.attackType === AttackType.HEAL) {
          for (const attackDamage of importAction.attackDamages) {
            if (attackDamage.numDice > 0 || attackDamage.damageMod > 0 || (attackDamage.damageAbility != null && attackDamage.damageAbility.id !== 0)) {
              const damageConfiguration = this.importItemService.getDamageConfiguration(attackDamage.numDice, this.importSharedService.getImportDiceSize(attackDamage.diceSize), attackDamage.damageTypeImportItem, attackDamage.damageMod, attackDamage.damageAbility);
              if (action.attackType !== AttackType.HEAL && attackDamage.damageTypeImportItem.name != null && attackDamage.damageTypeImportItem.name !== '') {
                const damageType = await this.importAttributeService.processDamageTypeDependency(attackDamage.damageTypeImportItem);
                if (damageType != null) {
                  damageConfiguration.damageType = damageType;
                }
              }
              action.damageConfigurations.push(damageConfiguration);
            }
          }
        }

        actions.push(action);
      }
    }

    if (actions.length > 0) {
      return this.monsterService.addActions(monster.id, actions);
    } else {
      return Promise.resolve();
    }
  }

  private async processFeatures(config: ImportItemConfiguration, monster: Monster): Promise<any> {
    const importItem = config.importItem as ImportMonster;
    const features: MonsterFeature[] = [];
    for (const importFeature of importItem.features) {
      features.push(this.getMonsterFeature(importFeature));
    }

    if (features.length > 0) {
      return this.monsterService.addFeatures(monster.id, features);
    } else {
      return Promise.resolve();
    }
  }

  private async processSpells(config: ImportItemConfiguration, monster: Monster): Promise<any> {
    const importItem = config.importItem as ImportMonster;
    const spellConfigurations: SpellConfiguration[] = [];
    for (const importSpell of importItem.spells) {
      const spell = await this.importPowerService.processSpellDependency(importSpell);
      if (spell != null) {
        const spellConfiguration = new SpellConfiguration();
        spellConfiguration.spell = new ListObject(spell.id, spell.name);
        spellConfigurations.push(spellConfiguration);
      }
    }

    if (spellConfigurations.length > 0) {
      return this.monsterService.addSpellConfigurations(monster, spellConfigurations);
    } else {
      return Promise.resolve();
    }
  }

  private async processInnateSpells(config: ImportItemConfiguration, monster: Monster): Promise<any> {
    const importItem = config.importItem as ImportMonster;
    const spellConfigurations: InnateSpellConfiguration[] = [];
    for (const importSpell of importItem.innateSpells) {
      const spell = await this.importPowerService.processSpellDependency(importSpell);
      if (spell != null) {
        const spellConfiguration = new InnateSpellConfiguration();
        spellConfiguration.spell = new ListObject(spell.id, spell.name);
        spellConfiguration.slot = spell.level;
        spellConfiguration.limitedUse = this.getInnateSpellLimitedUse(spellConfiguration.spell, importItem);
        spellConfigurations.push(spellConfiguration);
      }
    }

    if (spellConfigurations.length > 0) {
      return this.monsterService.addInnateSpellConfigurations(monster, spellConfigurations);
    } else {
      return Promise.resolve();
    }
  }

  private getInnateSpellLimitedUse(spell: ListObject, importItem: ImportMonster): LimitedUse {
    for (const importAction of importItem.actions) {
      if (importAction.monsterActionAttackType === 'SPELL' || importAction.nonAttackSpell) {
        if (importAction.innate && importAction.spell != null && importAction.spell.name === spell.name) {
          return this.getLimitedUse(importAction);
        }
      }
    }

    return new LimitedUse();
  }

  private async processItems(config: ImportItemConfiguration, monster: Monster): Promise<any> {
    const importItem = config.importItem as ImportMonster;
    const items: ItemQuantity[] = [];
    for (const importEquipmentObject of importItem.items) {
      const itemQuantity = new ItemQuantity();
      const item = await this.importItemService.processItemDependency(importEquipmentObject);
      if (item != null) {
        itemQuantity.item = new ItemListObject(item.id, item.name);
        itemQuantity.quantity = importEquipmentObject.quantity;
        items.push(itemQuantity);
      }
    }

    if (items.length > 0) {
      return this.monsterService.updateItems(monster.id, items);
    } else {
      return Promise.resolve();
    }
  }

  monsterActionAddMissingChildren(importItem: ImportMonsterAction): void {
    importItem.attackDamages.forEach((attackDamage: ImportAttackDamage) => {
      const damageTypeImportItem = this.importAttributeService.getDamageTypeImportItem(attackDamage.damageType);
      this.importSharedService.initializeImportItem(damageTypeImportItem);
      attackDamage.damageTypeImportItem = damageTypeImportItem;
    });
  }

  monsterAddMissingChildren(importItem: ImportMonster): void {
    importItem.skillProfs.forEach((skill: ImportCreatureSkill) => {
      this.importSharedService.initializeImportItem(skill);
    });

    importItem.actions.forEach((action: ImportMonsterAction) => {
      this.monsterActionAddMissingChildren(action);
    });

    importItem.spells.forEach((spell: ImportSpell) => {
      this.importSharedService.initializeImportItem(spell);
    });

    importItem.items.forEach((item: ImportEquipmentObject) => {
      this.importSharedService.initializeImportItem(item);
    });
  }

  validateMonster(importItem: ImportMonster): boolean {
    return importItem.name != null
      && importItem.name !== '';
  }
}
