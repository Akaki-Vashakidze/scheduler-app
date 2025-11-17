import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InvitationsService } from '../../services/invitations.service';
import { Invitation } from '../../../../interfaces/shared.interface';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-my-invitations',
  imports: [CommonModule, TranslateModule, MatTabsModule],
  templateUrl: './my-invitations.component.html',
  styleUrl: './my-invitations.component.scss'
})
export class MyInvitationsComponent {
  invitations!: Invitation[];
  constructor(private invitationService: InvitationsService) {
    this.getInvitations(0)
  }

  getInvitations(approved: number | null) {
    this.invitationService.GetInvitations(null, null, approved, null, null, null, null).subscribe(result => {
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
    console.log('Tab switched to index:', event.index);
    switch (event.index) {
      case 0:
        this.getInvitations(0); 
        break;
      case 1:
        this.getInvitations(1); 
        break;
      case 2:
        this.getInvitations(-1);
        break;
      default:
        this.getInvitations(null);
    }
  }
}
