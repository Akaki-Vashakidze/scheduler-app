import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { SignupComponent } from './features/auth/components/signup/signup.component';
import { PassRecoveryComponent } from './features/auth/components/pass-recovery/pass-recovery.component';
import { ForgetPassComponent } from './features/auth/components/forget-pass/forget-pass.component';
import { DashboardComponent } from './features/schedule/dashboard/dashboard.component';
import { AccountInfoComponent } from './features/account/account-info/account-info.component';
import { AuthGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent },
  { path: 'password-recovery', component: PassRecoveryComponent, canActivate: [AuthGuard] },
  { path: 'reset-password', component: ForgetPassComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountInfoComponent, canActivate: [AuthGuard] },
];