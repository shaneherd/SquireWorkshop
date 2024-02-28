import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {HeaderComponent} from './header.component';
import {UserSettingsComponent} from './user-settings/user-settings.component';
import {routing} from './header.router';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule, MatFormFieldModule, MatProgressBarModule, MatSelectModule, MatSnackBarModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {NgxLocalizedNumbers} from 'ngx-localized-numbers';
import {SharedModule} from '../../shared/shared.module';
import {ShowHidePasswordModule} from 'ngx-show-hide-password';
import {ChangeEmailComponent} from './change-email/change-email.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    routing,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatCardModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    TranslateModule,
    NgxLocalizedNumbers,
    ReactiveFormsModule,
    SharedModule,
    ShowHidePasswordModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule
  ],
  declarations: [
    ChangePasswordComponent,
    HeaderComponent,
    UserSettingsComponent,
    ChangeEmailComponent
  ],
  exports: [
    HeaderComponent,
    ChangePasswordComponent,
    UserSettingsComponent,
    ChangeEmailComponent
  ],
  providers: []
})
export class HeaderModule {
}
