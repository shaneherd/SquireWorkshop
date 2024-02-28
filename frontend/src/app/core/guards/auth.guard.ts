import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/index';
import {LOCAL_STORAGE} from '../../constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLogin();
  }

  checkLogin(): boolean {
    if (this.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/auth']);
    return false;
  }

  isLoggedIn(): boolean {
    const token: String = localStorage.getItem(LOCAL_STORAGE.TOKEN);
    return token != null && token !== '';
  }
}
