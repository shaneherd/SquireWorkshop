import {getTestBed, TestBed} from '@angular/core/testing';

import {AuthGuard} from './auth.guard';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';

describe('AuthGuard', () => {
  let injector: TestBed;
  let authGuard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard],
      imports: [RouterTestingModule]
    });
    injector = getTestBed();
    authGuard = injector.get(AuthGuard);
    router = injector.get(Router);
  });

  it('should return true when logged in', () => {
    spyOn(authGuard, 'isLoggedIn').and.returnValue(true);
    const checkLogin = authGuard.checkLogin();
    expect(checkLogin).toBeTruthy();
  });

  it('should false when not logged in', () => {
    spyOn(authGuard, 'isLoggedIn').and.returnValue(false);
    const spy = spyOn(router, 'navigate').and.stub();
    const checkLogin = authGuard.checkLogin();
    expect(checkLogin).toBeFalsy();
    expect(spy).toHaveBeenCalled();
  });

  it('should true when the token is not null', () => {
    localStorage.setItem('token', 'token');
    const loggedIn = authGuard.isLoggedIn();
    expect(loggedIn).toBeTruthy();
  });

  it('should false when the token is null', () => {
    localStorage.setItem('token', '');
    const loggedIn = authGuard.isLoggedIn();
    expect(loggedIn).toBeFalsy();
  });

  it('calls checkLogin', () => {
    const spy = spyOn(authGuard, 'isLoggedIn').and.returnValue(true);
    authGuard.canActivate(null, null);
    expect(spy).toHaveBeenCalled();
  });
});
