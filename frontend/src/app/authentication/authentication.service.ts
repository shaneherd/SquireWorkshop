import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserModel} from '../shared/models/user.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private http: HttpClient) {
  }

  login(username: any, password: any): Promise<any> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post<any>(environment.backendUrl + '/authentication/login', body.toString(), options).toPromise();
  }

  adminLogin(adminUsername: any, password: any, username: any): Promise<any> {
    const body = new URLSearchParams();
    body.set('adminUsername', adminUsername);
    body.set('password', password);
    body.set('username', username);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post<any>(environment.backendUrl + '/authentication/adminLogin', body.toString(), options).toPromise();
  }

  register(user: UserModel): Promise<any> {
    const body = new URLSearchParams();
    body.set('username', user.username);
    body.set('password', user.password);
    body.set('email', user.email);
    body.set('token', user.token);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post<any>(environment.backendUrl + '/authentication/register', body.toString(), options).toPromise();
  }

  forgotUsername(email: any): Promise<any> {
    const body = new URLSearchParams();
    body.set('email', email);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post<any>(environment.backendUrl + '/authentication/forgotUsername', body.toString(), options).toPromise();
  }

  forgotPassword(email: any): Promise<any> {
    const body = new URLSearchParams();
    body.set('email', email);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post<any>(environment.backendUrl + '/authentication/forgotPassword', body.toString(), options).toPromise();
  }

  resetPassword(resetToken: any, newPassword: any): Promise<any> {
    const body = new URLSearchParams();
    body.set('resetToken', resetToken);
    body.set('newPassword', newPassword);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post<any>(environment.backendUrl + '/authentication/resetPassword', body.toString(), options).toPromise();
  }

  unlockAccount(unlockToken: string): Promise<any> {
    const body = new URLSearchParams();
    body.set('unlockToken', unlockToken);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post<any>(environment.backendUrl + '/authentication/unlockAccount', body.toString(), options).toPromise();
  }
}
