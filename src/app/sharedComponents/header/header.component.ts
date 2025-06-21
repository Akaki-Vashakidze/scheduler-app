import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { UserService } from '../../features/auth/services/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatButtonModule, TranslateModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  lang: string = 'en'
  user!: any;
  private destroy$ = new Subject<void>();

  constructor(private userService: UserService, private cdr: ChangeDetectorRef, private translateService: TranslateService, private authService: AuthService) {
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
        this.cdr.detectChanges();
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
