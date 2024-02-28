import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NotificationService} from '../../core/services/notification.service';
import {AuthenticationService} from '../authentication.service';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-forgot-username',
  templateUrl: './forgot-username.component.html',
  styleUrls: ['./forgot-username.component.scss']
})
export class ForgotUsernameComponent implements OnInit {
  public forgotUsernameForm: FormGroup;
  loading = false;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.forgotUsernameForm = this.createForgotUsernameForm();
  }

  createForgotUsernameForm(): FormGroup {
    return this.fb.group(
      {
        email: [null, Validators.compose([Validators.required])],
        recaptcha: ['', Validators.required]
      }
    );
  }

  submit() {
    if (this.forgotUsernameForm.valid) {
      this.loading = true;
      const values = this.forgotUsernameForm.value;
      this.authenticationService.forgotUsername(values.email)
        .then(
          data => {
            const message = this.translate.instant('Auth.EmailWithDetails');
            this.notificationService.success(message, true);
            this.router.navigate(['/auth/login']);
          },
          error => {
            const message = error.error;
            let translatedMessage: string;
            if (typeof message !== 'string') {
              translatedMessage = this.translate.instant('Error.Unknown');
            } else if (message === 'Invalid email') {
              translatedMessage = this.translate.instant('Auth.Error.InvalidEmail');
            } else {
              translatedMessage = message;
            }
            this.notificationService.error(translatedMessage, true);
            this.loading = false;
          });
    }
  }
}
