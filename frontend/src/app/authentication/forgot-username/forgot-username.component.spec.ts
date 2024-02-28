import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotUsernameComponent } from './forgot-username.component';
import {AuthenticationModule} from '../authentication.module';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {NotificationService} from '../../core/services/notification.service';
import {AuthenticationService} from '../authentication.service';
import {FormBuilder} from '@angular/forms';
import {of, throwError} from 'rxjs';

describe('ForgotUsernameComponent', () => {
  let component: ForgotUsernameComponent;
  let fixture: ComponentFixture<ForgotUsernameComponent>;

  let router: Router;
  let notificationService: NotificationService;
  let authenticationService: AuthenticationService;
  let translate: TranslateService;
  let fb: FormBuilder;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AuthenticationModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
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
    fixture = TestBed.createComponent(ForgotUsernameComponent);

    router = TestBed.get(Router);
    notificationService = TestBed.get(NotificationService);
    authenticationService = TestBed.get(AuthenticationService);
    translate = TestBed.get(TranslateService);
    fb = TestBed.get(FormBuilder);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit when the email is blank', () => {
    component.forgotUsernameForm.controls['email'].setErrors({'incorrect': true});
    component.forgotUsernameForm.controls['recaptcha'].setErrors(null);
    expect(component.forgotUsernameForm.valid).toBeFalsy();
    const spy = spyOn(authenticationService, 'forgotUsername').and.stub();
    component.submit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not submit when the recaptcha is blank', () => {
    component.forgotUsernameForm.controls['email'].setErrors(null);
    component.forgotUsernameForm.controls['recaptcha'].setErrors({'incorrect': true});
    expect(component.forgotUsernameForm.valid).toBeFalsy();
    const spy = spyOn(authenticationService, 'forgotUsername').and.stub();
    component.submit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should submit when the form is valid', () => {
    component.forgotUsernameForm.controls['email'].setErrors(null);
    component.forgotUsernameForm.controls['recaptcha'].setErrors(null);
    expect(component.forgotUsernameForm.valid).toBeTruthy();
    const spy = spyOn(authenticationService, 'forgotUsername').and.returnValue(of('success'));
    spyOn(router, 'navigate').and.stub();
    spyOn(notificationService, 'error').and.stub();
    component.submit();
    expect(spy).toHaveBeenCalled();
  });

  it('should error with Unknown Error', () => {
    component.forgotUsernameForm.controls['email'].setErrors(null);
    component.forgotUsernameForm.controls['recaptcha'].setErrors(null);
    const error = {error: {value: 'other'}};
    spyOn(authenticationService, 'forgotUsername').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.submit();
    expect(spy).toHaveBeenCalledWith('Error.Unknown');
  });

  it('should error with Invalid email', () => {
    component.forgotUsernameForm.controls['email'].setErrors(null);
    component.forgotUsernameForm.controls['recaptcha'].setErrors(null);
    const error = {error: 'Invalid email'};
    spyOn(authenticationService, 'forgotUsername').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.submit();
    expect(spy).toHaveBeenCalledWith('Auth.Error.InvalidEmail');
  });

  it('should error with the message supplied', () => {
    component.forgotUsernameForm.controls['email'].setErrors(null);
    component.forgotUsernameForm.controls['recaptcha'].setErrors(null);
    const error = {error: 'message supplied'};
    spyOn(authenticationService, 'forgotUsername').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.submit();
    expect(spy).toHaveBeenCalledWith(error.error);
  });
});
