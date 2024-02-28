import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {HealthCalculatorState} from '../../../shared/components/health-calculator/health-calculator.component';
import {ConfirmDialogData} from '../../../core/components/confirm-dialog/confirmDialogData';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../core/components/confirm-dialog/confirm-dialog.component';
import * as _ from 'lodash';
import {EncounterService} from '../../../core/services/encounter.service';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from '../../../core/services/notification.service';
import {CombatCreature} from '../../../shared/models/combat-row';

@Component({
  selector: 'app-encounter-health-details-slide-in',
  templateUrl: './encounter-health-details-slide-in.component.html',
  styleUrls: ['./encounter-health-details-slide-in.component.scss']
})
export class EncounterHealthDetailsSlideInComponent implements OnInit, OnDestroy {
  @Input() combatCreature: CombatCreature;
  @Input() killMonsters = false;
  @Output() save = new EventEmitter<CombatCreature>();
  @Output() close = new EventEmitter();

  calculatorState = new HealthCalculatorState();
  maxHP = 0;
  maxHpModifier = 0;
  maxHPTooltip = '';
  quickKill = false;

  keydownListener: any;
  keyCodes = [
    'enter'
  ];

  constructor(
    private dialog: MatDialog,
    private encounterService: EncounterService,
    private translate: TranslateService,
    private notificationService: NotificationService
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
    this.quickKill = this.killMonsters && this.combatCreature.isMonster();
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.keydownListener);
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

  private initializeValues(): void {
    this.maxHP = this.combatCreature.maxHp;
    this.maxHpModifier = this.combatCreature.battleCreature.creature.creatureHealth.maxHpMod;
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

  saveDetails(): void {
    const creatureHealth = _.cloneDeep(this.combatCreature.battleCreature.creature.creatureHealth);
    creatureHealth.currentHp = this.calculatorState.calculatedCurrent;
    creatureHealth.tempHp = this.calculatorState.calculatedTemp;
    creatureHealth.numDeathSaveThrowFailures = this.calculatorState.calculatedDeathSaveFailures;
    creatureHealth.numDeathSaveThrowSuccesses = this.calculatorState.calculatedDeathSaveSuccesses;
    creatureHealth.creatureState = this.calculatorState.calculatedCreatureState;

    this.encounterService.updateHealth(this.combatCreature.battleCreature.creature.id, creatureHealth).then(() => {
      this.combatCreature.battleCreature.creature.creatureHealth = creatureHealth;
      this.combatCreature.currentHp = creatureHealth.currentHp + creatureHealth.tempHp;
      this.save.emit(this.combatCreature);
    }, () => {
      this.notificationService.error(this.translate.instant('Encounter.Health.Error'));
    });
  }

}
