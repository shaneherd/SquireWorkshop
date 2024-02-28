import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LOCAL_STORAGE} from '../../constants';
import {UserSettingsModel} from '../../shared/models/user-settings.model';
import {SupportRequest} from '../../shared/models/support-request';
import {UserModel} from '../../shared/models/user.model';
import {environment} from '../../../environments/environment';
import {UserRole} from '../../shared/models/user-role.enum';
import {UserSubscriptionType} from '../../shared/models/user-subscription-type.enum';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: UserModel;
  userSubject: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(this.getUser());

  constructor(private http: HttpClient) {
  }

  getUser(): UserModel {
    const user = localStorage.getItem(LOCAL_STORAGE.USER);
    return user == null || user === '' ? null : JSON.parse(user);
  }

  setUser(user: UserModel): void {
    localStorage.setItem(LOCAL_STORAGE.USER, JSON.stringify(user));
    this.user = user;
    this.userSubject.next(this.user);
  }

  clearUser(): void {
    localStorage.setItem(LOCAL_STORAGE.USER, '');
    this.user = null;
    this.userSubject.next(this.user);
  }

  deleteUser(userId: any, password: string): Promise<any> {
    const body = new URLSearchParams();
    body.set('password', password);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post<any>(environment.backendUrl + '/user/' + userId + '/delete', body.toString(), options).toPromise();
  }

  restoreDefaults(userId: any, password: string): Promise<any> {
    const body = new URLSearchParams();
    body.set('password', password);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post<any>(environment.backendUrl + '/user/' + userId + '/restoreDefaults', body.toString(), options).toPromise();
  }

  changePassword(userId: any, username: any, originalPassword: any, newPassword: any): Promise<any> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('originalPassword', originalPassword);
    body.set('newPassword', newPassword);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post<any>(environment.backendUrl + '/user/' + userId + '/changePassword', body.toString(), options).toPromise();
  }

  changeEmail(userId: any, password: string, email: string): Promise<any> {
    const body = new URLSearchParams();
    body.set('password', password);
    body.set('email', email);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post<any>(environment.backendUrl + '/user/' + userId + '/changeEmail', body.toString(), options).toPromise();
  }

  updateUserSettings(userId: number, userSettings: UserSettingsModel): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(environment.backendUrl + '/user/' + userId + '/settings/update', userSettings, httpOptions).toPromise();
  }

  submitRequest(supportRequest: SupportRequest): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/user/support`, supportRequest).toPromise();
  }

  isPro(): boolean {
    const user: UserModel = this.getUser();
    return user.userRole === UserRole.PRO && user.userSubscription.type !== UserSubscriptionType.FREE && (user.userSubscription.type === UserSubscriptionType.LIFETIME || this.getDaysRemaining(user.userSubscription.expiration) > 0);
  }

  private getDaysRemaining(subscriptionExpiration: number): number {
    const subscriptionExpirationDate = new Date(subscriptionExpiration);
    const now = new Date();
    const diff = subscriptionExpirationDate.getTime() - now.getTime();
    let days = diff / (1000 * 3600 * 24);
    if (days < 0) {
      days = 0;
    }
    return Math.floor(days);
  }
}
