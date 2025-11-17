import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InvitationsService } from '../../services/invitations.service';
import { Invitation } from '../../../../interfaces/shared.interface';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-my-invitations',
  imports: [CommonModule, TranslateModule, MatTabsModule, FormsModule, MatSlideToggleModule],
  templateUrl: './my-invitations.component.html',
  styleUrl: './my-invitations.component.scss'
})
export class MyInvitationsComponent {
  invitations!: Invitation[];
  searchQuery: string | null = null;
  sortByWeekday: string | null = null;
  tabIndex: number = 0;
  isUrgent: number | null = null;
  searchTimeout: any;
  constructor(private invitationService: InvitationsService) {
    this.getInvitations(this.searchQuery, 0,this.sortByWeekday,this.isUrgent)
  }

  getInvitations(searchQuery: string | null, approved: number | null, sortByWeekday: string | null = null, isUrgent: number | null = null) {
    this.invitationService.GetInvitations(searchQuery, null, approved, null, sortByWeekday, null, isUrgent).subscribe(result => {
      console.log('Invitations:', result);
      this.invitations = result.result.data;
    });
  }
  approvedCheck(approved: number) {
    switch (approved) {
      case 0:
        return 'Pending';
      case 1:
        return 'Accepted';
      case -1:
        return 'Declined';
      default:
        return 'Unknown';
    }
  }

  acceptInvitation(invitationId: string) {
    this.invitationService.acceptInvitation(invitationId).subscribe(response => {
      console.log('Accepted invitation response:', response);
      // Optionally update the UI or invitations list here
    });
  }

  declineInvitation(invitationId: string) {
    this.invitationService.declineInvitation(invitationId).subscribe(response => {
      console.log('Declined invitation response:', response);
    });
  }

  onTabSwitched(event: any) {
    this.tabIndex = event.index != 3 ? event.index : null;
    switch (event.index) {
      case 0:
        this.getInvitations(this.searchQuery, 0,this.sortByWeekday, this.isUrgent);
        break;
      case 1:
        this.getInvitations(this.searchQuery, 1,this.sortByWeekday, this.isUrgent);
        break;
      case 2:
        this.getInvitations(this.searchQuery, -1,this.sortByWeekday, this.isUrgent);
        break;
      default:
        this.getInvitations(this.searchQuery, null, this.sortByWeekday, this.isUrgent);
    }
  }

  onInvitationsSearch(event: any) {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      const query = event.target.value;
      this.searchQuery = query === '' ? null : query;
      this.getInvitations(this.searchQuery, this.tabIndex, this.sortByWeekday, this.isUrgent);
    }, 500);
  }

  onInvitationsSortChange(event: any) {
    const sortBy = event.target.value;
    console.log('Sort by:', sortBy);
    this.sortByWeekday = event.target.value === '' ? null : event.target.value;
    this.getInvitations(this.searchQuery, this.tabIndex, this.sortByWeekday,this.isUrgent);
    // Implement sorting logic here based on sortBy value
  } 

  toggleUrgent(event: any) {
    const isChecked = event.checked;
    this.isUrgent = isChecked ? 1 : null;
    this.getInvitations(this.searchQuery, this.tabIndex, this.sortByWeekday, this.isUrgent);
  }
}