import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorBoxComponent } from '../error-box/error-box.component';
import { Subject, takeUntil } from 'rxjs';
import { SharedService } from '../../features/auth/services/shared.service';
import { SideNavsService } from '../../features/auth/services/side-navs.service';
import { SnackbarService } from '../../features/auth/services/snack-bar.service';
import { InvitationsService } from '../../features/schedule/services/invitations.service';
import { SelectedSchedule } from '../../interfaces/shared.interface';


@Component({
  selector: 'app-invitation-creator-box',
  imports: [TranslateModule, CommonModule, ErrorBoxComponent],
  templateUrl: './invitation-creator-box.component.html',
  styleUrl: './invitation-creator-box.component.scss'
})
export class InvitationCreatorBoxComponent implements OnDestroy {
  selectedSchedule!: SelectedSchedule[];
  errorText: string = '';
  invitationForMe: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private sharedService: SharedService,
    private sideNavService: SideNavsService,
    private invitationService: InvitationsService,
    private snackBarService: SnackbarService
  ) {
    this.sharedService.rightSideNavChosenSchedulHelper$
      .pipe(takeUntil(this.destroy$))
      .subscribe(newItems => {
        const oldItems = this.selectedSchedule || [];
        this.invitationForMe = sharedService.invitationForMe;
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
    this.errorText = '';
    for (let item of this.selectedSchedule) {
      if (!item.title || !item.title.trim()) {
        this.errorText = 'One of the invitations is missing a title!'
        return;
      }

      if (!item.location || !item.location.trim()) {
        this.errorText = 'One of the invitations is missing a location!'
        return;
      }
    }

    const data = this.selectedSchedule.map(item => ({
      isSingleUse: item.isChecked ? 0 : 1,
      title: item.title,
      start: item.start || '',
      end: item.end || '',
      description: "test desc",
      urgent: item.urgent,
      weekday: item.day,
      invitee: this.invitationService.ContactAsInviteeId,
      location: item.location,
      date: item.date
    }));

    this.invitationService.sendInvitation(data).subscribe(item => {
      if (item.statusCode == 200) {
        this.selectedSchedule = [];
        this.invitationService.updateSentInvitations()
        this.sharedService.setRightSideNavContent([], this.invitationForMe)
        this.snackBarService.success('Invitation sent')
      }
    });
  }


  saveSchedule(): void {
    this.errorText = '';
    for (let item of this.selectedSchedule) {
      if (!item.title || !item.title.trim()) {
        this.errorText = 'One of the invitations is missing a title!'
        return;
      }

      if (!item.location || !item.location.trim()) {
        this.errorText = 'One of the invitations is missing a location!'
        return;
      }
    }

    const data = this.selectedSchedule.map(item => ({
      isSingleUse: item.isChecked ? 0 : 1,
      title: item.title,
      start: item.start || '',
      end: item.end || '',
      description: "test desc",
      urgent: item.urgent,
      weekday: item.day,
      invitee: this.invitationService.ContactAsInviteeId,
      location: item.location,
      date: item.date
    }));

    this.invitationService.sendInvitation(data).subscribe(item => {
      if (item.statusCode == 200) {
        this.selectedSchedule = [];
        this.invitationService.updateSentInvitations()
        this.sharedService.setRightSideNavContent([], this.invitationForMe)
        this.snackBarService.success('Schedule saved')
        this.invitationService.updateRecievedInvitations()
      }
    });
  }

  closeRightNav(): void {
    this.sideNavService.closeRightSideNav();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

