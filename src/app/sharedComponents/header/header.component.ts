import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { UserService } from '../../features/auth/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../features/auth/services/users.service';
import { User } from '../../interfaces/shared.interface';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatButtonModule, TranslateModule, MatIconModule,RouterModule, FormsModule],
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

  constructor(private userService: UserService, private usersService: UsersService, private _router: Router, private cdr: ChangeDetectorRef, private translateService: TranslateService, private authService: AuthService) {
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

  addContact(user: User) {
    console.log('Add contact:', user);
    
  }

  changeLang(event: any) {
    let lang = event.target.value
    this.translateService.use(lang);
  }

  logOut() {
    this.authService.logOut().subscribe((item: any) => {
      if (item.result && item.result.data) {
        this.user = null;
        localStorage.removeItem('schedule_user')
        localStorage.removeItem('schedule_token')
        this._router.navigate(['/login'])
        this.cdr.detectChanges();
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
