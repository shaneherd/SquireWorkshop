import {Injectable} from '@angular/core';
import {ExportDetailsService} from './export.service';
import {ExportCacheService} from './export-cache.service';
import {CharacterService} from '../creatures/character.service';
import {Creature} from '../../../shared/models/creatures/creature';
import {CreatureType} from '../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../shared/models/creatures/characters/player-character';
import {CreatureService} from '../creatures/creature.service';
import {SID} from '../../../constants';
import {ExportCharacteristicService} from './export-characteristic.service';
import {HealthCalculationType} from '../../../shared/models/creatures/characters/health-calculation-type.enum';
import {Gender} from '../../../shared/models/creatures/characters/gender.enum';
import {CreatureHitDice} from '../../../shared/models/creatures/creature-hit-dice';
import {DiceSize} from '../../../shared/models/dice-size.enum';
import * as _ from 'lodash';
import {CreatureAbilityScore} from '../../../shared/models/creatures/creature-ability-score';
import {ExportSharedService} from './export-shared.service';
import {Proficiency, ProficiencyType} from '../../../shared/models/proficiency';
import {Tag} from '../../../shared/models/tag';
import {ChosenClass} from '../../../shared/models/creatures/characters/chosen-class';
import {HealthGainResult} from '../../../shared/models/creatures/characters/health-gain-result';
import {DamageModifier} from '../../../shared/models/characteristics/damage-modifier';
import {ListObject} from '../../../shared/models/list-object';
import {LanguageService} from '../attributes/language.service';
import {CharacterNote} from '../../../shared/models/creatures/characters/character-note';
import {Skill} from '../../../shared/models/attributes/skill';
import {SkillService} from '../attributes/skill.service';
import {ExportAttributeService} from './export-attribute.service';
import {ExportPowerService} from './export-power.service';
import {Feature} from '../../../shared/models/powers/feature';
import {ExportMonsterService} from './export-monster.service';
import {CreatureHealth} from '../../../shared/models/creatures/creature-health';
import {CreatureState} from '../../../shared/models/creatures/creature-state.enum';
import {CompanionService} from '../creatures/companion.service';
import {Companion} from '../../../shared/models/creatures/companions/companion';
import {MonsterService} from '../creatures/monster.service';
import {CreatureWealthAmount} from '../../../shared/models/creatures/creature-wealth-amount';
import {AbilityService} from '../attributes/ability.service';
import {ArmorTypeService} from '../attributes/armor-type.service';
import {WeaponTypeService} from '../attributes/weapon-type.service';
import {ItemService} from '../items/item.service';
import {ItemProficiency} from '../../../shared/models/items/item-proficiency';
import {ItemType} from '../../../shared/models/items/item-type.enum';
import {CharacterLevelService} from '../character-level.service';
import {Condition} from '../../../shared/models/attributes/condition';
import {Ability} from '../../../shared/models/attributes/ability.model';
import {BackgroundTraitType} from '../../../shared/models/characteristics/background-trait-type.enum';
import {BackgroundTrait} from '../../../shared/models/characteristics/background-trait';
import {CreatureSpellSlot} from '../../../shared/models/creatures/creature-spell-slot';
import {Spell} from '../../../shared/models/powers/spell';
import {ExportItemService} from './export-item.service';
import {Armor} from '../../../shared/models/items/armor';
import {CreatureItem} from '../../../shared/models/creatures/creature-item';
import {CreatureItemState} from '../../../shared/models/creatures/creature-item-state.enum';
import {Mount} from '../../../shared/models/items/mount';
import {Weapon} from '../../../shared/models/items/weapon';
import {WeaponRangeType} from '../../../shared/models/items/weapon-range-type.enum';
import {MagicalItem} from '../../../shared/models/items/magical-item';
import {Ammo} from '../../../shared/models/items/ammo';
import {Tool} from '../../../shared/models/items/tool';
import {Treasure} from '../../../shared/models/items/treasure';
import {Gear} from '../../../shared/models/items/gear';
import {CreatureFeature} from '../../../shared/models/creatures/creature-feature';
import {LimitedUseType} from '../../../shared/models/limited-use-type.enum';
import {LimitedUse} from '../../../shared/models/powers/limited-use';
import {
  CharacterEquipmentSettings,
  CharacterFeatureSettings,
  CharacterHealthSettings,
  CharacterSettings,
  CharacterSkillSettings,
  CharacterSpeedSettings,
  CharacterSpellcastingSettings,
  CharacterValidationSettings
} from '../../../shared/models/creatures/characters/character-settings';
import {Spellcasting} from '../../../shared/models/spellcasting';
import {CreatureSpell} from '../../../shared/models/creatures/creature-spell';
import {CreatureItemService} from '../creatures/creature-item.service';
import {EquipmentSlotType} from '../../../shared/models/items/equipment-slot-type.enum';
import {PowerService} from '../powers/power.service';
import {CreatureAction} from '../../../shared/models/creatures/creature-action';
import {CreatureActionType} from '../../../shared/models/creatures/creature-action-type.enum';
import {DamageConfiguration} from '../../../shared/models/damage-configuration';
import {RangeType} from '../../../shared/models/powers/range-type.enum';
import {AttackType} from '../../../shared/models/attack-type.enum';
import {WeaponProperty} from '../../../shared/models/attributes/weapon-property';
import {MagicalItemType} from '../../../shared/models/items/magical-item-type.enum';

@Injectable({
  providedIn: 'root'
})
export class ExportCreatureService implements ExportDetailsService {

  constructor(
    private exportCacheService: ExportCacheService,
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private exportCharacteristicService: ExportCharacteristicService,
    private exportAttributeService: ExportAttributeService,
    private exportPowerService: ExportPowerService,
    private exportMonsterService: ExportMonsterService,
    private exportItemService: ExportItemService,
    private exportSharedService: ExportSharedService,
    private languageService: LanguageService,
    private armorTypeService: ArmorTypeService,
    private itemService: ItemService,
    private weaponTypeService: WeaponTypeService,
    private skillService: SkillService,
    private companionService: CompanionService,
    private monsterService: MonsterService,
    private abilityService: AbilityService,
    private characterLevelService: CharacterLevelService,
    private creatureItemService: CreatureItemService,
    private powerService: PowerService
  ) { }

  export(id: string, proExport: boolean): Promise<object> {
    return this.creatureService.getCreature(id).then((creature: Creature) => {
      return this.processCreature(creature, proExport);
    });
  }

  processObject(object: Object, proExport: boolean): Promise<object> {
    return this.processCreature(object as Creature, proExport);
  }

  async processCreature(creature: Creature, proExport: boolean): Promise<object> {
    switch (creature.creatureType) {
      case CreatureType.CHARACTER:
        const playerCharacter = creature as PlayerCharacter;
        return await this.processPlayerCharacter(playerCharacter, proExport);
      // case CreatureType.MONSTER:
      //   break;
      // case CreatureType.QUICK_CHARACTER:
      //   break;
      // case CreatureType.NPC:
      //   break;
      // case CreatureType.COMPANION:
      //   break;
    }
    return null;
  }

  async processPlayerCharacter(playerCharacter: PlayerCharacter, proExport: boolean): Promise<object> {
    this.initializeCharacter(playerCharacter);
    const obj = {
      'type': 'Character',
      'acMod': this.getMiscProfModifier(playerCharacter, SID.MISC_ATTRIBUTES.AC),
      'age': playerCharacter.characteristics.age,
      'alignment': playerCharacter.alignment == null ? 'Neutral' : this.exportSharedService.getAlignment(playerCharacter.alignment.sid),
      'applyWeightPenalties': playerCharacter.characterSettings.equipment.useEncumbrance,
      'armorProfs': this.getArmorProfs(playerCharacter),
      'armorTypeProfs': await this.getArmorTypeProfs(playerCharacter),
      'autoConvertCurrency': playerCharacter.characterSettings.equipment.autoConvertCurrency,
      'background': playerCharacter.characterBackground.customBackgroundName,
      'bio': playerCharacter.characterBackground.bio,
      'bonds': playerCharacter.characterBackground.customBond,
      'calculateCurrencyWeight': playerCharacter.characterSettings.equipment.calculateCurrencyWeight,
      'carryMod': this.getMiscProfModifier(playerCharacter, SID.MISC_ATTRIBUTES.CARRYING_CAPACITY),
      'carryingWeightModifier': this.getMiscProfModifier(playerCharacter, SID.MISC_ATTRIBUTES.EQUIPMENT),
      'cha': this.getAbility(playerCharacter, SID.ABILITIES.CHARISMA),
      'chaMod': 0,
      'chaRaceModified': false,
      'chaSaveAdvantage': this.getSaveAdvantage(playerCharacter, SID.ABILITIES.CHARISMA),
      'chaSaveMod': this.getSaveMod(playerCharacter, SID.ABILITIES.CHARISMA),
      'chosenBackground': await this.getChosenBackground(playerCharacter, proExport),
      'chosenBond': this.getChosenTraitId(playerCharacter, BackgroundTraitType.BOND, 0),
      'chosenClassSubclasses': await this.getChosenClassSubclasses(playerCharacter, proExport),
      'chosenFlaw': this.getChosenTraitId(playerCharacter, BackgroundTraitType.FLAW, 0),
      'chosenIdeal': this.getChosenTraitId(playerCharacter, BackgroundTraitType.IDEAL, 0),
      'chosenPersonality': this.getChosenTraitId(playerCharacter, BackgroundTraitType.PERSONALITY, 0),
      'chosenPersonalityTwo': this.getChosenTraitId(playerCharacter, BackgroundTraitType.PERSONALITY, 1),
      'chosenVariation': this.getChosenTraitId(playerCharacter, BackgroundTraitType.VARIATION, 0),
      'con': this.getAbility(playerCharacter, SID.ABILITIES.CONSTITUTION),
      'conMod': 0,
      'conRaceModified': false,
      'conSaveAdvantage': this.getSaveAdvantage(playerCharacter, SID.ABILITIES.CONSTITUTION),
      'conSaveMod': this.getSaveMod(playerCharacter, SID.ABILITIES.CONSTITUTION),
      'currentHP': playerCharacter.creatureHealth.currentHp,
      'currentState': this.getKilledStatus(playerCharacter.creatureHealth),
      'customSpellCastingAbilityId': this.getCustomSpellCastingAbilityId(playerCharacter),
      'deity': playerCharacter.characteristics.deity == null ? '' : playerCharacter.characteristics.deity.name,
      'dex': this.getAbility(playerCharacter, SID.ABILITIES.DEXTERITY),
      'dexMod': 0,
      'dexRaceModified': false,
      'dexSaveAdvantage': this.getSaveAdvantage(playerCharacter, SID.ABILITIES.DEXTERITY),
      'dexSaveMod': this.getSaveMod(playerCharacter, SID.ABILITIES.DEXTERITY),
      'exhaustionLevel': playerCharacter.creatureHealth.exhaustionLevel,
      'exp': playerCharacter.exp,
      'eyes': playerCharacter.characteristics.eyes,
      'featureAbilities': this.getFeatureAbilities(playerCharacter, proExport),
      'features': await this.getFeatures(playerCharacter),
      'flaws': playerCharacter.characterBackground.customFlaw,
      'gender': this.getGender(playerCharacter),
      'hair': playerCharacter.characteristics.hair,
      'height': playerCharacter.characteristics.height,
      'hitDiceModifier': this.getMiscProfModifier(playerCharacter, SID.MISC_ATTRIBUTES.HIT_DICE),
      'hitDiceRemaining': this.getHitDiceRemaining(playerCharacter),
      'hpAtFirstModifier': playerCharacter.hpGainModifier,
      'hpGainModifier': playerCharacter.hpGainModifier,
      'ideals': playerCharacter.characterBackground.customIdeal,
      'initAdvantage': this.getInitiativeAdvantage(playerCharacter),
      'initMod': this.getMiscProfModifier(playerCharacter, SID.MISC_ATTRIBUTES.INITIATIVE),
      'inspiration': playerCharacter.inspiration,
      'intMod': 0,
      'intRaceModified': false,
      'intSaveAdvantage': this.getSaveAdvantage(playerCharacter, SID.ABILITIES.INTELLIGENCE),
      'intSaveMod': this.getSaveMod(playerCharacter, SID.ABILITIES.INTELLIGENCE),
      'intelligence': this.getAbility(playerCharacter, SID.ABILITIES.INTELLIGENCE),
      'items': await this.getItems(playerCharacter, proExport),
      'languageProfs': await this.getLanguageProfs(playerCharacter),
      'level': this.getLevel(playerCharacter),
      'maxHpModifier': playerCharacter.creatureHealth.maxHpMod,
      'name': playerCharacter.name,
      'notes': this.getNotes(playerCharacter),
      'numDeathSaveThrowFailures': playerCharacter.creatureHealth.numDeathSaveThrowFailures,
      'numDeathSaveThrowSuccesses': playerCharacter.creatureHealth.numDeathSaveThrowSuccesses,
      'passiveInvestigationMod': 0,
      'passivePerceptionMod': 0,
      'personality': playerCharacter.characterBackground.customPersonality,
      'profMod': this.getMiscProfModifier(playerCharacter, SID.MISC_ATTRIBUTES.PROFICIENCY),
      'pushMod': this.getMiscProfModifier(playerCharacter, SID.MISC_ATTRIBUTES.PUSH_CAPACITY),
      'quickAttacks': await this.getQuickAttacks(playerCharacter, proExport),
      'race': await this.getRace(playerCharacter, proExport),
      'restrictToTwenty': playerCharacter.characterSettings.restrictToTwenty,
      'resurrectionPenalty': playerCharacter.creatureHealth.resurrectionPenalty,
      'savingThrowProfs': this.getSavingThrowProfs(playerCharacter),
      'showAutoLevelUpPopup': false,
      'skillProfs': await this.getSkillProfs(playerCharacter, proExport),
      'skin': playerCharacter.characteristics.skin,
      'speedModifiers': this.getSpeedModifiers(playerCharacter),
      'spellAttackAdvantage': this.getSpellcastingAdvantage(playerCharacter, true),
      'spellAttackModifier': this.getSpellcastingModifier(playerCharacter, true),
      'spellSaveDCModifier': this.getSpellcastingModifier(playerCharacter, false),
      'spellSlotModifiers': this.getSpellSlotModifiers(playerCharacter),
      'spellSlotsAvailable': this.getSpellSlotsAvailable(playerCharacter),
      'spells': await this.getSpells(playerCharacter, proExport),
      'str': this.getAbility(playerCharacter, SID.ABILITIES.STRENGTH),
      'strMod': 0,
      'strRaceModified': false,
      'strSaveAdvantage': this.getSaveAdvantage(playerCharacter, SID.ABILITIES.STRENGTH),
      'strSaveMod': this.getSaveMod(playerCharacter, SID.ABILITIES.STRENGTH),
      'tempHP': playerCharacter.creatureHealth.tempHp,
      'toolProfs': this.getToolProfs(playerCharacter),
      'useHalfMaxResult': playerCharacter.healthCalculationType === HealthCalculationType.AVERAGE,
      'useMax': playerCharacter.healthCalculationType === HealthCalculationType.MAX,
      'wealth': this.getWealth(playerCharacter),
      'weaponProfs': this.getWeaponProfs(playerCharacter),
      'weaponTypeProfs': await this.getWeaponTypeProfs(playerCharacter),
      'weight': playerCharacter.characteristics.weight,
      'wis': this.getAbility(playerCharacter, SID.ABILITIES.WISDOM),
      'wisMod': 0,
      'wisRaceModified': false,
      'wisSaveAdvantage': this.getSaveAdvantage(playerCharacter, SID.ABILITIES.WISDOM),
      'wisSaveMod': this.getSaveMod(playerCharacter, SID.ABILITIES.WISDOM)
    };

    if (proExport) {
      obj['companions'] = await this.getCompanions(playerCharacter);
      obj['conditionImmunities'] = this.getConditionImmunities(playerCharacter);
      obj['conditionsList'] = await this.getConditionsList(playerCharacter);
      obj['damageModifiers'] = this.getDamageModifiers(playerCharacter);
      obj['innateSpellAttackAdvantage'] = this.getInnateSpellcastingAdvantage(playerCharacter, true);
      obj['innateSpellAttackModifier'] = this.getInnateSpellcastingModifier(playerCharacter, true);
      obj['innateSpellCastingAbilityId'] = this.getInnateSpellcastingAbilityId(playerCharacter);
      obj['innateSpellSaveDCModifier'] = this.getInnateSpellcastingModifier(playerCharacter, false);
      obj['innateSpells'] = await this.getInnateSpells(playerCharacter);
      obj['spellTags'] = this.getSpellTags(playerCharacter);
    } else {
      obj['conditions'] = await this.getConditionsListFree(playerCharacter);
    }

    return obj;
  }

  private initializeCharacter(playerCharacter: PlayerCharacter): void {
    if (playerCharacter.characterSettings == null) {
      playerCharacter.characterSettings = new CharacterSettings();
    }
    // if (playerCharacter.characterSettings.pages == null || playerCharacter.characterSettings.pages.length === 0) {
    //   playerCharacter.characterSettings.pages = this.getDefaultPageOrders();
    // }
    if (playerCharacter.characterSettings.health == null) {
      playerCharacter.characterSettings.health = new CharacterHealthSettings();
    }
    if (playerCharacter.characterSettings.equipment == null) {
      playerCharacter.characterSettings.equipment = new CharacterEquipmentSettings();
    }
    if (playerCharacter.characterSettings.spellcasting == null) {
      playerCharacter.characterSettings.spellcasting = new CharacterSpellcastingSettings();
    }
    if (playerCharacter.characterSettings.speed == null) {
      playerCharacter.characterSettings.speed = new CharacterSpeedSettings();
    }
    if (playerCharacter.characterSettings.features == null) {
      playerCharacter.characterSettings.features = new CharacterFeatureSettings();
    }
    if (playerCharacter.characterSettings.skills == null) {
      playerCharacter.characterSettings.skills = new CharacterSkillSettings();
    }
    if (playerCharacter.characterSettings.validation == null) {
      playerCharacter.characterSettings.validation = new CharacterValidationSettings();
    }
  }

  private getAbility(playerCharacter: PlayerCharacter, sid: number): object {
    const abilityScore = _.find(playerCharacter.abilityScores, (_abilityScore: CreatureAbilityScore) => {
      return _abilityScore.ability.sid === sid;
    });
    if (abilityScore == null) {
      return {
        'type': 'Ability',
        'abbr': '',
        'id': this.exportSharedService.getAbilityId(sid),
        'miscModifier': 0,
        'name': '',
        'raceModifier': 0,
        'roll': 0
      }
    }
    const increased = this.isAbilityIncreased(playerCharacter, sid) ? 1 : 0;
    return {
      'type': 'Ability',
      'abbr': abilityScore.ability.abbr,
      'id': this.exportSharedService.getAbilityId(sid),
      'miscModifier': abilityScore.miscModifier,
      'name': abilityScore.ability.name,
      'raceModifier': 0,
      'roll': abilityScore.value + abilityScore.asiModifier + increased
    }
  }

  private isAbilityIncreased(playerCharacter: PlayerCharacter, sid: number): boolean {
    const abilityScore = _.find(playerCharacter.abilitiesToIncreaseByOne, (_ability: ListObject) => {
      return _ability.sid === sid;
    });
    return abilityScore != null;
  }

  private getSaveAdvantage(playerCharacter: PlayerCharacter, sid: number): object {
    const prof = this.getProficiencyBySid(playerCharacter.attributeProfs, sid);
    return {
      'type': 'Advantage',
      'advantage': prof != null && prof.advantage,
      'disadvantage': prof != null && prof.disadvantage
    };
  }

  private getSaveMod(playerCharacter: PlayerCharacter, sid: number): number {
    const prof = this.getProficiencyBySid(playerCharacter.attributeProfs, sid);
    if (prof == null) {
      return 0;
    }
    return prof.miscModifier;
  }

  private getLevel(playerCharacter: PlayerCharacter): object {
    const characterLevel = this.characterLevelService.getLevelByExp(playerCharacter.exp);
    const level = parseInt(characterLevel.name, 10);
    return {
      'type': 'Level',
      'id': level,
      'level': level,
      'minExp': characterLevel.minExp,
      'profBonus': characterLevel.profBonus
    };
  }

  private getProficiencyBySid(profs: Proficiency[], sid: number): Proficiency {
    return _.find(profs, (_prof: Proficiency) => {
      return _prof.attribute.sid === sid;
    });
  }

  private getSpellTags(playerCharacter: PlayerCharacter): object[] {
    const tags = [];
    playerCharacter.creatureSpellCasting.tags.forEach((tag: Tag, index: number) => {
      let color = '#ff000000'
      if (tag.color !== '') {
        color = tag.color;
        if (color.indexOf('#ff') === -1) {
          color = `#ff${color}`;
        }
      }
      tags.push({
        'type': 'SpellTag',
        'color': color,
        'id': index + 1,
        'name': tag.title
      });
    });
    return tags;
  }

  private async getChosenBackground(playerCharacter: PlayerCharacter, proExport: boolean): Promise<object> {
    const background = playerCharacter.characterBackground.background;
    if (background == null) {
      return {
        'type' : 'Background',
        'armorProfs': [ ],
        'armorTypeProfs': [ ],
        'bonds': [ ],
        'description': '',
        'flaws': [ ],
        'ideals': [ ],
        'languageProfs': [ ],
        'name': '',
        'numLanguages': 0,
        'numTools': 0,
        'personalities': [ ],
        'savingThrowProfs': [ ],
        'skillProfs': [ ],
        'toolCategoriesToChooseFrom': [ ],
        'toolProfs': [ ],
        'variations': [ ],
        'weaponProfs': [ ],
        'weaponTypeProfs': [ ]
      };
    }
    return await this.exportCharacteristicService.processBackground(background, proExport);
  }

  private async getChosenClassSubclasses(playerCharacter: PlayerCharacter, proExport: boolean): Promise<object[]> {
    const classes = [];
    for (const chosenClass of playerCharacter.classes) {
      const characterClass = await this.exportCharacteristicService.processCharacterClass(chosenClass.characterClass, proExport);
      let subclass = null;
      if (chosenClass.subclass != null) {
        subclass = await this.exportCharacteristicService.processSubclass(chosenClass.subclass, proExport);
      } else {
        subclass = {
          'type' : 'Subclass',
          'casterType' : {
            'type' : 'CasterType',
            'id' : 0,
            'multiClassWeight' : 0,
            'name' : '',
            'roundUp' : false,
            'spellSlots' : [ ]
          },
          'configurations' : [ ],
          'description' : '',
          'id' : 1,
          'name' : 'None'
        }
      }

      classes.push({
        'type': 'ChosenClassSubclass',
        'characterClass': characterClass,
        'classLevel': this.exportSharedService.getLevel(chosenClass.characterLevel),
        'healthGainResults': this.getHealthGainResults(chosenClass),
        'hitDiceMod': chosenClass.numHitDiceMod,
        'subclass': subclass
      });
    }
    return classes;
  }

  private getHealthGainResults(chosenClass: ChosenClass): number[] {
    let results = chosenClass.healthGainResults.slice();
    results = _.sortBy(results, item => parseInt(item.level.name, 10));

    const gains = [];
    results.forEach((result: HealthGainResult) => {
      gains.push(result.value);
    });
    if (gains.length < 20) {
      const length = gains.length;
      for (let i = length; i < 20; i++) {
        gains.push(0);
      }
    }
    return gains;
  }

  private async getCompanions(playerCharacter: PlayerCharacter): Promise<object[]> {
    const companions = [];
    for (const companionListObject of playerCharacter.companions) {
      const creature = await this.companionService.get(companionListObject.id);
      if (creature != null) {
        const companion = creature as Companion;
        const monster = await this.monsterService.getMonster(companion.monster.id);
        if (monster != null) {
          companions.push({
            'currentHp': companionListObject.creatureHealth.currentHp,
            'id': 0,
            'killedStatus': this.getKilledStatus(companionListObject.creatureHealth).toUpperCase(),
            'maxHP': companion.maxHp,
            'maxHpMod': companionListObject.creatureHealth.maxHpMod,
            'monster': await this.exportMonsterService.processMonster(monster),
            'name': companionListObject.name,
            'numDeathSaveThrowFailures': companionListObject.creatureHealth.numDeathSaveThrowFailures,
            'numDeathSaveThrowSuccesses': companionListObject.creatureHealth.numDeathSaveThrowSuccesses,
            'tempHp': companionListObject.creatureHealth.tempHp
          });
        }
      }
    }
    return companions;
  }

  private getKilledStatus(creatureHealth: CreatureHealth): string {
    switch (creatureHealth.creatureState) {
      case CreatureState.STABLE:
        return 'Stable';
      case CreatureState.UNSTABLE:
        return 'Unstable';
      case CreatureState.CONSCIOUS:
        return 'Conscious';
      case CreatureState.DEAD:
        return 'Dead';
    }
    return 'Conscious';
  }

  private getDamageModifiers(playerCharacter: PlayerCharacter): object[] {
    const modifiers = [];
    playerCharacter.damageModifiers.forEach((modifier: DamageModifier) => {
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

  private getFeatureAbilities(playerCharacter: PlayerCharacter, proExport: boolean): object[] {
    const featureAbilities = [];
    playerCharacter.creatureFeatures.features.forEach((creatureFeature: CreatureFeature) => {
      if (creatureFeature.limitedUses.length > 0) {
        const limitedUse = creatureFeature.limitedUses[0];
        if (proExport) {
          featureAbilities.push({
            'type': 'FeatureAbility',
            'diceSize': this.exportSharedService.getDiceSize(limitedUse.diceSize),
            'featureAbilityType': this.getFeatureAbilityType(limitedUse.limitedUseType),
            'featureId': 0,
            'maxQuantity': this.getFeatureAbilityQuantity(limitedUse, playerCharacter),
            'name': creatureFeature.powerName,
            'quantityRemaining': creatureFeature.usesRemaining,
            'regainOnLongRest': creatureFeature.rechargeOnLongRest,
            'regainOnShortRest': creatureFeature.rechargeOnShortRest
          });
        } else {
          featureAbilities.push({
            'type': 'FeatureAbility',
            'dice': limitedUse.limitedUseType === LimitedUseType.DICE,
            'diceSize': this.exportSharedService.getDiceSize(limitedUse.diceSize, 4),
            'maxQuantity': this.getFeatureAbilityQuantity(limitedUse, playerCharacter),
            'name': creatureFeature.powerName,
            'quantity': limitedUse.limitedUseType !== LimitedUseType.DICE,
            'quantityRemaining': creatureFeature.usesRemaining,
            'regainOnLongRest': creatureFeature.rechargeOnLongRest,
            'regainOnShortRest': creatureFeature.rechargeOnShortRest
          });
        }
      }
    });

    return featureAbilities;
  }

  private getFeatureAbilityType(limitedUseType: LimitedUseType): string {
    switch (limitedUseType) {
      case LimitedUseType.QUANTITY:
        return 'QUANTITY';
      case LimitedUseType.DICE:
        return 'DICE';
      case LimitedUseType.LEVEL:
        return 'QUANTITY';
      case LimitedUseType.RECHARGE:
        return 'QUANTITY';
    }
    return 'QUANTITY';
  }

  private getFeatureAbilityQuantity(limitedUse: LimitedUse, playerCharacter: PlayerCharacter): number {
    switch (limitedUse.limitedUseType) {
      case LimitedUseType.QUANTITY:
      case LimitedUseType.DICE:
        let abilityModifier = 0;
        if (limitedUse.abilityModifier !== '') {
          const score = this.getAbilityScore(playerCharacter, limitedUse.abilityModifier);
          abilityModifier = this.abilityService.getAbilityModifier(score);
        }
        return this.powerService.getMaxUses(limitedUse, abilityModifier);
      case LimitedUseType.LEVEL:
        const level = this.characterLevelService.getLevelByExp(playerCharacter.exp);
        return parseInt(level.name, 10);
      case LimitedUseType.RECHARGE:
        return 1;
    }
  }

  private async getFeatures(playerCharacter: PlayerCharacter): Promise<object[]> {
    const features = [];
    for (const creatureFeature of playerCharacter.creatureFeatures.features) {
      const feature = await this.exportCacheService.getPower(creatureFeature.feature.id);
      features.push(await this.exportPowerService.processFeature(feature as Feature));
    }
    return features;
  }

  private async getQuickAttacks(playerCharacter: PlayerCharacter, proExport: boolean): Promise<object[]> {
    const quickAttacks = [];
    for (const creatureAction of playerCharacter.favoriteActions) {
      let obj = null;
      switch (creatureAction.creatureActionType) {
        case CreatureActionType.SPELL:
          obj = await this.getQuickAttackSpell(creatureAction, playerCharacter, proExport);
          break;
        case CreatureActionType.FEATURE:
          obj = await this.getQuickAttackFeature(creatureAction, playerCharacter);
          break;
        case CreatureActionType.ITEM:
          obj = await this.getQuickAttackItem(creatureAction, playerCharacter, proExport);
          break;
      }
      if (obj != null) {
        quickAttacks.push(obj);
      }
    }
    return quickAttacks;
  }

  private getSpellAttackDamages(spell: Spell): object[] {
    const attackDamages = [];
    const attackType = spell.rangeType === RangeType.SELF || spell.rangeType === RangeType.TOUCH ? 1 : 2; // melee = 1, ranged = 2, thrown = 3
    spell.damageConfigurations.forEach((damageConfiguration: DamageConfiguration) => {
      attackDamages.push(this.getAttackDamage(damageConfiguration, attackType));
    });
    return attackDamages;
  }

  private getSpellExtraAttackDamages(spell: Spell): object[] {
    const attackDamages = [];
    const attackType = spell.rangeType === RangeType.SELF || spell.rangeType === RangeType.TOUCH ? 1 : 2; // melee = 1, ranged = 2, thrown = 3
    spell.extraDamageConfigurations.forEach((damageConfiguration: DamageConfiguration) => {
      attackDamages.push(this.getAttackDamage(damageConfiguration, attackType));
    });
    return attackDamages;
  }

  private getFeatureAttackDamages(feature: Feature): object[] {
    const attackDamages = [];
    const attackType = feature.rangeType === RangeType.SELF || feature.rangeType === RangeType.TOUCH ? 1 : 2; // melee = 1, ranged = 2, thrown = 3
    feature.damageConfigurations.forEach((damageConfiguration: DamageConfiguration) => {
      attackDamages.push(this.getAttackDamage(damageConfiguration, attackType));
    });
    return attackDamages;
  }

  private getAttackDamage(damageConfiguration: DamageConfiguration, attackType: number): object {
    return {
      'type': 'AttackDamage',
      'attackType': attackType,
      'damageAbility': this.getDamageAbilityModifier(damageConfiguration),
      'damageMod': damageConfiguration.values.miscModifier,
      'damageType': damageConfiguration.damageType == null ? '' : this.exportSharedService.getDamageType(damageConfiguration.damageType.sid),
      'diceSize': this.getDiceSize(damageConfiguration.values.diceSize),
      'numDice': damageConfiguration.values.numDice,
      'quickAttackId': 0
    };
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

  private async getQuickAttackSpell(creatureAction: CreatureAction, playerCharacter: PlayerCharacter, proExport: boolean): Promise<object> {
    const spellId = creatureAction.item.id;
    const power = await this.exportCacheService.getPower(spellId);
    const spell = power as Spell;
    const creatureSpell = _.find(playerCharacter.creatureSpellCasting.spells, (_creatureSpell: CreatureSpell) => {
      return _creatureSpell.spell.id === spellId;
    });
    if (creatureSpell == null) {
      return null;
    }
    const spellcastingAbilityId = this.characterService.getCharacteristicSpellcastingAbilityId(playerCharacter, creatureSpell.assignedCharacteristic);
    const abilityScore = _.find(playerCharacter.abilityScores, (_abilityScore: CreatureAbilityScore) => {
      return _abilityScore.ability.id === spellcastingAbilityId;
    });
    const spellcastingAbility = abilityScore == null ? null : abilityScore.ability;
    const obj = {
      'type': 'QuickAttackSpell',
      'attackDamages': this.getSpellAttackDamages(spell),
      'attackMod': spell.attackMod,
      'attackType': this.getAttackType(spell.attackType),
      'baseLevelSlot': spell.level,
      'extraDamages': this.getSpellExtraAttackDamages(spell),
      'halfOnMissSave': spell.halfOnSave,
      'name': spell.name,
      'numLevelsAbove': spell.numLevelsAboveBase,
      'saveType': this.getAbilityObject(spell.saveType),
      'spell': await this.exportPowerService.processSpell(spell),
      'spellCastingAbility': this.getAbilityObject(spellcastingAbility),
      'quickAttackType': 'SPELL'
    };
    if (proExport) {
      obj['innate'] = creatureSpell.innate;
    }
    return obj;
  }

  private getAttackType(attackType: AttackType): string {
    switch (attackType) {
      case AttackType.ATTACK:
        return 'ATTACK';
      case AttackType.SAVE:
        return 'SAVE';
      case AttackType.HEAL:
        return 'Heal';
    }
    return 'ATTACK';
  }

  private getAbilityObject(ability: Ability): object {
    if (ability == null || ability.id === '0') {
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
      'abbr': ability.abbr,
      'id': this.exportSharedService.getAbilityId(ability.sid),
      'miscModifier': 0,
      'name': ability.name,
      'raceModifier': 0,
      'roll': 10
    }
  }

  private async getQuickAttackFeature(creatureAction: CreatureAction, playerCharacter: PlayerCharacter): Promise<object> {
    const featureId = creatureAction.item.id;
    const power = await this.exportCacheService.getPower(featureId);
    const feature = power as Feature;
    const creatureFeature = _.find(playerCharacter.creatureFeatures.features, (_creatureFeature: CreatureFeature) => {
      return _creatureFeature.feature.id === featureId;
    });
    if (creatureFeature == null) {
      return null;
    }
    const abilityModifierId = feature.attackType === AttackType.ATTACK ? feature.attackAbilityModifier : feature.saveAbilityModifier;
    const abilityScore = _.find(playerCharacter.abilityScores, (_abilityScore: CreatureAbilityScore) => {
      return _abilityScore.ability.id === abilityModifierId;
    });
    const abilityModifier = abilityScore == null ? null : abilityScore.ability;

    return {
      'type': 'QuickAttackFeature',
      'ability': this.getAbilityObject(abilityModifier),
      'addProf': false,
      'attackDamages': this.getFeatureAttackDamages(feature),
      'attackMod': feature.attackMod,
      'attackType': this.getAttackType(feature.attackType),
      'feature': await this.exportPowerService.processFeature(feature),
      'halfOnMissSave': feature.halfOnSave,
      'name': feature.name,
      'saveType': this.getAbilityObject(feature.saveType),
      'quickAttackType': 'FEATURE'
    };
  }

  private getWeaponAttackDamages(weapon: Weapon): object[] {
    const attackDamages = [];
    const attackType = weapon.rangeType === WeaponRangeType.MELEE ? 1 : 2; // melee = 1, ranged = 2, thrown = 3
    weapon.damages.forEach((damageConfiguration: DamageConfiguration) => {
      attackDamages.push(this.getAttackDamage(damageConfiguration, attackType));
    });
    if (this.isThrown(weapon)) {
      weapon.damages.forEach((damageConfiguration: DamageConfiguration) => {
        attackDamages.push(this.getAttackDamage(damageConfiguration, 3));
      })
    }
    return attackDamages;
  }

  private getMagicalItemAttackDamages(magicalItem: MagicalItem, creatureItem: CreatureItem): object[] {
    const attackDamages = [];

    let melee = true;
    let thrown = false;
    let baseDamages: DamageConfiguration[] = _.cloneDeep(magicalItem.damages);
    if (creatureItem.magicalItem != null && creatureItem.magicalItem.itemType === ItemType.WEAPON) {
      const weapon = creatureItem.magicalItem as Weapon;
      melee = weapon.rangeType === WeaponRangeType.MELEE;
      thrown = this.isThrown(weapon);

      if (weapon.damages != null) {
        baseDamages = weapon.damages.concat(baseDamages);
      }
    }
    this.powerService.combineDamages(baseDamages);

    baseDamages.forEach((damageConfiguration: DamageConfiguration) => {
      attackDamages.push(this.getAttackDamage(damageConfiguration, melee ? 1 : 2));
    });
    if (thrown) {
      baseDamages.forEach((damageConfiguration: DamageConfiguration) => {
        attackDamages.push(this.getAttackDamage(damageConfiguration, 3));
      });
    }
    return attackDamages;
  }

  private async getQuickAttackItem(creatureAction: CreatureAction, playerCharacter: PlayerCharacter, proExport: boolean): Promise<object> {
    const itemId = creatureAction.item.id;

    const flatItemList = this.creatureItemService.getFlatItemList(playerCharacter.items);
    const creatureItem = _.find(flatItemList, (_creatureItem: CreatureItem) => {
      return _creatureItem.item.id === itemId;
    });

    if (creatureItem == null) {
      return null;
    }
    const item = creatureItem.item;
    if (item.itemType === ItemType.MAGICAL_ITEM) {
      const magicalItem = item as MagicalItem;
      return this.getQuickAttackMagicalItem(magicalItem, creatureItem, proExport);
    } else if (item.itemType !== ItemType.WEAPON) {
      return null;
    }
    const weapon = item as Weapon;
    const str = this.abilityService.getAbilityBySid(SID.ABILITIES.STRENGTH);
    const dex = this.abilityService.getAbilityBySid(SID.ABILITIES.DEXTERITY);

    return {
      'type': 'QuickAttackWeapon',
      'attackDamages': this.getWeaponAttackDamages(weapon),
      'attackMod': 0,
      'item': await this.getBasicWeapon(weapon, creatureItem, proExport),
      'meleeAbility': this.getAbilityObject(str),
      'name': creatureItem.name,
      'rangedAbility': this.getAbilityObject(dex),
      'thrownAbility': this.getAbilityObject(str),
      'useProf': this.isItemProficient(weapon, playerCharacter.itemProfs),
      'useTwoHands': this.isTwoHanded(weapon),
      'quickAttackType': 'WEAPON'
    };
  }

  private isTwoHanded(weapon: Weapon): boolean {
    if (weapon == null) {
      return false;
    }
    const weaponProperty = _.find(weapon.properties, (_weaponProperty: WeaponProperty) => {
      return _weaponProperty.sid === SID.WEAPON_PROPERTIES.TWO_HANDED;
    });
    return weaponProperty != null;
  }

  private isThrown(weapon: Weapon): boolean {
    if (weapon == null) {
      return false;
    }
    const weaponProperty = _.find(weapon.properties, (_weaponProperty: WeaponProperty) => {
      return _weaponProperty.sid === SID.WEAPON_PROPERTIES.THROWN;
    });
    return weaponProperty != null;
  }

  private async getQuickAttackMagicalWeapon(magicalItem: MagicalItem, creatureItem: CreatureItem, proExport: boolean): Promise<object> {
    if (!proExport || magicalItem == null) {
      return null;
    }
    const str = this.abilityService.getAbilityBySid(SID.ABILITIES.STRENGTH);
    const dex = this.abilityService.getAbilityBySid(SID.ABILITIES.DEXTERITY);
    return {
      'type': 'QuickAttackWeapon',
      'attackDamages': this.getMagicalItemAttackDamages(magicalItem, creatureItem),
      'attackMod': magicalItem.attackMod,
      'item': await this.getMagicalItem(magicalItem, creatureItem),
      'meleeAbility': this.getAbilityObject(str),
      'name': magicalItem.name,
      'rangedAbility': this.getAbilityObject(dex),
      'thrownAbility': this.getAbilityObject(str),
      'useProf': false,
      'useTwoHands': false,
      'quickAttackType': 'WEAPON'
    };
  }

  private async getQuickAttackMagicalItem(magicalItem: MagicalItem, creatureItem: CreatureItem, proExport: boolean): Promise<object> {
    if (!proExport) {
      return null;
    }
    if (magicalItem.magicalItemType === MagicalItemType.WEAPON) {
      return this.getQuickAttackMagicalWeapon(magicalItem, creatureItem, proExport);
    }
    const saveTypeAbility = this.abilityService.getAbilityById(magicalItem.saveType.id);
    return {
      'type': 'QuickAttackMagicalItem',
      'ability': this.getAbilityObject(null),
      'addProf': false,
      'attackDamages': this.getMagicalItemAttackDamages(magicalItem, creatureItem),
      'attackMod': magicalItem.attackMod,
      'attackType': this.getAttackType(magicalItem.attackType),
      'baseSpellLevel': 0,
      'expendSpell': false,
      'extraDamages': [],
      'halfOnMissSave': false,
      'magicalItem': await this.getMagicalItem(magicalItem, creatureItem),
      'name': magicalItem.name,
      'numChargesAbove': 0,
      'numChargesUsed': 0,
      'saveType': this.getAbilityObject(saveTypeAbility),
      'stored': false
    };
  }

  private async getItems(playerCharacter: PlayerCharacter, proExport: boolean): Promise<object[]> {
    const items = [];
    const idMap = new Map<string, number>();
    let newId = 1;
    const flatItemList = this.creatureItemService.getFlatItemList(playerCharacter.items);

    for (const creatureItem of flatItemList) {
      const obj = await this.processCreatureItem(creatureItem, proExport);
      if (obj != null) {
        obj['dropped'] = this.isDropped(creatureItem);
        obj['quantity'] = creatureItem.quantity;

        idMap.set(creatureItem.id, newId);
        obj['characterItemId'] = newId;
        obj['containerId'] = creatureItem.containerId;
        newId++;
        if (creatureItem.equipmentSlot != null && creatureItem.equipmentSlot.equipmentSlotType != null && creatureItem.equipmentSlot.equipmentSlotType !== EquipmentSlotType.NONE) {
          obj['equippedSlot'] = this.exportSharedService.getEquipmentSlot(creatureItem.equipmentSlot);
        }

        if (proExport) {
          obj['attuned'] = creatureItem.attuned;
          obj['charges'] = creatureItem.chargesRemaining;
          obj['cursed'] = creatureItem.cursed;
        }

        items.push(obj);
      }
    }
    this.processContainers(items, idMap);
    return items;
  }

  private async processCreatureItem(creatureItem: CreatureItem, proExport: boolean): Promise<object> {
    let obj = null;
    switch (creatureItem.item.itemType) {
      case ItemType.WEAPON:
        const weapon = creatureItem.item as Weapon;
        obj = await this.getBasicWeapon(weapon, creatureItem, proExport);
        break;
      case ItemType.ARMOR:
        const armor = creatureItem.item as Armor;
        obj = this.getBasicArmor(armor);
        break;
      case ItemType.GEAR:
        const gear = creatureItem.item as Gear;
        obj = this.getGear(gear);
        break;
      case ItemType.TOOL:
        const tool = creatureItem.item as Tool;
        obj = this.getTool(tool);
        break;
      case ItemType.AMMO:
        const ammo = creatureItem.item as Ammo;
        obj = this.getBasicAmmo(ammo, creatureItem, proExport);
        break;
      case ItemType.MOUNT:
        const mount = creatureItem.item as Mount;
        obj = this.getBasicMount(mount);
        break;
      case ItemType.TREASURE:
        if (proExport) {
          const treasure = creatureItem.item as Treasure;
          obj = this.getTreasure(treasure);
        }
        break;
      case ItemType.MAGICAL_ITEM:
        if (proExport) {
          const magicalItem = creatureItem.item as MagicalItem;
          obj = await this.getMagicalItem(magicalItem, creatureItem);
        }
        break;
      case ItemType.PACK:
        // a creature can't have a pack but have the contents of the pack
        break;
      case ItemType.VEHICLE:
        // not supported in the android app
        break;
    }
    return obj;
  }

  private processContainers(items: object[], idMap: Map<string, number>): void {
    items.forEach((item: object) => {
      const containerId: string = item['containerId'];
      if (containerId !== '0' && idMap.has(containerId)) {
        item['containerId'] = idMap.get(containerId);
      } else {
        item['containerId'] = 0;
      }
    });
  }

  private isDropped(creatureItem: CreatureItem): boolean {
    return creatureItem.creatureItemState === CreatureItemState.DROPPED;
  }

  private async getBasicWeapon(weapon: Weapon, creatureItem: CreatureItem, proExport: boolean): Promise<object> {
    const versatile = weapon.versatileDamages.length > 0 ? weapon.versatileDamages[0] : null;
    const obj = {
      'type': 'BasicWeapon',
      'category': await this.exportItemService.processWeapon(weapon),
      'ammo': await this.exportItemService.processWeaponAmmo(weapon.ammoType),
      'attackModifier': 0,
      'cost': weapon.cost,
      'costUnits': this.exportSharedService.getCostUnit(weapon.costUnit),
      'damageModifier': 0,
      'id': 0,
      'name': weapon.name,
      'notes': weapon.description,
      'rangeLong': weapon.longRange,
      'rangeNormal': weapon.normalRange,
      'versatileDamageDice': versatile == null ? 0 : versatile.values.numDice,
      'versatileDamageDiceSize': versatile == null ? 0 : this.exportSharedService.getDiceSize(versatile.values.diceSize),
      'weight': weapon.weight,
      'melee': weapon.rangeType === WeaponRangeType.MELEE,
      'savingThrowMod': 0
    };
    if (proExport && creatureItem != null) {
      obj['poisoned'] = creatureItem.poisoned;
      obj['silvered'] = creatureItem.silvered;
    }
    return obj;
  }

  private getBasicArmor(armor: Armor): object {
    return {
      'type': 'BasicArmor',
      'category': this.exportItemService.processArmor(armor),
      'cost': armor.cost,
      'costUnits': this.exportSharedService.getCostUnit(armor.costUnit),
      'id': 0,
      'name': armor.name,
      'notes': armor.description,
      'savingThrowMod': 0,
      'weight': armor.weight
    };
  }

  private getBasicAmmo(ammo: Ammo, creatureItem: CreatureItem, proExport: boolean): object {
    const obj = {
      'type': 'BasicAmmo',
      'category': this.exportItemService.processAmmo(ammo),
      'attackMod': 0,
      'cost': ammo.cost,
      'costUnits': this.exportSharedService.getCostUnit(ammo.costUnit),
      'damageMod': 0,
      'id': 0,
      'name': ammo.name,
      'notes': ammo.description,
      'weight': ammo.weight,
      'savingThrowMod': 0
    };
    if (proExport && creatureItem != null) {
      obj['poisoned'] = creatureItem.poisoned;
      obj['silvered'] = creatureItem.silvered;
    }
    return obj;
  }

  private getGear(gear: Gear): object {
    return {
      'type': 'Gear',
      'category': this.exportItemService.processGear(gear),
      'cost': gear.cost,
      'costUnits': this.exportSharedService.getCostUnit(gear.costUnit),
      'id': 0,
      'name': gear.name,
      'notes': gear.description,
      'weight': gear.weight,
      'savingThrowMod': 0
    };
  }

  private getTool(tool: Tool): object {
    return {
      'type': 'Tool',
      'category': this.exportItemService.processTool(tool),
      'cost': tool.cost,
      'costUnits': this.exportSharedService.getCostUnit(tool.costUnit),
      'id': 0,
      'name': tool.name,
      'notes': tool.description,
      'weight': tool.weight,
      'savingThrowMod': 0
    };
  }

  private getBasicMount(mount: Mount): object {
    return {
      'type': 'BasicMount',
      'category': this.exportItemService.processMount(mount),
      'cost': mount.cost,
      'costUnits': this.exportSharedService.getCostUnit(mount.costUnit),
      'id': 0,
      'name': mount.name,
      'notes': mount.description,
      'savingThrowMod': 0
    }
  }

  private getTreasure(treasure: Treasure): object {
    return {
      'type': 'Treasure',
      'category': this.exportItemService.processTreasure(treasure),
      'cost': treasure.cost,
      'costUnits': this.exportSharedService.getCostUnit(treasure.costUnit),
      'id': 0,
      'name': treasure.name,
      'notes': treasure.description,
      'weight': treasure.weight,
      'savingThrowMod': 0
    };
  }

  private async getMagicalItem(magicalItem: MagicalItem, creatureItem: CreatureItem): Promise<object> {
    const obj = {
      'type': 'MagicalItem',
      'poisoned': creatureItem.poisoned,
      'silvered': creatureItem.silvered,
      'category': await this.exportItemService.processMagicalItemCategory(magicalItem),
      'spells': await this.getMagicalItemSpells(creatureItem),
      'cost': magicalItem.cost,
      'costUnits': this.exportSharedService.getCostUnit(magicalItem.costUnit),
      'id': 0,
      'notes': magicalItem.description,
      'savingThrowMod': 0
    };

    const subItem = creatureItem.magicalItem;
    if (subItem != null) {
      switch (subItem.itemType) {
        case ItemType.WEAPON:
          const chosenWeapon = subItem as Weapon;
          obj['chosenWeapon'] = await this.getBasicWeapon(chosenWeapon, null, true);
          break;
        case ItemType.ARMOR:
          const chosenArmor = subItem as Armor;
          obj['chosenArmor'] = this.getBasicArmor(chosenArmor);
          break;
        case ItemType.AMMO:
          const chosenAmmo = subItem as Ammo;
          obj['chosenAmmo'] = this.getBasicAmmo(chosenAmmo, null, true);
          break;
      }
    }
    return obj;
  }

  private async getMagicalItemSpells(creatureItem: CreatureItem): Promise<object[]> {
    const spells = [];
    for (const spellConfiguration of creatureItem.spells) {
      const power = await this.exportCacheService.getPower(spellConfiguration.spell.id);
      const spell = power as Spell;
      spells.push({
        'type': 'StoredSpell',
        'level': spellConfiguration.storedLevel,
        'spell': await this.exportPowerService.processSpell(spell)
      });
    }
    return spells;
  }

  private getNotes(playerCharacter: PlayerCharacter): object[] {
    const notes = [];
    playerCharacter.characterNotes.forEach((characterNote: CharacterNote) => {
      let category = '';
      if (characterNote.characterNoteCategory != null) {
        category = characterNote.characterNoteCategory.name;
      }
      notes.push({
        'description': category,
        'id': 0,
        'name': characterNote.note
      });
    });
    return notes;
  }

  private async getRace(playerCharacter: PlayerCharacter, proExport: boolean): Promise<object> {
    return await this.exportCharacteristicService.processRace(playerCharacter.characterRace.race, proExport);
  }

  private getMiscProf(playerCharacter: PlayerCharacter, sid: number): Proficiency {
    return _.find(playerCharacter.attributeProfs, (prof: Proficiency) => {
      return prof.attribute != null && prof.attribute.proficiencyType === ProficiencyType.MISC && prof.attribute.sid === sid;
    });
  }

  private getSpeedModifiers(playerCharacter: PlayerCharacter): object {
    const walk = this.getMiscProf(playerCharacter, SID.MISC_ATTRIBUTES.WALKING);
    const crawl = this.getMiscProf(playerCharacter, SID.MISC_ATTRIBUTES.CRAWLING);
    const climb = this.getMiscProf(playerCharacter, SID.MISC_ATTRIBUTES.CLIMBING);
    const swim = this.getMiscProf(playerCharacter, SID.MISC_ATTRIBUTES.SWIMMING);
    const fly = this.getMiscProf(playerCharacter, SID.MISC_ATTRIBUTES.FLYING);
    const burrow = this.getMiscProf(playerCharacter, SID.MISC_ATTRIBUTES.BURROW);

    return {
      'burrowSpeedModifier': burrow == null ? 0 : burrow.miscModifier,
      'climbingRoundUp': playerCharacter.characterSettings.speed.climbing.roundUp,
      'climbingSpeedModifier': climb == null ? 0 : climb.miscModifier,
      'climbingUseHalf': playerCharacter.characterSettings.speed.climbing.useHalf,
      'crawlingRoundUp': playerCharacter.characterSettings.speed.crawling.roundUp,
      'crawlingSpeedModifier': crawl == null ? 0 : crawl.miscModifier,
      'crawlingUseHalf': playerCharacter.characterSettings.speed.climbing.useHalf,
      'flyingSpeedModifier': fly == null ? 0 : fly.miscModifier,
      'speedModifier': walk == null ? 0 : walk.miscModifier,
      'swimmingRoundUp': playerCharacter.characterSettings.speed.swimming.roundUp,
      'swimmingSpeedModifier': swim == null ? 0 : swim.miscModifier,
      'swimmingUseHalf': playerCharacter.characterSettings.speed.swimming.useHalf
    };
  }

  private getWealth(playerCharacter: PlayerCharacter): object {
    let cp = 0;
    let sp = 0;
    let ep = 0;
    let gp = 0;
    let pp = 0;
    playerCharacter.creatureWealth.amounts.forEach((amount: CreatureWealthAmount) => {
      switch (amount.costUnit.abbreviation) {
        case 'CP':
          cp = amount.amount;
          break;
        case 'SP':
          sp = amount.amount;
          break;
        case 'EP':
          ep = amount.amount;
          break;
        case 'GP':
          gp = amount.amount;
          break;
        case 'PP':
          pp = amount.amount;
          break;
      }
    });
    return {
      'cp': cp,
      'ep': ep,
      'gp': gp,
      'pp': pp,
      'sp': sp
    };
  }

  private getGender(playerCharacter: PlayerCharacter): string {
    switch (playerCharacter.characteristics.gender) {
      case Gender.NEUTRAL:
        return 'Neutral';
      case Gender.MALE:
        return 'Male';
      case Gender.FEMALE:
        return 'Female';
    }
    return 'Neutral';
  }

  private getHitDiceRemaining(playerCharacter: PlayerCharacter): number[] {
    let d4 = 0;
    let d6 = 0;
    let d8 = 0;
    let d10 = 0;
    let d12 = 0;
    let d20 = 0;
    let d100 = 0;
    playerCharacter.creatureHealth.creatureHitDice.forEach((creatureHitDice: CreatureHitDice) => {
      switch (creatureHitDice.diceSize) {
        case DiceSize.FOUR:
          d4 = creatureHitDice.remaining;
          break;
        case DiceSize.SIX:
          d6 = creatureHitDice.remaining;
          break;
        case DiceSize.EIGHT:
          d8 = creatureHitDice.remaining;
          break;
        case DiceSize.TEN:
          d10 = creatureHitDice.remaining;
          break;
        case DiceSize.TWELVE:
          d12 = creatureHitDice.remaining;
          break;
        case DiceSize.TWENTY:
          d20 = creatureHitDice.remaining;
          break;
        case DiceSize.HUNDRED:
          d100 = creatureHitDice.remaining;
          break;
      }
    });
    return [d4, d6, d8, d10, d12, d20, d100];
  }

  private getMiscProfModifier(playerCharacter: PlayerCharacter, sid: number): number {
    const prof = this.getMiscProf(playerCharacter, sid);
    return prof == null ? 0 : prof.miscModifier;
  }

  private getAbilityScore(playerCharacter: PlayerCharacter, id: string): number {
    const abilityScore = _.find(playerCharacter.abilityScores, (_abilityScore: CreatureAbilityScore) => {
      return _abilityScore.ability.id === id;
    });
    if (abilityScore == null) {
      return 10;
    }
    return abilityScore.value + abilityScore.asiModifier + abilityScore.miscModifier;
  }

  private getAbilityId(id: string): number {
    if (id === '' || id === '0') {
      return -1;
    }
    return this.getAbilityById(id);
  }

  private getAbilityById(id: string, defaultValue: number = 0): number {
    if (id == null || id === '0') {
      return defaultValue;
    }
    const ability = this.abilityService.getAbilityById(id);
    return this.exportSharedService.getAbilityId(ability.sid);
  }

  private getAdvantage(prof: Proficiency): object {
    if (prof == null) {
      return {
        'type': 'Advantage',
        'advantage': false,
        'disadvantage': false
      }
    }
    return {
      'type': 'Advantage',
      'advantage': prof.advantage,
      'disadvantage': prof.disadvantage
    }
  }

  private getInitiativeAdvantage(playerCharacter: PlayerCharacter): object {
    const prof = this.getMiscProf(playerCharacter, SID.MISC_ATTRIBUTES.INITIATIVE);
    return this.getAdvantage(prof);
  }

  private getArmorProfs(playerCharacter: PlayerCharacter): object[] {
    const profs = [];
    playerCharacter.itemProfs.forEach((itemProficiency: ItemProficiency) => {
      if (itemProficiency.proficient && itemProficiency.item != null && itemProficiency.item.itemType === ItemType.ARMOR) {
        profs.push(this.getProfObject(itemProficiency.item.name, this.exportSharedService.getArmorId(itemProficiency.item.sid)));
      }
    });
    return profs;
  }

  private async getArmorTypeProfs(playerCharacter: PlayerCharacter): Promise<object[]> {
    const profs = [];
    const armorTypes = await this.armorTypeService.getArmorTypes();
    armorTypes.forEach((armorType: ListObject) => {
      if (this.isProficient(armorType, playerCharacter.attributeProfs)) {
        profs.push(this.getProfObject(armorType.name, this.exportSharedService.getArmorTypeId(armorType.sid)));
      }
    });
    return profs;
  }

  private getWeaponProfs(playerCharacter: PlayerCharacter): object[] {
    const profs = [];
    playerCharacter.itemProfs.forEach((itemProficiency: ItemProficiency) => {
      if (itemProficiency.proficient && itemProficiency.item.itemType === ItemType.WEAPON) {
        profs.push(this.getProfObject(itemProficiency.item.name, this.exportSharedService.getWeaponId(itemProficiency.item.sid)));
      }
    });
    return profs;
  }

  private async getWeaponTypeProfs(playerCharacter: PlayerCharacter): Promise<object[]> {
    const profs = [];
    const weaponTypes = await this.weaponTypeService.getWeaponTypes();
    weaponTypes.forEach((weaponType: ListObject) => {
      if (this.isProficient(weaponType, playerCharacter.attributeProfs)) {
        profs.push(this.getProfObject(weaponType.name, this.exportSharedService.getWeaponTypeId(weaponType.sid)));
      }
    });
    return profs;
  }

  private getToolProfs(playerCharacter: PlayerCharacter): object[] {
    const profs = [];
    playerCharacter.itemProfs.forEach((itemProficiency: ItemProficiency) => {
      if (itemProficiency.proficient && itemProficiency.item.itemType === ItemType.TOOL) {
        profs.push(this.getProfObject(itemProficiency.item.name, this.exportSharedService.getToolId(itemProficiency.item.sid)));
      }
    });
    return profs;
  }

  private getSavingThrowProfs(playerCharacter: PlayerCharacter): object[] {
    const profs = [];
    const abilities = this.abilityService.getAbilitiesDetailedFromStorage();
    abilities.forEach((ability: Ability) => {
      if (this.isProficient(ability, playerCharacter.attributeProfs)) {
        profs.push(this.getProfObject(ability.name, this.exportSharedService.getAbilityId(ability.sid)));
      }
    });
    return profs;
  }

  private async getLanguageProfs(playerCharacter: PlayerCharacter): Promise<object[]> {
    const profs = [];
    const languages = await this.languageService.getLanguages();
    languages.forEach((language: ListObject) => {
      if (this.isProficient(language, playerCharacter.attributeProfs)) {
        profs.push(this.getProfObject(language.name, this.exportSharedService.getLanguageId(language.sid)));
      }
    });
    return profs;
  }

  private async getSkillProfs(playerCharacter: PlayerCharacter, proExport: boolean): Promise<object[]> {
    const profs = [];
    const skills = await this.skillService.getSkillsDetailed();
    skills.forEach((skill: Skill) => {
      const prof = this.exportAttributeService.processSkill(skill, proExport);
      const proficiency = this.getProf(skill, playerCharacter.attributeProfs);
      prof['prof'] = proficiency != null;
      prof['miscModifier'] = proficiency == null ? 0 : proficiency.miscModifier;
      profs.push(prof);
    });
    return profs;
  }

  private getProfObject(name: string, id: number): object {
    return {
      'description': '',
      'id': id,
      'name': name
    }
  }

  private getProf(attribute: ListObject, proficiencies: Proficiency[]): Proficiency {
    for (let i = 0; i < proficiencies.length; i++) {
      const prof: Proficiency = proficiencies[i];
      if (prof.attribute != null && prof.attribute.id === attribute.id && prof.proficient) {
        return prof;
      }
    }
    return null;
  }

  private isProficient(attribute: ListObject, proficiencies: Proficiency[]): boolean {
    return this.getProf(attribute, proficiencies) != null;
  }

  private getItemProf(attribute: ListObject, proficiencies: ItemProficiency[]): ItemProficiency {
    for (let i = 0; i < proficiencies.length; i++) {
      const prof: ItemProficiency = proficiencies[i];
      if (prof.item != null && prof.item.id === attribute.id && prof.proficient) {
        return prof;
      }
    }
    return null;
  }

  private isItemProficient(attribute: ListObject, proficiencies: ItemProficiency[]): boolean {
    return this.getItemProf(attribute, proficiencies) != null;
  }

  private getConditionImmunities(playerCharacter: PlayerCharacter): number[] {
    const immunities = [];
    playerCharacter.conditionImmunities.forEach((listObject: ListObject) => {
      const id = this.exportSharedService.getConditionId(listObject.sid);
      if (id !== 0) {
        immunities.push(id);
      }
    });
    return immunities;
  }

  private async getConditionsList(playerCharacter: PlayerCharacter): Promise<object[]> {
    const conditions = [];
    for (const activeCondition of playerCharacter.activeConditions) {
      const condition = await this.exportCacheService.getAttribute(activeCondition.condition.id);
      conditions.push(this.exportAttributeService.processCondition(condition as Condition));
    }
    return conditions;
  }

  private async getConditionsListFree(playerCharacter: PlayerCharacter): Promise<number[]> {
    const conditions = [];
    for (const activeCondition of playerCharacter.activeConditions) {
      const condition = await this.exportCacheService.getAttribute(activeCondition.condition.id);
      conditions.push(this.exportSharedService.getConditionId(condition.sid));
    }
    return conditions;
  }

  private getSpellSlotModifiers(playerCharacter: PlayerCharacter): number[] {
    let slots = playerCharacter.creatureSpellCasting.spellSlots.slice();
    slots = _.sortBy(slots, slot => slot.level);
    const results = [];
    slots.forEach((creatureSpellSlot: CreatureSpellSlot) => {
      results.push(creatureSpellSlot.maxModifier);
    });
    return results;
  }

  private getSpellSlotsAvailable(playerCharacter: PlayerCharacter): number[] {
    let slots = playerCharacter.creatureSpellCasting.spellSlots.slice();
    slots = _.sortBy(slots, slot => slot.level);
    const results = [];
    slots.forEach((creatureSpellSlot: CreatureSpellSlot) => {
      results.push(creatureSpellSlot.remaining);
    });
    return results;
  }

  private async getSpells(playerCharacter: PlayerCharacter, proExport: boolean): Promise<object[]> {
    const spells = [];
    let classId = '';
    let classSid = 0;
    if (playerCharacter.classes.length > 0) {
      const chosenClass = playerCharacter.classes[0];
      classId = chosenClass.characterClass.id;
      classSid = chosenClass.characterClass.sid;
    }
    for (const creatureSpell of playerCharacter.creatureSpellCasting.spells) {
      if (creatureSpell.assignedCharacteristic === classId) {
        const spell = await this.exportCacheService.getPower(creatureSpell.spell.id);
        const obj = await this.exportPowerService.processSpell(spell as Spell);
        if (proExport) {
          obj['spellTags'] = this.getCreatureSpellTags(creatureSpell, playerCharacter);
        }
        if (creatureSpell.prepared) {
          obj['preparedClassId'] = this.exportSharedService.getClassId(classSid);
        }
        spells.push(obj);
      }
    }
    return spells;
  }

  private getCreatureSpellTags(creatureSpell: CreatureSpell, playerCharacter: PlayerCharacter): number[] {
    const tags = [];
    creatureSpell.spell.tags.forEach((tag: Tag) => {
      const id = this.getTagId(tag, playerCharacter);
      if (id > 0) {
        tags.push(id);
      }
    });
    return tags;
  }

  private getTagId(tag: Tag, playerCharacter: PlayerCharacter): number {
    const index = _.findIndex(playerCharacter.creatureSpellCasting.tags, (_tag: Tag) => {
      return _tag.id === tag.id;
    });
    return index + 1;
  }

  private getSpellcasting(playerCharacter: PlayerCharacter, attack: boolean): Spellcasting {
    if (playerCharacter.classes.length > 0) {
      const chosenClass = playerCharacter.classes[0];
      return attack ? chosenClass.spellcastingAttack : chosenClass.spellcastingSave;
    }
    return null;
  }

  private getSpellcastingAdvantage(playerCharacter: PlayerCharacter, attack: boolean): object {
    const spellcasting = this.getSpellcasting(playerCharacter, attack);
    if (spellcasting == null) {
      return this.getAdvantage(null);
    } else {
      return this.getAdvantage(spellcasting.proficiency);
    }
  }

  private getSpellcastingModifier(playerCharacter: PlayerCharacter, attack: boolean): number {
    const spellcasting = this.getSpellcasting(playerCharacter, attack);
    if (spellcasting == null) {
      return 0;
    } else {
      return spellcasting.proficiency.miscModifier
    }
  }

  private getCustomSpellCastingAbilityId(playerCharacter: PlayerCharacter): number {
    if (playerCharacter.classes.length > 0) {
      const chosenClass = playerCharacter.classes[0];
      return this.getAbilityById(chosenClass.spellcastingAbility);
    }
    return -1;
  }

  private async getInnateSpells(playerCharacter: PlayerCharacter): Promise<object[]> {
    const innateSpells = [];
    for (const creatureSpell of playerCharacter.creatureSpellCasting.spells) {
      if (creatureSpell.assignedCharacteristic === '0') {
        const spell = await this.exportCacheService.getPower(creatureSpell.spell.id);
        const obj = await this.exportPowerService.processSpell(spell as Spell);
        obj['spellTags'] = this.getCreatureSpellTags(creatureSpell, playerCharacter);

        innateSpells.push({
          'type': 'InnateSpell',
          'limitedUse': {
            'limitedUse': false,
            'limitedUseType': 'NUM_PER_DAY',
            'numPerDay': 0,
            'numUsesRemaining': 0,
            'rechargeMax': 0,
            'rechargeMin': 0,
            'rechargeOnLongRest': false,
            'rechargeOnShortRest': false
          },
          'spell': obj
        });
      }
    }
    return innateSpells;
  }

  private getInnateSpellcasting(playerCharacter: PlayerCharacter, attack: boolean): Spellcasting {
    return attack ? playerCharacter.creatureSpellCasting.spellcastingAttack : playerCharacter.creatureSpellCasting.spellcastingSave;
  }

  private getInnateSpellcastingAdvantage(playerCharacter: PlayerCharacter, attack: boolean): object {
    const spellcasting = this.getInnateSpellcasting(playerCharacter, attack);
    if (spellcasting == null) {
      return this.getAdvantage(null);
    } else {
      return this.getAdvantage(spellcasting.proficiency);
    }
  }

  private getInnateSpellcastingModifier(playerCharacter: PlayerCharacter, attack: boolean): number {
    const spellcasting = this.getInnateSpellcasting(playerCharacter, attack);
    if (spellcasting == null) {
      return 0;
    } else {
      return spellcasting.proficiency.miscModifier
    }
  }

  private getInnateSpellcastingAbilityId(playerCharacter: PlayerCharacter): number {
    return this.getAbilityById(playerCharacter.creatureSpellCasting.spellcastingAbility, -1);
  }

  private getChosenTraitId(playerCharacter: PlayerCharacter, backgroundTraitType: BackgroundTraitType, index: number): number {
    // const trait = this.getChosenTrait(playerCharacter, backgroundTraitType, index);
    // if (trait == null) {
    //   return 0;
    // }
    return 0;
  }

  private getChosenTrait(playerCharacter: PlayerCharacter, backgroundTraitType: BackgroundTraitType, index: number): BackgroundTrait {
    let count = 0;
    for (const backgroundTrait of playerCharacter.characterBackground.chosenTraits) {
      if (backgroundTrait.backgroundTraitType === backgroundTraitType) {
        if (count === index) {
          return backgroundTrait;
        }
        count++;
      }
    }
    return null;
  }
}
