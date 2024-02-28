import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
  {path: '', redirectTo: '/home/dashboard', pathMatch: 'full'},
  {path: 'auth', loadChildren: '../authentication/authentication.module#AuthenticationModule'},
  {path: 'pageNotFound', component: PageNotFoundComponent},
  {path: 'home', loadChildren: '../dashboard/dashboard.module#DashboardModule'},
  {path: 'settings', loadChildren: './header/header.module#HeaderModule'}
];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
