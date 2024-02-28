import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {YesNoDialogData} from './yes-no-dialog-data';
import {EVENTS} from '../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../services/events.service';

@Component({
  selector: 'app-yes-no-dialog',
  templateUrl: './yes-no-dialog.component.html',
  styleUrls: ['./yes-no-dialog.component.scss']
})
export class YesNoDialogComponent implements OnInit, OnDestroy {
  data: any;
  eventSub: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public d: YesNoDialogData,
    private eventsService: EventsService,
    private dialogRef: MatDialogRef<YesNoDialogComponent>
  ) {
    this.data = d;
  }

  ngOnInit() {
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.Logout) {
        this.dialogRef.close();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  yes(): void {
    if (this.data.yes != null) {
      this.data.yes();
    }
    this.dialogRef.close();
  }

  no(): void {
    if (this.data.no != null) {
      this.data.no();
    }
    this.dialogRef.close();
  }

  cancel(): void {
    this.data.cancel();
    this.dialogRef.close();
  }
}
