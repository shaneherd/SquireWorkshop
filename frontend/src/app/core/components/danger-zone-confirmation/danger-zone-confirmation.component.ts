import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DangerZoneData} from './danger-zone-data';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {EVENTS} from '../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../services/events.service';

@Component({
  selector: 'app-danger-zone-confirmation',
  templateUrl: './danger-zone-confirmation.component.html',
  styleUrls: ['./danger-zone-confirmation.component.scss']
})
export class DangerZoneConfirmationComponent implements OnInit, OnDestroy {
  public dangerZoneForm: FormGroup;
  public data: DangerZoneData;
  eventSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DangerZoneConfirmationComponent>,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private eventsService: EventsService,
    @Inject(MAT_DIALOG_DATA) public d: DangerZoneData) {
    this.data = d;
  }

  ngOnInit() {
    this.dangerZoneForm = this.createDangerZoneForm();
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.Logout) {
        this.dialogRef.close();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  createDangerZoneForm(): FormGroup {
    return this.fb.group(
      {
        password: [null, Validators.compose([Validators.required])]
      }
    );
  }

  confirm(): void {
    if (this.dangerZoneForm.valid) {
      this.data.confirm(this.dangerZoneForm.value.password);
      this.dialogRef.close();
    } else {
      this.notificationService.error(this.translate.instant('Auth.Password.Error.PasswordRequired'));
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
