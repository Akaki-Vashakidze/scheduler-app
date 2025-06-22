import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { SignupComponent } from './features/auth/components/signup/signup.component';
import { DashboardComponent } from './features/schedule/dashboard/dashboard.component';
import { AccountInfoComponent } from './features/account/account-info/account-info.component';
import { AuthGuard } from './features/auth/guards/auth.guard';
import { ResetPasswordComponent } from './features/auth/components/reset-password/reset-password.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountInfoComponent, canActivate: [AuthGuard] },
];