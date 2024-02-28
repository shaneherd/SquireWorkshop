import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ChangePasswordComponent} from './change-password.component';
import {HeaderModule} from '../header.module';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app.module';
import {HttpClient} from '@angular/common/http';
import {UserModel} from '../../../shared/models/user.model';
import {of, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {NotificationService} from '../../services/notification.service';
import {UserService} from '../../services/user.service';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let router: Router;
  let notificationService: NotificationService;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HeaderModule,
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
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    router = TestBed.get(Router);
    notificationService = TestBed.get(NotificationService);
    userService = TestBed.get(UserService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not change the password when original password is blank', () => {
    component.formChangePassword.controls['originalPassword'].setErrors({'incorrect': true});
    component.formChangePassword.controls['password'].setErrors(null);
    component.formChangePassword.controls['confirmPassword'].setErrors(null);
    const user = new UserModel();
    localStorage.setItem('user', JSON.stringify(user));
    const spy = spyOn(userService, 'changePassword').and.returnValue(of('success'));
    spyOn(router, 'navigate').and.stub();
    spyOn(notificationService, 'success').and.stub();
    component.changePassword();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not change the password when new password is blank', () => {
    component.formChangePassword.controls['originalPassword'].setErrors(null);
    component.formChangePassword.controls['password'].setErrors({'incorrect': true});
    component.formChangePassword.controls['confirmPassword'].setErrors(null);
    const user = new UserModel();
    localStorage.setItem('user', JSON.stringify(user));
    const spy = spyOn(userService, 'changePassword').and.returnValue(of('success'));
    spyOn(router, 'navigate').and.stub();
    spyOn(notificationService, 'success').and.stub();
    component.changePassword();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not change the password when confirm password is blank', () => {
    component.formChangePassword.controls['originalPassword'].setErrors(null);
    component.formChangePassword.controls['password'].setErrors(null);
    component.formChangePassword.controls['confirmPassword'].setErrors({'incorrect': true});
    const user = new UserModel();
    localStorage.setItem('user', JSON.stringify(user));
    const spy = spyOn(userService, 'changePassword').and.returnValue(of('success'));
    spyOn(router, 'navigate').and.stub();
    spyOn(notificationService, 'success').and.stub();
    component.changePassword();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should change the password', () => {
    component.formChangePassword.controls['originalPassword'].setErrors(null);
    component.formChangePassword.controls['password'].setErrors(null);
    component.formChangePassword.controls['confirmPassword'].setErrors(null);
    const user = new UserModel();
    localStorage.setItem('user', JSON.stringify(user));
    const spy = spyOn(userService, 'changePassword').and.returnValue(of('success'));
    spyOn(router, 'navigate').and.stub();
    spyOn(notificationService, 'success').and.stub();
    component.changePassword();
    expect(spy).toHaveBeenCalled();
  });

  it('should error with Unknown Error', () => {
    const user = new UserModel();
    localStorage.setItem('user', JSON.stringify(user));
    component.formChangePassword.controls['originalPassword'].setErrors(null);
    component.formChangePassword.controls['password'].setErrors(null);
    component.formChangePassword.controls['confirmPassword'].setErrors(null);
    const error = {error: {value: 'other'}};
    spyOn(userService, 'changePassword').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.changePassword();
    expect(spy).toHaveBeenCalledWith('Error.Unknown');
  });

  const runs = [
    { desc: 'Not allowed to update the specified user', code: 'Auth.Error.NotAllowedToUpdateUser' },
    { desc: 'Invalid Password', code: 'Auth.Password.Error.InvalidPassword' },
    { desc: 'Must be at least 8 characters', code: 'Auth.Password.Requirements.Length' },
    { desc: 'Must be at most 20 characters', code: 'Auth.Password.Requirements.MaxLength' },
    { desc: 'Must contain at least 1 special character', code: 'Auth.Password.Requirements.Special' },
    { desc: 'Must contain at least 1 in capital case', code: 'Auth.Password.Requirements.Capital' },
    { desc: 'Must contain at least 1 in lower case', code: 'Auth.Password.Requirements.Lower' },
    { desc: 'Must contain at least 1 number', code: 'Auth.Password.Requirements.Number' },
    { desc: 'message supplied', code: 'message supplied' },
  ];

  describe('should error with the proper message', function () {
    runs.forEach(function (run) {
      it(run.desc, () => {
        const user = new UserModel();
        localStorage.setItem('user', JSON.stringify(user));
        component.formChangePassword.controls['originalPassword'].setErrors(null);
        component.formChangePassword.controls['password'].setErrors(null);
        component.formChangePassword.controls['confirmPassword'].setErrors(null);
        const error = {error: run.desc};
        spyOn(userService, 'changePassword').and.returnValue(throwError(error));
        spyOn(router, 'navigate').and.stub();
        const spy = spyOn(notificationService, 'error').and.stub();
        component.changePassword();
        expect(spy).toHaveBeenCalledWith(run.code);
      });
    });
  });
});
