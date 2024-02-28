import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EventsService} from '../../services/events.service';
import {EVENTS} from '../../../constants';
import {OkDialogData} from './ok-dialog-data';

@Component({
  selector: 'app-ok-dialog',
  templateUrl: './ok-dialog.component.html',
  styleUrls: ['./ok-dialog.component.scss']
})
export class OkDialogComponent implements OnInit, OnDestroy {
  data: OkDialogData;
  eventSub: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public d: OkDialogData,
    private eventsService: EventsService,
    private dialogRef: MatDialogRef<OkDialogComponent>
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

  close(): void {
    this.dialogRef.close();
  }
}
