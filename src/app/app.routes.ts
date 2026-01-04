import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { SignupComponent } from './features/auth/components/signup/signup.component';
import { DashboardComponent } from './sharedComponents/dashboard/dashboard.component';
import { AccountInfoComponent } from './features/account/account-info/account-info.component';
import { AuthGuard } from './features/auth/guards/auth.guard';
import { ResetPasswordComponent } from './features/auth/components/reset-password/reset-password.component';
import { ForgetPassComponent } from './features/auth/components/forget-pass/forget-pass.component';
import { MyRecievedInvitationsComponent } from './features/schedule/components/my-invitations/my-recieved-invitations.component';
import { ContactScheduleComponent } from './features/schedule/components/contact-schedule/contact-schedule.component';
import { MyScheduleComponent } from './features/schedule/components/my-schedule/my-schedule.component';
import { TeamsComponent } from './features/team/teams/teams.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountInfoComponent, canActivate: [AuthGuard] },
  { path: 'forgot-pass', component: ForgetPassComponent },
  { path: 'invitations', component: MyRecievedInvitationsComponent , canActivate: [AuthGuard] },
  { path: 'contact/schedule/:id', component: ContactScheduleComponent , canActivate: [AuthGuard] },
  { path: 'mySchedule', component: MyScheduleComponent , canActivate: [AuthGuard] },
];