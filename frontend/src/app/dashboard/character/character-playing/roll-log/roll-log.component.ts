import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {EventsService} from '../../../../core/services/events.service';
import {TranslateService} from '@ngx-translate/core';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {Roll} from '../../../../shared/models/rolls/roll';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {RollType} from '../../../../shared/models/rolls/roll-type.enum';
import {RollResultDialogComponent} from '../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog.component';
import {Subscription} from 'rxjs';
import {RollResultDialogData} from '../../../../core/components/roll-results/roll-result-dialog/roll-result-dialog-data';

@Component({
  selector: 'app-roll-log',
  templateUrl: './roll-log.component.html',
  styleUrls: ['./roll-log.component.scss']
})
export class RollLogComponent implements OnInit, OnDestroy {
  loading = false;
  eventSub: Subscription;
  @Input() playerCharacter: PlayerCharacter;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter();

  rolls: Roll[] = [];

  constructor(
    private dialog: MatDialog,
    private eventsService: EventsService,
    private translate: TranslateService,
    private creatureService: CreatureService
  ) { }

  ngOnInit() {
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === this.eventsService.REFRESH_ROLL_LOG) {
        this.initializeRolls();
      }
    });

    this.initializeRolls();
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeRolls(): void {
    this.creatureService.getRollLog(this.playerCharacter).then((rolls: Roll[]) => {
      this.rolls = rolls;
    });
  }

  rollClick(roll: Roll): void {
    this.creatureService.getRoll(this.playerCharacter, roll).then((details: Roll) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = new RollResultDialogData(this.playerCharacter, details);
      this.dialog.open(RollResultDialogComponent, dialogConfig);
    });
  }

  continueClick(): void {
    this.creatureService.archiveAll(this.playerCharacter).then(() => {
      this.cancelClick();
    });
  }

  cancelClick(): void {
    this.close.emit();
  }

  getLabel(roll: Roll): string {
    switch (roll.rollType) {
      case RollType.SAVE:
        return this.translate.instant('Labels.DC');
      case RollType.HEAL:
        return '';
      case RollType.ATTACK:
        return this.translate.instant('Labels.Attack');
      case RollType.DAMAGE:
        return this.translate.instant('Labels.Damage');
      case RollType.STANDARD:
      default:
        return this.translate.instant('Labels.Result');
    }
  }

  getDamageLabel(roll: Roll): string {
    switch (roll.rollType) {
      case RollType.HEAL:
        return this.translate.instant('Labels.Healing');
      case RollType.STANDARD:
      case RollType.ATTACK:
      case RollType.SAVE:
      case RollType.DAMAGE:
      default:
        return this.translate.instant('Labels.Damage');
    }
  }
}
