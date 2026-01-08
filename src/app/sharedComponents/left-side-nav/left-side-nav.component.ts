import {
  ChangeDetectorRef,
  Component,
  OnDestroy
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../features/auth/services/auth.service';
import { UserService } from '../../features/auth/services/user.service';

import { SentContactRequestsComponent } from '../sentt-contact-requests/sent-contact-requests.component';
import { RecievedContactRequestsComponent } from '../recieved-contact-requests/recieved-contact-requests.component';
import { MyContactsListComponent } from '../my-contacts-list/my-contacts-list.component';
import { MyTeamsSideNavComponent } from '../my-teams-side-nav/my-teams-side-nav.component';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  action?: () => void;
}

@Component({
  selector: 'app-left-side-nav',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
    RouterModule,
    SentContactRequestsComponent,
    RecievedContactRequestsComponent,
    MyContactsListComponent,
    MyTeamsSideNavComponent
  ],
  templateUrl: './left-side-nav.component.html',
  styleUrls: ['./left-side-nav.component.scss']
})
export class LeftSideNavComponent implements OnDestroy {

  user: any = null;

  private destroy$ = new Subject<void>();

  navItems: NavItem[] = [
    {
      label: 'my_schedule',
      icon: 'event',
      route: '/mySchedule'
    },
    {
      label: 'invitations',
      icon: 'mail',
      route: '/invitations'
    },
    {
      label: 'teams',
      icon: 'groups',
      route: '/teams'
    },
    {
      label: 'Account',
      icon: 'person',
      route: '/account'
    },
    {
      label: 'Log out',
      icon: 'logout',
      action: () => this.logOut()
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    // Listen to user changes
    this.userService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.user = user;
        this.cdr.markForCheck();
      });
  }

  getLastRouteSegment(): string {
    const segments = this.router.url.split('/').filter(Boolean);
    return segments.length ? segments[segments.length - 1] : '';
  }

  logOut(): void {
    this.authService.logOut()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res?.result?.data) {
          this.userService.setUser(null);
          localStorage.removeItem('schedule_user');
          localStorage.removeItem('schedule_token');
          this.router.navigate(['/login']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
