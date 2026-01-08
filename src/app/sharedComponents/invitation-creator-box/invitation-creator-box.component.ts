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
import { RightNavContentType } from '../../enums/shared.enums';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GoogleMapsDialogComponent } from '../../features/google/google-maps-dialog/google-maps-dialog.component';


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
  invitationIsForTeam:boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private sharedService: SharedService,
    private sideNavService: SideNavsService,
    private invitationService: InvitationsService,
    private snackBarService: SnackbarService,
    private router: Router,
    private dialog:MatDialog
  ) {
    this.checkIfTeamRoute();
    this.sharedService.rightSideNavChosenSchedulHelper$
      .pipe(takeUntil(this.destroy$))
      .subscribe(newItems => {
        this.invitationForMe = this.sharedService.invitationForMe;

        if (!newItems.invitations || newItems.invitations.length === 0) {
          this.selectedSchedule = [];
          return;
        }

        const oldItems = this.selectedSchedule || [];

        this.selectedSchedule = newItems.invitations.map((newItem: any) => {
          const oldItem = oldItems.find(
            i => i.day === newItem.day && i.date === newItem.date
          );

          return {
            ...newItem,
            isChecked: oldItem?.isChecked ?? false
          };
        });
      });

  }

  openMapsDialog() {
    const dialogRef = this.dialog.open(GoogleMapsDialogComponent, {
      width: '800px',
      data: {
        testData:'Hey test data'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', result);
    });
  }

  private checkIfTeamRoute(): void {
    const urlSegments = this.router.url.split('/').filter(Boolean);
    const isTeamRoute = urlSegments.includes('team');

    console.log('Is team route:', isTeamRoute);

    if (isTeamRoute) {
      this.invitationIsForTeam = true;
    }
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
    if(value == 'map') {
      this.openMapsDialog()
    } else {
      this.selectedSchedule[index].location = value;
    }
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

      startHour: Number(item.start?.split(':')[0] ?? 0),
      endHour: Number(item.end?.split(':')[0] ?? 0),
      startMinute: Number(item.start?.split(':')[1] ?? 0),
      endMinute: Number(item.end?.split(':')[1] ?? 0),

      description: "test desc",
      urgent: item.urgent,
      weekday: item.day,
      invitee: this.invitationService.ContactAsInviteeId,
      location: item.location,
      date: item.date
    }));

    if(!this.invitationIsForTeam) {
      this.invitationService.sendInvitation(data).subscribe(item => {
        if (item.statusCode == 200) {
          this.selectedSchedule = [];
          this.invitationService.updateSentInvitations()
          this.sharedService.setRightSideNavContent({invitations:[],forMe:this.invitationForMe},RightNavContentType.INVITATIONS)
          this.snackBarService.success('Invitation sent')
        }
      });
    } else {
      this.invitationService.sendTeamInvitation(data).subscribe(item => {
        if (item.statusCode == 200) {
          this.selectedSchedule = [];
          this.invitationService.updateSentInvitations()
          this.sharedService.setRightSideNavContent({invitations:[],forMe:this.invitationForMe},RightNavContentType.INVITATIONS)
          this.snackBarService.success('Invitation sent')
        }
      });
    }

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
      startHour: parseInt(item.start?.split(':')[0] || '0', 10),
      endHour: parseInt(item.end?.split(':')[0] || '0', 10),
      startMinute: parseInt(item.start?.split(':')[1] || '0', 10),
      endMinute: parseInt(item.end?.split(':')[1] || '0', 10),
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
        this.sharedService.setRightSideNavContent({invitations:[],forMe:this.invitationForMe},RightNavContentType.INVITATIONS)
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

