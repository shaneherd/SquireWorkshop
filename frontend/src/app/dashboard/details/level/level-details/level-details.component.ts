import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CharacterLevel} from '../../../../shared/models/character-level';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CharacterLevelService} from '../../../../core/services/character-level.service';
import {MatSliderChange} from '@angular/material/slider';
import {TranslateService} from '@ngx-translate/core';
import {ChosenClass} from '../../../../shared/models/creatures/characters/chosen-class';
import {HealthGainResult} from '../../../../shared/models/creatures/characters/health-gain-result';
import {DiceSize} from '../../../../shared/models/dice-size.enum';
import {DiceService} from '../../../../core/services/dice.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {EVENTS, SID} from '../../../../constants';
import {HealthCalculationType} from '../../../../shared/models/creatures/characters/health-calculation-type.enum';
import {DetailsValidator} from '../../details/details-validator';
import {NotificationService} from '../../../../core/services/notification.service';
import {ListObject} from '../../../../shared/models/list-object';
import {CharacterClass} from '../../../../shared/models/characteristics/character-class';
import {CharacterClassService} from '../../../../core/services/characteristics/character-class.service';
import * as _ from 'lodash';
import {EventsService} from '../../../../core/services/events.service';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {CharacteristicService} from '../../../../core/services/characteristics/characteristic.service';
import {Subscription} from 'rxjs';

export class ClassOption {
  option: ListObject;
  subclasses: ListObject[];
  disabled = false;
}

export class HealthGainResultConfig {
  healthGainResult: HealthGainResult;
  visible = false;
}

export class ClassLevelAdjustment {
  id: number;
  chosenClass: ChosenClass;
  classDisplayName = '';
  subclasses: ListObject[] = [];
  subclass: ListObject;
  classOptions: ClassOption[] = [];
  selectedClassOption: ClassOption;
  selectedCharacterClass: CharacterClass;
  selectedSubclass: CharacterClass;
  originalLevel = 0;
  adjustmentAmount = 0;
  increaseDisabled = true;
  decreaseDisabled = true;
  healthGainResults: HealthGainResultConfig[] = [];
  numHitDicePerLevel = 0;
  hitDiceSize = DiceSize.ONE;
  hpPerLevelModifier = 0;
  hpPerLevelModifierTooltip = '';
  removed = false;
}

@Component({
  selector: 'app-level-details',
  templateUrl: './level-details.component.html',
  styleUrls: ['./level-details.component.scss']
})
export class LevelDetailsComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Input() disabled = false;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  originalExp = 0;
  exp = 0;
  min = 0;
  max = 0;
  adjustment = 0;

  leftLevel: CharacterLevel = null;
  rightLevel: CharacterLevel = null;
  leftLabel = '';
  rightLabel = '';
  leftExp = 0;
  rightExp = 0;
  decreaseLevelDisabled = false;
  increaseLevelDisabled = false;
  decreaseExpDisabled = false;
  increaseExpDisabled = false;

  levels: CharacterLevel[] = [];
  levelsList: ListObject[] = [];
  originalLevel = 0;
  selectedLevel: CharacterLevel = null;
  levelsAdjusted = 0;
  levelsAssigned = 0;
  classes: ClassLevelAdjustment[] = [];
  nextConfigId = 1;
  defaultClassOptions: ClassOption[] = [];
  singleClass = true;

  conModifier = 0;
  healthCalculationType = HealthCalculationType.ROLL;
  disableHealthInput = false;
  resetHealth = false;

  saveValidator: DetailsValidator;

  constructor(
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private characterLevelService: CharacterLevelService,
    private characterClassService: CharacterClassService,
    private characteristicService: CharacteristicService,
    private translate: TranslateService,
    private diceService: DiceService,
    private notificationService: NotificationService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ModifiersUpdated
        || event === EVENTS.AbilityScoreChange
        || event === EVENTS.HpUpdated) {
        this.updateValues();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeConModifier(): void {
    const con = this.creatureService.getAbilityBySid(SID.ABILITIES.CONSTITUTION, this.collection);
    this.conModifier = this.creatureService.getAbilityModifier(con, this.collection);
  }

  private initializeValues(): void {
    this.initializeConModifier();
    this.healthCalculationType = this.playerCharacter.healthCalculationType;
    this.disableHealthInput = this.healthCalculationType !== HealthCalculationType.ROLL;

    this.exp = this.playerCharacter.exp;
    this.originalExp = this.exp;
    this.levels = this.characterLevelService.getLevelsDetailedFromStorage();
    this.levelsList = this.getLevelsList();
    this.updateSelectedLevel();
    this.originalLevel = parseInt(this.selectedLevel.name, 10);
    this.updateLevelsAdjusted();
    this.initializeLevels();
    this.initializeClasses();

    this.saveValidator = new DetailsValidator();
    const self = this;
    this.saveValidator.validate = () => {
      let valid = true;
      let message = '';
      if (self.levelsAssigned !== self.levelsAdjusted) {
        valid = false;
        message = self.translate.instant('Error.LevelsNotAssigned');
      }
      if (valid && this.healthCalculationType === HealthCalculationType.ROLL) {
        self.classes.forEach((classLevelAdjustment: ClassLevelAdjustment) => {
          if (!classLevelAdjustment.removed) {
            classLevelAdjustment.healthGainResults.forEach((config: HealthGainResultConfig) => {
              if (config.visible && config.healthGainResult.value === 0) {
                valid = false;
                message = self.translate.instant('Error.HealthValuesNotAssigned');
              }
            });
          }
        });
      }

      if (!valid && message !== '') {
        self.notificationService.error(message);
      }
      return valid;
    }
  }

  private updateValues(): void {
    this.initializeConModifier();
    this.healthCalculationType = this.playerCharacter.healthCalculationType;
    this.disableHealthInput = this.healthCalculationType !== HealthCalculationType.ROLL;
    this.classes.forEach((classLevelAdjustment: ClassLevelAdjustment) => {
      classLevelAdjustment.hpPerLevelModifier = this.conModifier + this.playerCharacter.hpGainModifier;
      classLevelAdjustment.hpPerLevelModifierTooltip = this.getHpPerLevelModifierTooltip();
      this.updateHealthGainResults(classLevelAdjustment, this.healthCalculationType);
    });
  }

  private getLevelsList(): ListObject[] {
    const list: ListObject[] = [];
    this.levels.forEach((characterLevel: CharacterLevel) => {
      const level = new ListObject(characterLevel.id, characterLevel.name, characterLevel.sid);
      list.push(level);
    });
    return list;
  }

  closeDetails(): void {
    this.close.emit();
  }

  saveDetails(): void {
    const promises = [];

    let refreshCharacter = false;
    promises.push(this.characterService.updateExp(this.playerCharacter, this.exp).then(() => {
      this.playerCharacter.exp = this.exp;
    }));

    if (this.levelsAdjusted !== 0) {
      const updatedClasses: ChosenClass[] = this.getUpdatedClasses();
      this.playerCharacter.classes = updatedClasses;
      promises.push(this.characterService.updateChosenClasses(this.playerCharacter, updatedClasses))
      refreshCharacter = true;

      if (this.resetHealth) {
        promises.push(this.characterService.postResetCreatureHealth(this.playerCharacter, this.collection));
        promises.push(this.creatureService.resetSpellSlots(this.playerCharacter, this.collection));
      } else {
        const valid = this.characterService.validateHp(this.playerCharacter, this.collection);
        if (!valid) {
          promises.push(this.creatureService.updateCreatureHealth(this.playerCharacter, this.playerCharacter.creatureHealth));
        }
      }
    }

    Promise.all(promises).then(() => {
      this.save.emit();
      if (refreshCharacter) {
        this.eventsService.dispatchEvent(EVENTS.RefreshCharacter);
        this.eventsService.dispatchEvent(EVENTS.PromptToValidate);
      }
    });
  }

  private getUpdatedClasses(): ChosenClass[] {
    const updateClasses: ChosenClass[] = [];
    this.classes.forEach((classLevelAdjustment: ClassLevelAdjustment) => {
      if (!classLevelAdjustment.removed) {
        if (classLevelAdjustment.chosenClass.characterClass == null) {
          classLevelAdjustment.chosenClass.characterClass = classLevelAdjustment.selectedCharacterClass;
        }
        if (classLevelAdjustment.chosenClass.subclass == null) {
          classLevelAdjustment.chosenClass.subclass = classLevelAdjustment.selectedSubclass;
        }
        classLevelAdjustment.chosenClass.healthGainResults = this.getHealthGainResults(classLevelAdjustment);
        classLevelAdjustment.chosenClass.characterLevel = this.characterLevelService.getLevelByName((classLevelAdjustment.originalLevel + classLevelAdjustment.adjustmentAmount).toString());
        updateClasses.push(classLevelAdjustment.chosenClass);
      }
    });
    return updateClasses;
  }

  private getHealthGainResults(classLevelAdjustment: ClassLevelAdjustment): HealthGainResult[] {
    const healthGainResults: HealthGainResult[] = [];
    classLevelAdjustment.healthGainResults.forEach((config: HealthGainResultConfig) => {
      healthGainResults.push(config.healthGainResult);
    });
    return healthGainResults;
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  expChange(input): void {
    this.updateExpValue(parseInt(input.value, 10));
    this.updateSelectedLevel();
    this.initializeLevels();
  }

  expSliderChange(event: MatSliderChange): void {
    this.updateExpValue(event.value);
    this.updateSelectedLevel();
    this.initializeLevels();
  }

  step(amount: number): void {
    if (amount < 0 && Math.abs(amount) > this.exp) {
      amount = this.exp * -1;
    }
    this.updateExpValue(this.exp + amount);
    this.updateSelectedLevel();
    this.initializeLevels();
  }

  private updateSelectedLevel(): void {
    this.selectedLevel = this.getLevelByExp(this.exp);
    this.updateLevelsAdjusted();
  }

  private updateLevelsAdjusted(): void {
    const newLevel = parseInt(this.selectedLevel.name, 10);
    this.levelsAdjusted = newLevel - this.originalLevel;
    this.updateDisabledStates();
    this.updateClassAdjustmentIfSingleClass();
  }

  private getLevelByExp(exp: number): CharacterLevel {
    let characterLevel: CharacterLevel = null;
    for (let i = 0;  i < this.levels.length; i++) {
      const level = this.levels[i];
      if (level.minExp <= exp && (characterLevel == null || characterLevel.minExp < level.minExp)) {
        characterLevel = level;
      } else if (level.minExp > exp) {
        break;
      }
    }
    return characterLevel;
  }

  private getLevelByName(name: string): CharacterLevel {
    for (let i = 0;  i < this.levels.length; i++) {
      const level = this.levels[i];
      if (level.name === name) {
        return level;
      }
    }
    return null;
  }

  adjustLevel(amount: number): void {
    const newLevel = parseInt(this.selectedLevel.name, 10) + amount;
    this.selectedLevel = this.getLevelByName(newLevel.toString());
    this.updateExpValue(this.selectedLevel.minExp);
    this.initializeLevels();
    this.updateLevelsAdjusted();
  }

  private updateExpValue(exp: number): void {
    this.exp = exp;
    this.adjustment = this.exp - this.originalExp;
  }

  adjustmentChange(input): void {
    this.adjustment = parseInt(input.value, 10);
    this.exp = this.originalExp + this.adjustment;
    if (this.exp < 0) {
      this.exp = 0;
    }
    this.updateSelectedLevel();
    this.initializeLevels();
  }

  private initializeLevels(): void {
    const currentLevel = this.characterLevelService.getLevelByExpInstant(this.exp);
    if (currentLevel == null) {
      return;
    }
    const currentLevelValue = parseInt(currentLevel.name, 10);
    const nextLevel = this.characterLevelService.getLevelByName((currentLevelValue + 1).toString());
    const previousLevel = this.characterLevelService.getLevelByName((currentLevelValue - 1).toString());

    if (nextLevel != null) {
      this.leftLevel = currentLevel;
      this.rightLevel = nextLevel;
    } else if (previousLevel != null) {
      this.leftLevel = previousLevel;
      this.rightLevel = currentLevel;
    }

    this.min = this.leftLevel.minExp;
    this.max = this.rightLevel.minExp;
    this.leftLabel = this.translate.instant('Level', {level: this.leftLevel.name});
    this.leftExp = this.leftLevel.minExp;
    this.rightLabel = this.translate.instant('Level', {level: this.rightLevel.name});
    this.rightExp = this.rightLevel.minExp;
    this.decreaseLevelDisabled = this.leftExp === 0;
    this.increaseLevelDisabled = currentLevel.name === '20';
    this.decreaseExpDisabled = this.exp === 0;
    this.increaseExpDisabled = currentLevel.name === '20';
  }

  private initializeClasses(): void {
    this.classes = [];
    this.playerCharacter.classes.forEach((chosenClass: ChosenClass) => {
      const config = this.addClass(chosenClass);
      const characterClass = chosenClass.characterClass;
      config.selectedCharacterClass = characterClass;
      config.numHitDicePerLevel = this.diceService.getClassNumHpGainDice(characterClass);
      config.hitDiceSize = characterClass.hitDice.diceSize;
      config.subclasses = this.getSubclasses(characterClass);
      config.subclass = config.subclasses[0];
      this.updateHealthGainResults(config, this.playerCharacter.healthCalculationType);
    });
    this.updateSingleClass();
  }

  adjustClass(classLevelAdjustment: ClassLevelAdjustment, amount: number): void {
    if ((amount > 0 && classLevelAdjustment.increaseDisabled) || (amount < 0 && classLevelAdjustment.decreaseDisabled)) {
      return;
    }
    classLevelAdjustment.adjustmentAmount += amount;
    this.updateHitDice(classLevelAdjustment);
    this.levelsAssigned += amount;
    this.updateDisabledStates();
  }

  private updateHitDice(classLevelAdjustment: ClassLevelAdjustment): void {
    const currentLevel = classLevelAdjustment.originalLevel + classLevelAdjustment.adjustmentAmount;
    classLevelAdjustment.healthGainResults.forEach((config: HealthGainResultConfig) => {
      const healthLevel = parseInt(config.healthGainResult.level.name, 10);
      config.visible = healthLevel > classLevelAdjustment.originalLevel && healthLevel <= currentLevel;

      if (healthLevel > classLevelAdjustment.originalLevel
        && !config.visible
        && this.playerCharacter.healthCalculationType === HealthCalculationType.ROLL) {
        config.healthGainResult.value = 0;
      }
    });
  }

  private updateDisabledStates(): void {
    const gainingLevels = this.levelsAdjusted > 0;
    const disableAllIncrease = gainingLevels && this.levelsAssigned === this.levelsAdjusted;
    const disableAllDecrease = !gainingLevels && this.levelsAssigned === this.levelsAdjusted;

    this.classes.forEach((classLevelAdjustment: ClassLevelAdjustment) => {
      if (gainingLevels) {
        classLevelAdjustment.decreaseDisabled = classLevelAdjustment.adjustmentAmount === 0 || (classLevelAdjustment.originalLevel + classLevelAdjustment.adjustmentAmount === 1);
        classLevelAdjustment.increaseDisabled = disableAllIncrease || (classLevelAdjustment.originalLevel + classLevelAdjustment.adjustmentAmount >= 20);
      } else {
        classLevelAdjustment.increaseDisabled = classLevelAdjustment.adjustmentAmount === 0;
        classLevelAdjustment.decreaseDisabled = disableAllDecrease || (classLevelAdjustment.originalLevel + classLevelAdjustment.adjustmentAmount === 1);
      }
    });
  }

  private getPrimaryClass(): ClassLevelAdjustment {
    for (let i = 0; i < this.classes.length; i++) {
      const classLevelAdjustment = this.classes[i];
      if (classLevelAdjustment.chosenClass.primary && !classLevelAdjustment.removed) {
        return classLevelAdjustment;
      }
    }
    return null;
  }

  private updateClassAdjustmentIfSingleClass(): void {
    if (this.singleClass) {
      const primaryClass = this.getPrimaryClass();
      if (primaryClass != null) {
        const totalLevel = parseInt(this.selectedLevel.name, 10);
        const adjustment = totalLevel - primaryClass.originalLevel - primaryClass.adjustmentAmount;
        this.adjustClass(primaryClass, adjustment);
      }
    }
  }

  gainResultChange(config: HealthGainResultConfig, value: number): void {
    config.healthGainResult.value = value;
  }

  removeClass(classLevelAdjustment: ClassLevelAdjustment): void {
    classLevelAdjustment.removed = true;
    this.levelsAssigned -= (classLevelAdjustment.originalLevel + classLevelAdjustment.adjustmentAmount);
    this.updateDisabledStates();
    let classBeingRemoved: ListObject = null;
    if (classLevelAdjustment.chosenClass.characterClass != null) {
      classBeingRemoved = classLevelAdjustment.chosenClass.characterClass;
    } else if (classLevelAdjustment.selectedClassOption != null) {
      classBeingRemoved = classLevelAdjustment.selectedClassOption.option;
    }
    this.updateDisabledOptions(classBeingRemoved, null, -1);
    this.updateSingleClass();
    if (this.singleClass) {
      //add all missing levels to the primary class
      this.updateClassAdjustmentIfSingleClass();
    }
  }

  private addClass(chosenClass: ChosenClass): ClassLevelAdjustment {
    const config = new ClassLevelAdjustment();
    config.id = this.nextConfigId;
    this.nextConfigId++;
    config.chosenClass = chosenClass;
    if (chosenClass.characterClass != null && chosenClass.subclass == null) {
      this.characteristicService.getChildrenCharacteristics(chosenClass.characterClass.id).then((children: ListObject[]) => {
        let subclasses: ListObject[] = [];
        subclasses.push(new ListObject('0', this.translate.instant('None')));
        subclasses = subclasses.concat(children);
        config.subclasses = subclasses;
        config.subclass = config.subclasses[0];
      });
    }
    config.numHitDicePerLevel = this.diceService.getClassNumHpGainDice(chosenClass.characterClass);
    config.hitDiceSize = this.diceService.getDiceSize(chosenClass.characterClass);
    config.hpPerLevelModifier = this.conModifier + this.playerCharacter.hpGainModifier;
    config.hpPerLevelModifierTooltip = this.getHpPerLevelModifierTooltip();
    config.healthGainResults = this.getHealthGainResultConfigs(chosenClass.healthGainResults);

    if (chosenClass.characterClass != null) {
      config.classDisplayName = chosenClass.characterClass.name;
      config.originalLevel = parseInt(chosenClass.characterLevel.name, 10);
      this.updateHitDice(config);
    } else {
      config.classDisplayName = '';
      config.originalLevel = 0;
      config.classOptions = _.cloneDeep(this.defaultClassOptions);
      this.initializeDisabledOptions(config);
      this.initializeSelectedClass(config);
      config.increaseDisabled = false;
    }

    this.classes.push(config);
    return config;
  }

  private getHealthGainResultConfigs(healthGainResults: HealthGainResult[]): HealthGainResultConfig[] {
    this.addMissingHealthGainResults(healthGainResults);
    const configs: HealthGainResultConfig[] = [];
    healthGainResults.forEach((healthGainResult: HealthGainResult) => {
      const config = new HealthGainResultConfig();
      config.healthGainResult = healthGainResult;
      config.visible = false;
      configs.push(config);
    });
    return configs;
  }

  private addMissingHealthGainResults(healthGainResults: HealthGainResult[]): void {
    this.levels.forEach((characterLevel: CharacterLevel) => {
      if (this.isLevelMissing(characterLevel, healthGainResults)) {
        healthGainResults.push(new HealthGainResult(new ListObject(characterLevel.id, characterLevel.name, characterLevel.sid)));
      }
    });
  }

  private isLevelMissing(characterLevel: CharacterLevel, healthGainResults: HealthGainResult[]): boolean {
    for (let i = 0; i < healthGainResults.length; i++) {
      if (healthGainResults[i].level.id === characterLevel.id) {
        return false;
      }
    }
    return true;
  }

  private initializeDisabledOptions(classLevelAdjustment: ClassLevelAdjustment): void {
    classLevelAdjustment.classOptions.forEach((classOption: ClassOption) => {
      classOption.disabled = this.isOptionDisabled(classOption.option);
    });
  }

  private initializeSelectedClass(classLevelAdjustment: ClassLevelAdjustment): void {
    for (let i = 0; i < classLevelAdjustment.classOptions.length; i++) {
      const option = classLevelAdjustment.classOptions[i];
      if (!option.disabled) {
        this.classChange(classLevelAdjustment, option).then(() => {
          this.adjustClass(classLevelAdjustment, 1);
          this.updateHitDice(classLevelAdjustment);
        });
        break;
      }
    }
  }

  updateHealthGainResults(classLevelAdjustment: ClassLevelAdjustment, healthCalculationType: HealthCalculationType): void {
    const value = this.characterService.getMaxHealthGainResult(classLevelAdjustment.selectedCharacterClass, healthCalculationType);
    // if (healthCalculationType === HealthCalculationType.ROLL) {
    //   value = 0;
    // }
    this.characterService.updateHealthGainResultsToMax(classLevelAdjustment.chosenClass, healthCalculationType, value);
  }

  private getSubclasses(characterClass: CharacterClass): ListObject[] {
    const subclasses: ListObject[] = [];
    subclasses.push(new ListObject('0', this.translate.instant('None')));
    if (characterClass != null) {
      characterClass.subclasses.forEach((subclass: CharacterClass) => {
        subclasses.push(new ListObject(subclass.id, subclass.name));
      });
    }
    return subclasses;
  }

  private getHpPerLevelModifierTooltip(): string {
    const parts = [];
    parts.push(this.translate.instant('Labels.ConModifier') + ' ' + this.conModifier);
    if (this.playerCharacter.hpGainModifier > 0) {
      parts.push(this.translate.instant('Labels.HpModifier') + ' ' + this.playerCharacter.hpGainModifier);
    }
    return parts.join('\n');
  }

  addClassClick(): void {
    if (this.singleClass) {
      this.adjustClass(this.classes[0], -1);
    }
    if (this.defaultClassOptions.length === 0) {
      this.initializeClassOptions().then(() => {
        this.continueAddingClass();
      });
    } else {
      this.continueAddingClass();
    }
  }

  private continueAddingClass(): void {
    const newClass = new ChosenClass();
    newClass.id = this.getNewClassId();
    newClass.primary = false;
    this.addClass(newClass);
    this.updateDisabledStates();
    this.updateSingleClass();
  }

  private getNewClassId(): string {
    return (this.classes.length * -1).toString(10);
  }

  private initializeClassOptions(): Promise<any> {
    return this.characterClassService.getClasses().then((classes: ListObject[]) => {
      const classOptions: ClassOption[] = [];
      classes.forEach((classOption: ListObject) => {
        const option = new ClassOption();
        option.option = classOption;
        option.subclasses = [];
        option.disabled = this.isOptionDisabled(classOption);
        classOptions.push(option);
      });
      this.defaultClassOptions = classOptions;
    });
  }

  private isOptionDisabled(classOption: ListObject): boolean {
    for (let i = 0; i < this.classes.length; i++) {
      const classLevelAdjustment: ClassLevelAdjustment = this.classes[i];
      if (!classLevelAdjustment.removed) {
        if (classLevelAdjustment.chosenClass.characterClass != null && classLevelAdjustment.chosenClass.characterClass.id === classOption.id) {
          return true;
        }
        if (classLevelAdjustment.selectedClassOption != null && classLevelAdjustment.selectedClassOption.option.id === classOption.id) {
          return true;
        }
      }
    }
    return false;
  }

  classChange(classLevelAdjustment: ClassLevelAdjustment, classOption: ClassOption): Promise<any> {
    if (!classOption.disabled) {
      const originalClass = classLevelAdjustment.selectedClassOption == null ? null : classLevelAdjustment.selectedClassOption.option;
      classLevelAdjustment.classDisplayName = classOption.option.name;
      classLevelAdjustment.selectedClassOption = classOption;

      return this.characterClassService.getClass(classOption.option.id).then((characterClass: CharacterClass) => {
        classLevelAdjustment.selectedCharacterClass = characterClass;
        classLevelAdjustment.numHitDicePerLevel = this.diceService.getClassNumHpGainDice(characterClass);
        classLevelAdjustment.hitDiceSize = characterClass.hitDice.diceSize;
        classLevelAdjustment.subclasses = this.getSubclasses(characterClass);
        classLevelAdjustment.subclass = classLevelAdjustment.subclasses[0];
        this.updateHealthGainResults(classLevelAdjustment, this.playerCharacter.healthCalculationType);
        classLevelAdjustment.healthGainResults = this.getHealthGainResultConfigs(classLevelAdjustment.chosenClass.healthGainResults);
        this.updateHitDice(classLevelAdjustment);
        this.updateDisabledOptions(originalClass, classOption.option, classLevelAdjustment.id);
      });
    }
  }

  private updateDisabledOptions(originalClass: ListObject, newClass: ListObject, skipId: number): void {
    this.classes.forEach((classLevelAdjustment: ClassLevelAdjustment) => {
      if (classLevelAdjustment.id !== skipId) {
        classLevelAdjustment.classOptions.forEach((classOption: ClassOption) => {
          if (originalClass != null && classOption.option.id === originalClass.id) {
            classOption.disabled = false;
          } else if (newClass != null && classOption.option.id === newClass.id) {
            classOption.disabled = true;
          }
        });
      }
    });
  }

  private updateSingleClass(): void {
    let count = 0;
    this.classes.forEach((classLevelAdjustment: ClassLevelAdjustment) => {
      if (!classLevelAdjustment.removed) {
        count++;
      }
    });
    this.singleClass = count === 1;
  }

  subclassChange(classLevelAdjustment: ClassLevelAdjustment, subclass: ListObject): void {
    classLevelAdjustment.subclass = subclass;

    if (subclass.id !== '0') {
      this.characterClassService.getClass(subclass.id).then((subclassClass: CharacterClass) => {
        classLevelAdjustment.selectedSubclass = subclassClass;
      });
    }
  }

  resetHealthChange(event: MatCheckboxChange): void {
    this.resetHealth = event.checked;
  }
}
