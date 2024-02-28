import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CreatureListProficiency} from '../../models/creatures/creature-list-proficiency';
import {YesNoDialogData} from '../../../core/components/yes-no-dialog/yes-no-dialog-data';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {YesNoDialogComponent} from '../../../core/components/yes-no-dialog/yes-no-dialog.component';
import {EVENTS, HEALTH_FLASH_DURATION, MAX_TEMP_HP_VALUE, SID} from '../../../constants';
import {Subscription} from 'rxjs';
import {CreatureState} from '../../models/creatures/creature-state.enum';
import {CreatureSpell} from '../../models/creatures/creature-spell';
import {ListObject} from '../../models/list-object';
import {EventsService} from '../../../core/services/events.service';
import {CharacterService} from '../../../core/services/creatures/character.service';
import {CreatureService} from '../../../core/services/creatures/creature.service';
import {DiceService} from '../../../core/services/dice.service';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from '../../../core/services/notification.service';
import {ConditionService} from '../../../core/services/attributes/condition.service';
import {HitDiceService} from '../../../core/services/hit-dice.service';
import {CreatureItemService} from '../../../core/services/creatures/creature-item.service';
import * as _ from 'lodash';
import {CreatureItem} from '../../models/creatures/creature-item';
import {CreatureItemAction} from '../../models/creatures/creature-item-action.enum';
import {ActiveCondition} from '../../models/creatures/active-condition';
import {Roll} from '../../models/rolls/roll';
import {RollRequest} from '../../models/rolls/roll-request';
import {RollType} from '../../models/rolls/roll-type.enum';
import {DiceSize} from '../../models/dice-size.enum';
import {Creature} from '../../models/creatures/creature';
import {CreatureConfigurationCollection} from '../../models/creatures/configs/creature-configuration-collection';
import {CreatureHitDiceModification} from '../../models/creatures/creature-hit-dice-modification';

export enum HealthModificationType {
  DAMAGE = 'DAMAGE',
  HEAL = 'HEAL',
  TEMP = 'TEMP',
  STABILIZE = 'STABILIZE',
  UNSTABILIZED = 'UNSTABILIZED',
  DEATH_SAVE_SUCCESS = 'DEATH_SAVE_SUCCESS',
  DEATH_SAVE_FAIL = 'DEATH_SAVE_FAIL',
  HIT_DICE = 'HIT_DICE',
  CONCENTRATION_CHECK = 'CONCENTRATION_CHECK'
}

export class HealthModificationResult {
  healthModificationType: HealthModificationType;
  amount = 0;
  critical = false;
  display = '';
}

export class HealthCalculatorValue {
  value = 0;
  operators: string[] = [];
  total = 0;
  display = '';
}

export class HealthCalculatorState {
  initialized = false;
  calculatedCurrent = 0;
  calculatedCurrentTooltip = '';
  calculatedTemp = 0;
  calculatedDeathSaveFailures = 0;
  calculatedDeathSaveSuccesses = 0;
  calculatedCreatureState: CreatureState = CreatureState.CONSCIOUS;
  failedConcentration = false;
  activeConditions: ListObject[] = [];
  concentratingSpell: CreatureSpell = null;
  healthModificationResults: HealthModificationResult[] = [];
}

@Component({
  selector: 'app-health-calculator',
  templateUrl: './health-calculator.component.html',
  styleUrls: ['./health-calculator.component.scss']
})
export class HealthCalculatorComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() calculatorState = new HealthCalculatorState();
  @Input() maxHP: number;
  @Input() maxHpModifier = 0;
  @Input() maxHPTooltip = '';
  @Input() flashLCD = true;
  @Input() highlightValues = true;
  @Input() dropItemsWhenDying = false;
  @Input() removeProneOnRevive = false;
  @Input() showHistory = true;
  @Input() showHitDice = true;
  @Input() quickKill = false;
  @Input() hitDice: CreatureHitDiceModification[] = [];

  eventSub: Subscription;

  currentHP = 0;
  tempHP = 0;
  currentHPTooltip = '';
  conModifier = 0;
  concentrationProficiency: CreatureListProficiency = null;
  concentrationModifier = 0;

  deathSaveSuccesses = 0;
  deathSaveFailures = 0;
  creatureState: CreatureState = CreatureState.CONSCIOUS;
  isDying = false;
  isDead = false;
  isStable = false;

  keydownListener: any;
  keyCodes = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
    '+',
    '-',
    't',
    '*',
    '/',
    'backspace',
    'delete'
  ];

  healthCalculatorValue: HealthCalculatorValue = new HealthCalculatorValue();

  flashPrimary = false;
  flashSecondary = false;
  flashTertiary = false;

  constructor(
    private dialog: MatDialog,
    private eventsService: EventsService,
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private diceService: DiceService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private conditionService: ConditionService,
    private hitDiceService: HitDiceService,
    private creatureItemService: CreatureItemService
  ) { }

  ngOnInit() {
    const self = this;
    this.keydownListener = (event: KeyboardEvent) => {
      if (self.hasKeyCode(event)) {
        self.calculatorButtonClick(event.key);
      }
    };

    window.addEventListener('keydown', this.keydownListener);

    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ModifiersUpdated
        || event === EVENTS.AbilityScoreChange
        || event === EVENTS.HpUpdated
        || event === EVENTS.ExhaustionLevelChanged
        || event === EVENTS.HealthSettingsChanged) {
        this.initializeValues();
      }
    });
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.keydownListener);
    this.eventSub.unsubscribe();
  }

  private hasKeyCode(event: KeyboardEvent): boolean {
    return _.some(this.keyCodes, (keyCode) => {
      return event.key.toLowerCase() === keyCode;
    });
  }

  private initializeValues(): void {
    if (this.creature == null) {
      return;
    }
    this.initializeHP();
    this.initializeDeathSaves();
    this.updateHealthCalculatorValue();
    this.initializeCalculated();
    this.healthCalculatorValue = new HealthCalculatorValue();
    this.calculatorState.concentratingSpell = this.getConcentratingSpell();
    this.initializeActiveConditions();
  }

  private initializeHP(): void {
    this.currentHP = this.creature.creatureHealth.currentHp;
    this.tempHP = this.creature.creatureHealth.tempHp;
    this.currentHPTooltip = this.creatureService.getCurrentHPTooltip(this.creature);
    const con = this.creatureService.getAbilityBySid(SID.ABILITIES.CONSTITUTION, this.collection);
    this.conModifier = this.creatureService.getAbilityModifier(con, this.collection);
    this.concentrationProficiency = this.creatureService.getConcentrationProficiency(this.collection);
    this.concentrationModifier = this.creatureService.getConcentrationModifier(this.creature, this.collection);
  }

  private initializeDeathSaves(): void {
    this.deathSaveSuccesses = this.creature.creatureHealth.numDeathSaveThrowSuccesses;
    this.deathSaveFailures = this.creature.creatureHealth.numDeathSaveThrowFailures;
    this.creatureState = this.creature.creatureHealth.creatureState;
  }

  private initializeCalculated(): void {
    if (!this.calculatorState.initialized) {
      this.calculatorState.calculatedCurrent = this.currentHP;
      this.calculatorState.calculatedTemp = this.tempHP;
      this.calculatorState.calculatedCurrentTooltip = this.getCalculatedTooltip();
      this.calculatorState.calculatedCreatureState = this.creatureState;
      this.calculatorState.calculatedDeathSaveSuccesses = this.deathSaveSuccesses;
      this.calculatorState.calculatedDeathSaveFailures = this.deathSaveFailures;
      this.calculatorState.initialized = true;
      this.calculatorState.healthModificationResults = [];
    }
    this.updateIsDying();
  }

  private updateNewHp(result: HealthModificationResult): void {
    let calculatedCurrent = this.calculatorState.calculatedCurrent;
    let calculatedTemp = this.calculatorState.calculatedTemp;
    let calculatedCreatureState = this.calculatorState.calculatedCreatureState;
    let calculatedDeathSaveSuccesses = this.calculatorState.calculatedDeathSaveSuccesses;
    let calculatedDeathSaveFailures = this.calculatorState.calculatedDeathSaveFailures;

    switch (result.healthModificationType) {
      case HealthModificationType.DAMAGE:
        if (calculatedCurrent === 0) { //dying
          if (calculatedCreatureState !== CreatureState.DEAD) {
            calculatedDeathSaveFailures++;
            if (calculatedCreatureState === CreatureState.STABLE) {
              calculatedCreatureState = CreatureState.UNSTABLE;
              this.unstabilize();
            }
            if (result.critical) {
              calculatedDeathSaveFailures++;
            }

            const damageDeathSaveFail = new HealthModificationResult();
            damageDeathSaveFail.healthModificationType = HealthModificationType.DEATH_SAVE_FAIL;
            damageDeathSaveFail.amount = result.critical ? 2 : 1;
            if (result.critical) {
              damageDeathSaveFail.display = this.translate.instant('DeathSaves.FailCritical', {value: this.translate.instant('Auto')});
            } else {
              damageDeathSaveFail.display = this.translate.instant('DeathSaves.Fail', {value: this.translate.instant('Auto')});
            }
            this.calculatorState.healthModificationResults.push(damageDeathSaveFail);

            if (result.amount >= this.maxHP) {
              //killing blow
              calculatedDeathSaveFailures = 3;
              calculatedCreatureState = CreatureState.DEAD;
            }
          }
        } else {
          let remaining = result.amount;
          if (calculatedTemp > 0) {
            if (calculatedTemp >= result.amount) {
              calculatedTemp = calculatedTemp - result.amount;
              remaining = 0;
            } else {
              remaining = result.amount - calculatedTemp;
              calculatedTemp = 0;
            }
          }

          if (remaining > 0) {
            calculatedCurrent = calculatedCurrent - remaining;
          }
          if (calculatedCurrent <= (this.maxHP * -1) || (calculatedCurrent <= 0 && this.quickKill)) {
            //killing blow
            calculatedDeathSaveFailures = 3;
            calculatedCreatureState = CreatureState.DEAD;
          }
          if (calculatedCurrent < 0) {
            calculatedCurrent = 0;
          }

          if (calculatedCurrent === 0 && calculatedCreatureState !== CreatureState.DEAD) {
            calculatedCreatureState = CreatureState.UNSTABLE;
            this.unstabilize();
          }

          if (calculatedCurrent > 0) {
            this.promptForConcentrationCheck(result.amount);
          }
        }
        break;
      case HealthModificationType.HEAL:
      case HealthModificationType.HIT_DICE:
        calculatedCurrent = calculatedCurrent + result.amount;
        calculatedCreatureState = CreatureState.CONSCIOUS;
        calculatedDeathSaveSuccesses = 0;
        calculatedDeathSaveFailures = 0;
        if (calculatedCurrent > this.maxHP) {
          calculatedCurrent = this.maxHP;
        }
        break;
      case HealthModificationType.TEMP:
        calculatedTemp = result.amount;
        if (calculatedTemp < 0) {
          calculatedTemp = 0;
        }
        break;
      case HealthModificationType.STABILIZE:
        calculatedDeathSaveSuccesses = 0;
        calculatedDeathSaveFailures = 0;
        calculatedCreatureState = CreatureState.STABLE;
        break;
      case HealthModificationType.DEATH_SAVE_SUCCESS:
        calculatedDeathSaveSuccesses += result.amount;
        if (result.amount < 0) {
          if (calculatedCreatureState === CreatureState.STABLE) {
            calculatedCreatureState = CreatureState.UNSTABLE;
            this.unstabilize();
          }
        }
        break;
      case HealthModificationType.DEATH_SAVE_FAIL:
        calculatedDeathSaveFailures += result.amount;
        if (result.amount > 0) {
          if (calculatedCreatureState === CreatureState.STABLE) {
            calculatedCreatureState = CreatureState.UNSTABLE;
            this.unstabilize();
          }
        } else {
          if (calculatedCreatureState === CreatureState.DEAD) {
            calculatedCreatureState = CreatureState.UNSTABLE;
          }
        }
        break;
    }

    if (calculatedDeathSaveFailures >= 3) {
      calculatedDeathSaveFailures = 3;
      calculatedCreatureState = CreatureState.DEAD;
    }
    if (calculatedDeathSaveSuccesses >= 3) {
      calculatedDeathSaveSuccesses = 0;
      calculatedDeathSaveFailures = 0;
      calculatedCreatureState = CreatureState.STABLE;

      const healthModificationResult = new HealthModificationResult();
      healthModificationResult.healthModificationType = HealthModificationType.STABILIZE;
      healthModificationResult.display = this.translate.instant('Stabilized');
      this.calculatorState.healthModificationResults.push(healthModificationResult);
    }

    if (calculatedCreatureState === CreatureState.DEAD && this.calculatorState.calculatedCreatureState !== CreatureState.DEAD) {
      const healthModificationResult = new HealthModificationResult();
      healthModificationResult.healthModificationType = HealthModificationType.STABILIZE;
      healthModificationResult.display = this.translate.instant('Died');
      this.calculatorState.healthModificationResults.push(healthModificationResult);
    }

    this.calculatorState.calculatedCurrent = calculatedCurrent;
    this.calculatorState.calculatedTemp = calculatedTemp;
    this.calculatorState.calculatedCurrentTooltip = this.getCalculatedTooltip();
    this.calculatorState.calculatedDeathSaveSuccesses = calculatedDeathSaveSuccesses;
    this.calculatorState.calculatedDeathSaveFailures = calculatedDeathSaveFailures;
    this.setCalculatedCreatureState(calculatedCreatureState);
    this.updateIsDying();
    if (this.isDying || this.isDead) {
      this.calculatorState.failedConcentration = true;
    }
    setTimeout(() => {
      this.eventsService.dispatchEvent(EVENTS.DeathSavesChanged);
    });
  }

  private setCalculatedCreatureState(creatureState: CreatureState): void {
    if (this.calculatorState.calculatedCreatureState !== creatureState) {
      if (creatureState === CreatureState.UNSTABLE) {
        this.addCondition(SID.CONDITIONS.UNCONSCIOUS);

        if (this.dropItemsWhenDying) {
          const heldItems: CreatureItem[] = this.creatureService.getHeldItems(this.creature);
          heldItems.forEach((item: CreatureItem) => {
            this.creatureItemService.performAction(CreatureItemAction.DROP, this.creature, item, 1);
          });
        }
      } else if (creatureState === CreatureState.CONSCIOUS) {
        this.removeCondition(SID.CONDITIONS.UNCONSCIOUS);

        if (!this.removeProneOnRevive) {
          this.addCondition(SID.CONDITIONS.PRONE);
        }
      }

      this.calculatorState.calculatedCreatureState = creatureState;
    }
  }

  private addCondition(conditionSID: number): void {
    const index = this.getActiveConditionIndex(conditionSID);
    if (index === -1) {
      const condition = this.conditionService.getConditionBySID(conditionSID);
      const immune = this.creatureService.isConditionImmune(condition, this.creature);
      if (!immune) {
        this.calculatorState.activeConditions.push(condition);
      }
    }
  }

  private removeCondition(conditionSID: number): void {
    const index = this.getActiveConditionIndex(conditionSID);
    if (index > -1) {
      this.calculatorState.activeConditions.splice(index, 1);
    }
  }

  private getActiveConditionIndex(conditionSID: number): number {
    for (let i = 0; i < this.calculatorState.activeConditions.length; i++) {
      if (this.calculatorState.activeConditions[i].sid === conditionSID) {
        return i;
      }
    }
    return -1;
  }

  private promptForConcentrationCheck(damageAmount: number): void {
    if (this.calculatorState.concentratingSpell != null) {
      const dc = this.getConcentrationCheckDC(damageAmount);
      this.rollConcentrationCheck(dc);
    }
  }

  private getConcentratingSpell(): CreatureSpell {
    return this.creatureService.getConcentratingSpell(this.creature);
  }

  private getConcentrationCheckDC(damageAmount: number): number {
    const halfDamage = Math.floor(damageAmount / 2);
    return Math.max(halfDamage, 10);
  }

  private initializeActiveConditions(): void {
    const conditions: ListObject[] = [];
    this.creature.activeConditions.forEach((activeCondition: ActiveCondition) => {
      if (!activeCondition.inherited) {
        conditions.push(activeCondition.condition);
      }
    });
    this.calculatorState.activeConditions = conditions;
  }

  private unstabilize(): void {
    const dyingResult = new HealthModificationResult();
    dyingResult.healthModificationType = HealthModificationType.UNSTABILIZED;
    dyingResult.amount  = 0;
    dyingResult.display = this.translate.instant('HealthModificationType.' + HealthModificationType.UNSTABILIZED);
    this.calculatorState.healthModificationResults.push(dyingResult);
  }

  private updateIsDying(): void {
    this.isDying = this.calculatorState.calculatedCreatureState !== CreatureState.CONSCIOUS;
    this.isDead = this.calculatorState.calculatedCreatureState === CreatureState.DEAD;
    this.isStable = this.calculatorState.calculatedCreatureState === CreatureState.STABLE;
  }

  private getCalculatedTooltip(): string {
    const parts = [];
    parts.push(this.translate.instant('Labels.Current') + ' ' + this.calculatorState.calculatedCurrent);
    if (this.calculatorState.calculatedTemp) {
      parts.push(this.translate.instant('Labels.Temp') + ' ' + this.calculatorState.calculatedTemp);
    }
    return parts.join('\n');
  }

  applyHitDiceResults(roll: Roll): void {
    this.flashColor(HealthModificationType.HEAL);

    const healthModificationResult = new HealthModificationResult();
    healthModificationResult.healthModificationType = HealthModificationType.HIT_DICE;
    healthModificationResult.amount = roll.totalResult;
    healthModificationResult.display = this.translate.instant('HealthModificationType.' + HealthModificationType.HIT_DICE, {
      diceSize: this.translate.instant('DiceSize.' + roll.results[0].results[0].diceSize),
      value: roll.totalResult
    });

    this.notificationService.success(healthModificationResult.display);
    this.calculatorState.healthModificationResults.push(healthModificationResult);
    this.updateNewHp(healthModificationResult);
  }

  onSuccessCheckChange(numberChecked: number): void {
    const healthModificationResult = new HealthModificationResult();
    healthModificationResult.healthModificationType = HealthModificationType.DEATH_SAVE_SUCCESS;
    healthModificationResult.amount = numberChecked > this.calculatorState.calculatedDeathSaveSuccesses ? 1 : -1;
    if (healthModificationResult.amount === 1) {
      healthModificationResult.display = this.translate.instant('DeathSaves.Success', {value: this.translate.instant('Manual')});
    } else {
      healthModificationResult.display = this.translate.instant('DeathSaves.SuccessUndo');
    }
    this.calculatorState.healthModificationResults.push(healthModificationResult);
    this.updateNewHp(healthModificationResult);
  }

  onFailureCheckChange(numberChecked: number): void {
    const healthModificationResult = new HealthModificationResult();
    healthModificationResult.healthModificationType = HealthModificationType.DEATH_SAVE_FAIL;
    healthModificationResult.amount = numberChecked > this.calculatorState.calculatedDeathSaveFailures ? 1 : -1;
    if (healthModificationResult.amount === 1) {
      healthModificationResult.display = this.translate.instant('DeathSaves.Fail', {value: this.translate.instant('Manual')});
    } else {
      healthModificationResult.display = this.translate.instant('DeathSaves.FailUndo');
    }
    this.calculatorState.healthModificationResults.push(healthModificationResult);
    this.updateNewHp(healthModificationResult);
  }

  stabilize(): void {
    if (this.isStable || this.isDead) {
      return;
    }
    const healthModificationResult = new HealthModificationResult();
    healthModificationResult.healthModificationType = HealthModificationType.STABILIZE;
    healthModificationResult.display = this.translate.instant('Stabilized');
    this.calculatorState.healthModificationResults.push(healthModificationResult);
    this.updateNewHp(healthModificationResult);
  }

  private rollConcentrationCheck(dc: number): void {
    if (this.calculatorState.concentratingSpell != null && !this.calculatorState.failedConcentration) {
      this.creatureService.rollStandard(this.creature, this.getConcentrationRollRequest()).then((roll: Roll) => {
        const healthModificationResult = new HealthModificationResult();
        healthModificationResult.amount = 1;
        healthModificationResult.healthModificationType = HealthModificationType.CONCENTRATION_CHECK;

        const naturalRoll = this.diceService.getNaturalRoll(roll);
        const displayData = {
          value: roll.totalResult,
          spellName: this.calculatorState.concentratingSpell.spell.name
        };
        if (naturalRoll === 20) {
          healthModificationResult.display = this.translate.instant('ConcentrationChecks.SuccessCritical', displayData);
          this.notificationService.success(healthModificationResult.display);
        } else if (naturalRoll === 1) {
          healthModificationResult.display = this.translate.instant('ConcentrationChecks.FailCritical', displayData);
          this.notificationService.error(healthModificationResult.display);
          this.calculatorState.failedConcentration = true;
        } else {
          if (roll.totalResult >= dc) {
            healthModificationResult.display = this.translate.instant('ConcentrationChecks.Success', displayData);
            this.notificationService.success(healthModificationResult.display);
          } else {
            healthModificationResult.display = this.translate.instant('ConcentrationChecks.Fail', displayData);
            this.notificationService.error(healthModificationResult.display);
            this.calculatorState.failedConcentration = true;
          }
        }

        this.calculatorState.healthModificationResults.push(healthModificationResult);
      });
    }
  }

  private getConcentrationRollRequest(): RollRequest {
    return this.diceService.getRollRequest(
      RollType.STANDARD,
      this.translate.instant('ConcentrationCheck', {spellName: this.calculatorState.concentratingSpell.spell.name}),
      DiceSize.TWENTY,
      this.concentrationModifier,
      false,
      this.concentrationProficiency.proficiency.advantage,
      this.concentrationProficiency.proficiency.disadvantage
    );
  }

  rollDeathSave(): void {
    if (this.isDead || this.isStable) {
      return;
    }
    this.creatureService.rollStandard(this.creature, this.getDeathSaveRollRequest()).then((roll: Roll) => {
      const healthModificationResult = new HealthModificationResult();
      healthModificationResult.amount = 1;

      const naturalRoll = this.diceService.getNaturalRoll(roll);
      if (naturalRoll === 1) { //natural 1
        healthModificationResult.healthModificationType = HealthModificationType.DEATH_SAVE_FAIL;
        healthModificationResult.amount = 2;
        healthModificationResult.display = this.translate.instant('DeathSaves.FailCritical', {value: roll.totalResult});
        this.notificationService.error(healthModificationResult.display);
      } else if (naturalRoll === 20) { //natural 20
        healthModificationResult.healthModificationType = HealthModificationType.DEATH_SAVE_SUCCESS;
        healthModificationResult.amount = 2;
        healthModificationResult.display = this.translate.instant('DeathSaves.SuccessCritical', {value: roll.totalResult});
        this.notificationService.success(healthModificationResult.display);
      } else if (roll.totalResult >= 10) {
        healthModificationResult.healthModificationType = HealthModificationType.DEATH_SAVE_SUCCESS;
        healthModificationResult.display = this.translate.instant('DeathSaves.Success', {value: roll.totalResult});
        this.notificationService.success(healthModificationResult.display);
      } else {
        healthModificationResult.healthModificationType = HealthModificationType.DEATH_SAVE_FAIL;
        healthModificationResult.display = this.translate.instant('DeathSaves.Fail', {value: roll.totalResult});
        this.notificationService.error(healthModificationResult.display);
      }

      this.calculatorState.healthModificationResults.push(healthModificationResult);
      this.updateNewHp(healthModificationResult);
    });
  }

  private getDeathSaveRollRequest(): RollRequest {
    return this.diceService.getRollRequest(
      RollType.STANDARD,
      this.translate.instant('DeathSave'),
      DiceSize.TWENTY,
      this.creature.creatureHealth.deathSaveMod - this.creature.creatureHealth.resurrectionPenalty,
      false,
      this.creature.creatureHealth.deathSaveAdvantage,
      this.creature.creatureHealth.deathSaveDisadvantage || this.creature.creatureHealth.exhaustionLevel >= 3
    );
  }

  calculatorButtonClick(value: string): void {
    switch (value.toLowerCase()) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        this.handleValue(value);
        break;
      case 'backspace':
      case 'delete':
        this.handleDelete();
        break;
      case '+':
        this.applyHealing();
        break;
      case '-':
        this.applyDamage();
        break;
      case 't':
        this.applyTemp();
        break;
      case '*':
      case '/':
        this.handleOperator(value);
        break;
    }
  }

  private handleValue(value: string): void {
    if (this.healthCalculatorValue.operators.length > 0) {
      return;
    }

    let currentValue = this.healthCalculatorValue.value.toString();
    currentValue += value;
    let newValue = parseInt(currentValue, 10);
    if (newValue > 99999) {
      newValue = 99999;
    }
    this.healthCalculatorValue.value = newValue;
    this.updateHealthCalculatorValue();
  }

  private handleDelete(): void {
    if (this.healthCalculatorValue.value === 0) {
      return;
    }

    if (this.healthCalculatorValue.operators.length > 0) {
      this.healthCalculatorValue.operators.pop();
    } else {
      let value = this.healthCalculatorValue.value.toString();
      if (value.length > 1) {
        value = value.substr(0, value.length - 1);
      } else {
        value = '0';
      }
      this.healthCalculatorValue.value = parseInt(value, 10);
    }
    this.updateHealthCalculatorValue();
  }

  private handleOperator(operator: string): void {
    if (this.healthCalculatorValue.value === 0
      || this.healthCalculatorValue.operators.length >= 5) {
      return;
    }

    this.healthCalculatorValue.operators.push(operator);
    this.updateHealthCalculatorValue();
  }

  private updateHealthCalculatorValue(): void {
    if (this.healthCalculatorValue.value === 0) {
      this.healthCalculatorValue.total = 0;
      this.healthCalculatorValue.display = '';
      return;
    }

    let total = this.healthCalculatorValue.value;
    let display = this.healthCalculatorValue.value.toString();
    this.healthCalculatorValue.operators.forEach((operator: string) => {
      switch (operator) {
        case '/':
          total = Math.floor(total / 2);
          display += ' / 2';
          break;
        case '*':
          total *= 2;
          display += ' * 2';
          break;
      }
    });
    this.healthCalculatorValue.total = total;
    if (this.healthCalculatorValue.operators.length > 0) {
      display += ' = ' + total;
    }
    this.healthCalculatorValue.display = display;
  }

  private applyAmount(healthModificationType: HealthModificationType, amount: number): void {
    if (amount > 0) {
      if (healthModificationType === HealthModificationType.DAMAGE
        && this.isDying) {
        this.promptForCrit(healthModificationType, amount);
      } else {
        this.applyFinalAmount(healthModificationType, false, amount);
      }
    }

    this.healthCalculatorValue = new HealthCalculatorValue();
  }

  private promptForCrit(healthModificationType: HealthModificationType, amount: number): void {
    const data = new YesNoDialogData();
    data.title = this.translate.instant('CriticalHit');
    data.message = this.translate.instant('CriticalHitPrompt');
    data.yes = () => {
      this.applyFinalAmount(healthModificationType, true, amount);
    };
    data.no = () => {
      this.applyFinalAmount(healthModificationType, false, amount);
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(YesNoDialogComponent, dialogConfig);
  }

  private applyFinalAmount(healthModificationType: HealthModificationType, critical: boolean, amount: number) {
    const healthModificationResult = new HealthModificationResult();
    healthModificationResult.healthModificationType = healthModificationType;
    healthModificationResult.amount = amount;
    healthModificationResult.critical = critical;
    healthModificationResult.display = this.translate.instant('HealthModificationType.' + healthModificationType) + ': ' + this.healthCalculatorValue.display;
    this.calculatorState.healthModificationResults.push(healthModificationResult);
    this.updateNewHp(healthModificationResult);
  }

  private flashColor(healthModificationType: HealthModificationType): void {
    switch (healthModificationType) {
      case HealthModificationType.DAMAGE:
        this.flashPrimary = true;
        break;
      case HealthModificationType.HEAL:
        this.flashSecondary = true;
        break;
      case HealthModificationType.TEMP:
        this.flashTertiary = true;
        break;
    }
    setTimeout(() => {
      switch (healthModificationType) {
        case HealthModificationType.DAMAGE:
          this.flashPrimary = false;
          break;
        case HealthModificationType.HEAL:
          this.flashSecondary = false;
          break;
        case HealthModificationType.TEMP:
          this.flashTertiary = false;
          break;
      }
    }, HEALTH_FLASH_DURATION);
  }

  private applyHealing(): void {
    if (this.healthCalculatorValue.total > 0) {
      this.flashColor(HealthModificationType.HEAL);
      this.applyAmount(HealthModificationType.HEAL, this.healthCalculatorValue.total);
    }
  }

  private applyDamage(): void {
    if (this.healthCalculatorValue.total > 0) {
      this.flashColor(HealthModificationType.DAMAGE);
      this.applyAmount(HealthModificationType.DAMAGE, this.healthCalculatorValue.total);
    }
  }

  private applyTemp(): void {
    if (this.healthCalculatorValue.total > 0) {
      if (this.healthCalculatorValue.total > MAX_TEMP_HP_VALUE) {
        this.healthCalculatorValue.total = MAX_TEMP_HP_VALUE;
      }
      this.flashColor(HealthModificationType.TEMP);
      this.applyAmount(HealthModificationType.TEMP, this.healthCalculatorValue.total);
    }
  }

}
