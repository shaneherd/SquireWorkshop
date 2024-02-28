import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {EventsService} from '../../services/events.service';
import {EVENTS} from '../../../constants';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotificationDialogData} from './notification-dialog-data';

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent implements OnInit, OnDestroy {
  data: NotificationDialogData;
  eventSub: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public d: NotificationDialogData,
    private dialogRef: MatDialogRef<NotificationDialogComponent>,
    private eventsService: EventsService
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

  confirm(): void {
    this.data.confirm();
    this.dialogRef.close();
  }
}
