import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {UserModel} from '../../../shared/models/user.model';
import {NotificationService} from '../../services/notification.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../../../authentication/custom-validators';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public formChangePassword: FormGroup;
  loading = false;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private userService: UserService,
    private translate: TranslateService,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.formChangePassword = this.createChangePasswordForm();
  }

  createChangePasswordForm(): FormGroup {
    return this.fb.group(
      {
        originalPassword: [
          null,
          Validators.compose([Validators.required])
        ],
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
        confirmPassword: [null, Validators.compose([Validators.required])]
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }

  changePassword() {
    const values = this.formChangePassword.value;
    this.loading = true;
    if (this.formChangePassword.valid) {
      const user: UserModel = this.userService.getUser();
      this.userService.changePassword(user.id, user.username, values.originalPassword, values.password)
        .then(
          data => {
            this.notificationService.success(this.translate.instant('Auth.Password.ChangeSuccess'));
            this.router.navigate(['/']);
          },
          error => {
            const message = error.error;
            let translatedMessage: string;
            if (typeof message !== 'string') {
              translatedMessage = this.translate.instant('Error.Unknown');
            } else if (message === 'Not allowed to update the specified user') {
              translatedMessage = this.translate.instant('Auth.Error.NotAllowedToUpdateUser');
            } else if (message === 'Invalid Password') {
              translatedMessage = this.translate.instant('Auth.Password.Error.InvalidPassword');
            } else if (message === 'Must be at least 8 characters') {
              translatedMessage = this.translate.instant('Auth.Password.Requirements.Length');
            } else if (message === 'Must be at most 20 characters') {
              translatedMessage = this.translate.instant('Auth.Password.Requirements.MaxLength');
            } else if (message === 'Must contain at least 1 special character') {
              translatedMessage = this.translate.instant('Auth.Password.Requirements.Special');
            } else if (message === 'Must contain at least 1 in capital case') {
              translatedMessage = this.translate.instant('Auth.Password.Requirements.Capital');
            } else if (message === 'Must contain at least 1 in lower case') {
              translatedMessage = this.translate.instant('Auth.Password.Requirements.Lower');
            } else if (message === 'Must contain at least 1 number') {
              translatedMessage = this.translate.instant('Auth.Password.Requirements.Number');
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
