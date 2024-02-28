import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DangerZoneConfirmationComponent } from './danger-zone-confirmation.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app.module';
import {HttpClient} from '@angular/common/http';
import {CoreModule} from '../../core.module';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBarModule} from '@angular/material';
import {NotificationService} from '../../services/notification.service';
import {DangerZoneData} from './danger-zone-data';

describe('DangerZoneConfirmationComponent', () => {
  let component: DangerZoneConfirmationComponent;
  let fixture: ComponentFixture<DangerZoneConfirmationComponent>;
  let dialogRef: MatDialogRef<DangerZoneConfirmationComponent>;
  let notificationService: NotificationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {close: () => {}} }
      ],
      imports: [
        CoreModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DangerZoneConfirmationComponent);
    dialogRef = TestBed.get(MatDialogRef);
    notificationService = TestBed.get(NotificationService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should error if the password is blank', () => {
    component.dangerZoneForm.controls['password'].setErrors({'incorrect': true});
    const spy = spyOn(notificationService, 'error').and.stub();
    component.confirm();
    expect(spy).toHaveBeenCalledWith('Auth.Password.Error.PasswordRequired');
  });

  it('should perform the confirm function', () => {
    component.dangerZoneForm.controls['password'].setErrors(null);
    const data = new DangerZoneData();
    data.confirm = () => {};
    component.data = data;
    const spy = spyOn(data, 'confirm').and.stub();
    component.confirm();
    expect(spy).toHaveBeenCalled();
  });

  it('should close the dialog ref', () => {
    const spy = spyOn(dialogRef, 'close').and.stub();
    component.cancel();
    expect(spy).toHaveBeenCalled();
  });
});
