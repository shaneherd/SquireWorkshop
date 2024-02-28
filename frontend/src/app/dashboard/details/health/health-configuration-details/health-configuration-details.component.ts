import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {EVENTS, SID} from '../../../../constants';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {EventsService} from '../../../../core/services/events.service';
import {ListObject} from '../../../../shared/models/list-object';
import {HealthCalculationType} from '../../../../shared/models/creatures/characters/health-calculation-type.enum';
import {ChosenClass} from '../../../../shared/models/creatures/characters/chosen-class';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CharacterLevelService} from '../../../../core/services/character-level.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {HealthGainResult} from '../../../../shared/models/creatures/characters/health-gain-result';
import {ModifierService} from '../../../../core/services/modifier.service';
import {DiceSize} from '../../../../shared/models/dice-size.enum';
import {CreatureHitDice} from '../../../../shared/models/creatures/creature-hit-dice';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {CharacterHealthConfiguration} from '../../../../shared/models/creatures/characters/character-health-configuration';
import * as _ from 'lodash';
import {CreatureState} from '../../../../shared/models/creatures/creature-state.enum';
import {Proficiency} from '../../../../shared/models/proficiency';
import {CharacterSettings} from '../../../../shared/models/creatures/characters/character-settings';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {LabelValue} from '../../../../shared/models/label-value';

export class HealthConfigurationClass {
  chosenClass: ChosenClass;
  healthGainResults: HealthGainResult[] = [];
  hitDiceMod: number;
}

export class HitDiceConfiguration {
  diceSize: DiceSize;
  remaining = 0;
  max = 0;
  maxTooltip = '';
}

@Component({
  selector: 'app-health-configuration-details',
  templateUrl: './health-configuration-details.component.html',
  styleUrls: ['./health-configuration-details.component.scss']
})
export class HealthConfigurationDetailsComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  currentHP = 0;
  tempHP = 0;

  levels: ListObject[] = [];
  calculationTypes: HealthCalculationType[] = [];
  calculationType: HealthCalculationType = HealthCalculationType.ROLL;
  conModifier = 0;
  maxHp = 0;
  maxHpMod = 0;
  maxHpModifiers = 0;
  maxHpModifiersDisplay: LabelValue[] = [];
  maxHpPenaltiesDisplay: LabelValue[] = [];
  maxHpTotal = 0;
  maxHpTotalTooltip = '';
  hpGainModifier = 0;
  healthConfigurationCollection: HealthConfigurationClass[] = [];
  hitDiceConfigurationCollection: HitDiceConfiguration[] = [];
  deathSaveProficiency: Proficiency = new Proficiency();
  resurrectionPenalty = 0;
  settings = new CharacterSettings();

  constructor(
    private eventsService: EventsService,
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private characterLevelService: CharacterLevelService,
    private modifierService: ModifierService,
    private abilityService: AbilityService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.initializeMiscValues();
    this.initializeValues();
    this.initializeHitDiceConfiguration();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.HealthGainResultChange) {
        this.updateMaxHp();
      } else if (event === EVENTS.HitDiceChange) {
        this.updateMaxHitDice();
      } else if (event === EVENTS.ModifiersUpdated
        || event === EVENTS.AbilityScoreChange
        || event === EVENTS.ExhaustionLevelChanged) {
        this.initializeValues();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeMiscValues(): void {
    this.initializeLevels();
    this.initializeCalculationTypes();
    this.currentHP = this.playerCharacter.creatureHealth.currentHp;
    this.tempHP = this.playerCharacter.creatureHealth.tempHp;
    this.hpGainModifier = this.playerCharacter.hpGainModifier;
    this.maxHpMod = this.playerCharacter.creatureHealth.maxHpMod;
    this.settings = _.cloneDeep(this.playerCharacter.characterSettings);
    this.initializeDeathSaveProficiency();
  }

  private initializeValues(): void {
    this.initializeConModifier();
    this.initializeHealthConfigurationCollection();
    const miscModifier = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.MAX_HP, this.collection);
    this.maxHpModifiers = this.creatureService.getModifiers(miscModifier.modifiers, this.collection);
    this.maxHpModifiersDisplay = this.creatureService.getModifierLabels(miscModifier.modifiers, this.collection);
    const characteristics = this.characterService.getCharacteristics(this.playerCharacter);
    characteristics.forEach((characteristic: string) => {
      const modifiers = this.characterService.getMaxHpMiscModifier(characteristic, this.collection);
      this.maxHpModifiers += this.creatureService.getModifiers(modifiers, this.collection);
      this.maxHpModifiersDisplay = this.maxHpModifiersDisplay.concat(this.creatureService.getModifierLabels(modifiers, this.collection));
    });
    this.updateMaxHp();
  }

  private initializeHealthConfigurationCollection(): void {
    const healthConfigurationCollection: HealthConfigurationClass[] = [];

    this.playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      const healthConfiguration = new HealthConfigurationClass();
      healthConfiguration.chosenClass = chosenClass;
      healthConfiguration.hitDiceMod = chosenClass.numHitDiceMod;
      healthConfigurationCollection.push(healthConfiguration);

      this.levels.forEach((level: ListObject) => {
        if (this.isLevelVisible(chosenClass, level)) {
          const healthGainResult: HealthGainResult = this.getHealthGainResult(chosenClass, level);
          healthConfiguration.healthGainResults.push(healthGainResult);
        }
      });
    });

    this.healthConfigurationCollection = healthConfigurationCollection;
  }

  private isLevelVisible(chosenClass: ChosenClass, level: ListObject): boolean {
    const maxLevel = chosenClass.characterLevel;
    if (maxLevel == null) {
      return false;
    }
    if (level.id === maxLevel.id) {
      return true;
    }
    return this.isBelowMax(chosenClass, level);
  }

  private isBelowMax(chosenClass: ChosenClass, level: ListObject): boolean {
    const maxLevel = chosenClass.characterLevel;
    for (let i = 0; i < this.levels.length; i++) {
      const current = this.levels[i];
      if (current.id === maxLevel.id) {
        return false;
      }
      if (current.id === level.id) {
        return true;
      }
    }
    return false;
  }

  private getHealthGainResult(chosenClass: ChosenClass, level: ListObject): HealthGainResult {
    for (let i = 0; i < chosenClass.healthGainResults.length; i++) {
      const result = chosenClass.healthGainResults[i];
      if (result.level.id === level.id) {
        return result;
      }
    }

    const healthGainResult = new HealthGainResult(level);
    this.characterService.updateHealthGainSingleResult(healthGainResult, chosenClass, this.calculationType);
    return healthGainResult;
  }

  private initializeHitDiceConfiguration(): void {
    const hitDiceConfiguration: HitDiceConfiguration[] = [];
    const maxHitDice = this.characterService.getMaxHitDice(this.playerCharacter, this.collection, true);
    maxHitDice.forEach((creatureHitDice: CreatureHitDice) => {
      const hitDieConfiguration = new HitDiceConfiguration();
      hitDieConfiguration.diceSize = creatureHitDice.diceSize;
      hitDiceConfiguration.push(hitDieConfiguration);
    });
    hitDiceConfiguration.sort((left: HitDiceConfiguration, right: HitDiceConfiguration) => {
      return this.getDiceSizeIndex(left.diceSize) - this.getDiceSizeIndex(right.diceSize);
    });
    this.hitDiceConfigurationCollection = hitDiceConfiguration;

    this.playerCharacter.creatureHealth.creatureHitDice.forEach((creatureHitDice: CreatureHitDice) => {
      const hitDie = this.getHitDie(creatureHitDice.diceSize);
      if (hitDie != null) {
        hitDie.remaining = creatureHitDice.remaining;
      }
    });

    this.updateMaxHitDice();
  }

  private getDiceSizeIndex(diceSize: DiceSize): number {
    let index = 0;
    for (const currentDiceSize of Object.keys(DiceSize)) {
      if (DiceSize.hasOwnProperty(currentDiceSize)) {
        if (currentDiceSize === diceSize) {
          return index;
        }
      }

      index++;
    }
    return -1;
  }

  private updateMaxHitDice(): void {
    this.hitDiceConfigurationCollection.forEach((hitDiceConfiguration: HitDiceConfiguration) => {
      const healthConfigurations: HealthConfigurationClass[] = this.getHealthConfigurations(hitDiceConfiguration.diceSize);
      hitDiceConfiguration.max = 0;

      const tooltipParts: string[] = [];
      healthConfigurations.forEach((healthConfigurationClass: HealthConfigurationClass) => {
        const max = this.getMaxHitDice(healthConfigurationClass);
        hitDiceConfiguration.max += max;
        tooltipParts.push(healthConfigurationClass.chosenClass.characterClass.name + ': ' + max);
      });
      hitDiceConfiguration.maxTooltip = tooltipParts.join('\n');

      if (hitDiceConfiguration.remaining > hitDiceConfiguration.max) {
        hitDiceConfiguration.remaining = hitDiceConfiguration.max;
      }
    });
  }

  private getHealthConfigurations(diceSize: DiceSize): HealthConfigurationClass[] {
    const healthConfigurations: HealthConfigurationClass[] = [];
    this.healthConfigurationCollection.forEach((healthConfigurationClass: HealthConfigurationClass) => {
      if (healthConfigurationClass.chosenClass.characterClass.hitDice.diceSize === diceSize) {
        healthConfigurations.push(healthConfigurationClass);
      }
    });
    return healthConfigurations;
  }

  private getMaxHitDice(healthConfigurationClass: HealthConfigurationClass): number {
    const classHitDice = healthConfigurationClass.chosenClass.characterClass.hitDice;
    const level = parseInt(healthConfigurationClass.chosenClass.characterLevel.name, 10);
    const hitDicePerLevel = classHitDice.numDice + classHitDice.miscModifier;
    let max = hitDicePerLevel * level;

    const modifiers = this.characterService.getHitDiceMiscModifier(healthConfigurationClass.chosenClass.characterClass.id, this.collection);
    const modifiersValue = this.creatureService.getModifiers(modifiers, this.collection);
    max += modifiersValue;

    max += healthConfigurationClass.hitDiceMod;

    return max;
  }

  private getHitDie(diceSize: DiceSize): HitDiceConfiguration {
    for (let i = 0; i < this.hitDiceConfigurationCollection.length; i++) {
      const hitDie = this.hitDiceConfigurationCollection[i];
      if (hitDie.diceSize === diceSize) {
        return hitDie;
      }
    }
    return null;
  }

  private initializeDeathSaveProficiency(): void {
    this.deathSaveProficiency = new Proficiency();
    this.deathSaveProficiency.miscModifier = this.playerCharacter.creatureHealth.deathSaveMod;
    this.deathSaveProficiency.advantage = this.playerCharacter.creatureHealth.deathSaveAdvantage;
    this.deathSaveProficiency.disadvantage = this.playerCharacter.creatureHealth.deathSaveDisadvantage;
    this.resurrectionPenalty = this.playerCharacter.creatureHealth.resurrectionPenalty;
  }

  deathSaveModifierChange(input): void {
    this.deathSaveProficiency.miscModifier = parseInt(input.value, 10);
  }

  resurrectionPenaltyChange(input): void {
    this.resurrectionPenalty = parseInt(input.value, 10);
  }

  private initializeLevels(): void {
    this.levels = this.characterLevelService.getLevelsDetailedFromStorage();
  }

  private initializeCalculationTypes(): void {
    this.calculationTypes = [];
    this.calculationTypes.push(HealthCalculationType.ROLL);
    this.calculationTypes.push(HealthCalculationType.MAX);
    this.calculationTypes.push(HealthCalculationType.AVERAGE);
    this.initializeSelectedCalculationType();
  }

  private initializeSelectedCalculationType(): void {
    this.calculationType = this.playerCharacter.healthCalculationType;
  }

  calculationTypeChange(calculationType: HealthCalculationType): void {
    this.playerCharacter.healthCalculationType = calculationType;
    this.calculationType = calculationType;
    this.updateHealthGainResults();
    setTimeout(() => {
      this.eventsService.dispatchEvent(EVENTS.HealthCalculationTypeChange);
      this.updateMaxHp();
    });
  }

  private updateHealthGainResults(): void {
    this.playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      this.characterService.updateHealthGainResults(chosenClass, this.calculationType);
    });
  }

  private initializeConModifier(): void {
    const con = this.creatureService.getAbilityBySid(SID.ABILITIES.CONSTITUTION, this.collection);
    this.conModifier = this.creatureService.getAbilityModifier(con, this.collection);
  }

  hpGainModifierChange(input): void {
    this.hpGainModifier = parseInt(input.value, 10);
    setTimeout(() => {
      this.eventsService.dispatchEvent(EVENTS.HpModifierGainChange);
      this.updateMaxHp();
    });
  }

  private updateMaxHp(): void {
    let max = 0;
    this.healthConfigurationCollection.forEach((config: HealthConfigurationClass) => {
      const maxLevel = config.chosenClass.characterLevel;
      if (maxLevel != null) {
        for (let i = 0; i < config.healthGainResults.length; i++) {
          const result = config.healthGainResults[i];
          if (config.chosenClass.primary && i === 0) {
            if (config.chosenClass.characterClass != null) {
              max += config.chosenClass.characterClass.hpAtFirst.numDice;
            }
          } else {
            max += result.value;
          }
          max += this.hpGainModifier + this.conModifier;
          if (result.level.id === maxLevel.id) {
            break;
          }
        }
      }
    });

    this.maxHp = max;

    this.updateMaxHpTotal();
    this.updateCurrentHP();
  }

  maxHpModifierChange(input): void {
    this.maxHpMod = parseInt(input.value, 10);
    this.updateMaxHpTotal();
    this.updateCurrentHP();
  }

  private updateMaxHpTotal(): void {
    this.maxHpTotal = this.maxHp + this.maxHpMod + this.maxHpModifiers;
    this.maxHpPenaltiesDisplay = [];
    if (this.playerCharacter.creatureHealth.exhaustionLevel >= 4) {
      this.maxHpTotal = Math.floor(this.maxHpTotal / 2);
      this.maxHpPenaltiesDisplay.push(new LabelValue('', 'Halved (Exhaustion - 4)')); //todo - translate
    }

    if (this.maxHpTotal < 0) {
      this.maxHpTotal = 0;
    }
    this.maxHpTotalTooltip = this.getMaxHpTooltip();
  }

  private getMaxHpTooltip(): string {
    let parts = [];
    parts.push(this.translate.instant('Labels.Max') + ' '  + this.maxHp);

    const miscModifier = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.MAX_HP, this.collection);
    const modifierTooltips: string[] = this.creatureService.getModifierTooltips(miscModifier.modifiers, this.collection);
    parts = parts.concat(modifierTooltips);

    if (this.maxHpMod !== 0) {
      parts.push(this.translate.instant('Labels.Misc') + ' '  + this.abilityService.convertScoreToString(this.maxHpMod));
    }

    if (this.playerCharacter.creatureHealth.exhaustionLevel >= 4) {
      parts.push(this.translate.instant('ExhaustionCondition', {
        condition: this.translate.instant('Halved'),
        level: 4
      }));
    }
    return parts.join('\n');
  }

  private updateCurrentHP(): void {
    if (this.currentHP > (this.maxHp + this.maxHpMod + this.maxHpModifiers)) {
      this.currentHP = this.maxHp + this.maxHpMod + this.maxHpModifiers;
    }
    if (this.currentHP < 0) {
      this.currentHP = 0;
    }
  }

  closeDetails(): void {
    this.close.emit();
  }

  resetClick(): void {
    this.currentHP = this.maxHpTotal;
    this.tempHP = 0;
    this.hitDiceConfigurationCollection.forEach((hitDiceConfiguration: HitDiceConfiguration) => {
      hitDiceConfiguration.remaining = hitDiceConfiguration.max;
    });
    this.maxHpMod = 0;

    this.saveDetails();
  }

  saveDetails(): void {
    const creatureHealth = _.cloneDeep(this.playerCharacter.creatureHealth);
    creatureHealth.currentHp = this.currentHP;
    creatureHealth.tempHp = this.tempHP;
    creatureHealth.maxHpMod = this.maxHpMod;
    creatureHealth.creatureHitDice = this.getUpdatedCreatureHitDice();

    if (this.currentHP > 0 && creatureHealth.creatureState !== CreatureState.CONSCIOUS) {
      creatureHealth.creatureState = CreatureState.CONSCIOUS;
    } else if (this.currentHP === 0 && creatureHealth.creatureState === CreatureState.CONSCIOUS) {
      creatureHealth.creatureState = CreatureState.UNSTABLE;
    }

    creatureHealth.deathSaveMod = this.deathSaveProficiency.miscModifier;
    creatureHealth.deathSaveAdvantage = this.deathSaveProficiency.advantage;
    creatureHealth.deathSaveDisadvantage = this.deathSaveProficiency.disadvantage;
    creatureHealth.resurrectionPenalty = this.resurrectionPenalty;

    const characterHealthConfiguration = new CharacterHealthConfiguration();
    characterHealthConfiguration.creatureHealth = creatureHealth;
    characterHealthConfiguration.hpGainModifier = this.hpGainModifier;
    characterHealthConfiguration.healthCalculationType = this.calculationType;
    characterHealthConfiguration.classes = this.getUpdatedChosenClasses();

    const promises = [];

    promises.push(this.characterService.updateCreatureHealthConfiguration(this.playerCharacter, characterHealthConfiguration).then(() => {
      this.playerCharacter.creatureHealth = creatureHealth;
      this.playerCharacter.hpGainModifier = characterHealthConfiguration.hpGainModifier;
      this.playerCharacter.healthCalculationType = characterHealthConfiguration.healthCalculationType;
      this.playerCharacter.classes = characterHealthConfiguration.classes;
    }));

    const settings = _.cloneDeep(this.playerCharacter.characterSettings);
    settings.health = this.settings.health;
    promises.push(this.characterService.updateCharacterSettings(this.playerCharacter, settings).then(() => {
      this.playerCharacter.characterSettings.health = settings.health;
    }));

    const self = this;
    Promise.all(promises).then(function () {
      self.eventsService.dispatchEvent(EVENTS.HpUpdated);
      self.save.emit();
    });

  }

  private getUpdatedCreatureHitDice(): CreatureHitDice[] {
    const creatureHitDice: CreatureHitDice[] = [];
    this.hitDiceConfigurationCollection.forEach((hitDiceConfiguration: HitDiceConfiguration) => {
      const hitDie = new CreatureHitDice();
      hitDie.diceSize = hitDiceConfiguration.diceSize;
      hitDie.remaining = hitDiceConfiguration.remaining;
      creatureHitDice.push(hitDie);
    });
    return creatureHitDice;
  }

  private getUpdatedChosenClasses(): ChosenClass[] {
    const chosenClasses = _.cloneDeep(this.playerCharacter.classes);
    this.healthConfigurationCollection.forEach((healthConfigurationClass: HealthConfigurationClass) => {
      const chosenClass = this.getChosenClass(healthConfigurationClass, chosenClasses);
      if (chosenClass != null) {
        chosenClass.healthGainResults = healthConfigurationClass.healthGainResults;
        chosenClass.numHitDiceMod = healthConfigurationClass.hitDiceMod;
      }
    });
    return chosenClasses;
  }

  private getChosenClass(healthConfigurationClass: HealthConfigurationClass, classes: ChosenClass[]): ChosenClass {
    for (let i = 0; i < classes.length; i++) {
      const chosenClass = classes[i];
      if (chosenClass.id === healthConfigurationClass.chosenClass.id) {
        return chosenClass;
      }
    }
    return null;
  }
}
