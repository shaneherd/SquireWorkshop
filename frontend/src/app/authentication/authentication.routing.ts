import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {RegisterComponent} from './register/register.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {LogoutComponent} from './logout/logout.component';
import {LoginComponent} from './login/login.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {AdminLoginComponent} from './admin-login/admin-login.component';
import {RegistrationSuccessComponent} from './registration-success/registration-success.component';
import {UnlockAccountComponent} from './unlock-account/unlock-account.component';
import {ForgotUsernameComponent} from './forgot-username/forgot-username.component';
import {HomeComponent} from './home/home.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'adminLogin', component: AdminLoginComponent},
  {path: 'forgotPassword', component: ForgotPasswordComponent},
  {path: 'forgotUsername', component: ForgotUsernameComponent},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'register/:token', component: RegisterComponent},
  {path: 'registrationSuccess', component: RegistrationSuccessComponent},
  {path: 'resetPassword', component: ResetPasswordComponent},
  {path: 'unlockAccount', component: UnlockAccountComponent}
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
