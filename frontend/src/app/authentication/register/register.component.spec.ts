import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import {Router} from '@angular/router';
import {NotificationService} from '../../core/services/notification.service';
import {AuthenticationService} from '../authentication.service';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {FormBuilder} from '@angular/forms';
import {AuthenticationModule} from '../authentication.module';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';
import {of, throwError} from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

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
    fixture = TestBed.createComponent(RegisterComponent);
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

  it('should not submit when the username is invalid', () => {
    component.formRegister.controls['username'].setErrors({'incorrect': true});
    component.formRegister.controls['email'].setErrors(null);
    component.formRegister.controls['password'].setErrors(null);
    component.formRegister.controls['confirmPassword'].setErrors(null);
    component.formRegister.controls['recaptcha'].setErrors(null);
    expect(component.formRegister.valid).toBeFalsy();
    const spy = spyOn(authenticationService, 'register').and.stub();
    component.register();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not submit when the email is invalid', () => {
    component.formRegister.controls['username'].setErrors(null);
    component.formRegister.controls['email'].setErrors({'incorrect': true});
    component.formRegister.controls['password'].setErrors(null);
    component.formRegister.controls['confirmPassword'].setErrors(null);
    component.formRegister.controls['recaptcha'].setErrors(null);
    expect(component.formRegister.valid).toBeFalsy();
    const spy = spyOn(authenticationService, 'register').and.stub();
    component.register();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not submit when the password is invalid', () => {
    component.formRegister.controls['username'].setErrors(null);
    component.formRegister.controls['email'].setErrors(null);
    component.formRegister.controls['password'].setErrors({'incorrect': true});
    component.formRegister.controls['confirmPassword'].setErrors(null);
    component.formRegister.controls['recaptcha'].setErrors(null);
    expect(component.formRegister.valid).toBeFalsy();
    const spy = spyOn(authenticationService, 'register').and.stub();
    component.register();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not submit when the confirmPassword is invalid', () => {
    component.formRegister.controls['username'].setErrors(null);
    component.formRegister.controls['email'].setErrors(null);
    component.formRegister.controls['password'].setErrors(null);
    component.formRegister.controls['confirmPassword'].setErrors({'incorrect': true});
    component.formRegister.controls['recaptcha'].setErrors(null);
    expect(component.formRegister.valid).toBeFalsy();
    const spy = spyOn(authenticationService, 'register').and.stub();
    component.register();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not submit when the recaptcha is invalid', () => {
    component.formRegister.controls['username'].setErrors(null);
    component.formRegister.controls['email'].setErrors(null);
    component.formRegister.controls['password'].setErrors(null);
    component.formRegister.controls['confirmPassword'].setErrors(null);
    component.formRegister.controls['recaptcha'].setErrors({'incorrect': true});
    expect(component.formRegister.valid).toBeFalsy();
    const spy = spyOn(authenticationService, 'register').and.stub();
    component.register();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should submit when the form is valid', () => {
    component.formRegister.controls['username'].setErrors(null);
    component.formRegister.controls['email'].setErrors(null);
    component.formRegister.controls['password'].setErrors(null);
    component.formRegister.controls['confirmPassword'].setErrors(null);
    component.formRegister.controls['recaptcha'].setErrors(null);
    expect(component.formRegister.valid).toBeTruthy();
    const spy = spyOn(authenticationService, 'register').and.returnValue(of('success'));
    spyOn(router, 'navigate').and.stub();
    spyOn(notificationService, 'error').and.stub();
    component.register();
    expect(spy).toHaveBeenCalled();
  });

  it('should error with Unknown Error', () => {
    component.formRegister.controls['username'].setErrors(null);
    component.formRegister.controls['email'].setErrors(null);
    component.formRegister.controls['password'].setErrors(null);
    component.formRegister.controls['confirmPassword'].setErrors(null);
    component.formRegister.controls['recaptcha'].setErrors(null);
    const error = {error: {value: 'other'}};
    spyOn(authenticationService, 'register').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.register();
    expect(spy).toHaveBeenCalledWith('Error.Unknown');
  });

  const runs = [
    { desc: 'Must be at least 8 characters', code: 'Auth.Password.Requirements.Length' },
    { desc: 'Must be at most 20 characters', code: 'Auth.Password.Requirements.MaxLength' },
    { desc: 'Must contain at least 1 in capital case', code: 'Auth.Password.Requirements.Capital' },
    { desc: 'Must contain at least 1 in lower case', code: 'Auth.Password.Requirements.Lower' },
    { desc: 'Must contain at least 1 number', code: 'Auth.Password.Requirements.Number' },
    { desc: 'Must be at least 5 characters', code: 'Auth.UsernameRequirements.Length' },
    { desc: 'Failed to create user', code: 'Auth.Register.RegistrationError' }
  ];

  describe('should error with the proper message', function () {
    runs.forEach(function (run) {
      it(run.desc, () => {
        component.formRegister.controls['username'].setErrors(null);
        component.formRegister.controls['email'].setErrors(null);
        component.formRegister.controls['password'].setErrors(null);
        component.formRegister.controls['confirmPassword'].setErrors(null);
        component.formRegister.controls['recaptcha'].setErrors(null);
        const error = {error: run.desc};
        spyOn(authenticationService, 'register').and.returnValue(throwError(error));
        spyOn(router, 'navigate').and.stub();
        const spy = spyOn(notificationService, 'error').and.stub();
        component.register();
        expect(spy).toHaveBeenCalledWith(run.code);
      });
    });
  });

  it('should error with the message supplied', () => {
    component.formRegister.controls['username'].setErrors(null);
    component.formRegister.controls['email'].setErrors(null);
    component.formRegister.controls['password'].setErrors(null);
    component.formRegister.controls['confirmPassword'].setErrors(null);
    component.formRegister.controls['recaptcha'].setErrors(null);
    const error = {error: 'message supplied'};
    spyOn(authenticationService, 'register').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.register();
    expect(spy).toHaveBeenCalledWith(error.error);
  });
});
