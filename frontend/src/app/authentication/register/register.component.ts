import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {NotificationService} from '../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../custom-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public formRegister: FormGroup;
  loading = false;
  questions: any[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.formRegister = this.createRegisterForm();
  }

  createRegisterForm(): FormGroup {
    return this.fb.group(
      {
        username: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(20)
          ])
        ],
        email: [
          null,
          Validators.compose([Validators.email, Validators.required])
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

  register() {
    const values = this.formRegister.value;
    this.loading = true;
    if (this.formRegister.valid) {
      this.authenticationService.register(values)
        .then(
          data => {
            const message = this.translate.instant('Auth.Register.Success');
            this.notificationService.success(message, true);
            this.router.navigate(['/auth/registrationSuccess']);
          },
          error => {
            const message = error.error;
            let translatedMessage: string;
            if (typeof message !== 'string') {
              translatedMessage = this.translate.instant('Error.Unknown');
            } else if (message === 'Must be at least 8 characters') {
              translatedMessage = this.translate.instant('Auth.Password.Requirements.Length');
            } else if (message === 'Must be at most 20 characters') {
              translatedMessage = this.translate.instant('Auth.Password.Requirements.MaxLength');
            } else if (message === 'Must contain at least 1 in capital case') {
              translatedMessage = this.translate.instant('Auth.Password.Requirements.Capital');
            } else if (message === 'Must contain at least 1 in lower case') {
              translatedMessage = this.translate.instant('Auth.Password.Requirements.Lower');
            } else if (message === 'Must contain at least 1 number') {
              translatedMessage = this.translate.instant('Auth.Password.Requirements.Number');
            } else if (message === 'Must be at least 5 characters') {
              translatedMessage = this.translate.instant('Auth.UsernameRequirements.Length');
            } else if (message === 'Failed to create user') {
              translatedMessage = this.translate.instant('Auth.Register.RegistrationError');
            } else if (message === 'Username already in use') {
              translatedMessage = this.translate.instant('Auth.Register.UsernameInUse');
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
