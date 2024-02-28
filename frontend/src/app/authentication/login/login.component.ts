import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IdleService} from '../../core/services/idle.service';
import {NotificationService} from '../../core/services/notification.service';
import {EventsService} from '../../core/services/events.service';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ANALYTICS_EVENT, ANALYTICS_LABEL, EVENTS, LOCAL_STORAGE} from '../../constants';
import {LoginService} from '../../core/services/login.service';
import {UserModel} from '../../shared/models/user.model';
import {UserSubscriptionType} from '../../shared/models/user-subscription-type.enum';
import {UserService} from '../../core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  loading = false;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private idleService: IdleService,
    private eventsService: EventsService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private loginService: LoginService,
    private fb: FormBuilder,
    private userService: UserService) {
  }

  ngOnInit() {
    //if already logged in, redirect to the dashboard
    const token: String = localStorage.getItem(LOCAL_STORAGE.TOKEN);
    if (token != null && token !== '') {
      this.router.navigate(['/home/dashboard']);
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home/dashboard';
    this.loginForm = this.createLoginForm();
  }

  createLoginForm(): FormGroup {
    return this.fb.group(
      {
        username: [null, Validators.compose([Validators.required])],
        password: [null, Validators.compose([Validators.required])],
       // recaptcha: ['', Validators.required]
      }
    );
  }

  login() {
    this.loading = true;
    if (this.loginForm.valid) {
      const values = this.loginForm.value;
      this.authenticationService.login(values.username, values.password)
        .then(
          res => {
            localStorage.setItem(LOCAL_STORAGE.TOKEN, res.token);
            const user: UserModel = res.user;
            this.userService.setUser(user);
            this.idleService.startWatching();
            const expiresIn = this.getExpiresIn(user);
            if (expiresIn > 0 && expiresIn < 8) {
              const message = this.translate.instant('User.Subscription.Warning.Expiring', {'days': expiresIn});
              this.notificationService.info(message, true);
            } else if (res.lastLogin != null) {
              const message = this.translate.instant('Auth.Login.LastLogin', {'date': this.getDate(res.lastLogin)});
              this.notificationService.info(message, true);
            }
            this.loginService.initializeDetails().then(() => {
              this.eventsService.dispatchEvent(EVENTS.Login);
              this.router.navigate([this.returnUrl]);
            });
          },
          error => {
            const message = error.error;
            let translatedMessage: string;
            if (typeof message !== 'string') {
              translatedMessage = this.translate.instant('Error.Unknown');
            } else if (message === 'Invalid Username or Password') {
              translatedMessage = this.translate.instant('Auth.Password.Error.Invalid');
            } else if (message === 'Account locked') {
              translatedMessage = this.translate.instant('Auth.Password.Error.Locked');
            } else if (message === 'Email not validated') {
              translatedMessage = this.translate.instant('Auth.Password.Error.EmailNotVerified');
            } else {
              translatedMessage = message;
            }
            this.notificationService.error(translatedMessage, true);
            this.loading = false;
          });
    } else {
      this.loading = false;
    }
  }

  private getExpiresIn(user: UserModel): number {
    if (user.userSubscription.type === UserSubscriptionType.LIFETIME || user.userSubscription.expiration == null) {
      return -1;
    }
    const subscriptionExpirationDate = new Date(user.userSubscription.expiration);
    const now = new Date();
    const diff = subscriptionExpirationDate.getTime() - now.getTime();
    let days = diff / (1000 * 3600 * 24);
    if (days < 0) {
      days = 0;
    }
    return Math.floor(days);
  }

  getDate(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = '0' + date.getMinutes();
    const seconds = '0' + date.getSeconds();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return (month + 1) + '/' + day + '/' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  }
}
