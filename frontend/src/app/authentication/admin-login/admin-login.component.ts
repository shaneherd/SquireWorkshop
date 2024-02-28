import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {NotificationService} from '../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IdleService} from '../../core/services/idle.service';
import {EventsService} from '../../core/services/events.service';
import {EVENTS, LOCAL_STORAGE} from '../../constants';
import {LoginService} from '../../core/services/login.service';
import {UserService} from '../../core/services/user.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  public adminLoginForm: FormGroup;
  loading = false;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private idleService: IdleService,
    private eventsService: EventsService,
    private loginService: LoginService,
    private userService: UserService,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home/dashboard';
    this.adminLoginForm = this.createAdminLoginForm();
  }

  createAdminLoginForm(): FormGroup {
    return this.fb.group(
      {
        adminUsername: [null, Validators.compose([Validators.required])],
        adminPassword: [null, Validators.compose([Validators.required])],
        username: [null, Validators.compose([Validators.required])],
        recaptcha: ['', Validators.required]
      }
    );
  }

  login() {
    this.loading = true;
    if (this.adminLoginForm.valid) {
      const values = this.adminLoginForm.value;
      this.authenticationService.adminLogin(values.adminUsername, values.adminPassword, values.username)
        .then(
          res => {
            localStorage.setItem(LOCAL_STORAGE.TOKEN, res.token);
            this.userService.setUser(res.user);
            this.idleService.startWatching();
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
            } else if (message === 'User is not an admin') {
              translatedMessage = this.translate.instant('Auth.Password.Error.NotAdmin');
            } else if (message === 'User revoked access') {
              translatedMessage = this.translate.instant('Auth.Password.Error.AdminAccessRevoked');
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
}
