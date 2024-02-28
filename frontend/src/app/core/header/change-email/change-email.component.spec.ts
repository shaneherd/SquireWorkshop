import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ChangeEmailComponent} from './change-email.component';
import {HeaderModule} from '../header.module';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../app.module';
import {HttpClient} from '@angular/common/http';
import {of, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {NotificationService} from '../../services/notification.service';
import {UserService} from '../../services/user.service';
import {UserModel} from '../../../shared/models/user.model';

describe('ChangeEmailComponent', () => {
  let component: ChangeEmailComponent;
  let fixture: ComponentFixture<ChangeEmailComponent>;
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
    fixture = TestBed.createComponent(ChangeEmailComponent);
    router = TestBed.get(Router);
    notificationService = TestBed.get(NotificationService);
    userService = TestBed.get(UserService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not change the email when password is blank', () => {
    component.formChangeEmail.controls['password'].setErrors({'incorrect': true});
    component.formChangeEmail.controls['email'].setErrors(null);
    const user = new UserModel();
    localStorage.setItem('user', JSON.stringify(user));
    const spy = spyOn(userService, 'changeEmail').and.returnValue(of('success'));
    spyOn(router, 'navigate').and.stub();
    spyOn(notificationService, 'success').and.stub();
    component.changeEmail();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not change the email when email is blank', () => {
    component.formChangeEmail.controls['password'].setErrors(null);
    component.formChangeEmail.controls['email'].setErrors({'incorrect': true});
    const user = new UserModel();
    localStorage.setItem('user', JSON.stringify(user));
    const spy = spyOn(userService, 'changeEmail').and.returnValue(of('success'));
    spyOn(router, 'navigate').and.stub();
    spyOn(notificationService, 'success').and.stub();
    component.changeEmail();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should change the email', () => {
    component.formChangeEmail.controls['password'].setErrors(null);
    component.formChangeEmail.controls['email'].setErrors(null);
    const user = new UserModel();
    localStorage.setItem('user', JSON.stringify(user));
    const spy = spyOn(userService, 'changeEmail').and.returnValue(of('success'));
    spyOn(router, 'navigate').and.stub();
    spyOn(notificationService, 'success').and.stub();
    component.changeEmail();
    expect(spy).toHaveBeenCalled();
  });

  it('should error with Unknown Error', () => {
    const user = new UserModel();
    localStorage.setItem('user', JSON.stringify(user));
    component.formChangeEmail.controls['password'].setErrors(null);
    component.formChangeEmail.controls['email'].setErrors(null);
    const error = {error: {value: 'other'}};
    spyOn(userService, 'changeEmail').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.changeEmail();
    expect(spy).toHaveBeenCalledWith('Error.Unknown');
  });

  const runs = [
    { desc: 'Not allowed to update the specified user', code: 'Auth.Error.NotAllowedToUpdateUser' },
    { desc: 'Invalid user', code: 'Auth.Error.InvalidUser' },
    { desc: 'message supplied', code: 'message supplied' },
  ];

  describe('should error with the proper message', function () {
    runs.forEach(function (run) {
      it(run.desc, () => {
        const user = new UserModel();
        localStorage.setItem('user', JSON.stringify(user));
        component.formChangeEmail.controls['password'].setErrors(null);
        component.formChangeEmail.controls['email'].setErrors(null);
        const error = {error: run.desc};
        spyOn(userService, 'changeEmail').and.returnValue(throwError(error));
        spyOn(router, 'navigate').and.stub();
        const spy = spyOn(notificationService, 'error').and.stub();
        component.changeEmail();
        expect(spy).toHaveBeenCalledWith(run.code);
      });
    });
  });
});
