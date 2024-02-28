import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EncounterMonsterGroup} from '../../../shared/models/campaigns/encounters/encounter-monster-group';
import {HealthCalculationType} from '../../../shared/models/creatures/characters/health-calculation-type.enum';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {AbilityService} from '../../../core/services/attributes/ability.service';
import {Encounter} from '../../../shared/models/campaigns/encounters/encounter';
import {EncounterMonster} from '../../../shared/models/campaigns/encounters/encounter-monster';
import * as _ from 'lodash';
import {MonsterService} from '../../../core/services/creatures/monster.service';
import {ConfirmDialogData} from '../../../core/components/confirm-dialog/confirmDialogData';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../core/components/confirm-dialog/confirm-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {EncounterService} from '../../../core/services/encounter.service';
import {NotificationService} from '../../../core/services/notification.service';
import {Monster} from '../../../shared/models/creatures/monsters/monster';
import {
  ENCOUNTER_MONSTER_USE_LOCAL_ROLL
} from '../encounter-configure-slide-in/encounter-configure-slide-in.component';
import {EncounterMonsterGroupConfiguration} from '../../../shared/models/combat-row';

export class EditingEncounterMonsterGroup {
  group: EncounterMonsterGroupConfiguration;
  originalQuantity: number;
  originalGroupedInitiative: boolean;
}

export class EncounterMonsterConfiguration {
  encounterMonster: EncounterMonster;
  minRound = 1;
}

@Component({
  selector: 'app-encounter-monster-group-configure-slide-in',
  templateUrl: './encounter-monster-group-configure-slide-in.component.html',
  styleUrls: ['./encounter-monster-group-configure-slide-in.component.scss']
})
export class EncounterMonsterGroupConfigureSlideInComponent implements OnInit {
  @Input() encounter: Encounter;
  @Input() group: EncounterMonsterGroupConfiguration;
  @Output() save = new EventEmitter<EditingEncounterMonsterGroup>();
  @Output() close = new EventEmitter();
  @Output() remove = new EventEmitter();

  loading = false;
  quantity = 0;
  hpCalculation = '';
  maxHp = 0;
  averageHp = 0;
  hpDisabled = false;
  calculationTypes: HealthCalculationType[] = [];
  healthCalculationType: HealthCalculationType = HealthCalculationType.ROLL;
  groupedHp = false;
  groupedInitiative = false;
  monsters: EncounterMonsterConfiguration[] = [];
  monster: Monster = null;
  minRound = 1;
  originalQuantity = 0;

  constructor(
    private abilityService: AbilityService,
    private monsterService: MonsterService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private encounterService: EncounterService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.quantity = this.group.group.quantity;
    this.minRound = this.encounter.currentRound;
    if (this.minRound == null || this.minRound === 0) {
      this.minRound = 1;
    }
    this.originalQuantity = this.group.originalQuantity;
    this.initializeMonsters();
    this.initializeHp();
    this.initializeCalculationTypes();
    this.groupedHp = this.group.group.groupedHp;
    this.groupedInitiative = this.group.group.groupedInitiative;
    this.monsterService.getMonster(this.group.group.monster.id).then((monster: Monster) => {
      this.monster = monster;
    });
  }

  private initializeMonsters(): void {
    this.monsters = [];
    this.group.group.monsters.forEach((encounterMonster: EncounterMonster) => {
      const config = new EncounterMonsterConfiguration();
      config.encounterMonster = _.cloneDeep(encounterMonster);
      this.monsters.push(config);
    });
    this.initializeMins();
  }

  private initializeMins(): void {
    let previousMonster: EncounterMonsterConfiguration = null;
    this.monsters.forEach((config: EncounterMonsterConfiguration) => {
      if (previousMonster != null) {
        config.minRound = previousMonster.encounterMonster.roundAdded;
        if (config.encounterMonster.monsterNumber > this.originalQuantity && config.minRound < this.minRound) {
          config.minRound = this.minRound;
        }
      } else {
        config.minRound = this.encounter.currentRound;
        if (config.minRound == null || config.minRound < 1) {
          config.minRound = 1;
        }
      }
      previousMonster = config;
    });
  }

  private initializeHp(): void {
    this.hpCalculation = this.monsterService.getHpDisplay(this.group.group.monster);
    this.maxHp = this.group.calculatedMaxHp;
    this.averageHp = this.group.calculatedAverageHp;
  }

  private initializeCalculationTypes(): void {
    this.calculationTypes = [];
    this.calculationTypes.push(HealthCalculationType.ROLL);
    this.calculationTypes.push(HealthCalculationType.MAX);
    this.calculationTypes.push(HealthCalculationType.AVERAGE);
    this.calculationTypeChange(this.group.group.healthCalculationType);
  }

  saveClick(): void {
    const editingGroup = new EditingEncounterMonsterGroup();
    editingGroup.group = this.group;
    editingGroup.originalQuantity = this.group.group.quantity;
    editingGroup.originalGroupedInitiative = this.group.group.groupedInitiative;

    this.group.group.quantity = this.quantity;
    this.group.group.groupedHp = this.groupedHp;
    this.group.group.groupedInitiative = this.groupedInitiative;
    this.group.group.healthCalculationType = this.healthCalculationType;
    this.mergeMonsters();
    this.save.emit(editingGroup);
  }

  private mergeMonsters(): void {
    this.monsters.forEach((config: EncounterMonsterConfiguration, index: number) => {
      if (this.group.group.monsters.length > index) {
        const original = this.group.group.monsters[index];
        original.initiative = config.encounterMonster.initiative;
        original.monsterNumber = config.encounterMonster.monsterNumber;
        original.roundAdded = config.encounterMonster.roundAdded;
        original.hp = config.encounterMonster.hp;
      } else {
        this.group.group.monsters.push(config.encounterMonster);
      }
    });

    const amountRemoved = this.group.group.monsters.length - this.monsters.length;
    if (amountRemoved > 0) {
      for (let i = 0; i < amountRemoved; i++) {
        this.group.group.monsters.splice(this.group.group.monsters.length - 1, 1);
      }
    }
  }

  closeDetails(): void {
    this.close.emit();
  }

  private getUpdatedGroup(includeDisabled: boolean = true): EncounterMonsterGroupConfiguration {
    const group = new EncounterMonsterGroup();
    group.monster = this.group.group.monster;
    group.quantity = this.quantity;
    group.healthCalculationType = this.healthCalculationType;
    group.groupedHp = this.groupedHp;
    group.groupedInitiative = this.groupedInitiative;
    group.monsters = this.getMonsters(includeDisabled);

    const config = new EncounterMonsterGroupConfiguration(group);
    config.calculatedAverageHp = this.group.calculatedAverageHp
    config.calculatedMaxHp = this.group.calculatedMaxHp;
    config.originalQuantity = this.group.originalQuantity;
    return config;
  }

  private getMonsters(includeDisabled: boolean = true): EncounterMonster[] {
    if (includeDisabled) {
      return this.monsters.map(config => config.encounterMonster);
    } else {
      return _.filter(this.monsters, (config: EncounterMonsterConfiguration) => {
        return config.encounterMonster.monsterNumber > this.originalQuantity;
      }).map(monster => monster.encounterMonster);
    }
  }

  roll(): void {
    this.loading = true;
    this.encounterService.rollEncounterGroup(this.getUpdatedGroup(true), true, ENCOUNTER_MONSTER_USE_LOCAL_ROLL).then(() => {
      this.loading = false;
    }, () => {
      this.loading = false;
      this.notificationService.error(this.translate.instant('Encounter.Roll.Error'));
    });
  }

  removeGroup(): void {
    if (this.group.disabled) {
      return;
    }
    const self = this;
    const data = new ConfirmDialogData();
    data.title = this.translate.instant('Encounter.Group.Remove.Title');
    data.message = this.translate.instant('Encounter.Group.Remove.Confirmation');
    data.confirm = () => {
      self.continueRemoveGroup();
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ConfirmDialogComponent, dialogConfig);
  }

  private continueRemoveGroup(): void {
    this.remove.emit(this.group);
    this.close.emit();
  }

  quantityChange(input): void {
    const originalQuantity = this.quantity;
    this.quantity = parseInt(input.value, 10);

    let roundToAdd = this.encounter.currentRound;
    if (this.monsters.length > 0) {
      roundToAdd = this.monsters[this.monsters.length - 1].encounterMonster.roundAdded;
    }
    if (roundToAdd == null || roundToAdd < 1) {
      roundToAdd = 1;
    }
    if (roundToAdd < this.minRound) {
      roundToAdd = this.minRound;
    }

    if (this.quantity > originalQuantity) {
      for (let i = originalQuantity; i < this.quantity; i++) {
        const encounterMonster = new EncounterMonster();
        encounterMonster.monsterNumber = i + 1;
        encounterMonster.roundAdded = roundToAdd;
        encounterMonster.hp = this.getHpValue();
        encounterMonster.initiative = this.getInitiativeValue();
        encounterMonster.initiativeTooltip = `${encounterMonster.initiative - this.group.calculatedInitiativeModifier} + ${this.group.calculatedInitiativeModifier}`;

        const config = new EncounterMonsterConfiguration();
        config.encounterMonster = encounterMonster;
        config.minRound = this.minRound;
        this.monsters.push(config);
      }

      this.initializeMins();
    } else if (this.quantity < originalQuantity) {
      this.monsters.splice(this.quantity, originalQuantity - this.quantity);
    }
  }

  private getHpValue(): number {
    let hp = 0;
    if (this.healthCalculationType === HealthCalculationType.AVERAGE) {
      hp = this.averageHp;
    } else if (this.healthCalculationType === HealthCalculationType.MAX) {
      hp = this.maxHp;
    } else if (this.groupedHp && this.monsters.length > 0) {
      hp = this.monsters[0].encounterMonster.hp;
    }
    return hp;
  }

  private getInitiativeValue(): number {
    let initiative = 0;
    if (this.groupedInitiative && this.monsters.length > 0) {
      initiative = this.monsters[0].encounterMonster.initiative;
    }
    return initiative;
  }

  calculationTypeChange(calculationType: HealthCalculationType): void {
    this.healthCalculationType = calculationType;
    this.hpDisabled = this.healthCalculationType !== HealthCalculationType.ROLL;
    if (this.healthCalculationType === HealthCalculationType.MAX) {
      this.setHpValues(this.maxHp);
    } else if (this.healthCalculationType === HealthCalculationType.AVERAGE) {
      this.setHpValues(this.averageHp);
    }
  }

  private setHpValues(value: number): void {
    this.monsters.forEach((config: EncounterMonsterConfiguration) => {
      config.encounterMonster.hp = value;
    });
  }

  private setInitiativeValues(value: number): void {
    this.monsters.forEach((config: EncounterMonsterConfiguration) => {
      config.encounterMonster.initiative = value;
      config.encounterMonster.initiativeTooltip = `${config.encounterMonster.initiative - this.group.calculatedInitiativeModifier} + ${this.group.calculatedInitiativeModifier}`;
    });
  }

  groupedHpChange(event: MatCheckboxChange): void {
    this.groupedHp = event.checked;
    if (this.groupedHp && this.monsters.length > 0) {
      this.setHpValues(this.monsters[0].encounterMonster.hp);
    }
  }

  groupedInitiativeChange(event: MatCheckboxChange): void {
    this.groupedInitiative = event.checked;
    if (this.groupedInitiative && this.monsters.length > 0) {
      this.setInitiativeValues(this.monsters[0].encounterMonster.initiative);
    }
  }

  hpChange(input, config: EncounterMonsterConfiguration): void {
    config.encounterMonster.hp = parseInt(input.value, 10);
    if (this.groupedHp) {
      this.setHpValues(config.encounterMonster.hp);
    }
  }

  initiativeChange(input, config: EncounterMonsterConfiguration): void {
    config.encounterMonster.initiative = parseInt(input.value, 10);
    config.encounterMonster.initiativeTooltip = `${config.encounterMonster.initiative - this.group.calculatedInitiativeModifier} + ${this.group.calculatedInitiativeModifier}`;
    if (this.groupedInitiative) {
      this.setInitiativeValues(config.encounterMonster.initiative);
    }
  }

  roundChange(input, config: EncounterMonsterConfiguration): void {
    const originalValue = config.encounterMonster.roundAdded;
    config.encounterMonster.roundAdded = parseInt(input.value, 10);
    this.updateRounds(config, originalValue);
    this.initializeMins();
  }

  private updateRounds(startingAt: EncounterMonsterConfiguration, originalValue: number): void {
    const monsterNumber = startingAt.encounterMonster.monsterNumber;
    const newRound = startingAt.encounterMonster.roundAdded;
    this.monsters.forEach((config: EncounterMonsterConfiguration) => {
      if (config.encounterMonster.monsterNumber > monsterNumber && config.encounterMonster.roundAdded === originalValue) {
        config.encounterMonster.roundAdded = newRound;
      }
    });
  }
}
