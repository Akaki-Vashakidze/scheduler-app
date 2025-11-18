import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../features/auth/services/auth.service';
import { UserService } from '../../features/auth/services/user.service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SentContactRequestsComponent } from "../sentt-contact-requests/sent-contact-requests.component";
import { RecievedContactRequestsComponent } from "../recieved-contact-requests/recieved-contact-requests.component";

@Component({
  selector: 'app-left-side-nav',
  imports: [TranslateModule, RouterLink, CommonModule, RecievedContactRequestsComponent, SentContactRequestsComponent, RecievedContactRequestsComponent],
  templateUrl: './left-side-nav.component.html',
  styleUrls: ['./left-side-nav.component.scss']
})
export class LeftSideNavComponent implements OnDestroy {
  user!: any;
  private destroy$ = new Subject<void>();
  constructor(private authService: AuthService, private _router: Router, private userService: UserService, private cdr: ChangeDetectorRef) {
    this.userService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(item => {
        this.user = item;
      });
  }
  logOut() {
    this.authService.logOut().subscribe((item: any) => {
      if (item.result && item.result.data) {  
        this.userService.setUser(null)
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
