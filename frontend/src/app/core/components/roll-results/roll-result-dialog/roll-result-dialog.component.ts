import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Roll} from '../../../../shared/models/rolls/roll';
import {RollType} from '../../../../shared/models/rolls/roll-type.enum';
import {CreatureService} from '../../../services/creatures/creature.service';
import {EventsService} from '../../../services/events.service';
import {Creature} from '../../../../shared/models/creatures/creature';
import {RollResultDialogData} from './roll-result-dialog-data';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {EVENTS} from '../../../../constants';
import {Subscription} from 'rxjs';
import {ConfirmDialogData} from '../../confirm-dialog/confirmDialogData';
import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-roll-result-dialog',
  templateUrl: './roll-result-dialog.component.html',
  styleUrls: ['./roll-result-dialog.component.scss']
})
export class RollResultDialogComponent implements OnInit, OnDestroy {
  eventSub: Subscription;
  roll: Roll;
  creature: Creature;
  showDetails = false;
  standard = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RollResultDialogData,
    private creatureService: CreatureService,
    private eventsService: EventsService,
    private dialogRef: MatDialogRef<RollResultDialogComponent>,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {
    this.roll = data.roll;
    this.creature = data.creature;
  }

  ngOnInit() {
    this.standard = this.roll.rollType === RollType.STANDARD;
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.Logout) {
        this.dialogRef.close();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  archive(): void {
    const self = this;
    const data = new ConfirmDialogData();
    data.title = this.translate.instant('RollLog.ConfirmArchive.Title');
    data.message = this.translate.instant('RollLog.ConfirmArchive.Message');
    data.confirm = () => {
      self.creatureService.archive(self.creature, self.roll).then(() => {
        self.eventsService.dispatchEvent(self.eventsService.REFRESH_ROLL_LOG);
        self.close();
      });
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ConfirmDialogComponent, dialogConfig);
  }

  close(): void {
    this.dialogRef.close();
  }
}
