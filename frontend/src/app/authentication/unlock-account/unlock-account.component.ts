import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../core/services/notification.service';
import {AuthenticationService} from '../authentication.service';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-unlock-account',
  templateUrl: './unlock-account.component.html',
  styleUrls: ['./unlock-account.component.scss']
})
export class UnlockAccountComponent implements OnInit {
  public formUnlockAccount: FormGroup;
  routeParams;
  loading = false;

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
    this.formUnlockAccount = this.createUnlockAccountForm();
  }

  createUnlockAccountForm(): FormGroup {
    return this.fb.group(
      {
        recaptcha: ['', Validators.required]
      }
    );
  }

  unlockAccount(): void {
    this.loading = true;
    const unlockToken = this.routeParams.unlockToken;
    if (this.formUnlockAccount.valid && unlockToken != null && unlockToken !== '') {
      this.authenticationService.unlockAccount(unlockToken)
        .then(
          data => {
            this.notificationService.success(this.translate.instant('Auth.UnlockAccount.SuccessMessage'));
            this.router.navigate(['/auth/login']);
          },
          error => {
            const message = error.error;
            let translatedMessage: string;
            if (typeof message !== 'string') {
              translatedMessage = this.translate.instant('Error.Unknown');
            } else if (message === 'Invalid Token') {
              translatedMessage = this.translate.instant('Auth.Error.InvalidToken');
            } else if (message === 'Failed to find user') {
              translatedMessage = this.translate.instant('Auth.Error.FailedToFindUser');
            } else {
              translatedMessage = message;
            }
            this.notificationService.error(translatedMessage);
            this.loading = false;
          });
    } else {
      if (unlockToken == null || unlockToken === '') {
        const translatedMessage = this.translate.instant('Auth.Error.InvalidToken');
        this.notificationService.error(translatedMessage);
      }
      this.loading = false;
    }
  }
}
