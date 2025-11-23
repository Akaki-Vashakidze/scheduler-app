import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserService } from '../../features/auth/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../features/auth/services/users.service';
import { User } from '../../interfaces/shared.interface';
import { MatIconModule } from '@angular/material/icon';
import { SharedService } from '../../features/auth/services/shared.service';
import { SnackbarService } from '../../features/auth/services/snack-bar.service';
import { SideNavsService } from '../../features/auth/services/side-navs.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatButtonModule, TranslateModule, MatIconModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  lang: string = 'en'
  user!: any;
  usersSearch: string = '';
  searchTimeout: any;
  users: User[] | null = null;
  private destroy$ = new Subject<void>();

  constructor(private router: Router, private snackbarService:SnackbarService, private sharedService: SharedService, private sideNavsService:SideNavsService ,private userService: UserService, private usersService: UsersService, private translateService: TranslateService) {
    try {
      const storedUser = localStorage.getItem('schedule_user');
      this.user = storedUser ? JSON.parse(storedUser) : null;
      console.log(this.user);
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      this.user = null;
    }

    this.userService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(item => {
        this.user = item;
      });
  }

  onUsersSearchChange(event: any) {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.usersService.getUsers(this.usersSearch).subscribe(users => {
        console.log('Users:', users.result.data);
        this.users = users.result.data;
      });
    }, 500);
  }

  createContactRequest(user: User) {
    this.usersService.createContactRequest(user._id).subscribe(response => {
      if(response.statusCode == 400) {
        this.snackbarService.error(response.errors ?? 'Error')
      } else if(response.statusCode == 200) {
        this.usersService.sentContactRequestsUpdates()
        this.snackbarService.success('Contact resuest sent')
      }
    });
  }

  clearUsersSearch(){
    this.usersSearch = '';
    this.onUsersSearchChange('')
  }

  changeLang(event: any) {
    let lang = event.target.value
    this.translateService.use(lang);
  }

  openCloseSideNav() {
    this.sideNavsService.leftSideNavOpen == true ? this.sideNavsService.closeLeftSideNav() : this.sideNavsService.openLeftSideNav();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleRightNav(){
    this.sideNavsService.rightSideNavOpen == true ? this.sideNavsService.closeRightSideNav() : this.sideNavsService.openRightSideNav();
  }
}
