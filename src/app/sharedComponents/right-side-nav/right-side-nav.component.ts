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
  standalone: true,
  imports: [TranslateModule, CommonModule, MatIcon],
  templateUrl: './right-side-nav.component.html',
  styleUrls: ['./right-side-nav.component.scss']
})
export class RightSideNavComponent implements OnDestroy {
  selectedSchedule!: SelectedSchedule[];
  private destroy$ = new Subject<void>();

  constructor(
    private sharedService: SharedService,
    private sideNavService: SideNavsService
  ) {
    this.sharedService.rightSideNavChosenSchedulHelper$
      .pipe(takeUntil(this.destroy$))
      .subscribe(newItems => {
        const oldItems = this.selectedSchedule || [];

        // Merge new items with old ones to preserve isChecked
        this.selectedSchedule = (newItems || []).map((newItem: any) => {
          // Try to find old item by unique property (e.g., day + date)
          const oldItem = oldItems.find(i => i.day === newItem.day && i.date === newItem.date);
          return {
            ...newItem,
            isChecked: oldItem ? oldItem.isChecked : false
          };
        });
      });
  }

  onCheckboxChange(event: Event, index: number): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedSchedule[index] = {
      ...this.selectedSchedule[index],
      isChecked
    };
    console.log(this.selectedSchedule);
  }

onTitleChange(event: Event, index: number): void {
  const value = (event.target as HTMLInputElement).value;
  this.selectedSchedule[index].title = value;
}
onUrgentChange(event: Event, index: number): void {
  const checked = (event.target as HTMLInputElement).checked;
  this.selectedSchedule[index].urgent = checked ? 1 : 0;
}
onLocationChange(event: Event, index: number): void {
  const value = (event.target as HTMLSelectElement).value;
  this.selectedSchedule[index].location = value;
}



  submit(): void {
    const checkedItems = this.selectedSchedule.filter(i => i.isChecked);
    console.log(this.selectedSchedule);
  }

  closeRightNav(): void {
    this.sideNavService.closeRightSideNav();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
