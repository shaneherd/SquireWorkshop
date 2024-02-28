import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {LoginComponent} from './login.component';
import {ActivatedRoute, Router} from '@angular/router';
import {IdleService} from '../../core/services/idle.service';
import {EventsService} from '../../core/services/events.service';
import {AuthenticationService} from '../authentication.service';
import {NotificationService} from '../../core/services/notification.service';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {FormBuilder} from '@angular/forms';
import {of, throwError} from 'rxjs';
import {AuthenticationModule} from '../authentication.module';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpLoaderFactory} from '../../app.module';
import {HttpClient} from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let route: ActivatedRoute;
  let router: Router;
  let idleService: IdleService;
  let eventsService: EventsService;
  let authenticationService: AuthenticationService;
  let notificationService: NotificationService;
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
    fixture = TestBed.createComponent(LoginComponent);

    route = TestBed.get(ActivatedRoute);
    router = TestBed.get(Router);
    idleService = TestBed.get(IdleService);
    eventsService = TestBed.get(EventsService);
    authenticationService = TestBed.get(AuthenticationService);
    notificationService = TestBed.get(NotificationService);
    translate = TestBed.get(TranslateService);
    fb = TestBed.get(FormBuilder);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not login when the username is blank', () => {
    component.loginForm.controls['username'].setErrors({'incorrect': true});
    component.loginForm.controls['password'].setErrors(null);
    component.loginForm.controls['recaptcha'].setErrors(null);
    expect(component.loginForm.valid).toBeFalsy();
    const spy = spyOn(authenticationService, 'login').and.stub();
    component.login();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not login when the password is blank', () => {
    component.loginForm.controls['username'].setErrors(null);
    component.loginForm.controls['password'].setErrors({'incorrect': true});
    component.loginForm.controls['recaptcha'].setErrors(null);
    expect(component.loginForm.valid).toBeFalsy();
    const spy = spyOn(authenticationService, 'login').and.stub();
    component.login();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not login when the recaptcha is blank', () => {
    component.loginForm.controls['username'].setErrors(null);
    component.loginForm.controls['password'].setErrors(null);
    component.loginForm.controls['recaptcha'].setErrors({'incorrect': true});
    expect(component.loginForm.valid).toBeFalsy();
    const spy = spyOn(authenticationService, 'login').and.stub();
    component.login();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should login when the form is valid', () => {
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');
    const res = {
      token: 'token',
      user: {value: 'user'}
    };

    component.loginForm.controls['username'].setErrors(null);
    component.loginForm.controls['password'].setErrors(null);
    component.loginForm.controls['recaptcha'].setErrors(null);
    expect(component.loginForm.valid).toBeTruthy();

    const spy = spyOn(authenticationService, 'login').and.returnValue(of(res));
    spyOn(idleService, 'startWatching').and.stub();
    spyOn(notificationService, 'info').and.stub();
    spyOn(eventsService, 'dispatchEvent').and.stub();
    spyOn(router, 'navigate').and.stub();

    component.login();
    expect(spy).toHaveBeenCalled();
    expect(localStorage.getItem('token')).toBe(res.token);
    expect(localStorage.getItem('user')).toBe(JSON.stringify(res.user));
  });

  it('should notify of last login if available', () => {
    const res = {
      token: 'token',
      user: {value: 'user'},
      lastLogin: 1542051102000
    };

    component.loginForm.controls['username'].setErrors(null);
    component.loginForm.controls['password'].setErrors(null);
    component.loginForm.controls['recaptcha'].setErrors(null);
    expect(component.loginForm.valid).toBeTruthy();

    const spy = spyOn(notificationService, 'info').and.stub();
    spyOn(authenticationService, 'login').and.returnValue(of(res));
    spyOn(idleService, 'startWatching').and.stub();
    spyOn(eventsService, 'dispatchEvent').and.stub();
    spyOn(router, 'navigate').and.stub();

    component.login();
    expect(spy).toHaveBeenCalledWith('Auth.Login.LastLogin');
  });

  it('should format the date', () => {
    const timestamp = 1542051102000;
    const date = component.getDate(timestamp);
    expect(date).toBe('11/12/2018 12:31:42');
  });

  it('should error with Unknown Error', () => {
    component.loginForm.controls['username'].setErrors(null);
    component.loginForm.controls['password'].setErrors(null);
    component.loginForm.controls['recaptcha'].setErrors(null);
    const error = {error: {value: 'other'}};
    spyOn(authenticationService, 'login').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.login();
    expect(spy).toHaveBeenCalledWith('Error.Unknown');
  });

  it('should error with Invalid Username or Password', () => {
    component.loginForm.controls['username'].setErrors(null);
    component.loginForm.controls['password'].setErrors(null);
    component.loginForm.controls['recaptcha'].setErrors(null);
    const error = {error: 'Invalid Username or Password'};
    spyOn(authenticationService, 'login').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.login();
    expect(spy).toHaveBeenCalledWith('Auth.Password.Error.Invalid');
  });

  it('should error with Account Locked', () => {
    component.loginForm.controls['username'].setErrors(null);
    component.loginForm.controls['password'].setErrors(null);
    component.loginForm.controls['recaptcha'].setErrors(null);
    const error = {error: 'Account locked'};
    spyOn(authenticationService, 'login').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.login();
    expect(spy).toHaveBeenCalledWith('Auth.Password.Error.Locked');
  });

  it('should error with Email Not Validated', () => {
    component.loginForm.controls['username'].setErrors(null);
    component.loginForm.controls['password'].setErrors(null);
    component.loginForm.controls['recaptcha'].setErrors(null);
    const error = {error: 'Email not validated'};
    spyOn(authenticationService, 'login').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.login();
    expect(spy).toHaveBeenCalledWith('Auth.Password.Error.EmailNotVerified');
  });

  it('should error with the message supplied', () => {
    component.loginForm.controls['username'].setErrors(null);
    component.loginForm.controls['password'].setErrors(null);
    component.loginForm.controls['recaptcha'].setErrors(null);
    const error = {error: 'message supplied'};
    spyOn(authenticationService, 'login').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.login();
    expect(spy).toHaveBeenCalledWith(error.error);
  });
});
