import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { SignupComponent } from './features/auth/components/signup/signup.component';
import { PassRecoveryComponent } from './features/auth/components/pass-recovery/pass-recovery.component';
import { ForgetPassComponent } from './features/auth/components/forget-pass/forget-pass.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'password-recovery', component: PassRecoveryComponent },
  { path: 'reset-password', component: ForgetPassComponent },

  // Optional: redirect to login for unknown routes
  { path: '**', redirectTo: 'login' }
];