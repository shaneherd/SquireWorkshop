import {Injectable} from '@angular/core';
import {
  InnateSpellConfiguration,
  Monster,
  MonsterAbilityScore,
  MonsterAction,
  MonsterFeature
} from '../../../shared/models/creatures/monsters/monster';
import {ExportDetailsService} from './export.service';
import {DamageModifier} from '../../../shared/models/characteristics/damage-modifier';
import {ExportSharedService} from './export-shared.service';
import {SpeedType} from '../../../shared/models/speed-type.enum';
import {SID} from '../../../constants';
import {MonsterService} from '../creatures/monster.service';
import {MonsterType} from '../../../shared/models/creatures/monsters/monster-type.enum';
import * as _ from 'lodash';
import {Proficiency} from '../../../shared/models/proficiency';
import {AbilityService} from '../attributes/ability.service';
import {ListObject} from '../../../shared/models/list-object';
import {Ability} from '../../../shared/models/attributes/ability.model';
import {LanguageService} from '../attributes/language.service';
import {SkillService} from '../attributes/skill.service';
import {ExportAttributeService} from './export-attribute.service';
import {SenseValue} from '../../../shared/models/sense-value';
import {Skill} from '../../../shared/models/attributes/skill';
import {ExportPowerService} from './export-power.service';
import {Spell} from '../../../shared/models/powers/spell';
import {DamageConfiguration} from '../../../shared/models/damage-configuration';
import {WeaponRangeType} from '../../../shared/models/items/weapon-range-type.enum';
import {SpellConfiguration} from '../../../shared/models/characteristics/spell-configuration';
import {LimitedUse} from '../../../shared/models/powers/limited-use';
import {DiceSize} from '../../../shared/models/dice-size.enum';
import {LimitedUseType} from '../../../shared/models/limited-use-type.enum';
import {AttackType} from '../../../shared/models/attack-type.enum';
import {RangeType} from '../../../shared/models/powers/range-type.enum';
import {ExportCacheService} from './export-cache.service';

@Injectable({
  providedIn: 'root'
})
export class ExportMonsterService implements ExportDetailsService {

  constructor(
    private exportCacheService: ExportCacheService,
    private monsterService: MonsterService,
    private exportSharedService: ExportSharedService,
    private abilityService: AbilityService,
    private languageService: LanguageService,
    private skillService: SkillService,
    private exportAttributeService: ExportAttributeService,
    private exportPowerService: ExportPowerService
  ) { }

  export(id: string, proExport: boolean): Promise<object> {
    return this.monsterService.getMonster(id).then((monster: Monster) => {
      return this.processMonster(monster);
    });
  }

  processObject(object: Object, proExport: boolean): Promise<object> {
    return this.processMonster(object as Monster);
  }

  async processMonster(monster: Monster): Promise<object> {
    return {
      'type': 'Monster',
      'ac': monster.ac,
      'actions': await this.processMonsterActions(monster),
      'alignment': this.exportSharedService.getAlignment(monster.alignment.sid),
      'burrow': this.getSpeed(monster, SpeedType.BURROW),
      'cha': this.getAbilityBySid(monster, SID.ABILITIES.CHARISMA),
      'challengeRating': this.exportSharedService.getChallengeRating(monster.challengeRating),
      'climbing': this.getSpeed(monster, SpeedType.CLIMB),
      'con': this.getAbilityBySid(monster, SID.ABILITIES.CONSTITUTION),
      'conditionImmunities': this.getConditionImmunities(monster),
      'crawling': this.getSpeed(monster, SpeedType.CRAWL),
      'damageModifiers': this.processDamageModifiers(monster),
      'dex': this.getAbilityBySid(monster, SID.ABILITIES.DEXTERITY),
      'exp': monster.experience,
      'features': await this.processMonsterFeatures(monster),
      'flying': this.getSpeed(monster, SpeedType.FLY),
      'hover': monster.hover,
      'hpDiceSize': this.getDiceSize(monster.hitDice.diceSize),
      'hpMod': monster.hitDice.miscModifier,
      'hpNumDice': monster.hitDice.numDice,
      'innateSpellAttackMod': monster.innateSpellAttackModifier,
      'innateSpellSaveDCMod': monster.innateSpellSaveModifier,
      'innateSpellcastingAbilityId': this.getAbilityById(monster.innateSpellcastingAbility),
      'innateSpells': await this.processInnateSpells(monster),
      'intelligence': this.getAbilityBySid(monster, SID.ABILITIES.INTELLIGENCE),
      'items': [],
      'languageProfs': await this.processLanguageProfs(monster),
      'legendaryPoints': monster.legendaryPoints,
      'monsterType': this.getMonsterType(monster),
      'name': monster.name,
      'savingThrowProfs': this.getSavingThrowProfs(monster),
      'senses': this.processSenses(monster),
      'size': this.exportSharedService.getSize(monster.size),
      'skillProfs': await this.processSkillProfs(monster),
      'speed': this.getSpeed(monster, SpeedType.WALK),
      'spellAttackMod': monster.spellAttackModifier,
      'spellSaveDCMod': monster.spellSaveModifier,
      'spellSlots': this.getSpellSlots(monster),
      'spellcaster': monster.spellcaster,
      'spellcastingAbilityId': this.getAbilityById(monster.spellcastingAbility),
      'spells': await this.processSpells(monster),
      'str': this.getAbilityBySid(monster, SID.ABILITIES.STRENGTH),
      'swimming': this.getSpeed(monster, SpeedType.SWIM),
      'typeVariation': monster.typeVariation,
      'wealth': {
        'cp': 0,
        'ep': 0,
        'gp': 0,
        'pp': 0,
        'sp': 0
      },
      'wis': this.getAbilityBySid(monster, SID.ABILITIES.WISDOM)
    };
  }

  private getDiceSize(diceSize: DiceSize): string {
    switch (diceSize) {
      case DiceSize.ONE:
        return 'ONE';
      case DiceSize.TWO:
        return 'TWO';
      case DiceSize.THREE:
        return 'THREE';
      case DiceSize.FOUR:
        return 'FOUR';
      case DiceSize.SIX:
        return 'SIX';
      case DiceSize.EIGHT:
        return 'EIGHT';
      case DiceSize.TEN:
        return 'TEN';
      case DiceSize.TWELVE:
        return 'TWELVE';
      case DiceSize.TWENTY:
        return 'TWENTY';
      case DiceSize.HUNDRED:
        return 'ONE_HUNDRED';
    }
    return 'TWENTY';
  }

  private getSavingThrowProfs(monster: Monster): number[] {
    const profs = [];
    const abilities = this.abilityService.getAbilitiesDetailedFromStorage();
    abilities.forEach((ability: Ability) => {
      if (this.isProficient(ability, monster.attributeProfs)) {
        profs.push(this.exportSharedService.getAbilityId(ability.sid));
      }
    });
    return profs;
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

  private getConditionImmunities(monster: Monster): number[] {
    const immunities = [];
    monster.conditionImmunities.forEach((immunity: ListObject) => {
      const id = this.exportSharedService.getConditionId(immunity.sid);
      if (id !== 0) {
        immunities.push(id);
      }
    });
    return immunities;
  }

  private getMonsterType(monster: Monster): object {
    let id = 0;
    let name = '';
    switch (monster.monsterType) {
      case MonsterType.ABERRATION:
        id = 1;
        name = 'Aberration';
        break;
      case MonsterType.BEAST:
        id = 2;
        name = 'Beast';
        break;
      case MonsterType.CELESTIAL:
        id = 3;
        name = 'Celestial';
        break;
      case MonsterType.CONSTRUCT:
        id = 4;
        name = 'Construct';
        break;
      case MonsterType.DRAGON:
        id = 5;
        name = 'Dragon';
        break;
      case MonsterType.ELEMENTAL:
        id = 6;
        name = 'Elemental';
        break;
      case MonsterType.FEY:
        id = 7;
        name = 'Fey';
        break;
      case MonsterType.FIEND:
        id = 8;
        name = 'Fiend';
        break;
      case MonsterType.GIANT:
        id = 9;
        name = 'Giant';
        break;
      case MonsterType.HUMANOID:
        id = 10;
        name = 'Humanoid';
        break;
      case MonsterType.MONSTROSITY:
        id = 11;
        name = 'Monstrosity';
        break;
      case MonsterType.OOZE:
        id = 12;
        name = 'Ooze';
        break;
      case MonsterType.PLANT:
        id = 13;
        name = 'Plant';
        break;
      case MonsterType.UNDEAD:
        id = 14;
        name = 'Undead';
        break;
    }

    return {
      'type': 'MonsterType',
      'id': id,
      'name': name
    };
  }

  private getSpellSlots(monster: Monster): object {
    return {
      'type': 'SpellSlots',
      'level': {
        'type': 'Level',
        'id': 0,
        'level': 0,
        'minExp': 0,
        'profBonus': 0
      },
      'slot1': monster.spellSlots.slot1,
      'slot2': monster.spellSlots.slot2,
      'slot3': monster.spellSlots.slot3,
      'slot4': monster.spellSlots.slot4,
      'slot5': monster.spellSlots.slot5,
      'slot6': monster.spellSlots.slot6,
      'slot7': monster.spellSlots.slot7,
      'slot8': monster.spellSlots.slot8,
      'slot9': monster.spellSlots.slot9
    };
  }

  private getAbilityById(id: string): number {
    if (id === '0') {
      return 0;
    }
    const ability = this.abilityService.getAbilityById(id);
    return this.exportSharedService.getAbilityId(ability.sid);
  }

  private getAbilityBySid(monster: Monster, abilitySid: number): object {
    const abilityScore = _.find(monster.abilityScores, (_abilityScore: MonsterAbilityScore) => {
      return _abilityScore.ability.sid === abilitySid;
    });
    if (abilityScore == null) {
      return {
        'type': 'Ability',
        'abbr': '',
        'id': this.exportSharedService.getAbilityId(abilitySid),
        'miscModifier': 0,
        'name': '',
        'raceModifier': 0,
        'roll': 0
      }
    }
    return {
      'type': 'Ability',
      'abbr': abilityScore.ability.abbr.toUpperCase(),
      'id': this.exportSharedService.getAbilityId(abilitySid),
      'miscModifier': 0,
      'name': abilityScore.ability.name,
      'raceModifier': 0,
      'roll': abilityScore.value
    }
  }

  private async processMonsterActions(monster: Monster): Promise<object[]> {
    const actions = [];
    const monsterActions = await this.monsterService.getActions(monster.id);
    monsterActions.forEach((monsterAction: MonsterAction) => {
      actions.push(this.processMonsterAction(monsterAction, monster));
    });

    for (const monsterSpell of monster.spells) {
      const action = await this.processMonsterActionSpell(monsterSpell, monster);
      if (action != null) {
        actions.push(action);
      }
    }

    for (const monsterSpell of monster.innateSpells) {
      const action = await this.processMonsterActionInnateSpell(monsterSpell, monster);
      if (action != null) {
        actions.push(action);
      }
    }

    return actions;
  }

  private processMonsterAction(monsterAction: MonsterAction, monster: Monster): object {
    return {
      'type': 'MonsterAction',
      'attack': true,
      'attackDamages': this.getMonsterActionAttackDamages(monsterAction),
      'attackMod': monsterAction.attackMod,
      'attackType': this.exportSharedService.getAttackType(monsterAction.attackType, monsterAction.rangeType),
      'baseLevelSlot': 0,
      'extraDamages': [],
      'halfOnMissSave': monsterAction.halfOnSave,
      'id': 0,
      'innate': false,
      'legendaryCost': monsterAction.legendaryCost,
      'limitedUse': monsterAction.limitedUse != null,
      'limitedUseType': this.exportSharedService.getLimitedUseType(monsterAction.limitedUse),
      'monsterActionAttackType': monsterAction.rangeType === WeaponRangeType.MELEE ? 'WEAPON_MELEE' : 'WEAPON_RANGED',
      'monsterActionType': this.exportSharedService.getMonsterActionType(monsterAction.actionType),
      'name': monsterAction.name,
      'nonAttackSpell': false,
      'notes': monsterAction.description,
      'numLevelsAbove': 0,
      'numPerDay': this.getLimitedUseQuantity(monsterAction.limitedUse, monster),
      'numUsesRemaining': 0,
      'range': this.getMonsterActionRange(monsterAction),
      'rechargeMax': monsterAction.rechargeMax,
      'rechargeMin': monsterAction.rechargeMin,
      'rechargeOnLongRest': false,
      'rechargeOnShortRest': false,
      'saveMod': this.getMonsterActionSaveModifier(monsterAction, monster),
      'saveType': this.getMonsterActionSaveType(monsterAction)
    };
  }

  private getLimitedUseQuantity(limitedUse: LimitedUse, monster: Monster): number {
    if (limitedUse == null) {
      return 0;
    }
    if (limitedUse.limitedUseType === LimitedUseType.RECHARGE) {
      return 1;
    }
    let quantity = limitedUse.quantity;
    if (limitedUse.abilityModifier !== '0') {
      quantity += this.getMonsterAbilityModifier(monster, limitedUse.abilityModifier);
    }
    if (quantity < 1) {
      quantity = 1;
    }
    return quantity;
  }

  private getMonsterActionSaveModifier(monsterAction: MonsterAction, monster: Monster): number {
    let modifier = 0;
    if (monsterAction.saveProficiencyModifier) {
      modifier += this.getMonsterProficiencyModifier(monster)
    }
    if (monsterAction.saveAbilityModifier !== '0') {
      modifier += this.getMonsterAbilityModifier(monster, monsterAction.saveAbilityModifier);
    }
    return modifier;
  }

  private getMonsterProficiencyModifier(monster: Monster): number {
    return this.monsterService.getProfBonus(monster.challengeRating);
  }

  private getMonsterAbilityModifier(monster: Monster, abilityId: string): number {
    const abilityScore = _.find(monster.abilityScores, (_abilityScore: MonsterAbilityScore) => {
      return _abilityScore.ability.id === abilityId;
    });
    let score = 10;
    if (abilityScore != null) {
      score = abilityScore.value;
    }
    return this.abilityService.getAbilityModifier(score);
  }

  private getMonsterActionSaveType(monsterAction: MonsterAction): object {
    if (monsterAction.saveType == null || monsterAction.saveType.id === '0') {
      return {
        'type': 'Ability',
        'abbr': 'None',
        'id': 0,
        'miscModifier': 0,
        'name': 'None',
        'raceModifier': 0,
        'roll': 10
      };
    }

    const ability = this.abilityService.getAbilityById(monsterAction.saveType.id);
    return {
      'type': 'Ability',
      'abbr': ability.abbr,
      'id': 0,
      'miscModifier': 0,
      'name': ability.name,
      'raceModifier': 0,
      'roll': 0
    }
  }

  private getMonsterActionRange(monsterAction: MonsterAction): string {
    if (monsterAction.rangeType === WeaponRangeType.MELEE) {
      return `${monsterAction.reach} ft`;
    } else {
      return `${monsterAction.normalRange}/${monsterAction.longRange} ft`;
    }
  }

  private async processMonsterActionSpell(monsterSpell: SpellConfiguration, monster: Monster): Promise<object> {
    const spell = await this.exportCacheService.getPower(monsterSpell.spell.id) as Spell;
    if (spell.attackType === AttackType.NONE) {
      return null;
    }
    return await this.processMonsterSpell(spell, false, null, monster);
  }

  private async processMonsterActionInnateSpell(monsterSpell: InnateSpellConfiguration, monster: Monster): Promise<object> {
    const spell = await this.exportCacheService.getPower(monsterSpell.spell.id) as Spell;
    if (spell.attackType === AttackType.NONE) {
      return null;
    }
    return await this.processMonsterSpell(spell, true, monsterSpell.limitedUse, monster);
  }

  private async processMonsterSpell(spell: Spell, innate: boolean, limitedUse: LimitedUse, monster: Monster): Promise<object> {
    return {
      'type': 'MonsterAction',
      'attack': true,
      'attackDamages': this.getSpellDamages(spell, spell.damageConfigurations),
      'attackMod': spell.attackMod,
      'attackType': this.exportSharedService.getSpellAttackType(spell.attackType, spell.rangeType),
      'baseLevelSlot': spell.level,
      'extraDamages': this.getSpellDamages(spell, spell.extraDamageConfigurations),
      'halfOnMissSave': spell.halfOnSave,
      'id': 0,
      'innate': innate,
      'legendaryCost': 0,
      'limitedUse': limitedUse != null,
      'limitedUseType': this.exportSharedService.getLimitedUseType(limitedUse),
      'monsterActionAttackType': 'SPELL',
      'monsterActionType': this.exportSharedService.getMonsterCastingTimeAction(spell.castingTimeUnit),
      'name': spell.name,
      'nonAttackSpell': false,
      'notes': '',
      'numLevelsAbove': spell.numLevelsAboveBase,
      'numPerDay': this.getLimitedUseQuantity(limitedUse, monster),
      'numUsesRemaining': 0,
      'range': this.exportSharedService.getRange(spell.rangeType, spell.range, spell.rangeUnit),
      'rechargeMax': 0,
      'rechargeMin': 0,
      'rechargeOnLongRest': false,
      'rechargeOnShortRest': false,
      'saveMod': 0,
      'saveType': this.getSpellSaveType(spell),
      'spell': await this.exportPowerService.processSpell(spell)
    };
  }

  private getSpellDamages(spell: Spell, damageConfigurations: DamageConfiguration[]): object[] {
    const damages = [];
    damageConfigurations.forEach((damageConfiguration: DamageConfiguration) => {
      damages.push({
        'type': 'AttackDamage',
        'attackType': spell.rangeType === RangeType.SELF || spell.rangeType === RangeType.TOUCH ? 1 : 2, // melee = 1, ranged = 2, thrown = 3
        'damageAbility': this.getDamageAbilityModifier(damageConfiguration),
        'damageMod': damageConfiguration.values.miscModifier,
        'damageType': damageConfiguration.damageType == null ? '' : this.exportSharedService.getDamageType(damageConfiguration.damageType.sid),
        'diceSize': this.getDiceSize(damageConfiguration.values.diceSize),
        'numDice': damageConfiguration.values.numDice,
        'quickAttackId': 0
      });
    });
    return damages;
  }

  private getSpellSaveType(spell: Spell): object {
    if (spell.saveType == null || spell.saveType.id === '0') {
      return {
        'type': 'Ability',
        'abbr': 'None',
        'id': 0,
        'miscModifier': 0,
        'name': 'None',
        'raceModifier': 0,
        'roll': 10
      };
    }

    return {
      'type': 'Ability',
      'abbr': spell.saveType.abbr,
      'id': this.exportSharedService.getAbilityId(spell.saveType.sid),
      'miscModifier': 0,
      'name': spell.saveType.name,
      'raceModifier': 0,
      'roll': 0
    };
  }

  private getMonsterActionAttackDamages(monsterAction: MonsterAction): object[] {
    const damages = [];
    monsterAction.damageConfigurations.forEach((damageConfiguration: DamageConfiguration) => {
      damages.push({
        'type': 'AttackDamage',
        'attackType': monsterAction.rangeType === WeaponRangeType.MELEE ? 1 : 2, // melee = 1, ranged = 2, thrown = 3
        'damageAbility': this.getDamageAbilityModifier(damageConfiguration),
        'damageMod': damageConfiguration.values.miscModifier,
        'damageType': damageConfiguration.damageType == null ? '' : this.exportSharedService.getDamageType(damageConfiguration.damageType.sid),
        'diceSize': this.getDiceSize(damageConfiguration.values.diceSize),
        'numDice': damageConfiguration.values.numDice,
        'quickAttackId': 0
      })
    });
    return damages;
  }

  private getDamageAbilityModifier(damageConfiguration: DamageConfiguration): object {
    if (damageConfiguration.values.abilityModifier == null || damageConfiguration.values.abilityModifier.id === '0') {
      return {
        'type': 'Ability',
        'abbr': 'None',
        'id': 0,
        'miscModifier': 0,
        'name': 'None',
        'raceModifier': 0,
        'roll': 10
      };
    }

    return {
      'type': 'Ability',
      'abbr': damageConfiguration.values.abilityModifier.abbr,
      'id': this.exportSharedService.getAbilityId(damageConfiguration.values.abilityModifier.sid),
      'miscModifier': 0,
      'name': damageConfiguration.values.abilityModifier.name,
      'raceModifier': 0,
      'roll': 0
    };
  }

  private async processMonsterFeatures(monster: Monster): Promise<object[]> {
    const features = [];
    const monsterFeatures = await this.monsterService.getFeatures(monster.id);
    monsterFeatures.forEach((feature: MonsterFeature) => {
      features.push({
        'type': 'MonsterFeature',
        'id': 0,
        'limitedUse': feature.limitedUse != null,
        'limitedUseType': this.exportSharedService.getLimitedUseType(feature.limitedUse),
        'name': feature.name,
        'notes': feature.description,
        'numPerDay': this.getLimitedUseQuantity(feature.limitedUse, monster),
        'numUsesRemaining': -1,
        'rechargeMax': feature.rechargeMax,
        'rechargeMin': feature.rechargeMin,
        'rechargeOnLongRest': false,
        'rechargeOnShortRest': false
      });
    });
    return features;
  }

  private processDamageModifiers(monster: Monster): object[] {
    const modifiers = [];
    monster.damageModifiers.forEach((modifier: DamageModifier) => {
      const type = modifier.damageType == null ? '' : this.exportSharedService.getDamageType(modifier.damageType.sid);
      if (type !== '') {
        modifiers.push({
          'type': 'DamageModifier',
          'condition': modifier.condition,
          'damageModifierType': this.exportSharedService.getDamageModifierType(modifier.damageModifierType),
          'damageType': type
        });
      }
    });
    return modifiers;
  }

  private async processLanguageProfs(monster: Monster): Promise<object[]> {
    const profs = [];
    const languages = await this.languageService.getLanguages();
    languages.forEach((language: ListObject) => {
      if (this.isProficient(language, monster.attributeProfs)) {
        profs.push({
          'attuned': false,
          'cursed': false,
          'description': '',
          'id': this.exportSharedService.getLanguageId(language.sid),
          'name': language.name,
          'poisoned': false,
          'silvered': false
        });
      }
    });
    return profs;
  }

  private getSpeed(monster: Monster, speedType: SpeedType): number {
    for (let i = 0; i < monster.speeds.length; i++) {
      const raceSpeed = monster.speeds[i];
      if (raceSpeed.speedType === speedType) {
        return raceSpeed.value;
      }
    }
    return 0;
  }

  private async processSkillProfs(monster: Monster): Promise<object[]> {
    const profs = [];
    const skills = await this.skillService.getSkillsDetailed();
    skills.forEach((skill: Skill) => {
      const proficient = this.isProficient(skill, monster.attributeProfs);
      if (proficient || skill.sid !==  0) {
        const prof = this.exportAttributeService.processSkill(skill, true);
        prof['prof'] = proficient;
        profs.push(prof);
      }
    });
    return profs;
  }

  private async processSpells(monster: Monster): Promise<object[]> {
    const spells = [];
    for (const monsterSpell of monster.spells) {
      const spell = await this.exportCacheService.getPower(monsterSpell.spell.id);
      spells.push(await this.exportPowerService.processSpell(spell as Spell));
    }
    return spells;
  }

  private async processInnateSpells(monster: Monster): Promise<object[]> {
    const spells = [];
    for (const innateSpell of monster.innateSpells) {
      const spell = await this.exportCacheService.getPower(innateSpell.spell.id);
      spells.push(await this.exportPowerService.processSpell(spell as Spell));
    }
    return spells;
  }

  private processSenses(monster: Monster): object[] {
    const senses = [];
    monster.senses.forEach((senseValue: SenseValue) => {
      senses.push({
        'JSON_TYPE': 'MonsterSense', // 'JSON_TYPE' will be replaced with 'type' during the write process
        'range': senseValue.range,
        'type': this.exportSharedService.getSenseType(senseValue.sense)
      });
    });
    return senses;
  }
}
