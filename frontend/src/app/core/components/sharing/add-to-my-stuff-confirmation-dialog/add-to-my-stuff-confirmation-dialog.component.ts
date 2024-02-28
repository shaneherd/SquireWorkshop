import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EventsService} from '../../../services/events.service';
import {EVENTS} from '../../../../constants';
import {AddToMyStuffConfirmationDialogData} from './add-to-my-stuff-confirmation-dialog-data';

@Component({
  selector: 'app-add-to-my-stuff-confirmation-dialog',
  templateUrl: './add-to-my-stuff-confirmation-dialog.component.html',
  styleUrls: ['./add-to-my-stuff-confirmation-dialog.component.scss']
})
export class AddToMyStuffConfirmationDialogComponent implements OnInit, OnDestroy {
  data: AddToMyStuffConfirmationDialogData;
  eventSub: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public d: AddToMyStuffConfirmationDialogData,
    private dialogRef: MatDialogRef<AddToMyStuffConfirmationDialogComponent>,
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
