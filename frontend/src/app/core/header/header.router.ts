import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

export const routes: Routes = [
  // {path: 'changePassword', component: ChangePasswordComponent, canActivate: [AuthGuard]},
  // {path: 'changeEmail', component: ChangeEmailComponent, canActivate: [AuthGuard]},
  // {path: 'userSettings', component: UserSettingsComponent, canActivate: [AuthGuard]}
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
