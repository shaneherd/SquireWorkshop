import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserSettingsComponent} from './user-settings.component';
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
import {UserSettingsModel} from '../../../shared/models/user-settings.model';
import {MatDialog} from '@angular/material';
import {DangerZoneData} from '../../components/danger-zone-confirmation/danger-zone-data';
import {LOCAL_STORAGE} from '../../../constants';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;
  let router: Router;
  let notificationService: NotificationService;
  let userService: UserService;
  let dialog: MatDialog;

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
    const user = new UserModel();
    user.userSettings = new UserSettingsModel();
    localStorage.setItem('user', JSON.stringify(user));
    fixture = TestBed.createComponent(UserSettingsComponent);
    router = TestBed.get(Router);
    notificationService = TestBed.get(NotificationService);
    userService = TestBed.get(UserService);
    dialog = TestBed.get(MatDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('update settings', () => {
    it('should update the settings', () => {
      const user = new UserModel();
      user.userSettings = new UserSettingsModel();
      localStorage.setItem('user', JSON.stringify(user));
      component.userSettings = new UserSettingsModel();
      component.userSettings.allowAdminAccess = false;
      component.userSettings.subscribed = true;
      component.userSettings.language = 'testLanguage';
      spyOn(userService, 'updateUserSettings').and.returnValue(of('success'));
      spyOn(notificationService, 'success').and.stub();
      component.updateSettings();

      const userUpdated: UserModel = JSON.parse(localStorage.getItem(LOCAL_STORAGE.USER));
      expect(userUpdated.userSettings.allowAdminAccess).toBe(component.userSettings.allowAdminAccess);
      expect(userUpdated.userSettings.subscribed).toBe(component.userSettings.subscribed);
      expect(userUpdated.userSettings.language).toBe(component.userSettings.language);
    });

    it('should error with Unknown Error', () => {
      const user = new UserModel();
      user.userSettings = new UserSettingsModel();
      localStorage.setItem('user', JSON.stringify(user));
      component.userSettings = new UserSettingsModel();
      component.userSettings.allowAdminAccess = false;
      component.userSettings.subscribed = true;
      component.userSettings.language = 'testLanguage';
      const error = {error: {value: 'other'}};
      spyOn(userService, 'updateUserSettings').and.returnValue(throwError(error));
      spyOn(router, 'navigate').and.stub();
      const spy = spyOn(notificationService, 'error').and.stub();
      component.updateSettings();
      expect(spy).toHaveBeenCalledWith('Error.Unknown');
    });

    const runs = [
      { desc: 'Not allowed to update the specified user', code: 'Auth.Error.NotAllowedToUpdateUser' },
      { desc: 'message supplied', code: 'message supplied' },
    ];

    describe('should error with the proper message', function () {
      runs.forEach(function (run) {
        it(run.desc, () => {
          const user = new UserModel();
          user.userSettings = new UserSettingsModel();
          localStorage.setItem('user', JSON.stringify(user));
          component.userSettings = new UserSettingsModel();
          component.userSettings.allowAdminAccess = false;
          component.userSettings.subscribed = true;
          component.userSettings.language = 'testLanguage';
          const error = {error: run.desc};
          spyOn(userService, 'updateUserSettings').and.returnValue(throwError(error));
          spyOn(router, 'navigate').and.stub();
          const spy = spyOn(notificationService, 'error').and.stub();
          component.updateSettings();
          expect(spy).toHaveBeenCalledWith(run.code);
        });
      });
    });
  });

  describe('restore defaults', () => {
    it('restore the defaults', () => {
      const user = new UserModel();
      user.userSettings = new UserSettingsModel();
      localStorage.setItem('user', JSON.stringify(user));
      let data: DangerZoneData;
      spyOn(dialog, 'open').and.callFake((_component, config) => {
        data = config.data;
      });
      spyOn(router, 'navigate').and.stub();
      spyOn(notificationService, 'success').and.stub();
      const spy = spyOn(userService, 'restoreDefaults').and.returnValue(of('success'));
      component.restoreDefaults();
      expect(data).not.toBeNull();
      data.confirm('password');
      expect(spy).toHaveBeenCalled();
    });

    it('should error with Unknown Error', () => {
      const user = new UserModel();
      user.userSettings = new UserSettingsModel();
      localStorage.setItem('user', JSON.stringify(user));
      let data: DangerZoneData;
      spyOn(dialog, 'open').and.callFake((_component, config) => {
        data = config.data;
      });
      spyOn(router, 'navigate').and.stub();
      spyOn(notificationService, 'success').and.stub();
      const error = {error: {value: 'other'}};
      spyOn(userService, 'restoreDefaults').and.returnValue(throwError(error));
      const spy = spyOn(notificationService, 'error').and.stub();
      component.restoreDefaults();
      expect(data).not.toBeNull();
      data.confirm('password');
      expect(spy).toHaveBeenCalledWith('Error.Unknown');
    });

    const runs = [
      { desc: 'Not allowed to update the specified user', code: 'Auth.Error.NotAllowedToUpdateUser' },
      { desc: 'Password is required', code: 'Auth.Password.Error.PasswordRequired' },
      { desc: 'Invalid user id', code: 'Auth.Error.InvalidUser' },
      { desc: 'Invalid password', code: 'Auth.Password.Error.InvalidPassword' },
      { desc: 'message supplied', code: 'message supplied' },
    ];

    describe('should error with the proper message', function () {
      runs.forEach(function (run) {
        it(run.desc, () => {
          const user = new UserModel();
          user.userSettings = new UserSettingsModel();
          localStorage.setItem('user', JSON.stringify(user));
          let data: DangerZoneData;
          spyOn(dialog, 'open').and.callFake((_component, config) => {
            data = config.data;
          });
          spyOn(router, 'navigate').and.stub();
          spyOn(notificationService, 'success').and.stub();
          const error = {error: run.desc};
          spyOn(userService, 'restoreDefaults').and.returnValue(throwError(error));
          const spy = spyOn(notificationService, 'error').and.stub();
          component.restoreDefaults();
          expect(data).not.toBeNull();
          data.confirm('password');
          expect(spy).toHaveBeenCalledWith(run.code);
        });
      });
    });
  });

  describe('delete user', () => {
    it('delete the user', () => {
      const user = new UserModel();
      user.userSettings = new UserSettingsModel();
      localStorage.setItem('user', JSON.stringify(user));
      let data: DangerZoneData;
      spyOn(dialog, 'open').and.callFake((_component, config) => {
        data = config.data;
      });
      spyOn(router, 'navigate').and.stub();
      spyOn(notificationService, 'success').and.stub();
      const spy = spyOn(userService, 'deleteUser').and.returnValue(of('success'));
      component.deleteUser();
      expect(data).not.toBeNull();
      data.confirm('password');
      expect(spy).toHaveBeenCalled();
    });

    it('should error with Unknown Error', () => {
      const user = new UserModel();
      user.userSettings = new UserSettingsModel();
      localStorage.setItem('user', JSON.stringify(user));
      let data: DangerZoneData;
      spyOn(dialog, 'open').and.callFake((_component, config) => {
        data = config.data;
      });
      spyOn(router, 'navigate').and.stub();
      spyOn(notificationService, 'success').and.stub();
      const error = {error: {value: 'other'}};
      spyOn(userService, 'deleteUser').and.returnValue(throwError(error));
      const spy = spyOn(notificationService, 'error').and.stub();
      component.deleteUser();
      expect(data).not.toBeNull();
      data.confirm('password');
      expect(spy).toHaveBeenCalledWith('Error.Unknown');
    });

    const runs = [
      { desc: 'Not allowed to update the specified user', code: 'Auth.Error.NotAllowedToUpdateUser' },
      { desc: 'Password is required', code: 'Auth.Password.Error.PasswordRequired' },
      { desc: 'Invalid user id', code: 'Auth.Error.InvalidUser' },
      { desc: 'Invalid password', code: 'Auth.Password.Error.InvalidPassword' },
      { desc: 'message supplied', code: 'message supplied' },
    ];

    describe('should error with the proper message', function () {
      runs.forEach(function (run) {
        it(run.desc, () => {
          const user = new UserModel();
          user.userSettings = new UserSettingsModel();
          localStorage.setItem('user', JSON.stringify(user));
          let data: DangerZoneData;
          spyOn(dialog, 'open').and.callFake((_component, config) => {
            data = config.data;
          });
          spyOn(router, 'navigate').and.stub();
          spyOn(notificationService, 'success').and.stub();
          const error = {error: run.desc};
          spyOn(userService, 'deleteUser').and.returnValue(throwError(error));
          const spy = spyOn(notificationService, 'error').and.stub();
          component.deleteUser();
          expect(data).not.toBeNull();
          data.confirm('password');
          expect(spy).toHaveBeenCalledWith(run.code);
        });
      });
    });
  });
});
