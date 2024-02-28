import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {NotificationService} from '../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../custom-validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public formResetPassword: FormGroup;
  routeParams;
  loading = false;
  question: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.routeParams = this.activatedRoute.snapshot.queryParams;
    this.formResetPassword = this.createResetPasswordForm();
  }

  createResetPasswordForm(): FormGroup {
    return this.fb.group(
      {
        password: [
          null,
          Validators.compose([
            Validators.required,
            CustomValidators.patternValidator(/\d/, {
              hasNumber: true
            }),
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true
            }),
            CustomValidators.patternValidator(/[a-z]/, {
              hasSmallCase: true
            }),
            Validators.minLength(8),
            Validators.maxLength(20)
          ])
        ],
        confirmPassword: [null, Validators.compose([Validators.required])],
        recaptcha: ['', Validators.required]
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }

  resetPassword() {
    const values = this.formResetPassword.value;
    this.loading = true;
    const resetToken = this.routeParams.resetToken;
    if (this.formResetPassword.valid && resetToken != null) {
      this.authenticationService.resetPassword(resetToken, values.password)
        .then(
          data => {
            const message = this.translate.instant('Auth.Password.Reset.Success');
            this.notificationService.success(message);
            this.router.navigate(['/auth/login']);
          },
          error => {
            const message = error.error;
            let translatedMessage: string;
            if (typeof message !== 'string') {
              translatedMessage = this.translate.instant('Error.Unknown');
            } else if (message === 'Invalid Token') {
              translatedMessage = this.translate.instant('Auth.Error.InvalidToken');
            } else if (message === 'Token Expired') {
              translatedMessage = this.translate.instant('Auth.Error.TokenExpired');
            } else if (message === 'Failed to find user') {
              translatedMessage = this.translate.instant('Auth.Error.FailedToFindUser');
            } else if (message === 'Account locked') {
              translatedMessage = this.translate.instant('Auth.Password.Error.Locked');
            } else {
              translatedMessage = message;
            }

            this.notificationService.error(translatedMessage);
            this.loading = false;
          });
    } else {
      if (resetToken == null) {
        const translatedMessage = this.translate.instant('Auth.Error.InvalidToken');
        this.notificationService.error(translatedMessage);
      }
      this.loading = false;
    }
  }
}
