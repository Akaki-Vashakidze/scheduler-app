import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from "@angular/router";
import { AuthService } from '../../features/auth/services/auth.service';
import { UserService } from '../../features/auth/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { MatIcon } from "@angular/material/icon";
import { SideNavsService } from '../../features/auth/services/side-navs.service';
import { SharedService } from '../../features/auth/services/shared.service';
import { SelectedSchedule } from '../../interfaces/shared.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-right-side-nav',
  imports: [TranslateModule, CommonModule, MatIcon],
  templateUrl: './right-side-nav.component.html',
  styleUrls: ['./right-side-nav.component.scss']
})
export class RightSideNavComponent implements OnDestroy {
  user!: any;
  selectedSchedule!:SelectedSchedule[];
  private destroy$ = new Subject<void>();
  constructor(private authService: AuthService, private sharedService:SharedService,private sideNavService: SideNavsService ,private _router: Router, private userService: UserService, private cdr: ChangeDetectorRef) {
    this.userService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(item => {
        this.user = item;
      });

      this.sharedService.rightSideNavChosenSchedulHelper$
      .pipe(takeUntil(this.destroy$))
      .subscribe(item => {
        this.selectedSchedule = item;
        console.log(this.selectedSchedule)
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

  closeRightNav(){
    this.sideNavService.closeRightSideNav()
  }
}
