import {Injectable} from '@angular/core';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';
import {CharacteristicType} from '../../../shared/models/characteristics/characteristic-type.enum';
import {CharacterClass} from '../../../shared/models/characteristics/character-class';
import {Race} from '../../../shared/models/characteristics/race';
import {Background} from '../../../shared/models/characteristics/background';
import {ExportDetailsService} from './export.service';
import {BackgroundTrait} from '../../../shared/models/characteristics/background-trait';
import {BackgroundTraitType} from '../../../shared/models/characteristics/background-trait-type.enum';
import {Proficiency} from '../../../shared/models/proficiency';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {Skill} from '../../../shared/models/attributes/skill';
import {ExportSharedService} from './export-shared.service';
import {ExportAttributeService} from './export-attribute.service';
import {SpeedType} from '../../../shared/models/speed-type.enum';
import {Modifier} from '../../../shared/models/modifier';
import {SID} from '../../../constants';
import {CharacterLevelService} from '../character-level.service';
import * as _ from 'lodash';
import {CharacterLevel} from '../../../shared/models/character-level';
import {SpellConfiguration} from '../../../shared/models/characteristics/spell-configuration';
import {AbilityService} from '../attributes/ability.service';
import {ExportCacheService} from './export-cache.service';

@Injectable({
  providedIn: 'root'
})
export class ExportCharacteristicService implements ExportDetailsService {

  constructor(
    private exportCacheService: ExportCacheService,
    private exportSharedService: ExportSharedService,
    private exportAttributeService: ExportAttributeService,
    private characterLevelService: CharacterLevelService,
    private abilityService: AbilityService
  ) { }

  export(id: string, proExport: boolean): Promise<object> {
    return this.exportCacheService.getCharacteristic(id).then((characteristic: Characteristic) => {
      return this.processCharacteristic(characteristic, proExport);
    });
  }

  processObject(object: Object, proExport: boolean): Promise<object> {
    return this.processCharacteristic(object as Characteristic, proExport);
  }

  async processCharacteristic(characteristic: Characteristic, proExport: boolean): Promise<object> {
    switch (characteristic.characteristicType) {
      case CharacteristicType.CLASS:
        const characterClass = characteristic as CharacterClass;
        return await this.processCharacterClass(characterClass, proExport);
      case CharacteristicType.RACE:
        const race = characteristic as Race;
        return await this.processRace(race, proExport);
      case CharacteristicType.BACKGROUND:
        const background = characteristic as Background;
        return await this.processBackground(background, proExport);
    }
    return null;
  }

  async processCharacterClass(characterClass: CharacterClass, proExport: boolean): Promise<object> {
    const object = {
      'type': 'CharacterClass',
      'abilityScoreIncreases': this.getAbilityScoreIncreases(characterClass),
      'armorProfs': this.processArmorProfs(characterClass.armorProfs),
      'armorSecondaryProfs': this.processArmorProfs(characterClass.armorSecondaryProfs),
      'armorTypeProfs': this.processArmorTypeProfs(characterClass.armorTypeProfs),
      'armorTypeSecondaryProfs': this.processArmorTypeProfs(characterClass.armorTypeSecondaryProfs),
      'casterType': this.exportAttributeService.processCasterType(characterClass.casterType),
      'classSkills': await this.processSkills(characterClass.skillChoiceProfs, proExport),
      'classSpells': this.processClassSpells(characterClass),
      'hitDice': characterClass.hitDice.numDice,
      'hitDiceSize': this.exportSharedService.getDiceSize(characterClass.hitDice.diceSize),
      'hpAtFirst': characterClass.hpAtFirst.numDice,
      'hpAtFirstModifierId': this.exportSharedService.getAbilityId(characterClass.hpAtFirst.abilityModifier.sid),
      'hpGainDice': characterClass.hpGain.numDice,
      'hpGainDiceSize': this.exportSharedService.getDiceSize(characterClass.hpGain.diceSize),
      'hpGainModifierId': this.exportSharedService.getAbilityId(characterClass.hpGain.abilityModifier.sid),
      'id': this.exportSharedService.getClassId(characterClass.sid),
      'languageProfs': this.processLanguageProfs(characterClass.languageProfs),
      'languageSecondaryProfs': this.processLanguageProfs(characterClass.languageSecondaryProfs),
      'name': characterClass.name,
      'numSkills': characterClass.numSkills,
      'numTools': characterClass.numTools,
      'requiresSpellPreparation': characterClass.classSpellPreparation.requirePreparation,
      'savingThrowProfs': this.processAbilityProfs(characterClass.savingThrowProfs),
      'savingThrowSecondaryProfs': this.processAbilityProfs(characterClass.savingThrowSecondaryProfs),
      'skillProfs': this.processSkillProfs(characterClass.skillProfs),
      'skillSecondaryProfs': this.processSkillProfs(characterClass.skillSecondaryProfs),
      'spellCastingAbilityId': characterClass.spellCastingAbility === '0' ? -1 : this.exportSharedService.getAbilityId(this.abilityService.getAbilityById(characterClass.spellCastingAbility).sid),
      'subclasses': this.processSubclasses(characterClass, proExport),
      'toolCategoriesToChooseFrom': this.processToolCategoryProfs(characterClass.toolCategoryChoiceProfs),
      'toolProfs': this.processToolProfs(characterClass.toolProfs),
      'toolSecondaryProfs': this.processToolProfs(characterClass.toolSecondaryProfs),
      'weaponProfs': this.processWeaponProfs(characterClass.weaponProfs),
      'weaponSecondaryProfs': this.processWeaponProfs(characterClass.weaponSecondaryProfs),
      'weaponTypeProfs': this.processWeaponTypeProfs(characterClass.weaponTypeProfs),
      'weaponTypeSecondaryProfs': this.processWeaponTypeProfs(characterClass.weaponTypeSecondaryProfs)
    };
    if (proExport) {
      object['skills'] = await this.processSkills(characterClass.skillProfs, proExport);
      object['secondarySkills'] = await this.processSkills(characterClass.skillSecondaryProfs, proExport);
      object['goldDiceSize'] = this.exportSharedService.getDiceSize(characterClass.startingGold.diceSize);
      object['numGoldDice'] = characterClass.startingGold.numDice;
      object['numGoldMod'] = characterClass.startingGold.miscModifier;
      object['prepareAbilityId'] = characterClass.classSpellPreparation.numToPrepareAbilityModifier == null ? 0 : this.exportSharedService.getAbilityId(characterClass.classSpellPreparation.numToPrepareAbilityModifier.sid);
      object['prepareClassLevel'] = characterClass.classSpellPreparation.numToPrepareIncludeLevel;
      object['prepareMod'] = characterClass.classSpellPreparation.numToPrepareMiscModifier;
    }
    return object;
  }

  private processClassSpells(characterClass: CharacterClass): object[] {
    const spells = [];
    characterClass.spellConfigurations.forEach((spellConfiguration: SpellConfiguration) => {
      spells.push({
        'description' : '',
        'id': 0,
        'name': spellConfiguration.spell.name
      });
    });
    return spells;
  }

  private processSubclasses(characterClass: CharacterClass, proExport: boolean): object[] {
    const subclasses = [];
    characterClass.subclasses.forEach((subclass: CharacterClass) => {
      const obj = this.processSubclass(subclass, proExport);
      subclasses.push(obj);
    });
    return subclasses;
  }

  processSubclass(subclass: CharacterClass, proExport: boolean): object {
    const obj = {
      'type': 'Subclass',
      'casterType': this.exportAttributeService.processCasterType(subclass.casterType),
      'description': subclass.description,
      'id': 0,
      'name': subclass.name
    };
    if (proExport) {
      obj['configurations'] = this.processSubclassSpellConfigurations(subclass);
    }
    return obj;
  }

  private processSubclassSpellConfigurations(subclass: CharacterClass): object[] {
    const configurations = [];
    subclass.spellConfigurations.forEach((spellConfiguration: SpellConfiguration) => {
      configurations.push({
        'alwaysPrepared': spellConfiguration.alwaysPrepared,
        'countTowardsPrepared': spellConfiguration.countTowardsPrepared,
        'id': 0,
        'levelGained': parseInt(spellConfiguration.levelGained.name, 10),
        'notes': '0',
        'spell': {
          'description': '',
          'id': this.exportSharedService.getSpellId(spellConfiguration.spell.sid),
          'name': spellConfiguration.spell.name
        }
      })
    })
    return configurations;
  }

  private getAbilityScoreIncreases(characterClass: CharacterClass): number[] {
    const increases = [];
    const levels = this.characterLevelService.getLevelsDetailedFromStorage();
    characterClass.abilityScoreIncreases.forEach((levelId: string) => {
      const match = _.find(levels, (_level: CharacterLevel) => {
        return _level.id === levelId;
      });
      if (match != null) {
        increases.push(parseInt(match.name, 10))
      }
    });
    return increases;
  }

  async processRace(race: Race, proExport: boolean): Promise<object> {
    const object = {
      'type': 'Race',
      'armorProfs': this.processArmorProfs(race.armorProfs),
      'armorTypeProfs': this.processArmorTypeProfs(race.armorTypeProfs),
      'burrowSpeed': this.getSpeed(race, SpeedType.BURROW),
      'chaMod': this.getAbilityModifier(race, SID.ABILITIES.CHARISMA),
      'climbingSpeed': this.getSpeed(race, SpeedType.CLIMB),
      'conMod': this.getAbilityModifier(race, SID.ABILITIES.CONSTITUTION),
      'crawlingSpeed': this.getSpeed(race, SpeedType.CRAWL),
      'dexMod': this.getAbilityModifier(race, SID.ABILITIES.DEXTERITY),
      'flyingSpeed': this.getSpeed(race, SpeedType.FLY),
      'intMod': this.getAbilityModifier(race, SID.ABILITIES.INTELLIGENCE),
      'languageProfs': this.processLanguageProfs(race.languageProfs),
      'name': race.name,
      'numAbilities': race.numAbilities,
      'numLanguages': race.numLanguages,
      'parentRace': await this.processParentRace(race, proExport),
      'savingThrowProfs': this.processAbilityProfs(race.savingThrowProfs),
      'size': this.exportSharedService.getSize(race.size),
      'skillProfs': this.processSkillProfs(race.skillProfs),
      'speed': this.getSpeed(race, SpeedType.WALK),
      'strMod': this.getAbilityModifier(race, SID.ABILITIES.STRENGTH),
      'swimmingSpeed': this.getSpeed(race, SpeedType.SWIM),
      'toolProfs': this.processToolProfs(race.toolProfs),
      'weaponProfs': this.processWeaponProfs(race.weaponProfs),
      'weaponTypeProfs': this.processWeaponTypeProfs(race.weaponTypeProfs),
      'wisMod': this.getAbilityModifier(race, SID.ABILITIES.WISDOM)
    };
    if (proExport) {
      object['skills'] = await this.processSkills(race.skillProfs, proExport);
    }
    return object;
  }

  private async processParentRace(race: Race, proExport: boolean): Promise<object> {
    if (race.parent == null) {
      return null;
    }
    const parent = race.parent as Race;
    return await this.processRace(parent, proExport);
  }

  private getAbilityModifier(race: Race, abilitySid: number): number {
    for (let i = 0; i < race.abilityModifiers.length; i++) {
      const modifier: Modifier = race.abilityModifiers[i];
      if (modifier.attribute.sid === abilitySid) {
        return modifier.value;
      }
    }
    return 0;
  }

  private getSpeed(race: Race, speedType: SpeedType): number {
    for (let i = 0; i < race.speeds.length; i++) {
      const raceSpeed = race.speeds[i];
      if (raceSpeed.speedType === speedType) {
        return raceSpeed.value;
      }
    }
    return 0;
  }

  async processBackground(background: Background, proExport: boolean): Promise<object> {
    const object = {
      'type': 'Background',
      'armorProfs': this.processArmorProfs(background.armorProfs),
      'armorTypeProfs': this.processArmorTypeProfs(background.armorTypeProfs),
      'bonds': this.processBackgroundTraits(background.bonds, BackgroundTraitType.BOND),
      'description': background.description,
      'flaws': this.processBackgroundTraits(background.flaws, BackgroundTraitType.FLAW),
      'ideals': this.processBackgroundTraits(background.ideals, BackgroundTraitType.IDEAL),
      'languageProfs': this.processLanguageProfs(background.languageProfs),
      'name': background.name,
      'numLanguages': background.numLanguages,
      'numTools': background.numTools,
      'parentBackground': await this.processParentBackground(background, proExport),
      'personalities': this.processBackgroundTraits(background.personalities, BackgroundTraitType.PERSONALITY),
      'savingThrowProfs': this.processAbilityProfs(background.savingThrowProfs),
      'skillProfs': this.processSkillProfs(background.skillProfs),
      'toolCategoriesToChooseFrom': this.processToolCategoryProfs(background.toolCategoryChoiceProfs),
      'toolProfs': this.processToolProfs(background.toolProfs),
      'variations': this.processBackgroundTraits(background.variations, BackgroundTraitType.VARIATION),
      'weaponProfs': this.processWeaponProfs(background.weaponProfs),
      'weaponTypeProfs': this.processWeaponTypeProfs(background.weaponTypeProfs)
    };
    if (proExport) {
      object['skills'] = await this.processSkills(background.skillProfs, proExport);
    }
    return object;
  }

  private processArmorTypeProfs(proficiencies: Proficiency[]): object[] {
    const profs = [];
    proficiencies.forEach((prof: Proficiency) => {
      profs.push({
        'description': '',
        'id': this.exportSharedService.getArmorTypeId(prof.attribute.sid),
        'name': prof.attribute.name
      })
    });
    return profs;
  }

  private processArmorProfs(proficiencies: Proficiency[]): object[] {
    const profs = [];
    proficiencies.forEach((prof: Proficiency) => {
      profs.push({
        'description': '',
        'id': this.exportSharedService.getArmorId(prof.attribute.sid),
        'name': prof.attribute.name
      })
    });
    return profs;
  }

  private processWeaponTypeProfs(proficiencies: Proficiency[]): object[] {
    const profs = [];
    proficiencies.forEach((prof: Proficiency) => {
      profs.push({
        'description': '',
        'id': this.exportSharedService.getWeaponTypeId(prof.attribute.sid),
        'name': prof.attribute.name
      })
    });
    return profs;
  }

  private processWeaponProfs(proficiencies: Proficiency[]): object[] {
    const profs = [];
    proficiencies.forEach((prof: Proficiency) => {
      profs.push({
        'description': '',
        'id': this.exportSharedService.getWeaponId(prof.attribute.sid),
        'name': prof.attribute.name
      })
    });
    return profs;
  }

  private processToolCategoryProfs(proficiencies: Proficiency[]): object[] {
    const profs = [];
    proficiencies.forEach((prof: Proficiency) => {
      profs.push({
        'description': '',
        'id': this.exportSharedService.getToolCategoryId(prof.attribute.sid),
        'name': prof.attribute.name
      })
    });
    return profs;
  }

  private processToolProfs(proficiencies: Proficiency[]): object[] {
    const profs = [];
    proficiencies.forEach((prof: Proficiency) => {
      profs.push({
        'description': '',
        'id': this.exportSharedService.getToolId(prof.attribute.sid),
        'name': prof.attribute.name
      })
    });
    return profs;
  }

  private processAbilityProfs(proficiencies: Proficiency[]): object[] {
    const profs = [];
    proficiencies.forEach((prof: Proficiency) => {
      profs.push({
        'description': '',
        'id': this.exportSharedService.getAbilityId(prof.attribute.sid),
        'name': prof.attribute.name
      })
    });
    return profs;
  }

  private processLanguageProfs(proficiencies: Proficiency[]): object[] {
    const profs = [];
    proficiencies.forEach((prof: Proficiency) => {
      profs.push({
        'description': '',
        'id': this.exportSharedService.getLanguageId(prof.attribute.sid),
        'name': prof.attribute.name
      })
    });
    return profs;
  }

  private processSkillProfs(proficiencies: Proficiency[]): object[] {
    const profs = [];
    proficiencies.forEach((prof: Proficiency) => {
      profs.push({
        'description': '',
        'id': this.exportSharedService.getSkillId(prof.attribute.sid),
        'name': prof.attribute.name
      })
    });
    return profs;
  }

  private async processSkills(proficiencies: Proficiency[], proExport: boolean): Promise<object[]> {
    const skills = [];
    for (const prof of proficiencies) {
      const attribute: Attribute = await this.exportCacheService.getAttribute(prof.attribute.id);
      const skill = attribute as Skill;
      skills.push(this.exportAttributeService.processSkill(skill, proExport));
    }
    return skills;
  }

  private processBackgroundTraits(backgroundTraits: BackgroundTrait[], backgroundTraitType: BackgroundTraitType): object[] {
    const traits = [];
    if (backgroundTraits != null) {
      backgroundTraits.forEach((trait: BackgroundTrait) => {
        traits.push({
          'type': 'BackgroundDetail',
          'backgroundDetailType': this.getBackgroundDetailType(trait.backgroundTraitType),
          'description': trait.description,
          'id': 0
        });
      });
    }
    if (traits.length === 0) {
      traits.push({
        'type': 'BackgroundDetail',
        'backgroundDetailType': backgroundTraitType,
        'description': 'placeholder',
        'id': 0
      });
    }
    if (traits.length === 1 && backgroundTraitType === BackgroundTraitType.PERSONALITY) {
      traits.push({
        'type': 'BackgroundDetail',
        'backgroundDetailType': backgroundTraitType,
        'description': 'placeholder 2',
        'id': 0
      });
    }
    return traits;
  }

  private getBackgroundDetailType(type: BackgroundTraitType): string {
    switch (type) {
      case BackgroundTraitType.VARIATION:
        return 'VARIATION';
      case BackgroundTraitType.PERSONALITY:
        return 'PERSONALITY';
      case BackgroundTraitType.IDEAL:
        return 'IDEAL';
      case BackgroundTraitType.BOND:
        return 'BOND';
      case BackgroundTraitType.FLAW:
        return 'FLAW';
    }
    return 'VARIATION';
  }

  private async processParentBackground(background: Background, proExport: boolean): Promise<object> {
    if (background.parent == null) {
      return null;
    }
    const parent = background.parent as Background;
    return await this.processBackground(parent, proExport);
  }
}
