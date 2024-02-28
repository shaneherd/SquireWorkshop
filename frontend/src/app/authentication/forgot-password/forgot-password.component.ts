import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {NotificationService} from '../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public forgotPasswordForm: FormGroup;
  loading = false;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.forgotPasswordForm = this.createForgotPasswordForm();
  }

  createForgotPasswordForm(): FormGroup {
    return this.fb.group(
      {
        email: [null, Validators.compose([Validators.required])],
        recaptcha: ['', Validators.required]
      }
    );
  }

  submit() {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      const values = this.forgotPasswordForm.value;
      this.authenticationService.forgotPassword(values.email)
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
