import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DuplicateItemData} from './duplicateItemData';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from '../../services/notification.service';
import {EVENTS} from '../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../services/events.service';

@Component({
  selector: 'app-duplicate-item',
  templateUrl: './duplicate-item.component.html',
  styleUrls: ['./duplicate-item.component.scss']
})
export class DuplicateItemComponent implements OnInit, OnDestroy {
  public duplicateItemForm: FormGroup;
  public data: DuplicateItemData;
  eventSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DuplicateItemComponent>,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private eventsService: EventsService,
    @Inject(MAT_DIALOG_DATA) public d: DuplicateItemData) {
    this.data = d;
  }

  ngOnInit() {
    this.duplicateItemForm = this.createDuplicateItemForm();
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.Logout) {
        this.dialogRef.close();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  createDuplicateItemForm(): FormGroup {
    return this.fb.group(
      {
        name: [this.data.defaultName, Validators.compose([Validators.required])]
      }
    );
  }

  confirm(): void {
    if (this.duplicateItemForm.valid) {
      this.data.confirm(this.duplicateItemForm.value.name);
      this.dialogRef.close();
    } else {
      this.notificationService.error(this.translate.instant('Error.NameRequired'));
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
