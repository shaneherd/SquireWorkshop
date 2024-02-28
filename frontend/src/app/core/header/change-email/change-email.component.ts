import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NotificationService} from '../../services/notification.service';
import {UserService} from '../../services/user.service';
import {TranslateService} from '@ngx-translate/core';
import {UserModel} from '../../../shared/models/user.model';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {
  public formChangeEmail: FormGroup;
  loading = false;

  constructor(private router: Router,
              private notificationService: NotificationService,
              private userService: UserService,
              private translate: TranslateService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.formChangeEmail = this.createChangeEmailForm();
  }

  createChangeEmailForm(): FormGroup {
    return this.fb.group(
      {
        password: [null, Validators.compose([Validators.required])],
        email: [null, Validators.compose([Validators.email, Validators.required])]
      }
    );
  }

  changeEmail() {
    const values = this.formChangeEmail.value;
    this.loading = true;
    if (this.formChangeEmail.valid) {
      const user: UserModel = this.userService.getUser();
      this.userService.changeEmail(user.id, values.password, values.email)
        .then(data => {
          const message = this.translate.instant('Auth.ChangeEmailSuccess');
          this.notificationService.success(message);
          this.router.navigate(['/']);
        }, error => {
          const message = error.error;
          let translatedMessage: string;
          if (typeof message !== 'string') {
            translatedMessage = this.translate.instant('Error.Unknown');
          } else if (message === 'Not allowed to update the specified user') {
            translatedMessage = this.translate.instant('Auth.Error.NotAllowedToUpdateUser');
          } else if (message === 'Invalid user') {
            translatedMessage = this.translate.instant('Auth.Error.InvalidUser');
          } else {
            translatedMessage = message;
          }
          this.notificationService.error(translatedMessage);
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

}
