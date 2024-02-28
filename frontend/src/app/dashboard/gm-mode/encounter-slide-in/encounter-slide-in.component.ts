import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Encounter} from '../../../shared/models/campaigns/encounters/encounter';
import {Campaign} from '../../../shared/models/campaigns/campaign';
import {MonsterSummary} from '../../../shared/models/creatures/monsters/monster-summary';
import {EncounterMonsterGroup} from '../../../shared/models/campaigns/encounters/encounter-monster-group';
import {MonsterService} from '../../../core/services/creatures/monster.service';
import {EncounterService} from '../../../core/services/encounter.service';
import {DuplicateItemData} from '../../../core/components/duplicate-item/duplicateItemData';
import {DuplicateItemComponent} from '../../../core/components/duplicate-item/duplicate-item.component';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ButtonAction} from '../../../shared/models/button/button-action';
import {ConfirmDialogData} from '../../../core/components/confirm-dialog/confirmDialogData';
import {ConfirmDialogComponent} from '../../../core/components/confirm-dialog/confirm-dialog.component';
import {NotificationService} from '../../../core/services/notification.service';
import {EncounterSummary} from '../encounter-summary/encounter-summary.component';
import {EncounterCharacter} from '../../../shared/models/campaigns/encounters/encounter-character';
import {CharacterLevelService} from '../../../core/services/character-level.service';
import {Monster} from '../../../shared/models/creatures/monsters/monster';
import {SKIP_LOCATION_CHANGE} from '../../../constants';
import {Router} from '@angular/router';
import {
  EncounterCharacterConfiguration,
  EncounterMonsterGroupConfiguration,
  InitiativeOrderObject, InitiativeSimpleObject
} from '../../../shared/models/combat-row';
import {EncounterCreature} from '../../../shared/models/campaigns/encounters/encounter-creature';

export class EncounterMonsterGroupRemaining {
  monster: MonsterSummary;
  total = 0;
  remaining = 0;
}

@Component({
  selector: 'app-encounter-slide-in',
  templateUrl: './encounter-slide-in.component.html',
  styleUrls: ['./encounter-slide-in.component.scss']
})
export class EncounterSlideInComponent implements OnInit {
  @Input() encounter: Encounter;
  @Input() campaign: Campaign;
  @Input() startImmediately = false;
  @Output() close = new EventEmitter();
  @Output() start = new EventEmitter();
  @Output() finish = new EventEmitter();
  @Output() duplicate = new EventEmitter();
  @Output() save = new EventEmitter<string>();
  @Output() delete = new EventEmitter();

  loading = false;

  step = 0;
  headerName = '';
  editing = false;
  starting = false;

  startedAt = '';
  lastPlayedAt = '';
  finishedAt = '';
  encounterSummary: EncounterSummary = null;

  monsterCount = 0;
  primaryActions: ButtonAction[] = [];
  tertiaryActions: ButtonAction[] = [];

  viewingMonster: Monster = null;
  displayTurn = 0;

  constructor(
    private monsterService: MonsterService,
    private encounterService: EncounterService,
    private dialog: MatDialog,
    private router: Router,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private characterLevelService: CharacterLevelService
  ) { }

  ngOnInit() {
    this.initializeData();
    this.initializeActions();
    this.displayTurn = this.getDisplayTurn();

    if (this.startImmediately) {
      this.startClick();
    }
  }

  private initializeData(): void {
    this.loading = true;
    this.initializeMonsterCount();
    this.initializeSummary();

    this.startedAt = this.getDate(this.encounter.startedAt);
    this.lastPlayedAt = this.getDate(this.encounter.lastPlayedAt);
    this.finishedAt = this.getDate(this.encounter.finishedAt);

    this.loading = false;
  }

  private initializeMonsterCount(): void {
    this.monsterCount = 0;
    this.encounter.encounterMonsterGroups.forEach((group: EncounterMonsterGroup) => {
      this.monsterCount += group.monsters.length;
    });
  }

  private initializeActions(): void {
    const self = this;
    this.primaryActions = [];
    if (this.startedAt === '') {
      const startBtn = new ButtonAction('START', self.translate.instant('Start'), () => {
        self.startClick();
      });
      this.primaryActions.push(startBtn);
    } else {
      if (this.finishedAt === '') {
        const continueBtn = new ButtonAction('CONTINUE', self.translate.instant('Resume'), () => {
          self.continueClick();
        });
        this.primaryActions.push(continueBtn);
      }

      const restartBtn = new ButtonAction('RESTART', self.translate.instant('Restart'), () => {
        self.restartClick();
      });
      this.primaryActions.push(restartBtn);

      if (this.finishedAt === '') {
        const finishBtn = new ButtonAction('FINISH', self.translate.instant('Finish'), () => {
          self.finishClick();
        });
        this.primaryActions.push(finishBtn);
      }
    }

    if (this.startedAt === '' || this.finishedAt !== '') {
      this.tertiaryActions = [];
      const editBtn = new ButtonAction('EDIT', self.translate.instant('Edit'), () => {
        self.configure();
      });
      this.tertiaryActions.push(editBtn);

      const duplicateBtn = new ButtonAction('DUPLICATE', self.translate.instant('Duplicate'), () => {
        self.duplicateClick();
      });
      this.tertiaryActions.push(duplicateBtn);

      const deleteBtn = new ButtonAction('DELETE', self.translate.instant('Delete'), () => {
        self.deleteClick();
      });
      this.tertiaryActions.push(deleteBtn);
    }
  }

  private initializeSummary(): void {
    const characters = this.getCharacters();
    const groups = this.getGroups();
    this.encounterSummary = this.encounterService.getEncounterSummary(characters, groups);
  }

  private getCharacters(): EncounterCharacterConfiguration[] {
    const characters: EncounterCharacterConfiguration[] = [];
    this.encounter.encounterCharacters.forEach((encounterCharacter: EncounterCharacter) => {
      const config = new EncounterCharacterConfiguration();
      config.selected = true;
      config.encounterCharacter = encounterCharacter;
      config.level = this.getCharacterLevel(encounterCharacter.character.characterExp);
      characters.push(config);
    });

    return characters;
  }

  private getGroups(): EncounterMonsterGroupConfiguration[] {
    const groups: EncounterMonsterGroupConfiguration[] = [];
    this.encounter.encounterMonsterGroups.forEach((group: EncounterMonsterGroup) => {
      const config = new EncounterMonsterGroupConfiguration(group);
      groups.push(config);
    });
    return groups;
  }

  private getCharacterLevel(exp: number): number {
    const level = this.characterLevelService.getLevelByExpInstant(exp);
    if (level != null) {
      return parseInt(level.name, 10);
    }
    return 0;
  }

  private getDate(timestamp) {
    if (timestamp == null || timestamp === 0) {
      return '';
    }
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return (month + 1) + '/' + day + '/' + year;
  }

  configure(): void {
    this.editing = true;
  }

  startClick(): void {
    this.starting = true;
  }

  continueClick(): void {
    this.encounterService.continueEncounter(this.encounter.id).then(() => {
      this.navigateToEncounter();
    });
  }

  private navigateToEncounter(): void {
    this.router.navigate(['/home/dashboard', {outlets: {
        'middle-nav': ['encounters', this.encounter.id],
        'side-nav': ['encounters', this.encounter.id]
      }}], {skipLocationChange: SKIP_LOCATION_CHANGE, queryParams: {'public': false, 'shared': false}});
  }

  restartClick(): void {
    const self = this;
    const data = new ConfirmDialogData();
    data.title = this.translate.instant('Encounter.Restart.Title');
    data.message = this.translate.instant('Encounter.Restart.Message');
    data.confirm = () => {
      self.continueRestart();
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ConfirmDialogComponent, dialogConfig);
  }

  private continueRestart(): void {
    this.loading = true;
    this.encounterService.restartEncounter(this.encounter.id).then(() => {
      this.loading = false;
      this.navigateToEncounter();
    }, () => {
      this.loading = false;
      this.notificationService.error(this.translate.instant('Encounter.Restart.Error'));
    });
  }

  finishClick(): void {
    const self = this;
    const data = new ConfirmDialogData();
    data.title = this.translate.instant('Encounter.Finish.Title');
    data.message = this.translate.instant('Encounter.Finish.Message');
    data.confirm = () => {
      self.continueFinish();
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ConfirmDialogComponent, dialogConfig);
  }

  private continueFinish(): void {
    this.encounterService.finishEncounter(this.encounter.id).then(() => {
      this.finish.emit();
      this.encounterService.getEncounter(this.encounter.id).then((encounter: Encounter) => {
        this.encounter = encounter;
        this.initializeData();
        this.initializeActions();
      });
    }, () => {
      this.notificationService.error(this.translate.instant('Encounter.Finish.Error'));
    });
  }

  duplicateClick(): void {
    const self = this;
    const data = new DuplicateItemData();
    data.message = this.translate.instant('Navigation.Manage.DuplicateMessage');
    data.defaultName = this.encounter.name + ' (Copy)';
    data.confirm = (name: string) => {
      self.continueDuplicate(name);
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(DuplicateItemComponent, dialogConfig);
  }

  private continueDuplicate(name: string): void {
    this.loading = true;
    this.encounterService.duplicateEncounter(this.encounter.id, this.campaign.id, name).then((id: string) => {
      this.loading = false;
      this.duplicate.emit();
    });
  }

  closeClick(): void {
    this.close.emit();
  }

  cancelClick(): void {
    this.editing = false;
    this.starting = false;
  }

  saveClick(encounterId: string): void {
    if (this.starting) {
      this.starting = false;
    } else {
      this.editing = false;
      this.initializeData();
      this.save.emit(null);
    }
  }

  startEncounterClick(): void {
    this.starting = false;
    this.editing = false;

    this.loading = true;
    this.encounterService.startEncounter(this.encounter.id).then(() => {
      this.loading = false;
      this.continueClick();
    }, () => {
      this.loading = false;
      this.notificationService.error(this.translate.instant('Encounter.Start.Error'));
    });
  }

  deleteClick(): void {
    const self = this;
    const data = new ConfirmDialogData();
    data.title = this.translate.instant('Encounter.Delete.Title');
    data.message = this.translate.instant('Encounter.Delete.Confirmation');
    data.confirm = () => {
      self.continueDelete();
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ConfirmDialogComponent, dialogConfig);
  }

  private continueDelete(): void {
    this.loading = true;
    this.encounterService.deleteEncounter(this.encounter.id).then(() => {
      this.loading = false;
      this.delete.emit();
    }, () => {
      this.notificationService.error(this.translate.instant('Encounter.Delete.Error'));
      this.loading = false;
    });
  }

  monsterGroupClick(group: EncounterMonsterGroup): void {
    this.monsterClick(group.monster.id);
  }

  private monsterClick(monsterId: string): void {
    this.loading = true;
    this.monsterService.getMonster(monsterId).then((monster: Monster) => {
      this.viewingMonster = monster;
      this.loading = false;
    });
  }

  monsterClose(): void {
    this.viewingMonster = null;
  }

  private getDisplayTurn(): number {
    let temp = 0;
    let displayTurn = 0;
    let index = 0;
    const initiativeList = this.encounterService.getSimpleInitiativeList(this.encounter);
    while (temp < this.encounter.currentTurn) {
      const init: InitiativeSimpleObject = initiativeList[index];
      if (init.roundAdded <= this.encounter.currentRound) {
        displayTurn++;
      }
      temp += init.creatureCount;
      index++;
    }
    for (let i = 0; i < this.encounter.currentTurn; i++) {
    }
    return displayTurn;
  }
}
