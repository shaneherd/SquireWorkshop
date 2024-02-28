import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordComponent } from './forgot-password.component';
import {AuthenticationModule} from '../authentication.module';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {NotificationService} from '../../core/services/notification.service';
import {AuthenticationService} from '../authentication.service';
import {FormBuilder} from '@angular/forms';
import {of, throwError} from 'rxjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

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
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);

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
    component.forgotPasswordForm.controls['email'].setErrors({'incorrect': true});
    component.forgotPasswordForm.controls['recaptcha'].setErrors(null);
    expect(component.forgotPasswordForm.valid).toBeFalsy();
    const spy = spyOn(authenticationService, 'forgotPassword').and.stub();
    component.submit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not submit when the recaptcha is blank', () => {
    component.forgotPasswordForm.controls['email'].setErrors(null);
    component.forgotPasswordForm.controls['recaptcha'].setErrors({'incorrect': true});
    expect(component.forgotPasswordForm.valid).toBeFalsy();
    const spy = spyOn(authenticationService, 'forgotPassword').and.stub();
    component.submit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should submit when the form is valid', () => {
    component.forgotPasswordForm.controls['email'].setErrors(null);
    component.forgotPasswordForm.controls['recaptcha'].setErrors(null);
    expect(component.forgotPasswordForm.valid).toBeTruthy();
    const spy = spyOn(authenticationService, 'forgotPassword').and.returnValue(of('success'));
    spyOn(router, 'navigate').and.stub();
    spyOn(notificationService, 'error').and.stub();
    component.submit();
    expect(spy).toHaveBeenCalled();
  });

  it('should error with Unknown Error', () => {
    component.forgotPasswordForm.controls['email'].setErrors(null);
    component.forgotPasswordForm.controls['recaptcha'].setErrors(null);
    const error = {error: {value: 'other'}};
    spyOn(authenticationService, 'forgotPassword').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.submit();
    expect(spy).toHaveBeenCalledWith('Error.Unknown');
  });

  it('should error with Invalid email', () => {
    component.forgotPasswordForm.controls['email'].setErrors(null);
    component.forgotPasswordForm.controls['recaptcha'].setErrors(null);
    const error = {error: 'Invalid email'};
    spyOn(authenticationService, 'forgotPassword').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.submit();
    expect(spy).toHaveBeenCalledWith('Auth.Error.InvalidEmail');
  });

  it('should error with the message supplied', () => {
    component.forgotPasswordForm.controls['email'].setErrors(null);
    component.forgotPasswordForm.controls['recaptcha'].setErrors(null);
    const error = {error: 'message supplied'};
    spyOn(authenticationService, 'forgotPassword').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.submit();
    expect(spy).toHaveBeenCalledWith(error.error);
  });
});
