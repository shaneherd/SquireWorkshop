import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockAccountComponent } from './unlock-account.component';
import {ActivatedRoute, Router} from '@angular/router';
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

describe('UnlockAccountComponent', () => {
  let component: UnlockAccountComponent;
  let fixture: ComponentFixture<UnlockAccountComponent>;

  let router: Router;
  let activatedRoute: ActivatedRoute;
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
    fixture = TestBed.createComponent(UnlockAccountComponent);
    router = TestBed.get(Router);
    activatedRoute = TestBed.get(ActivatedRoute);
    notificationService = TestBed.get(NotificationService);
    authenticationService = TestBed.get(AuthenticationService);
    translate = TestBed.get(TranslateService);
    fb = TestBed.get(FormBuilder);
    component = fixture.componentInstance;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should error when no token is available', () => {
    component.routeParams.unlockToken = null;
    const spy = spyOn(notificationService, 'error').and.stub();
    expect(spy).toHaveBeenCalledWith('Auth.Error.InvalidToken');
  });

  it('should submit when the form is valid', () => {
    component.routeParams.unlockToken = 'unlockToken';
    component.formUnlockAccount.controls['recaptcha'].setErrors(null);
    expect(component.formUnlockAccount.valid).toBeTruthy();
    const spy = spyOn(authenticationService, 'unlockAccount').and.returnValue(of('success'));
    spyOn(router, 'navigate').and.stub();
    spyOn(notificationService, 'error').and.stub();
    component.unlockAccount();
    expect(spy).toHaveBeenCalled();
  });

  it('should error with Unknown Error', () => {
    component.routeParams.unlockToken = 'unlockToken';
    component.formUnlockAccount.controls['recaptcha'].setErrors(null);
    const error = {error: {value: 'other'}};
    spyOn(authenticationService, 'unlockAccount').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.unlockAccount();
    expect(spy).toHaveBeenCalledWith('Error.Unknown');
  });

  it('should error with Invalid Token', () => {
    component.routeParams.unlockToken = null;
    component.formUnlockAccount.controls['recaptcha'].setErrors(null);
    const error = {error: {value: 'other'}};
    spyOn(authenticationService, 'unlockAccount').and.returnValue(throwError(error));
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(notificationService, 'error').and.stub();
    component.unlockAccount();
    expect(spy).toHaveBeenCalledWith('Auth.Error.InvalidToken');
  });

  const runs = [
    { desc: 'Invalid Token', code: 'Auth.Error.InvalidToken' },
    { desc: 'Failed to find user', code: 'Auth.Error.FailedToFindUser' },
    { desc: 'message supplied', code: 'message supplied' },
  ];

  describe('should error with the proper message', function () {
    runs.forEach(function (run) {
      it(run.desc, () => {
        component.routeParams.unlockToken = 'unlockToken';
        component.formUnlockAccount.controls['recaptcha'].setErrors(null);
        const error = {error: run.desc};
        spyOn(authenticationService, 'unlockAccount').and.returnValue(throwError(error));
        spyOn(router, 'navigate').and.stub();
        const spy = spyOn(notificationService, 'error').and.stub();
        component.unlockAccount();
        expect(spy).toHaveBeenCalledWith(run.code);
      });
    });
  });
});
