import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../../services/notification.service';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {UserSettingsModel} from '../../../shared/models/user-settings.model';
import {UserModel} from '../../../shared/models/user.model';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {DangerZoneData} from '../../components/danger-zone-confirmation/danger-zone-data';
import {DangerZoneConfirmationComponent} from '../../components/danger-zone-confirmation/danger-zone-confirmation.component';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  userId: number;
  userSettings: UserSettingsModel;
  loading = false;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    const user: UserModel = this.userService.getUser();
    if (user != null) {
      this.userId = user.id;
      this.userSettings = user.userSettings;
    } else {
      this.userId = null;
      this.userSettings = new UserSettingsModel();
    }
  }

  updateSettings(): void {
    this.loading = true;
    this.userService.updateUserSettings(this.userId, this.userSettings)
      .then(
        data => {
          const user: UserModel = this.userService.getUser();
          user.userSettings = this.userSettings;
          this.userService.setUser(user);

          const message = this.translate.instant('UserSettings.Success');
          this.notificationService.success(message);
          this.loading = false;
        },
        error => {
          const message = error.error;
          let translatedMessage: string;
          if (typeof message !== 'string') {
            translatedMessage = this.translate.instant('Error.Unknown');
          } else if (message === 'Not allowed to update the specified user') {
            translatedMessage = this.translate.instant('Auth.Error.NotAllowedToUpdateUser');
          } else {
            translatedMessage = message;
          }
          this.notificationService.error(translatedMessage);
          this.loading = false;
        });
  }

  restoreDefaults(): void {
    const self = this;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const data = new DangerZoneData();
    data.title = this.translate.instant('Auth.AccountManagement.RestoreDefaults');
    data.message = this.translate.instant('Auth.AccountManagement.RestoreDefaultsConfirmationMessage');
    data.confirm = (password: string) => {
      self.loading = true;
      const user: UserModel = this.userService.getUser();
      self.userService.restoreDefaults(user.id, password)
        .then(
          () => {
            self.loading = false;
            const message = self.translate.instant('Auth.AccountManagement.RestoreDefaultsSuccess');
            self.notificationService.success(message);
            self.router.navigate(['/']);
          },
          error => {
            self.loading = false;
            const message = error.error;
            let translatedMessage: string;
            if (typeof message !== 'string') {
              translatedMessage = self.translate.instant('Error.Unknown');
            } else if (message === 'Not allowed to update the specified user') {
              translatedMessage = self.translate.instant('Auth.Error.NotAllowedToUpdateUser');
            } else if (message === 'Password is required') {
              translatedMessage = self.translate.instant('Auth.Password.Error.PasswordRequired');
            } else if (message === 'Invalid user id') {
              translatedMessage = self.translate.instant('Auth.Error.InvalidUser');
            } else if (message === 'Invalid password') {
              translatedMessage = self.translate.instant('Auth.Password.Error.InvalidPassword');
            } else {
              translatedMessage = self.translate.instant('Error.Unknown');
            }
            self.notificationService.error(translatedMessage);
          });
    };
    dialogConfig.data = data;
    this.dialog.open(DangerZoneConfirmationComponent, dialogConfig);
  }

  deleteUser(): void {
    const self = this;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const data = new DangerZoneData();
    data.title = this.translate.instant('Auth.AccountManagement.DeleteAccount');
    data.message = this.translate.instant('Auth.AccountManagement.DeleteAccountConfirmationMessage');
    data.confirm = (password: string) => {
      self.loading = true;
      const user: UserModel = this.userService.getUser();
      self.userService.deleteUser(user.id, password)
        .then(
          () => {
            self.loading = false;
            const message = self.translate.instant('Auth.AccountManagement.DeleteSuccess');
            self.notificationService.success(message);
            self.router.navigate(['/auth']);
          },
          error => {
            self.loading = false;
            const message = error.error;
            let translatedMessage: string;
            if (typeof message !== 'string') {
              translatedMessage = self.translate.instant('Error.Unknown');
            } else if (message === 'Not allowed to update the specified user') {
              translatedMessage = self.translate.instant('Auth.Error.NotAllowedToUpdateUser');
            } else if (message === 'Password is required') {
              translatedMessage = self.translate.instant('Auth.Password.Error.PasswordRequired');
            } else if (message === 'Invalid user id') {
              translatedMessage = self.translate.instant('Auth.Error.InvalidUser');
            } else if (message === 'Invalid password') {
              translatedMessage = self.translate.instant('Auth.Password.Error.InvalidPassword');
            } else {
              translatedMessage = message;
            }
            self.notificationService.error(translatedMessage);
          });
    };
    dialogConfig.data = data;
    dialogConfig.disableClose = true;
    this.dialog.open(DangerZoneConfirmationComponent, dialogConfig);
  }
}
