import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ConfirmDialogData} from './confirmDialogData';
import {EventsService} from '../../services/events.service';
import {EVENTS} from '../../../constants';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  data: any;
  eventSub: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public d: ConfirmDialogData,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
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

  cancel(): void {
    this.dialogRef.close();
  }
}
