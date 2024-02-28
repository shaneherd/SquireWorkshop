import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureHitDice} from '../../../../shared/models/creatures/creature-hit-dice';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CreatureHitDiceModification} from '../../../../shared/models/creatures/creature-hit-dice-modification';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmDialogData} from '../../../../core/components/confirm-dialog/confirmDialogData';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import {HitDiceService} from '../../../../core/services/hit-dice.service';
import {Subscription} from 'rxjs';
import {HealthCalculatorState} from '../../../../shared/components/health-calculator/health-calculator.component';
import * as _ from 'lodash';
import {CreatureConditions} from '../../../../shared/models/creatures/creature-conditions';
import {ActiveCondition} from '../../../../shared/models/creatures/active-condition';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';
import {MonsterService} from '../../../../core/services/creatures/monster.service';

@Component({
  selector: 'app-health-details',
  templateUrl: './health-details.component.html',
  styleUrls: ['./health-details.component.scss']
})
export class HealthDetailsComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() quickKill = false;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  configuring = false;
  playerCharacter: PlayerCharacter = null;

  maxHP = 0;
  maxHPTooltip = '';
  maxHpModifier = 0;
  hitDice: CreatureHitDiceModification[] = [];
  calculatorState = new HealthCalculatorState();

  keydownListener: any;
  keyCodes = [
    'enter'
  ];

  constructor(
    private dialog: MatDialog,
    private eventsService: EventsService,
    private characterService: CharacterService,
    private monsterService: MonsterService,
    private creatureService: CreatureService,
    private translate: TranslateService,
    private hitDiceService: HitDiceService
  ) { }

  ngOnInit() {
    this.initializeValues();
    const self = this;
    this.keydownListener = (event: KeyboardEvent) => {
      if (self.hasKeyCode(event)) {
        event.preventDefault();
        self.handleKeyClick(event.key);
      }
    };

    window.addEventListener('keydown', this.keydownListener);

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

  private handleKeyClick(value: string): void {
    switch (value.toLowerCase()) {
      case 'enter':
        this.saveDetails();
        break;
    }
  }

  private hasKeyCode(event: KeyboardEvent): boolean {
    return _.some(this.keyCodes, (keyCode) => {
      return event.key.toLowerCase() === keyCode;
    });
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.keydownListener);
    this.eventSub.unsubscribe();
  }

  configure(): void {
    if (this.calculatorState.healthModificationResults.length > 0) {
      const self = this;
      const data = new ConfirmDialogData();
      data.message = this.translate.instant('SaveAndContinueMessage');
      data.confirm = () => {
        this.saveDetails(false).then(() => {
          self.configuring = true;
        });
      };
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = data;
      this.dialog.open(ConfirmDialogComponent, dialogConfig);
    } else {
      this.configuring = true;
    }
  }

  closeConfigurations(): void {
    this.configuring = false;
  }

  saveConfigurations(): void {
    this.configuring = false;
    this.eventsService.dispatchEvent(EVENTS.HealthSettingsChanged);
  }

  private initializeValues(): void {
    if (this.creature.creatureType === CreatureType.CHARACTER) {
      this.playerCharacter = this.creature as PlayerCharacter;
      this.maxHP = this.characterService.getMaxHP(this.playerCharacter, this.collection);
      this.maxHpModifier = this.maxHP - this.characterService.getMaxHP(this.playerCharacter, this.collection, false, false, false);
      this.maxHPTooltip = this.characterService.getMaxHPTooltip(this.playerCharacter, this.collection);
      this.hitDice = this.hitDiceService.getHitDice(this.playerCharacter, this.collection);
    } else if (this.creature.creatureType === CreatureType.MONSTER) {
      const battleMonster = this.creature as BattleMonster;
      this.maxHP = this.monsterService.getMaxHP(battleMonster, this.collection);
      this.maxHpModifier = this.maxHP - this.monsterService.getMaxHP(battleMonster, this.collection, false, false, false);
      this.maxHPTooltip = this.monsterService.getMaxHPTooltip(battleMonster, this.collection);
      this.hitDice = [];
    }
  }

  closeDetails(): void {
    if (this.calculatorState.healthModificationResults.length > 0) {
      const self = this;
      const data = new ConfirmDialogData();
      data.title = this.translate.instant('CreatureHealth.Cancel.Title');
      data.message = this.translate.instant('CreatureHealth.Cancel.Message');
      data.confirm = () => {
        self.close.emit();
      };
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = data;
      this.dialog.open(ConfirmDialogComponent, dialogConfig);
    } else {
      this.close.emit();
    }
  }

  private getUpdatedHitDice(): CreatureHitDice[] {
    const hitDice: CreatureHitDice[] = [];
    this.hitDice.forEach((creatureHitDiceModification: CreatureHitDiceModification) => {
      const hitDie = new CreatureHitDice();
      hitDie.diceSize = creatureHitDiceModification.diceSize;
      hitDie.remaining = creatureHitDiceModification.remaining;
      hitDice.push(hitDie);
    });
    return hitDice;
  }

  saveDetails(close = true): Promise<any> {
    const creatureHealth = _.cloneDeep(this.creature.creatureHealth);
    creatureHealth.currentHp = this.calculatorState.calculatedCurrent;
    creatureHealth.tempHp = this.calculatorState.calculatedTemp;
    creatureHealth.creatureHitDice = this.getUpdatedHitDice();

    creatureHealth.numDeathSaveThrowFailures = this.calculatorState.calculatedDeathSaveFailures;
    creatureHealth.numDeathSaveThrowSuccesses = this.calculatorState.calculatedDeathSaveSuccesses;
    creatureHealth.creatureState = this.calculatorState.calculatedCreatureState;
    // creatureHealth.resurrectionPenalty = 0;
    // creatureHealth.exhaustionLevel = 0;

    const promises = [];
    //update health
    promises.push(this.creatureService.updateCreatureHealth(this.creature, creatureHealth).then(() => {
      this.creature.creatureHealth = creatureHealth;
    }));

    //update conditions
    const creatureConditions = new CreatureConditions();
    creatureConditions.activeConditions = this.calculatorState.activeConditions;
    promises.push(this.creatureService.updateConditions(this.creature.id, creatureConditions).then((activeConditions: ActiveCondition[]) => {
      this.creature.activeConditions = activeConditions;
    }));

    if (this.calculatorState.failedConcentration && this.calculatorState.concentratingSpell != null) {
      promises.push(this.creatureService.loseConcentration(this.creature, this.calculatorState.concentratingSpell).then(() => {
        this.calculatorState.concentratingSpell = null;
      }));
    }

    const self = this;
    return Promise.all(promises).then(function () {
      self.eventsService.dispatchEvent(EVENTS.HpUpdated);

      if (close) {
        self.save.emit();
      } else {
        self.initializeValues();
      }
    });
  }
}
