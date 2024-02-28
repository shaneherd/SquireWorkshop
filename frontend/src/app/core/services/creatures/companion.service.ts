import {Injectable} from '@angular/core';
import {
  InnateSpellConfiguration,
  Monster,
  MonsterAbilityScore,
  MonsterAction,
  MonsterPower,
  MonsterPowerType
} from '../../../shared/models/creatures/monsters/monster';
import {DiceService} from '../dice.service';
import {AbilityService} from '../attributes/ability.service';
import {TranslateService} from '@ngx-translate/core';
import {Companion} from '../../../shared/models/creatures/companions/companion';
import {CompanionScoreModifier} from '../../../shared/models/creatures/companions/companion-score-modifier';
import {CreatureAbilityScore} from '../../../shared/models/creatures/creature-ability-score';
import {CreatureConfigurationCollection} from '../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureService} from './creature.service';
import {CreatureType} from '../../../shared/models/creatures/creature-type.enum';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Creature} from '../../../shared/models/creatures/creature';
import {CreatureSkillListProficiency} from '../../../shared/models/creatures/creature-skill-list-proficiency';
import {CreatureListProficiency} from '../../../shared/models/creatures/creature-list-proficiency';
import {InheritedFrom} from '../../../shared/models/creatures/inherited-from';
import {Proficiency, ProficiencyType} from '../../../shared/models/proficiency';
import {CreatureProficiencyCollection} from '../../../shared/models/creatures/configs/creature-proficiency-collection';
import {MonsterService} from './monster.service';
import {DamageConfigurationCollection} from '../../../shared/models/damage-configuration-collection';
import {AttackType} from '../../../shared/models/attack-type.enum';
import {DamageConfiguration} from '../../../shared/models/damage-configuration';
import * as _ from 'lodash';
import {CreatureAbilityProficiency} from '../../../shared/models/creatures/configs/creature-ability-proficiency';
import {Ability} from '../../../shared/models/attributes/ability.model';
import {PowerService} from '../powers/power.service';
import {LimitedUseType} from '../../../shared/models/limited-use-type.enum';
import {CompanionAction} from '../../../shared/models/creatures/companion-action';
import {CompanionFeature} from '../../../shared/models/creatures/companion-feature';
import {CreaturePower} from '../../../shared/models/creatures/creature-power';
import {CreaturePowerList} from '../../../shared/models/creatures/creature-power-list';
import {PowerType} from '../../../shared/models/powers/power-type.enum';
import {RollType} from '../../../shared/models/rolls/roll-type.enum';
import {Roll} from '../../../shared/models/rolls/roll';
import {NotificationService} from '../notification.service';
import {SpellConfiguration} from '../../../shared/models/characteristics/spell-configuration';
import {CreatureSpell} from '../../../shared/models/creatures/creature-spell';
import {Power} from '../../../shared/models/powers/power';
import {CharacterLevel} from '../../../shared/models/character-level';
import {PowerModifier} from '../../../shared/models/powers/power-modifier';
import {ModifierConfigurationCollection} from '../../../shared/models/modifier-configuration-collection';
import {ModifierConfiguration} from '../../../shared/models/modifier-configuration';
import {ListObject} from '../../../shared/models/list-object';
import {CharacterLevelService} from '../character-level.service';

@Injectable({
  providedIn: 'root'
})
export class CompanionService {

  constructor(
    private http: HttpClient,
    private diceService: DiceService,
    private abilityService: AbilityService,
    private translate: TranslateService,
    private creatureService: CreatureService,
    private monsterService: MonsterService,
    private powerService: PowerService,
    private notificationService: NotificationService,
    private characterLevelService: CharacterLevelService
  ) { }

  /********************* Rest *************************/

  create(companion: Companion, characterId: string): Promise<string> {
    companion.creatureType = CreatureType.COMPANION;
    return this.creatureService.createCreature(companion).then((id: string) => {
      companion.id = id;
      return this.addCompanionToCharacter(id, characterId).then(() => {
        return id;
      }, () => {
        this.delete(companion);
        return null;
      });
    });
  }

  private addCompanionToCharacter(companionId: string, characterId: string): Promise<any> {
    return this.http.put<any>(`${environment.backendUrl}/creatures/${characterId}/companions/${companionId}`, {}).toPromise();
  }

  update(companion: Companion): Promise<any> {
    return this.creatureService.updateCreature(companion);
  }

  delete(companion: Companion): Promise<any> {
    return this.creatureService.deleteCreature(companion);
  }

  get(id: string): Promise<Creature> {
    return this.creatureService.getCreature(id);
  }

  getMonsterActions(id: string): Promise<CompanionAction[]> {
    return this.http.get<CompanionAction[]>(`${environment.backendUrl}/creatures/${id}/monsterActions`).toPromise();
  }

  getMonsterFeatures(id: string): Promise<CompanionFeature[]> {
    return this.http.get<CompanionFeature[]>(`${environment.backendUrl}/creatures/${id}/monsterFeatures`).toPromise();
  }

  getSpells(id: string): Promise<CreatureSpell[]> {
    return this.http.get<CreatureSpell[]>(`${environment.backendUrl}/creatures/${id}/monsterSpells`).toPromise();
  }

  /********************* Config *************************/

  initializeConfigurationCollection(companion: Companion, characterCollection: CreatureConfigurationCollection): Promise<CreatureConfigurationCollection> {
    return this.creatureService.initializeConfigurationCollection().then(((collection: CreatureConfigurationCollection) => {
      this.creatureService.addCreatureToCollection(companion, collection);
      this.initializeCompanionAbilityScores(collection, companion, characterCollection);
      this.addCharacterToCompanionProfs(companion, collection, characterCollection);
      return collection;
    }));
  }

  private initializeCompanionAbilityScores(collection: CreatureConfigurationCollection, companion: Companion, characterCollection: CreatureConfigurationCollection): void {
    companion.abilityScoreModifiers.forEach((companionScoreModifier: CompanionScoreModifier) => {
      const ability = this.creatureService.getAbility(companionScoreModifier.abilityId, collection);
      if (ability != null) {
        ability.abilityScore = this.getAbility(companionScoreModifier.abilityId, companion, characterCollection);
      }
    });
  }

  private addCharacterToCompanionProfs(companion: Companion, collection: CreatureConfigurationCollection, characterCollection: CreatureConfigurationCollection): void {
    if (companion.includeCharacterSaves) {
      this.addCharacterProficienciesToCompanionProfs(collection.proficiencyCollection.savingThrowProficiencies, characterCollection.proficiencyCollection.savingThrowProficiencies);
    }
    if (companion.includeCharacterSkills) {
      this.addCharacterProficienciesToCompanionProfs(collection.proficiencyCollection.skillProficiencies, characterCollection.proficiencyCollection.skillProficiencies);
    }
  }

  private addCharacterProficienciesToCompanionProfs(companionProfs: CreatureListProficiency[], characterProfs: CreatureListProficiency[]): void {
    characterProfs.forEach((characterProf: CreatureListProficiency) => {
      if (characterProf.proficient || characterProf.inheritedFrom.length > 0) {
        const companionProf = this.creatureService.getCreatureProf(characterProf.item, companionProfs);
        if (companionProf != null) {
          companionProf.inheritedFrom.push(new InheritedFrom('0', 'Character', null, true));
        }
      }
    });
  }

  addMonsterToCollection(monster: Monster, collection: CreatureConfigurationCollection): void {
    if (monster != null) {
      collection.profBonus = this.monsterService.getProfBonus(monster.challengeRating);
      this.addMonsterToProficiencyCollection(monster, monster.attributeProfs, collection.proficiencyCollection);
    }
  }

  private addMonsterToProficiencyCollection(monster: Monster, proficiencies: Proficiency[], collection: CreatureProficiencyCollection): void {
    proficiencies.forEach((proficiency: Proficiency) => {
      if (proficiency.proficient) {
        let prof: CreatureListProficiency = null;
        switch (proficiency.attribute.proficiencyType) {
          case ProficiencyType.ABILITY:
            prof = this.creatureService.getCreatureProf(proficiency.attribute, collection.savingThrowProficiencies);
            break;
          case ProficiencyType.ARMOR_TYPE:
            prof = this.creatureService.getCreatureProf(proficiency.attribute, collection.armorProficiencies);
            break;
          case ProficiencyType.LANGUAGE:
            prof = this.creatureService.getCreatureProf(proficiency.attribute, collection.languageProficiencies);
            break;
          case ProficiencyType.SKILL:
            prof = this.creatureService.getCreatureProf(proficiency.attribute, collection.skillProficiencies);
            break;
          case ProficiencyType.TOOL_CATEGORY:
            prof = this.creatureService.getCreatureProf(proficiency.attribute, collection.toolProficiencies);
            break;
          case ProficiencyType.WEAPON_TYPE:
            prof = this.creatureService.getCreatureProf(proficiency.attribute, collection.weaponProficiencies);
            break;
          case ProficiencyType.MISC:
            prof = this.creatureService.getCreatureProf(proficiency.attribute, collection.miscProficiencies);
            break;
        }

        if (prof != null) {
          prof.inheritedFrom.push(new InheritedFrom(monster.id, monster.name, null, true));
        }
      }
    });
  }

  /********************* HP *************************/

  getHpDisplay(companion: Companion, characterCollection: CreatureConfigurationCollection): string {
    const monster = companion.monster;
    let display = '';
    const diceSizeValue = this.diceService.getDiceSizeValue(monster.hitDice.diceSize);
    const multiplier = Math.floor(diceSizeValue / 2) + 0.5;
    let modifier = monster.hitDice.miscModifier;
    let abilityModifier = 0;
    if (monster.hitDice.abilityModifier != null && monster.hitDice.abilityModifier.id !== '0') {
      const ability = this.getAbility(monster.hitDice.abilityModifier.id, companion, characterCollection);
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

  getAverageHp(companion: Companion, characterCollection: CreatureConfigurationCollection): number {
    const monster = companion.monster;
    const diceSizeValue = this.diceService.getDiceSizeValue(monster.hitDice.diceSize);
    const multiplier = Math.floor(diceSizeValue / 2) + 0.5;
    let modifier = monster.hitDice.miscModifier;
    let abilityModifier = 0;
    if (monster.hitDice.abilityModifier != null && monster.hitDice.abilityModifier.id !== '0') {
      const ability = this.getAbility(monster.hitDice.abilityModifier.id, companion, characterCollection);
      const abilityScore = this.getAbilityScore(ability);
      abilityModifier = this.abilityService.getAbilityModifier(abilityScore);
      if (abilityModifier !== 0) {
        modifier += abilityModifier * monster.hitDice.numDice;
      }
    }
    return Math.floor(monster.hitDice.numDice * multiplier) + modifier;
  }

  getMaxHp(companion: Companion, characterCollection: CreatureConfigurationCollection): number {
    const monster = companion.monster;
    const diceSizeValue = this.diceService.getDiceSizeValue(monster.hitDice.diceSize);
    let modifier = monster.hitDice.miscModifier;
    let abilityModifier = 0;
    if (monster.hitDice.abilityModifier != null && monster.hitDice.abilityModifier.id !== '0') {
      const ability = this.getAbility(monster.hitDice.abilityModifier.id, companion, characterCollection);
      const abilityScore = this.getAbilityScore(ability);
      abilityModifier = this.abilityService.getAbilityModifier(abilityScore);
      if (abilityModifier !== 0) {
        modifier += abilityModifier * monster.hitDice.numDice;
      }
    }
    return (monster.hitDice.numDice * diceSizeValue) + modifier;
  }

  /********************* Ability Scorer *************************/

  getAbility(abilityId: string, companion: Companion, characterCollection: CreatureConfigurationCollection): CreatureAbilityScore {
    const modifier = this.getAbilityScoreModifier(abilityId, companion);
    if (modifier == null) {
      const monsterAbilityScore = this.getMonsterAbilityScore(abilityId, companion);
      if (monsterAbilityScore == null) {
        return null;
      }

      const creatureAbilityScore = new CreatureAbilityScore();
      creatureAbilityScore.ability = monsterAbilityScore.ability;
      creatureAbilityScore.value = monsterAbilityScore.value;
      return creatureAbilityScore;
    } else {
      if (!modifier.useCharactersScore) {
        const monsterAbilityScore = this.getMonsterAbilityScore(abilityId, companion);
        if (monsterAbilityScore == null) {
          return null;
        }

        const creatureAbilityScore = new CreatureAbilityScore();
        creatureAbilityScore.ability = monsterAbilityScore.ability;
        creatureAbilityScore.value = monsterAbilityScore.value;
        creatureAbilityScore.miscModifier = modifier.misc;
        if (modifier.includeCharactersProf) {
          creatureAbilityScore.miscModifier += this.creatureService.getProfModifier(characterCollection);
        }
        return creatureAbilityScore;
      } else {
        //use characters score
        const ability = this.creatureService.getAbility(abilityId, characterCollection);
        const score = this.creatureService.getAbilityScore(ability, characterCollection);
        const creatureAbilityScore = new CreatureAbilityScore();
        creatureAbilityScore.ability = ability.ability;
        creatureAbilityScore.value = score;
        return creatureAbilityScore;
      }
    }
  }

  private getAbilityScoreModifier(abilityId: string, companion: Companion): CompanionScoreModifier {
    if (companion != null) {
      for (let i = 0; i < companion.abilityScoreModifiers.length; i++) {
        const modifier = companion.abilityScoreModifiers[i];
        if (modifier.abilityId === abilityId) {
          return modifier;
        }
      }
    }
    return null;
  }

  getMonsterAbilityScore(abilityId: string, companion: Companion): MonsterAbilityScore {
    if (companion != null && companion.monster != null) {
      for (let i = 0; i < companion.monster.abilityScores.length; i++) {
        const abilityScore = companion.monster.abilityScores[i];
        if (abilityScore.ability.id === abilityId) {
          return abilityScore;
        }
      }
    }
    return null;
  }

  getAbilityScore(ability: CreatureAbilityScore): number {
    if (ability == null) {
      return 0;
    }
    return ability.value + ability.miscModifier;
  }

  /********************* Skill *************************/

  getSkillAbilityModifier(skill: CreatureSkillListProficiency, companion: Companion, collection: CreatureConfigurationCollection, characterProf: number): number {
    let companionScore = this.creatureService.getSkillAbilityModifier(skill, companion, collection);

    companionScore += companion.skillCheckModifier.misc;
    if (companion.skillCheckModifier.includeCharactersProf) {
      if (skill.proficient || skill.inheritedFrom.length > 0) {
        companionScore += characterProf;
      }
    }

    // if (companion.includeCharacterSkills) {
    //   const characterScore = this.creatureService.getSkillAbilityModifier(skill, companion, characterCollection);
    //   if (characterScore > companionScore) {
    //     companionScore = characterScore;
    //   }
    // }

    return companionScore;
  }

  /********************* Limited Use *************************/

  addPowers(monsterPowers: MonsterPower[], companion: Companion, collection: CreatureConfigurationCollection): Promise<any> {
    const creaturePowers: CreaturePower[] = [];
    monsterPowers.forEach((monsterPower: MonsterPower) => {
      const max = this.getMaxUses(monsterPower, collection);
      const creaturePower = new CreaturePower();
      creaturePower.powerId = monsterPower.id;
      creaturePower.powerName = monsterPower.name;
      creaturePower.powerType = monsterPower.monsterPowerType === MonsterPowerType.ACTION ? PowerType.MONSTER_ACTION : PowerType.MONSTER_FEATURE;
      creaturePower.usesRemaining = max;
      creaturePowers.push(creaturePower);
    });

    const powerList = new CreaturePowerList();
    powerList.creaturePowers = creaturePowers;
    return this.http.put<any>(`${environment.backendUrl}/creatures/${companion.id}/monsterPowers`, powerList).toPromise();
  }

  usePower(creaturePower: CreaturePower, companion: Companion): Promise<any> {
    const creaturePowers: CreaturePower[] = [];

    const power = new CreaturePower();
    power.id = creaturePower.id;
    power.powerId = creaturePower.powerId;
    power.usesRemaining = creaturePower.usesRemaining - 1;
    if (power.usesRemaining < 0) {
      return Promise.resolve(null);
    }
    creaturePowers.push(power);

    const powerList = new CreaturePowerList();
    powerList.creaturePowers = creaturePowers;
    return this.http.post<any>(`${environment.backendUrl}/creatures/${companion.id}/monsterPowers`, powerList).toPromise();
  }

  resetPower(creaturePower: CreaturePower, companion: Companion): Promise<any> {
    const creaturePowers: CreaturePower[] = [];
    const power = new CreaturePower();
    power.id = creaturePower.id;
    power.powerId = creaturePower.powerId;
    power.usesRemaining = creaturePower.calculatedMax;
    creaturePowers.push(power);

    const powerList = new CreaturePowerList();
    powerList.creaturePowers = creaturePowers;
    return this.http.post<any>(`${environment.backendUrl}/creatures/${companion.id}/monsterPowers`, powerList).toPromise();
  }

  rollRecharge(monsterPower: MonsterPower, companion: Companion): Promise<boolean> {
    if (monsterPower.limitedUse == null || monsterPower.limitedUse.limitedUseType !== LimitedUseType.RECHARGE) {
      return Promise.resolve(false);
    }

    const rollRequest = this.diceService.getRollRequest(
      RollType.STANDARD,
      monsterPower.name + ' - Recharge',
      this.diceService.getDiceSizeByValue(monsterPower.rechargeMax),
      0,
      false,
      false,
      false
    );

    return this.creatureService.rollStandard(companion, rollRequest).then((roll: Roll) => {
      const result = roll.totalResult;
      const success = result >= monsterPower.rechargeMin;
      const displayData = {
        value: roll.totalResult,
        powerName: monsterPower.name
      };

      if (success) {
        const display = this.translate.instant('Companion.RechargeCheck.Success', displayData);
        this.notificationService.success(display);
      } else {
        const display = this.translate.instant('Companion.RechargeCheck.Fail', displayData);
        this.notificationService.info(display);
      }

      return success;
    });
  }

  getMaxUses(monsterPower: MonsterPower, collection: CreatureConfigurationCollection): number {
    if (monsterPower == null || monsterPower.limitedUse == null) {
      return 0;
    }

    if (monsterPower.limitedUse.limitedUseType === LimitedUseType.RECHARGE) {
      return 1;
    } else {
      let maxUses = monsterPower.limitedUse.quantity;
      if (monsterPower.limitedUse.abilityModifier !== '0') {
        const ability: CreatureAbilityProficiency = this.creatureService.getAbility(monsterPower.limitedUse.abilityModifier, collection);
        const modifier: number = this.creatureService.getAbilityModifier(ability, collection);
        maxUses += modifier;
      }
      return maxUses;
    }
  }

  getLimitedUseDisplay(usesRemaining: number, monsterPower: MonsterPower): string {
    let remaining = usesRemaining + '';
    if (monsterPower.limitedUse != null && monsterPower.limitedUse.limitedUseType === LimitedUseType.DICE) {
      const label = this.translate.instant('DiceSize.' + monsterPower.limitedUse.diceSize);
      remaining += 'd' + label;
    }
    return remaining;
  }

  getRechargeDisplay(monsterPower: MonsterPower): string {
    if (monsterPower.limitedUse != null && monsterPower.limitedUse.limitedUseType === LimitedUseType.RECHARGE) {
      let rechargeDisplay = monsterPower.rechargeMin + '';
      if (monsterPower.rechargeMin < monsterPower.rechargeMax) {
        rechargeDisplay += '-' + monsterPower.rechargeMax;
      }
      return rechargeDisplay;
    }
    return '';
  }

  /********************* Spells *************************/

  addSpells(spells: SpellConfiguration[], companion: Companion): Promise<any> {
    const creaturePowers: CreaturePower[] = [];
    spells.forEach((spell: SpellConfiguration) => {
      const creaturePower = new CreaturePower();
      creaturePower.powerId = spell.spell.id;
      creaturePower.powerName = spell.spell.name;
      creaturePower.powerType = PowerType.SPELL
      creaturePower.usesRemaining = 0;
      creaturePowers.push(creaturePower);
    });

    const powerList = new CreaturePowerList();
    powerList.creaturePowers = creaturePowers;
    return this.http.put<any>(`${environment.backendUrl}/creatures/${companion.id}/powers`, powerList).toPromise();
  }

  addInnateSpells(spells: InnateSpellConfiguration[], companion: Companion): Promise<any> {
    const creaturePowers: CreaturePower[] = [];
    spells.forEach((spell: InnateSpellConfiguration) => {
      const creaturePower = new CreaturePower();
      creaturePower.powerId = spell.spell.id;
      creaturePower.powerName = spell.spell.name;
      creaturePower.powerType = PowerType.SPELL
      creaturePower.usesRemaining = spell.limitedUse == null ? 0 : spell.limitedUse.quantity;
      creaturePowers.push(creaturePower);
    });

    const powerList = new CreaturePowerList();
    powerList.creaturePowers = creaturePowers;
    return this.http.put<any>(`${environment.backendUrl}/creatures/${companion.id}/powers`, powerList).toPromise();
  }

  /********************* Damages *************************/

  initializeDamageConfigurations(action: MonsterAction, companion: Companion, collection: CreatureConfigurationCollection): DamageConfigurationCollection {
    if (action == null) {
      return null;
    }

    const configuration = this.monsterService.initializeDamageConfigurations(action);
    if (companion == null || collection == null) {
      return configuration;
    }

    if (action.attackType === AttackType.ATTACK) {
      if (configuration.attackAbilityMod !== '0') {
        const ability = this.creatureService.getAbility(configuration.attackAbilityMod, collection);
        const abilityMod = this.creatureService.getAbilityModifier(ability, collection);
        configuration.attackMod += abilityMod;
        configuration.attackAbilityMod = '0';
      }
    } else if (action.attackType === AttackType.SAVE) {
      if (configuration.saveAbilityModifier !== '0') {
        const ability = this.creatureService.getAbility(configuration.saveAbilityModifier, collection);
        const abilityMod = this.creatureService.getAbilityModifier(ability, collection);
        configuration.attackMod += abilityMod;
        configuration.saveAbilityModifier = '0';
      }
      if (configuration.saveProficiencyModifier) {
        const profValue = collection.profBonus;
        configuration.attackMod += profValue;
        configuration.saveProficiencyModifier = false;
      }
    }

    const finalDamages: DamageConfiguration[] = [];
    const damages: DamageConfiguration[] = _.cloneDeep(configuration.damageConfigurations);
    damages.forEach((damage: DamageConfiguration) => {
      if (damage.values.abilityModifier.id !== '0') {
        const ability: CreatureAbilityProficiency = this.creatureService.getAbility(damage.values.abilityModifier.id, collection);
        const modifier: number = this.creatureService.getAbilityModifier(ability, collection);
        damage.values.miscModifier += modifier;
        damage.values.abilityModifier = new Ability();
      }

      if (damage.values.numDice > 0 || damage.values.miscModifier !== 0) {
        finalDamages.push(damage);
      }
    });

    configuration.damageConfigurations = this.powerService.combineDamages(finalDamages);
    return configuration;
  }

  getPowerDamages(power: Power, companion: Companion, characterLevel: CharacterLevel,
                  collection: CreatureConfigurationCollection, attackModifier: PowerModifier,
                  saveModifier: PowerModifier): DamageConfigurationCollection {
    return this.creatureService.getPowerDamages(power, companion, characterLevel, collection, attackModifier, saveModifier)
  }

  getPowerModifiers(power: Power, companion: Companion,
                    collection: CreatureConfigurationCollection, baseLevel = 0, extraLevel  = 0): ModifierConfigurationCollection {
    if (power == null) {
      return null;
    }

    const configuration = this.powerService.initializeModifierConfigurations(power);
    if (companion == null || collection == null) {
      return configuration;
    }

    const levels = this.characterLevelService.getLevelsDetailedFromStorage();
    const modifiers =  _.cloneDeep(configuration.modifierConfigurations);
    const casterLevel = this.characterLevelService.getLevelBySid(companion.monster.spellcasterLevel.sid);

    if (configuration.advancementModifiers) {
      configuration.advancementModifierConfigurations.forEach((modifier: ModifierConfiguration) => {
        if (this.includeModifierForCharacterLevel(modifier, casterLevel, levels)) {
          modifiers.push(_.cloneDeep(modifier));
        }
      });

      configuration.advancementModifiers = false;
      configuration.advancementModifierConfigurations = [];
    } else if (configuration.extraModifiers && extraLevel > baseLevel) {
      const numSteps = (extraLevel - baseLevel) / configuration.numLevelsAboveBase;
      for (let i = 0; i < numSteps; i++) {
        configuration.extraModifierConfigurations.forEach((damage: ModifierConfiguration) => {
          configuration.modifierConfigurations.push(damage);
        });
      }
    }

    configuration.modifierConfigurations = this.powerService.combineModifiers(modifiers);
    return configuration;
  }

  private includeModifierForCharacterLevel(modifier: ModifierConfiguration, characterLevel: CharacterLevel, levels: CharacterLevel[]): boolean {
    if (characterLevel == null) {
      return false;
    }
    const level = this.getLevel(modifier.level, levels);
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

  getAbilitySaveModifier(ability: CreatureAbilityProficiency, companion: Companion, collection: CreatureConfigurationCollection, characterProf: number): number {
    let modifier = this.creatureService.getAbilitySaveModifier(ability, companion, collection);
    modifier += companion.savingThrowModifier.misc;
    if (companion.savingThrowModifier.includeCharactersProf) {
      if (ability.saveProficiency != null &&
        (ability.saveProficiency.proficient || ability.saveProficiency.inheritedFrom.length > 0)) {
        modifier += characterProf;
      }
    }
    return modifier;
  }

  isSkillInheritedFromCharacter(skill: CreatureSkillListProficiency): boolean {
    if (skill.inheritedFrom != null) {
      for (let i = 0; i < skill.inheritedFrom.length; i++) {
        if (skill.inheritedFrom[i].name === 'Character') {
          return true;
        }
      }
    }
    return false;
  }

  getAc(companion: Companion, collection: CreatureConfigurationCollection, characterProf: number): number {
    let ac = companion.monster.ac + companion.acModifier.misc;
    if (companion.acModifier.includeCharactersProf) {
      ac += characterProf;
    }
    return ac;
  }
}
