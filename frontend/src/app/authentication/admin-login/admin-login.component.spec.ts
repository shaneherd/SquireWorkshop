import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AdminLoginComponent} from './admin-login.component';
import {
  TranslateLoader,
  TranslateModule, TranslateService
} from '@ngx-translate/core';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpLoaderFactory} from '../../app.module';
import {AuthenticationModule} from '../authentication.module';
import {AuthenticationService} from '../authentication.service';
import {of, throwError} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../core/services/notification.service';
import {IdleService} from '../../core/services/idle.service';
import {EventsService} from '../../core/services/events.service';

describe('AdminLoginComponent', () => {
  let component: AdminLoginComponent;
  let fixture: ComponentFixture<AdminLoginComponent>;

  let router: Router;
  let route: ActivatedRoute;
  let authenticationService: AuthenticationService;
  let translate: TranslateService;
  let notificationService: NotificationService;
  let idleService: IdleService;
  let eventsService: EventsService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AuthenticationModule,
        RouterTestingModule,
        HttpClientTestingModule,
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
    fixture = TestBed.createComponent(AdminLoginComponent);
    route = TestBed.get(ActivatedRoute);
    router = TestBed.get(Router);
    authenticationService = TestBed.get(AuthenticationService);
    translate = TestBed.get(TranslateService);
    notificationService = TestBed.get(NotificationService);
    idleService = TestBed.get(IdleService);
    eventsService = TestBed.get(EventsService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the return url', () => {
    expect(component.returnUrl).toBe('/home/dashboard');
  });

  it('should not login when the username is blank', () => {
    component.adminLoginForm.controls['adminUsername'].setErrors(null);
    component.adminLoginForm.controls['adminPassword'].setErrors(null);
    component.adminLoginForm.controls['username'].setErrors({'incorrect': true});
    component.adminLoginForm.controls['recaptcha'].setErrors(null);
    expect(component.adminLoginForm.valid).toBeFalsy();
    const spy = spyOn(authenticationService, 'adminLogin').and.stub();
    component.login();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not login when the adminUsername is blank', () => {
    component.adminLoginForm.controls['adminUsername'].setErrors({'incorrect': true});
    component.adminLoginForm.controls['adminPassword'].setErrors(null);
    component.adminLoginForm.controls['username'].setErrors(null);
    component.adminLoginForm.controls['recaptcha'].setErrors(null);
    expect(component.adminLoginForm.valid).toBeFalsy();
    const spy = spyOn(authenticationService, 'adminLogin').and.stub();
    component.login();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not login when the adminPassword is blank', () => {
    component.adminLoginForm.controls['adminUsername'].setErrors(null);
    component.adminLoginForm.controls['adminPassword'].setErrors({'incorrect': true});
    component.adminLoginForm.controls['username'].setErrors(null);
    component.adminLoginForm.controls['recaptcha'].setErrors(null);
    expect(component.adminLoginForm.valid).toBeFalsy();
    const spy = spyOn(authenticationService, 'adminLogin').and.stub();
    component.login();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not login when the recaptcha is blank', () => {
    component.adminLoginForm.controls['adminUsername'].setErrors(null);
    component.adminLoginForm.controls['adminPassword'].setErrors(null);
    component.adminLoginForm.controls['username'].setErrors(null);
    component.adminLoginForm.controls['recaptcha'].setErrors({'incorrect': true});
    expect(component.adminLoginForm.valid).toBeFalsy();
    const spy = spyOn(authenticationService, 'adminLogin').and.stub();
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

    component.adminLoginForm.controls['adminUsername'].setErrors(null);
    component.adminLoginForm.controls['adminPassword'].setErrors(null);
    component.adminLoginForm.controls['username'].setErrors(null);
    component.adminLoginForm.controls['recaptcha'].setErrors(null);
    expect(component.adminLoginForm.valid).toBeTruthy();

    const spy = spyOn(authenticationService, 'adminLogin').and.returnValue(of(res));
    spyOn(idleService, 'startWatching').and.stub();
    spyOn(notificationService, 'info').and.stub();
    spyOn(eventsService, 'dispatchEvent').and.stub();
    spyOn(router, 'navigate').and.stub();

    component.login();
    expect(spy).toHaveBeenCalled();
    expect(localStorage.getItem('token')).toBe(res.token);
    expect(localStorage.getItem('user')).toBe(JSON.stringify(res.user));
  });

  it('should error with Unknown Error', () => {
    component.adminLoginForm.controls['adminUsername'].setErrors(null);
    component.adminLoginForm.controls['adminPassword'].setErrors(null);
    component.adminLoginForm.controls['username'].setErrors(null);
    component.adminLoginForm.controls['recaptcha'].setErrors(null);
    const error = {error: {value: 'other'}};
    localStorage.setItem('token', '');
    spyOn(authenticationService, 'adminLogin').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.login();
    expect(localStorage.getItem('token')).toBe('');
    expect(spy).toHaveBeenCalledWith('Error.Unknown');
  });

  it('should error with Invalid Username or Password', () => {
    component.adminLoginForm.controls['adminUsername'].setErrors(null);
    component.adminLoginForm.controls['adminPassword'].setErrors(null);
    component.adminLoginForm.controls['username'].setErrors(null);
    component.adminLoginForm.controls['recaptcha'].setErrors(null);
    const error = {error: 'Invalid Username or Password'};
    localStorage.setItem('token', '');
    spyOn(authenticationService, 'adminLogin').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.login();
    expect(localStorage.getItem('token')).toBe('');
    expect(spy).toHaveBeenCalledWith('Auth.Password.Error.Invalid');
  });

  it('should error with Account locked', () => {
    component.adminLoginForm.controls['adminUsername'].setErrors(null);
    component.adminLoginForm.controls['adminPassword'].setErrors(null);
    component.adminLoginForm.controls['username'].setErrors(null);
    component.adminLoginForm.controls['recaptcha'].setErrors(null);
    const error = {error: 'Account locked'};
    localStorage.setItem('token', '');
    spyOn(authenticationService, 'adminLogin').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.login();
    expect(localStorage.getItem('token')).toBe('');
    expect(spy).toHaveBeenCalledWith('Auth.Password.Error.Locked');
  });

  it('should error with Email not validated', () => {
    component.adminLoginForm.controls['adminUsername'].setErrors(null);
    component.adminLoginForm.controls['adminPassword'].setErrors(null);
    component.adminLoginForm.controls['username'].setErrors(null);
    component.adminLoginForm.controls['recaptcha'].setErrors(null);
    const error = {error: 'Email not validated'};
    localStorage.setItem('token', '');
    spyOn(authenticationService, 'adminLogin').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.login();
    expect(localStorage.getItem('token')).toBe('');
    expect(spy).toHaveBeenCalledWith('Auth.Password.Error.EmailNotVerified');
  });

  it('should error with User is not an admin', () => {
    component.adminLoginForm.controls['adminUsername'].setErrors(null);
    component.adminLoginForm.controls['adminPassword'].setErrors(null);
    component.adminLoginForm.controls['username'].setErrors(null);
    component.adminLoginForm.controls['recaptcha'].setErrors(null);
    const error = {error: 'User is not an admin'};
    localStorage.setItem('token', '');
    spyOn(authenticationService, 'adminLogin').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.login();
    expect(localStorage.getItem('token')).toBe('');
    expect(spy).toHaveBeenCalledWith('Auth.Password.Error.NotAdmin');
  });

  it('should error with User revoked access', () => {
    component.adminLoginForm.controls['adminUsername'].setErrors(null);
    component.adminLoginForm.controls['adminPassword'].setErrors(null);
    component.adminLoginForm.controls['username'].setErrors(null);
    component.adminLoginForm.controls['recaptcha'].setErrors(null);
    const error = {error: 'User revoked access'};
    localStorage.setItem('token', '');
    spyOn(authenticationService, 'adminLogin').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.login();
    expect(localStorage.getItem('token')).toBe('');
    expect(spy).toHaveBeenCalledWith('Auth.Password.Error.AdminAccessRevoked');
  });

  it('should error with the message supplied', () => {
    component.adminLoginForm.controls['adminUsername'].setErrors(null);
    component.adminLoginForm.controls['adminPassword'].setErrors(null);
    component.adminLoginForm.controls['username'].setErrors(null);
    component.adminLoginForm.controls['recaptcha'].setErrors(null);
    const error = {error: 'message supplied'};
    localStorage.setItem('token', '');
    spyOn(authenticationService, 'adminLogin').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.login();
    expect(localStorage.getItem('token')).toBe('');
    expect(spy).toHaveBeenCalledWith('message supplied');
  });
});
